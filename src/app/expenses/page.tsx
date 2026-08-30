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
  splitMitra?: number;
  splitGhosh?: number;
};

export default function ExpensesPage() {
  const { user, openLoginModal, loading } = useAuth();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<'ALL' | 'Mitra' | 'Ghosh'>('ALL');

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('OTHER');
  const [paidBy, setPaidBy] = useState<Expense['paidBy']>('Mitra');
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'RECEIPT'>('EXPENSE');
  const [splitType, setSplitType] = useState<'EQUAL' | 'MITRA' | 'GHOSH' | 'CUSTOM'>('EQUAL');
  const [customSplitMitra, setCustomSplitMitra] = useState('');
  const [customSplitGhosh, setCustomSplitGhosh] = useState('');

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

    const amt = parseFloat(amount);
    
    let splitMitra = amt / 2;
    let splitGhosh = amt / 2;
    
    if (transactionType === 'EXPENSE') {
      if (splitType === 'MITRA') {
        splitMitra = amt;
        splitGhosh = 0;
      } else if (splitType === 'GHOSH') {
        splitMitra = 0;
        splitGhosh = amt;
      } else if (splitType === 'CUSTOM') {
        splitMitra = parseFloat(customSplitMitra) || 0;
        splitGhosh = parseFloat(customSplitGhosh) || 0;
        if (splitMitra + splitGhosh !== amt) {
          alert('Custom split amounts must equal the total amount.');
          return;
        }
      }
    } else {
      splitMitra = 0;
      splitGhosh = 0;
    }

    const newExpense: Expense = {
      id: editingId ? editingId : Math.random().toString(36).substr(2, 9),
      date: displayDate,
      description: desc,
      category: transactionType === 'RECEIPT' ? 'ADVANCE' : category,
      paidBy,
      amount: amt,
      type: transactionType,
      splitMitra,
      splitGhosh
    };

    if (editingId) {
      setExpenses(prev => prev.map(e => e.id === editingId ? newExpense : e));
    } else {
      setExpenses(prev => [newExpense, ...prev]);
    }

    setIsAddModalOpen(false);
    setEditingId(null);
    setDesc('');
    setAmount('');
    setTransactionType('EXPENSE');
    setSplitType('EQUAL');
    setCustomSplitMitra('');
    setCustomSplitGhosh('');
  };

  // Calculations
  const safeType = (e: Expense) => e.type || 'EXPENSE';

  const getSplitMitra = (e: Expense) => e.splitMitra !== undefined ? e.splitMitra : (safeType(e) === 'EXPENSE' ? e.amount / 2 : 0);
  const getSplitGhosh = (e: Expense) => e.splitGhosh !== undefined ? e.splitGhosh : (safeType(e) === 'EXPENSE' ? e.amount / 2 : 0);

  const totalExpense = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  
  const mitraPaidExpenses = expenses.filter(e => e.paidBy === 'Mitra' && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const mitraPaidReceipts = expenses.filter(e => e.paidBy === 'Mitra' && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  const mitraTotalContribution = mitraPaidExpenses + mitraPaidReceipts;

  const ghoshPaidExpenses = expenses.filter(e => e.paidBy === 'Ghosh' && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshPaidReceipts = expenses.filter(e => e.paidBy === 'Ghosh' && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshTotalContribution = ghoshPaidExpenses + ghoshPaidReceipts;

  const mitraShare = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + getSplitMitra(exp), 0);
  const ghoshShare = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + getSplitGhosh(exp), 0);

  const halfShare = totalExpense / 2;

  const mitraBalance = mitraTotalContribution - mitraShare; // negative means owes, positive means gets
  const ghoshBalance = ghoshTotalContribution - ghoshShare;

  // Filter logic
  const filteredExpenses = expenses.filter(e => {
    if (selectedFamilyFilter === 'ALL') return true;
    return e.paidBy === selectedFamilyFilter;
  });

  const filteredTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setDesc(exp.description);
    setAmount(exp.amount.toString());
    setCategory(exp.category === 'ADVANCE' ? 'OTHER' : exp.category);
    setPaidBy(exp.paidBy);
    setTransactionType(exp.type || 'EXPENSE');
    
    // Attempt to parse date string back to YYYY-MM-DD
    const d = new Date(exp.date);
    if (!isNaN(d.getTime())) {
      setDateStr(d.toISOString().split('T')[0]);
    }

    if (exp.type === 'RECEIPT') {
      setSplitType('EQUAL');
    } else {
      const sm = getSplitMitra(exp);
      const sg = getSplitGhosh(exp);
      if (sm === exp.amount && sg === 0) setSplitType('MITRA');
      else if (sg === exp.amount && sm === 0) setSplitType('GHOSH');
      else if (sm === exp.amount / 2 && sg === exp.amount / 2) setSplitType('EQUAL');
      else {
        setSplitType('CUSTOM');
        setCustomSplitMitra(sm.toString());
        setCustomSplitGhosh(sg.toString());
      }
    }

    setIsAddModalOpen(true);
  };

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
    doc.text("MITRA TRAVELS AUTO-LEDGER", margin, 50);
    
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
    const tableData = expenses.map((exp, index) => {
      let splitText = "Both (50/50)";
      if (safeType(exp) === 'RECEIPT') {
        splitText = "Deposit (N/A)";
      } else {
        const sm = getSplitMitra(exp);
        const sg = getSplitGhosh(exp);
        if (sm === exp.amount && sg === 0) splitText = "100% Mitra";
        else if (sg === exp.amount && sm === 0) splitText = "100% Ghosh";
        else if (sm !== exp.amount / 2 || sg !== exp.amount / 2) splitText = `M: ${sm} / G: ${sg}`;
      }

      return [
        (index + 1).toString(),
        exp.date,
        safeType(exp) === 'RECEIPT' ? `[RECEIPT] ${exp.description}` : exp.description,
        exp.paidBy,
        splitText,
        exp.amount.toLocaleString('en-IN')
      ];
    });

    // Footer Row for table
    tableData.push([
      { content: 'GRAND TOTAL', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `INR ${totalExpense.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }
    ] as any);

    autoTable(doc, {
      startY: boxY + boxHeight + 40,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Block 1: Total Expense */}
          <div className="brutal-card p-6 bg-[#FFEDD5]">
            <h3 className="font-mono font-black uppercase tracking-widest text-amber-900 mb-6 flex items-center gap-2">
              <Activity size={20} /> 1. Total Expenses Incurred
            </h3>
            <div className="text-5xl font-black mb-2 text-amber-900">₹{totalExpense.toLocaleString('en-IN')}</div>
            <div className="bg-white border-2 border-black px-3 py-1 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase w-max text-amber-900">
              Across Both Families
            </div>
          </div>

          {/* Block 2: Individual Share */}
          <div className="brutal-card p-6 bg-[#E0E7FF]">
            <h3 className="font-mono font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
              <Wallet size={20} /> 2. Spends List By Family
            </h3>
            <div className="flex flex-col gap-4">
              <div 
                className="flex justify-between items-end border-b-2 border-black pb-2 cursor-pointer hover:bg-blue-200/50 p-2 rounded transition-colors"
                onClick={() => setSelectedFamilyFilter(selectedFamilyFilter === 'Mitra' ? 'ALL' : 'Mitra')}
              >
                <span className="font-bold text-xl uppercase">Mitra Family {selectedFamilyFilter === 'Mitra' && '(Selected)'}</span>
                <span className="font-black text-3xl text-blue-900">₹{mitraShare.toLocaleString('en-IN')}</span>
              </div>
              <div 
                className="flex justify-between items-end cursor-pointer hover:bg-blue-200/50 p-2 rounded transition-colors"
                onClick={() => setSelectedFamilyFilter(selectedFamilyFilter === 'Ghosh' ? 'ALL' : 'Ghosh')}
              >
                <span className="font-bold text-xl uppercase">Ghosh Family {selectedFamilyFilter === 'Ghosh' && '(Selected)'}</span>
                <span className="font-black text-3xl text-blue-900">₹{ghoshShare.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Block 3: Total Contributions (Payments + Receipts) */}
          <div className="brutal-card p-6 bg-[#FEF3C7]">
            <h3 className="font-mono font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
              <ArrowDownRight size={20} /> 3. Total Contributions (Paid)
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end border-b-2 border-black pb-2">
                <span className="font-bold text-xl uppercase">Mitra Family</span>
                <span className="font-black text-3xl">₹{mitraTotalContribution.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-bold text-xl uppercase">Ghosh Family</span>
                <span className="font-black text-3xl">₹{ghoshTotalContribution.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Block 4: Net Dues */}
          <div className="brutal-card p-6 bg-[#ECFCCB]">
            <h3 className="font-mono font-black uppercase tracking-widest text-green-700 mb-6 flex items-center gap-2">
              <Activity size={20} /> 4. Net Dues (Settlement)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_${mitraBalance < 0 ? '#EF4444' : mitraBalance > 0 ? '#10B981' : '#94A3B8'}]`}>
                <div className="font-bold uppercase text-sm mb-2 border-b-2 border-black pb-1">Mitra Family</div>
                <div className={`text-2xl font-black ${mitraBalance < 0 ? 'text-red-600' : mitraBalance > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {mitraBalance < 0 ? `DUES ₹${Math.abs(mitraBalance).toLocaleString('en-IN')}` : mitraBalance > 0 ? `GETS ₹${mitraBalance.toLocaleString('en-IN')}` : 'SETTLED'}
                </div>
              </div>
              <div className={`border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_${ghoshBalance < 0 ? '#EF4444' : ghoshBalance > 0 ? '#10B981' : '#94A3B8'}]`}>
                <div className="font-bold uppercase text-sm mb-2 border-b-2 border-black pb-1">Ghosh Family</div>
                <div className={`text-2xl font-black ${ghoshBalance < 0 ? 'text-red-600' : ghoshBalance > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {ghoshBalance < 0 ? `DUES ₹${Math.abs(ghoshBalance).toLocaleString('en-IN')}` : ghoshBalance > 0 ? `GETS ₹${ghoshBalance.toLocaleString('en-IN')}` : 'SETTLED'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Ledger Table */}
        <div className="brutal-card p-0 overflow-hidden">
          <div className="bg-black text-white p-6 border-b-4 border-black flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h3 className="font-black text-xl uppercase tracking-widest flex items-center gap-4">
                <Wallet size={28} className="text-[var(--accent)]" /> 
                Transaction Log {selectedFamilyFilter !== 'ALL' && `- ${selectedFamilyFilter} Family`}
              </h3>
              {selectedFamilyFilter !== 'ALL' && (
                <div className="text-sm font-mono text-gray-300">
                  Total for this view: ₹{filteredTotal.toLocaleString('en-IN')}
                </div>
              )}
            </div>
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
                  <th className="p-6 font-black border-r-2 border-black">Split</th>
                  <th className="p-6 font-black text-right border-r-2 border-black">Amount</th>
                  <th className="p-6 font-black text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg uppercase">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500 font-mono">No transactions found. Add an expense to begin.</td>
                  </tr>
                ) : (
                  filteredExpenses.map(exp => (
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
                      <td className="p-6 border-r-2 border-black font-mono text-xs">
                        {safeType(exp) === 'RECEIPT' ? (
                          <span className="text-gray-500">N/A</span>
                        ) : (
                          getSplitMitra(exp) === exp.amount && getSplitGhosh(exp) === 0 ? (
                            <span className="text-blue-600 font-black">100% MITRA</span>
                          ) : getSplitGhosh(exp) === exp.amount && getSplitMitra(exp) === 0 ? (
                            <span className="text-blue-600 font-black">100% GHOSH</span>
                          ) : getSplitMitra(exp) === exp.amount / 2 && getSplitGhosh(exp) === exp.amount / 2 ? (
                            <span>50/50 EQUAL</span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-blue-600">M: ₹{getSplitMitra(exp).toLocaleString('en-IN')}</span>
                              <span className="text-blue-600">G: ₹{getSplitGhosh(exp).toLocaleString('en-IN')}</span>
                            </div>
                          )
                        )}
                      </td>
                      <td className="p-6 text-right font-black border-r-2 border-black">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="p-6 text-center flex items-center justify-center gap-4 h-full pt-8">
                        <button 
                          onClick={() => handleEdit(exp)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Transaction"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 size={24} />
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
                <h2 className="font-black text-xl uppercase tracking-widest">{editingId ? 'Edit Transaction' : 'New Transaction'}</h2>
                <button onClick={() => { setIsAddModalOpen(false); setEditingId(null); }} className="hover:text-red-400"><X size={24} /></button>
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {transactionType === 'EXPENSE' && (
                    <div>
                      <label className="block mb-2 font-mono text-xs tracking-widest">Category</label>
                      <select 
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white appearance-none"
                      >
                        <option value="FOOD">FOODING (Meals, Snacks, Water)</option>
                        <option value="TRANS">TRANSPORT (Flights, Cabs, Trains)</option>
                        <option value="HOTEL">HOTEL & STAY</option>
                        <option value="SIGHT">SIGHTSEEING & TICKETS</option>
                        <option value="OTHER">MISC / OTHER</option>
                      </select>
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

                <div>
                  <label className="block mb-2 font-mono text-xs tracking-widest">Item Details (Custom Text Box)</label>
                  <input 
                    type="text" 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    placeholder={transactionType === 'RECEIPT' ? "e.g. Deposit to Trip Fund" : "e.g. Dinner, Breakfast or Water Bisleri etc"}
                  />
                  <p className="text-[10px] text-gray-500 mt-1 font-mono normal-case">Write specific items here so that it is proper.</p>
                </div>

                {transactionType === 'EXPENSE' && (
                  <div className="border-4 border-black p-4 bg-gray-50 mt-2">
                    <label className="block mb-4 font-mono text-xs tracking-widest uppercase">Split Rule (Who Owes)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      <button type="button" onClick={() => setSplitType('EQUAL')} className={`p-2 border-2 border-black text-xs font-black uppercase ${splitType === 'EQUAL' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}>50/50</button>
                      <button type="button" onClick={() => setSplitType('MITRA')} className={`p-2 border-2 border-black text-xs font-black uppercase ${splitType === 'MITRA' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}>Mitra Only</button>
                      <button type="button" onClick={() => setSplitType('GHOSH')} className={`p-2 border-2 border-black text-xs font-black uppercase ${splitType === 'GHOSH' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}>Ghosh Only</button>
                      <button type="button" onClick={() => setSplitType('CUSTOM')} className={`p-2 border-2 border-black text-xs font-black uppercase ${splitType === 'CUSTOM' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}>Custom</button>
                    </div>

                    {splitType === 'CUSTOM' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-mono text-[10px] tracking-widest text-gray-500">Mitra Owe Amount (₹)</label>
                          <input 
                            type="number" 
                            value={customSplitMitra}
                            onChange={e => setCustomSplitMitra(e.target.value)}
                            required
                            min="0"
                            className="w-full border-2 border-black p-2 focus:outline-none focus:border-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm" 
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-mono text-[10px] tracking-widest text-gray-500">Ghosh Owe Amount (₹)</label>
                          <input 
                            type="number" 
                            value={customSplitGhosh}
                            onChange={e => setCustomSplitGhosh(e.target.value)}
                            required
                            min="0"
                            className="w-full border-2 border-black p-2 focus:outline-none focus:border-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm" 
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button type="submit" className="w-full mt-4 bg-[var(--accent)] text-white font-black py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                  {editingId ? 'UPDATE EXPENSE' : 'RECORD EXPENSE'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
