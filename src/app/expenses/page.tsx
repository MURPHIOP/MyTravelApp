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
import FloatingActionButton from '@/components/ui/FloatingActionButton';

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
  const props = { size: 16, strokeWidth: 2.5 };
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
      // Mock some data if empty to show UI
      setTimeout(() => setExpenses([
        { id: '1', paidBy: 'f1', familyName: 'Mitra', amount: 4800, description: 'Train Tickets', category: 'transport', date: '16 Oct', splitAmong: ['f1','f2'], perHead: 2400 },
        { id: '2', paidBy: 'f2', familyName: 'Ghosh', amount: 3200, description: 'Dinner Ajanta', category: 'food', date: '16 Oct', splitAmong: ['f1','f2'], perHead: 1600 }
      ]), 0);
    }
  }, []);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // Compute percentages for visual split
  const f1Total = expenses.filter(e => e.paidBy === TRIP_CONFIG.families[0].id).reduce((s,e) => s + e.amount, 0);
  const f2Total = expenses.filter(e => e.paidBy === TRIP_CONFIG.families[1].id).reduce((s,e) => s + e.amount, 0);
  const f1Pct = total > 0 ? (f1Total / total) * 100 : 50;
  const f2Pct = total > 0 ? (f2Total / total) * 100 : 50;

  return (
    <div className="pt-safe pb-24">
      
      {/* ── HEADER ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-6 pb-6 flex items-center justify-between"
      >
        <div>
          <div className="label-sm mb-1">Trip Spend</div>
          <h1 className="heading-xl">Trip Ledger</h1>
        </div>
        <div className="w-12 h-12 rounded-full mat-metal flex items-center justify-center">
          <IndianRupee size={20} className="text-[var(--accent-success)]" />
        </div>
      </motion.div>

      <div className="inner space-y-8">

        {/* ── FINANCIAL DASHBOARD ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mat-paper p-6 relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <div className="label-sm mb-2">Total Expenditure</div>
            <div className="heading-display text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)] font-medium text-3xl">₹</span>
              {total.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="space-y-4">
            {/* Split Mitra */}
            <div>
              <div className="flex justify-between items-end mb-2 pl-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">{TRIP_CONFIG.families[0].family}</div>
                <div className="font-black text-sm text-[var(--accent-success)]">₹{f1Total.toLocaleString()}</div>
              </div>
              <div className="h-3 w-full bg-[var(--surface-3)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${f1Pct}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-[var(--text-primary)] rounded-full"
                />
              </div>
            </div>

            {/* Split Ghosh */}
            <div>
              <div className="flex justify-between items-end mb-2 pl-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">{TRIP_CONFIG.families[1].family}</div>
                <div className="font-black text-sm text-[var(--accent-success)]">₹{f2Total.toLocaleString()}</div>
              </div>
              <div className="h-3 w-full bg-[var(--surface-3)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${f2Pct}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-[var(--text-secondary)] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RECENT TRANSACTIONS ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="heading-lg">Recent Entries</h3>
            <button className="text-[var(--accent-secondary)] font-bold text-sm flex items-center gap-1">
              Download PDF <Download size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {expenses.map((exp) => (
              <div key={exp.id} className="mat-paper p-4 flex items-center gap-3 transition-transform active:scale-95">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
                  <CatIcon cat={exp.category} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14px] text-[var(--text-primary)] mb-0.5 truncate">{exp.description}</div>
                  <div className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1.5 truncate">
                    <span className="uppercase tracking-wider">By {exp.familyName}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] shrink-0" />
                    <span>{exp.date}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-[15px] text-[var(--text-primary)]">₹{exp.amount}</div>
                  <div className="text-[9px] font-bold text-[var(--accent)] mt-0.5 uppercase tracking-wider">Split 50/50</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <FloatingActionButton 
        icon={<Plus size={24} />} 
        label="Add"
        onClick={() => setSheetOpen(true)} 
      />

      {/* ── ADD EXPENSE SHEET ── */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="New Expense">
        <div className="flex flex-col gap-6 pt-2">
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Total Amount</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-[var(--text-muted)] font-medium">₹</span>
              <input 
                type="number" 
                placeholder="0"
                className="w-48 bg-transparent text-5xl font-black text-[var(--text-primary)] text-center outline-none placeholder:text-[var(--surface-3)]"
                value={formAmt}
                onChange={e => setFormAmt(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="mat-inset p-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="label-sm pl-1">Category</div>
              <button className="bg-[var(--surface)] px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-primary)] border border-black/5 dark:border-white/5 flex items-center justify-between">
                <span>Food</span>
                <UtensilsCrossed size={16} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="label-sm pl-1">Paid By</div>
              <button className="bg-[var(--surface)] px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-primary)] border border-black/5 dark:border-white/5 flex items-center justify-between">
                <span>Mitra</span>
                <div className="w-4 h-4 rounded-full bg-[var(--text-primary)]" />
              </button>
            </div>
          </div>

          <TactileButton fullWidth size="lg" onClick={() => setSheetOpen(false)}>
            Log Transaction
          </TactileButton>

        </div>
      </BottomSheet>

    </div>
  );
}
