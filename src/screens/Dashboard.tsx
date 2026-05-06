// src/screens/Dashboard.tsx
import React from 'react';
import { Card, Badge } from '../components/ui';
import type { Student, Payment } from '../types';
import { tod, toYM } from '../data/storage';

interface Props {
  students: Student[];
  payments: Payment[];
  setPage: (p: string) => void;
  setSelId: (id: string) => void;
}

export default function Dashboard({ students, payments, setPage, setSelId }: Props) {
  const enrolled  = students.filter(s => s.status === '재원생').length;
  const inquiries = students.filter(s => ['문의','테스트예정','테스트완료','미등록'].includes(s.status)).length;
  const testSch   = students.filter(s => s.status === '테스트예정').length;
  const unpaid    = payments.filter(p => p.month === toYM() && !p.isPaid);
  const todayC    = students.filter(s => s.nextContactDate && s.nextContactDate <= tod());
  const recent    = [...students]
    .filter(s => s.enrollDate)
    .sort((a, b) => b.enrollDate.localeCompare(a.enrollDate))
    .slice(0, 5);

  const stats = [
    { label: '전체 인원', value: students.length, color: '#4A9E8E' },
    { label: '재원생',    value: enrolled,         color: '#3B82F6' },
    { label: '문의/미등록', value: inquiries,       color: '#F59E0B' },
    { label: '이번달 미납', value: unpaid.length,  color: '#EF4444' },
  ];

  const goDetail = (id: string) => { setSelId(id); setPage('detail'); };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">대시보드</h1>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>{tod()} 기준</span>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-unit">명</div>
          </div>
        ))}
      </div>

      {/* Two-column panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {/* 오늘 연락 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 13, fontWeight: 700, color: '#374151' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            오늘 연락 필요 ({todayC.length})
          </div>
          {todayC.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94A3B8' }}>없음</p>
          ) : todayC.map(s => (
            <div key={s.id} onClick={() => goDetail(s.id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid #F1F5F9', cursor: 'pointer' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name} <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.grade}</span></span>
              <Badge status={s.status} />
            </div>
          ))}
        </Card>

        {/* 미납 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 13, fontWeight: 700, color: '#374151' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            이번달 미납 ({unpaid.length})
          </div>
          {unpaid.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94A3B8' }}>없음</p>
          ) : unpaid.map(p => {
            const st = students.find(s => s.id === p.studentId);
            return (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid #F1F5F9' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{st?.name ?? '?'}</span>
                <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 700 }}>{p.amount.toLocaleString()}원</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* 상태별 + 최근 등록 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 10 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>상태별 현황</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['문의','테스트예정','테스트완료','미등록','재원생','휴원','퇴원'].map(st => {
              const cnt = students.filter(s => s.status === st).length;
              return (
                <div key={st} onClick={() => setPage('students')}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#F8FAFC', borderRadius: 14, border: '0.5px solid #E2E8F0' }}>
                  <Badge status={st} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4A9E8E', display: 'inline-block' }} />
            최근 등록
          </div>
          {recent.map(s => (
            <div key={s.id} onClick={() => goDetail(s.id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid #F1F5F9', cursor: 'pointer' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.enrollDate}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
