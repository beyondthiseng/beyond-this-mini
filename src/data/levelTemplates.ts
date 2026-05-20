// src/data/levelTemplates.ts

export const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  '문의':       { bg: '#EEF2FF', color: '#4338CA' },
  '테스트예정': { bg: '#FFF7ED', color: '#C2410C' },
  '테스트완료': { bg: '#FFFBEB', color: '#B45309' },
  '미등록':     { bg: '#FEF2F2', color: '#B91C1C' },
  '재원생':     { bg: '#F0FDF4', color: '#15803D' },
  '휴원':       { bg: '#F0F9FF', color: '#0369A1' },
  '퇴원':       { bg: '#F9FAFB', color: '#6B7280' },
};

export const STUDENT_STATUS_LIST = [
  '문의','테스트예정','테스트완료','미등록','재원생','휴원','퇴원'
] as const;

export const CLASS_INTEREST_LIST = [
  '파닉스','기본반','성장반','중등','성인','기타'
] as const;

export const INQUIRY_ROUTE_LIST = [
  '블로그','네이버지도','소개','전단지','전화','기타'
] as const;

// 성적표 레벨 목록 (Growth 제거, Lower Intermediate로 통일)
export const GRADE_LEVEL_LIST = [
  { value: 'basic',              label: 'Basic' },
  { value: 'lower_intermediate', label: 'Lower Intermediate' },
  { value: 'intermediate',       label: 'Intermediate' },
  { value: 'advanced',           label: 'Advanced' },
  { value: 'adult',              label: '성인' },
] as const;

export const SMS_TEMPLATES = [
  {
    title: '📅 테스트 예약 확인',
    body: '[이보다 더 영어교습소] 안녕하세요! {이름} 학생 레벨 테스트가 {날짜} {시간}에 예정되어 있습니다. 오시기 전 편하게 연락 주세요 :)',
  },
  {
    title: '✅ 테스트 결과 안내',
    body: '[이보다 더 영어교습소] 안녕하세요! {이름} 학생 테스트 결과 {추천레벨}반을 추천드립니다. 등록 및 상담은 편하게 연락 주세요!',
  },
  {
    title: '🌱 신학기 복귀 안내',
    body: '[이보다 더 영어교습소] 안녕하세요, {이름} 학생 학부모님! 새 학기가 시작됐습니다. 언제든 편하게 돌아오실 수 있어요 :)',
  },
  {
    title: '📚 결석 확인',
    body: '[이보다 더 영어교습소] 오늘 {이름} 학생이 수업에 참석하지 않았습니다. 보강이 필요하시면 말씀해 주세요!',
  },
  {
    title: '💰 수강료 안내',
    body: '[이보다 더 영어교습소] {이름} 학생 {월}월 수강료 {금액}원을 안내드립니다. 감사합니다!',
  },
];
