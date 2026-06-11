import React, { useState } from 'react';
import type { Commitment, CommitmentType } from '../types';
import {
  ClockIcon, CalendarIcon, ReplyIcon,
  CheckIcon, ChevronDownIcon, ChevronUpIcon,
} from './Icons';

interface CommitmentBannerProps {
  commitments: Commitment[];
  totalCount: number;
  onViewThread: (threadId: string) => void;
  onMarkComplete: (id: string) => void;
  iconUrl?: string;
}

function typeColor(type: CommitmentType): string {
  switch (type) {
    case 'deadline':    return '#f59e0b';
    case 'promise':     return '#10b981';
    case 'meeting':     return '#3b82f6';
    case 'follow-up':   return '#8b5cf6';
    case 'action-item': return '#7c3aed';
    case 'unanswered':  return '#ec4899';
    default:            return '#6b7280';
  }
}

function TypeIcon({ type }: { type: CommitmentType }) {
  const color = typeColor(type);
  const p = { size: 13 as const, color };
  if (type === 'deadline')    return <ClockIcon {...p} />;
  if (type === 'meeting')     return <CalendarIcon {...p} />;
  if (type === 'follow-up' || type === 'unanswered') return <ReplyIcon {...p} />;
  return <CheckIcon {...p} />;
}

function CommitmentCard({ c, onClick }: { c: Commitment; onClick: () => void }) {
  const accent = typeColor(c.type);
  return (
    <div className="rex-banner-card" onClick={onClick}>
      <div className="rex-banner-card-top">
        <span className="rex-banner-card-icon" style={{ background: `${accent}22` }}>
          <TypeIcon type={c.type} />
        </span>
        <span className="rex-banner-card-summary">{c.summary}</span>
      </div>
      <div className="rex-banner-card-footer">
        <span className="rex-banner-card-due" style={{ color: accent }}>{c.dueText || 'No due date'}</span>
        {c.sender && <span className="rex-banner-card-sender">{c.sender}</span>}
      </div>
    </div>
  );
}

export function CommitmentBanner({ commitments, totalCount, onViewThread, iconUrl }: CommitmentBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const top = commitments.slice(0, 4);

  return (
    <div className="rex-banner">
      <div className="rex-banner-header">
        <div className="rex-banner-header-left">
          {iconUrl && <img src={iconUrl} width={20} height={20} style={{ flexShrink: 0 }} />}
          <div>
            <div className="rex-banner-title">Important commitments</div>
            <div className="rex-banner-subtitle">{totalCount} tracked commitment{totalCount !== 1 ? 's' : ''} waiting for action</div>
          </div>
        </div>
        <button className="rex-banner-toggle-btn" onClick={() => setExpanded(e => !e)}>
          View all ({totalCount})
          {expanded ? <ChevronUpIcon size={12} color="#a78bfa" /> : <ChevronDownIcon size={12} color="#a78bfa" />}
        </button>
      </div>

      <div className="rex-banner-cards">
        {top.map(c => (
          <CommitmentCard key={c.id} c={c} onClick={() => onViewThread(c.threadId)} />
        ))}
      </div>

      {expanded && (
        <div className="rex-banner-expanded">
          {commitments.map(c => {
            const accent = typeColor(c.type);
            return (
              <div key={c.id} className="rex-banner-exp-item" onClick={() => onViewThread(c.threadId)}>
                <span className="rex-banner-exp-icon" style={{ background: `${accent}22` }}>
                  <TypeIcon type={c.type} />
                </span>
                <span className="rex-banner-exp-summary">{c.summary}</span>
                <span className="rex-banner-exp-due" style={{ color: accent }}>{c.dueText || 'No due date'}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
