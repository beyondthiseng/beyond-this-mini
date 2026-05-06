// src/screens/AdmissionTest.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Btn, Card, Page, Badge } from '../components/ui';
import type { Student } from '../types';
import type { LevelKey, AdmissionResult, PassageQuestion, StandaloneQuestion } from '../types/questions';
import { LEVEL_LABELS, LEVEL_DESC, LEVEL_ORDER } from '../types/questions';
import { loadQuestionDB, levelUp, levelDown, judgePhase1, judgePhase2, analyzeAnswers, getPhase2Questions } from '../data/questions';
import { gid, tod, saveTests } from '../data/storage';

interface Props {
  students: Student[];
  setStudents: (s: Student[]) => void;
  tests: AdmissionResult[];
  setTests: (t: AdmissionResult[]) => void;
}

type Screen = 'list' | 'testing' | 'result_confirm';
type Section = 'vocab' | 'grammar' | 'reading_short' | 'reading_medium' | 'reading_long';

interface SessionState {
  studentId: string;
  startLevel: LevelKey;
  phase: 1 | 2;
  currentLevel: LevelKey;
  direction: 'up' | 'down' | null;
  answers: Record<string, number | null>;
  p2Vocab: StandaloneQuestion[];
  p2Grammar: StandaloneQuestion[];
  p2Passages: PassageQuestion[];
  section: Section;
  passageQuestionIdx: number;
  teacherNote: string;
}

const SECTION_ORDER: Section[] = ['vocab', 'grammar', 'reading_short', 'reading_medium', 'reading_long'];
const SECTION_LABEL: Record<Section, string> = {
  vocab: 'Vocabulary', grammar: 'Grammar',
  reading_short: 'Reading — 짧은 지문',
  reading_medium: 'Reading — 중간 지문',
  reading_long: 'Reading — 긴 지문',
};

