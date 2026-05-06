// src/types/questions.ts

export type LevelKey = 'basic' | 'lower_intermediate' | 'intermediate' | 'advanced';

export const LEVEL_LABELS: Record<LevelKey, string> = {
  basic: 'Basic',
  lower_intermediate: 'Lower Intermediate',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LEVEL_SHORT: Record<LevelKey, string> = {
  basic: 'Basic',
  lower_intermediate: 'L.Intermediate',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LEVEL_DESC: Record<LevelKey, string> = {
  basic: '150L~300L · Bricks 80~100 수준',
  lower_intermediate: '350L~500L · Bricks 150 수준',
  intermediate: '450L~650L · Bricks 200~250 수준',
  advanced: '600L~900L · Bricks 300+ 수준',
};

export const LEVEL_ORDER: LevelKey[] = [
  'basic', 'lower_intermediate', 'intermediate', 'advanced'
];

export interface StandaloneQuestion {
  id: string;
  type: 'standalone';
  area: 'vocabulary' | 'grammar';
  level: LevelKey;
  difficulty: 1 | 2 | 3;
  q: string;
  o: string[];
  a: number;
  explanation?: string;
}

export type PassageSize = 'short' | 'medium' | 'long';

export type ReadingSkill =
  | 'main_idea' | 'detail' | 'character' | 'setting' | 'sequence'
  | 'inference' | 'cause_effect' | 'fact_opinion' | 'vocabulary_in_context'
  | 'prediction' | 'author_purpose' | 'argument' | 'evidence';

export interface PassageSubQuestion {
  id: string;
  q: string;
  o: string[];
  a: number;
  skill: ReadingSkill;
}

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

export interface QuestionSet {
  level: LevelKey;
  vocabulary: StandaloneQuestion[];
  grammar: StandaloneQuestion[];
  passages: {
    short:  PassageQuestion;
    medium: PassageQuestion;
    long:   PassageQuestion;
  };
}

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
