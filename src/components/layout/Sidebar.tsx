// src/components/layout/Sidebar.tsx
import React from 'react';
import { exportAll } from '../../data/storage';
import type { Student, AdmissionTestResult, LessonLog, GradeRecord, Payment } from '../../types';

type PageId = string;

const NAV_ITEMS = [
  { id: 'dashboard',  icon: '▦', label: '대시보드' },
  { id: 'students',   icon: '◎', label: '학생관리' },
  { id: 'marketing',  icon: '◈', label: '마케팅' },
  { id: 'admission',  icon: '◇', label: '입학테스트' },
  { id: 'lessons',    icon: '◑', label: '수업기록' },
  { id: 'grades',     icon: '◉', label: '성적관리' },
  { id: 'payments',   icon: '◰', label: '결제관리' },
];

interface Props {
  page: PageId;
  setPage: (p: PageId) => void;
  badges?: Partial<Record<PageId, number>>;
  students: Student[];
  tests: AdmissionTestResult[];
  lessons: LessonLog[];
  grades: GradeRecord[];
  payments: Payment[];
}

export default function Sidebar({ page, setPage, badges, students, tests, lessons, grades, payments }: Props) {
  const isActive = (id: string) =>
    page === id ||
    (page === 'detail' && id === 'students') ||
    (page === 'admission_test' && id === 'admission');

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-sub">BEYOND THIS</div>
        <div className="sidebar-logo-name">Management</div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(n => (
          <button
            key={n.id}
            className={`nav-item${isActive(n.id) ? ' active' : ''}`}
            onClick={() => setPage(n.id)}
          >
            <span className="nav-item-left">
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </span>
            {badges?.[n.id] ? (
              <span className="nav-badge">{badges[n.id]}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-export"
          onClick={() => exportAll(students, tests, lessons, grades, payments)}
          title="전체 데이터 JSON 백업"
        >
          📤 데이터 내보내기
        </button>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', marginTop: 6, textAlign: 'center' }}>
          이보다 더 영어교습소
        </div>
      </div>
    </div>
  );
}