function openPrint(st: Student, r: AdmissionResult) {
  const pct = Math.round(r.phase1Score / r.phase1Total * 100);
  const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>입학테스트 결과</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;padding:16mm 18mm;font-size:12px;color:#1E293B;line-height:1.6}
h1{font-size:20px;font-weight:700;text-align:center;margin-bottom:3px}.sub{text-align:center;font-size:11px;color:#64748B;margin-bottom:14px}
.info{display:grid;grid-template-columns:1fr 1fr 1fr;border:0.5px solid #CBD5E1;border-radius:6px;padding:10px 14px;gap:6px;margin-bottom:14px;font-size:11px}
.info b{color:#1E293B}.level-box{border:2.5px solid #4A9E8E;border-radius:10px;padding:16px;text-align:center;margin-bottom:14px}
.level-box .lbl{font-size:11px;color:#64748B;margin-bottom:4px}.level-box .val{font-size:28px;font-weight:800;color:#15803D}
.level-box .desc{font-size:11px;color:#64748B;margin-top:4px}
h2{font-size:13px;font-weight:700;border-bottom:1.5px solid #1E293B;padding-bottom:3px;margin:12px 0 8px}
table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px}th,td{border:0.5px solid #CBD5E1;padding:5px 9px}th{background:#F8FAFC;font-weight:700;text-align:left}
.note{border:0.5px solid #CBD5E1;border-radius:5px;padding:9px 12px;min-height:50px;font-size:12px;line-height:1.75;white-space:pre-wrap}
.footer{margin-top:16px;display:flex;justify-content:space-between;font-size:11px;color:#64748B;border-top:0.5px solid #CBD5E1;padding-top:9px}
@media print{body{padding:10mm 12mm}}</style></head><body>
<h1>이보다 더 영어교습소</h1>
<div class="sub">입학 레벨 테스트 결과 · ${r.date}</div>
<div class="info"><div>이름: <b>${st.name}</b></div><div>학년: <b>${st.grade}</b></div><div>날짜: <b>${r.date}</b></div></div>
<div class="level-box"><div class="lbl">추천 레벨</div><div class="val">${LEVEL_LABELS[r.finalLevel]}</div><div class="desc">${LEVEL_DESC[r.finalLevel]}</div></div>
<h2>영역별 점수</h2>
<table><tr><th>영역</th><th>점수</th><th>정답률</th></tr>
<tr><td>Vocabulary</td><td>${r.vocabScore}/8</td><td>${Math.round(r.vocabScore/8*100)}%</td></tr>
<tr><td>Grammar</td><td>${r.grammarScore}/7</td><td>${Math.round(r.grammarScore/7*100)}%</td></tr>
<tr><td>Reading</td><td>${r.readingScore}/15</td><td>${Math.round(r.readingScore/15*100)}%</td></tr>
<tr><td><b>합계</b></td><td><b>${r.phase1Score}/${r.phase1Total}</b></td><td><b>${pct}%</b></td></tr></table>
<h2>선생님 메모</h2><div class="note">${(r.teacherNote||'').replace(/\n/g,'<br>')}</div>
<h2>학부모 안내</h2><div class="note">${(r.parentSummary||'').replace(/\n/g,'<br>')}</div>
<div class="footer"><div>담당 선생님 _________________________ (서명)</div><div>학부모 확인 _________________________ (서명)</div></div>
<script>window.onload=()=>window.print();<\/script></body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
  else alert('팝업을 허용해 주세요.');
}

export default function AdmissionTest({ students, setStudents, tests, setTests }: Props) {
  const [screen, setScreen] = useState<Screen>('list');
  const [tab, setTab] = useState<'start' | 'results'>('start');
  const [session, setSession] = useState<SessionState | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const db = loadQuestionDB();
  const testStudents = students.filter(s =>
    ['테스트예정','재원생','테스트완료','미등록','문의'].includes(s.status)
  );

  const startTest = (studentId: string, startLevel: LevelKey) => {
    setSession({
      studentId, startLevel, phase: 1, currentLevel: startLevel,
      direction: null, answers: {},
      p2Vocab: [], p2Grammar: [], p2Passages: [],
      section: 'vocab', passageQuestionIdx: 0, teacherNote: '',
    });
    setScreen('testing');
  };

  const getValidSections = useCallback((): Section[] => {
    if (!session) return [];
    return session.phase === 2
      ? ['vocab','grammar','reading_short','reading_medium']
      : SECTION_ORDER;
  }, [session]);

  const getSectionTotal = useCallback((sec: Section): number => {
    if (!session) return 0;
    const levelDb = db[session.currentLevel];
    const isP2 = session.phase === 2;
    if (sec === 'vocab') return isP2 ? session.p2Vocab.length : levelDb.vocabulary.length;
    if (sec === 'grammar') return isP2 ? session.p2Grammar.length : levelDb.grammar.length;
    const passMap: Record<string, PassageQuestion|undefined> = {
      reading_short: isP2 ? session.p2Passages[0] : levelDb.passages.short,
      reading_medium: isP2 ? session.p2Passages[1] : levelDb.passages.medium,
      reading_long: isP2 ? undefined : levelDb.passages.long,
    };
    return passMap[sec]?.questions.length ?? 0;
  }, [session, db]);

  const getCurrentQuestion = useCallback(() => {
    if (!session) return null;
    const levelDb = db[session.currentLevel];
    const isP2 = session.phase === 2;
    if (session.section === 'vocab') {
      return (isP2 ? session.p2Vocab : levelDb.vocabulary)[session.passageQuestionIdx] ?? null;
    }
    if (session.section === 'grammar') {
      return (isP2 ? session.p2Grammar : levelDb.grammar)[session.passageQuestionIdx] ?? null;
    }
    const passMap: Record<string, PassageQuestion|undefined> = {
      reading_short: isP2 ? session.p2Passages[0] : levelDb.passages.short,
      reading_medium: isP2 ? session.p2Passages[1] : levelDb.passages.medium,
      reading_long: isP2 ? undefined : levelDb.passages.long,
    };
    return passMap[session.section]?.questions[session.passageQuestionIdx] ?? null;
  }, [session, db]);

  const { answered, totalQ } = useMemo(() => {
    if (!session) return { answered: 0, totalQ: 0 };
    const secs = getValidSections();
    const total = secs.reduce((sum, s) => sum + getSectionTotal(s), 0);
    return { answered: Object.keys(session.answers).length, totalQ: total };
  }, [session, getValidSections, getSectionTotal]);

  const chooseAnswer = (idx: number) => {
    const q = getCurrentQuestion();
    if (!q) return;
    const qId = (q as any).id;
    if (session?.answers[qId] !== undefined && session.answers[qId] !== null) return;
    setSession(s => s ? { ...s, answers: { ...s.answers, [qId]: idx } } : s);
  };

  const finishPhase = useCallback(() => {
    if (!session) return;
    const levelDb = db[session.currentLevel];
    const bd = analyzeAnswers(levelDb, session.answers);
    const total = bd.vocabTotal + bd.grammarTotal + bd.readingTotal;
    const score = bd.vocab + bd.grammar + bd.reading;

    if (session.phase === 1) {
      const judgment = judgePhase1(score, total, session.currentLevel);
      if (judgment === 'confirm') {
        setScreen('result_confirm');
      } else {
        const nextLv = judgment === 'up' ? levelUp(session.currentLevel) : levelDown(session.currentLevel);
        const p2 = getPhase2Questions(db[nextLv]);
        setSession(s => s ? {
          ...s, phase: 2, direction: judgment, currentLevel: nextLv,
          p2Vocab: p2.vocab, p2Grammar: p2.grammar, p2Passages: p2.passages,
          section: 'vocab', passageQuestionIdx: 0,
        } : s);
      }
    } else {
      setScreen('result_confirm');
    }
  }, [session, db]);

  const nextQuestion = useCallback(() => {
    if (!session) return;
    const sections = getValidSections();
    const secIdx = sections.indexOf(session.section);
    const secTotal = getSectionTotal(session.section);
    if (session.passageQuestionIdx + 1 < secTotal) {
      setSession(s => s ? { ...s, passageQuestionIdx: s.passageQuestionIdx + 1 } : s);
    } else if (secIdx + 1 < sections.length) {
      setSession(s => s ? { ...s, section: sections[secIdx + 1], passageQuestionIdx: 0 } : s);
    } else {
      finishPhase();
    }
  }, [session, getValidSections, getSectionTotal, finishPhase]);

  const computeFinalLevel = (): LevelKey => {
    if (!session) return 'basic';
    if (session.phase === 1) return session.currentLevel;
    const p2Qs = [
      ...session.p2Vocab, ...session.p2Grammar,
      ...session.p2Passages.flatMap(p => p.questions),
    ];
    const correct = p2Qs.filter(q => session.answers[(q as any).id] === (q as any).a).length;
    return judgePhase2(correct, p2Qs.length, session.direction!, session.startLevel, session.currentLevel);
  };

  const saveResult = () => {
    if (!session) return;
    const finalLevel = computeFinalLevel();
    const p1Db = db[session.startLevel];
    const bd = analyzeAnswers(p1Db, session.answers);
    const p1Total = bd.vocabTotal + bd.grammarTotal + bd.readingTotal;
    const p1Score = bd.vocab + bd.grammar + bd.reading;
    let p2Score: number | null = null;
    let p2Total: number | null = null;
    if (session.phase === 2) {
      const p2Qs = [...session.p2Vocab,...session.p2Grammar,...session.p2Passages.flatMap(p=>p.questions)];
      p2Total = p2Qs.length;
      p2Score = p2Qs.filter(q=>session.answers[(q as any).id]===(q as any).a).length;
    }
    const st = students.find(x => x.id === session.studentId);
    const summary = [
      `${st?.name??''} 학생 입학 레벨 테스트 결과를 안내드립니다.`,
      ``,`◆ 추천 레벨: ${LEVEL_LABELS[finalLevel]}`,
      `◆ 수준: ${LEVEL_DESC[finalLevel]}`,``,
      `[ 영역별 결과 ]`,
      `• Vocabulary: ${bd.vocab}/${bd.vocabTotal}`,
      `• Grammar: ${bd.grammar}/${bd.grammarTotal}`,
      `• Reading: ${bd.reading}/${bd.readingTotal}`,
      session.teacherNote ? `\n선생님 메모: ${session.teacherNote}` : '',
    ].join('\n');

    const result: AdmissionResult = {
      id: gid(), studentId: session.studentId, date: tod(),
      startLevel: session.startLevel,
      phase1Level: session.startLevel, phase1Score: p1Score, phase1Total: p1Total,
      phase2Level: session.phase===2 ? session.currentLevel : null,
      phase2Score: p2Score, phase2Total: p2Total, finalLevel,
      vocabScore: bd.vocab, grammarScore: bd.grammar, readingScore: bd.reading,
      teacherNote: session.teacherNote, parentSummary: summary,
    };
    const updated = [...tests, result];
    setTests(updated); saveTests(updated);
    const updatedStudents = students.map(x =>
      x.id===session.studentId ? {...x, status:'테스트완료' as Student['status'], level:finalLevel, updatedAt:tod()} : x
    );
    setStudents(updatedStudents);
    setScreen('list'); setSession(null);
  };

  // ── RENDER: 테스트 진행 ───────────────────────────────────────
  if (screen === 'testing' && session) {
    const levelDb = db[session.currentLevel];
    const isP2 = session.phase === 2;
    const sections = getValidSections();
    const secIdx = sections.indexOf(session.section);
    const q = getCurrentQuestion();
    const isReading = session.section.startsWith('reading');
    const passMap: Record<string,PassageQuestion|undefined> = {
      reading_short: isP2 ? session.p2Passages[0] : levelDb.passages.short,
      reading_medium: isP2 ? session.p2Passages[1] : levelDb.passages.medium,
      reading_long: isP2 ? undefined : levelDb.passages.long,
    };
    const passage = isReading ? passMap[session.section] : null;
    const qId = q ? (q as any).id : '';
    const chosen = session.answers[qId];
    const hasAnswered = chosen !== undefined && chosen !== null;
    const isLast = secIdx===sections.length-1 && session.passageQuestionIdx+1>=getSectionTotal(session.section);

    return (
      <div className="page" style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <Btn variant="ghost" small onClick={()=>{ if(confirm('테스트를 중단할까요?')){ setScreen('list'); setSession(null); } }}>중단</Btn>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'#94A3B8' }}>
              {isP2?`2단계 · ${LEVEL_LABELS[session.currentLevel]}`:`1단계 · ${LEVEL_LABELS[session.currentLevel]}`}
              &nbsp;·&nbsp;{SECTION_LABEL[session.section]}&nbsp;·&nbsp;{session.passageQuestionIdx+1}/{getSectionTotal(session.section)}
            </div>
            <div style={{ height:5, background:'#F1F5F9', borderRadius:3, marginTop:4, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'linear-gradient(90deg,#4A9E8E,#7EC8BF)', borderRadius:3, width:`${answered/totalQ*100}%`, transition:'width 0.3s' }} />
            </div>
          </div>
          <span style={{ fontSize:11, color:'#94A3B8' }}>{answered}/{totalQ}</span>
        </div>

        <div style={{ flex:1, overflowY:'auto', display:'flex', gap:14 }}>
          {passage && (
            <Card style={{ flex:1, maxWidth:420, fontSize:13, lineHeight:1.85, color:'#374151', overflowY:'auto' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#4A9E8E', marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 }}>{passage.title}</div>
              <div style={{ whiteSpace:'pre-wrap' }}>{passage.passage}</div>
            </Card>
          )}
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
            {q && (
              <Card>
                <div style={{ fontSize:11, fontWeight:700, color:'#94A3B8', marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 }}>
                  {session.section==='vocab'?'Vocabulary':session.section==='grammar'?'Grammar':'Reading Comprehension'}
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:'#1E293B', marginBottom:20, lineHeight:1.6 }}>{(q as any).q}</div>
                {((q as any).o as string[]).map((opt:string, i:number) => {
                  let cls='test-option';
                  if(hasAnswered){ if(i===(q as any).a) cls+=' correct'; else if(i===chosen) cls+=' wrong'; }
                  else if(chosen===i) cls+=' selected';
                  return (
                    <button key={i} className={cls} onClick={()=>chooseAnswer(i)}>
                      <span style={{ fontWeight:700, marginRight:10, color:'#CBD5E1' }}>{String.fromCharCode(65+i)}.</span>{opt}
                    </button>
                  );
                })}
                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
                  <Btn onClick={nextQuestion} disabled={!hasAnswered}>{isLast?'채점하기 →':'다음 →'}</Btn>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: 결과 확인 ─────────────────────────────────────────
  if (screen === 'result_confirm' && session) {
    const finalLevel = computeFinalLevel();
    const p1Db = db[session.startLevel];
    const bd = analyzeAnswers(p1Db, session.answers);
    const p1Total = bd.vocabTotal+bd.grammarTotal+bd.readingTotal;
    const p1Score = bd.vocab+bd.grammar+bd.reading;
    const pct = Math.round(p1Score/p1Total*100);

    return (
      <div className="page">
        <div className="page-header"><h1 className="page-title">테스트 결과 확인</h1></div>
        <div style={{ maxWidth:600 }}>
          <Card style={{ textAlign:'center', marginBottom:14, padding:'22px 24px', background:'linear-gradient(135deg,#F0FDF4,#E0F2FE)' }}>
            <div style={{ fontSize:12, color:'#64748B', marginBottom:6 }}>추천 레벨</div>
            <div style={{ fontSize:34, fontWeight:800, color:'#15803D' }}>{LEVEL_LABELS[finalLevel]}</div>
            <div style={{ fontSize:12, color:'#64748B', marginTop:4 }}>{LEVEL_DESC[finalLevel]}</div>
          </Card>
          <Card style={{ marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>영역별 결과</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:10 }}>
              {[{l:'Vocabulary',v:bd.vocab,t:bd.vocabTotal},{l:'Grammar',v:bd.grammar,t:bd.grammarTotal},{l:'Reading',v:bd.reading,t:bd.readingTotal}].map(item=>{
                const p=Math.round(item.v/item.t*100);
                const color=p>=70?'#15803D':p>=50?'#B45309':'#B91C1C';
                return (
                  <div key={item.l} style={{ background:'#F8FAFC', borderRadius:8, padding:'10px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:11, color:'#94A3B8', marginBottom:4 }}>{item.l}</div>
                    <div style={{ fontSize:18, fontWeight:800, color }}>{item.v}/{item.t}</div>
                    <div style={{ fontSize:10, color }}>{p}%</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:'#F8FAFC', borderRadius:6, padding:'8px 12px', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:13, fontWeight:700 }}>합계</span>
              <span style={{ fontSize:13, fontWeight:800, color:pct>=70?'#15803D':pct>=40?'#B45309':'#B91C1C' }}>{p1Score}/{p1Total} ({pct}%)</span>
            </div>
          </Card>
          <Card style={{ marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>선생님 메모</div>
            <textarea value={session.teacherNote} onChange={e=>setSession(s=>s?{...s,teacherNote:e.target.value}:s)}
              placeholder="추가 관찰 사항, 학부모 전달 내용..." rows={3}
              style={{ width:'100%', padding:'8px 10px', border:'1px solid #E2E8F0', borderRadius:6, fontSize:13, outline:'none', resize:'vertical' }} />
          </Card>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <Btn variant="ghost" onClick={()=>{setScreen('list');setSession(null);}}>취소</Btn>
            <Btn onClick={saveResult}>저장 및 완료</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: 메인 목록 ─────────────────────────────────────────
  const allResults = [...tests].sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <Page title="입학 테스트">
      <div style={{ display:'flex', borderBottom:'1px solid #E2E8F0', marginBottom:16 }}>
        {(['start','results'] as const).map(t=>(
          <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={()=>setTab(t)}>
            {t==='start'?'테스트 시작':'결과 보기'}
          </button>
        ))}
      </div>

      {tab==='start' && (
        <div>
          <div style={{ fontSize:12, color:'#94A3B8', marginBottom:12, lineHeight:1.75 }}>
            학생을 선택하고 시작 레벨을 클릭하세요.<br/>
            Vocabulary 8문항 + Grammar 7문항 + Reading 15문항 (짧은/중간/긴 지문) = 총 30문항<br/>
            점수에 따라 자동으로 레벨이 조정됩니다. (80% 이상 → 상위 레벨, 40% 이하 → 하위 레벨)
          </div>
          {testStudents.length===0 ? (
            <Card style={{ textAlign:'center', color:'#94A3B8', padding:32 }}>대상 학생이 없습니다.</Card>
          ) : testStudents.map(s=>(
            <Card key={s.id} style={{ marginBottom:8, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:120 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
                <div style={{ fontSize:12, color:'#94A3B8' }}>{s.grade} · {s.school}</div>
              </div>
              <Badge status={s.status} />
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {LEVEL_ORDER.map(lv=>(
                  <Btn key={lv} small variant="ghost" onClick={()=>startTest(s.id,lv)}>
                    {LEVEL_LABELS[lv].split(' ')[0]} 시작
                  </Btn>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==='results' && (
        <div>
          {allResults.length===0 ? (
            <Card style={{ textAlign:'center', color:'#94A3B8', padding:32 }}>테스트 기록 없음</Card>
          ) : allResults.map(r=>{
            const st=students.find(x=>x.id===r.studentId);
            const pct=Math.round(r.phase1Score/r.phase1Total*100);
            return (
              <Card key={r.id} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <span style={{ fontSize:14, fontWeight:700 }}>{st?.name??'?'}</span>
                    <span style={{ fontSize:12, color:'#94A3B8', marginLeft:8 }}>{st?.grade}</span>
                    <span style={{ fontSize:11, color:'#CBD5E1', marginLeft:8 }}>{r.date}</span>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <div style={{ background:'#F0FDF4', color:'#15803D', fontWeight:800, fontSize:13, padding:'4px 12px', borderRadius:6 }}>{LEVEL_LABELS[r.finalLevel]}</div>
                    <Btn small variant="ghost" onClick={()=>st&&openPrint(st,r)}>🖨 출력</Btn>
                    <Btn small variant="ghost" onClick={()=>{ navigator.clipboard.writeText(r.parentSummary); setCopied(r.id); setTimeout(()=>setCopied(null),2000); }}>
                      {copied===r.id?'✓ 복사':'복사'}
                    </Btn>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                  {[{l:'Vocabulary',v:r.vocabScore,t:8},{l:'Grammar',v:r.grammarScore,t:7},{l:'Reading',v:r.readingScore,t:15},{l:'합계',v:r.phase1Score,t:r.phase1Total}].map(item=>{
                    const p=Math.round(item.v/item.t*100);
                    return (
                      <div key={item.l} style={{ background:'#F8FAFC', borderRadius:6, padding:'6px 8px', textAlign:'center' }}>
                        <div style={{ fontSize:10, color:'#94A3B8' }}>{item.l}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:p>=70?'#15803D':p>=40?'#B45309':'#B91C1C' }}>{item.v}/{item.t}</div>
                      </div>
                    );
                  })}
                </div>
                {r.teacherNote&&<div style={{ fontSize:12, color:'#64748B', borderTop:'0.5px solid #F1F5F9', paddingTop:8, marginTop:8, lineHeight:1.65 }}>{r.teacherNote}</div>}
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
