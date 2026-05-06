// src/screens/AdmissionTest.tsx
import React, { useState, useMemo } from 'react';
import { Badge, Btn, Card, Page } from '../components/ui';
import type { AdmissionTestResult, Student } from '../types';
import type { LevelKey } from '../types';
import { gid, tod, saveTests } from '../data/storage';
import { LEVEL_LABELS, LEVEL_ORDER, LEVEL_DESC } from '../data/levelTemplates';
import { pickQuestions } from '../data/questionBank';
import type { Question } from '../data/questionBank';

interface Props {
  students: Student[];
  setStudents: (s: Student[]) => void;
  tests: AdmissionTestResult[];
  setTests: (t: AdmissionTestResult[]) => void;
  setPage: (p: string) => void;
}

type TestPhase = 'select_student' | 'select_start' | 'testing_p1' | 'testing_p2' | 'done' | 'results';

interface Session {
  studentId: string;
  startLevel: LevelKey;
  p1Level: LevelKey;
  p1Questions: Question[];
  p1Answers: (number | null)[];
  p1Correct: number;
  p2Level: LevelKey | null;
  p2Questions: Question[];
  p2Answers: (number | null)[];
  p2Correct: number | null;
  currentQ: number;
  chosen: number | null;
  finalLevel: LevelKey;
  teacherNote: string;
}

function levelUp(lv: LevelKey): LevelKey {
  const i = LEVEL_ORDER.indexOf(lv);
  return i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : lv;
}
function levelDown(lv: LevelKey): LevelKey {
  const i = LEVEL_ORDER.indexOf(lv);
  return i > 0 ? LEVEL_ORDER[i - 1] : lv;
}
function calcFinalLevel(p1Lv: LevelKey, p1Correct: number, p2Lv: LevelKey | null, p2Correct: number | null): LevelKey {
  const pct1 = p1Correct / 5;
  if (pct1 >= 0.8) {
    // Phase 2 결과로 확정
    if (p2Correct !== null && p2Lv !== null) {
      const pct2 = p2Correct / 5;
      if (pct2 >= 0.6) return p2Lv;
      return p1Lv;
    }
    return levelUp(p1Lv);
  }
  if (pct1 >= 0.4) return p1Lv;
  return levelDown(p1Lv);
}

