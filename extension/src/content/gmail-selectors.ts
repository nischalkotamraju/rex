// Gmail DOM selectors - these are best-effort and may need updates as Gmail evolves.
// We use multiple fallbacks for robustness.

export function getMainContainer(): Element | null {
  return document.querySelector('[role="main"]');
}

export function getInboxEmailList(): Element | null {
  // Gmail's inbox email table container
  const candidates = [
    '.AO .Cp',
    '[role="main"] .Cp',
    '[role="main"] table.F',
    '.BltHke .AO',
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export function getEmailRows(): NodeListOf<Element> | Element[] {
  const rows = document.querySelectorAll('tr.zA');
  if (rows.length > 0) return rows;
  // fallback
  return document.querySelectorAll('[role="main"] tr[jsmodel]');
}

export function getThreadMessageContainer(): Element | null {
  // Expanded message container in thread view
  const candidates = [
    '.adn.ads', // last expanded message
    '.nH .aHU',
    '[role="main"] .g3',
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export function getAllThreadMessages(): NodeListOf<Element> | Element[] {
  // Each message in a thread
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length > 0) return msgs;
  return document.querySelectorAll('[role="listitem"]');
}

export function getLastExpandedMessage(): Element | null {
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length === 0) return null;
  // Return the last one (most recent)
  return msgs[msgs.length - 1];
}

export function getEmailSubject(): string {
  const el = document.querySelector('h2.hP');
  return el?.textContent?.trim() ?? '';
}

export function getSenderName(): string {
  // In thread view, get the sender of the last message
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length === 0) return '';
  const last = msgs[msgs.length - 1];
  const nameEl = last.querySelector('.gD') || last.querySelector('[email]');
  return nameEl?.getAttribute('name') ?? nameEl?.textContent?.trim() ?? '';
}

export function getSenderEmail(): string {
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length === 0) return '';
  const last = msgs[msgs.length - 1];
  const emailEl = last.querySelector('.gD') || last.querySelector('[email]');
  return emailEl?.getAttribute('email') ?? '';
}

export function getEmailBody(): string {
  // Get body of last message in thread
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length === 0) return '';
  const last = msgs[msgs.length - 1];
  const bodyEl = last.querySelector('.a3s') || last.querySelector('.ii.gt div');
  return (bodyEl as HTMLElement | null)?.innerText?.trim() ?? bodyEl?.textContent?.trim() ?? '';
}

export function getEmailDate(): string {
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length === 0) return '';
  const last = msgs[msgs.length - 1];
  const dateEl = last.querySelector('.g3') || last.querySelector('.ads .gH');
  return dateEl?.getAttribute('title') ?? dateEl?.textContent?.trim() ?? '';
}

export function getThreadId(): string {
  // Extract from URL hash — strip query params so ?compose=xyz doesn't create a fake new thread ID
  const hash = window.location.hash;
  const parts = hash.split('/');
  const last = parts[parts.length - 1] ?? '';
  return last.split('?')[0].split('#')[0];
}

export function getCurrentView(): 'inbox' | 'thread' | 'other' {
  const hash = window.location.hash;
  if (!hash || hash === '#inbox' || hash === '#all' || /^#(inbox|sent|drafts|spam|trash|starred|snoozed|important|all|label)$/.test(hash)) {
    return 'inbox';
  }
  if (hash.includes('/')) {
    return 'thread';
  }
  return 'other';
}

export function getComposeReplyArea(): Element | null {
  // Gmail compose/reply area
  const candidates = [
    '.btC .Am',
    '.aoI .Am',
    '[role="textbox"][aria-label*="reply"]',
    '.Am.Al.editable',
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

/**
 * Returns the user's avatar as either a real photo URL or the background-color
 * of their generated initial-circle (e.g. the red "N" Google renders when no
 * photo is set).  Always look only in the header so we never pick up a sender
 * avatar from the email thread.
 */
export function getSenderAvatarSize(): number {
  const msgs = document.querySelectorAll('.adn');
  if (msgs.length === 0) return 40;
  const last = msgs[msgs.length - 1];

  // Walk all elements inside the message looking for the sender's circular avatar
  const els = Array.from(last.querySelectorAll('*')) as HTMLElement[];
  for (const el of els) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w < 20 || w > 56 || Math.abs(w - h) > 4) continue;
    const brPx = parseFloat(window.getComputedStyle(el).borderRadius);
    if (brPx >= w / 2 - 2) return w; // it's a circle of the right size
  }
  return 40;
}

