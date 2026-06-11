import type { ChromeMessage, RexSettings } from '../types';

const DEFAULT_SETTINGS: RexSettings = {
  serverUrl: __SERVER_URL__,
  enabled: true,
  showBanner: true,
  showThreadCards: true,
  showDraftSuggestions: true,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ rexSettings: DEFAULT_SETTINGS });
  console.log('[Rex] Extension installed');
});

// ── Internal messages (from content script / popup) ─────────────────────────
chrome.runtime.onMessage.addListener((
  message: ChromeMessage,
  _sender,
  sendResponse
) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get('rexSettings', (result) => {
      sendResponse(result['rexSettings'] ?? DEFAULT_SETTINGS);
    });
    return true;
  }

  if (message.type === 'SAVE_SETTINGS') {
    chrome.storage.sync.set({ rexSettings: message.payload }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === 'REX_REFRESH_TOKEN') {
    chrome.storage.local.get('rexRefreshToken', (result) => {
      const refreshToken = result['rexRefreshToken'] as string | undefined;
      if (!refreshToken) { sendResponse({ ok: false }); return; }

      fetch(`${__SUPABASE_URL__}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': __SUPABASE_ANON_KEY__,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
        .then(r => r.json())
        .then((data: { access_token?: string; refresh_token?: string }) => {
          if (!data.access_token) { sendResponse({ ok: false }); return; }
          const toStore: Record<string, string> = { rexAccessToken: data.access_token };
          if (data.refresh_token) toStore['rexRefreshToken'] = data.refresh_token;
          chrome.storage.local.set(toStore, () => {
            console.log('[Rex] Token refreshed');
            sendResponse({ ok: true, accessToken: data.access_token });
          });
        })
        .catch(() => sendResponse({ ok: false }));
    });
    return true;
  }
});

// ── External messages (from getrex.ai after OAuth) ───────────────────────────
chrome.runtime.onMessageExternal.addListener((
  message: { type: string; accessToken?: string; refreshToken?: string; email?: string },
  _sender,
  sendResponse
) => {
  if (message.type === 'REX_AUTH_TOKEN' && message.accessToken) {
    const toStore: Record<string, string> = {
      rexAccessToken: message.accessToken,
      rexRefreshToken: message.refreshToken ?? '',
    };
    if (message.email) toStore['rexUserEmail'] = message.email;
    chrome.storage.local.set(toStore, () => {
      console.log('[Rex] Auth tokens stored');
      sendResponse({ ok: true });
    });
    return true;
  }
});

// ── Sign-in helper ───────────────────────────────────────────────────────────
// Called when popup sign-in button is clicked — opens Rex website login
export function openSignIn() {
  const loginUrl = `${__WEBSITE_URL__}/login?source=extension`;
  chrome.tabs.create({ url: loginUrl });
}
