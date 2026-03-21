import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { findSlackTab, connectCDP, closeCDP } from './cdp.js';
import { slackAPI, slackAPIPaginate, sleep, RATE_LIMIT_DELAY_MS } from './slack-api.js';
import { readJSON, writeJSON } from './data.js';

const ROB_USER_ID = 'U08AA03B0TV';

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

async function loadToken() {
  const credPath = join(homedir(), '.openclaw', 'credentials', 'slack-later.json');
  try {
    const raw = await readFile(credPath, 'utf-8');
    const { token } = JSON.parse(raw);
    if (!token) throw new Error('No .token field');
    return token;
  } catch (e) {
    throw new Error(`Failed to load Slack token from ${credPath}: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// CDP setup helper
// ---------------------------------------------------------------------------

async function setup() {
  const token = await loadToken();
  const wsUrl = await findSlackTab();
  const ws = await connectCDP(wsUrl);
  return { ws, token };
}

// ---------------------------------------------------------------------------
// --check: auth test
// ---------------------------------------------------------------------------

async function cmdCheck() {
  const { ws, token } = await setup();
  try {
    const res = await slackAPI(ws, token, 'auth.test');
    console.log(JSON.stringify(res, null, 2));
    if (!res.ok) {
      console.error('Auth failed. Re-login to Slack in Chrome.');
      process.exit(1);
    }
  } finally {
    closeCDP(ws);
  }
}

// ---------------------------------------------------------------------------
// --sync-users: fetch all workspace users
// ---------------------------------------------------------------------------

async function cmdSyncUsers() {
  const { ws, token } = await setup();
  try {
    console.error('Fetching all workspace users...');
    const members = await slackAPIPaginate(ws, token, 'users.list', {}, 'members');

    const usersMap = {};
    for (const m of members) {
      usersMap[m.id] = {
        name: m.name,
        real_name: m.real_name || m.name,
        display_name: m.profile?.display_name || m.real_name || m.name,
      };
    }

    await writeJSON('users.json', usersMap);
    console.error(`Saved ${Object.keys(usersMap).length} users to data/users.json`);
  } finally {
    closeCDP(ws);
  }
}

// ---------------------------------------------------------------------------
// --poll: main monitoring run
// ---------------------------------------------------------------------------

async function cmdPoll() {
  const { ws, token } = await setup();
  try {
    // Load users map for name resolution
    const usersMap = await readJSON('users.json', {});

    // Load last-seen timestamps (default: 1 hour ago)
    const oneHourAgo = String((Date.now() / 1000 - 3600).toFixed(6));
    const lastSeen = await readJSON('last-seen.json', {});

    // Fetch all channels Rob is in
    console.error('Fetching channels...');
    const channels = await slackAPIPaginate(
      ws,
      token,
      'users.conversations',
      {
        user: ROB_USER_ID,
        types: 'public_channel,private_channel,mpim,im',
        limit: '200',
      },
      'channels',
    );
    console.error(`Found ${channels.length} channels`);

    const items = [];

    for (const ch of channels) {
      const oldest = lastSeen[ch.id] || oneHourAgo;

      await sleep(RATE_LIMIT_DELAY_MS);
      const res = await slackAPI(ws, token, 'conversations.history', {
        channel: ch.id,
        oldest,
        limit: '100',
      });

      if (res.has_more) {
        const chName = resolveChannelName(ch, usersMap);
        console.error(`Warning: #${chName} has more messages than limit, some may be missed`);
      }

      if (!res.ok) {
        // Some channels may not be accessible; skip silently
        if (res.error === 'channel_not_found' || res.error === 'not_in_channel') {
          continue;
        }
        console.error(`Error fetching ${ch.id}: ${res.error}`);
        continue;
      }

      const messages = res.messages || [];
      if (messages.length === 0) continue;

      // Update last-seen to the newest message timestamp
      const newestTs = messages.reduce(
        (max, m) => (m.ts > max ? m.ts : max),
        oldest,
      );
      lastSeen[ch.id] = newestTs;

      for (const msg of messages) {
        // Skip Rob's own messages
        if (msg.user === ROB_USER_ID) continue;
        // Skip bot messages with no user
        if (!msg.user) continue;

        const type = categorizeMessage(ch, msg);
        const channelName = resolveChannelName(ch, usersMap);
        const userName = resolveUserName(msg.user, usersMap);

        items.push({
          type,
          channel_id: ch.id,
          channel_name: channelName,
          user_id: msg.user,
          user_name: userName,
          text: (msg.text || '').slice(0, 500),
          ts: msg.ts,
          ...(msg.thread_ts && { thread_ts: msg.thread_ts }),
        });
      }
    }

    // Save updated last-seen
    await writeJSON('last-seen.json', lastSeen);

    // Build output
    const summary = {
      total: items.length,
      dms: items.filter((i) => i.type === 'dm').length,
      mentions: items.filter((i) => i.type === 'mention').length,
      thread_replies: items.filter((i) => i.type === 'thread_reply').length,
      channels: items.filter((i) => i.type === 'channel').length,
    };

    const output = {
      timestamp: new Date().toISOString(),
      items,
      summary,
    };

    console.log(JSON.stringify(output, null, 2));
    console.error(`Done: ${summary.total} new messages`);
  } finally {
    closeCDP(ws);
  }
}

