'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, UtensilsCrossed, Car, Hotel, MapPin, ShoppingBag, Layers, Wallet, TrendingUp, CheckCircle, Lock, Users, Receipt } from 'lucide-react';
import { TRIP_CONFIG, EXPENSE_CATEGORIES, ExpenseCategoryType } from '@/lib/tripData';
import { jsPDF } from 'jspdf';

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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isHead, setIsHead] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [headFamily, setHeadFamily] = useState<typeof TRIP_CONFIG.families[0] | null>(null);

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'food' as ExpenseCategoryType,
    date: new Date().toISOString().slice(0, 10),
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
    setForm({ description: '', amount: '', category: 'food', date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  };

  const bal = computeBalance(expenses);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Expense Report', 20, 20);
    doc.save('expenses.pdf');
  };

  const byDate = expenses.reduce<Record<string, Expense[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  return (
    <div className="page-content bg-[var(--bg)]">
      
      {/* ── HEADER ── */}
      <div className="pt-8 px-6 pb-4">
        <h1 className="heading-xl neon-text-cyan flex items-center gap-3">
          <Wallet size={32} /> Ledger
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-widest">Auto Split Calculator</p>
      </div>

      <div className="inner pb-12">
        {/* ── TOP ACTIONS ── */}
        <div className="flex items-center justify-between mb-8 px-2">
          {expenses.length > 0 && (
            <button className="neu-btn !py-2 !px-4 text-xs flex items-center gap-2" onClick={generatePDF}>
              <Download size={14} className="neon-text-cyan" /> Download PDF
            </button>
          )}
          <div className="ml-auto">
            {isHead ? (
              <button className="neu-btn-primary !py-2 !px-4 text-sm" onClick={() => setShowForm(!showForm)}>
                <Plus size={16} /> Add Entry
              </button>
            ) : (
              <button className="neu-btn !py-2 !px-4 text-xs flex items-center gap-2" onClick={() => setShowPin(true)}>
                <Lock size={14} className="neon-text-orange" /> Login
              </button>
            )}
          </div>
        </div>

        {/* ── LIVE DIGITAL BALANCE SCREEN ── */}
        <div className="neu-pressed rounded-[28px] p-6 mb-8 texture-metal relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Total Trip Expenditure</div>
            <div className="font-mono text-4xl md:text-5xl font-bold text-[#00FF41] tracking-wider mb-6" style={{ textShadow: '0 0 10px rgba(0,255,65,0.4), 0 0 20px rgba(0,255,65,0.2)' }}>
              ₹ {total.toLocaleString('en-IN')}.00
            </div>

            <div className="w-full h-px bg-white/10 mb-5" />

            <div className="w-full flex justify-between gap-4">
              {TRIP_CONFIG.families.map(f => {
                const netBal = bal[f.id] ?? 0;
                return (
                  <div key={f.id} className="flex-1 text-center neu-concave p-3 rounded-2xl bg-black/20 border border-white/5">
                    <div className="text-xs font-bold text-gray-400 mb-1">{f.family}</div>
                    {netBal > 0 ? (
                      <div className="text-sm font-mono font-bold text-[#00FF41]">+₹ {Math.round(netBal)}</div>
                    ) : netBal < 0 ? (
                      <div className="text-sm font-mono font-bold text-[#FF3333]">-₹ {Math.round(Math.abs(netBal))}</div>
                    ) : (
                      <div className="text-sm font-mono font-bold text-gray-500">0</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ADD EXPENSE FORM (Mechanical Style) ── */}
        {showForm && isHead && headFamily && (
          <div className="neu-flat rounded-[32px] p-6 mb-8 texture-metal">
            <h3 className="heading-md mb-6 flex items-center gap-2">
              <Receipt size={20} className="neon-text-orange" /> New Transaction
            </h3>
            
            <div className="flex flex-col gap-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="Amount"
                  className="neu-field !pl-8 !text-xl !font-bold"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>

              <input
                type="text"
                placeholder="Description"
                className="neu-field"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <div className="flex gap-4">
                <select
                  className="neu-field flex-1"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as ExpenseCategoryType })}
                >
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                
                <input
                  type="date"
                  className="neu-field flex-1"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>

              {/* Physical Sliding Switch for Family Select */}
              <div className="mt-2 flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Paid By</label>
                <div className="neu-pressed p-2 rounded-2xl flex items-center bg-black/10 relative h-[60px]">
                  {TRIP_CONFIG.families.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setHeadFamily(f)}
                      className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold z-10 transition-colors ${headFamily.id === f.id ? 'text-white' : 'text-gray-500'}`}
                    >
                      {f.family}
                    </button>
                  ))}
                  {/* Slider thumb */}
                  <div 
                    className="absolute top-2 bottom-2 w-[calc(50%-8px)] neu-flat rounded-xl transition-all duration-300 ease-spring"
                    style={{ 
                      left: headFamily.id === TRIP_CONFIG.families[0].id ? '8px' : 'calc(50% + 4px)',
                      background: 'linear-gradient(145deg, var(--surface-2), var(--surface))',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }} 
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button className="neu-btn flex-1" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="neu-btn-primary flex-[2]" onClick={addExpense}>Log Expense</button>
              </div>
            </div>
          </div>
        )}

        {/* ── EXPENSE HISTORY ── */}
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 opacity-50">
            <div className="neu-pressed w-20 h-20 rounded-full flex items-center justify-center">
              <Receipt size={32} className="text-gray-400" />
            </div>
            <p className="font-bold tracking-widest text-sm uppercase text-gray-400">Vault Empty</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(byDate).sort(([a], [b]) => b.localeCompare(a)).map(([date, dayExps]) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4 pl-2">
                  <div className="text-xs font-bold text-gray-500 tracking-widest uppercase">{date}</div>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="neu-flat rounded-[24px] overflow-hidden">
                  {dayExps.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="flex items-center p-4 relative bg-[var(--surface)]"
                    >
                      <div className="neu-convex w-12 h-12 rounded-[16px] flex items-center justify-center mr-4">
                        <CatIcon cat={exp.category} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-[var(--text-primary)] truncate">{exp.description}</div>
                        <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-1">Paid by {exp.familyName}</div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="font-black text-[var(--text-primary)]">₹ {exp.amount}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">₹{Math.round(exp.perHead)}/ea</div>
                      </div>

                      {idx < dayExps.length - 1 && (
                        <div className="absolute bottom-0 left-16 right-4 h-px bg-white/5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      
      {/* ── PIN MODAL ── */}
      {showPin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="neu-flat p-8 rounded-[32px] w-full max-w-sm texture-metal relative">
            <h3 className="text-xl font-black mb-2 text-center text-white">Unlock Vault</h3>
            <p className="text-xs font-bold text-gray-400 text-center mb-8 uppercase tracking-widest">Enter Head Pin</p>
            
            <input
              type="password"
              className="neu-field !text-center !text-2xl !tracking-[1em] mb-6 !px-2"
              maxLength={4}
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
            />
            
            <div className="flex gap-4">
              <button className="neu-btn flex-1 text-sm" onClick={() => setShowPin(false)}>Cancel</button>
              <button className="neu-btn-primary flex-1 text-sm" onClick={handlePinLogin}>Unlock</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
