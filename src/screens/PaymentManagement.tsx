// src/screens/PaymentManagement.tsx
import React, { useState, useMemo } from 'react';
import { Btn, Card, Page } from '../components/ui';
import type { Payment, Student } from '../types';
import { gid, tod, toYM, savePayments } from '../data/storage';

interface Props {
  students: Student[];
  payments: Payment[];
  setPayments: (p: Payment[]) => void;
}

const PAY_METHODS = ['계좌이체','현금','카드'];

export default function PaymentManagement({ students, payments, setPayments }: Props) {
  const [month, setMonth] = useState(toYM());
  const [filter, setFilter] = useState<'전체' | '미납' | '납부'>('전체');

  const enrolled = students.filter(s => s.status === '재원생');

  const monthMap = useMemo(() => {
    const m: Record<string, Payment> = {};
    enrolled.forEach(s => {
      const p = payments.find(p => p.studentId === s.id && p.month === month);
      m[s.id] = p ?? { id:'', studentId:s.id, month, amount:0, isPaid:false, paidDate:'', paymentMethod:'', memo:'' };
    });
    return m;
  }, [enrolled, payments, month]);

  const display = useMemo(() =>
    enrolled.filter(s => {
      if (filter === '미납') return !monthMap[s.id]?.isPaid;
      if (filter === '납부') return  monthMap[s.id]?.isPaid;
      return true;
    })
  , [enrolled, monthMap, filter]);

  const totalCollected = Object.values(monthMap).filter(p => p.isPaid).reduce((a, p) => a + p.amount, 0);
  const unpaidCount    = enrolled.filter(s => !monthMap[s.id]?.isPaid).length;

  const upsert = (sid: string, patch: Partial<Payment>) => {
    const existing = payments.find(p => p.studentId === sid && p.month === month);
    let updated: Payment[];
    if (existing) {
      updated = payments.map(p => p.studentId === sid && p.month === month ? { ...p, ...patch } : p);
    } else {
      updated = [...payments, { id: gid(), studentId: sid, month, amount: 0, isPaid: false, paidDate: '', paymentMethod: '', memo: '', ...patch }];
    }
    setPayments(updated); savePayments(updated);
  };

  const togglePaid = (sid: string) => {
    const cur = monthMap[sid];
    const newPaid = !cur.isPaid;
    upsert(sid, { isPaid: newPaid, paidDate: newPaid ? tod() : '' });
  };

  return (
    <Page title="결제 관리">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          type="month" value={month} onChange={e => setMonth(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer' }}
        />
        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
          style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
          {['전체','미납','납부'].map(f => <option key={f}>{f}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ fontSize: 12, background: '#FEF2F2', color: '#B91C1C', fontWeight: 700, padding: '5px 12px', borderRadius: 6 }}>
            미납 {unpaidCount}명
          </div>
          <div style={{ fontSize: 12, background: '#F0FDF4', color: '#15803D', fontWeight: 700, padding: '5px 12px', borderRadius: 6 }}>
            수납 {totalCollected.toLocaleString()}원
          </div>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 40 }}>납부</th>
              <th>이름</th>
              <th>수강료</th>
              <th>납부일</th>
              <th>결제수단</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {display.map(s => {
              const p = monthMap[s.id];
              return (
                <tr key={s.id} style={{ background: p.isPaid ? undefined : '#FFFBF5' }}>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => togglePaid(s.id)} style={{
                      width: 24, height: 24, borderRadius: 5, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                      border: `1.5px solid ${p.isPaid ? '#4A9E8E' : '#E2E8F0'}`,
                      background: p.isPaid ? '#4A9E8E' : '#fff',
                      color: '#fff',
                    }}>{p.isPaid ? '✓' : ''}</button>
                  </td>
                  <td style={{ fontWeight: 700 }}>{s.name}</td>
                  <td>
                    <input
                      type="number" value={p.amount || ''} placeholder="0"
                      onChange={e => upsert(s.id, { amount: parseInt(e.target.value) || 0 })}
                      style={{ width: 100, padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 13, outline: 'none', textAlign: 'right' }}
                    />
                  </td>
                  <td>
                    <input
                      type="date" value={p.paidDate || ''} disabled={!p.isPaid}
                      onChange={e => upsert(s.id, { paidDate: e.target.value })}
                      style={{ padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 12, outline: 'none', opacity: p.isPaid ? 1 : 0.4 }}
                    />
                  </td>
                  <td>
                    <select
                      value={p.paymentMethod || ''} disabled={!p.isPaid}
                      onChange={e => upsert(s.id, { paymentMethod: e.target.value })}
                      style={{ padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 12, cursor: 'pointer', outline: 'none', opacity: p.isPaid ? 1 : 0.4 }}
                    >
                      <option value="">-</option>
                      {PAY_METHODS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      value={p.memo || ''} placeholder="-"
                      onChange={e => upsert(s.id, { memo: e.target.value })}
                      style={{ width: '100%', padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 12, outline: 'none' }}
                    />
                  </td>
                </tr>
              );
            })}
            {display.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94A3B8', padding: 20 }}>재원생이 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </Card>
      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>
        ✓ 버튼 클릭으로 납부 처리 · 수강료/메모 칸은 직접 입력 후 자동 저장됩니다.
      </div>
    </Page>
  );
}
