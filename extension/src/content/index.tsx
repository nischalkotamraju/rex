import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CommitmentBanner } from '../components/CommitmentBanner';
import { ThreadCommitmentCard } from '../components/ThreadCommitmentCard';
import { DraftSuggestion } from '../components/DraftSuggestion';
import { InboxLoader } from '../components/InboxLoader';
import { GmailObserver } from './gmail-observer';
import {
  getInboxEmailList,
  getLastExpandedMessage,
  getEmailSubject,
  getSenderName,
  getSenderEmail,
  getEmailBody,
  getEmailDate,
  getThreadId,
  getCurrentView,
  getInboxEmailSnippets,
  getCurrentUserName,
  getCurrentUserEmail,
  getUserAvatarStyle,
  getSenderAvatarSize,
} from './gmail-selectors';
import { REX_STYLES } from '../styles';
import type { Commitment } from '../types';

const REX_BANNER_ID = 'rex-inbox-banner';
const REX_THREAD_ID = 'rex-thread-card';
const REX_DRAFT_ID  = 'rex-draft-suggestion';
const SERVER_URL = __SERVER_URL__;

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expired = (payload.exp * 1000) < (Date.now() + 60_000);
    console.log('[Rex] Token exp:', new Date(payload.exp * 1000).toISOString(), 'expired:', expired);
    return expired;
  } catch {
    return true;
  }
}

async function refreshToken(): Promise<string | null> {
  try {
    const resp = await new Promise<{ ok: boolean; accessToken?: string }>((res) => {
      chrome.runtime.sendMessage({ type: 'REX_REFRESH_TOKEN' }, (r) => {
        if (chrome.runtime.lastError) {
          console.warn('[Rex] Refresh message error:', chrome.runtime.lastError.message);
          res({ ok: false });
        } else {
          res(r ?? { ok: false });
        }
      });
    });
    console.log('[Rex] Refresh result:', resp);
    return resp?.ok && resp.accessToken ? resp.accessToken : null;
  } catch (e) {
    console.warn('[Rex] Refresh failed:', e);
    return null;
  }
}

function getEmailFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.email as string ?? '').toLowerCase();
  } catch {
    return '';
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  return new Promise((resolve) => {
    chrome.storage.local.get('rexAccessToken', async (result) => {
      let token = result['rexAccessToken'] as string | undefined;
      if (!token) { resolve({}); return; }

      if (isTokenExpired(token)) {
        const newToken = await refreshToken();
        if (newToken) {
          token = newToken;
        } else {
          resolve({});
          return;
        }
      }

      resolve({ 'Authorization': `Bearer ${token}` });
    });
  });
}

interface ShadowMount {
  container: HTMLElement;
  shadow: ShadowRoot;
  mountPoint: HTMLElement;
  root: Root;
}

/**
 * Apply bounds aligned to the email content column (.ii.gt) — used for commitment rows.
 */
function applyCardBounds(container: HTMLElement, msgEl: HTMLElement) {
  const parentEl = container.parentElement as HTMLElement | null;
  if (!parentEl) return;

  // Prefer the email body/content column for alignment — it's indented past the sender avatar.
  // .ii.gt is Gmail's main message content wrapper; .a3s is the text body.
  const contentEl =
    (msgEl.querySelector('.ii.gt') as HTMLElement | null) ||
    (msgEl.querySelector('.a3s') as HTMLElement | null) ||
    msgEl;

  const contentRect = contentEl.getBoundingClientRect();
  const parentRect  = parentEl.getBoundingClientRect();

  // Left position of the content column relative to the card's parent
  const cardLeft  = Math.max(0, contentRect.left - parentRect.left);
  // Match the content column's width
  const cardWidth = Math.max(100, contentRect.width);

  container.setAttribute(
    'style',
    `display:block!important;width:${cardWidth}px!important;margin-left:${cardLeft}px!important;float:none!important;clear:both!important;position:static!important;padding:0!important;`
  );
}

