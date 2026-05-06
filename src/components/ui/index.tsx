// src/components/ui/index.tsx
import React from 'react';
import { STATUS_STYLE } from '../../data/levelTemplates';

// ── Badge ────────────────────────────────────────────────────────
export function Badge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

// ── Field ────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export function Field({ label, children, style }: FieldProps) {
  return (
    <div className="field" style={style}>
      <label>{label}</label>
      {children}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────
export function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={`card ${className ?? ''}`} style={style}>{children}</div>;
}

// ── Button ───────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'ghost' | 'danger' | 'icon';
interface BtnProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: BtnVariant;
  small?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  title?: string;
}
export function Btn({ onClick, children, variant = 'primary', small, disabled, style, title }: BtnProps) {
  return (
    <button
      className={`btn btn-${variant}${small ? ' btn-sm' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
    >
      {children}
    </button>
  );
}

// ── ScoreDots (1~5) ──────────────────────────────────────────────
export function ScoreDots({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="score-dots">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          className={`score-dot${value >= n ? ' filled' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────
export function Page({
  title, action, children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────
export function Modal({ onClose, children, width = 360 }: { onClose: () => void; children: React.ReactNode; width?: number }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab-btn${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
