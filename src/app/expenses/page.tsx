'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Plus, ArrowDownRight, Activity, X, Download, Trash2, 
  BookOpen, List, Utensils, Train, Building2, Ticket, Package, Coins, Check 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

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

interface SupabaseExpenseRow {
  id: string;
  date: string;
  description: string;
  category: string;
  paid_by: 'Mitra' | 'Ghosh';
  amount: string | number;
  type?: 'EXPENSE' | 'RECEIPT';
  split_mitra?: string | number;
  split_ghosh?: string | number;
}

function createInvoiceNumber(): string {
  const d = new Date();
  const datePart = d.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = d.getTime().toString().slice(-4);
  return `LEDGER-${datePart}-${timePart}`;
}

function getIssueDate(): string {
  return new Date().toLocaleDateString('en-GB');
}

export default function ExpensesPage() {
  const { user, openLoginModal, loading } = useAuth();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<'ALL' | 'Mitra' | 'Ghosh'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'FOOD' | 'TRANS' | 'HOTEL' | 'SIGHT' | 'OTHER' | 'RECEIPT'>('ALL');
  const [viewMode, setViewMode] = useState<'BOOK' | 'LOG'>('BOOK');

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('OTHER');
  const [paidBy, setPaidBy] = useState<Expense['paidBy']>('Mitra');
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'RECEIPT'>('EXPENSE');
  const [splitType, setSplitType] = useState<'EQUAL' | 'MITRA' | 'GHOSH' | 'CUSTOM'>('EQUAL');
  const [customSplitMitra, setCustomSplitMitra] = useState('');
  const [customSplitGhosh, setCustomSplitGhosh] = useState('');

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formatted: Expense[] = (data as unknown as SupabaseExpenseRow[]).map((d) => ({
          id: d.id,
          date: d.date,
          description: d.description,
          category: d.category,
          paidBy: d.paid_by,
          amount: typeof d.amount === 'string' ? parseFloat(d.amount) : d.amount,
          type: d.type,
          splitMitra: d.split_mitra !== undefined ? (typeof d.split_mitra === 'string' ? parseFloat(d.split_mitra) : d.split_mitra) : undefined,
          splitGhosh: d.split_ghosh !== undefined ? (typeof d.split_ghosh === 'string' ? parseFloat(d.split_ghosh) : d.split_ghosh) : undefined,
        }));
        setExpenses(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch ledger:', err);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadExpenses() {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (!ignore && data) {
          const formatted: Expense[] = (data as unknown as SupabaseExpenseRow[]).map((d) => ({
            id: d.id,
            date: d.date,
            description: d.description,
            category: d.category,
            paidBy: d.paid_by,
            amount: typeof d.amount === 'string' ? parseFloat(d.amount) : d.amount,
            type: d.type,
            splitMitra: d.split_mitra !== undefined ? (typeof d.split_mitra === 'string' ? parseFloat(d.split_mitra) : d.split_mitra) : undefined,
            splitGhosh: d.split_ghosh !== undefined ? (typeof d.split_ghosh === 'string' ? parseFloat(d.split_ghosh) : d.split_ghosh) : undefined,
          }));
          setExpenses(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch ledger:', err);
      }
    }

    loadExpenses();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'FAMILY_HEAD')) {
      openLoginModal();
      router.push('/');
    }
  }, [user, loading, openLoginModal, router]);

  const handleAddExpense = async (e: React.FormEvent) => {
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

    const payload = {
      date: displayDate,
      description: desc,
      category: transactionType === 'RECEIPT' ? 'ADVANCE' : category,
      paid_by: paidBy,
      amount: amt,
      type: transactionType,
      split_mitra: splitMitra,
      split_ghosh: splitGhosh
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('expenses').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('expenses').insert([payload]);
        if (error) throw error;
      }
      
      fetchExpenses();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      alert('Failed to save transaction. Ensure the expenses table exists in Supabase.');
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
  const totalReceipts = expenses.filter(e => safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  
  const mitraPaidExpenses = expenses.filter(e => e.paidBy === 'Mitra' && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const mitraPaidReceipts = expenses.filter(e => e.paidBy === 'Mitra' && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  const mitraTotalContribution = mitraPaidExpenses + mitraPaidReceipts;

  const ghoshPaidExpenses = expenses.filter(e => e.paidBy === 'Ghosh' && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshPaidReceipts = expenses.filter(e => e.paidBy === 'Ghosh' && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  const ghoshTotalContribution = ghoshPaidExpenses + ghoshPaidReceipts;

  const mitraShare = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + getSplitMitra(exp), 0);
  const ghoshShare = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + getSplitGhosh(exp), 0);

  const mitraBalance = mitraTotalContribution - mitraShare; // negative means owes, positive means gets
  const ghoshBalance = ghoshTotalContribution - ghoshShare;

  const categorySpends = {
    FOOD: expenses.filter(e => safeType(e) === 'EXPENSE' && e.category === 'FOOD').reduce((sum, exp) => sum + exp.amount, 0),
    TRANS: expenses.filter(e => safeType(e) === 'EXPENSE' && e.category === 'TRANS').reduce((sum, exp) => sum + exp.amount, 0),
    HOTEL: expenses.filter(e => safeType(e) === 'EXPENSE' && e.category === 'HOTEL').reduce((sum, exp) => sum + exp.amount, 0),
    SIGHT: expenses.filter(e => safeType(e) === 'EXPENSE' && e.category === 'SIGHT').reduce((sum, exp) => sum + exp.amount, 0),
    OTHER: expenses.filter(e => safeType(e) === 'EXPENSE' && !['FOOD', 'TRANS', 'HOTEL', 'SIGHT'].includes(e.category)).reduce((sum, exp) => sum + exp.amount, 0),
    RECEIPT: totalReceipts,
  };

  const matchesCategory = (e: Expense, cat: string) => {
    if (cat === 'ALL') return true;
    if (cat === 'RECEIPT') return safeType(e) === 'RECEIPT';
    if (safeType(e) === 'RECEIPT') return false;
    if (cat === 'OTHER') return !['FOOD', 'TRANS', 'HOTEL', 'SIGHT'].includes(e.category);
    return e.category === cat;
  };

  // Filter logic
  const filteredExpenses = expenses.filter(e => {
    const familyMatch = selectedFamilyFilter === 'ALL' || e.paidBy === selectedFamilyFilter;
    const catMatch = matchesCategory(e, selectedCategoryFilter);
    return familyMatch && catMatch;
  });

  const filteredTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setDesc(exp.description);
    setAmount(exp.amount.toString());
    setCategory(exp.category === 'ADVANCE' ? 'OTHER' : exp.category);
    setPaidBy(exp.paidBy);
    setTransactionType(exp.type || 'EXPENSE');
    
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
    const n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'Only ' : '';
    return str.trim() === '' ? 'Zero Only' : str.trim();
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    // 1. Header Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text("MITRA TRAVELS AUTO-LEDGER", margin, 50);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text("Official General Ledger & Settlement Statement", margin, 65);

    const invoiceNo = createInvoiceNumber();
    const issueDate = getIssueDate();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("SETTLEMENT INVOICE", pageWidth - margin, 50, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoiceNo}`, pageWidth - margin, 65, { align: 'right' });
    doc.text(`Date of Issue: ${issueDate}`, pageWidth - margin, 80, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.line(margin, 95, pageWidth - margin, 95);

    // 2. Summary Section
    const startY = 115;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text("Billed To:", margin, startY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Participating Family Heads", margin, startY + 15);
    doc.text("Families: Mitra Family & Ghosh Family", margin, startY + 30);
    doc.text("Account Status: ACTIVE & RECONCILED", margin, startY + 45);

    const boxWidth = 230;
    const boxHeight = 85;
    const boxX = pageWidth - margin - boxWidth;
    const boxY = startY - 10;
    
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text("NET SETTLEMENT SUMMARY", boxX + 15, boxY + 20);
    
    doc.setFontSize(12);
    doc.setTextColor(26, 26, 36);
    doc.text(`Total Expenditure: INR ${totalExpense.toLocaleString('en-IN')}`, boxX + 15, boxY + 38);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const mStatus = mitraBalance < 0 ? `Owes INR ${Math.abs(mitraBalance).toLocaleString('en-IN')}` : `Gets INR ${mitraBalance.toLocaleString('en-IN')}`;
    const gStatus = ghoshBalance < 0 ? `Owes INR ${Math.abs(ghoshBalance).toLocaleString('en-IN')}` : `Gets INR ${ghoshBalance.toLocaleString('en-IN')}`;
    
    doc.setTextColor(102, 102, 102);
    doc.text(`Mitra Status: ${mitraBalance === 0 ? 'SETTLED' : mStatus}`, boxX + 15, boxY + 56);
    doc.text(`Ghosh Status: ${ghoshBalance === 0 ? 'SETTLED' : gStatus}`, boxX + 15, boxY + 72);

    // 3. Category Breakdown Table (Ledger Accounts Summary)
    const categorySummaryRows: RowInput[] = [
      ['1', 'Fooding & Meals', `INR ${categorySpends.FOOD.toLocaleString('en-IN')}`, `${totalExpense > 0 ? ((categorySpends.FOOD / totalExpense) * 100).toFixed(1) : 0}%`],
      ['2', 'Transport & Travel', `INR ${categorySpends.TRANS.toLocaleString('en-IN')}`, `${totalExpense > 0 ? ((categorySpends.TRANS / totalExpense) * 100).toFixed(1) : 0}%`],
      ['3', 'Hotels & Accommodation', `INR ${categorySpends.HOTEL.toLocaleString('en-IN')}`, `${totalExpense > 0 ? ((categorySpends.HOTEL / totalExpense) * 100).toFixed(1) : 0}%`],
      ['4', 'Sightseeing & Shrines', `INR ${categorySpends.SIGHT.toLocaleString('en-IN')}`, `${totalExpense > 0 ? ((categorySpends.SIGHT / totalExpense) * 100).toFixed(1) : 0}%`],
      ['5', 'Miscellaneous / Other', `INR ${categorySpends.OTHER.toLocaleString('en-IN')}`, `${totalExpense > 0 ? ((categorySpends.OTHER / totalExpense) * 100).toFixed(1) : 0}%`],
      ['6', 'Trip Fund Deposits (Receipts)', `INR ${categorySpends.RECEIPT.toLocaleString('en-IN')}`, 'Deposit'],
      [
        { content: 'GRAND TOTAL EXPENSE', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `INR ${totalExpense.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } },
        { content: '100%', styles: { fontStyle: 'bold' } }
      ]
    ];

    autoTable(doc, {
      startY: boxY + boxHeight + 25,
      head: [['#', 'Ledger Category', 'Total Spent', '% of Budget']],
      body: categorySummaryRows,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229], // Indigo
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 200 },
        2: { halign: 'right', cellWidth: 120 },
        3: { halign: 'center', cellWidth: 80 }
      }
    });

    const categoryTableFinalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || (boxY + boxHeight + 140);

    // 4. Main Itemized Table
    const tableData: RowInput[] = expenses.map((exp, index) => {
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
        exp.category,
        exp.paidBy,
        splitText,
        exp.amount.toLocaleString('en-IN')
      ];
    });

    tableData.push([
      { content: 'GRAND TOTAL', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `INR ${totalExpense.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }
    ]);

    autoTable(doc, {
      startY: categoryTableFinalY + 20,
      head: [['S.No', 'Date', 'Description', 'Category', 'Paid By', 'Split Rule', 'Amount (INR)']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [26, 26, 36],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 5,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 55 },
        4: { cellWidth: 50 },
        5: { cellWidth: 70 },
        6: { halign: 'right', cellWidth: 70 }
      },
      didDrawPage: function (data) {
        const pageCount = doc.getNumberOfPages();
        const yPos = pageHeight - 50;
        
        if (data.pageNumber === pageCount) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(51, 51, 51);
          const amtWords = `Amount in Words: INR ${numberToWords(totalExpense)}`;
          doc.text(amtWords, margin, yPos - 15);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text("[System Auto-Generated - Certified Digital Ledger]", pageWidth - margin, yPos - 15, { align: 'right' });
          doc.setFont("helvetica", "bold");
          doc.setTextColor(51, 51, 51);
          doc.text("Audited Family Head Ledger", pageWidth - margin, yPos - 5, { align: 'right' });
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(102, 102, 102);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
      }
    });

    doc.save(`${invoiceNo}.pdf`);
  };

  const LEDGER_ACCOUNTS = [
    { key: 'FOOD', title: 'Fooding & Meals Ledger', icon: <Utensils size={18} />, colorClass: 'text-green-800 bg-[#DCFCE7] border-green-600', total: categorySpends.FOOD },
    { key: 'TRANS', title: 'Transport & Travel Ledger', icon: <Train size={18} />, colorClass: 'text-blue-800 bg-[#DBEAFE] border-blue-600', total: categorySpends.TRANS },
    { key: 'HOTEL', title: 'Hotel & Stay Ledger', icon: <Building2 size={18} />, colorClass: 'text-orange-800 bg-[#FFEDD5] border-orange-600', total: categorySpends.HOTEL },
    { key: 'SIGHT', title: 'Sightseeing & Passes Ledger', icon: <Ticket size={18} />, colorClass: 'text-pink-800 bg-[#FCE7F3] border-pink-600', total: categorySpends.SIGHT },
    { key: 'OTHER', title: 'General & Misc Ledger', icon: <Package size={18} />, colorClass: 'text-purple-800 bg-[#F3E8FF] border-purple-600', total: categorySpends.OTHER },
    { key: 'RECEIPT', title: 'Advances & Deposits Ledger', icon: <Coins size={18} />, colorClass: 'text-emerald-800 bg-[#ECFDF5] border-emerald-600', total: categorySpends.RECEIPT },
  ] as const;

  if (loading || !user || user.role !== 'FAMILY_HEAD') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-mono font-black uppercase text-2xl tracking-tighter animate-pulse">
        Checking Security Clearance...
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-[var(--bg-color)]">
      <div className="container-wide">
        
        {/* Brutalist Header */}
        <div className="mb-16 border-b-4 border-[var(--border-color)] pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="inline-block bg-[var(--surface-contrast)] text-[var(--text-inverse)] px-3 py-1 font-mono text-sm font-bold uppercase mb-6 shadow-[4px_4px_0px_0px_var(--accent)]">
              Double-Entry Accounting Module
            </div>
            <h1 className="heading-hero">Auto-Split & Ledgers</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleGeneratePDF}
              className="brutal-btn bg-[var(--surface-light)] text-[var(--text-primary)] hover:bg-[var(--accent-light)] flex items-center gap-2"
            >
              <Download size={18} /> Export Full Ledger PDF
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="brutal-btn brutal-btn-accent flex items-center gap-2"
            >
              <Plus size={18} /> Record New Entry
            </button>
          </div>
        </div>

        {/* Top Accounting Dashboard */}
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
              <Wallet size={20} /> 2. Spends List By Family (Who Owes)
            </h3>
            <div className="flex flex-col gap-4">
              <div 
                className="flex justify-between items-end border-b-2 border-black pb-2 cursor-pointer hover:bg-blue-200/50 p-2 rounded transition-colors"
                onClick={() => setSelectedFamilyFilter(selectedFamilyFilter === 'Mitra' ? 'ALL' : 'Mitra')}
              >
                <span className="font-bold text-xl uppercase">Mitra Family {selectedFamilyFilter === 'Mitra' && '(Filter Active)'}</span>
                <span className="font-black text-3xl text-blue-900">₹{mitraShare.toLocaleString('en-IN')}</span>
              </div>
              <div 
                className="flex justify-between items-end cursor-pointer hover:bg-blue-200/50 p-2 rounded transition-colors"
                onClick={() => setSelectedFamilyFilter(selectedFamilyFilter === 'Ghosh' ? 'ALL' : 'Ghosh')}
              >
                <span className="font-bold text-xl uppercase">Ghosh Family {selectedFamilyFilter === 'Ghosh' && '(Filter Active)'}</span>
                <span className="font-black text-3xl text-blue-900">₹{ghoshShare.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Block 3: Total Contributions (Payments + Receipts) */}
          <div className="brutal-card p-6 bg-[#FEF3C7]">
            <h3 className="font-mono font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
              <ArrowDownRight size={20} /> 3. Total Cash Outflow (Paid By)
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
              <Activity size={20} /> 4. Net Dues (Final Settlement)
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

          {/* Block 5: Category Wise Spends (Clickable to Filter) */}
          <div className="brutal-card p-6 bg-[#F3E8FF] md:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-mono font-black uppercase tracking-widest text-purple-900 flex items-center gap-2">
                <Activity size={20} /> 5. Category Wise Ledger Summaries
              </h3>
              <span className="font-mono text-xs font-bold text-purple-700 bg-purple-200 px-3 py-1 border border-purple-400">
                Click any category box below to filter that ledger
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div 
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'FOOD' ? 'ALL' : 'FOOD')}
                className={`border-4 border-black p-4 bg-white cursor-pointer transition-all hover:-translate-y-1 ${selectedCategoryFilter === 'FOOD' ? 'ring-4 ring-green-600 bg-green-50 shadow-[6px_6px_0px_0px_#16A34A]' : 'shadow-[4px_4px_0px_0px_#16A34A]'}`}
              >
                <div className="font-bold uppercase text-xs mb-2 border-b-2 border-black pb-1 flex justify-between items-center text-green-800">
                  <span>🍲 Food</span>
                  {selectedCategoryFilter === 'FOOD' && <Check size={14} className="text-green-700" />}
                </div>
                <div className="text-xl font-black text-green-700">₹{categorySpends.FOOD.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase">Meals & Snacks</div>
              </div>

              <div 
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'TRANS' ? 'ALL' : 'TRANS')}
                className={`border-4 border-black p-4 bg-white cursor-pointer transition-all hover:-translate-y-1 ${selectedCategoryFilter === 'TRANS' ? 'ring-4 ring-blue-600 bg-blue-50 shadow-[6px_6px_0px_0px_#2563EB]' : 'shadow-[4px_4px_0px_0px_#2563EB]'}`}
              >
                <div className="font-bold uppercase text-xs mb-2 border-b-2 border-black pb-1 flex justify-between items-center text-blue-800">
                  <span>🚆 Transport</span>
                  {selectedCategoryFilter === 'TRANS' && <Check size={14} className="text-blue-700" />}
                </div>
                <div className="text-xl font-black text-blue-700">₹{categorySpends.TRANS.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase">Cabs, Trains</div>
              </div>

              <div 
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'HOTEL' ? 'ALL' : 'HOTEL')}
                className={`border-4 border-black p-4 bg-white cursor-pointer transition-all hover:-translate-y-1 ${selectedCategoryFilter === 'HOTEL' ? 'ring-4 ring-orange-600 bg-orange-50 shadow-[6px_6px_0px_0px_#EA580C]' : 'shadow-[4px_4px_0px_0px_#EA580C]'}`}
              >
                <div className="font-bold uppercase text-xs mb-2 border-b-2 border-black pb-1 flex justify-between items-center text-orange-800">
                  <span>🏨 Hotel</span>
                  {selectedCategoryFilter === 'HOTEL' && <Check size={14} className="text-orange-700" />}
                </div>
                <div className="text-xl font-black text-orange-700">₹{categorySpends.HOTEL.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase">Rooms & Stays</div>
              </div>

              <div 
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'SIGHT' ? 'ALL' : 'SIGHT')}
                className={`border-4 border-black p-4 bg-white cursor-pointer transition-all hover:-translate-y-1 ${selectedCategoryFilter === 'SIGHT' ? 'ring-4 ring-pink-600 bg-pink-50 shadow-[6px_6px_0px_0px_#DB2777]' : 'shadow-[4px_4px_0px_0px_#DB2777]'}`}
              >
                <div className="font-bold uppercase text-xs mb-2 border-b-2 border-black pb-1 flex justify-between items-center text-pink-800">
                  <span>🏛️ Sightseeing</span>
                  {selectedCategoryFilter === 'SIGHT' && <Check size={14} className="text-pink-700" />}
                </div>
                <div className="text-xl font-black text-pink-700">₹{categorySpends.SIGHT.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase">Passes, Shrines</div>
              </div>

              <div 
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'OTHER' ? 'ALL' : 'OTHER')}
                className={`border-4 border-black p-4 bg-white cursor-pointer transition-all hover:-translate-y-1 ${selectedCategoryFilter === 'OTHER' ? 'ring-4 ring-purple-600 bg-purple-50 shadow-[6px_6px_0px_0px_#9333EA]' : 'shadow-[4px_4px_0px_0px_#9333EA]'}`}
              >
                <div className="font-bold uppercase text-xs mb-2 border-b-2 border-black pb-1 flex justify-between items-center text-purple-800">
                  <span>📦 Other</span>
                  {selectedCategoryFilter === 'OTHER' && <Check size={14} className="text-purple-700" />}
                </div>
                <div className="text-xl font-black text-purple-700">₹{categorySpends.OTHER.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase">General Misc</div>
              </div>

              <div 
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'RECEIPT' ? 'ALL' : 'RECEIPT')}
                className={`border-4 border-black p-4 bg-white cursor-pointer transition-all hover:-translate-y-1 ${selectedCategoryFilter === 'RECEIPT' ? 'ring-4 ring-emerald-600 bg-emerald-50 shadow-[6px_6px_0px_0px_#059669]' : 'shadow-[4px_4px_0px_0px_#059669]'}`}
              >
                <div className="font-bold uppercase text-xs mb-2 border-b-2 border-black pb-1 flex justify-between items-center text-emerald-800">
                  <span>💰 Deposits</span>
                  {selectedCategoryFilter === 'RECEIPT' && <Check size={14} className="text-emerald-700" />}
                </div>
                <div className="text-xl font-black text-emerald-700">₹{categorySpends.RECEIPT.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 uppercase">Advances/Fund</div>
              </div>
            </div>
          </div>
        </div>

        {/* LEDGER NAVIGATION & CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-wider">Accounting View:</span>
            <div className="flex border-2 border-black p-1 bg-gray-100">
              <button
                onClick={() => setViewMode('BOOK')}
                className={`px-4 py-2 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all ${viewMode === 'BOOK' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-gray-200 text-black'}`}
              >
                <BookOpen size={16} /> Ledger Book View
              </button>
              <button
                onClick={() => setViewMode('LOG')}
                className={`px-4 py-2 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all ${viewMode === 'LOG' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-gray-200 text-black'}`}
              >
                <List size={16} /> Unified Chronological Log
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-wider">Filter Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value as typeof selectedCategoryFilter)}
              className="border-2 border-black p-2 font-mono text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD">Fooding (₹{categorySpends.FOOD.toLocaleString('en-IN')})</option>
              <option value="TRANS">Transport (₹{categorySpends.TRANS.toLocaleString('en-IN')})</option>
              <option value="HOTEL">Hotels (₹{categorySpends.HOTEL.toLocaleString('en-IN')})</option>
              <option value="SIGHT">Sightseeing (₹{categorySpends.SIGHT.toLocaleString('en-IN')})</option>
              <option value="OTHER">Misc / Other (₹{categorySpends.OTHER.toLocaleString('en-IN')})</option>
              <option value="RECEIPT">Deposits / Advances (₹{categorySpends.RECEIPT.toLocaleString('en-IN')})</option>
            </select>

            <span className="font-mono text-xs font-black uppercase tracking-wider ml-2">Family:</span>
            <select
              value={selectedFamilyFilter}
              onChange={(e) => setSelectedFamilyFilter(e.target.value as typeof selectedFamilyFilter)}
              className="border-2 border-black p-2 font-mono text-xs font-bold bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
            >
              <option value="ALL">All Families</option>
              <option value="Mitra">Mitra Family Only</option>
              <option value="Ghosh">Ghosh Family Only</option>
            </select>

            {(selectedCategoryFilter !== 'ALL' || selectedFamilyFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSelectedCategoryFilter('ALL');
                  setSelectedFamilyFilter('ALL');
                }}
                className="font-mono text-xs font-bold bg-red-100 text-red-800 border-2 border-red-800 px-3 py-2 hover:bg-red-200 transition-colors uppercase"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── VIEW 1: AUTHENTIC LEDGER BOOK (CATEGORIZED ACCOUNTS) ── */}
        {viewMode === 'BOOK' && (
          <div className="flex flex-col gap-12">
            {LEDGER_ACCOUNTS.map((account) => {
              if (selectedCategoryFilter !== 'ALL' && selectedCategoryFilter !== account.key) {
                return null;
              }

              const accountEntries = expenses.filter(e => {
                const familyMatch = selectedFamilyFilter === 'ALL' || e.paidBy === selectedFamilyFilter;
                const catMatch = matchesCategory(e, account.key);
                return familyMatch && catMatch;
              });

              const accountSubtotal = accountEntries.reduce((sum, e) => sum + e.amount, 0);
              const mitraAccountPaid = accountEntries.filter(e => e.paidBy === 'Mitra').reduce((sum, e) => sum + e.amount, 0);
              const ghoshAccountPaid = accountEntries.filter(e => e.paidBy === 'Ghosh').reduce((sum, e) => sum + e.amount, 0);

              return (
                <div key={account.key} className="brutal-card p-0 overflow-hidden bg-white">
                  {/* Account Ledger Header */}
                  <div className={`p-6 border-b-4 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${account.colorClass}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        {account.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-2xl uppercase tracking-wider">{account.title}</h3>
                        <p className="font-mono text-xs font-bold uppercase opacity-80">
                          Account Ledger Code: AC-{account.key} • {accountEntries.length} {accountEntries.length === 1 ? 'Entry' : 'Entries'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white/90 p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-right">
                        <div className="font-mono text-[10px] font-bold text-gray-500 uppercase">Ledger Subtotal</div>
                        <div className="font-black text-2xl text-black">₹{accountSubtotal.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="border-l-2 border-black pl-4 font-mono text-xs font-bold flex flex-col gap-1 text-black">
                        <div>Mitra Paid: <span className="font-black">₹{mitraAccountPaid.toLocaleString('en-IN')}</span></div>
                        <div>Ghosh Paid: <span className="font-black">₹{ghoshAccountPaid.toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Ledger Account Entries Table */}
                  <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F4F4F5] font-mono text-xs tracking-widest uppercase border-b-2 border-black">
                          <th className="p-4 font-black border-r-2 border-black w-32">Date</th>
                          <th className="p-4 font-black border-r-2 border-black">Particulars / Description</th>
                          <th className="p-4 font-black border-r-2 border-black w-36">Disbursed By</th>
                          <th className="p-4 font-black border-r-2 border-black w-48">Liability Split</th>
                          <th className="p-4 font-black text-right border-r-2 border-black w-44">Amount (INR)</th>
                          <th className="p-4 font-black text-center w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold text-base uppercase">
                        {accountEntries.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-400 font-mono text-sm normal-case">
                              No entries logged under this category ledger yet. Click &quot;Record New Entry&quot; to post spends.
                            </td>
                          </tr>
                        ) : (
                          accountEntries.map((exp) => (
                            <tr key={exp.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                              <td className="p-4 border-r-2 border-black font-mono text-sm text-gray-700">{exp.date}</td>
                              <td className="p-4 border-r-2 border-black">
                                <div className="flex items-center gap-2">
                                  {safeType(exp) === 'RECEIPT' && <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-mono">CREDIT</span>}
                                  <span>{exp.description}</span>
                                </div>
                              </td>
                              <td className="p-4 border-r-2 border-black font-mono text-sm">{exp.paidBy} Family</td>
                              <td className="p-4 border-r-2 border-black font-mono text-xs">
                                {safeType(exp) === 'RECEIPT' ? (
                                  <span className="text-gray-400 font-normal">Trip Fund Deposit</span>
                                ) : (
                                  getSplitMitra(exp) === exp.amount && getSplitGhosh(exp) === 0 ? (
                                    <span className="text-blue-600 font-black">100% MITRA</span>
                                  ) : getSplitGhosh(exp) === exp.amount && getSplitMitra(exp) === 0 ? (
                                    <span className="text-blue-600 font-black">100% GHOSH</span>
                                  ) : getSplitMitra(exp) === exp.amount / 2 && getSplitGhosh(exp) === exp.amount / 2 ? (
                                    <span className="text-emerald-700">50/50 EQUAL</span>
                                  ) : (
                                    <div className="flex flex-col">
                                      <span className="text-blue-600">M: ₹{getSplitMitra(exp).toLocaleString('en-IN')}</span>
                                      <span className="text-blue-600">G: ₹{getSplitGhosh(exp).toLocaleString('en-IN')}</span>
                                    </div>
                                  )
                                )}
                              </td>
                              <td className="p-4 text-right font-black border-r-2 border-black text-lg">₹{exp.amount.toLocaleString('en-IN')}</td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleEdit(exp)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Edit Entry"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (!confirm('Are you sure you want to delete this transaction entry?')) return;
                                      try {
                                        const { error } = await supabase.from('expenses').delete().eq('id', exp.id);
                                        if (error) throw error;
                                        fetchExpenses();
                                      } catch (err) {
                                        console.error('Delete failed:', err);
                                        alert('Delete failed');
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="Delete Entry"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                        {accountEntries.length > 0 && (
                          <tr className="bg-gray-100 font-mono text-sm border-t-2 border-black">
                            <td colSpan={4} className="p-4 text-right font-black border-r-2 border-black uppercase tracking-wider">
                              Subtotal for {account.title}:
                            </td>
                            <td className="p-4 text-right font-black border-r-2 border-black text-xl text-black">
                              ₹{accountSubtotal.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4"></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VIEW 2: UNIFIED CHRONOLOGICAL TRANSACTION LOG ── */}
        {viewMode === 'LOG' && (
          <div className="brutal-card p-0 overflow-hidden bg-white">
            <div className="bg-black text-white p-6 border-b-4 border-black flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-xl uppercase tracking-widest flex items-center gap-4">
                  <Wallet size={28} className="text-[var(--accent)]" /> 
                  Unified Transaction Log 
                  {selectedFamilyFilter !== 'ALL' && ` • ${selectedFamilyFilter} Family`}
                  {selectedCategoryFilter !== 'ALL' && ` • Category: ${selectedCategoryFilter}`}
                </h3>
                <div className="text-sm font-mono text-gray-300">
                  Total for this view: ₹{filteredTotal.toLocaleString('en-IN')} ({filteredExpenses.length} entries)
                </div>
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
                    <th className="p-6 font-black border-r-2 border-black">Split Rule</th>
                    <th className="p-6 font-black text-right border-r-2 border-black">Amount</th>
                    <th className="p-6 font-black text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-lg uppercase">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-gray-500 font-mono">
                        No transactions found matching current filters.
                      </td>
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
                        <td className="p-6 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <button 
                              onClick={() => handleEdit(exp)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit Transaction"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button 
                              onClick={async () => {
                                if (!confirm('Are you sure you want to delete this transaction?')) return;
                                try {
                                  const { error } = await supabase.from('expenses').delete().eq('id', exp.id);
                                  if (error) throw error;
                                  fetchExpenses();
                                } catch (err) {
                                  console.error('Delete failed:', err);
                                  alert('Delete failed');
                                }
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Transaction"
                            >
                              <Trash2 size={22} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Expense Modal */}
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
                <h2 className="font-black text-xl uppercase tracking-widest">{editingId ? 'Edit Ledger Entry' : 'Record New Ledger Entry'}</h2>
                <button onClick={() => { setIsAddModalOpen(false); setEditingId(null); }} className="hover:text-red-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddExpense} className="p-6 flex flex-col gap-6 font-bold uppercase text-sm">
                
                <div className="flex gap-4 mb-2">
                  <button type="button" onClick={() => setTransactionType('EXPENSE')} className={`flex-1 p-3 border-2 border-black font-black uppercase ${transactionType === 'EXPENSE' ? 'bg-[var(--accent)] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 hover:bg-gray-200'}`}>EXPENSE (DEBIT)</button>
                  <button type="button" onClick={() => setTransactionType('RECEIPT')} className={`flex-1 p-3 border-2 border-black font-black uppercase ${transactionType === 'RECEIPT' ? 'bg-green-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 hover:bg-gray-200'}`}>DEPOSIT (CREDIT)</button>
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
                      <label className="block mb-2 font-mono text-xs tracking-widest">Category Account</label>
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
                    <label className="block mb-2 font-mono text-xs tracking-widest">Disbursed / Paid By</label>
                    <select 
                      value={paidBy}
                      onChange={e => setPaidBy(e.target.value as 'Mitra' | 'Ghosh')}
                      className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white appearance-none"
                    >
                      <option value="Mitra">Mitra Family</option>
                      <option value="Ghosh">Ghosh Family</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-mono text-xs tracking-widest">Particulars / Item Details</label>
                  <input 
                    type="text" 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                    className="w-full border-2 border-black p-3 focus:outline-none focus:border-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    placeholder={transactionType === 'RECEIPT' ? "e.g. Deposit to Trip Fund" : "e.g. Dinner, Breakfast, Train snacks, Water Bisleri"}
                  />
                  <p className="text-[10px] text-gray-500 mt-1 font-mono normal-case">Write detailed particulars for accurate ledger accounting.</p>
                </div>

                {transactionType === 'EXPENSE' && (
                  <div className="border-4 border-black p-4 bg-gray-50 mt-2">
                    <label className="block mb-4 font-mono text-xs tracking-widest uppercase">Split Liability (Who Owes)</label>
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
                  {editingId ? 'UPDATE LEDGER ENTRY' : 'POST ENTRY TO LEDGER'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