/**
 * Apply bounds for the draft panel — aligned to .adn's full left edge so the
 * avatar can sit in the same column as the email sender's avatar above.
 * Returns the gutter width (px from .adn left → content column left) so the
 * component can size the avatar container to match.
 */
function applyDraftBounds(container: HTMLElement, msgEl: HTMLElement): number {
  const parentEl = container.parentElement as HTMLElement | null;
  if (!parentEl) return 52;

  const msgRect    = msgEl.getBoundingClientRect();
  const parentRect = parentEl.getBoundingClientRect();

  // Position wrapper at .adn's left edge (same column as sender avatar)
  const cardLeft  = Math.max(0, msgRect.left - parentRect.left);
  const cardWidth = Math.max(100, msgRect.width);

  container.setAttribute(
    'style',
    `display:block!important;width:${cardWidth}px!important;margin-left:${cardLeft}px!important;float:none!important;clear:both!important;position:static!important;padding:0!important;`
  );

  // Measure how far the content column is from .adn's left — this is how wide
  // the avatar gutter should be so the panel aligns with the commitment rows.
  const contentEl = (msgEl.querySelector('.ii.gt') as HTMLElement | null) ||
                    (msgEl.querySelector('.a3s')    as HTMLElement | null);
  if (contentEl) {
    return Math.max(36, contentEl.getBoundingClientRect().left - msgRect.left);
  }
  return 52;
}

function createShadowMount(id: string): ShadowMount {
  const container = document.createElement('div');
  container.id = id;
  // Force block layout — Gmail's flex containers would otherwise squish this
  container.setAttribute('style', 'display:block!important;width:100%!important;float:none!important;clear:both!important;position:static!important;margin:0!important;padding:0!important;border-radius:0!important;border:none!important;box-shadow:none!important;');

  const shadow = container.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = REX_STYLES;
  shadow.appendChild(styleEl);

  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  const root = createRoot(mountPoint);
  return { container, shadow, mountPoint, root };
}

export interface RexController {
  onViewChange(hash: string): void;
  onDomUpdate(): void;
}

class Rex implements RexController {
  private observer: GmailObserver;
  private bannerMount: ShadowMount | null = null;
  private threadMount: ShadowMount | null = null;
  private draftMount: ShadowMount | null = null;
  private currentView: 'inbox' | 'thread' | 'other' = 'other';
  private currentThreadId: string = '';
  // Threads currently being analyzed (prevents concurrent duplicate fetches)
  private analyzingThreads = new Set<string>();
  // Cache: threadId -> commitments + savedIds (survives navigation back to same thread)
  private threadCache = new Map<string, { commitments: Commitment[]; savedIds: Set<string> }>();
  private analyzingInbox = false;
  private inboxAnalyzed = false;
  private loadingStartTime = 0;
  private inboxCommitments: Commitment[] = [];
  private currentCommitments: Commitment[] = [];
  private generatingForId: string | undefined;

  constructor() {
    this.observer = new GmailObserver(this);
  }

  start() {
    this.observer.start();
    console.log('[Rex] Started');
  }

  onViewChange(_hash: string) {
    const prevView = this.currentView;
    const prevThreadId = this.currentThreadId;
    this.currentView = getCurrentView();
    this.currentThreadId = this.currentView === 'thread' ? getThreadId() : '';

    // Same view and same thread — Gmail fired a spurious hash change, don't re-render
    if (this.currentView === prevView && this.currentThreadId === prevThreadId) return;

    if (this.currentView === 'inbox' && prevView !== 'inbox') {
      this.inboxAnalyzed = false;
      if (prevView !== 'thread') {
        this.inboxCommitments = [];
      }
    }
    this.cleanup();

    if (this.currentView === 'inbox') {
      this.tryInjectInboxBanner();
    } else if (this.currentView === 'thread') {
      this.tryInjectThreadCard();
    }
  }

  onDomUpdate() {
    if (this.currentView === 'inbox') {
      this.tryInjectInboxBanner();
    } else if (this.currentView === 'thread') {
      this.tryInjectThreadCard();
    }
  }

