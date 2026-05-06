// src/screens/StudentList.tsx
import React, { useState, useMemo } from 'react';
import { Badge, Btn, Card, Modal, Field } from '../components/ui';
import type { Student } from '../types';
import { gid, tod, saveStudents } from '../data/storage';
import { STUDENT_STATUS_LIST, INQUIRY_ROUTE_LIST, CLASS_INTEREST_LIST } from '../data/levelTemplates';

interface Props {
  students: Student[];
  setStudents: (s: Student[]) => void;
  setPage: (p: string) => void;
  setSelId: (id: string) => void;
}

export default function StudentList({ students, setStudents, setPage, setSelId }: Props) {
  const [search, setSearch] = useState('');
  const [sf, setSf] = useState('전체');
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf] = useState({ name:'', nameEn:'', gender:'' as '남'|'여'|'', grade:'', parentPhone:'', status:'문의' as string, inquiryRoute:'블로그' as string, classInterest:'기본반' as string });

  const filtered = useMemo(() => students.filter(s => {
    if (sf !== '전체' && s.status !== sf) return false;
    if (search && !s.name.includes(search) && !s.school.includes(search)) return false;
    return true;
  }), [students, search, sf]);

  const addStudent = () => {
    if (!nf.name.trim()) return;
    const ns: Student = {
      id: gid(), name: nf.name.trim(), nameEn: nf.nameEn.trim(),
      gender: nf.gender as Student['gender'],
      grade: nf.grade, school: '', birthdate: '',
      studentPhone: '', parentPhone: nf.parentPhone,
      emergencyPhone: '', address: '', email: '',
      inquiryRoute: nf.inquiryRoute as Student['inquiryRoute'],
      classInterest: [nf.classInterest as Student['classInterest'][0]],
      level: '', notes: '',
      status: nf.status as Student['status'],
      enrollDate: nf.status === '재원생' ? tod() : '',
      leaveDate: '', lastContactDate: tod(), nextContactDate: '',
      enrollProbability: '', leaveReason: '', memos: [],
      createdAt: tod(), updatedAt: tod(),
    };
    const upd = [...students, ns];
    setStudents(upd); saveStudents(upd);
    setSelId(ns.id); setPage('detail'); setShowAdd(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">학생 관리</h1>
        <Btn onClick={() => setShowAdd(true)}>+ 학생 추가</Btn>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="이름 / 학교 검색..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={sf} onChange={e => setSf(e.target.value)}>
          <option>전체</option>
          {STUDENT_STATUS_LIST.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>{filtered.length}명</span>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              {['이름','학년','관심수업','상태','다음연락'].map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} onClick={() => { setSelId(s.id); setPage('detail'); }}>
                <td style={{ fontWeight: 700 }}>{s.name}</td>
                <td style={{ color: '#64748B' }}>{s.grade}</td>
                <td style={{ color: '#94A3B8', fontSize: 12 }}>{s.classInterest.join(', ')}</td>
                <td><Badge status={s.status} /></td>
                <td style={{ fontSize: 12, color: s.nextContactDate && s.nextContactDate <= tod() ? '#EF4444' : '#94A3B8' }}>
                  {s.nextContactDate || '-'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94A3B8', padding: 24 }}>결과 없음</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} width={320}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>새 학생 추가</div>
          <Field label="이름 (한국어) *"><input value={nf.name} onChange={e => setNf({...nf,name:e.target.value})} placeholder="홍길동" /></Field>
          <Field label="이름 (영어)"><input value={nf.nameEn} onChange={e => setNf({...nf,nameEn:e.target.value})} placeholder="Hong Gildong" /></Field>
          <Field label="성별">
            <select value={nf.gender} onChange={e => setNf({...nf,gender:e.target.value as '남'|'여'|''})}>
              <option value="">-</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </Field>
          <Field label="학년"><input value={nf.grade} onChange={e => setNf({...nf,grade:e.target.value})} placeholder="초3, 중1, 성인" /></Field>
          <Field label="학부모 연락처"><input value={nf.parentPhone} onChange={e => setNf({...nf,parentPhone:e.target.value})} placeholder="010-" /></Field>
          <Field label="상태">
            <select value={nf.status} onChange={e => setNf({...nf,status:e.target.value})}>
              {STUDENT_STATUS_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="문의 경로">
            <select value={nf.inquiryRoute} onChange={e => setNf({...nf,inquiryRoute:e.target.value})}>
              {INQUIRY_ROUTE_LIST.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="관심 수업">
            <select value={nf.classInterest} onChange={e => setNf({...nf,classInterest:e.target.value})}>
              {CLASS_INTEREST_LIST.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>취소</Btn>
            <Btn onClick={addStudent}>추가</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
