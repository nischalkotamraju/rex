export const REX_STYLES = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
  }

  :host {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  button, input, select, textarea {
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
    font-size: inherit;
  }

  /* ─────────────────────────────────────────
     INBOX BANNER
  ───────────────────────────────────────── */

  .rex-banner {
    background: #f5f3ff;
    border: none !important;
    border-radius: 0 !important;
    outline: none !important;
    padding: 0;
    margin: 0 0 10px;
    overflow: hidden;
    box-shadow: none;
    animation: rex-row-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .rex-banner-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #ede9fe;
    gap: 10px;
  }

  .rex-banner-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rex-banner-title {
    font-size: 13px;
    font-weight: 700;
    color: #3b0764;
    line-height: 1.3;
    letter-spacing: -0.1px;
  }

  .rex-banner-subtitle {
    font-size: 11px;
    color: #7c3aed;
    margin-top: 1px;
  }

  .rex-banner-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #fff;
    border: 1px solid #ddd6fe;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11.5px;
    font-weight: 500;
    color: #7c3aed;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.12s, box-shadow 0.12s;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(124,58,237,0.10);
  }
  .rex-banner-toggle-btn:hover {
    background: #ede9fe;
    box-shadow: 0 2px 6px rgba(124,58,237,0.15);
  }

  .rex-banner-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 12px;
    gap: 8px;
  }

  .rex-banner-card {
    background: #fff;
    border: 1px solid #e8e4ff;
    border-radius: 10px;
    padding: 11px 12px;
    cursor: pointer;
    transition: background 0.12s, box-shadow 0.12s;
  }
  .rex-banner-card:hover {
    background: #faf8ff;
    box-shadow: 0 2px 8px rgba(124,58,237,0.10);
  }

  .rex-banner-card-top {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }

  .rex-banner-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 0;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .rex-banner-card-summary {
    font-size: 12.5px;
    font-weight: 500;
    color: #1e0a3c;
    line-height: 1.4;
    flex: 1;
  }

  .rex-banner-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  .rex-banner-card-due {
    font-size: 11px;
    font-weight: 600;
  }

  .rex-banner-card-sender {
    font-size: 11px;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rex-banner-expanded {
    border-top: 1px solid #ede9fe;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .rex-banner-exp-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.12s;
  }
  .rex-banner-exp-item:hover { background: rgba(124,58,237,0.06); }

  .rex-banner-exp-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .rex-banner-exp-summary {
    font-size: 12.5px;
    color: #1e0a3c;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rex-banner-exp-due {
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }

  /* Legacy — keep for any older references */
  .rex-avatar {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  /* ─────────────────────────────────────────
     COMMITMENT ROWS
  ───────────────────────────────────────── */

  .rex-rows-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 10px 0 6px;
  }

  .rex-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px 11px 13px;
    border-radius: 10px;
    border: 1px solid transparent; /* type color applied inline */
    box-shadow: 0 1px 4px rgba(60, 64, 67, 0.08);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    animation: rex-row-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .rex-row:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(60, 64, 67, 0.14);
  }

  .rex-row:nth-child(1) { animation-delay: 0.00s; }
  .rex-row:nth-child(2) { animation-delay: 0.08s; }
  .rex-row:nth-child(3) { animation-delay: 0.16s; }
  .rex-row:nth-child(4) { animation-delay: 0.24s; }
  .rex-row:nth-child(5) { animation-delay: 0.32s; }

  @keyframes rex-row-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .rex-row-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .rex-row-summary {
    font-size: 13px;
    font-weight: 500;
    color: #202124;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rex-row-date {
    display: inline-flex;
    align-items: center;
    padding: 2px 9px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .rex-row-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .rex-row-actions-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 2px 2px;
  }

  .rex-row-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: #3c4043;
    padding: 3px 4px;
    border-radius: 6px;
    transition: color 0.12s;
    white-space: nowrap;
  }
  .rex-row-link:hover { color: #202124; }

  /* Draft follow-up pill — filled lavender to signal AI action */
  .rex-row-draft-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #ede9fe;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #7c3aed;
    padding: 4px 13px;
    transition: background 0.12s;
    white-space: nowrap;
  }
  .rex-row-draft-pill:hover { background: #ddd6fe; }
  .rex-row-draft-pill { transition: background 0.2s ease; }
  .rex-row-draft-pill:disabled { opacity: 0.5; cursor: default; }

  .rex-row-dots-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.12s;
  }
  .rex-row-dots-btn:hover { background: #f1f3f4; }

  .rex-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s;
    flex-shrink: 0;
  }
  .rex-close-btn:hover { background: #f1f3f4; }

  /* ─────────────────────────────────────────
     DRAFT PANEL (inline below rows)
  ───────────────────────────────────────── */

  /* Outer wrapper: avatar column on left + panel on right */
  .rex-draft-panel-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 0;
    margin-top: 8px;
    animation: rex-row-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Avatar column — width set inline to match email sender avatar gutter */
  .rex-draft-avatar-col {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-shrink: 0;
    padding-top: 10px;
  }

  /* User avatar circle — applies to both <div> fallback and <img> */
  .rex-draft-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #4285f4;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    object-fit: cover;
    overflow: hidden;
  }

  .rex-draft-panel {
    flex: 1;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(60,64,67,0.10);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .rex-dp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px 11px;
    border-bottom: 1px solid #f1f3f4;
  }

  .rex-dp-header-left {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .rex-dp-header-right {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .rex-dp-title {
    font-size: 13px;
    font-weight: 600;
    color: #202124;
  }

  .rex-dp-preview-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background: #f0e6ff;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #6200ee;
  }

  .rex-dp-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s;
  }
  .rex-dp-icon-btn:hover { background: #f1f3f4; }

  .rex-dp-fields {
    padding: 10px 14px;
    border-bottom: 1px solid #f1f3f4;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rex-dp-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rex-dp-field-label {
    font-size: 12px;
    font-weight: 500;
    color: #80868b;
    width: 46px;
    flex-shrink: 0;
  }

  .rex-dp-for-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 20px;
    border: 1px solid;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 280px;
  }

  .rex-dp-field-value {
    font-size: 12.5px;
    color: #202124;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rex-dp-body {
    padding: 14px 16px;
    font-size: 13px;
    color: #3c4043;
    line-height: 1.7;
    white-space: pre-wrap;
    max-height: 220px;
    overflow-y: auto;
    flex: 1;
  }

  .rex-dp-body-edit {
    padding: 14px 16px;
    font-size: 13px;
    color: #3c4043;
    line-height: 1.7;
    min-height: 160px;
    max-height: 320px;
    width: 100%;
    resize: vertical;
    border: none;
    border-top: 1px solid #f1f3f4;
    border-bottom: 1px solid #f1f3f4;
    outline: none;
    background: #fafbff;
    flex: 1;
  }

  .rex-dp-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-top: 1px solid #f1f3f4;
    gap: 8px;
  }

  .rex-dp-footer-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rex-dp-insert-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #6200ee;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 7px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.12s;
    white-space: nowrap;
  }
  .rex-dp-insert-btn:hover { background: #5000c9; }

  .rex-dp-copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 1px solid #dadce0;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    color: #3c4043;
    cursor: pointer;
    transition: background 0.12s;
    white-space: nowrap;
  }
  .rex-dp-copy-btn:hover { background: #f1f3f4; }

  .rex-dp-feedback {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  /* ─────────────────────────────────────────
     RIGHT SIDEBAR
  ───────────────────────────────────────── */

  .rex-sidebar {
    width: 100%;
    height: 100%;
    background: #fff;
    border-left: 1px solid #e0e0e0;
    box-shadow: -2px 0 10px rgba(60,64,67,0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .rex-sb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 14px;
    border-bottom: 1px solid #e8eaed;
    flex-shrink: 0;
  }

  .rex-sb-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rex-sb-header-right {
    display: flex;
    align-items: center;
  }

  .rex-sb-logo {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #4285f4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rex-sb-title {
    font-size: 15px;
    font-weight: 600;
    color: #202124;
  }

  .rex-sb-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s;
    flex-shrink: 0;
  }
  .rex-sb-icon-btn:hover { background: #f1f3f4; }

  .rex-sb-tabs {
    display: flex;
    border-bottom: 1px solid #e8eaed;
    flex-shrink: 0;
  }

  .rex-sb-tab {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 10px 12px;
    font-size: 12.5px;
    font-weight: 500;
    color: #5f6368;
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color 0.12s;
  }
  .rex-sb-tab.active {
    color: #1a73e8;
    border-bottom-color: #1a73e8;
  }
  .rex-sb-tab:hover { color: #202124; }

  .rex-sb-tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #e8eaed;
    color: #5f6368;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    padding: 1px 6px;
    min-width: 18px;
  }
  .rex-sb-tab.active .rex-sb-tab-badge {
    background: #e8f0fe;
    color: #1a73e8;
  }

  .rex-sb-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 12px 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .rex-sb-detected {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 11px;
    background: #f8f9ff;
    border-radius: 8px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .rex-sb-detected-title {
    font-size: 12.5px;
    font-weight: 600;
    color: #202124;
    line-height: 1.3;
  }

  .rex-sb-detected-sub {
    font-size: 11.5px;
    color: #5f6368;
    margin-top: 2px;
  }

  .rex-sb-item {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 10px 11px;
    border: 1px solid #e8eaed;
    border-left: 3px solid transparent;
    border-radius: 8px;
    margin-bottom: 7px;
    background: #fff;
  }
  .rex-sb-item:last-of-type { margin-bottom: 0; }

  .rex-sb-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .rex-sb-item-body {
    flex: 1;
    min-width: 0;
  }

  .rex-sb-item-summary {
    font-size: 12.5px;
    font-weight: 500;
    color: #202124;
    line-height: 1.3;
  }

  .rex-sb-item-sub {
    font-size: 11px;
    color: #80868b;
    margin-top: 2px;
  }

  .rex-sb-item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    flex-shrink: 0;
  }

  .rex-sb-item-date {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }

  .rex-sb-action-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: 1px solid #dadce0;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11.5px;
    color: #1a73e8;
    cursor: pointer;
    transition: background 0.12s;
    white-space: nowrap;
  }
  .rex-sb-action-pill:hover { background: #e8f0fe; }
  .rex-sb-action-pill:disabled { opacity: 0.5; cursor: default; }

  .rex-sb-view-all {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px;
    color: #1a73e8;
    font-size: 12.5px;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    margin-top: 4px;
    transition: background 0.12s;
    border-radius: 8px;
  }
  .rex-sb-view-all:hover { background: #f0f4ff; }

  .rex-sb-empty {
    padding: 20px 0;
    text-align: center;
    font-size: 13px;
    color: #80868b;
  }

  .rex-sb-draft-section {
    margin-top: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
  }
  .rex-sb-draft-section .rex-dp-header { background: #faf8ff; }
  .rex-sb-draft-section .rex-dp-body { max-height: 180px; }

  /* ─────────────────────────────────────────
     INBOX LOADER — email rain + typewriter
  ───────────────────────────────────────── */

  .rex-inbox-loader {
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%);
    border: none;
    border-bottom: 1px solid #e0d9ff;
    border-radius: 0;
    margin: 0;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 18px;
    gap: 10px;
  }

  /* Falling envelope container */
  .rex-email-rain {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .rex-falling-email {
    position: absolute;
    top: -24px;
    opacity: 0;
    animation: rex-fall linear infinite;
    transform: rotate(var(--rot, 0deg));
  }

  @keyframes rex-fall {
    0%   { top: -24px; opacity: 0;   }
    8%   { opacity: 0.75; }
    88%  { opacity: 0.75; }
    100% { top: 105%;  opacity: 0;   }
  }

  /* Rex catching icon */
  .rex-catcher {
    position: relative;
    z-index: 2;
    animation: rex-catch 1s ease-in-out infinite;
    filter: drop-shadow(0 4px 10px rgba(124, 58, 237, 0.25));
  }

  @keyframes rex-catch {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50%      { transform: translateY(-5px) rotate(2deg); }
  }

  /* Typewriter row */
  .rex-typewriter-row {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 1px;
    min-height: 18px;
  }

  .rex-typewriter-text {
    font-size: 12.5px;
    font-weight: 500;
    color: #6d28d9;
    white-space: nowrap;
  }

  .rex-typewriter-cursor {
    font-size: 14px;
    font-weight: 300;
    color: #7c3aed;
    animation: rex-blink 0.8s step-end infinite;
    margin-left: 1px;
  }

  @keyframes rex-blink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }

  .rex-no-commitments {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: #f5f3ff;
    border: none;
    border-bottom: 1px solid #e0d9ff;
    border-radius: 0;
    /* flat on top/bottom edges — matches banner flush layout */
    margin: 0;
    animation: rex-row-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .rex-no-commitments-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rex-no-commitments-title {
    font-size: 13px;
    font-weight: 600;
    color: #6d28d9;
  }

  .rex-no-commitments-sub {
    font-size: 12px;
    color: #9333ea;
    opacity: 0.75;
  }

  /* ─────────────────────────────────────────
     LOADING
  ───────────────────────────────────────── */

  .rex-loading-bar {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid #e8e4ff;
    background: #f5f3ff;
    margin: 12px 0 4px;
  }

  /* Shimmer sweep that moves left → right */
  .rex-loading-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(124, 58, 237, 0.08) 40%,
      rgba(124, 58, 237, 0.15) 50%,
      rgba(124, 58, 237, 0.08) 60%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: rex-shimmer 5s ease-in-out infinite;
  }

  .rex-loading-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 15px;
    z-index: 1;
  }

  .rex-loading-text {
    font-size: 12.5px;
    font-weight: 500;
    color: #6d28d9;
  }

  /* Three bouncing dots */
  .rex-loading-dots {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-left: 1px;
  }

  .rex-loading-dots span {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #7c3aed;
    opacity: 0.3;
    animation: rex-dot-bounce 1.2s ease-in-out infinite;
  }
  .rex-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .rex-loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes rex-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes rex-dot-bounce {
    0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
    40%           { opacity: 1;    transform: translateY(-3px); }
  }
`;