  private cleanup() {
    document.getElementById(REX_THREAD_ID)?.remove();
    document.getElementById(REX_DRAFT_ID)?.remove();
    this.threadMount = null;
    this.draftMount = null;
    // Do NOT clear analyzingThreads or threadCache — they persist across navigation
    this.currentCommitments = [];
    this.generatingForId = undefined;
  }

  // ===== INBOX BANNER =====

  private async tryInjectInboxBanner() {
    const bannerInDom = !!document.getElementById(REX_BANNER_ID);

    // Banner was removed by Gmail (virtual scroll, etc.) but we already have data — re-inject instantly
    if (!bannerInDom && this.inboxAnalyzed) {
      const listContainer = getInboxEmailList();
      if (!listContainer) return;
      this.bannerMount = createShadowMount(REX_BANNER_ID);
      const parent = listContainer.parentElement;
      if (!parent) return;
      parent.insertBefore(this.bannerMount.container, listContainer);
      if (this.inboxCommitments.length > 0) {
        this.renderBanner(this.inboxCommitments, false);
      } else {
        this.renderEmptyInbox();
      }
      return;
    }

    if (bannerInDom) return;
    if (this.inboxAnalyzed) return;

    const listContainer = getInboxEmailList();
    if (!listContainer) return;

    this.bannerMount = createShadowMount(REX_BANNER_ID);
    const parent = listContainer.parentElement;
    if (!parent) return;
    parent.insertBefore(this.bannerMount.container, listContainer);
    this.inboxAnalyzed = true;

    if (this.inboxCommitments.length > 0) {
      this.renderBanner(this.inboxCommitments, false);
      return;
    }

    if (!this.analyzingInbox) {
      this.renderBanner([], true);
      await this.loadCommitmentsFromSupabase();
    }
  }

  private renderBanner(commitments: Commitment[], loading = false) {
    if (!this.bannerMount) return;

    if (loading && commitments.length === 0) {
      this.bannerMount.root.render(
        <InboxLoader iconUrl={chrome.runtime.getURL('icons/icon48.png')} />
      );
      return;
    }

    if (commitments.length === 0) {
      // No commitments - don't show banner (remove it)
      document.getElementById(REX_BANNER_ID)?.remove();
      this.bannerMount = null;
      return;
    }

    this.bannerMount.root.render(
      <CommitmentBanner
        commitments={commitments}
        totalCount={commitments.length}
        onViewThread={(threadId) => this.navigateToThread(threadId)}
        onMarkComplete={(id) => this.markComplete(id)}
        iconUrl={chrome.runtime.getURL('icons/icon48.png')}
      />
    );
  }

