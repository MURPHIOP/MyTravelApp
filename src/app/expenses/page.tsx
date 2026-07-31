'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  Plus, Wallet, Users, ArrowRight, Download, Trash2,
  UtensilsCrossed, Car, Hotel, MapPin, ShoppingBag, Layers,
  TrendingUp, CheckCircle, Lock, ChevronDown
} from 'lucide-react';
import { TRIP_CONFIG, EXPENSE_CATEGORIES, ExpenseCategoryType } from '@/lib/tripData';
import { jsPDF } from 'jspdf';

// ── Types ─────────────────────────────────────────────────
interface Expense {
  id: string;
  paidBy: string;
  familyName: string;
  amount: number;
  description: string;
  category: ExpenseCategoryType;
  date: string;
  splitAmong: string[];
  perHead: number;
}

// ── Category Icon ─────────────────────────────────────────
function CatIcon({ cat }: { cat: string }) {
  const props = { size: 14, strokeWidth: 2 };
  switch (cat) {
    case 'food': return <UtensilsCrossed {...props} />;
    case 'transport': return <Car {...props} />;
    case 'hotel': return <Hotel {...props} />;
    case 'temple': return <MapPin {...props} />;
    case 'shopping': return <ShoppingBag {...props} />;
    default: return <Layers {...props} />;
  }
}

// ── Balance Summary ───────────────────────────────────────
function computeBalance(expenses: Expense[]) {
  const bal: Record<string, number> = {};
  TRIP_CONFIG.families.forEach(f => { bal[f.id] = 0; });

  expenses.forEach(exp => {
    exp.splitAmong.forEach(fid => {
      if (fid !== exp.paidBy) {
        bal[fid] = (bal[fid] ?? 0) - exp.perHead;
        bal[exp.paidBy] = (bal[exp.paidBy] ?? 0) + exp.perHead;
      }
    });
  });

  return bal;
}

