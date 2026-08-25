'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, Activity, X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Expense = {
  id: string;
  date: string;
  description: string;
  category: 'TRANS' | 'HOTEL' | 'SIGHT' | 'FOOD' | 'OTHER';
  paidBy: 'Mitra' | 'Ghosh';
  amount: number;
};

export default function ExpensesPage() {
  const { user, openLoginModal, loading } = useAuth();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('OTHER');
  const [paidBy, setPaidBy] = useState<Expense['paidBy']>('Mitra');

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('family_ledger');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'FAMILY_HEAD')) {
      openLoginModal();
      router.push('/');
    }
  }, [user, loading, openLoginModal, router]);

  // Save to local storage whenever expenses change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('family_ledger', JSON.stringify(expenses));
    }
  }, [expenses, isClient]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      description: desc,
      category,
      paidBy,
      amount: parseFloat(amount)
    };

    setExpenses(prev => [newExpense, ...prev]);
    setIsAddModalOpen(false);
    setDesc('');
    setAmount('');
  };

  // Calculations
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const mitraPaid = expenses.filter(e => e.paidBy === 'Mitra').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshPaid = expenses.filter(e => e.paidBy === 'Ghosh').reduce((sum, exp) => sum + exp.amount, 0);
  const halfShare = totalExpense / 2;

  const mitraBalance = mitraPaid - halfShare; // negative means owes, positive means gets
  const ghoshBalance = ghoshPaid - halfShare;

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("MAHARASHTRA V2 - SETTLEMENT BILL", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Total Expenses: Rs. ${totalExpense.toLocaleString('en-IN')}`, 14, 40);
    
    doc.text(`Mitra Paid: Rs. ${mitraPaid.toLocaleString('en-IN')} | ${mitraBalance < 0 ? 'Owes' : 'Gets'}: Rs. ${Math.abs(mitraBalance).toLocaleString('en-IN')}`, 14, 48);
    doc.text(`Ghosh Paid: Rs. ${ghoshPaid.toLocaleString('en-IN')} | ${ghoshBalance < 0 ? 'Owes' : 'Gets'}: Rs. ${Math.abs(ghoshBalance).toLocaleString('en-IN')}`, 14, 56);
    
    autoTable(doc, {
      startY: 65,
      head: [['Date', 'Description', 'Category', 'Paid By', 'Amount (Rs)']],
      body: expenses.map(exp => [
        exp.date,
        exp.description,
        exp.category,
        exp.paidBy,
        exp.amount.toLocaleString('en-IN')
      ]),
    });
    
    doc.save("Family_Trip_Settlement_Bill.pdf");
  };

  if (loading || !user || user.role !== 'FAMILY_HEAD') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-mono font-black uppercase text-2xl tracking-tighter animate-pulse">
        Checking Security Clearance...
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        {/* Brutalist Header */}
        <div className="mb-16 border-b-4 border-[var(--border-color)] pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="inline-block bg-[var(--text-primary)] text-white px-3 py-1 font-mono text-sm font-bold uppercase mb-6 shadow-[4px_4px_0px_0px_var(--accent)]">
              Ledger Module
            </div>
            <h1 className="heading-hero">Auto-Split</h1>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="brutal-btn brutal-btn-accent flex items-center gap-2"
          >
            <Plus size={20} /> Add Expense
          </button>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Total */}
          <div className="brutal-card p-8 lg:col-span-1 bg-[#FFEDD5]">
            <div className="flex items-center gap-3 mb-6">
              <Activity size={28} className="text-[var(--accent)]" />
              <h3 className="font-mono font-black uppercase tracking-widest">Total Expense</h3>
            </div>
            <div className="text-6xl font-black mb-4">₹{totalExpense.toLocaleString('en-IN')}</div>
            <div className="bg-white border-2 border-black px-4 py-2 font-mono text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase w-max">
              Across Both Families
            </div>
          </div>

          {/* Settlement Status */}
          <div className="brutal-card p-8 lg:col-span-2 bg-[#ECFCCB]">
            <h3 className="font-mono font-black uppercase tracking-widest text-[var(--accent)] mb-8 border-b-2 border-black pb-4">
              Current Settlement State
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
              {/* Mitra Status */}
              <div className="text-center w-full md:w-auto">
                <div className="text-3xl font-black uppercase mb-4">Mitra</div>
                <div className={`bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_${mitraBalance < 0 ? '#EF4444' : mitraBalance > 0 ? '#10B981' : '#94A3B8'}]`}>
                  <div className={`text-4xl font-black flex items-center justify-center gap-2 mb-2 ${mitraBalance < 0 ? 'text-red-600' : mitraBalance > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {mitraBalance < 0 ? <ArrowUpRight size={32} /> : mitraBalance > 0 ? <ArrowDownRight size={32} /> : null}
                    {mitraBalance < 0 ? `OWE ₹${Math.abs(mitraBalance).toLocaleString('en-IN')}` : mitraBalance > 0 ? `GET ₹${mitraBalance.toLocaleString('en-IN')}` : 'SETTLED'}
                  </div>
                  <p className="font-mono text-xs font-bold">PAID ₹{mitraPaid.toLocaleString('en-IN')} // SHARE ₹{halfShare.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="hidden md:block w-4 h-32 border-r-4 border-black border-dashed border-y-0 border-l-0" />

              {/* Ghosh Status */}
              <div className="text-center w-full md:w-auto">
                <div className="text-3xl font-black uppercase mb-4">Ghosh</div>
                <div className={`bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_${ghoshBalance < 0 ? '#EF4444' : ghoshBalance > 0 ? '#10B981' : '#94A3B8'}]`}>
                  <div className={`text-4xl font-black flex items-center justify-center gap-2 mb-2 ${ghoshBalance < 0 ? 'text-red-600' : ghoshBalance > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {ghoshBalance < 0 ? <ArrowUpRight size={32} /> : ghoshBalance > 0 ? <ArrowDownRight size={32} /> : null}
                    {ghoshBalance < 0 ? `OWE ₹${Math.abs(ghoshBalance).toLocaleString('en-IN')}` : ghoshBalance > 0 ? `GET ₹${ghoshBalance.toLocaleString('en-IN')}` : 'SETTLED'}
                  </div>
                  <p className="font-mono text-xs font-bold">PAID ₹{ghoshPaid.toLocaleString('en-IN')} // SHARE ₹{halfShare.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="brutal-card p-0 overflow-hidden">
          <div className="bg-black text-white p-6 border-b-4 border-black flex justify-between items-center">
            <h3 className="font-black text-xl uppercase tracking-widest flex items-center gap-4">
              <Wallet size={28} className="text-[var(--accent)]" /> 
              Transaction Log
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={generatePDF}
                className="font-mono text-xs font-bold bg-white text-black hover:bg-gray-200 px-3 py-1 border-2 border-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download size={14} /> GENERATE BILL
              </button>
              <button 
                onClick={() => setExpenses([])}
                className="font-mono text-xs font-bold bg-red-600 hover:bg-red-700 px-3 py-1 text-white border-2 border-white transition-colors cursor-pointer"
              >
                CLEAR ALL
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E5E5E5] font-mono text-xs tracking-widest uppercase border-b-4 border-black">
                  <th className="p-6 font-black border-r-2 border-black">Date</th>
                  <th className="p-6 font-black border-r-2 border-black">Description</th>
                  <th className="p-6 font-black border-r-2 border-black">Category</th>
                  <th className="p-6 font-black border-r-2 border-black">Paid By</th>
                  <th className="p-6 font-black text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg uppercase">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500 font-mono">No transactions found. Add an expense to begin.</td>
                  </tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-100 transition-colors border-b-2 border-black">
                      <td className="p-6 border-r-2 border-black font-mono text-sm">{exp.date}</td>
                      <td className="p-6 border-r-2 border-black">{exp.description}</td>
                      <td className="p-6 border-r-2 border-black">
                        <span className={`px-3 py-1 font-mono text-xs border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          exp.category === 'TRANS' ? 'bg-blue-100 border-blue-600 text-blue-600' :
                          exp.category === 'HOTEL' ? 'bg-orange-100 border-orange-600 text-orange-600' :
                          exp.category === 'SIGHT' ? 'bg-pink-100 border-pink-600 text-pink-600' :
                          exp.category === 'FOOD' ? 'bg-green-100 border-green-600 text-green-600' :
                          'bg-gray-100 border-gray-600 text-gray-600'
                        }`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-6 border-r-2 border-black">{exp.paidBy}</td>
                      <td className="p-6 text-right font-black">₹{exp.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-black text-white p-4 flex justify-between items-center">
                <h2 className="font-black text-xl uppercase tracking-widest">New Transaction</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="hover:text-red-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddExpense} className="p-6 flex flex-col gap-6 font-bold uppercase text-sm">
                <div>
                  <label className="block mb-2 font-mono text-xs tracking-widest">Description</label>
                  <input 
                    type="text" 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    placeholder="e.g. Dinner at Dhaba"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-mono text-xs tracking-widest">Amount (₹)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    placeholder="500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-mono text-xs tracking-widest">Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white appearance-none"
                    >
                      <option value="TRANS">Transport</option>
                      <option value="HOTEL">Hotel</option>
                      <option value="SIGHT">Sightseeing</option>
                      <option value="FOOD">Food</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-mono text-xs tracking-widest">Paid By</label>
                    <select 
                      value={paidBy}
                      onChange={e => setPaidBy(e.target.value as any)}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white appearance-none"
                    >
                      <option value="Mitra">Mitra Family</option>
                      <option value="Ghosh">Ghosh Family</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-[var(--accent)] text-white font-black py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                  RECORD EXPENSE
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
