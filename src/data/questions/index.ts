// src/data/questions/index.ts
import { basicQuestions } from './basic';
import { lowerIntermediateQuestions } from './lowerIntermediate';
import { intermediateQuestions } from './intermediate';
import { advancedQuestions } from './advanced';
import type {
  LevelKey, QuestionSet, StandaloneQuestion, PassageQuestion,
  PassageSubQuestion, TestSession, AdmissionResult
} from '../../types/questions';
import { LEVEL_ORDER } from '../../types/questions';

// ── 전체 DB ──────────────────────────────────────────────────────
export const QUESTION_DB: Record<LevelKey, QuestionSet> = {
  basic: basicQuestions,
  lower_intermediate: lowerIntermediateQuestions,
  intermediate: intermediateQuestions,
  advanced: advancedQuestions,
};

// ── 저장 키 ───────────────────────────────────────────────────────
const QDB_KEY = 'btm_question_db';

export function loadQuestionDB(): Record<LevelKey, QuestionSet> {
  try {
    const stored = localStorage.getItem(QDB_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return QUESTION_DB;
}

export function saveQuestionDB(db: Record<LevelKey, QuestionSet>): void {
  try { localStorage.setItem(QDB_KEY, JSON.stringify(db)); } catch {}
}

export function resetQuestionDB(): void {
  localStorage.removeItem(QDB_KEY);
}

// ── 레벨 이동 헬퍼 ────────────────────────────────────────────────
export function levelUp(lv: LevelKey): LevelKey {
  const i = LEVEL_ORDER.indexOf(lv);
  return i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : lv;
}
export function levelDown(lv: LevelKey): LevelKey {
  const i = LEVEL_ORDER.indexOf(lv);
  return i > 0 ? LEVEL_ORDER[i - 1] : lv;
}

// ── 점수 → 다음 레벨 판정 ─────────────────────────────────────────
// Phase 1: 30문항 기준
// 80% 이상(24+) → UP, 40% 이하(12-) → DOWN, 나머지 → 확정
export function judgePhase1(score: number, total: number, currentLevel: LevelKey): 'up' | 'down' | 'confirm' {
  const pct = score / total;
  if (pct >= 0.80 && levelUp(currentLevel) !== currentLevel) return 'up';
  if (pct <= 0.40 && levelDown(currentLevel) !== currentLevel) return 'down';
  return 'confirm';
}

// Phase 2: 15문항 (상위/하위 레벨 확인)
// 60% 이상(9+) → 해당 레벨 확정, 미만 → 이전 레벨로 복귀
export function judgePhase2(score: number, total: number, direction: 'up' | 'down', originalLevel: LevelKey, testLevel: LevelKey): LevelKey {
  const pct = score / total;
  if (direction === 'up') return pct >= 0.60 ? testLevel : originalLevel;
  return pct >= 0.60 ? testLevel : originalLevel;
}

// ── 점수 상세 분석 ────────────────────────────────────────────────
export interface ScoreBreakdown {
  vocab: number;
  vocabTotal: number;
  grammar: number;
  grammarTotal: number;
  reading: number;
  readingTotal: number;
}

export function analyzeAnswers(
  db: QuestionSet,
  answers: Record<string, number | null>
): ScoreBreakdown {
  let vocab = 0, grammar = 0, reading = 0;

  db.vocabulary.forEach(q => { if (answers[q.id] === q.a) vocab++; });
  db.grammar.forEach(q => { if (answers[q.id] === q.a) grammar++; });

  const allPassageQs = [
    ...db.passages.short.questions,
    ...db.passages.medium.questions,
    ...db.passages.long.questions,
  ];
  allPassageQs.forEach(q => { if (answers[q.id] === q.a) reading++; });

  return {
    vocab, vocabTotal: db.vocabulary.length,
    grammar, grammarTotal: db.grammar.length,
    reading, readingTotal: allPassageQs.length,
  };
}

// ── Phase 2용 절반 문항 추출 ──────────────────────────────────────
export function getPhase2Questions(db: QuestionSet): {
  vocab: StandaloneQuestion[];
  grammar: StandaloneQuestion[];
  passages: PassageQuestion[];
} {
  // Phase 2: vocab 4 + grammar 4 + reading (short 3 + medium 5) = 16문항
  const vocab = [...db.vocabulary].sort(() => Math.random() - 0.5).slice(0, 4);
  const grammar = [...db.grammar].sort(() => Math.random() - 0.5).slice(0, 4);
  return {
    vocab,
    grammar,
    passages: [db.passages.short, db.passages.medium],
  };
}

// ── 학부모 요약문 자동 생성 ───────────────────────────────────────
export function generateParentSummary(
  studentName: string,
  finalLevel: LevelKey,
  breakdown: ScoreBreakdown
): string {
  const { LEVEL_LABELS, LEVEL_DESC } = require('../../types/questions');
  const vocabPct = Math.round(breakdown.vocab / breakdown.vocabTotal * 100);
  const grammarPct = Math.round(breakdown.grammar / breakdown.grammarTotal * 100);
  const readingPct = Math.round(breakdown.reading / breakdown.readingTotal * 100);

  const strong = [];
  const weak = [];
  if (vocabPct >= 70) strong.push('Vocabulary'); else if (vocabPct < 50) weak.push('Vocabulary');
  if (grammarPct >= 70) strong.push('Grammar'); else if (grammarPct < 50) weak.push('Grammar');
  if (readingPct >= 70) strong.push('Reading Comprehension'); else if (readingPct < 50) weak.push('Reading Comprehension');

  return [
    `${studentName} 학생 입학 레벨 테스트 결과를 안내드립니다.`,
    ``,
    `◆ 추천 레벨: ${LEVEL_LABELS[finalLevel]}`,
    `◆ 수준: ${LEVEL_DESC[finalLevel]}`,
    ``,
    `[ 영역별 결과 ]`,
    `• Vocabulary: ${breakdown.vocab}/${breakdown.vocabTotal}점 (${vocabPct}%)`,
    `• Grammar: ${breakdown.grammar}/${breakdown.grammarTotal}점 (${grammarPct}%)`,
    `• Reading: ${breakdown.reading}/${breakdown.readingTotal}점 (${readingPct}%)`,
    ``,
    strong.length ? `◆ 강점 영역: ${strong.join(', ')}` : '',
    weak.length ? `◆ 보완 영역: ${weak.join(', ')}` : '',
    ``,
    `이보다 더 영어교습소에서는 Reading - Thinking - Writing 통합 접근법으로`,
    `${studentName} 학생의 영어 실력을 단계적으로 키워드리겠습니다.`,
    `궁금한 점은 언제든지 연락 주세요.`,
  ].filter(l => l !== null).join('\n');
}
