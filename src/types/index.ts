// src/types/index.ts

export type StudentStatus =
  | '문의' | '테스트예정' | '테스트완료'
  | '미등록' | '재원생' | '휴원' | '퇴원';

// Student.level은 string으로 유연하게 관리 (questions.ts의 LevelKey와 분리)
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

export interface GradeRecord {
  id: string;
  studentId: string;
  quarter: string;
  date: string;
  level: string;
  radarScores: Record<string, number>;
  radarBenchmark: Record<string, number>;
  areaComments: Record<string, string>;
  quarterExam: number;   // /80
  attendance: number;    // /5
  attitude: number;      // /5
  speaking: number;      // /10
  summary: string;
  nextGoals: string;
}

export interface Payment {
  id: string;
  studentId: string;
  month: string;
  amount: number;
  isPaid: boolean;
  paidDate: string;
  paymentMethod: string;
  memo: string;
}
