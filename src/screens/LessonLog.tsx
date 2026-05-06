// src/screens/LessonLog.tsx
import React, { useState, useMemo } from 'react';
import { Btn, Card, Field, Page, Badge } from '../components/ui';
import type { LessonLog as LessonLogType, Student, AttendanceType } from '../types';
import { gid, tod, saveLessons } from '../data/storage';

interface Props {
  students: Student[];
  lessons: LessonLogType[];
  setLessons: (l: LessonLogType[]) => void;
}

const EMPTY_FORM = {
  date: tod(), attendance: '출석' as AttendanceType,
  progress: '', homework: '', reaction: '', memo: '',
};

const ATT_COLOR: Record<AttendanceType, string> = {
  '출석': '#15803D', '지각': '#B45309', '결석': '#B91C1C',
};

export default function LessonLog({ students, lessons, setLessons }: Props) {
  const [selSid, setSelSid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const enrolled = students.filter(s => s.status === '재원생');
  const selStudent = selSid ? students.find(s => s.id === selSid) : null;
  const selLessons = useMemo(() =>
    lessons.filter(l => l.studentId === selSid).sort((a, b) => b.date.localeCompare(a.date))
  , [lessons, selSid]);

  const upd = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const saveLesson = () => {
    if (!selSid || !form.date) return;
    const nl: LessonLogType = { id: gid(), studentId: selSid, ...form };
    const upd = [...lessons, nl];
    setLessons(upd); saveLessons(upd);
    setForm({ ...EMPTY_FORM }); setShowForm(false);
  };

  const deleteLesson = (id: string) => {
    if (!confirm('삭제할까요?')) return;
    const upd = lessons.filter(l => l.id !== id);
    setLessons(upd); saveLessons(upd);
  };

  const attStats = selLessons.reduce((acc, l) => {
    acc[l.attendance] = (acc[l.attendance] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Page title="수업 기록">
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, height: 'calc(100% - 48px)' }}>
        {/* 학생 목록 */}
        <div style={{ overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>재원생</div>
          {enrolled.map(s => {
            const cnt = lessons.filter(l => l.studentId === s.id).length;
            return (
              <div
                key={s.id}
                onClick={() => setSelSid(s.id)}
                style={{
                  padding: '9px 12px', borderRadius: 7, cursor: 'pointer', marginBottom: 5,
                  background: selSid === s.id ? '#EFF6FF' : '#fff',
                  border: `0.5px solid ${selSid === s.id ? '#BFDBFE' : '#E2E8F0'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.grade}</div>
                </div>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{cnt}회</span>
              </div>
            );
          })}
          {enrolled.length === 0 && <p style={{ fontSize: 12, color: '#94A3B8' }}>재원생 없음</p>}
        </div>

        {/* 수업 기록 */}
        <div style={{ overflowY: 'auto' }}>
          {!selStudent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1', fontSize: 13 }}>
              ← 학생을 선택하세요
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{selStudent.name}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>{selStudent.grade}</span>
                  {selLessons.length > 0 && (
                    <span style={{ fontSize: 11, color: '#64748B', marginLeft: 12 }}>
                      출석 <b style={{ color: ATT_COLOR['출석'] }}>{attStats['출석'] ?? 0}</b> ·{' '}
                      지각 <b style={{ color: ATT_COLOR['지각'] }}>{attStats['지각'] ?? 0}</b> ·{' '}
                      결석 <b style={{ color: ATT_COLOR['결석'] }}>{attStats['결석'] ?? 0}</b>
                    </span>
                  )}
                </div>
                <Btn small onClick={() => setShowForm(!showForm)}>
                  {showForm ? '닫기' : '+ 수업 추가'}
                </Btn>
              </div>

              {/* 수업 추가 폼 */}
              {showForm && (
                <Card style={{ marginBottom: 12, background: '#FAFBFF' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Field label="날짜">
                      <input type="date" value={form.date} onChange={e => upd('date', e.target.value)} />
                    </Field>
                    <Field label="출결">
                      <div style={{ display: 'flex', gap: 6, paddingTop: 2 }}>
                        {(['출석','지각','결석'] as AttendanceType[]).map(a => (
                          <button
                            key={a}
                            className={`att-btn${form.attendance === a ? ` active-${a}` : ''}`}
                            onClick={() => upd('attendance', a)}
                          >{a}</button>
                        ))}
                      </div>
                    </Field>
                    <Field label="오늘 진도" style={{ gridColumn: '1 / -1' }}>
                      <input value={form.progress} onChange={e => upd('progress', e.target.value)} placeholder="Unit 5 Reading Comprehension" />
                    </Field>
                    <Field label="숙제">
                      <input value={form.homework} onChange={e => upd('homework', e.target.value)} placeholder="단어 20개, Q&A 완성" />
                    </Field>
                    <Field label="학생 반응">
                      <input value={form.reaction} onChange={e => upd('reaction', e.target.value)} placeholder="집중도, 이해도" />
                    </Field>
                    <Field label="다음 수업 메모" style={{ gridColumn: '1 / -1' }}>
                      <input value={form.memo} onChange={e => upd('memo', e.target.value)} placeholder="다음 시간 확인 사항" />
                    </Field>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <Btn variant="ghost" small onClick={() => { setForm({ ...EMPTY_FORM }); setShowForm(false); }}>취소</Btn>
                    <Btn small onClick={saveLesson}>저장</Btn>
                  </div>
                </Card>
              )}

              {/* 수업 목록 */}
              {selLessons.length === 0 ? (
                <Card style={{ textAlign: 'center', color: '#94A3B8', padding: 24 }}>수업 기록이 없습니다.</Card>
              ) : selLessons.map(l => (
                <Card key={l.id} style={{ marginBottom: 8, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', align: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginRight: 8 }}>{l.date}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: ATT_COLOR[l.attendance], background: l.attendance === '출석' ? '#F0FDF4' : l.attendance === '지각' ? '#FFF7ED' : '#FEF2F2', padding: '2px 8px', borderRadius: 4 }}>
                        {l.attendance}
                      </span>
                    </div>
                    <Btn small variant="danger" onClick={() => deleteLesson(l.id)}>삭제</Btn>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12 }}>
                    {l.progress && <div><span style={{ color: '#94A3B8' }}>진도 </span><span style={{ color: '#374151' }}>{l.progress}</span></div>}
                    {l.homework && <div><span style={{ color: '#94A3B8' }}>숙제 </span><span style={{ color: '#374151' }}>{l.homework}</span></div>}
                    {l.reaction && <div><span style={{ color: '#94A3B8' }}>반응 </span><span style={{ color: '#374151' }}>{l.reaction}</span></div>}
                    {l.memo    && <div><span style={{ color: '#94A3B8' }}>메모 </span><span style={{ color: '#374151' }}>{l.memo}</span></div>}
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
