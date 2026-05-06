// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './screens/Dashboard';
import StudentList from './screens/StudentList';
import StudentDetail from './screens/StudentDetail';
import Marketing from './screens/Marketing';
import AdmissionTest from './screens/AdmissionTest';
import LessonLog from './screens/LessonLog';
import GradeManagement from './screens/GradeManagement';
import PaymentManagement from './screens/PaymentManagement';

import {
  loadStudents, saveStudents,
  loadTests, saveTests,
  loadLessons, saveLessons,
  loadGrades, saveGrades,
  loadPayments, savePayments,
  tod, toYM,
} from './data/storage';

import type { Student, AdmissionTestResult, LessonLog as LessonLogT, GradeRecord, Payment } from './types';

type PageId = 'dashboard' | 'students' | 'detail' | 'marketing' | 'admission' | 'lessons' | 'grades' | 'payments';

export default function App() {
  const [students, setStudentsState] = useState<Student[]>(loadStudents);
  const [tests,    setTestsState]    = useState<AdmissionTestResult[]>(loadTests);
  const [lessons,  setLessonsState]  = useState<LessonLogT[]>(loadLessons);
  const [grades,   setGradesState]   = useState<GradeRecord[]>(loadGrades);
  const [payments, setPaymentsState] = useState<Payment[]>(loadPayments);

  const [page, setPage] = useState<PageId>('dashboard');
  const [selId, setSelId] = useState<string>('');

  const setStudents = useCallback((d: Student[]) => { setStudentsState(d); saveStudents(d); }, []);
  const setTests    = useCallback((d: AdmissionTestResult[]) => { setTestsState(d); saveTests(d); }, []);
  const setLessons  = useCallback((d: LessonLogT[]) => { setLessonsState(d); saveLessons(d); }, []);
  const setGrades   = useCallback((d: GradeRecord[]) => { setGradesState(d); saveGrades(d); }, []);
  const setPayments = useCallback((d: Payment[]) => { setPaymentsState(d); savePayments(d); }, []);

  const goPage = useCallback((p: string) => setPage(p as PageId), []);

  // Sidebar badge counts
  const badges: Partial<Record<PageId, number>> = {
    marketing: students.filter(s =>
      ['문의','테스트예정','테스트완료','미등록','휴원','퇴원'].includes(s.status) &&
      s.nextContactDate && s.nextContactDate <= tod()
    ).length || undefined,
    admission: students.filter(s => s.status === '테스트예정').length || undefined,
    payments:  payments.filter(p => p.month === toYM() && !p.isPaid).length || undefined,
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard students={students} payments={payments} setPage={goPage} setSelId={setSelId} />;
      case 'students':
        return <StudentList students={students} setStudents={setStudents} setPage={goPage} setSelId={setSelId} />;
      case 'detail':
        return <StudentDetail sid={selId} students={students} setStudents={setStudents} setPage={goPage} />;
      case 'marketing':
        return <Marketing students={students} setPage={goPage} setSelId={setSelId} />;
      case 'admission':
        return <AdmissionTest students={students} setStudents={setStudents} tests={tests} setTests={setTests} setPage={goPage} />;
      case 'lessons':
        return <LessonLog students={students} lessons={lessons} setLessons={setLessons} />;
      case 'grades':
        return <GradeManagement students={students} grades={grades} setGrades={setGrades} />;
      case 'payments':
        return <PaymentManagement students={students} payments={payments} setPayments={setPayments} />;
      default:
        return <Dashboard students={students} payments={payments} setPage={goPage} setSelId={setSelId} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        page={page} setPage={goPage} badges={badges}
        students={students} tests={tests} lessons={lessons} grades={grades} payments={payments}
      />
      <main style={{ flex: 1, overflow: 'hidden', background: '#F0F2F5' }}>
        {renderPage()}
      </main>
    </div>
  );
}
