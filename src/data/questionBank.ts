// src/data/questionBank.ts
import type { LevelKey } from '../types/questions';

export interface Question {
  q: string;
  o: string[];
  a: number; // 0-based index
}

export const QUESTION_BANK: Record<LevelKey, Question[]> = {
  phonics: [
    { q: "Which word starts with the /b/ sound?", o: ["Apple","Ball","Cat","Dog"], a: 1 },
    { q: "What sound is at the end of 'cat'?", o: ["/b/","/t/","/k/","/p/"], a: 1 },
    { q: "'C-A-T' — blend the sounds. What word is this?", o: ["cup","can","cat","cap"], a: 2 },
    { q: "Which word has the short 'e' sound?", o: ["cake","bed","bike","boat"], a: 1 },
    { q: "What does 'sh' say?", o: ["/s/","/h/","/sh/","/ch/"], a: 2 },
    { q: "Which word rhymes with 'hat'?", o: ["hot","bat","hit","hut"], a: 1 },
    { q: "'D-O-G' — what word is this?", o: ["dig","dog","dug","dot"], a: 1 },
    { q: "Which letter makes the /k/ sound in 'cat'?", o: ["a","t","c","e"], a: 2 },
    { q: "Which word starts with a vowel sound?", o: ["ball","tree","apple","dog"], a: 2 },
    { q: "How many syllables in 'butterfly'?", o: ["1","2","3","4"], a: 2 },
  ],
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
  growth: [
    { q: "'Tom was tired because he worked all night.' Why was Tom tired?", o: ["He slept too much.","He worked all night.","He was sick.","He ran a race."], a: 1 },
    { q: "'The scientist made an important discovery.' 'Discovery' means ___.", o: ["mistake","plan","finding","question"], a: 2 },
    { q: "'She was reluctant to speak.' 'Reluctant' means ___.", o: ["happy","eager","unwilling","ready"], a: 2 },
    { q: "'Despite the rain, the game continued.' 'Despite' means ___.", o: ["because of","even though","before","after"], a: 1 },
    { q: "'The author implies...' 'Implies' means ___.", o: ["states directly","suggests indirectly","argues strongly","proves clearly"], a: 1 },
    { q: "Which is a compound sentence?", o: ["She runs fast.","She runs, and he walks.","Running is good.","She ran fast."], a: 1 },
    { q: "'Annually' means ___.", o: ["every day","every week","every month","every year"], a: 3 },
    { q: "'He felt the weight of responsibility.' This is ___.", o: ["simile","metaphor","alliteration","onomatopoeia"], a: 1 },
    { q: "The passage is mostly about ___.", o: ["how to cook","protecting the environment","learning English","a sports event"], a: 1 },
    { q: "'Eager' is closest in meaning to ___.", o: ["tired","nervous","enthusiastic","confused"], a: 2 },
  ],
  advanced: [
    { q: "'The data was inconclusive.' This means ___.", o: ["data was very clear","data had no definitive answer","data was incorrect","data was very helpful"], a: 1 },
    { q: "'Ambiguous' most nearly means ___.", o: ["clear","uncertain","difficult","important"], a: 1 },
    { q: "An 'inference' is ___.", o: ["a direct quote","a conclusion from evidence","the main idea","a rhetorical question"], a: 1 },
    { q: "'The economy is cyclical.' 'Cyclical' means ___.", o: ["random","linear","repeating in patterns","always growing"], a: 2 },
    { q: "'Pragmatic' means ___.", o: ["idealistic","practical","emotional","theoretical"], a: 1 },
    { q: "'Life is a journey' is an example of ___.", o: ["simile","metaphor","alliteration","hyperbole"], a: 1 },
    { q: "'Sardonic' means ___.", o: ["enthusiastic","mockingly critical","neutral","compassionate"], a: 1 },
    { q: "'The policy had unintended consequences.' This suggests ___.", o: ["policy worked perfectly","policy had unplanned results","policy caused no problems","policy was effective"], a: 1 },
    { q: "'Ubiquitous' means ___.", o: ["rare","hidden","present everywhere","expensive"], a: 2 },
    { q: "Which best describes 'irony'?", o: ["saying exactly what you mean","saying the opposite of what you mean","asking a question","giving a command"], a: 1 },
  ],
  adult: [
    { q: "The meeting has been ___ to next Monday.", o: ["put off","called off","postponed","both A and C"], a: 3 },
    { q: "'Concise' writing is ___.", o: ["long and detailed","brief and clear","emotional","technical"], a: 1 },
    { q: "'The proposal was met with skepticism.' 'Skepticism' means ___.", o: ["enthusiasm","doubt","approval","confusion"], a: 1 },
    { q: "Which is the most formal?", o: ["I wanna go.","I want to go.","I'd like to go, please.","Wanna come?"], a: 2 },
    { q: "'Leverage' in business means ___.", o: ["to lose","to use something to gain advantage","to ignore","to slow down"], a: 1 },
    { q: "A 'deadline' is ___.", o: ["a long meeting","the last time to finish something","the start of a project","a type of contract"], a: 1 },
    { q: "'Collaborate' means ___.", o: ["to compete","to work together","to disagree","to manage alone"], a: 1 },
    { q: "'He's on the fence about the decision.' This means ___.", o: ["he agrees","he disagrees","he is undecided","he is angry"], a: 2 },
    { q: "Which phrase shows contrast?", o: ["In addition,","Therefore,","However,","As a result,"], a: 2 },
    { q: "'Transparent' communication means ___.", o: ["hidden","open and honest","technical","brief"], a: 1 },
  ],
};

export function pickQuestions(level: LevelKey, count = 5): Question[] {
  const pool = QUESTION_BANK[level] || QUESTION_BANK.basic;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}
