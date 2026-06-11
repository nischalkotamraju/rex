import type { RexController } from './index';

export class GmailObserver {
  private controller: RexController;
  private mutationObserver: MutationObserver | null = null;
  private currentHash: string = '';
  private hashCheckInterval: number | null = null;
  // Separate timers so DOM mutations never cancel hash-change processing
  private viewChangeTimer: number | null = null;
  private renderTimer: number | null = null;

  constructor(controller: RexController) {
    this.controller = controller;
  }

  start() {
    this.currentHash = window.location.hash;
    this.controller.onViewChange(this.currentHash);

    // Poll for hash changes every 200ms — faster detection
    this.hashCheckInterval = window.setInterval(() => {
      const newHash = window.location.hash;
      if (newHash !== this.currentHash) {
        this.currentHash = newHash;
        this.scheduleViewChange(newHash);
      }
    }, 200);

    this.mutationObserver = new MutationObserver(() => {
      this.scheduleRender();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  stop() {
    if (this.hashCheckInterval !== null) clearInterval(this.hashCheckInterval);
    if (this.viewChangeTimer !== null) clearTimeout(this.viewChangeTimer);
    if (this.renderTimer !== null) clearTimeout(this.renderTimer);
    this.mutationObserver?.disconnect();
  }

  private scheduleViewChange(hash: string) {
    // Use its own timer — never cancelled by DOM mutations
    if (this.viewChangeTimer !== null) clearTimeout(this.viewChangeTimer);
    this.viewChangeTimer = window.setTimeout(() => {
      this.viewChangeTimer = null;
      this.controller.onViewChange(hash);
    }, 150);
  }

  private scheduleRender() {
    if (this.renderTimer !== null) clearTimeout(this.renderTimer);
    this.renderTimer = window.setTimeout(() => {
      this.renderTimer = null;
      this.controller.onDomUpdate();
    }, 400);
  }
}
