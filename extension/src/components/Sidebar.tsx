import React, { useState } from 'react';
import type { Commitment, CommitmentType } from '../types';
import {
  SparkleIcon, ClockIcon, FlagIcon, DocumentIcon, CalendarIcon,
  ReplyIcon, QuestionIcon, CheckIcon, CloseIcon, EditIcon, TaskIcon, DotsIcon,
  ThumbsUpIcon, ThumbsDownIcon, CopyIcon,
} from './Icons';

interface Props {
  commitments: Commitment[];
  senderName: string;
  senderEmail: string;
  draft?: string;
  draftCommitment?: Commitment;
  draftSubject?: string;
  generatingForId?: string;
  onMarkComplete: (id: string) => void;
  onAddReminder: (c: Commitment) => void;
  onDraftFollowUp: (c: Commitment) => void;
  onUseDraft: (draft: string) => void;
  onClose: () => void;
}

function itemColors(type: CommitmentType) {
  switch (type) {
    case 'deadline':    return { border: '#f9ab00', icon: '#e37400', iconBg: '#fef0c7', dateBg: '#fef0c7', dateText: '#b45309' };
    case 'promise':     return { border: '#34a853', icon: '#137333', iconBg: '#d4edda', dateBg: '#e6f4ea', dateText: '#137333' };
    case 'follow-up':   return { border: '#ea4335', icon: '#c5221f', iconBg: '#fce8e6', dateBg: '#fce8e6', dateText: '#c5221f' };
    case 'action-item': return { border: '#9334e6', icon: '#6200ee', iconBg: '#ede7f6', dateBg: '#f0e6ff', dateText: '#6200ee' };
    case 'meeting':     return { border: '#4285f4', icon: '#1557b0', iconBg: '#e8f0fe', dateBg: '#e8f0fe', dateText: '#1557b0' };
    case 'unanswered':  return { border: '#ea4335', icon: '#c5221f', iconBg: '#fce8e6', dateBg: '#fce8e6', dateText: '#c5221f' };
    default:            return { border: '#dadce0', icon: '#5f6368', iconBg: '#e8eaed', dateBg: '#f1f3f4', dateText: '#5f6368' };
  }
}

function ItemIcon({ type, color }: { type: CommitmentType; color: string }) {
  const p = { size: 13 as const, color };
  switch (type) {
    case 'deadline':    return <ClockIcon {...p} />;
    case 'promise':     return <FlagIcon {...p} />;
    case 'follow-up':   return <ReplyIcon {...p} />;
    case 'action-item': return <DocumentIcon {...p} />;
    case 'meeting':     return <CalendarIcon {...p} />;
    case 'unanswered':  return <QuestionIcon {...p} />;
    default:            return <ClockIcon {...p} />;
  }
}

function actionLabel(type: CommitmentType): string {
  if (type === 'meeting')     return 'Add to calendar';
  if (type === 'action-item') return 'Create task';
  return 'Draft follow-up';
}

function pillarColor(type: CommitmentType) {
  switch (type) {
    case 'deadline':    return { bg: '#fef0c7', text: '#b45309', border: '#f9ab00' };
    case 'promise':     return { bg: '#e6f4ea', text: '#137333', border: '#34a853' };
    case 'follow-up':   return { bg: '#fce8e6', text: '#c5221f', border: '#ea4335' };
    case 'action-item': return { bg: '#f0e6ff', text: '#6200ee', border: '#9334e6' };
    case 'meeting':     return { bg: '#e8f0fe', text: '#1557b0', border: '#4285f4' };
    default:            return { bg: '#f1f3f4', text: '#5f6368', border: '#dadce0' };
  }
}

