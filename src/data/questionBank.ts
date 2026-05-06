// src/data/questionBank.ts
// 이 파일은 레거시 호환용입니다. 실제 테스트는 src/data/questions/ 를 사용합니다.
import type { LevelKey } from '../types/questions';

export interface Question {
  q: string;
  o: string[];
  a: number;
}

export const QUESTION_BANK: Record<LevelKey, Question[]> = {
  basic: [
    { q: "She ___ to school every day.", o: ["go","goes","going","gone"], a: 1 },
    { q: "What does 'big' mean?", o: ["small","large","fast","slow"], a: 1 },
    { q: "Which sentence is correct?", o: ["I am a student.","I are a student.","I is a student.","I be a student."], a: 0 },
    { q: "'The cat sat ___ the mat.'", o: ["in","on","at","by"], a: 1 },
    { q: "Opposite of 'hot'?", o: ["warm","cool","cold","chilly"], a: 2 },
    { q: "He ___ a book yesterday.", o: ["read","reads","reading","to read"], a: 0 },
    { q: "'Many' means ___.", o: ["a little","a lot","a few","none"], a: 1 },
    { q: "A place to sleep is a ___.", o: ["kitchen","bedroom","bathroom","garage"], a: 1 },
    { q: "Which word is a verb?", o: ["happy","quickly","run","blue"], a: 2 },
    { q: "She ___ TV when I called.", o: ["watch","watches","was watching","watched"], a: 2 },
  ],
  lower_intermediate: [
    { q: "'Discover' means to ___.", o: ["lose something","find something new","break something","forget something"], a: 1 },
    { q: "Which word means 'very surprised'?", o: ["bored","astonished","tired","confused"], a: 1 },
    { q: "'Ancient' means ___.", o: ["very new","very old","very big","very small"], a: 1 },
    { q: "The opposite of 'frequently' is ___.", o: ["always","never","rarely","usually"], a: 2 },
    { q: "'Enormous' is closest in meaning to ___.", o: ["tiny","fast","huge","loud"], a: 2 },
    { q: "If something is 'fragile', you should handle it ___.", o: ["quickly","roughly","carefully","loudly"], a: 2 },
    { q: "'Migrate' means to ___.", o: ["stay in one place","move from one place to another","build a new home","look for food"], a: 1 },
    { q: "A 'habitat' is ___.", o: ["what an animal eats","where an animal lives","how an animal moves","why animals sleep"], a: 1 },
    { q: "She ___ TV when I called her.", o: ["watch","watches","was watching","watched"], a: 2 },
    { q: "Despite the rain, the game ___.", o: ["continue","continues","continued","continuing"], a: 2 },
  ],
  intermediate: [
    { q: "'Convince' means to ___.", o: ["force someone","make someone believe something","ask a question","stop someone"], a: 1 },
    { q: "The word 'abundant' means ___.", o: ["rare and hard to find","available in large amounts","old and worn out","small and unimportant"], a: 1 },
    { q: "'Reluctant' means ___.", o: ["eager and ready","unwilling or hesitant","confused and lost","confident and sure"], a: 1 },
    { q: "A 'controversial' topic is one that ___.", o: ["everyone agrees on","people strongly disagree about","is easy to understand","has been solved"], a: 1 },
    { q: "'Imply' is closest in meaning to ___.", o: ["state directly","suggest indirectly","argue strongly","prove clearly"], a: 1 },
    { q: "Something 'inevitable' is ___.", o: ["possible but unlikely","certain to happen","easy to avoid","hard to understand"], a: 1 },
    { q: "'Objective' information is ___.", o: ["based on personal feelings","based on facts, not opinions","difficult to understand","old and outdated"], a: 1 },
    { q: "To 'exaggerate' means to ___.", o: ["tell the truth clearly","make something seem bigger than it is","explain something simply","repeat something many times"], a: 1 },
    { q: "The report ___ by the team before the deadline.", o: ["was completed","completed","has completed","is completing"], a: 0 },
    { q: "Which sentence uses the correct relative clause?", o: ["The book which I borrowed it was interesting.","The book that I borrowed was interesting.","The book whom I borrowed was interesting.","The book I borrowed it was interesting."], a: 1 },
  ],
  advanced: [
    { q: "'Ambiguous' most nearly means ___.", o: ["perfectly clear","open to multiple interpretations","extremely difficult","completely wrong"], a: 1 },
    { q: "Something 'paradoxical' seems ___.", o: ["straightforward and simple","contradictory yet possibly true","completely false","easily explained"], a: 1 },
    { q: "'Ubiquitous' means ___.", o: ["rare and unusual","present everywhere","extremely expensive","recently created"], a: 1 },
    { q: "A 'pragmatic' approach focuses on ___.", o: ["ideal outcomes","practical solutions","emotional responses","traditional methods"], a: 1 },
    { q: "'Rhetoric' refers to ___.", o: ["scientific research methods","the art of persuasive speaking or writing","a type of logical argument","historical events"], a: 1 },
    { q: "An 'empirical' claim is based on ___.", o: ["logical reasoning alone","observation and evidence","expert opinion","theoretical assumptions"], a: 1 },
    { q: "'Mitigate' means to ___.", o: ["worsen a situation","make something less severe","completely solve a problem","ignore a difficulty"], a: 1 },
    { q: "A 'fallacy' in an argument is ___.", o: ["a strong piece of evidence","an error in reasoning","a counter-argument","a proven fact"], a: 1 },
    { q: "Had she arrived earlier, she ___ the presentation.", o: ["would see","would have seen","will see","sees"], a: 1 },
    { q: "Which transition word best shows a logical CONTRAST?", o: ["Furthermore","Therefore","Nevertheless","Consequently"], a: 2 },
  ],
};

export function pickQuestions(level: LevelKey, count = 5): Question[] {
  const pool = QUESTION_BANK[level] ?? QUESTION_BANK.basic;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}
