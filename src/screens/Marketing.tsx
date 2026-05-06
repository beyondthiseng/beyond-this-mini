// src/screens/Marketing.tsx
import React, { useState, useMemo } from 'react';
import { Badge, Btn, Card, Page } from '../components/ui';
import type { Student } from '../types';
import { tod } from '../data/storage';
import { SMS_TEMPLATES } from '../data/levelTemplates';

interface Props {
  students: Student[];
  setPage: (p: string) => void;
  setSelId: (id: string) => void;
}

export default function Marketing({ students, setPage, setSelId }: Props) {
  const [sf, setSf] = useState('전체');
  const [sort, setSort] = useState<'next' | 'last'>('next');
  const [copied, setCopied] = useState<string | null>(null);

  const targets = useMemo(() => {
    let list = students.filter(s => ['문의','테스트예정','테스트완료','미등록','휴원','퇴원'].includes(s.status));
    if (sf !== '전체') list = list.filter(s => s.status === sf);
    return [...list].sort((a, b) => {
      if (sort === 'next') return (a.nextContactDate || '9999').localeCompare(b.nextContactDate || '9999');
      return (b.lastContactDate || '').localeCompare(a.lastContactDate || '');
    });
  }, [students, sf, sort]);

  const overdue = targets.filter(s => s.nextContactDate && s.nextContactDate <= tod()).length;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key); setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  };

  return (
    <Page title="마케팅 · 연락 관리">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 12, height: 'calc(100% - 48px)' }}>
        {/* 연락 대상 목록 */}
        <div style={{ overflowY: 'auto' }}>
          <div className="filter-bar" style={{ marginBottom: 10 }}>
            <select value={sf} onChange={e => setSf(e.target.value)}>
              <option>전체</option>
              {['문의','테스트예정','테스트완료','미등록','휴원','퇴원'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as 'next' | 'last')}>
              <option value="next">다음연락 빠른순</option>
              <option value="last">마지막연락 최신순</option>
            </select>
            {overdue > 0 && (
              <span style={{ fontSize: 11, color: '#B91C1C', fontWeight: 700, background: '#FEF2F2', padding: '3px 9px', borderRadius: 10 }}>
                ⚠ 연락 지연 {overdue}명
              </span>
            )}
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>{['이름','상태','가능성','다음연락','마지막연락'].map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {targets.map(s => {
                  const over = s.nextContactDate && s.nextContactDate <= tod();
                  return (
                    <tr key={s.id} onClick={() => { setSelId(s.id); setPage('detail'); }}
                      style={{ background: over ? '#FFF5F5' : undefined }}>
                      <td style={{ fontWeight: 700 }}>{s.name}</td>
                      <td><Badge status={s.status} /></td>
                      <td style={{
                        fontSize: 12, fontWeight: 700,
                        color: s.enrollProbability === '높음' ? '#15803D' : s.enrollProbability === '낮음' ? '#B91C1C' : '#6B7280'
                      }}>{s.enrollProbability || '-'}</td>
                      <td style={{ fontSize: 12, color: over ? '#EF4444' : '#374151', fontWeight: over ? 700 : 400 }}>
                        {s.nextContactDate || '-'}
                      </td>
                      <td style={{ fontSize: 12, color: '#94A3B8' }}>{s.lastContactDate || '-'}</td>
                    </tr>
                  );
                })}
                {targets.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94A3B8', padding: 20 }}>해당 학생 없음</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>

        {/* 문자 템플릿 */}
        <div style={{ overflowY: 'auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
            📋 문자 템플릿 <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 400 }}>— 복사 후 이름/날짜 수정</span>
          </div>
          {SMS_TEMPLATES.map((tpl, i) => (
            <Card key={i} style={{ marginBottom: 8, padding: '10px 13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{tpl.title}</div>
                <Btn small variant="ghost" onClick={() => copy(tpl.body, String(i))}
                  style={{ background: copied === String(i) ? '#F0FDF4' : undefined, color: copied === String(i) ? '#15803D' : undefined }}>
                  {copied === String(i) ? '✓ 복사됨' : '복사'}
                </Btn>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.7 }}>{tpl.body}</div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}
