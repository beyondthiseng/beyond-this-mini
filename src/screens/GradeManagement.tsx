// src/screens/GradeManagement.tsx
import React, { useState, useMemo } from 'react';
import { Btn, Card, Field, Page } from '../components/ui';
import type { GradeRecord, Student, TestAreaScore } from '../types';
import { gid, tod, saveGrades } from '../data/storage';
import { GRADE_LEVEL_LIST } from '../data/levelTemplates';

interface Props {
  students: Student[];
  grades: GradeRecord[];
  setGrades: (g: GradeRecord[]) => void;
}

// ── 상수 ─────────────────────────────────────────────────────────
const TEST_AREAS: {
  key: keyof Pick<GradeRecord, 'readingComprehension' | 'vocabulary' | 'sentenceBuilding' | 'writingTest'>;
  label: string;
  labelEn: string;
}[] = [
  { key: 'readingComprehension', label: '독해',       labelEn: 'Reading Comprehension' },
  { key: 'vocabulary',           label: '어휘',       labelEn: 'Vocabulary' },
  { key: 'sentenceBuilding',     label: '문장만들기', labelEn: 'Sentence Building' },
  { key: 'writingTest',          label: '라이팅',     labelEn: 'Writing' },
];

function getQuarterOptions(): string[] {
  const year = new Date().getFullYear();
  const opts: string[] = [];
  for (let y = year - 1; y <= year + 1; y++) {
    for (let q = 1; q <= 4; q++) opts.push(`${y}-Q${q}`);
  }
  return opts;
}

// ── 점수 계산 ─────────────────────────────────────────────────────
function calcTestTotal(g: GradeRecord) { return TEST_AREAS.reduce((s, a) => s + (g[a.key]?.score ?? 0), 0); }
function calcTestMax(g: GradeRecord)   { return TEST_AREAS.reduce((s, a) => s + (g[a.key]?.maxScore ?? 0), 0); }
function calcTotal(g: GradeRecord)     { return calcTestTotal(g) + (g.speaking ?? 0) + (g.attendance ?? 0) + (g.attitude ?? 0); }
function calcMax(g: GradeRecord)       { return calcTestMax(g) + 10 + 5 + 5; }
function calcGrade(pct: number)        { return pct>=95?'A+':pct>=90?'A':pct>=85?'B+':pct>=80?'B':pct>=75?'C+':pct>=70?'C':pct>=60?'D':'F'; }
function scoreColor(pct: number)       { return pct>=80?'#15803D':pct>=60?'#B45309':'#B91C1C'; }

// ── Radar Chart (React) ───────────────────────────────────────────
function RadarChart({ g, size = 220 }: { g: GradeRecord; size?: number }) {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.33, labelR = size * 0.45;
  const n = 4;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const px = (i: number, v: number) => cx + R * v * Math.cos(angle(i));
  const py = (i: number, v: number) => cy + R * v * Math.sin(angle(i));
  const vals = TEST_AREAS.map(a => {
    const ar = g[a.key];
    return !ar || ar.maxScore === 0 ? 0 : Math.min(ar.score / ar.maxScore, 1);
  });
  const scorePts = vals.map((v, i) => `${px(i,v).toFixed(1)},${py(i,v).toFixed(1)}`).join(' ');
  const fullPts  = Array.from({length:n}, (_,i) => `${px(i,1).toFixed(1)},${py(i,1).toFixed(1)}`).join(' ');
  const ta = (i: number) => { const ax = Math.cos(angle(i)); return ax<-0.1?'end':ax>0.1?'start':'middle'; };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{display:'block'}}>
      {[0.25,0.5,0.75,1].map(r=>(
        <polygon key={r}
          points={Array.from({length:n},(_,i)=>`${px(i,r).toFixed(1)},${py(i,r).toFixed(1)}`).join(' ')}
          fill="none" stroke="#E2E8F0" strokeWidth={r===1?1:0.5}/>
      ))}
      {Array.from({length:n},(_,i)=>(
        <line key={i} x1={cx} y1={cy} x2={px(i,1)} y2={py(i,1)} stroke="#E2E8F0" strokeWidth={0.7}/>
      ))}
      <polygon points={fullPts} fill="rgba(74,158,142,0.05)" stroke="none"/>
      <polygon points={scorePts} fill="rgba(74,158,142,0.25)" stroke="#4A9E8E" strokeWidth={2}/>
      {vals.map((v,i)=>v>0&&(
        <circle key={i} cx={px(i,v)} cy={py(i,v)} r={4} fill="#4A9E8E" stroke="#fff" strokeWidth={1.5}/>
      ))}
      {TEST_AREAS.map((a,i)=>(
        <text key={a.key}
          x={(cx+labelR*Math.cos(angle(i))).toFixed(1)}
          y={(cy+labelR*Math.sin(angle(i))).toFixed(1)}
          textAnchor={ta(i)} dominantBaseline="middle"
          fontSize={9} fontWeight={600}
          fontFamily="Apple SD Gothic Neo,Malgun Gothic,sans-serif"
          fill="#374151">
          {a.labelEn}
        </text>
      ))}
    </svg>
  );
}