export function Sidebar({
  commitments, senderName, senderEmail,
  draft, draftCommitment, draftSubject,
  generatingForId,
  onMarkComplete, onAddReminder, onDraftFollowUp,
  onUseDraft, onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<'commitments' | 'followups' | 'insights'>('commitments');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [copiedDraft, setCopiedDraft] = useState(false);

  const followUps = commitments.filter(c => c.type === 'follow-up' || c.type === 'unanswered');

  const handleComplete = (id: string) => {
    setCompletedIds(s => new Set([...s, id]));
    onMarkComplete(id);
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft).then(() => {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    });
  };

  const renderCommitmentList = (list: Commitment[]) => (
    list.length === 0
      ? <div className="rex-sb-empty">No items detected.</div>
      : list.map(c => {
          const s = itemColors(c.type);
          const done = completedIds.has(c.id);
          const generating = generatingForId === c.id;
          return (
            <div key={c.id} className="rex-sb-item" style={{ borderLeftColor: s.border, opacity: done ? 0.5 : 1 }}>
              <span className="rex-sb-item-icon" style={{ background: s.iconBg }}>
                <ItemIcon type={c.type} color={s.icon} />
              </span>
              <div className="rex-sb-item-body">
                <div className="rex-sb-item-summary" style={{ textDecoration: done ? 'line-through' : 'none' }}>
                  {c.summary}
                </div>
                <div className="rex-sb-item-sub">
                  {c.type === 'action-item' ? `Action item from ${senderName}` : `to ${senderName}`}
                </div>
              </div>
              <div className="rex-sb-item-right">
                <span className="rex-sb-item-date" style={{ background: s.dateBg, color: s.dateText }}>
                  {c.dueText || 'No due date'}
                </span>
                {!done && (
                  <button
                    className="rex-sb-action-pill"
                    onClick={() => onDraftFollowUp(c)}
                    disabled={generating}
                  >
                    {generating ? 'Generating…' : actionLabel(c.type)}
                  </button>
                )}
                <button className="rex-sb-icon-btn" onClick={() => handleComplete(c.id)} title="Mark complete">
                  <CheckIcon size={13} color={done ? '#137333' : '#9aa0a6'} />
                </button>
                <button className="rex-sb-icon-btn">
                  <DotsIcon size={14} color="#9aa0a6" />
                </button>
              </div>
            </div>
          );
        })
  );

  return (
    <div className="rex-sidebar">
      {/* Header */}
      <div className="rex-sb-header">
        <div className="rex-sb-header-left">
          <div className="rex-sb-logo">
            <CheckIcon size={13} color="#fff" />
          </div>
          <span className="rex-sb-title">Rex</span>
        </div>
        <div className="rex-sb-header-right">
          <button className="rex-sb-icon-btn" onClick={onClose} title="Close">
            <CloseIcon size={14} color="#5f6368" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="rex-sb-tabs">
        {(['commitments', 'followups', 'insights'] as const).map(tab => (
          <button
            key={tab}
            className={`rex-sb-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'commitments' && <>Commitments{commitments.length > 0 && <span className="rex-sb-tab-badge">{commitments.length}</span>}</>}
            {tab === 'followups'   && <>Follow-ups{followUps.length > 0 && <span className="rex-sb-tab-badge">{followUps.length}</span>}</>}
            {tab === 'insights'    && 'Insights'}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="rex-sb-content">

        {activeTab === 'commitments' && (
          <>
            {/* Detected section */}
            <div className="rex-sb-detected">
              <SparkleIcon size={13} color="#1a73e8" />
              <div>
                <div className="rex-sb-detected-title">Detected in this email</div>
                <div className="rex-sb-detected-sub">
                  We found {commitments.length} commitment{commitments.length !== 1 ? 's' : ''}.
                </div>
              </div>
            </div>

            {renderCommitmentList(commitments)}

            <button className="rex-sb-view-all">View all in dashboard →</button>
          </>
        )}

        {activeTab === 'followups' && renderCommitmentList(followUps)}

        {activeTab === 'insights' && (
          <div className="rex-sb-empty">Insights coming soon.</div>
        )}

        {/* Draft panel, shown inline in sidebar */}
        {draft && draftCommitment && (
          <div className="rex-sb-draft-section">
            {/* Draft header */}
            <div className="rex-dp-header">
              <div className="rex-dp-header-left">
                <SparkleIcon size={13} color="#7c3aed" />
                <span className="rex-dp-title">AI Draft Follow-up</span>
                <span className="rex-dp-preview-badge">Preview</span>
              </div>
            </div>

            {/* For / To / Subject */}
            <div className="rex-dp-fields">
              {(() => {
                const pill = pillarColor(draftCommitment.type);
                return (
                  <div className="rex-dp-field">
                    <span className="rex-dp-field-label">For:</span>
                    <span className="rex-dp-for-pill" style={{ background: pill.bg, color: pill.text, borderColor: pill.border }}>
                      {draftCommitment.summary}
                    </span>
                  </div>
                );
              })()}
              <div className="rex-dp-field">
                <span className="rex-dp-field-label">To</span>
                <span className="rex-dp-field-value">{senderName}{senderEmail ? ` <${senderEmail}>` : ''}</span>
              </div>
              <div className="rex-dp-field">
                <span className="rex-dp-field-label">Subject</span>
                <span className="rex-dp-field-value">{draftSubject}</span>
              </div>
            </div>

            {/* Body */}
            <div className="rex-dp-body">{draft}</div>

            {/* Footer */}
            <div className="rex-dp-footer">
              <div className="rex-dp-footer-actions">
                <button className="rex-dp-insert-btn" onClick={() => onUseDraft(draft)}>
                  Insert into reply
                </button>
                <button className="rex-dp-copy-btn" onClick={handleCopy}>
                  <CopyIcon size={12} color="#3c4043" />
                  {copiedDraft ? 'Copied!' : 'Copy to clipboard'}
                </button>
              </div>
              <div className="rex-dp-feedback">
                <button className="rex-sb-icon-btn" title="Good draft"><ThumbsUpIcon size={13} color="#5f6368" /></button>
                <button className="rex-sb-icon-btn" title="Bad draft"><ThumbsDownIcon size={13} color="#5f6368" /></button>
                <button className="rex-sb-icon-btn"><DotsIcon size={13} color="#5f6368" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
