// src/screens/StudentDetail.tsx
import React, { useState, useEffect } from 'react';
import { Badge, Btn, Card, Field, Tabs } from '../components/ui';
import type { Student } from '../types';
import { gid, tod, saveStudents } from '../data/storage';
import { STUDENT_STATUS_LIST } from '../data/levelTemplates';

interface Props {
  sid: string;
  students: Student[];
  setStudents: (s: Student[]) => void;
  setPage: (p: string) => void;
}

// 뷰/편집 인라인 렌더 헬퍼 (컴포넌트 아님 — 함수로 호출)
function renderField(
  editing: boolean,
  value: string,
  onChange: (v: string) => void,
  type = 'text'
) {
  if (editing) {
    return (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }
  return (
    <div className={`view-val${!value ? ' empty' : ''}`}>
      {value || '-'}
    </div>
  );
}

export default function StudentDetail({ sid, students, setStudents, setPage }: Props) {
  const st = students.find(s => s.id === sid);
  const [form, setForm] = useState<Student | null>(st ?? null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('info');
  const [newMemo, setNewMemo] = useState('');

  useEffect(() => { if (st) setForm({ ...st }); setEditing(false); }, [sid]);

  if (!st || !form) return <div className="page">학생 없음</div>;

  const upd = (f: keyof Student, v: unknown) =>
    setForm(p => p ? { ...p, [f]: v } : p);

  const persist = (data: Student) => {
    const next = students.map(s => s.id === sid ? data : s);
    setStudents(next); saveStudents(next);
  };

  const saveForm = () => { persist({ ...form, updatedAt: tod() }); setEditing(false); };

  const deleteStudent = () => {
    if (!confirm(`"${st.name}" 학생을 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`)) return;
    const next = students.filter(s => s.id !== sid);
    setStudents(next); saveStudents(next);
    setPage('students');
  };

  const chStatus = (v: string) => {
    const nd = { ...form, status: v as Student['status'], updatedAt: tod() };
    setForm(nd); persist(nd);
  };

  const addMemo = () => {
    if (!newMemo.trim()) return;
    const m = { id: gid(), date: tod(), content: newMemo.trim() };
    const nd = { ...form, memos: [m, ...(form.memos ?? [])], updatedAt: tod() };
    setForm(nd); persist(nd); setNewMemo('');
  };

  const TABS = [
    { id: 'info',    label: '기본정보' },
    { id: 'memo',    label: '상담메모' },
    { id: 'contact', label: '연락관리' },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Btn variant="ghost" small onClick={() => setPage('students')}>← 목록</Btn>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 className="page-title">{st.name}</h1>
            <Badge status={form.status} />
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>{st.grade} · {st.school}</div>
        </div>
        <select
          value={form.status}
          onChange={e => chStatus(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer' }}
        >
          {STUDENT_STATUS_LIST.map(s => <option key={s}>{s}</option>)}
        </select>
        <Btn variant="danger" small onClick={deleteStudent}>삭제</Btn>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* ── 기본정보 ── */}
      {tab === 'info' && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
            {editing ? (
              <>
                <Btn variant="ghost" small onClick={() => { setForm({ ...st }); setEditing(false); }}>취소</Btn>
                <Btn small onClick={saveForm}>저장</Btn>
              </>
            ) : (
              <Btn variant="ghost" small onClick={() => setEditing(true)}>수정</Btn>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="이름 (한국어)">
              {renderField(editing, form.name || '', v => upd('name', v))}
            </Field>
            <Field label="이름 (영어)">
              {renderField(editing, form.nameEn || '', v => upd('nameEn', v))}
            </Field>
            <Field label="성별">
              {editing
                ? <select value={form.gender || ''} onChange={e => upd('gender', e.target.value)}>
                    <option value="">-</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                : <div className={`view-val${!form.gender ? ' empty' : ''}`}>{form.gender || '-'}</div>
              }
            </Field>
            <Field label="생년월일">
              {renderField(editing, form.birthdate || '', v => upd('birthdate', v), 'date')}
            </Field>
            <Field label="학년">
              {renderField(editing, form.grade || '', v => upd('grade', v))}
            </Field>
            <Field label="학교">
              {renderField(editing, form.school || '', v => upd('school', v))}
            </Field>
            <Field label="학생 연락처">
              {renderField(editing, form.studentPhone || '', v => upd('studentPhone', v))}
            </Field>
            <Field label="학부모 연락처">
              {renderField(editing, form.parentPhone || '', v => upd('parentPhone', v))}
            </Field>
            <Field label="비상 연락처">
              {renderField(editing, form.emergencyPhone || '', v => upd('emergencyPhone', v))}
            </Field>
            <Field label="이메일">
              {renderField(editing, form.email || '', v => upd('email', v), 'email')}
            </Field>
            <Field label="레벨">
              {renderField(editing, form.level || '', v => upd('level', v))}
            </Field>
            <Field label="등록일">
              {renderField(editing, form.enrollDate || '', v => upd('enrollDate', v), 'date')}
            </Field>
          </div>
          <Field label="주소">
            {renderField(editing, form.address || '', v => upd('address', v))}
          </Field>

          <Field label="특이사항">
            {editing
              ? <textarea
                  value={form.notes || ''}
                  onChange={e => upd('notes', e.target.value)}
                  rows={3}
                />
              : <div className={`view-val${!form.notes ? ' empty' : ''}`} style={{ lineHeight: 1.7 }}>
                  {form.notes || '-'}
                </div>
            }
          </Field>
        </Card>
      )}

      {/* ── 상담메모 ── */}
      {tab === 'memo' && (
        <div>
          <Card style={{ marginBottom: 10 }}>
            <textarea
              value={newMemo}
              onChange={e => setNewMemo(e.target.value)}
              placeholder="상담 내용, 통화 내용, 특이사항..."
              rows={3}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', resize: 'vertical', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Btn small onClick={addMemo}>저장</Btn>
            </div>
          </Card>

          {(form.memos ?? []).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: 12, padding: 16 }}>메모 없음</p>
          ) : (form.memos ?? []).map(m => (
            <Card key={m.id} style={{ marginBottom: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 5 }}>{m.date}</div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{m.content}</div>
            </Card>
          ))}
        </div>
      )}

      {/* ── 연락관리 ── */}
      {tab === 'contact' && (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="등록 가능성">
              <select value={form.enrollProbability || ''} onChange={e => upd('enrollProbability', e.target.value)}>
                <option value="">-</option>
                {['높음','보통','낮음'].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="문의 경로">
              <select value={form.inquiryRoute || ''} onChange={e => upd('inquiryRoute', e.target.value)}>
                {['블로그','네이버지도','소개','전단지','전화','기타'].map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="마지막 연락일">
              <input type="date" value={form.lastContactDate || ''} onChange={e => upd('lastContactDate', e.target.value)} />
            </Field>
            <Field label="다음 연락 예정일">
              <input type="date" value={form.nextContactDate || ''} onChange={e => upd('nextContactDate', e.target.value)} />
            </Field>
          </div>
          <Field label="미등록/퇴원 사유">
            <input value={form.leaveReason || ''} onChange={e => upd('leaveReason', e.target.value)} placeholder="해당하는 경우 입력" />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn small onClick={saveForm}>저장</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