export function getUserAvatarStyle(): { url?: string; bgColor: string } {
  // Specifically target the Google Account button in the top-right — never
  // touch the email thread so we don't pick up the sender's avatar.
  const accountBtn =
    document.querySelector('a[aria-label*="Google Account"]') as HTMLElement | null ||
    document.querySelector('[data-ogsr-up]') as HTMLElement | null ||
    document.querySelector('.gb_d') as HTMLElement | null;

  if (accountBtn) {
    // 1. Real profile photo → look for an img with a googleusercontent URL
    const imgs = accountBtn.querySelectorAll('img');
    for (const img of Array.from(imgs)) {
      const src = (img as HTMLImageElement).src;
      if (src?.includes('googleusercontent.com')) return { url: src, bgColor: '#4285f4' };
    }

    // 2. Generated initial avatar → find the colored background.
    //    getComputedStyle returns border-radius in px (e.g. "16px"), not "50%",
    //    so compare numerically: a circle has border-radius >= half its width.
    const nodes = [accountBtn, ...Array.from(accountBtn.querySelectorAll('*'))] as HTMLElement[];
    for (const el of nodes) {
      const style = window.getComputedStyle(el);
      const bg    = style.backgroundColor;
      const brPx  = parseFloat(style.borderRadius);
      const w     = el.offsetWidth;
      const h     = el.offsetHeight;
      if (
        w >= 20 && w <= 56 && h >= 20 && h <= 56 &&
        brPx >= w / 2 - 1 &&   // truly circular (border-radius ≥ half width)
        bg &&
        bg !== 'rgba(0, 0, 0, 0)' &&
        bg !== 'transparent' &&
        bg !== 'rgb(255, 255, 255)'
      ) {
        return { bgColor: bg };
      }
    }
  }

  return { bgColor: '#4285f4' };
}

export function getCurrentUserEmail(): string {
  // Google account switcher button has aria-label like "Google Account: Name (email@gmail.com)"
  const btn = document.querySelector('a[aria-label*="Google Account"]') as HTMLElement | null;
  if (btn) {
    const label = btn.getAttribute('aria-label') ?? '';
    const match = label.match(/\(([^)]+@[^)]+)\)/);
    if (match?.[1]) return match[1].trim().toLowerCase();
  }
  // Fallback: URL path contains the account index but not email — try meta
  const metaEmail = document.querySelector('meta[name="description"]');
  if (metaEmail) {
    const content = metaEmail.getAttribute('content') ?? '';
    const match = content.match(/[\w.+-]+@[\w.-]+\.\w+/);
    if (match) return match[0].toLowerCase();
  }
  return '';
}

export function getCurrentUserName(): string {
  // Try the "me" label in thread header (e.g. "Nischal Kotamraju")
  const meEl = document.querySelector('.iw span[email]') as HTMLElement | null;
  if (meEl?.getAttribute('name')) return meEl.getAttribute('name')!;
  // Fallback: Google account switcher aria-label ("Google Account: Name (email)")
  const btn = document.querySelector('a[aria-label*="Google Account"]') as HTMLElement | null;
  if (btn) {
    const label = btn.getAttribute('aria-label') ?? '';
    const match = label.match(/Google Account:\s*(.+?)\s*\(/);
    if (match?.[1]) return match[1].trim();
  }
  return '';
}

export function getInboxEmailSnippets(): Array<{
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  threadId: string;
}> {
  const rows = document.querySelectorAll('tr.zA');
  const emails: Array<{
    sender: string;
    senderEmail: string;
    subject: string;
    snippet: string;
    date: string;
    threadId: string;
  }> = [];

  rows.forEach(row => {
    try {
      // Only process unread or read emails (skip ads/promotions markers)
      const senderEl = row.querySelector('.yW .zF') || row.querySelector('.yP') || row.querySelector('.zF');
      const sender = senderEl?.getAttribute('name') ?? senderEl?.textContent?.trim() ?? '';
      const senderEmail = senderEl?.getAttribute('email') ?? '';

      const subjectEl = row.querySelector('.bog .y6 span') || row.querySelector('.y6') || row.querySelector('.bog');
      const subject = subjectEl?.textContent?.trim() ?? '';

      const snippetEl = row.querySelector('.y2');
      const snippet = snippetEl?.textContent?.trim() ?? '';

      const dateEl = row.querySelector('.xW span');
      const date = dateEl?.getAttribute('title') ?? dateEl?.textContent?.trim() ?? '';

      // Thread ID from the row's data attribute or link
      const link = row.querySelector('a[href]') as HTMLAnchorElement | null;
      const href = link?.href ?? '';
      const threadId = href.split('/').pop() ?? row.getAttribute('id') ?? '';

      if (sender || subject) {
        emails.push({ sender, senderEmail, subject, snippet, date, threadId });
      }
    } catch {
      // skip malformed rows
    }
  });

  return emails;
}
