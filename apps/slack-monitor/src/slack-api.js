import { cdpCall } from './cdp.js';

export const RATE_LIMIT_DELAY_MS = 200;

/**
 * Call a Slack API method via CDP Runtime.evaluate (runs fetch inside the Slack tab).
 * Handles 429 rate limits with retry.
 */
const MAX_RETRIES = 3;

export async function slackAPI(ws, token, method, params = {}, _retries = 0) {
  const body = new URLSearchParams({ token, ...params }).toString();
  const expr = `
    fetch('https://app.slack.com/api/${method}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ${JSON.stringify(body)},
      credentials: 'include'
    }).then(r => r.json())
  `;

  const result = await cdpCall(ws, 'Runtime.evaluate', {
    expression: expr,
    awaitPromise: true,
    returnByValue: true,
  });

  const value = result.result?.value;
  if (!value) {
    throw new Error(`No response from Slack API: ${method}`);
  }

  // Handle rate limiting with retry cap
  if (value.error === 'ratelimited') {
    if (_retries >= MAX_RETRIES) {
      throw new Error(`Rate limited on ${method} after ${MAX_RETRIES} retries`);
    }
    const waitMs = 5000;
    console.error(`Rate limited on ${method}, waiting ${waitMs}ms (retry ${_retries + 1}/${MAX_RETRIES})...`);
    await sleep(waitMs);
    return slackAPI(ws, token, method, params, _retries + 1);
  }

  return value;
}

/**
 * Paginate a Slack API method that uses cursor-based pagination.
 * Collects all items from the specified response key.
 */
export async function slackAPIPaginate(ws, token, method, params, responseKey) {
  const items = [];
  let cursor;

  do {
    const callParams = { ...params };
    if (cursor) callParams.cursor = cursor;

    await sleep(RATE_LIMIT_DELAY_MS);
    const res = await slackAPI(ws, token, method, callParams);

    if (!res.ok) {
      throw new Error(`Slack API error (${method}): ${res.error}`);
    }

    const page = res[responseKey];
    if (Array.isArray(page)) {
      items.push(...page);
    }

    cursor = res.response_metadata?.next_cursor;
  } while (cursor);

  return items;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
