import React, { useState } from 'react';
import type { Commitment, CommitmentType } from '../types';
import {
  ClockIcon, FlagIcon, DocumentIcon, CalendarIcon, ReplyIcon, CheckIcon, BellIcon,
} from './Icons';

interface Props {
  commitments: Commitment[];
  savedIds?: Set<string>;
  generatingForId?: string;
  onAddReminder: (commitment: Commitment) => void;
  onMarkComplete: (id: string) => void;
  onDraftFollowUp: (commitment: Commitment) => void;
}

function rowColors(type: CommitmentType) {
  const yellow = { border: '#fcd34d', bg: '#fffbeb', icon: '#d97706', iconBg: '#fef3c7', dateBg: '#fef3c7', dateText: '#92400e' };
  const green  = { border: '#86efac', bg: '#f0fdf4', icon: '#16a34a', iconBg: '#dcfce7', dateBg: '#dcfce7', dateText: '#166534' };
  const purple = { border: '#c4b5fd', bg: '#f5f3ff', icon: '#7c3aed', iconBg: '#ede9fe', dateBg: '#ede9fe', dateText: '#6d28d9' };
  switch (type) {
    case 'deadline':    return yellow;
    case 'promise':     return green;
    case 'follow-up':   return purple;
    case 'action-item': return purple;
    case 'meeting':     return green;
    case 'unanswered':  return purple;
    default:            return { border: '#e5e7eb', bg: '#f9fafb', icon: '#6b7280', iconBg: '#f3f4f6', dateBg: '#f3f4f6', dateText: '#374151' };
  }
}

function RowIcon({ type, color }: { type: CommitmentType; color: string }) {
  const p = { size: 14 as const, color };
  switch (type) {
    case 'deadline':    return <ClockIcon {...p} />;
    case 'promise':     return <FlagIcon {...p} />;
    case 'follow-up':   return <ReplyIcon {...p} />;
    case 'action-item': return <DocumentIcon {...p} />;
    case 'meeting':     return <CalendarIcon {...p} />;
    case 'unanswered':  return <ReplyIcon {...p} />;
    default:            return <ClockIcon {...p} />;
  }
}

export function ThreadCommitmentCard({ commitments, savedIds, generatingForId, onAddReminder, onMarkComplete, onDraftFollowUp }: Props) {
  const [allAdded, setAllAdded] = useState(savedIds != null && commitments.every(c => savedIds.has(c.id)));
  const [allDone, setAllDone] = useState(false);

  if (commitments.length === 0) return null;

  const handleAddAll = () => {
    setAllAdded(true);
    commitments.forEach(c => onAddReminder(c));
  };

  const handleCompleteAll = () => {
    setAllDone(true);
    commitments.forEach(c => onMarkComplete(c.id));
  };

  // Pick the first commitment for draft follow-up
  const firstCommitment = commitments[0];
  const generating = generatingForId === firstCommitment.id;

  return (
    <div className="rex-rows-wrapper">
      {commitments.map(c => {
        const s = rowColors(c.type);
        return (
          <div
            key={c.id}
            className="rex-row"
            style={{ borderColor: s.border, background: s.bg, opacity: allDone ? 0.55 : 1 }}
          >
            <span className="rex-row-icon" style={{ background: s.iconBg }}>
              <RowIcon type={c.type} color={s.icon} />
            </span>
            <span className="rex-row-summary" style={{ textDecoration: allDone ? 'line-through' : 'none' }} title={c.detail}>
              {c.summary}
            </span>
            <span className="rex-row-date" style={{ background: s.dateBg, color: s.dateText }}>
              {c.dueText || 'No due date'}
            </span>
          </div>
        );
      })}

      {/* Single action bar for all commitments */}
      {!allDone && (
        <div className="rex-row-actions-bar">
          <button className="rex-row-link" onClick={handleCompleteAll}>
            <CheckIcon size={12} color="#137333" />
            Mark all complete
          </button>

          <button
            className="rex-row-link"
            onClick={handleAddAll}
            disabled={allAdded}
            style={{ opacity: allAdded ? 0.5 : 1, cursor: allAdded ? 'default' : 'pointer' }}
          >
            <BellIcon size={12} color="#5f6368" />
            {allAdded ? 'Added to inbox' : 'Add reminder'}
          </button>

          <button className="rex-row-draft-pill" onClick={() => onDraftFollowUp(firstCommitment)} disabled={generating}>
            <ReplyIcon size={13} color="#7c3aed" />
            {generating ? 'Generating…' : 'Draft follow-up'}
          </button>
        </div>
      )}
    </div>
  );
}
