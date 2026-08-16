'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, Plus, Download, Train, Hotel, 
  UtensilsCrossed, Ticket, ShoppingBag, Layers 
} from 'lucide-react';
import { TRIP_CONFIG, ExpenseCategoryType } from '@/lib/tripData';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';

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
  const props = { size: 18, strokeWidth: 2 };
  switch (cat) {
    case 'food': return <UtensilsCrossed {...props} />;
    case 'transport': return <Train {...props} />;
    case 'hotel': return <Hotel {...props} />;
    case 'temple': return <Ticket {...props} />;
    case 'shopping': return <ShoppingBag {...props} />;
    default: return <Layers {...props} />;
  }
}

export default function LedgerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formAmt, setFormAmt] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('mt-expenses');
    if (stored) setTimeout(() => setExpenses(JSON.parse(stored)), 0);
    else {
      setTimeout(() => setExpenses([
        { id: '1', paidBy: 'f1', familyName: 'Mitra', amount: 4800, description: 'Train Tickets', category: 'transport', date: '16 Oct', splitAmong: ['f1','f2'], perHead: 2400 },
        { id: '2', paidBy: 'f2', familyName: 'Ghosh', amount: 3200, description: 'Dinner Ajanta', category: 'food', date: '16 Oct', splitAmong: ['f1','f2'], perHead: 1600 },
        { id: '3', paidBy: 'f1', familyName: 'Mitra', amount: 12000, description: 'Taj Hotel Booking', category: 'hotel', date: '17 Oct', splitAmong: ['f1','f2'], perHead: 6000 },
      ]), 0);
    }
  }, []);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const f1Total = expenses.filter(e => e.paidBy === TRIP_CONFIG.families[0].id).reduce((s,e) => s + e.amount, 0);
  const f2Total = expenses.filter(e => e.paidBy === TRIP_CONFIG.families[1].id).reduce((s,e) => s + e.amount, 0);

  return (
    <div className="pb-safe relative w-full min-h-screen">
      
      {/* ── BACKGROUND ACCOUNTING AESTHETIC ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[var(--bg)]">
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="inner pt-safe">
        
        {/* ── HEADER ── */}
        <div className="mb-16 mt-8 lg:mt-16">
          <div className="text-eyebrow mb-2">TRIP EXPENDITURE</div>
          <h1 className="text-title-main text-[var(--text-primary)] mb-4">
            <span className="text-[var(--text-muted)] text-4xl lg:text-7xl align-top mr-2 leading-none">₹</span>
            {total.toLocaleString('en-IN')}
          </h1>
          <div className="text-title-section text-[var(--text-secondary)]">TOTAL SPEND</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* ── LEFT COLUMN: FAMILY SPLITS ── */}
          <div className="lg:col-span-5">
            <div className="space-y-8">
              <div className="flex justify-between items-baseline border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] pb-4">
                <div className="text-title-card">{TRIP_CONFIG.families[0].family} Family</div>
                <div className="font-mono text-2xl font-bold">₹{f1Total.toLocaleString('en-IN')}</div>
              </div>
              <div className="flex justify-between items-baseline border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] pb-4">
                <div className="text-title-card">{TRIP_CONFIG.families[1].family} Family</div>
                <div className="font-mono text-2xl font-bold">₹{f2Total.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-[var(--surface-2)] border border-[rgba(0,0,0,0.05)] rounded-[24px]">
               <div className="text-eyebrow mb-4">SETTLEMENT STATUS</div>
               <div className="text-body mb-6">
                 Currently, the <strong>{f1Total > f2Total ? TRIP_CONFIG.families[0].family : TRIP_CONFIG.families[1].family}</strong> family has paid ₹{Math.abs(f1Total - f2Total).toLocaleString('en-IN')} more.
               </div>
               <TactileButton variant="secondary" fullWidth className="bg-[var(--surface)]">
                 Generate Settlement Report
               </TactileButton>
            </div>
          </div>

          {/* ── RIGHT COLUMN: RECENT ACTIVITY ── */}
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between mb-8 border-b-2 border-[var(--text-primary)] pb-4">
              <h2 className="text-title-section">Recent Activity</h2>
              <button 
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:underline"
              >
                <Plus size={16} /> ADD EXPENSE
              </button>
            </div>

            <div className="space-y-0">
              {expenses.map((exp) => (
                <div key={exp.id} className="py-6 border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] flex items-start gap-6 group cursor-pointer hover:bg-[var(--surface-2)] -mx-4 px-4 rounded-xl transition-colors">
                  <div className="w-12 h-12 shrink-0 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[var(--text-secondary)] bg-[var(--surface)] mt-1">
                    <CatIcon cat={exp.category} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-title-card mb-1 truncate text-safe">{exp.description}</div>
                    <div className="text-body flex items-center gap-2 truncate">
                      <span>By {exp.familyName}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] shrink-0" />
                      <span>{exp.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xl font-bold text-[var(--text-primary)]">₹{exp.amount.toLocaleString('en-IN')}</div>
                    <div className="text-eyebrow mt-2 text-[var(--text-secondary)]">SPLIT 50/50</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Download size={16} /> EXPORT FULL LEDGER
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Action Button */}
      <div className="md:hidden fixed bottom-[100px] right-6 z-40">
        <button 
          onClick={() => setSheetOpen(true)}
          className="w-14 h-14 bg-[var(--text-primary)] text-[var(--bg)] rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* ── ADD EXPENSE SHEET ── */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="New Transaction">
        <div className="flex flex-col gap-8 pt-4">
          
          <div className="flex flex-col items-center justify-center py-8 bg-[var(--surface-2)] rounded-[24px] border border-dashed border-[var(--text-muted)]">
            <div className="text-eyebrow mb-4">TRANSACTION AMOUNT</div>
            <div className="flex items-center gap-2">
              <span className="text-4xl text-[var(--text-muted)] font-mono leading-none">₹</span>
              <input 
                type="number" 
                placeholder="0"
                className="w-48 bg-transparent text-6xl font-black font-mono text-[var(--text-primary)] text-center outline-none placeholder:text-[var(--text-muted)]"
                value={formAmt}
                onChange={e => setFormAmt(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <div className="text-eyebrow pl-1">CATEGORY</div>
              <button className="mat-paper px-6 py-5 rounded-[16px] text-sm font-bold text-[var(--text-primary)] flex items-center justify-between hover:bg-[var(--surface-2)] transition-colors">
                <span>Food</span>
                <UtensilsCrossed size={18} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-eyebrow pl-1">PAID BY</div>
              <button className="mat-paper px-6 py-5 rounded-[16px] text-sm font-bold text-[var(--text-primary)] flex items-center justify-between hover:bg-[var(--surface-2)] transition-colors">
                <span>Mitra</span>
                <div className="w-5 h-5 rounded-full bg-[var(--text-primary)]" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(0,0,0,0.05)]">
            <TactileButton fullWidth size="lg" onClick={() => setSheetOpen(false)} className="bg-[var(--text-primary)] text-[var(--bg)]">
              Log Transaction
            </TactileButton>
          </div>

        </div>
      </BottomSheet>

    </div>
  );
}
