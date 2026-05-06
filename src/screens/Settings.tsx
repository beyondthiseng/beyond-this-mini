// src/screens/Settings.tsx
import React, { useState } from 'react';
import { Btn, Card, Page } from '../components/ui';
import type { Student, LessonLog, GradeRecord, Payment } from '../types';
import type { AdmissionResult } from '../types/questions';
import { saveStudents, saveTests, saveLessons, saveGrades, savePayments } from '../data/storage';
import { resetQuestionDB } from '../data/questions';

interface Props {
  students: Student[];
  setStudents: (s: Student[]) => void;
  tests: AdmissionResult[];
  setTests: (t: AdmissionResult[]) => void;
  lessons: LessonLog[];
  setLessons: (l: LessonLog[]) => void;
  grades: GradeRecord[];
  setGrades: (g: GradeRecord[]) => void;
  payments: Payment[];
  setPayments: (p: Payment[]) => void;
}

export default function Settings({
  students, setStudents,
  tests, setTests,
  lessons, setLessons,
  grades, setGrades,
  payments, setPayments,
}: Props) {
  const [done, setDone] = useState<string | null>(null);

  const flash = (msg: string) => {
    setDone(msg);
    setTimeout(() => setDone(null), 2500);
  };

  // 전체 학생 삭제
  const clearAllStudents = () => {
    if (!confirm('모든 학생 데이터를 삭제할까요?\n수업기록, 성적, 결제 데이터도 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.')) return;
    setStudents([]); saveStudents([]);
    setLessons([]); saveLessons([]);
    setGrades([]); saveGrades([]);
    setPayments([]); savePayments([]);
    flash('전체 학생 데이터가 삭제됐어요.');
  };

  // 테스트 기록만 삭제
  const clearTests = () => {
    if (!confirm('입학테스트 기록을 모두 삭제할까요?')) return;
    setTests([]); saveTests([]);
    flash('테스트 기록이 삭제됐어요.');
  };

  // JSON 가져오기
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.students) { setStudents(data.students); saveStudents(data.students); }
        if (data.tests)    { setTests(data.tests);       saveTests(data.tests); }
        if (data.lessons)  { setLessons(data.lessons);   saveLessons(data.lessons); }
        if (data.grades)   { setGrades(data.grades);     saveGrades(data.grades); }
        if (data.payments) { setPayments(data.payments); savePayments(data.payments); }
        flash('데이터를 성공적으로 가져왔어요!');
      } catch {
        alert('파일을 읽을 수 없어요. JSON 형식인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 문제 DB 초기화
  const resetQDB = () => {
    if (!confirm('입학테스트 문제 DB를 기본값으로 초기화할까요?')) return;
    resetQuestionDB();
    flash('문제 DB가 초기화됐어요.');
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, paddingBottom: 8, borderBottom: '0.5px solid #F1F5F9' }}>
        {title}
      </div>
      {children}
    </Card>
  );

  const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #F8FAFC' }}>
      <div>
        <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <Page title="설정">
      {done && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#15803D', color: '#fff', padding: '10px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 600, zIndex: 200,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          ✓ {done}
        </div>
      )}

      <div style={{ maxWidth: 560 }}>

        {/* 데이터 관리 */}
        <Section title="📊 데이터 관리">
          <Row label="JSON 백업 파일 가져오기" desc="이전에 내보낸 백업 파일로 복원">
            <label style={{
              padding: '6px 14px', background: '#4A9E8E', color: '#fff',
              borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              파일 선택
              <input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
            </label>
          </Row>
          <Row label="현재 데이터 요약" desc="">
            <div style={{ fontSize: 12, color: '#64748B', textAlign: 'right' }}>
              <div>학생 {students.length}명</div>
              <div>테스트 {tests.length}건 · 수업 {lessons.length}건</div>
              <div>성적 {grades.length}건 · 결제 {payments.length}건</div>
            </div>
          </Row>
        </Section>

        {/* 초기화 */}
        <Section title="🗑 데이터 초기화">
          <Row label="입학테스트 기록 삭제" desc="학생 데이터는 유지됩니다">
            <Btn variant="danger" small onClick={clearTests}>삭제</Btn>
          </Row>
          <Row label="전체 학생 데이터 삭제" desc="모든 학생, 수업, 성적, 결제 데이터가 삭제됩니다">
            <Btn variant="danger" small onClick={clearAllStudents}>전체 삭제</Btn>
          </Row>
          <Row label="입학테스트 문제 DB 초기화" desc="직접 수정한 문제가 기본값으로 돌아갑니다">
            <Btn variant="danger" small onClick={resetQDB}>초기화</Btn>
          </Row>
        </Section>

        {/* 정보 */}
        <Section title="ℹ️ 앱 정보">
          <Row label="Beyond This Management Mini" desc="이보다 더 영어교습소 전용">
            <span style={{ fontSize: 11, color: '#94A3B8' }}>v1.0</span>
          </Row>
          <Row label="데이터 저장 방식" desc="현재 이 브라우저의 localStorage에 저장됩니다">
            <span style={{ fontSize: 11, color: '#94A3B8' }}>localStorage</span>
          </Row>
          <Row label="보안 안내" desc="">
            <span />
          </Row>
          <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.75, marginTop: 4 }}>
            • 학부모 연락처 등 개인정보가 포함된 JSON 백업 파일은 안전한 곳에 보관하세요.<br/>
            • 공용 컴퓨터에서는 사용 후 반드시 로그아웃하세요.<br/>
            • 정기적으로 JSON 내보내기로 백업하는 것을 권장합니다.
          </div>
        </Section>

      </div>
    </Page>
  );
}
