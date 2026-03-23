import WebSocket from 'ws';

const CDP_HOST = '127.0.0.1';
const CDP_PORT = 18801;
const CDP_TIMEOUT_MS = 15_000;

let msgId = 0;

/**
 * Find the Slack tab's WebSocket debugger URL via CDP /json endpoint.
 */
export async function findSlackTab() {
  const res = await fetch(`http://${CDP_HOST}:${CDP_PORT}/json`);
  const tabs = await res.json();
  const slack = tabs.find((t) => t.url?.includes('app.slack.com'));
  if (!slack) {
    throw new Error(
      'No Slack tab found in Chrome. Make sure app.slack.com is open.',
    );
  }
  return slack.webSocketDebuggerUrl;
}

/**
 * Connect to a CDP target via WebSocket.
 * Returns the ws instance.
 */
export function connectCDP(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.once('open', () => resolve(ws));
    ws.once('error', reject);
  });
}

/**
 * Send a CDP command and wait for its response.
 * Times out after CDP_TIMEOUT_MS.
 */
export function cdpCall(ws, method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`CDP timeout (${CDP_TIMEOUT_MS}ms): ${method}`));
    }, CDP_TIMEOUT_MS);

    function onMessage(raw) {
      const msg = JSON.parse(raw.toString());
      if (msg.id !== id) return;
      cleanup();
      if (msg.error) {
        reject(new Error(`CDP error: ${JSON.stringify(msg.error)}`));
      } else {
        resolve(msg.result);
      }
    }

    function cleanup() {
      clearTimeout(timeout);
      ws.removeListener('message', onMessage);
    }

    ws.on('message', onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

/**
 * Gracefully close the CDP WebSocket.
 */
export function closeCDP(ws) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
}
