// src/types/questions.ts

export type LevelKey = 'basic' | 'lower_intermediate' | 'intermediate' | 'advanced';

export const LEVEL_LABELS: Record<LevelKey, string> = {
  basic: 'Basic',
  lower_intermediate: 'Lower Intermediate (성장반)',
  intermediate: 'Intermediate (실력반)',
  advanced: 'Advanced (심화반)',
};

export const LEVEL_SHORT: Record<LevelKey, string> = {
  basic: 'Basic',
  lower_intermediate: 'L. Intermediate',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LEVEL_DESC: Record<LevelKey, string> = {
  basic: '150L~300L · Fluency · Bricks 80~100 수준',
  lower_intermediate: '350L~500L · Comprehension · Bricks 150 수준',
  intermediate: '450L~650L · Structured Reading · Bricks 200~250 수준',
  advanced: '600L~900L · Academic Reading · Bricks 300+ 수준',
};

export const LEVEL_ORDER: LevelKey[] = [
  'basic', 'lower_intermediate', 'intermediate', 'advanced'
];

// ── 독립 문제 (Vocabulary / Grammar) ─────────────────────────────
export interface StandaloneQuestion {
  id: string;
  type: 'standalone';
  area: 'vocabulary' | 'grammar';
  level: LevelKey;
  difficulty: 1 | 2 | 3; // 1=쉬움, 2=보통, 3=어려움
  q: string;
  o: string[];   // 4개 보기
  a: number;     // 0-based 정답 인덱스
  explanation?: string;
}

// ── 지문 기반 문제 ────────────────────────────────────────────────
export type PassageSize = 'short' | 'medium' | 'long';

export interface PassageSubQuestion {
  id: string;
  q: string;
  o: string[];
  a: number;
  skill: ReadingSkill;
}

export type ReadingSkill =
  | 'main_idea' | 'detail' | 'character' | 'setting' | 'sequence'
  | 'inference' | 'cause_effect' | 'fact_opinion' | 'vocabulary_in_context'
  | 'prediction' | 'author_purpose' | 'argument' | 'evidence';

export interface PassageQuestion {
  id: string;
  type: 'passage';
  level: LevelKey;
  size: PassageSize;
  title: string;
  genre: 'fiction' | 'nonfiction' | 'informational' | 'argumentative';
  passage: string;
  questions: PassageSubQuestion[];
}

// ── 전체 문항 세트 (한 레벨의 30문항) ────────────────────────────
export interface QuestionSet {
  level: LevelKey;
  vocabulary: StandaloneQuestion[];   // 8문항
  grammar: StandaloneQuestion[];      // 7문항
  passages: {
    short:  PassageQuestion;   // 3문항
    medium: PassageQuestion;   // 5문항
    long:   PassageQuestion;   // 7문항
  };
}

// ── 테스트 세션 ───────────────────────────────────────────────────
export interface TestSession {
  studentId: string;
  startLevel: LevelKey;
  phase: 1 | 2;
  currentLevel: LevelKey;
  answers: Record<string, number | null>; // questionId → chosen index
  score: number;
  total: number;
  finalLevel: LevelKey | null;
  adjustedUp: boolean;
}

// ── 저장되는 테스트 결과 ──────────────────────────────────────────
export interface AdmissionResult {
  id: string;
  studentId: string;
  date: string;
  startLevel: LevelKey;
  phase1Level: LevelKey;
  phase1Score: number;
  phase1Total: number;
  phase2Level: LevelKey | null;
  phase2Score: number | null;
  phase2Total: number | null;
  finalLevel: LevelKey;
  vocabScore: number;
  grammarScore: number;
  readingScore: number;
  teacherNote: string;
  parentSummary: string;
}