function openPrintWindow(st: Student, test: AdmissionTestResult) {
  const pct1 = Math.round((test.p1Correct / test.p1Total) * 100);
  const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>입학테스트 결과</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;padding:18mm;font-size:12px;color:#1E293B}
h1{font-size:20px;font-weight:700;text-align:center;margin-bottom:3px}.sub{text-align:center;color:#64748B;font-size:11px;margin-bottom:16px}
.info-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;border:0.5px solid #CBD5E1;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:11px}
.info-grid b{color:#1E293B}.level-box{border:2.5px solid #4A9E8E;border-radius:10px;padding:16px;text-align:center;margin-bottom:16px}
.level-box .lbl{font-size:11px;color:#64748B;margin-bottom:4px}.level-box .val{font-size:28px;font-weight:800;color:#15803D}
.level-box .desc{font-size:11px;color:#64748B;margin-top:4px}
h2{font-size:13px;font-weight:700;border-bottom:1.5px solid #1E293B;padding-bottom:4px;margin:14px 0 8px}
table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px}
th,td{border:0.5px solid #CBD5E1;padding:6px 9px}th{background:#F8FAFC;font-weight:700}
.note-box{border:0.5px solid #CBD5E1;border-radius:6px;padding:10px 12px;min-height:56px;font-size:12px;line-height:1.75;color:#374151;white-space:pre-wrap}
.footer{margin-top:20px;display:flex;justify-content:space-between;font-size:11px;color:#64748B;border-top:0.5px solid #CBD5E1;padding-top:10px}
@media print{body{padding:10mm 12mm}}</style></head><body>
<h1>이보다 더 영어교습소</h1>
<div class="sub">입학 레벨 테스트 결과 · ${test.date}</div>
<div class="info-grid">
  <div>이름: <b>${st.name}</b></div>
  <div>학년: <b>${st.grade}</b></div>
  <div>날짜: <b>${test.date}</b></div>
</div>
<div class="level-box">
  <div class="lbl">추천 레벨</div>
  <div class="val">${LEVEL_LABELS[test.finalLevel]}반</div>
  <div class="desc">${LEVEL_DESC[test.finalLevel]}</div>
</div>
<h2>단계별 결과</h2>
<table>
  <tr><th>단계</th><th>테스트 레벨</th><th>점수</th><th>정답률</th><th>판정</th></tr>
  <tr>
    <td>1단계</td>
    <td>${LEVEL_LABELS[test.p1Level]}</td>
    <td>${test.p1Correct}/${test.p1Total}</td>
    <td>${pct1}%</td>
    <td>${pct1 >= 80 ? '▲ 상위 레벨 진입 시도' : pct1 >= 40 ? '✓ 현재 레벨 적정' : '▼ 하위 레벨 조정'}</td>
  </tr>
  ${test.p2Level !== null ? `<tr>
    <td>2단계</td>
    <td>${LEVEL_LABELS[test.p2Level!]}</td>
    <td>${test.p2Correct}/${test.p2Total}</td>
    <td>${Math.round(((test.p2Correct??0)/(test.p2Total??5))*100)}%</td>
    <td>${((test.p2Correct??0)/(test.p2Total??5)) >= 0.6 ? '✓ 상위 레벨 확정' : '▼ 이전 레벨로 확정'}</td>
  </tr>` : ''}
</table>
<h2>선생님 메모</h2>
<div class="note-box">${(test.teacherNote || '').replace(/\n/g,'<br>')}</div>
<h2>학부모 안내</h2>
<div class="note-box">${(test.parentSummary || '').replace(/\n/g,'<br>')}</div>
<div class="footer">
  <div>담당 선생님 _________________________ (서명)</div>
  <div>학부모 확인 _________________________ (서명)</div>
</div>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
  else alert('팝업을 허용해 주세요.');
}

export default function AdmissionTest({ students, setStudents, tests, setTests, setPage }: Props) {
  const [view, setView] = useState<'list' | 'test' | 'results'>('list');
  const [phase, setPhase] = useState<TestPhase>('select_student');
  const [session, setSession] = useState<Session | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const testStudents = students.filter(s => ['테스트예정','재원생','테스트완료'].includes(s.status));

  // ── 테스트 시작 흐름 ──────────────────────────────────────────
  const startTest = (sid: string, startLv: LevelKey) => {
    const qs = pickQuestions(startLv, 5);
    setSession({
      studentId: sid, startLevel: startLv,
      p1Level: startLv, p1Questions: qs, p1Answers: Array(qs.length).fill(null), p1Correct: 0,
      p2Level: null, p2Questions: [], p2Answers: [], p2Correct: null,
      currentQ: 0, chosen: null, finalLevel: startLv, teacherNote: '',
    });
    setPhase('testing_p1');
    setView('test');
  };

  const chooseAnswer = (idx: number) => {
    if (session && session.chosen === null) setSession(s => s ? { ...s, chosen: idx } : s);
  };

  const nextQuestion = () => {
    if (!session || session.chosen === null) return;
    const isP2 = phase === 'testing_p2';
    const questions = isP2 ? session.p2Questions : session.p1Questions;
    const answers = isP2 ? [...session.p2Answers] : [...session.p1Answers];
    answers[session.currentQ] = session.chosen;
    const isCorrect = session.chosen === questions[session.currentQ].a;
    const correct = (isP2 ? (session.p2Correct ?? 0) : session.p1Correct) + (isCorrect ? 1 : 0);

    if (session.currentQ + 1 < questions.length) {
      setSession(s => s ? {
        ...s,
        ...(isP2 ? { p2Answers: answers, p2Correct: correct } : { p1Answers: answers, p1Correct: correct }),
        currentQ: s.currentQ + 1, chosen: null,
      } : s);
    } else {
      // Phase 종료
      if (!isP2) {
        const pct = correct / questions.length;
        if (pct >= 0.8 && levelUp(session.p1Level) !== session.p1Level) {
          // Phase 2: 상위 레벨 시도
          const p2lv = levelUp(session.p1Level);
          const p2qs = pickQuestions(p2lv, 5);
          setSession(s => s ? {
            ...s, p1Answers: answers, p1Correct: correct,
            p2Level: p2lv, p2Questions: p2qs, p2Answers: Array(p2qs.length).fill(null), p2Correct: 0,
            currentQ: 0, chosen: null,
          } : s);
          setPhase('testing_p2');
        } else {
          const finalLevel = calcFinalLevel(session.p1Level, correct, null, null);
          finishTest({ ...session, p1Answers: answers, p1Correct: correct, finalLevel });
        }
      } else {
        const finalLevel = calcFinalLevel(session.p1Level, session.p1Correct, session.p2Level, correct);
        finishTest({ ...session, p2Answers: answers, p2Correct: correct, finalLevel });
      }
    }
  };

  const finishTest = (s: Session) => {
    setSession({ ...s, chosen: null });
    setPhase('done');
  };

  const saveResult = () => {
    if (!session) return;
    const st = students.find(x => x.id === session.studentId);
    const summary = `${st?.name ?? ''} 학생 레벨 테스트 결과를 안내드립니다.\n\n추천 레벨: ${LEVEL_LABELS[session.finalLevel]}반\n${LEVEL_DESC[session.finalLevel]}\n\n1단계(${LEVEL_LABELS[session.p1Level]}): ${session.p1Correct}/5문항 정답\n${session.p2Level ? `2단계(${LEVEL_LABELS[session.p2Level]}): ${session.p2Correct}/5문항 정답\n` : ''}${session.teacherNote ? `\n선생님 코멘트: ${session.teacherNote}` : ''}`;

    const result: AdmissionTestResult = {
      id: gid(), studentId: session.studentId, date: tod(),
      startLevel: session.startLevel, p1Level: session.p1Level,
      p1Correct: session.p1Correct, p1Total: session.p1Questions.length,
      p2Level: session.p2Level, p2Correct: session.p2Correct, p2Total: session.p2Level ? session.p2Questions.length : null,
      finalLevel: session.finalLevel, teacherNote: session.teacherNote, parentSummary: summary,
    };

    const updatedTests = [...tests, result];
    setTests(updatedTests); saveTests(updatedTests);

    // 학생 상태 & 레벨 업데이트
    const updatedStudents = students.map(x =>
      x.id === session.studentId ? { ...x, status: '테스트완료' as Student['status'], level: session.finalLevel, updatedAt: tod() } : x
    );
    setStudents(updatedStudents);

    setView('list'); setPhase('select_student'); setSession(null);
  };

  // ── 결과 보기 ──────────────────────────────────────────────────
  const allResults = useMemo(() =>
    [...tests].sort((a, b) => b.date.localeCompare(a.date))
  , [tests]);

  // ── RENDER: 테스트 진행 ──────────────────────────────────────
  if (view === 'test' && session && phase !== 'done') {
    const questions = phase === 'testing_p2' ? session.p2Questions : session.p1Questions;
    const currentLevel = phase === 'testing_p2' ? session.p2Level! : session.p1Level;
    const q = questions[session.currentQ];
    if (!q) return null;

    const phaseLabel = phase === 'testing_p1' ? '1단계' : '2단계 (상위레벨 도전)';
    const progress = ((session.currentQ) / questions.length) * 100;

    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30 }}>
        <div style={{ width: '100%', maxWidth: 560, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>
              {phaseLabel} · {LEVEL_LABELS[currentLevel]} · {session.currentQ + 1}/{questions.length}
            </span>
            <Btn variant="ghost" small onClick={() => { setView('list'); setPhase('select_student'); setSession(null); }}>중단</Btn>
          </div>
          <div className="test-progress">
            <div className="test-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="test-question-card">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {LEVEL_LABELS[currentLevel]} Level
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 20, lineHeight: 1.55 }}>
            {q.q}
          </div>
          {q.o.map((opt, i) => (
            <button
              key={i}
              className={`test-option${session.chosen === i ? ' selected' : ''}`}
              onClick={() => chooseAnswer(i)}
            >
              <span style={{ fontWeight: 700, marginRight: 10, color: '#CBD5E1' }}>{String.fromCharCode(65+i)}.</span>
              {opt}
            </button>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Btn onClick={nextQuestion} disabled={session.chosen === null}>
              {session.currentQ + 1 < questions.length ? '다음 →' : '완료'}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: 결과 확인 & 저장 ──────────────────────────────────
  if (view === 'test' && session && phase === 'done') {
    const pct1 = Math.round((session.p1Correct / session.p1Questions.length) * 100);
    const pct2 = session.p2Correct !== null ? Math.round((session.p2Correct / session.p2Questions.length) * 100) : null;

    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">테스트 결과 확인</h1>
        </div>

        <div style={{ maxWidth: 600 }}>
          <Card style={{ textAlign: 'center', marginBottom: 14, padding: '20px 24px', background: 'linear-gradient(135deg,#F0FDF4,#E0F2FE)' }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>추천 레벨</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#15803D' }}>{LEVEL_LABELS[session.finalLevel]}반</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{LEVEL_DESC[session.finalLevel]}</div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>단계별 결과</div>
            <table className="tbl">
              <thead>
                <tr><th>단계</th><th>레벨</th><th>점수</th><th>정답률</th><th>판정</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>1단계</td>
                  <td>{LEVEL_LABELS[session.p1Level]}</td>
                  <td>{session.p1Correct}/{session.p1Questions.length}</td>
                  <td style={{ color: pct1 >= 80 ? '#15803D' : pct1 >= 40 ? '#B45309' : '#B91C1C', fontWeight: 700 }}>{pct1}%</td>
                  <td style={{ fontSize: 12 }}>{pct1 >= 80 ? '▲ 상위 도전' : pct1 >= 40 ? '✓ 적정' : '▼ 조정'}</td>
                </tr>
                {session.p2Level && pct2 !== null && (
                  <tr>
                    <td>2단계</td>
                    <td>{LEVEL_LABELS[session.p2Level]}</td>
                    <td>{session.p2Correct}/{session.p2Questions.length}</td>
                    <td style={{ color: pct2 >= 60 ? '#15803D' : '#B91C1C', fontWeight: 700 }}>{pct2}%</td>
                    <td style={{ fontSize: 12 }}>{pct2 >= 60 ? '✓ 상위 확정' : '▼ 이전 레벨'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>선생님 메모</div>
            <textarea
              value={session.teacherNote}
              onChange={e => setSession(s => s ? { ...s, teacherNote: e.target.value } : s)}
              placeholder="추가 관찰 사항, 학부모 전달 내용..."
              rows={3}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', resize: 'vertical' }}
            />
          </Card>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => { setView('list'); setPhase('select_student'); setSession(null); }}>취소</Btn>
            <Btn onClick={saveResult}>저장 및 완료</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: 메인 목록 ─────────────────────────────────────────
  const [listTab, setListTab] = useState<'test' | 'results'>('test');

  return (
    <Page title="입학 테스트">
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 16 }}>
        {(['test','results'] as const).map(t => (
          <button key={t} className={`tab-btn${listTab === t ? ' active' : ''}`} onClick={() => setListTab(t)}>
            {t === 'test' ? '테스트 시작' : '결과 보기'}
          </button>
        ))}
      </div>

      {/* 테스트 시작 탭 */}
      {listTab === 'test' && (
        <div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>
            테스트 예정 또는 재원생 중 재평가가 필요한 학생을 선택하세요.
          </div>
          {testStudents.length === 0 ? (
            <Card style={{ textAlign: 'center', color: '#94A3B8', padding: 32 }}>테스트 대상 학생 없음</Card>
          ) : testStudents.map(s => (
            <Card key={s.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{s.grade} · {s.school}</div>
              </div>
              <Badge status={s.status} />
              <div style={{ display: 'flex', gap: 6 }}>
                {LEVEL_ORDER.map(lv => (
                  <Btn key={lv} small variant="ghost" onClick={() => startTest(s.id, lv)}>
                    {LEVEL_LABELS[lv]} 시작
                  </Btn>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 결과 보기 탭 */}
      {listTab === 'results' && (
        <div>
          {allResults.length === 0 ? (
            <Card style={{ textAlign: 'center', color: '#94A3B8', padding: 32 }}>테스트 기록 없음</Card>
          ) : allResults.map(t => {
            const st = students.find(x => x.id === t.studentId);
            return (
              <Card key={t.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{st?.name ?? '?'}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>{st?.grade}</span>
                    <span style={{ fontSize: 11, color: '#CBD5E1', marginLeft: 8 }}>{t.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ background: '#F0FDF4', color: '#15803D', fontWeight: 800, fontSize: 15, padding: '4px 14px', borderRadius: 6 }}>
                      {LEVEL_LABELS[t.finalLevel]}반
                    </div>
                    <Btn small variant="ghost" onClick={() => st && openPrintWindow(st, t)}>🖨 결과지</Btn>
                    <Btn small variant="ghost" onClick={() => {
                      navigator.clipboard.writeText(t.parentSummary);
                      setCopied(t.id);
                      setTimeout(() => setCopied(null), 2000);
                    }}>{copied === t.id ? '✓ 복사됨' : '복사'}</Btn>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: t.teacherNote ? 8 : 0 }}>
                  <span style={{ fontSize: 11, background: '#EFF6FF', color: '#3B82F6', padding: '2px 8px', borderRadius: 10 }}>
                    1단계 {LEVEL_LABELS[t.p1Level]}: {t.p1Correct}/{t.p1Total}
                  </span>
                  {t.p2Level && (
                    <span style={{ fontSize: 11, background: '#FFF7ED', color: '#C2410C', padding: '2px 8px', borderRadius: 10 }}>
                      2단계 {LEVEL_LABELS[t.p2Level]}: {t.p2Correct}/{t.p2Total}
                    </span>
                  )}
                </div>
                {t.teacherNote && (
                  <div style={{ fontSize: 12, color: '#64748B', borderTop: '0.5px solid #F1F5F9', paddingTop: 8, lineHeight: 1.65 }}>
                    {t.teacherNote}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
