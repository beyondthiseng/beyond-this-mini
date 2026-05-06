// src/data/storage.ts
import type { Student, AdmissionTestResult, LessonLog, GradeRecord, Payment } from '../types';

const KEYS = { s:'btm_students', t:'btm_tests', l:'btm_lessons', g:'btm_grades', p:'btm_payments' };

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v) as T;
  } catch {}
  return fallback;
}

function save(key: string, data: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function loadStudents(): Student[] { return load(KEYS.s, SAMPLE_STUDENTS); }
export function saveStudents(d: Student[]): void { save(KEYS.s, d); }

export function loadTests(): AdmissionTestResult[] { return load(KEYS.t, SAMPLE_TESTS); }
export function saveTests(d: AdmissionTestResult[]): void { save(KEYS.t, d); }

export function loadLessons(): LessonLog[] { return load(KEYS.l, SAMPLE_LESSONS); }
export function saveLessons(d: LessonLog[]): void { save(KEYS.l, d); }

export function loadGrades(): GradeRecord[] { return load(KEYS.g, SAMPLE_GRADES); }
export function saveGrades(d: GradeRecord[]): void { save(KEYS.g, d); }

export function loadPayments(): Payment[] { return load(KEYS.p, SAMPLE_PAYMENTS); }
export function savePayments(d: Payment[]): void { save(KEYS.p, d); }

export function exportAll(students: Student[], tests: AdmissionTestResult[], lessons: LessonLog[], grades: GradeRecord[], payments: Payment[]): void {
  const data = JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), students, tests, lessons, grades, payments }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `btm_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function gid(): string { return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2,4); }
export function tod(): string { return new Date().toISOString().slice(0,10); }
export function toYM(): string { return new Date().toISOString().slice(0,7); }
export function toQ(): string { const d = new Date(); return `${d.getFullYear()}-Q${Math.ceil((d.getMonth()+1)/3)}`; }

// ── SAMPLE DATA ──────────────────────────────────────────────────

const SAMPLE_STUDENTS: Student[] = [
  {
    id:'s1', name:'김지호', nameEn:'Kim Jiho', gender:'남',
    grade:'초3', school:'행복초', birthdate:'2016-03-15',
    studentPhone:'', parentPhone:'010-1234-5678',
    emergencyPhone:'', address:'', email:'',
    inquiryRoute:'블로그', classInterest:['기본반'],
    level:'basic', notes:'집중력 좋음. 단어 암기 약함.',
    status:'재원생', enrollDate:'2024-03-02', leaveDate:'',
    lastContactDate:'2025-04-20', nextContactDate:'', enrollProbability:'', leaveReason:'',
    memos:[{id:'m1',date:'2025-04-20',content:'단어 테스트 80점. 꾸준히 향상 중.'}],
    createdAt:'2024-03-01', updatedAt:'2025-04-20',
  },
  {
    id:'s2', name:'박서연', nameEn:'Park Seoyeon', gender:'여',
    grade:'초5', school:'희망초', birthdate:'2014-07-22',
    studentPhone:'010-9876-5432', parentPhone:'010-8765-4321',
    emergencyPhone:'', address:'', email:'',
    inquiryRoute:'소개', classInterest:['성장반'],
    level:'growth', notes:'독해 강점. 문법 보완 필요.',
    status:'재원생', enrollDate:'2024-09-01', leaveDate:'',
    lastContactDate:'2025-04-28', nextContactDate:'', enrollProbability:'', leaveReason:'',
    memos:[], createdAt:'2024-08-25', updatedAt:'2025-04-28',
  },
  {
    id:'s3', name:'이준서', nameEn:'Lee Junseo', gender:'남',
    grade:'중1', school:'미래중', birthdate:'2012-11-05',
    studentPhone:'010-5555-1234', parentPhone:'010-4444-5678',
    emergencyPhone:'', address:'', email:'',
    inquiryRoute:'네이버지도', classInterest:['중등'], level:'',
    notes:'레벨 테스트 예정.', status:'테스트예정', enrollDate:'', leaveDate:'',
    lastContactDate:'2025-04-29', nextContactDate:'2025-05-04', enrollProbability:'높음', leaveReason:'',
    memos:[{id:'m2',date:'2025-04-29',content:'5월 6일 오후 4시 테스트 예약.'}],
    createdAt:'2025-04-29', updatedAt:'2025-04-29',
  },
  {
    id:'s4', name:'최아린', nameEn:'Choi Arin', gender:'여',
    grade:'초2', school:'별빛초', birthdate:'2017-02-14',
    studentPhone:'', parentPhone:'010-2222-3333',
    emergencyPhone:'', address:'', email:'',
    inquiryRoute:'전단지', classInterest:['파닉스'],
    level:'phonics', notes:'알파벳 인식 완료. 블렌딩 연습 중.',
    status:'재원생', enrollDate:'2025-01-06', leaveDate:'',
    lastContactDate:'2025-04-15', nextContactDate:'', enrollProbability:'', leaveReason:'',
    memos:[], createdAt:'2024-12-28', updatedAt:'2025-04-15',
  },
  {
    id:'s5', name:'홍민준', nameEn:'Hong Minjun', gender:'남',
    grade:'성인', school:'-', birthdate:'1990-06-30',
    studentPhone:'010-7777-8888', parentPhone:'',
    emergencyPhone:'', address:'', email:'',
    inquiryRoute:'블로그', classInterest:['성인'],
    level:'adult', notes:'직장인. 주 2회 저녁반.',
    status:'문의', enrollDate:'', leaveDate:'',
    lastContactDate:'2025-04-30', nextContactDate:'2025-05-04', enrollProbability:'보통', leaveReason:'',
    memos:[{id:'m3',date:'2025-04-30',content:'카톡 문의. 월수 저녁 8시 선호.'}],
    createdAt:'2025-04-30', updatedAt:'2025-04-30',
  },
];

const SAMPLE_TESTS: AdmissionTestResult[] = [
  {
    id:'t1', studentId:'s1', date:'2024-02-28',
    startLevel:'basic', p1Level:'basic', p1Correct:4, p1Total:5,
    p2Level:'growth', p2Correct:2, p2Total:5, finalLevel:'basic',
    teacherNote:'Reading 강점, Writing 보완 필요.',
    parentSummary:'김지호 학생은 기본 문법과 독해에서 안정적인 실력을 보여주었습니다. Basic반 배정을 권장하며, Writing 훈련을 병행하면 빠른 성장이 기대됩니다.',
  },
  {
    id:'t2', studentId:'s4', date:'2025-01-04',
    startLevel:'phonics', p1Level:'phonics', p1Correct:3, p1Total:5,
    p2Level:null, p2Correct:null, p2Total:null, finalLevel:'phonics',
    teacherNote:'단모음 인식 가능. 이중모음 및 블렌딩 연습 필요.',
    parentSummary:'최아린 학생은 알파벳 소리를 인식하는 단계입니다. Smart Phonics 교재로 Phonics반을 시작하면 6개월 내 기본반 진입이 가능할 것으로 예상됩니다.',
  },
];

const SAMPLE_LESSONS: LessonLog[] = [
  { id:'l1', studentId:'s1', date:'2025-04-28', attendance:'출석', progress:'Unit 5 Reading Comprehension', homework:'Q&A 3문제 완성', reaction:'집중 잘 됨. 질문도 적극적.', memo:'다음 시간 Unit 6 예습 권장' },
  { id:'l2', studentId:'s1', date:'2025-04-21', attendance:'지각', progress:'Unit 4 Grammar Review', homework:'단어 20개 암기', reaction:'조금 피곤해 보였으나 수업 집중함.', memo:'20분 늦게 도착. 부모님께 안내 필요.' },
  { id:'l3', studentId:'s2', date:'2025-04-30', attendance:'출석', progress:'Chapter 7 Critical Reading', homework:'Summary 1편 작성', reaction:'매우 적극적. 스스로 질문함.', memo:'' },
  { id:'l4', studentId:'s4', date:'2025-04-29', attendance:'출석', progress:'Lesson 12 Long Vowels CVCe', homework:'워크시트 p.24', reaction:'집중력 좋음. 발음 정확해짐.', memo:'' },
];

const SAMPLE_GRADES: GradeRecord[] = [
  {
    id:'g1', studentId:'s1', quarter:'2025-Q1', date:'2025-03-28', level:'basic',
    radarScores:{ 'Vocabulary':3, 'Sentence Structure':3, 'Reading Accuracy':4, 'Listening':4, 'Speaking':3, 'Writing':2 },
    radarBenchmark:{ 'Vocabulary':3, 'Sentence Structure':3, 'Reading Accuracy':3, 'Listening':3, 'Speaking':3, 'Writing':3 },
    areaComments:{ 'Writing':'철자 오류 다수, 꾸준한 연습 필요', 'Reading Accuracy':'기준 이상 달성!' },
    quarterExam:48, attendance:9, attitude:8, speaking:7, writing:6,
    summary:'꾸준히 출석하며 Reading과 Listening에서 눈에 띄는 성장을 보였습니다. Writing 영역은 매주 1편 글쓰기 연습을 통해 빠르게 향상될 것으로 기대합니다.',
    nextGoals:'Writing 매주 1편 작성 습관화, 단어장 누적 50개 달성',
  },
];

const SAMPLE_PAYMENTS: Payment[] = [
  { id:'p1', studentId:'s1', month:'2025-04', amount:160000, isPaid:true,  paidDate:'2025-04-03', paymentMethod:'계좌이체', memo:'' },
  { id:'p2', studentId:'s1', month:'2025-05', amount:160000, isPaid:false, paidDate:'', paymentMethod:'', memo:'' },
  { id:'p3', studentId:'s2', month:'2025-04', amount:180000, isPaid:true,  paidDate:'2025-04-05', paymentMethod:'카드', memo:'' },
  { id:'p4', studentId:'s2', month:'2025-05', amount:180000, isPaid:false, paidDate:'', paymentMethod:'', memo:'' },
  { id:'p5', studentId:'s4', month:'2025-04', amount:140000, isPaid:true,  paidDate:'2025-04-02', paymentMethod:'현금', memo:'현금 영수증 발행' },
  { id:'p6', studentId:'s4', month:'2025-05', amount:140000, isPaid:false, paidDate:'', paymentMethod:'', memo:'' },
];
