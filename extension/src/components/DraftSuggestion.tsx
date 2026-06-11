import React, { useState, useRef, useEffect } from 'react';
import type { CommitmentType } from '../types';
import { EditIcon, CloseIcon, CheckIcon, CopyIcon } from './Icons';

interface Props {
  draft: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  commitmentSummary: string;
  commitmentType: CommitmentType;
  userName?: string;
  avatarUrl?: string;
  avatarBgColor?: string;
  avatarSize?: number;
  gutterWidth?: number;
  iconUrl?: string;
  onUse: (draft: string) => void;
  onDismiss: () => void;
}

function commitmentPillColor(type: CommitmentType) {
  switch (type) {
    case 'deadline':    return { bg: '#fef0c7', text: '#b45309', border: '#f9ab00' };
    case 'promise':     return { bg: '#e6f4ea', text: '#137333', border: '#34a853' };
    case 'follow-up':   return { bg: '#f0e6ff', text: '#6200ee', border: '#9334e6' };
    case 'action-item': return { bg: '#f0e6ff', text: '#6200ee', border: '#9334e6' };
    case 'meeting':     return { bg: '#e8f0fe', text: '#1557b0', border: '#4285f4' };
    default:            return { bg: '#f1f3f4', text: '#5f6368', border: '#dadce0' };
  }
}

export function DraftSuggestion({ draft, senderName, senderEmail, subject, commitmentSummary, commitmentType, userName, avatarUrl, avatarBgColor = '#4285f4', avatarSize = 40, gutterWidth = 52, iconUrl, onUse, onDismiss }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState(draft);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pill = commitmentPillColor(commitmentType);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedDraft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const avatarInitial = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <div className="rex-draft-panel-wrapper">
      <div className="rex-draft-avatar-col" style={{ width: gutterWidth }}>
        {avatarUrl
          ? <img className="rex-draft-avatar" src={avatarUrl} alt={userName || 'You'} style={{ width: avatarSize, height: avatarSize }} />
          : <div className="rex-draft-avatar" style={{ background: avatarBgColor, width: avatarSize, height: avatarSize }}>{avatarInitial}</div>
        }
      </div>

      <div className="rex-draft-panel">
        {/* Header */}
        <div className="rex-dp-header">
          <div className="rex-dp-header-left">
            {iconUrl
              ? <img src={iconUrl} width={22} height={22} style={{ borderRadius: 6, flexShrink: 0 }} />
              : null
            }
            <span className="rex-dp-title">Rex drafted a reply</span>
            {editing && <span className="rex-dp-preview-badge" style={{ background: '#fef3c7', color: '#92400e' }}>Editing</span>}
          </div>
          <div className="rex-dp-header-right">
            {editing
              ? <button className="rex-dp-icon-btn" title="Done editing" onClick={() => setEditing(false)}>
                  <CheckIcon size={14} color="#137333" />
                </button>
              : <button className="rex-dp-icon-btn" title="Edit draft" onClick={() => setEditing(true)}>
                  <EditIcon size={14} color="#5f6368" />
                </button>
            }
            <button className="rex-dp-icon-btn" onClick={onDismiss} title="Close">
              <CloseIcon size={14} color="#5f6368" />
            </button>
          </div>
        </div>

        {/* Meta fields */}
        <div className="rex-dp-fields">
          <div className="rex-dp-field">
            <span className="rex-dp-field-label">For:</span>
            <span className="rex-dp-for-pill" style={{ background: pill.bg, color: pill.text, borderColor: pill.border }}>
              {commitmentSummary}
            </span>
          </div>
          <div className="rex-dp-field">
            <span className="rex-dp-field-label">To</span>
            <span className="rex-dp-field-value">{senderName}{senderEmail ? ` <${senderEmail}>` : ''}</span>
          </div>
          <div className="rex-dp-field">
            <span className="rex-dp-field-label">Subject</span>
            <span className="rex-dp-field-value">{subject}</span>
          </div>
        </div>

        {/* Draft body — read-only or editable */}
        {editing
          ? <textarea
              ref={textareaRef}
              className="rex-dp-body-edit"
              value={editedDraft}
              onChange={e => setEditedDraft(e.target.value)}
            />
          : <div className="rex-dp-body">{editedDraft}</div>
        }

        {/* Footer */}
        <div className="rex-dp-footer">
          <div className="rex-dp-footer-actions">
            <button className="rex-dp-insert-btn" onClick={() => onUse(editedDraft)}>
              Insert into reply
            </button>
            <button className="rex-dp-copy-btn" onClick={handleCopy}>
              <CopyIcon size={13} color="#3c4043" />
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
