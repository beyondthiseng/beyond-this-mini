// src/screens/GradeManagement.tsx
import React, { useState, useMemo } from 'react';
import { Btn, Card, Field, Page, ScoreDots } from '../components/ui';
import RadarChart, { radarSVGString } from '../components/ui/RadarChart';
import type { GradeRecord, Student } from '../types';
import { gid, tod, toQ, saveGrades } from '../data/storage';
import { LEVEL_LABELS as QLABELS } from '../types/questions';
import { LEVEL_TEMPLATES, LEVEL_ORDER } from '../data/levelTemplates';

interface Props {
  students: Student[];
  grades: GradeRecord[];
  setGrades: (g: GradeRecord[]) => void;
}

function calcTotal(g: GradeRecord): number {
  return (g.quarterExam ?? 0) + (g.attendance ?? 0) + (g.attitude ?? 0) + (g.speaking ?? 0) + (g.writing ?? 0);
}
function getGrade(total: number): string {
  if (total >= 95) return 'A+';
  if (total >= 90) return 'A';
  if (total >= 85) return 'B+';
  if (total >= 80) return 'B';
  if (total >= 75) return 'C+';
  if (total >= 70) return 'C';
  if (total >= 60) return 'D';
  return 'F';
}

function openPrintWindow(st: Student, g: GradeRecord) {
  const areas = LEVEL_TEMPLATES[g.level as keyof typeof LEVEL_TEMPLATES] ?? LEVEL_TEMPLATES.basic ?? LEVEL_TEMPLATES.basic;
  const total = calcTotal(g);
  const grade = getGrade(total);
  const svgStr = radarSVGString(areas, g.radarScores, g.radarBenchmark, 230);
  const totalColor = total >= 80 ? '#15803D' : total >= 60 ? '#B45309' : '#B91C1C';
  const totalBorder = total >= 80 ? '#4A9E8E' : total >= 60 ? '#D97706' : '#EF4444';

  const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${st.name} 성적표</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;padding:14mm 16mm 10mm;font-size:12px;color:#1E293B;line-height:1.5}
h1{font-size:20px;font-weight:700;text-align:center;margin-bottom:2px;letter-spacing:-0.5px}
.sub{text-align:center;font-size:11px;color:#64748B;margin-bottom:14px;letter-spacing:0.3px}
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;border:0.5px solid #CBD5E1;border-radius:6px;padding:9px 12px;margin-bottom:12px;font-size:11px}
.info-grid span{color:#64748B}.info-grid b{color:#1E293B}
.sec{font-size:12px;font-weight:700;border-bottom:1.5px solid #1E293B;padding-bottom:3px;margin:12px 0 8px;display:flex;justify-content:space-between;align-items:baseline}
.sec small{font-size:10px;font-weight:400;color:#64748B}
.chart-row{display:flex;gap:20px;align-items:flex-start;margin-bottom:10px}
.score-big{font-size:24px;font-weight:800;color:${totalColor};padding:9px 18px;border:2px solid ${totalBorder};border-radius:8px;text-align:center;white-space:nowrap}
.score-grade{font-size:11px;color:#64748B;text-align:center;margin-top:3px}
.legend{display:flex;gap:14px;font-size:10px;margin-top:8px;margin-bottom:10px}
.leg{display:flex;align-items:center;gap:4px}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block}
table{width:100%;border-collapse:collapse;font-size:11px}
th,td{border:0.5px solid #CBD5E1;padding:5px 8px}
th{background:#F8FAFC;font-weight:700;text-align:left}
.comment-box{border:0.5px solid #CBD5E1;border-radius:4px;padding:8px 10px;min-height:48px;font-size:12px;line-height:1.75;color:#374151;white-space:pre-wrap}
.footer{margin-top:14px;border-top:0.5px solid #CBD5E1;padding-top:8px;display:flex;justify-content:space-between;font-size:11px;color:#64748B}
@media print{body{padding:10mm 12mm}}
</style></head><body>
<h1>이보다 더 영어교습소</h1>
<div class="sub">영어 능력 성장 리포트 · ${g.quarter} · ${g.date}</div>

<div class="info-grid">
  <div><span>이름 </span><b>${st.name}</b></div>
  <div><span>학년 </span><b>${st.grade}</b></div>
  <div><span>레벨 </span><b>${QLABELS[g.level as keyof typeof QLABELS] ?? g.level}반</b></div>
  <div><span>교재 </span><b>${st.currentBook || '-'}</b></div>
  <div><span>학교 </span><b>${st.school || '-'}</b></div>
  <div><span>평가 기간 </span><b>${g.quarter}</b></div>
</div>

<div class="sec">영역별 성장 분석 <small>● 현재점수 &nbsp; ⋯ 기준점수</small></div>
<div class="chart-row">
  ${svgStr}
  <div style="flex:1;min-width:0">
    <div class="score-big">${total}점</div>
    <div class="score-grade">등급 ${grade} / 100점 만점</div>
    <div class="legend">
      <div class="leg"><div class="dot" style="background:#4A9E8E"></div>현재 점수</div>
      <div class="leg"><div class="dot" style="background:#94A3B8;opacity:0.7"></div>기준 점수</div>
    </div>
    <table>
      <tr><th>영역</th><th>점수</th><th>기준</th><th>코멘트</th></tr>
      ${areas.map(a => {
        const sc = g.radarScores[a] ?? 0;
        const bm = g.radarBenchmark[a] ?? 3;
        const color = sc >= bm ? '#15803D' : '#B91C1C';
        return `<tr>
          <td>${a}</td>
          <td style="font-weight:700;color:${color}">${sc}/5</td>
          <td style="color:#94A3B8">${bm}/5</td>
          <td style="color:#64748B;font-size:10px">${g.areaComments[a] ?? ''}</td>
        </tr>`;
      }).join('')}
    </table>
  </div>
</div>

<div class="sec">종합 점수 (100점 만점)</div>
<table>
  <tr><th>분기 시험 /60</th><th>출결 /10</th><th>수업 태도 /10</th><th>Speaking /10</th><th>Writing /10</th><th>합계</th></tr>
  <tr>
    <td>${g.quarterExam ?? 0}</td>
    <td>${g.attendance ?? 0}</td>
    <td>${g.attitude ?? 0}</td>
    <td>${g.speaking ?? 0}</td>
    <td>${g.writing ?? 0}</td>
    <td style="font-size:15px;font-weight:800;color:${totalColor}">${total}점 (${grade})</td>
  </tr>
</table>

<div class="sec">선생님 종합 코멘트</div>
<div class="comment-box">${(g.summary ?? '').replace(/\n/g,'<br>')}</div>

<div class="sec">다음 목표</div>
<div class="comment-box" style="min-height:36px">${(g.nextGoals ?? '').replace(/\n/g,'<br>')}</div>

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

function initRecord(studentId: string, level: string): GradeRecord {
  const areas = LEVEL_TEMPLATES[level as keyof typeof LEVEL_TEMPLATES] ?? LEVEL_TEMPLATES.basic ?? LEVEL_TEMPLATES.basic;
  const scores: Record<string, number> = {};
  const bench:  Record<string, number> = {};
  const cmts:   Record<string, string> = {};
  areas.forEach(a => { scores[a] = 0; bench[a] = 3; cmts[a] = ''; });
  return {
    id: gid(), studentId, quarter: toQ(), date: tod(), level,
    radarScores: scores, radarBenchmark: bench, areaComments: cmts,
    quarterExam: 0, attendance: 0, attitude: 0, speaking: 0, writing: 0,
    summary: '', nextGoals: '',
  };
}

export default function GradeManagement({ students, grades, setGrades }: Props) {
  const [selSid, setSelSid] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<GradeRecord | null>(null);

  const enrolled = students.filter(s => s.status === '재원생');
  const selStudent = selSid ? students.find(s => s.id === selSid) : null;
  const selGrades = useMemo(() =>
    grades.filter(g => g.studentId === selSid).sort((a, b) => b.quarter.localeCompare(a.quarter))
  , [grades, selSid]);

  const startNew = () => {
    if (!selSid || !selStudent) return;
    const lv = (selStudent.level as LevelKey) || 'basic';
    const rec = initRecord(selSid, lv);
    setForm(rec); setEditId('new');
  };

  const startEdit = (g: GradeRecord) => { setForm({ ...g }); setEditId(g.id); };

  const saveForm = () => {
    if (!form) return;
    const updated = editId === 'new'
      ? [...grades, form]
      : grades.map(g => g.id === form.id ? form : g);
    setGrades(updated); saveGrades(updated);
    setForm(null); setEditId(null);
  };

  const deleteGrade = (id: string) => {
    if (!confirm('삭제할까요?')) return;
    const upd = grades.filter(g => g.id !== id);
    setGrades(upd); saveGrades(upd);
  };

  const updForm = (f: keyof GradeRecord, v: unknown) => setForm(p => p ? { ...p, [f]: v } : p);
  const updScore = (area: string, v: number) => setForm(p => p ? { ...p, radarScores: { ...p.radarScores, [area]: v } } : p);
  const updBench = (area: string, v: number) => setForm(p => p ? { ...p, radarBenchmark: { ...p.radarBenchmark, [area]: v } } : p);
  const updCmt   = (area: string, v: string) => setForm(p => p ? { ...p, areaComments: { ...p.areaComments, [area]: v } } : p);

  // ── 성적 입력 폼 ─────────────────────────────────────────────
  if (form && editId) {
    const areas = LEVEL_TEMPLATES[form.level as keyof typeof LEVEL_TEMPLATES] ?? LEVEL_TEMPLATES.basic ?? LEVEL_TEMPLATES.basic;
    const total = calcTotal(form);
    return (
      <Page title={`${selStudent?.name} — 성적 입력`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* 왼쪽: 레이더 & 영역별 */}
          <div>
            <Card style={{ marginBottom: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px', marginBottom: 10 }}>
                <Field label="분기">
                  <input value={form.quarter} onChange={e => updForm('quarter', e.target.value)} placeholder="2025-Q2" />
                </Field>
                <Field label="날짜">
                  <input type="date" value={form.date} onChange={e => updForm('date', e.target.value)} />
                </Field>
                <Field label="레벨">
                  <select value={form.level} onChange={e => {
                    const lv = e.target.value as string;
                    const newAreas = LEVEL_TEMPLATES[lv];
                    const ns: Record<string,number> = {}; const nb: Record<string,number> = {}; const nc: Record<string,string> = {};
                    newAreas.forEach(a => { ns[a] = form.radarScores[a] ?? 0; nb[a] = form.radarBenchmark[a] ?? 3; nc[a] = form.areaComments[a] ?? ''; });
                    setForm(p => p ? { ...p, level: lv, radarScores: ns, radarBenchmark: nb, areaComments: nc } : p);
                  }}>
                    {([...LEVEL_ORDER, 'adult'] as LevelKey[]).map(lv => <option key={lv} value={lv}>{LEVEL_LABELS[lv]}</option>)}
                  </select>
                </Field>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>영역별 점수 (1~5점)</div>
              {areas.map(area => (
                <div key={area} className="grade-area-row">
                  <div className="grade-area-label">{area}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>현재 점수</div>
                    <ScoreDots value={form.radarScores[area] ?? 0} onChange={v => updScore(area, v)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 10 }}>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>기준 점수</div>
                    <ScoreDots value={form.radarBenchmark[area] ?? 3} onChange={v => updBench(area, v)} />
                  </div>
                  <input
                    value={form.areaComments[area] ?? ''}
                    onChange={e => updCmt(area, e.target.value)}
                    placeholder="코멘트"
                    style={{ flex: 1, padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 11, outline: 'none', marginLeft: 8 }}
                  />
                </div>
              ))}
            </Card>
          </div>

          {/* 오른쪽: Radar 미리보기 + 점수 */}
          <div>
            <Card style={{ marginBottom: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>레이더 차트 미리보기</span>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>● 현재 ⋯ 기준</span>
              </div>
              <div className="radar-container">
                <RadarChart areas={areas} scores={form.radarScores} benchmark={form.radarBenchmark} size={210} />
              </div>
            </Card>

            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>종합 점수 (100점 만점)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <Field label="분기 시험 /60">
                  <input type="number" min={0} max={60} value={form.quarterExam ?? ''} onChange={e => updForm('quarterExam', parseInt(e.target.value) || 0)} />
                </Field>
                <Field label="출결 /10">
                  <input type="number" min={0} max={10} value={form.attendance ?? ''} onChange={e => updForm('attendance', parseInt(e.target.value) || 0)} />
                </Field>
                <Field label="수업 태도 /10">
                  <input type="number" min={0} max={10} value={form.attitude ?? ''} onChange={e => updForm('attitude', parseInt(e.target.value) || 0)} />
                </Field>
                <Field label="Speaking /10">
                  <input type="number" min={0} max={10} value={form.speaking ?? ''} onChange={e => updForm('speaking', parseInt(e.target.value) || 0)} />
                </Field>
                <Field label="Writing /10">
                  <input type="number" min={0} max={10} value={form.writing ?? ''} onChange={e => updForm('writing', parseInt(e.target.value) || 0)} />
                </Field>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: total >= 80 ? '#15803D' : total >= 60 ? '#B45309' : '#B91C1C' }}>
                    {total}점 ({getGrade(total)})
                  </span>
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 10 }}>
              <Field label="종합 코멘트">
                <textarea rows={3} value={form.summary} onChange={e => updForm('summary', e.target.value)} placeholder="이번 분기 종합 평가..." />
              </Field>
              <Field label="다음 목표">
                <textarea rows={2} value={form.nextGoals} onChange={e => updForm('nextGoals', e.target.value)} placeholder="다음 분기 목표..." />
              </Field>
            </Card>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Btn variant="ghost" onClick={() => { setForm(null); setEditId(null); }}>취소</Btn>
              <Btn onClick={saveForm}>저장</Btn>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  // ── 성적 목록 ─────────────────────────────────────────────────
  return (
    <Page title="성적 관리">
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, height: 'calc(100% - 48px)' }}>
        {/* 학생 목록 */}
        <div style={{ overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>재원생</div>
          {enrolled.map(s => {
            const cnt = grades.filter(g => g.studentId === s.id).length;
            return (
              <div key={s.id} onClick={() => setSelSid(s.id)} style={{
                padding: '9px 12px', borderRadius: 7, cursor: 'pointer', marginBottom: 5,
                background: selSid === s.id ? '#EFF6FF' : '#fff',
                border: `0.5px solid ${selSid === s.id ? '#BFDBFE' : '#E2E8F0'}`,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.grade} · {LEVEL_LABELS[(s.level as string) || 'basic']}</div>
                </div>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{cnt}회</span>
              </div>
            );
          })}
        </div>

        {/* 성적 기록 */}
        <div style={{ overflowY: 'auto' }}>
          {!selStudent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1', fontSize: 13 }}>
              ← 학생을 선택하세요
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{selStudent.name} 성적 기록</span>
                <Btn small onClick={startNew}>+ 성적 입력</Btn>
              </div>

              {selGrades.length === 0 ? (
                <Card style={{ textAlign: 'center', color: '#94A3B8', padding: 24 }}>성적 기록이 없습니다.</Card>
              ) : selGrades.map(g => {
                const areas = LEVEL_TEMPLATES[g.level as keyof typeof LEVEL_TEMPLATES] ?? LEVEL_TEMPLATES.basic ?? LEVEL_TEMPLATES.basic;
                const total = calcTotal(g);
                return (
                  <Card key={g.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{g.quarter}</span>
                        <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>{g.date} · {QLABELS[g.level as keyof typeof QLABELS] ?? g.level}반</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: total >= 80 ? '#15803D' : total >= 60 ? '#B45309' : '#B91C1C' }}>
                          {total}점 ({getGrade(total)})
                        </span>
                        <Btn small variant="ghost" onClick={() => openPrintWindow(selStudent, g)}>🖨 출력</Btn>
                        <Btn small variant="ghost" onClick={() => startEdit(g)}>수정</Btn>
                        <Btn small variant="danger" onClick={() => deleteGrade(g.id)}>삭제</Btn>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <RadarChart areas={areas} scores={g.radarScores} benchmark={g.radarBenchmark} size={180} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                          {areas.map(a => {
                            const sc = g.radarScores[a] ?? 0;
                            const bm = g.radarBenchmark[a] ?? 3;
                            return (
                              <div key={a} style={{
                                fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                                background: sc >= bm ? '#F0FDF4' : '#FEF2F2',
                                color: sc >= bm ? '#15803D' : '#B91C1C',
                              }}>
                                {a}: {sc}/5
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, fontSize: 11, marginBottom: 8 }}>
                          {[['시험', g.quarterExam,60],['출결',g.attendance,10],['태도',g.attitude,10],['Speaking',g.speaking,10],['Writing',g.writing,10]].map(([lbl,val,max]) => (
                            <div key={String(lbl)} style={{ background: '#F8FAFC', borderRadius: 6, padding: '5px 8px', textAlign: 'center' }}>
                              <div style={{ color: '#94A3B8', fontSize: 10 }}>{lbl}</div>
                              <div style={{ fontWeight: 700 }}>{val}/{max}</div>
                            </div>
                          ))}
                        </div>
                        {g.summary && <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, borderTop: '0.5px solid #F1F5F9', paddingTop: 6 }}>{g.summary}</div>}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