  // Load user's saved commitments from Supabase (not AI inbox scan)
  private async loadCommitmentsFromSupabase() {
    this.analyzingInbox = true;
    const loadStart = Date.now();
    console.log('[Rex] Loading commitments from Supabase...');
    try {
      const authHeaders = await getAuthHeaders();
      if (!authHeaders['Authorization']) {
        document.getElementById(REX_BANNER_ID)?.remove();
        this.bannerMount = null;
        this.inboxAnalyzed = false; // allow retry if token refreshes later
        return;
      }

      // Check that the signed-in Rex account matches the Gmail account being viewed
      const rexEmail = getEmailFromToken(authHeaders['Authorization'].replace('Bearer ', ''));
      if (rexEmail) {
        const gmailEmail = getCurrentUserEmail();
        if (gmailEmail && gmailEmail !== rexEmail) {
          this.renderEmailMismatch(rexEmail, gmailEmail);
          return;
        }
      }

      const response = await fetch(`${SERVER_URL}/api/commitments`, {
        headers: { ...authHeaders },
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json() as { commitments?: Array<{
        id: string; summary: string; detail?: string; type?: string;
        sender?: string; sender_email?: string; thread_id: string;
        due_date?: string; due_text?: string; urgency?: string; completed: boolean;
      }> };

      // Map Supabase rows to Commitment shape
      console.log('[Rex] Commitments from DB:', data.commitments?.length ?? 0);
      this.inboxCommitments = (data.commitments ?? [])
        .filter(r => !r.completed)
        .map(r => ({
          id: r.id,
          type: (r.type as Commitment['type']) ?? 'action-item',
          summary: r.summary,
          detail: r.detail ?? r.summary,
          sender: r.sender ?? '',
          senderEmail: r.sender_email ?? '',
          dueText: r.due_text ?? (r.due_date ? `Due ${new Date(r.due_date).toLocaleDateString()}` : 'No due date'),
          dueDate: r.due_date,
          urgency: (r.urgency as Commitment['urgency']) ?? 'medium',
          threadId: r.thread_id,
          messageId: r.thread_id,
          createdAt: new Date().toISOString(),
          completed: false,
        }));

      // Enforce minimum 5-second loading display
      const elapsed = Date.now() - loadStart;
      if (elapsed < 5000) await new Promise(r => setTimeout(r, 5000 - elapsed));

      if (this.inboxCommitments.length > 0) {
        this.renderBanner(this.inboxCommitments, false);
      } else {
        this.renderEmptyInbox();
      }
    } catch (err) {
      console.warn('[Rex] Failed to load commitments:', err);
      document.getElementById(REX_BANNER_ID)?.remove();
      this.bannerMount = null;
    } finally {
      this.analyzingInbox = false;
      this.inboxAnalyzed = true;
    }
  }

  private renderEmailMismatch(signedInEmail: string, gmailEmail: string) {
    if (!this.bannerMount) return;
    const iconUrl = chrome.runtime.getURL('icons/icon48.png');
    this.bannerMount.root.render(
      <div className="rex-no-commitments" style={{ background: '#fef3c7', borderBottom: '1px solid #fde68a' }}>
        <img src={iconUrl} width={32} height={32} />
        <div className="rex-no-commitments-text">
          <span className="rex-no-commitments-title" style={{ color: '#92400e' }}>Wrong account</span>
          <span className="rex-no-commitments-sub" style={{ color: '#b45309', opacity: 1 }}>
            Rex is signed in as <strong>{signedInEmail}</strong> but you're viewing <strong>{gmailEmail}</strong>.
            Please sign in with the correct Google account.
          </span>
        </div>
      </div>
    );
  }

  private renderEmptyInbox() {
    if (!this.bannerMount) return;
    const iconUrl = chrome.runtime.getURL('icons/icon48.png');
    this.bannerMount.root.render(
      <div className="rex-no-commitments">
        <img src={iconUrl} width={32} height={32} />
        <div className="rex-no-commitments-text">
          <span className="rex-no-commitments-title">You're all caught up</span>
          <span className="rex-no-commitments-sub">Open an email and click "Add reminder" on any tasks to track them here</span>
        </div>
      </div>
    );
  }

  // Save a commitment from a thread card to Supabase
  async saveCommitment(c: Commitment) {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders['Authorization']) return;

    try {
      await fetch(`${SERVER_URL}/api/commitments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(c),
      });
      // Update thread cache so "Added" state persists on re-open
      const cached = this.threadCache.get(c.threadId);
      if (cached) {
        cached.savedIds.add(c.id);
        chrome.storage.local.set({ [`rexThread_${c.threadId}`]: { commitments: cached.commitments, savedIds: [...cached.savedIds] } });
      }
      // Add to inbox list
      if (!this.inboxCommitments.find(x => x.id === c.id)) {
        this.inboxCommitments = [c, ...this.inboxCommitments];
      }
      // Reset so banner re-injects with new commitment when returning to inbox
      this.inboxAnalyzed = false;
      document.getElementById(REX_BANNER_ID)?.remove();
      this.bannerMount = null;
      this.showToast('Reminder added — showing in your inbox');
    } catch {
      this.showToast('Failed to save reminder');
    }
  }

// ===== THREAD CARD =====

  private mapSavedRows(rows: Array<{
    id: string; summary: string; detail?: string; type?: string;
    sender?: string; sender_email?: string; thread_id: string;
    due_date?: string; due_text?: string; urgency?: string; completed: boolean;
  }>): Commitment[] {
    return rows.filter(r => !r.completed).map(r => ({
      id: r.id,
      type: (r.type as Commitment['type']) ?? 'action-item',
      summary: r.summary,
      detail: r.detail ?? r.summary,
      sender: r.sender ?? '',
      senderEmail: r.sender_email ?? '',
      dueText: r.due_text ?? (r.due_date ? `Due ${new Date(r.due_date).toLocaleDateString()}` : 'No due date'),
      dueDate: r.due_date,
      urgency: (r.urgency as Commitment['urgency']) ?? 'medium',
      threadId: r.thread_id,
      messageId: r.thread_id,
      createdAt: new Date().toISOString(),
      completed: false,
    }));
  }

  private async tryInjectThreadCard() {
    const threadId = getThreadId();
    console.log('[Rex] tryInjectThreadCard threadId:', threadId);
    if (!threadId) return;
    if (document.getElementById(REX_THREAD_ID)) return;

    const lastMsg = getLastExpandedMessage();
    console.log('[Rex] lastMsg:', !!lastMsg);
    if (!lastMsg) return;

    const body = getEmailBody();
    console.log('[Rex] body length:', body.length);
    if (!body || body.length < 30) return;

    const rexAuth = await new Promise<{ token?: string; email?: string }>(res => {
      chrome.storage.local.get(['rexAccessToken', 'rexUserEmail'], r => res({
        token: r['rexAccessToken'] as string | undefined,
        email: (r['rexUserEmail'] as string | undefined)?.toLowerCase(),
      }));
    });
    console.log('[Rex] token present:', !!rexAuth.token, 'stored email:', rexAuth.email);
    if (!rexAuth.token) return;
    if (rexAuth.email) {
      const gmailEmail = getCurrentUserEmail();
      console.log('[Rex] gmail email:', gmailEmail, 'rex email:', rexAuth.email, 'match:', gmailEmail === rexAuth.email);
      if (gmailEmail && gmailEmail !== rexAuth.email) return;
    }

    // Memory cache hit — inject immediately with no loading bar
    const cached = this.threadCache.get(threadId);
    if (cached) {
      if (cached.commitments.length === 0) return;
      this.threadMount = createShadowMount(REX_THREAD_ID);
      lastMsg.insertAdjacentElement('afterend', this.threadMount.container);
      applyCardBounds(this.threadMount.container, lastMsg as HTMLElement);
      this.highlightCommitmentTexts(lastMsg, cached.commitments);
      this.currentCommitments = cached.commitments;
      this.renderThreadCard(cached.commitments, cached.savedIds);
      return;
    }

    // Already fetching this thread — don't duplicate
    if (this.analyzingThreads.has(threadId)) return;

    // Mark as analyzing immediately (before any await) to prevent duplicate concurrent calls
    this.analyzingThreads.add(threadId);

    // Check chrome.storage.local for persisted results from a previous page load
    const storedKey = `rexThread_${threadId}`;
    const stored = await new Promise<{ commitments: Commitment[]; savedIds: string[] } | null>(res => {
      chrome.storage.local.get(storedKey, r => res(r[storedKey] ?? null));
    });
    // Re-check DOM after async — another call may have already injected
    if (document.getElementById(REX_THREAD_ID)) return;
    if (stored) {
      const savedIds = new Set(stored.savedIds);
      this.threadCache.set(threadId, { commitments: stored.commitments, savedIds });
      if (stored.commitments.length === 0) return;
      this.threadMount = createShadowMount(REX_THREAD_ID);
      lastMsg.insertAdjacentElement('afterend', this.threadMount.container);
      applyCardBounds(this.threadMount.container, lastMsg as HTMLElement);
      this.highlightCommitmentTexts(lastMsg, stored.commitments);
      this.currentCommitments = stored.commitments;
      this.renderThreadCard(stored.commitments, savedIds);
      return;
    }

    this.threadMount = createShadowMount(REX_THREAD_ID);
    lastMsg.insertAdjacentElement('afterend', this.threadMount.container);
    applyCardBounds(this.threadMount.container, lastMsg as HTMLElement);
    this.renderThreadLoading();
    this.loadingStartTime = Date.now();

    try {
      const authHeaders = await getAuthHeaders();
      // Check Supabase for already-saved commitments on this thread (no loading wait — show instantly)
      if (authHeaders['Authorization']) {
        const savedRes = await fetch(`${SERVER_URL}/api/commitments?thread_id=${encodeURIComponent(threadId)}`, { headers: authHeaders });
        if (savedRes.ok) {
          const savedData = await savedRes.json() as { commitments?: Array<{
            id: string; summary: string; detail?: string; type?: string;
            sender?: string; sender_email?: string; thread_id: string;
            due_date?: string; due_text?: string; urgency?: string; completed: boolean;
          }> };
          const saved = this.mapSavedRows(savedData.commitments ?? []);
          if (saved.length > 0) {
            const savedIds = new Set(saved.map(c => c.id));
            this.threadCache.set(threadId, { commitments: saved, savedIds });
            chrome.storage.local.set({ [`rexThread_${threadId}`]: { commitments: saved, savedIds: [...savedIds] } });
            // No 5-second wait for cached results — show immediately
            this.highlightCommitmentTexts(lastMsg, saved);
            this.currentCommitments = saved;
            this.renderThreadCard(saved, savedIds);
            return;
          }
        }
      }

      // No saved commitments — run AI analysis
      const emailContent = {
        threadId,
        messageId: threadId,
        subject: getEmailSubject(),
        sender: getSenderName(),
        senderEmail: getSenderEmail(),
        body: body.slice(0, 3000),
        date: getEmailDate(),
        isReply: document.querySelectorAll('.adn').length > 1,
      };

      const response = await fetch(`${SERVER_URL}/api/analyze/thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(emailContent),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json() as { hasCommitments: boolean; commitments: Commitment[] };

      const elapsed = Date.now() - this.loadingStartTime;
      if (elapsed < 5000) await new Promise(r => setTimeout(r, 5000 - elapsed));

      if (!data.hasCommitments || data.commitments.length === 0) {
        this.threadCache.set(threadId, { commitments: [], savedIds: new Set() });
        chrome.storage.local.set({ [`rexThread_${threadId}`]: { commitments: [], savedIds: [] } });
        document.getElementById(REX_THREAD_ID)?.remove();
        this.threadMount = null;
        return;
      }

      this.threadCache.set(threadId, { commitments: data.commitments, savedIds: new Set() });
      chrome.storage.local.set({ [`rexThread_${threadId}`]: { commitments: data.commitments, savedIds: [] } });
      this.highlightCommitmentTexts(lastMsg, data.commitments);
      this.currentCommitments = data.commitments;
      this.renderThreadCard(data.commitments);
    } catch (err) {
      console.warn('[Rex] Thread analysis failed:', err);
      this.analyzingThreads.delete(threadId); // allow retry on next DOM update
      document.getElementById(REX_THREAD_ID)?.remove();
      this.threadMount = null;
    }
  }

  // Highlight the quoted text from each commitment directly in the email body DOM
  private highlightCommitmentTexts(messageEl: Element, commitments: Commitment[]) {
    // Find the email body element within this message
    const bodyEl = messageEl.querySelector('.a3s')
      || messageEl.querySelector('.ii.gt div')
      || messageEl.querySelector('[dir="ltr"]');
    if (!bodyEl) return;

    const highlightColor: Record<string, string> = {
      'deadline':    '#fef9c3',  // yellow
      'promise':     '#dcfce7',  // green
      'follow-up':   '#ede9fe',  // purple
      'action-item': '#ede9fe',  // purple
      'meeting':     '#dbeafe',  // blue
      'unanswered':  '#ede9fe',  // purple
    };

    for (const c of commitments) {
      if (!c.quotedText || c.quotedText.length < 4) continue;
      const color = highlightColor[c.type] ?? '#fef9c3';
      this.highlightTextInElement(bodyEl, c.quotedText, color);
    }
  }

  private highlightTextInElement(root: Element, searchText: string, bgColor: string) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      nodes.push(node as Text);
    }

    const needle = searchText.toLowerCase().trim();
    for (const textNode of nodes) {
      const content = textNode.textContent ?? '';
      const idx = content.toLowerCase().indexOf(needle);
      if (idx < 0) continue;
      try {
        const range = document.createRange();
        range.setStart(textNode, idx);
        range.setEnd(textNode, idx + needle.length);
        const mark = document.createElement('mark');
        mark.style.cssText = `background:${bgColor};border-radius:3px;padding:1px 0;color:inherit;`;
        range.surroundContents(mark);
      } catch {
        // Skip — range may span multiple nodes
      }
      break; // Only highlight first occurrence
    }
  }

