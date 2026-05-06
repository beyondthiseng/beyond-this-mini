// src/data/questions/index.ts
import { basicQuestions } from './basic';
import { lowerIntermediateQuestions } from './lowerIntermediate';
import { intermediateQuestions } from './intermediate';
import { advancedQuestions } from './advanced';
import { LEVEL_LABELS, LEVEL_DESC, LEVEL_ORDER } from '../../types/questions';
import type {
  LevelKey, QuestionSet, StandaloneQuestion, PassageQuestion,
} from '../../types/questions';

export const QUESTION_DB: Record<LevelKey, QuestionSet> = {
  basic: basicQuestions,
  lower_intermediate: lowerIntermediateQuestions,
  intermediate: intermediateQuestions,
  advanced: advancedQuestions,
};

const QDB_KEY = 'btm_question_db';

export function loadQuestionDB(): Record<LevelKey, QuestionSet> {
  try {
    const stored = localStorage.getItem(QDB_KEY);
    if (stored) return JSON.parse(stored) as Record<LevelKey, QuestionSet>;
  } catch {}
  return QUESTION_DB;
}

export function saveQuestionDB(db: Record<LevelKey, QuestionSet>): void {
  try { localStorage.setItem(QDB_KEY, JSON.stringify(db)); } catch {}
}

export function resetQuestionDB(): void {
  localStorage.removeItem(QDB_KEY);
}

export function levelUp(lv: LevelKey): LevelKey {
  const i = LEVEL_ORDER.indexOf(lv);
  return i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : lv;
}

export function levelDown(lv: LevelKey): LevelKey {
  const i = LEVEL_ORDER.indexOf(lv);
  return i > 0 ? LEVEL_ORDER[i - 1] : lv;
}

export function judgePhase1(score: number, total: number, currentLevel: LevelKey): 'up' | 'down' | 'confirm' {
  const pct = score / total;
  if (pct >= 0.80 && levelUp(currentLevel) !== currentLevel) return 'up';
  if (pct <= 0.40 && levelDown(currentLevel) !== currentLevel) return 'down';
  return 'confirm';
}

export function judgePhase2(
  score: number, total: number,
  direction: 'up' | 'down',
  originalLevel: LevelKey,
  testLevel: LevelKey
): LevelKey {
  return (score / total) >= 0.60 ? testLevel : originalLevel;
}

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

export function getPhase2Questions(db: QuestionSet): {
  vocab: StandaloneQuestion[];
  grammar: StandaloneQuestion[];
  passages: PassageQuestion[];
} {
  const vocab = [...db.vocabulary].sort(() => Math.random() - 0.5).slice(0, 4);
  const grammar = [...db.grammar].sort(() => Math.random() - 0.5).slice(0, 4);
  return { vocab, grammar, passages: [db.passages.short, db.passages.medium] };
}

export function generateParentSummary(
  studentName: string,
  finalLevel: LevelKey,
  breakdown: ScoreBreakdown
): string {
  const vocabPct  = Math.round(breakdown.vocab   / breakdown.vocabTotal   * 100);
  const grammarPct= Math.round(breakdown.grammar / breakdown.grammarTotal * 100);
  const readingPct= Math.round(breakdown.reading / breakdown.readingTotal * 100);

  const strong: string[] = [];
  const weak:   string[] = [];
  if (vocabPct   >= 70) strong.push('Vocabulary');   else if (vocabPct   < 50) weak.push('Vocabulary');
  if (grammarPct >= 70) strong.push('Grammar');      else if (grammarPct < 50) weak.push('Grammar');
  if (readingPct >= 70) strong.push('Reading');      else if (readingPct < 50) weak.push('Reading');

  return [
    `${studentName} 학생 입학 레벨 테스트 결과를 안내드립니다.`,
    ``,
    `◆ 추천 레벨: ${LEVEL_LABELS[finalLevel]}`,
    `◆ 수준: ${LEVEL_DESC[finalLevel]}`,
    ``,
    `[ 영역별 결과 ]`,
    `• Vocabulary: ${breakdown.vocab}/${breakdown.vocabTotal} (${vocabPct}%)`,
    `• Grammar: ${breakdown.grammar}/${breakdown.grammarTotal} (${grammarPct}%)`,
    `• Reading: ${breakdown.reading}/${breakdown.readingTotal} (${readingPct}%)`,
    strong.length ? `\n◆ 강점 영역: ${strong.join(', ')}` : '',
    weak.length   ? `◆ 보완 영역: ${weak.join(', ')}`   : '',
    ``,
    `이보다 더 영어교습소에서는 Reading - Thinking - Writing 통합 접근법으로`,
    `${studentName} 학생의 영어 실력을 단계적으로 키워드리겠습니다.`,
  ].filter(l => l !== null).join('\n');
}
