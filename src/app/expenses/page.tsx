'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, Activity, X, Download, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Expense = {
  id: string;
  date: string;
  description: string;
  category: string;
  paidBy: 'Mitra' | 'Ghosh';
  amount: number;
  type?: 'EXPENSE' | 'RECEIPT';
};

export default function ExpensesPage() {
  const { user, openLoginModal, loading } = useAuth();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('OTHER');
  const [paidBy, setPaidBy] = useState<Expense['paidBy']>('Mitra');
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'RECEIPT'>('EXPENSE');

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

    let displayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        displayDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      }
    }

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      date: displayDate,
      description: desc,
      category: transactionType === 'RECEIPT' ? 'ADVANCE' : category,
      paidBy,
      amount: parseFloat(amount),
      type: transactionType
    };

    setExpenses(prev => [newExpense, ...prev]);
    setIsAddModalOpen(false);
    setDesc('');
    setAmount('');
    setTransactionType('EXPENSE');
  };

  // Calculations
  const safeType = (e: Expense) => e.type || 'EXPENSE';

  const totalExpense = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  
  const mitraPaidExpenses = expenses.filter(e => e.paidBy === 'Mitra' && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const mitraPaidReceipts = expenses.filter(e => e.paidBy === 'Mitra' && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  const mitraTotalContribution = mitraPaidExpenses + mitraPaidReceipts;

  const ghoshPaidExpenses = expenses.filter(e => e.paidBy === 'Ghosh' && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshPaidReceipts = expenses.filter(e => e.paidBy === 'Ghosh' && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshTotalContribution = ghoshPaidExpenses + ghoshPaidReceipts;

  const halfShare = totalExpense / 2;

  const mitraBalance = mitraTotalContribution - halfShare; // negative means owes, positive means gets
  const ghoshBalance = ghoshTotalContribution - halfShare;

  const numberToWords = (num: number): string => {
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    const numStr = num.toString();
    if (numStr.length > 9) return 'overflow';
    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'Only ' : '';
    return str.trim() === '' ? 'Zero Only' : str.trim();
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    // --- 1. Header Section ---
    // Top Left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51); // #333333
    doc.text("BHARAT TIRTHA DARSHAN AUTO-LEDGER", margin, 50);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102); // #666666
    doc.text("System Generated Settlement Engine", margin, 65);

    // Top Right
    const invoiceNo = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`;
    const issueDate = new Date().toLocaleDateString('en-GB');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("SETTLEMENT INVOICE", pageWidth - margin, 50, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoiceNo}`, pageWidth - margin, 65, { align: 'right' });
    doc.text(`Date of Issue: ${issueDate}`, pageWidth - margin, 80, { align: 'right' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.line(margin, 95, pageWidth - margin, 95);

    // --- 2. Parties & Summary Section ---
    const startY = 115;

    // Left Side: Billed To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text("Billed To:", margin, startY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Participating Family Heads", margin, startY + 15);
    doc.text("Families: Mitra Family & Ghosh Family", margin, startY + 30);
    doc.text("Account Status: ACTIVE", margin, startY + 45);

    // Right Side: Summary Box
    const boxWidth = 220;
    const boxHeight = 85;
    const boxX = pageWidth - margin - boxWidth;
    const boxY = startY - 10;
    
    doc.setFillColor(245, 245, 245); // light gray
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text("BALANCE SUMMARY", boxX + 15, boxY + 20);
    
    doc.setFontSize(12);
    doc.setTextColor(26, 26, 36); // Darker
    doc.text(`Total Expenditure: INR ${totalExpense.toLocaleString('en-IN')}`, boxX + 15, boxY + 40);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const mStatus = mitraBalance < 0 ? `Owes INR ${Math.abs(mitraBalance).toLocaleString('en-IN')}` : `Gets INR ${mitraBalance.toLocaleString('en-IN')}`;
    const gStatus = ghoshBalance < 0 ? `Owes INR ${Math.abs(ghoshBalance).toLocaleString('en-IN')}` : `Gets INR ${ghoshBalance.toLocaleString('en-IN')}`;
    
    doc.setTextColor(102, 102, 102);
    doc.text(`Mitra Status: ${mitraBalance === 0 ? 'SETTLED' : mStatus}`, boxX + 15, boxY + 60);
    doc.text(`Ghosh Status: ${ghoshBalance === 0 ? 'SETTLED' : gStatus}`, boxX + 15, boxY + 75);

    // --- 3. Main Ledger Table ---
    const tableData = expenses.map((exp, index) => [
      (index + 1).toString(),
      exp.date,
      safeType(exp) === 'RECEIPT' ? `[RECEIPT] ${exp.description}` : exp.description,
      exp.paidBy,
      safeType(exp) === 'RECEIPT' ? "Deposit (N/A)" : "Both (50/50)",
      exp.amount.toLocaleString('en-IN')
    ]);

    // Footer Row for table
    tableData.push([
      { content: 'GRAND TOTAL', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `INR ${totalExpense.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }
    ] as any);

    autoTable(doc, {
      startY: boxY + boxHeight + 30,
      head: [['S.No', 'Date', 'Description', 'Paid By', 'Split Among', 'Amount (INR)']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [26, 26, 36], // #1A1A24
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 6,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        2: { cellWidth: 'auto' }, // description wraps
        5: { halign: 'right', cellWidth: 80 }
      },
      didDrawPage: function (data) {
        // --- 4. Footer Section ---
        const pageCount = (doc.internal as any).getNumberOfPages();
        const yPos = pageHeight - 60;
        
        // Amount in Words
        if (data.pageNumber === pageCount) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(51, 51, 51);
          const amtWords = `Amount in Words: INR ${numberToWords(totalExpense)}`;
          doc.text(amtWords, margin, yPos - 20);

          // Signatory
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text("[System Auto-Generated - No Signature Required]", pageWidth - margin, yPos - 20, { align: 'right' });
          doc.setFont("helvetica", "bold");
          doc.setTextColor(51, 51, 51);
          doc.text("Authorized Signatory", pageWidth - margin, yPos - 10, { align: 'right' });
        }

        // Page Numbers
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(102, 102, 102);
        doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
      }
    });

    doc.save(`Invoice_${invoiceNo}.pdf`);
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
                  <p className="font-mono text-xs font-bold">PAID ₹{mitraTotalContribution.toLocaleString('en-IN')} // SHARE ₹{halfShare.toLocaleString('en-IN')}</p>
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
                  <p className="font-mono text-xs font-bold">PAID ₹{ghoshTotalContribution.toLocaleString('en-IN')} // SHARE ₹{halfShare.toLocaleString('en-IN')}</p>
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
                  <th className="p-6 font-black text-right border-r-2 border-black">Amount</th>
                  <th className="p-6 font-black text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg uppercase">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500 font-mono">No transactions found. Add an expense to begin.</td>
                  </tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-100 transition-colors border-b-2 border-black">
                      <td className="p-6 border-r-2 border-black font-mono text-sm">{exp.date}</td>
                      <td className="p-6 border-r-2 border-black">
                        <div className="flex items-center gap-2">
                          {safeType(exp) === 'RECEIPT' && <span className="bg-green-600 text-white text-xs px-2 py-1 font-mono">RECEIPT</span>}
                          {exp.description}
                        </div>
                      </td>
                      <td className="p-6 border-r-2 border-black">
                        <span className={`px-3 py-1 font-mono text-xs border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          safeType(exp) === 'RECEIPT' ? 'bg-green-100 border-green-600 text-green-600' :
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
                      <td className="p-6 text-right font-black border-r-2 border-black">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={24} className="mx-auto" />
                        </button>
                      </td>
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
                
                <div className="flex gap-4 mb-2">
                  <button type="button" onClick={() => setTransactionType('EXPENSE')} className={`flex-1 p-3 border-2 border-black font-black uppercase ${transactionType === 'EXPENSE' ? 'bg-[var(--accent)] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 hover:bg-gray-200'}`}>EXPENSE</button>
                  <button type="button" onClick={() => setTransactionType('RECEIPT')} className={`flex-1 p-3 border-2 border-black font-black uppercase ${transactionType === 'RECEIPT' ? 'bg-green-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 hover:bg-gray-200'}`}>RECEIPT</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-mono text-xs tracking-widest">Date</label>
                    <input 
                      type="date" 
                      value={dateStr}
                      onChange={e => setDateStr(e.target.value)}
                      required
                      className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white" 
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
                </div>

                <div>
                  <label className="block mb-2 font-mono text-xs tracking-widest">Description</label>
                  <input 
                    type="text" 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    placeholder={transactionType === 'RECEIPT' ? "e.g. Deposit to Trip Fund" : "e.g. Dinner at Dhaba"}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {transactionType === 'EXPENSE' && (
                    <div>
                      <label className="block mb-2 font-mono text-xs tracking-widest">Category</label>
                      <input 
                        list="categories"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
                        placeholder="e.g. SHOPPING"
                      />
                      <datalist id="categories">
                        <option value="TRANS" />
                        <option value="HOTEL" />
                        <option value="SIGHT" />
                        <option value="FOOD" />
                        <option value="OTHER" />
                      </datalist>
                    </div>
                  )}
                  <div className={transactionType === 'RECEIPT' ? 'col-span-2' : ''}>
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
