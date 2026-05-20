// src/types/index.ts

export type StudentStatus =
  | '문의' | '테스트예정' | '테스트완료'
  | '미등록' | '재원생' | '휴원' | '퇴원';

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
  nameEn: string;
  gender: '남' | '여' | '';
  grade: string;
  school: string;
  birthdate: string;
  studentPhone: string;
  parentPhone: string;
  emergencyPhone: string;
  address: string;
  email: string;
  inquiryRoute: InquiryRoute;
  classInterest: ClassInterest[];
  level: string;
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

// 시험 영역별 점수 (배점 직접 입력)
export interface TestAreaScore {
  score: number;
  maxScore: number;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  quarter: string;        // "2025-Q1"
  date: string;
  level: string;
  // 시험 4영역
  readingComprehension: TestAreaScore;
  vocabulary: TestAreaScore;
  sentenceBuilding: TestAreaScore;
  writingTest: TestAreaScore;
  // 기타 점수
  speaking: number;      // /10
  attendance: number;    // /5
  attitude: number;      // /5
  // 코멘트
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