  private renderThreadLoading() {
    if (!this.threadMount) return;
    this.threadMount.root.render(
      <div className="rex-loading-bar">
        <div className="rex-loading-shimmer" />
        <div className="rex-loading-content">
          <img src={chrome.runtime.getURL('icons/icon48.png')} width={24} height={24} style={{ flexShrink: 0, borderRadius: 6 }} />
          <span className="rex-loading-text">Rex is analyzing this conversation</span>
          <span className="rex-loading-dots">
            <span /><span /><span />
          </span>
        </div>
      </div>
    );
  }

  private renderThreadCard(commitments: Commitment[], savedIds?: Set<string>) {
    if (!this.threadMount) return;
    this.threadMount.root.render(
      <ThreadCommitmentCard
        commitments={commitments}
        savedIds={savedIds}
        generatingForId={this.generatingForId}
        onAddReminder={(c) => this.saveCommitment(c)}
        onMarkComplete={(id) => this.markComplete(id)}
        onDraftFollowUp={(c) => this.generateAndInjectDraft(c, this.currentCommitments)}
      />
    );
  }

  private showDraftPanel(draft: string, commitment: Commitment, subject: string) {
    document.getElementById(REX_DRAFT_ID)?.remove();
    this.draftMount = createShadowMount(REX_DRAFT_ID);

    // Insert inline below the thread card, aligned to .adn's left edge so the
    // draft avatar sits in the same column as the email sender's avatar above.
    const threadCard = document.getElementById(REX_THREAD_ID);
    const lastMsg = getLastExpandedMessage() as HTMLElement | null;
    let gutterWidth = 52;
    if (threadCard && threadCard.parentElement && lastMsg) {
      threadCard.insertAdjacentElement('afterend', this.draftMount.container);
      gutterWidth = applyDraftBounds(this.draftMount.container, lastMsg);
    } else {
      document.body.appendChild(this.draftMount.container);
      this.draftMount.container.setAttribute('style',
        `position:fixed!important;right:16px!important;bottom:80px!important;width:520px!important;z-index:2147483646!important;`
      );
    }

    const userName    = getCurrentUserName();
    const avatarStyle = getUserAvatarStyle();
    const avatarSize  = getSenderAvatarSize();
    this.draftMount.root.render(
      <DraftSuggestion
        draft={draft}
        senderName={getSenderName() || 'sender'}
        senderEmail={getSenderEmail() || ''}
        subject={subject}
        commitmentSummary={commitment.summary}
        commitmentType={commitment.type}
        userName={userName || undefined}
        avatarUrl={avatarStyle.url}
        avatarBgColor={avatarStyle.bgColor}
        avatarSize={avatarSize}
        gutterWidth={gutterWidth}
        iconUrl={chrome.runtime.getURL('icons/icon48.png')}
        onUse={(d) => { this.injectDraft(d); document.getElementById(REX_DRAFT_ID)?.remove(); this.draftMount = null; }}
        onDismiss={() => { document.getElementById(REX_DRAFT_ID)?.remove(); this.draftMount = null; }}
      />
    );
  }