// ── PDF Invoice ───────────────────────────────────────────
function generateInvoicePDF(expenses: Expense[], bal: Record<string, number>) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('Mitra & Ghosh Family', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Ancient Maharashtra Tour — Expense Invoice', 105, 28, { align: 'center' });

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 33, 190, 33);

  // Table headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  let y = 42;
  doc.text('DATE', 20, y);
  doc.text('DESCRIPTION', 48, y);
  doc.text('CATEGORY', 108, y);
  doc.text('PAID BY', 138, y);
  doc.text('AMOUNT', 162, y);
  doc.text('PER HEAD', 180, y);

  doc.line(20, y + 3, 200, y + 3);
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  expenses.forEach((exp, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(18, y - 4, 178, 9, 'F');
    }
    doc.text(exp.date, 20, y);
    doc.text(doc.splitTextToSize(exp.description, 55)[0], 48, y);
    doc.text(exp.category, 108, y);
    doc.text(exp.familyName.replace(' Family', ''), 138, y);
    doc.text(`Rs. ${exp.amount}`, 162, y);
    doc.text(`Rs. ${Math.round(exp.perHead)}`, 180, y);
    y += 9;
  });

  doc.line(20, y + 2, 200, y + 2);
  y += 10;

  // Total
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Total Spent: Rs. ${total}`, 140, y, { align: 'right' });
  y += 14;

  // Balance
  doc.setFontSize(10);
  doc.text('Settlement Summary', 20, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  TRIP_CONFIG.families.forEach(f => {
    const amt = bal[f.id] ?? 0;
    const label = amt > 0 ? `${f.family} is owed Rs. ${Math.round(amt)}`
      : amt < 0 ? `${f.family} owes Rs. ${Math.round(Math.abs(amt))}`
      : `${f.family} is settled`;
    doc.text(label, 20, y);
    y += 7;
  });

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 105, y, { align: 'center' });

  doc.save('maharashtra-tour-expenses.pdf');
}

// ── Main Component ────────────────────────────────────────
export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isHead, setIsHead] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [headFamily, setHeadFamily] = useState<typeof TRIP_CONFIG.families[0] | null>(null);

  // Form state
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'food' as ExpenseCategoryType,
    date: new Date().toISOString().slice(0, 10),
    splitAll: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem('mt-expenses');
    if (stored) setExpenses(JSON.parse(stored));
    const storedHead = localStorage.getItem('mt-head');
    if (storedHead) {
      const f = TRIP_CONFIG.families.find(x => x.id === storedHead);
      if (f) { setIsHead(true); setHeadFamily(f); }
    }
  }, []);

  const saveExpenses = (exps: Expense[]) => {
    setExpenses(exps);
    localStorage.setItem('mt-expenses', JSON.stringify(exps));
  };

  // Simple PIN login (1234 for Mitra, 5678 for Ghosh — change in prod)
  const handlePinLogin = () => {
    if (pinInput === '1234') {
      const f = TRIP_CONFIG.families[0];
      setIsHead(true); setHeadFamily(f);
      localStorage.setItem('mt-head', f.id);
      setShowPin(false);
    } else if (pinInput === '5678') {
      const f = TRIP_CONFIG.families[1];
      setIsHead(true); setHeadFamily(f);
      localStorage.setItem('mt-head', f.id);
      setShowPin(false);
    } else {
      alert('Invalid PIN');
    }
    setPinInput('');
  };

  const addExpense = () => {
    if (!headFamily || !form.description || !form.amount) return;
    const amt = parseFloat(form.amount);
    const split = TRIP_CONFIG.families.map(f => f.id);
    const exp: Expense = {
      id: Date.now().toString(),
      paidBy: headFamily.id,
      familyName: headFamily.family,
      amount: amt,
      description: form.description,
      category: form.category,
      date: form.date,
      splitAmong: split,
      perHead: amt / split.length,
    };
    saveExpenses([...expenses, exp]);
    setForm({ description: '', amount: '', category: 'food', date: new Date().toISOString().slice(0, 10), splitAll: true });
    setShowForm(false);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  };

  const bal = computeBalance(expenses);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // Group by date
  const byDate = expenses.reduce<Record<string, Expense[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  return (
    <div className="inner py-6" style={{ paddingTop: 'calc(var(--header-height) + 16px)' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="label-sm">Auto Split</p>
          <h1 className="heading-lg">Expenses</h1>
        </div>
        <div className="flex items-center gap-2">
          {expenses.length > 0 && (
            <button
              className="btn btn-ghost tap"
              style={{ padding: '9px 14px', borderRadius: 14, fontSize: 13 }}
              onClick={() => generateInvoicePDF(expenses, bal)}
            >
              <Download size={14} /> PDF
            </button>
          )}
          {isHead ? (
            <button
              id="add-expense-btn"
              className="btn btn-primary tap"
              style={{ padding: '9px 16px', borderRadius: 14, fontSize: 13 }}
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={15} /> Add
            </button>
          ) : (
            <button
              className="btn btn-ghost tap"
              style={{ padding: '9px 14px', borderRadius: 14, fontSize: 13, background: 'var(--accent-light)', color: 'var(--accent)' }}
              onClick={() => setShowPin(true)}
            >
              <Lock size={14} /> Login
            </button>
          )}
        </div>
      </div>

      {/* PIN Login Modal */}
      {showPin && (
        <div className="bottom-sheet-overlay" onClick={() => setShowPin(false)}>
          <div className="bottom-sheet p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: 'var(--accent-light)' }}>
                <Lock size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="heading-md">Family Head Access</h3>
                <p className="body-sm">Enter your 4-digit PIN to add expenses</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Enter PIN (4 digits)"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePinLogin()}
                className="field"
                style={{ letterSpacing: '0.3em', fontSize: 20, textAlign: 'center' }}
              />
              <button className="btn btn-primary tap" style={{ borderRadius: 16, padding: '14px' }} onClick={handlePinLogin}>
                Access Expense Manager
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                Mitra Family: 1234 &bull; Ghosh Family: 5678
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Family Head badge */}
      {isHead && headFamily && (
        <div
          className="flex items-center justify-between p-4 rounded-2xl mb-4"
          style={{ background: `${headFamily.color}12`, border: `1px solid ${headFamily.color}30` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: headFamily.color, color: '#fff', fontWeight: 800, fontSize: 12 }}
            >
              {headFamily.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{headFamily.head}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Family Head — Can add expenses</div>
            </div>
          </div>
          <button
            onClick={() => { setIsHead(false); setHeadFamily(null); localStorage.removeItem('mt-head'); }}
            style={{ fontSize: 11, color: 'var(--accent-red)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Add Expense Form */}
      {showForm && isHead && headFamily && (
        <div
          className="card-elevated p-5 mb-5"
          style={{ borderRadius: 24 }}
        >
          <h3 className="heading-md mb-4">Add New Expense</h3>
          <div className="flex flex-col gap-3">
            <input
              className="field"
              placeholder="Description (e.g., Lunch at Nashik)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="field"
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            <select
              className="field"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as ExpenseCategoryType })}
            >
              {Object.entries(EXPENSE_CATEGORIES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <input
              className="field"
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <div
              className="p-3 rounded-2xl flex items-center gap-2"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}
            >
              <Users size={14} style={{ color: 'var(--accent)' }} />
              Split equally: Mitra Family + Ghosh Family
            </div>
            <div className="flex gap-3">
              <button
                className="btn tap flex-1"
                style={{ padding: 13, borderRadius: 16, background: 'var(--surface-2)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14 }}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary tap flex-1"
                style={{ padding: 13, borderRadius: 16, fontSize: 14 }}
                onClick={addExpense}
              >
                Add — ₹{form.amount || '0'} split
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Summary */}
      <div className="card-elevated p-5 mb-6" style={{ borderRadius: 24 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-md">Balance Summary</h2>
          <div className="pill pill-sm pill-blue">
            <TrendingUp size={10} /> Total: ₹{total.toLocaleString('en-IN')}
          </div>
        </div>

        {TRIP_CONFIG.families.map(f => {
          const fExpenses = expenses.filter(e => e.paidBy === f.id);
          const fTotal = fExpenses.reduce((s, e) => s + e.amount, 0);
          const netBal = bal[f.id] ?? 0;

          return (
            <div key={f.id} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: f.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800,
                    }}
                  >
                    {f.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{f.family}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Paid ₹{fTotal.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div
                  className="pill pill-sm"
                  style={{
                    background: netBal > 0 ? 'rgba(16,185,129,0.12)' : netBal < 0 ? 'rgba(239,68,68,0.12)' : 'var(--surface-2)',
                    color: netBal > 0 ? '#10B981' : netBal < 0 ? '#EF4444' : 'var(--text-muted)',
                  }}
                >
                  {netBal > 0 ? `+₹${Math.round(netBal)} owed to them`
                    : netBal < 0 ? `-₹${Math.round(Math.abs(netBal))} they owe`
                    : 'Settled'}
                </div>
              </div>
              {/* Bar */}
              <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%', borderRadius: 99,
                    width: total > 0 ? `${(fTotal / total) * 100}%` : '0%',
                    background: f.color, transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Net statement */}
        {expenses.length > 0 && (() => {
          const b0 = bal[TRIP_CONFIG.families[0].id] ?? 0;
          const b1 = bal[TRIP_CONFIG.families[1].id] ?? 0;
          if (Math.abs(b0) < 1) return (
            <div className="flex items-center gap-2 p-3 rounded-2xl mt-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle size={14} style={{ color: '#10B981' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>All families are settled!</span>
            </div>
          );
          const debtor = b0 < 0 ? TRIP_CONFIG.families[0] : TRIP_CONFIG.families[1];
          const creditor = b0 > 0 ? TRIP_CONFIG.families[0] : TRIP_CONFIG.families[1];
          const amount = Math.round(Math.abs(b0));
          return (
            <div className="p-3 rounded-2xl mt-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-amber)' }}>
                {debtor.family} owes {creditor.family} <strong>₹{amount}</strong>
              </p>
            </div>
          );
        })()}
      </div>

      {/* Expense List */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="flex items-center justify-center w-16 h-16 rounded-3xl" style={{ background: 'var(--surface-2)' }}>
            <Wallet size={28} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="text-center">
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>No expenses yet</p>
            <p className="body-sm mt-1">Family heads can add expenses to get started</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(byDate).sort(([a], [b]) => b.localeCompare(a)).map(([date, dayExps]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{date}</p>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                  ₹{dayExps.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="card-elevated overflow-hidden" style={{ borderRadius: 24 }}>
                {dayExps.map((exp, idx) => {
                  const cat = EXPENSE_CATEGORIES[exp.category];
                  const fam = TRIP_CONFIG.families.find(f => f.id === exp.paidBy);

                  return (
                    <div
                      key={exp.id}
                      className="flex items-center gap-3 px-4 py-3.5"
                      style={{ borderBottom: idx < dayExps.length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                        style={{ background: `${cat.color}18`, color: cat.color }}
                      >
                        <CatIcon cat={exp.category} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exp.description}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                          Paid by {fam?.family} &bull; ₹{Math.round(exp.perHead)}/family
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </div>
                        {isHead && exp.paidBy === headFamily?.id && (
                          <button
                            className="tap"
                            onClick={() => deleteExpense(exp.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
