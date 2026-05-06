// src/types/index.ts

export type StudentStatus =
  | '문의' | '테스트예정' | '테스트완료'
  | '미등록' | '재원생' | '휴원' | '퇴원';

export type LevelKey = 'phonics' | 'basic' | 'growth' | 'advanced' | 'adult';
export type ClassInterest = '파닉스' | '기본반' | '성장반' | '중등' | '성인' | '기타';
export type InquiryRoute = '블로그' | '네이버지도' | '소개' | '전단지' | '전화' | '기타';
export type EnrollProbability = '높음' | '보통' | '낮음';
export type AttendanceType = '출석' | '지각' | '결석';

export interface Memo {
  id: string;
  date: string;
  content: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  school: string;
  birthdate: string;
  studentPhone: string;
  parentPhone: string;
  inquiryRoute: InquiryRoute;
  classInterest: ClassInterest[];
  currentBook: string;
  level: LevelKey | '';
  notes: string;
  status: StudentStatus;
  enrollDate: string;
  leaveDate: string;
  lastContactDate: string;
  nextContactDate: string;
  enrollProbability: EnrollProbability | '';
  leaveReason: string;
  memos: Memo[];
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionTestResult {
  id: string;
  studentId: string;
  date: string;
  startLevel: LevelKey;
  p1Level: LevelKey;
  p1Correct: number;
  p1Total: number;
  p2Level: LevelKey | null;
  p2Correct: number | null;
  p2Total: number | null;
  finalLevel: LevelKey;
  teacherNote: string;
  parentSummary: string;
}

export interface LessonLog {
  id: string;
  studentId: string;
  date: string;
  attendance: AttendanceType;
  progress: string;
  homework: string;
  reaction: string;
  memo: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  quarter: string;        // e.g. "2025-Q1"
  date: string;
  level: LevelKey;
  radarScores: Record<string, number>;     // area -> 1~5
  radarBenchmark: Record<string, number>;  // area -> 1~5 (기준 점수)
  areaComments: Record<string, string>;
  quarterExam: number;   // /60
  attendance: number;    // /10
  attitude: number;      // /10
  speaking: number;      // /10
  writing: number;       // /10
  summary: string;
  nextGoals: string;
}

export interface Payment {
  id: string;
  studentId: string;
  month: string;         // "2025-04"
  amount: number;
  isPaid: boolean;
  paidDate: string;
  paymentMethod: string;
  memo: string;
}