  // ===== DRAFT INJECTION =====

  private injectDraft(draft: string) {
    // Find Gmail's compose/reply area
    const replyBtn = document.querySelector('.ams [role="button"][data-tooltip*="Reply"]')
      || document.querySelector('.amn .T-I[aria-label*="Reply"]')
      || document.querySelector('[data-tooltip="Reply"]')
      || document.querySelector('button[aria-label*="Reply"]');

    // Click reply to open compose
    if (replyBtn && !(replyBtn as HTMLElement).closest('.reply-area')) {
      (replyBtn as HTMLElement).click();
    }

    // Wait for compose area to open
    setTimeout(() => {
      const composeArea = document.querySelector('.Am.Al.editable')
        || document.querySelector('[contenteditable="true"][role="textbox"]')
        || document.querySelector('.aoI .Am');

      if (composeArea) {
        (composeArea as HTMLElement).focus();

        // Convert plain-text newlines to Gmail's div-per-line format so the
        // draft renders with proper paragraph breaks in the rich-text editor.
        const lines = draft.split('\n');
        const html = lines
          .map(line => `<div>${line.trim() === '' ? '<br>' : line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
          .join('');
        (composeArea as HTMLElement).innerHTML = html;

        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(composeArea);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);

        // Trigger input event for Gmail to register the change
        composeArea.dispatchEvent(new InputEvent('input', { bubbles: true }));

        this.showToast('Draft applied! Review before sending.');
      } else {
        // Fallback: nothing (panel already shown separately)
      }
    }, 600);
  }

  private async generateAndInjectDraft(commitment: Commitment, allCommitments: Commitment[]) {
    this.generatingForId = commitment.id;
    this.renderThreadCard(this.currentCommitments);

    const body = getEmailBody();
    const sender = getSenderName();
    const userName = getCurrentUserName();
    const rawSubject = getEmailSubject();
    const subject = rawSubject ? `${rawSubject} – following up` : 'Following up';
    const commitmentSummary = allCommitments.map(c => c.summary).join('; ');

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${SERVER_URL}/api/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ emailContent: body.slice(0, 2000), commitmentSummary, senderName: sender, userName }),
      });
      if (!response.ok) throw new Error('Draft API error');
      const data = await response.json() as { draft: string };
      this.generatingForId = undefined;
      this.renderThreadCard(this.currentCommitments);
      this.showDraftPanel(data.draft, commitment, subject);
    } catch (_err) {
      this.generatingForId = undefined;
      this.renderThreadCard(this.currentCommitments);
      this.showToast('Could not generate draft. Try again.');
    }
  }

  // ===== UTILITIES =====

  private navigateToThread(threadId: string) {
    // Navigate to thread in Gmail
    window.location.hash = `#inbox/${threadId}`;
  }

  private markComplete(id: string) {
    getAuthHeaders().then(authHeaders => {
      fetch(`${SERVER_URL}/api/commitments/${id}/complete`, { method: 'PATCH', headers: authHeaders })
        .catch(() => {});
    });
    // Remove from inbox banner
    this.inboxCommitments = this.inboxCommitments.filter(c => c.id !== id);
    this.renderBanner(this.inboxCommitments);
    // Remove from thread cache + storage so it doesn't reappear on re-open
    for (const [threadId, cached] of this.threadCache.entries()) {
      if (cached.commitments.find(c => c.id === id)) {
        cached.commitments = cached.commitments.filter(c => c.id !== id);
        cached.savedIds.delete(id);
        chrome.storage.local.set({ [`rexThread_${threadId}`]: { commitments: cached.commitments, savedIds: [...cached.savedIds] } });
        break;
      }
    }
    this.showToast('Marked as complete');
  }

  private showToast(message: string) {
    const existing = document.getElementById('rex-toast');
    existing?.remove();

    const toast = document.createElement('div');
    toast.id = 'rex-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #323232;
      color: #fff;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Google Sans', Roboto, Arial, sans-serif;
      z-index: 99999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// Initialize Rex when the page is ready
function initRex() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const rex = new Rex();
      rex.start();
    });
  } else {
    const rex = new Rex();
    rex.start();
  }
}

initRex();