function categorizeMessage(channel, msg) {
  // DM or group DM
  if (channel.is_im || channel.is_mpim) return 'dm';

  // Direct mention (in any context)
  if (msg.text?.includes(`<@${ROB_USER_ID}>`)) return 'mention';

  // Thread reply — only flag if it's a thread (not the parent message)
  // Note: this catches all thread replies in channels Rob is in.
  // Without an extra API call per thread, we can't know if Rob participated.
  // The cron consumer can filter further if needed.
  if (msg.thread_ts && msg.thread_ts !== msg.ts) return 'thread_reply';

  return 'channel';
}

function resolveChannelName(channel, usersMap) {
  if (channel.is_im) {
    // IM: resolve the other user's name
    const otherUser = channel.user;
    return resolveUserName(otherUser, usersMap);
  }
  if (channel.name) return channel.name;
  return channel.id;
}

function resolveUserName(userId, usersMap) {
  const u = usersMap[userId];
  if (u) return u.display_name || u.real_name || u.name;
  return userId;
}

// ---------------------------------------------------------------------------
// --unread: quick unread count
// ---------------------------------------------------------------------------

async function cmdUnread() {
  const { ws, token } = await setup();
  try {
    const usersMap = await readJSON('users.json', {});

    console.error('Fetching channels...');
    const channels = await slackAPIPaginate(
      ws,
      token,
      'users.conversations',
      {
        user: ROB_USER_ID,
        types: 'public_channel,private_channel,mpim,im',
        limit: '200',
      },
      'channels',
    );

    // Use unread counts already present on channel objects from users.conversations
    // Falls back to unread_count if unread_count_display isn't available
    const unreadChannels = [];
    for (const ch of channels) {
      const unread = ch.unread_count_display ?? ch.unread_count ?? 0;
      if (unread > 0) {
        const name = resolveChannelName(ch, usersMap);
        unreadChannels.push({ channel_id: ch.id, name, unread });
      }
    }

    unreadChannels.sort((a, b) => b.unread - a.unread);

    const total = unreadChannels.reduce((sum, c) => sum + c.unread, 0);
    console.log(
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          total_unread: total,
          channels: unreadChannels,
        },
        null,
        2,
      ),
    );
    console.error(`${total} unread across ${unreadChannels.length} channels`);
  } finally {
    closeCDP(ws);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

try {
  if (args.includes('--check')) {
    await cmdCheck();
  } else if (args.includes('--sync-users')) {
    await cmdSyncUsers();
  } else if (args.includes('--poll')) {
    await cmdPoll();
  } else if (args.includes('--unread')) {
    await cmdUnread();
  } else {
    console.log(`Usage: node src/index.js <mode>

Modes:
  --check        Auth check (call auth.test)
  --sync-users   Fetch all users → data/users.json
  --poll         Poll for new messages (single run)
  --unread       Quick unread counts per channel`);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