// ── SVG 문자열 (출력용) ───────────────────────────────────────────
function radarSVGStr(g: GradeRecord, size=240): string {
  const cx=size/2, cy=size/2, R=size*0.33, labelR=size*0.45, n=4;
  const angle=(i:number)=>-Math.PI/2+(i*2*Math.PI)/n;
  const px=(i:number,v:number)=>+(cx+R*v*Math.cos(angle(i))).toFixed(2);
  const py=(i:number,v:number)=>+(cy+R*v*Math.sin(angle(i))).toFixed(2);
  const pt=(i:number,v:number)=>`${px(i,v)},${py(i,v)}`;
  const vals=TEST_AREAS.map(a=>{const ar=g[a.key];return(!ar||ar.maxScore===0)?0:Math.min(ar.score/ar.maxScore,1);});
  const scorePts=vals.map((v,i)=>pt(i,v)).join(' ');
  const fullPts=Array.from({length:n},(_,i)=>pt(i,1)).join(' ');
  const rings=[0.25,0.5,0.75,1].map(r=>`<polygon points="${Array.from({length:n},(_,i)=>pt(i,r)).join(' ')}" fill="none" stroke="#e2e8f0" stroke-width="${r===1?1:0.5}"/>`).join('');
  const axes=Array.from({length:n},(_,i)=>`<line x1="${cx}" y1="${cy}" x2="${px(i,1)}" y2="${py(i,1)}" stroke="#e2e8f0" stroke-width="0.7"/>`).join('');
  const dots=vals.map((v,i)=>v>0?`<circle cx="${px(i,v)}" cy="${py(i,v)}" r="4" fill="#4A9E8E" stroke="#fff" stroke-width="1.5"/>`:'').join('');
  const lbls=TEST_AREAS.map((a,i)=>{
    const ax=Math.cos(angle(i));const ta=ax<-0.1?'end':ax>0.1?'start':'middle';
    return `<text x="${+(cx+labelR*Math.cos(angle(i))).toFixed(1)}" y="${+(cy+labelR*Math.sin(angle(i))).toFixed(1)}" text-anchor="${ta}" dominant-baseline="middle" font-size="9.5" font-family="Apple SD Gothic Neo,Malgun Gothic,sans-serif" fill="#374151" font-weight="600">${a.labelEn}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${rings}${axes}<polygon points="${fullPts}" fill="rgba(74,158,142,0.05)" stroke="none"/><polygon points="${scorePts}" fill="rgba(74,158,142,0.25)" stroke="#4A9E8E" stroke-width="2"/>${dots}${lbls}</svg>`;
}

// ── 성적표 HTML 생성 ──────────────────────────────────────────────
function buildReportHTML(st: Student, g: GradeRecord): string {
  const total = calcTotal(g);
  const max   = calcMax(g);
  const pct   = max > 0 ? Math.round(total / max * 100) : 0;
  const grade = calcGrade(pct);
  const tc    = scoreColor(pct);
  const levelLabel = GRADE_LEVEL_LIST.find(l=>l.value===g.level)?.label ?? g.level;

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${st.name} 성적표</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:12px;color:#1E293B;line-height:1.5;padding:12mm 15mm 14mm;display:flex;flex-direction:column}
@page{size:A4;margin:0}
@media print{html,body{height:100%;padding:12mm 15mm 14mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
h1{font-size:20px;font-weight:800;text-align:center;margin-bottom:14px;letter-spacing:-0.5px}
.info{display:flex;gap:28px;justify-content:center;margin-bottom:14px;font-size:12px}
.info-item .lbl{color:#94A3B8;margin-right:4px}
.info-item b{color:#1E293B;font-weight:700}
.sec{font-size:12px;font-weight:700;border-bottom:1.5px solid #1E293B;padding-bottom:3px;margin:12px 0 8px}
.chart-wrap{display:flex;gap:24px;align-items:center;margin-bottom:10px}
.score-big{font-size:28px;font-weight:800;color:${tc};text-align:center;line-height:1.2}
table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:8px}
th,td{border:0.5px solid #CBD5E1;padding:6px 8px;text-align:center}
th{background:#F8FAFC;font-weight:700}
.comment-box{border:0.5px solid #CBD5E1;border-radius:4px;padding:8px 10px;font-size:12px;line-height:1.8;white-space:pre-wrap;color:#374151;overflow:hidden;page-break-inside:avoid;max-height:110px}
.sig{display:flex;justify-content:space-between;font-size:11px;color:#64748B;margin-top:12px;padding-top:8px;border-top:0.5px solid #CBD5E1}
.logo{text-align:center;margin-top:auto;padding-top:12px;font-size:10px;color:#CBD5E1;letter-spacing:0.5px}
.content{flex:1}
</style></head><body>
<div class="content">
<h1>이보다 더 영어교습소</h1>
<div class="info">
  <div class="info-item"><span class="lbl">이름</span><b>${st.name}</b></div>
  <div class="info-item"><span class="lbl">레벨</span><b>${levelLabel}반</b></div>
  <div class="info-item"><span class="lbl">평가 기간</span><b>${g.quarter}</b></div>
</div>
<div class="sec">영역별 성적 분석</div>
<div class="chart-wrap">
  ${radarSVGStr(g, 240)}
  <div style="flex:1">
    <div class="score-big">${total}<span style="font-size:14px;font-weight:400;color:#94A3B8"> / ${max}</span></div>
    <div style="text-align:center;font-size:13px;color:#64748B;margin:4px 0 14px">등급 <b style="color:${tc}">${grade}</b></div>
    <table>
      <tr><th>영역</th><th>점수</th><th>만점</th><th>비율</th></tr>
      ${TEST_AREAS.map(a=>{
        const ar=g[a.key];const sc=ar?.score??0;const mx=ar?.maxScore??0;
        const p=mx>0?Math.round(sc/mx*100):0;
        return `<tr><td style="text-align:left">${a.labelEn}<span style="font-size:10px;color:#94A3B8;margin-left:4px">${a.label}</span></td><td style="font-weight:700;color:${p>=70?'#15803D':p>=50?'#B45309':'#B91C1C'}">${sc}</td><td style="color:#94A3B8">${mx}</td><td style="font-weight:600">${mx>0?p+'%':'-'}</td></tr>`;
      }).join('')}
    </table>
  </div>
</div>
<div class="sec">종합 점수</div>
<table>
  <tr>
    ${TEST_AREAS.map(a=>`<th>${a.labelEn}</th>`).join('')}
    <th>Speaking</th><th>Attendance</th><th>Attitude</th><th style="background:#F0FDF4;color:#15803D">총점</th>
  </tr>
  <tr>
    ${TEST_AREAS.map(a=>`<td>${g[a.key]?.score??0}/${g[a.key]?.maxScore??0}</td>`).join('')}
    <td>${g.speaking??0}/10</td>
    <td>${g.attendance??0}/5</td>
    <td>${g.attitude??0}/5</td>
    <td style="font-size:15px;font-weight:800;color:${tc}">${total}/${max}</td>
  </tr>
</table>
<div class="sec">선생님 종합 코멘트</div>
<div class="comment-box">${(g.summary||'').replace(/\n/g,'<br>')}</div>
<div class="sec" style="margin-top:10px">다음 목표</div>
<div class="comment-box" style="min-height:40px">${(g.nextGoals||'').replace(/\n/g,'<br>')}</div>
<div class="sig">
  <div>담당 선생님 _________________________ (서명)</div>
  <div>학부모 확인 _________________________ (서명)</div>
</div>
</div>
<div class="logo">이보다 더 영어교습소 · Beyond This English</div>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;
}

function openPrint(st: Student, g: GradeRecord) {
  const html = buildReportHTML(st, g);
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
  else alert('팝업을 허용해 주세요.');
}

// ── 미리보기 모달 ─────────────────────────────────────────────────
function PreviewModal({ st, g, onClose }: { st: Student; g: GradeRecord; onClose: () => void }) {
  const html = buildReportHTML(st, g);
  // 출력용 html에서 window.print() 자동실행 제거
  const previewHtml = html.replace('<script>window.onload=()=>window.print();<\/script>', '');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start', zIndex: 200, paddingTop: 20,
    }}>
      {/* 툴바 */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12,
        background: '#1B2B3A', padding: '10px 18px', borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginRight: 8 }}>
          {st.name} — {g.quarter} 성적표 미리보기
        </span>
        <button
          onClick={() => openPrint(st, g)}
          style={{
            padding: '7px 16px', background: '#4A9E8E', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          🖨 인쇄
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>

      {/* A4 미리보기 */}
      <div style={{
        width: 794, height: 1123, background: '#fff',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        borderRadius: 2, overflow: 'hidden', flexShrink: 0,
        transform: 'scale(0.75)', transformOrigin: 'top center',
        marginBottom: -280,
      }}>
        <iframe
          srcDoc={previewHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="성적표 미리보기"
        />
      </div>
    </div>
  );
}

// ── 성적 초기값 ───────────────────────────────────────────────────
function initGrade(studentId: string): GradeRecord {
  return {
    id: gid(), studentId,
    quarter: `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth()+1)/3)}`,
    date: tod(), level: 'basic',
    readingComprehension: { score: 0, maxScore: 0 },
    vocabulary:           { score: 0, maxScore: 0 },
    sentenceBuilding:     { score: 0, maxScore: 0 },
    writingTest:          { score: 0, maxScore: 0 },
    speaking: 0, attendance: 0, attitude: 0,
    summary: '', nextGoals: '',
  };
}

// ── 영역 점수 입력 행 ─────────────────────────────────────────────
function AreaRow({ label, labelEn, value, onChange }: {
  label: string; labelEn: string;
  value: TestAreaScore; onChange: (v: TestAreaScore) => void;
}) {
  const pct = value.maxScore > 0 ? Math.round(value.score / value.maxScore * 100) : null;
  const color = pct === null ? '#CBD5E1' : scoreColor(pct);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid #F1F5F9' }}>
      <div style={{ width: 155, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{labelEn}</div>
        <div style={{ fontSize: 10, color: '#94A3B8' }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="number" min={0} value={value.score || ''}
          onChange={e => onChange({ ...value, score: parseInt(e.target.value) || 0 })}
          placeholder="점수"
          style={{ width: 70, padding: '5px 8px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', textAlign: 'right' }}
        />
        <span style={{ color: '#94A3B8', fontSize: 13 }}>/</span>
        <input type="number" min={0} value={value.maxScore || ''}
          onChange={e => onChange({ ...value, maxScore: parseInt(e.target.value) || 0 })}
          placeholder="만점"
          style={{ width: 70, padding: '5px 8px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', textAlign: 'right' }}
        />
        {pct !== null && (
          <span style={{ fontSize: 12, fontWeight: 700, color, width: 40 }}>{pct}%</span>
        )}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────
export default function GradeManagement({ students, grades, setGrades }: Props) {
  const [selSid, setSelSid] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<GradeRecord | null>(null);
  const [previewData, setPreviewData] = useState<{ st: Student; g: GradeRecord } | null>(null);

  const enrolled = students.filter(s => s.status === '재원생');
  const selStudent = selSid ? students.find(s => s.id === selSid) : null;
  const selGrades = useMemo(() =>
    grades.filter(g => g.studentId === selSid).sort((a, b) => b.quarter.localeCompare(a.quarter))
  , [grades, selSid]);

  const startNew  = () => { if (!selSid) return; setForm(initGrade(selSid)); setEditId('new'); };
  const startEdit = (g: GradeRecord) => { setForm({ ...g }); setEditId(g.id); };
  const saveForm  = () => {
    if (!form) return;
    const updated = editId === 'new' ? [...grades, form] : grades.map(g => g.id === form.id ? form : g);
    setGrades(updated); saveGrades(updated);
    setForm(null); setEditId(null);
  };
  const deleteGrade = (id: string) => {
    if (!confirm('삭제할까요?')) return;
    setGrades(grades.filter(g => g.id !== id));
    saveGrades(grades.filter(g => g.id !== id));
  };
  const upd = (f: keyof GradeRecord, v: unknown) => setForm(p => p ? { ...p, [f]: v } : p);
  const quarterOpts = getQuarterOptions();

  // ── 성적 입력 폼 ───────────────────────────────────────────────
  if (form && editId) {
    const total = calcTotal(form);
    const max   = calcMax(form);
    const pct   = max > 0 ? Math.round(total / max * 100) : 0;

    return (
      <Page title={`${selStudent?.name} — 성적 입력`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* 왼쪽 */}
          <div>
            <Card style={{ marginBottom: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px', marginBottom: 12 }}>
                <Field label="분기">
                  <select value={form.quarter} onChange={e => upd('quarter', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                    {quarterOpts.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </Field>
                <Field label="날짜">
                  <input type="date" value={form.date} onChange={e => upd('date', e.target.value)} />
                </Field>
                <Field label="레벨">
                  <select value={form.level} onChange={e => upd('level', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                    {GRADE_LEVEL_LIST.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>시험 영역별 점수</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>점수와 만점(배점)을 입력하세요</div>
              {TEST_AREAS.map(a => (
                <AreaRow key={a.key} label={a.label} labelEn={a.labelEn}
                  value={form[a.key] as TestAreaScore}
                  onChange={v => upd(a.key, v)} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, fontSize: 12, color: '#64748B' }}>
                시험 합계: <strong style={{ marginLeft: 6 }}>{calcTestTotal(form)} / {calcTestMax(form)}</strong>
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>기타 점수</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px' }}>
                <Field label="Speaking /10">
                  <input type="number" min={0} max={10} value={form.speaking || ''} onChange={e => upd('speaking', parseInt(e.target.value)||0)} />
                </Field>
                <Field label="Attendance /5">
                  <input type="number" min={0} max={5} value={form.attendance || ''} onChange={e => upd('attendance', parseInt(e.target.value)||0)} />
                </Field>
                <Field label="Attitude /5">
                  <input type="number" min={0} max={5} value={form.attitude || ''} onChange={e => upd('attitude', parseInt(e.target.value)||0)} />
                </Field>
              </div>
            </Card>
          </div>

          {/* 오른쪽 */}
          <div>
            <Card style={{ marginBottom: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>레이더 차트 미리보기</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RadarChart g={form} size={220} />
              </div>
              <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, color: scoreColor(pct) }}>
                {total} <span style={{ fontSize: 13, fontWeight: 400, color: '#94A3B8' }}>/ {max}</span>
              </div>
            </Card>
            <Card style={{ marginBottom: 10 }}>
              <Field label="종합 코멘트">
                <textarea rows={4} value={form.summary} onChange={e => upd('summary', e.target.value)} placeholder="이번 분기 종합 평가..." />
              </Field>
              <Field label="다음 목표">
                <textarea rows={3} value={form.nextGoals} onChange={e => upd('nextGoals', e.target.value)} placeholder="다음 분기 목표..." />
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
    <>
      {previewData && (
        <PreviewModal
          st={previewData.st}
          g={previewData.g}
          onClose={() => setPreviewData(null)}
        />
      )}
      <Page title="성적 관리">
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, height: 'calc(100% - 48px)' }}>
          {/* 학생 목록 */}
          <div style={{ overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>재원생</div>
            {enrolled.map(s => {
              const cnt = grades.filter(g => g.studentId === s.id).length;
              const lvlLabel = GRADE_LEVEL_LIST.find(l=>l.value===s.level)?.label ?? s.level;
              return (
                <div key={s.id} onClick={() => setSelSid(s.id)} style={{
                  padding: '9px 12px', borderRadius: 7, cursor: 'pointer', marginBottom: 5,
                  background: selSid === s.id ? '#EFF6FF' : '#fff',
                  border: `0.5px solid ${selSid===s.id?'#BFDBFE':'#E2E8F0'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.grade} · {lvlLabel||'-'}</div>
                  </div>
                  <span style={{ fontSize: 10, color: '#94A3B8' }}>{cnt}회</span>
                </div>
              );
            })}
            {enrolled.length === 0 && <p style={{ fontSize: 11, color: '#94A3B8' }}>재원생 없음</p>}
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
                  const total = calcTotal(g);
                  const max   = calcMax(g);
                  const pct   = max > 0 ? Math.round(total/max*100) : 0;
                  const grade = calcGrade(pct);
                  const lvlLabel = GRADE_LEVEL_LIST.find(l=>l.value===g.level)?.label ?? g.level;
                  return (
                    <Card key={g.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{g.quarter}</span>
                          <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>{g.date} · {lvlLabel}반</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor(pct) }}>
                            {total}/{max} ({grade})
                          </span>
                          <Btn small variant="ghost" onClick={() => setPreviewData({ st: selStudent, g })}>👁 미리보기</Btn>
                          <Btn small variant="ghost" onClick={() => openPrint(selStudent, g)}>🖨 출력</Btn>
                          <Btn small variant="ghost" onClick={() => startEdit(g)}>수정</Btn>
                          <Btn small variant="danger" onClick={() => deleteGrade(g.id)}>삭제</Btn>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <RadarChart g={g} size={180} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 8 }}>
                            {TEST_AREAS.map(a => {
                              const ar = g[a.key];
                              const sc = ar?.score??0, mx = ar?.maxScore??0;
                              const p  = mx>0?Math.round(sc/mx*100):null;
                              return (
                                <div key={a.key} style={{ background:'#F8FAFC', borderRadius:6, padding:'6px 8px', textAlign:'center' }}>
                                  <div style={{ fontSize:10, color:'#94A3B8' }}>{a.labelEn}</div>
                                  <div style={{ fontSize:12, fontWeight:700, color:p===null?'#CBD5E1':scoreColor(p) }}>{sc}/{mx}</div>
                                  {p!==null&&<div style={{ fontSize:9, color:'#94A3B8' }}>{p}%</div>}
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                            {[['Speaking',g.speaking,10],['Attendance',g.attendance,5],['Attitude',g.attitude,5]].map(([lbl,v,mx])=>(
                              <div key={String(lbl)} style={{ background:'#F8FAFC', borderRadius:6, padding:'5px 10px', textAlign:'center' }}>
                                <div style={{ fontSize:10, color:'#94A3B8' }}>{lbl}</div>
                                <div style={{ fontSize:12, fontWeight:700 }}>{v}/{mx}</div>
                              </div>
                            ))}
                          </div>
                          {g.summary&&(
                            <div style={{ fontSize:12, color:'#374151', lineHeight:1.65, borderTop:'0.5px solid #F1F5F9', paddingTop:8 }}>
                              {g.summary}
                            </div>
                          )}
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
    </>
  );
}
