'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, Plus, ArrowDownRight, Activity, X, Download, Trash2, 
  BookOpen, List, Utensils, Train, Building2, Ticket, Package, Coins, Check,
  ArrowRight, ShieldCheck, ChevronDown, RefreshCw, FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useTripData } from '@/context/TripDataContext';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; label: string; rate: number; flag: string }> = {
  INR: { symbol: '₹', label: 'INR', rate: 1, flag: '🇮🇳' },
  USD: { symbol: '$', label: 'USD', rate: 0.012, flag: '🇺🇸' },
  EUR: { symbol: '€', label: 'EUR', rate: 0.011, flag: '🇪🇺' },
  GBP: { symbol: '£', label: 'GBP', rate: 0.0095, flag: '🇬🇧' },
  AED: { symbol: 'AED', label: 'AED', rate: 0.044, flag: '🇦🇪' },
};

type Expense = {
  id: string;
  date: string;
  description: string;
  category: string;
  paidBy: string;
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
  paid_by: string;
  amount: string | number;
  type?: 'EXPENSE' | 'RECEIPT';
  split_mitra?: string | number;
  split_ghosh?: string | number;
}

interface NormalizedFamily {
  id: string;
  name: string;
  fullName: string;
  head: string;
  email: string;
  avatar: string;
  color: string;
}

interface FamilyBalance extends NormalizedFamily {
  totalContributed: number;
  share: number;
  netBalance: number;
}

interface MinimalTransfer {
  from: string; // debtor
  to: string;   // creditor
  amount: number; // in INR
}

function createInvoiceNumber(prefix = 'LEDGER'): string {
  const d = new Date();
  const datePart = d.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = d.getTime().toString().slice(-4);
  return `${prefix}-${datePart}-${timePart}`;
}

function getIssueDate(): string {
  return new Date().toLocaleDateString('en-GB');
}

export default function ExpensesPage() {
  const { user, openLoginModal, loading } = useAuth();
  const router = useRouter();
  const { families } = useTripData();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'FOOD' | 'TRANS' | 'HOTEL' | 'SIGHT' | 'OTHER' | 'RECEIPT'>('ALL');
  const [viewMode, setViewMode] = useState<'BOOK' | 'LOG'>('BOOK');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');
  const [isCategoryPdfMenuOpen, setIsCategoryPdfMenuOpen] = useState(false);
  const pdfMenuRef = useRef<HTMLDivElement>(null);

  // Form states
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('OTHER');
  const [paidBy, setPaidBy] = useState<string>('Mitra');
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'RECEIPT'>('EXPENSE');
  const [splitType, setSplitType] = useState<'EQUAL' | 'MITRA' | 'GHOSH' | 'CUSTOM'>('EQUAL');
  const [customSplitMitra, setCustomSplitMitra] = useState('');
  const [customSplitGhosh, setCustomSplitGhosh] = useState('');

  // Close category PDF menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(event.target as Node)) {
        setIsCategoryPdfMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFamilies: NormalizedFamily[] = (families && families.length > 0 ? families : [
    { id: 'mitra', family: 'Mitra Family', head: 'Asim Kumar Mitra', email: 'asimkrmitra@gmail.com', avatar: 'AKM', color: '#10B981' },
    { id: 'ghosh', family: 'Ghosh Family', head: 'Pranab Ghosh', email: 'pranabghosh@gmail.com', avatar: 'PG', color: '#3B82F6' },
  ]).map((f: { id?: string; family?: string; name?: string; head?: string; email?: string; avatar?: string; color?: string }) => {
    const rawName = f.name || (f.family ? f.family.replace(/\s*Family$/i, '').trim() : 'Family');
    return {
      id: f.id || rawName.toLowerCase(),
      name: rawName,
      fullName: f.family || `${rawName} Family`,
      head: f.head || '',
      email: f.email || '',
      avatar: f.avatar || rawName.slice(0, 2).toUpperCase(),
      color: f.color || '#3B82F6',
    };
  });

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
        if (Math.abs(splitMitra + splitGhosh - amt) > 0.01) {
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

  // Currency Formatter
  const formatCur = (amountINR: number, currency: Currency = selectedCurrency): string => {
    const { symbol, rate } = CURRENCY_CONFIG[currency];
    const converted = amountINR * rate;
    if (currency === 'INR') {
      return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculations
  const safeType = (e: Expense) => e.type || 'EXPENSE';

  const getSplitMitra = (e: Expense) => e.splitMitra !== undefined ? e.splitMitra : (safeType(e) === 'EXPENSE' ? e.amount / 2 : 0);
  const getSplitGhosh = (e: Expense) => e.splitGhosh !== undefined ? e.splitGhosh : (safeType(e) === 'EXPENSE' ? e.amount / 2 : 0);

  const totalExpense = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
  const totalReceipts = expenses.filter(e => safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calculate dynamically per family
  const familyBalances: FamilyBalance[] = activeFamilies.map(fam => {
    const paidExpenses = expenses.filter(e => e.paidBy.toLowerCase() === fam.name.toLowerCase() && safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + exp.amount, 0);
    const paidReceipts = expenses.filter(e => e.paidBy.toLowerCase() === fam.name.toLowerCase() && safeType(e) === 'RECEIPT').reduce((sum, exp) => sum + exp.amount, 0);
    const totalContributed = paidExpenses + paidReceipts;

    let share = 0;
    if (fam.name.toLowerCase() === 'mitra') {
      share = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + getSplitMitra(exp), 0);
    } else if (fam.name.toLowerCase() === 'ghosh') {
      share = expenses.filter(e => safeType(e) === 'EXPENSE').reduce((sum, exp) => sum + getSplitGhosh(exp), 0);
    } else {
      // General N-family fallback
      share = totalExpense / Math.max(1, activeFamilies.length);
    }

    const netBalance = totalContributed - share; // positive = gets, negative = owes

    return {
      ...fam,
      totalContributed,
      share,
      netBalance: Math.round(netBalance * 100) / 100
    };
  });

  const mitraData = familyBalances.find(f => f.name.toLowerCase() === 'mitra') || {
    totalContributed: 0,
    share: 0,
    netBalance: 0
  };

  const ghoshData = familyBalances.find(f => f.name.toLowerCase() === 'ghosh') || {
    totalContributed: 0,
    share: 0,
    netBalance: 0
  };

  // Greedy Graph Debt Minimization Algorithm (Bipartite Min-Cash-Flow matching)
  const computeMinimalTransfers = (): MinimalTransfer[] => {
    const debtors = familyBalances
      .filter(f => f.netBalance < -0.01)
      .map(f => ({ name: f.name, debt: -f.netBalance }))
      .sort((a, b) => b.debt - a.debt);

    const creditors = familyBalances
      .filter(f => f.netBalance > 0.01)
      .map(f => ({ name: f.name, credit: f.netBalance }))
      .sort((a, b) => b.credit - a.credit);

    const transfers: MinimalTransfer[] = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const settled = Math.min(debtor.debt, creditor.credit);

      if (settled > 0.01) {
        transfers.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(settled * 100) / 100
        });
      }

      debtor.debt -= settled;
      creditor.credit -= settled;

      if (debtor.debt < 0.01) d++;
      if (creditor.credit < 0.01) c++;
    }

    return transfers;
  };

  const minimalTransfers = computeMinimalTransfers();

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
    const familyMatch = selectedFamilyFilter === 'ALL' || e.paidBy.toLowerCase() === selectedFamilyFilter.toLowerCase();
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

    const numStr = Math.round(num).toString();
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

  // High-fidelity itemized PDF generation (Full Ledger or Category-Specific)
  const handleGeneratePDF = (targetCategory?: string) => {
    const isCategorySpecific = Boolean(targetCategory && targetCategory !== 'ALL');
    const catCode = isCategorySpecific ? (targetCategory as string) : 'ALL';

    const CATEGORY_TITLES: Record<string, string> = {
      FOOD: 'Fooding & Meals Account',
      TRANS: 'Transportation & Travel Account',
      HOTEL: 'Hotels & Accommodation Account',
      SIGHT: 'Sightseeing & Attractions Account',
      OTHER: 'General & Miscellaneous Account',
      RECEIPT: 'Trip Fund Advances & Deposits',
    };

    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const invoiceNo = isCategorySpecific ? createInvoiceNumber(`INV-${catCode}`) : createInvoiceNumber('LEDGER');
    const issueDate = getIssueDate();

    // 1. Header Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(26, 26, 36);
    doc.text('TRAVEL FLEET EXPEDITION AUDIT', margin, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(
      isCategorySpecific
        ? `Official Itemized Category Statement: ${CATEGORY_TITLES[catCode] || catCode}`
        : 'Official General Double-Entry Ledger & Settlement Statement',
      margin,
      65
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 36);
    doc.text(
      isCategorySpecific ? 'CATEGORY BILL' : 'SETTLEMENT INVOICE',
      pageWidth - margin,
      50,
      { align: 'right' }
    );
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref No: ${invoiceNo}`, pageWidth - margin, 65, { align: 'right' });
    doc.text(`Date of Issue: ${issueDate}`, pageWidth - margin, 78, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.line(margin, 92, pageWidth - margin, 92);

    // 2. Summary Section
    const startY = 112;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text('Audited Entities:', margin, startY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Participating Expedition Families', margin, startY + 15);
    const familyNames = activeFamilies.map(f => `${f.name} Family`).join(', ');
    doc.text(`Fleet Units: ${familyNames}`, margin, startY + 28);
    doc.text('Reconciliation Status: CERTIFIED & ACTIVE', margin, startY + 41);

    const boxWidth = 240;
    const boxHeight = 85;
    const boxX = pageWidth - margin - boxWidth;
    const boxY = startY - 8;
    
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);
    doc.text(
      isCategorySpecific ? `${catCode} EXPENDITURE SUMMARY` : 'NET SETTLEMENT MATRIX SUMMARY',
      boxX + 12,
      boxY + 18
    );
    
    const targetExpenses = isCategorySpecific
      ? expenses.filter(e => matchesCategory(e, catCode))
      : expenses;
    const targetTotal = targetExpenses
      .filter(e => isCategorySpecific ? true : safeType(e) === 'EXPENSE')
      .reduce((sum, e) => sum + e.amount, 0);

    doc.setFontSize(11);
    doc.setTextColor(26, 26, 36);
    doc.text(`Total Amount: INR ${targetTotal.toLocaleString('en-IN')}`, boxX + 12, boxY + 36);
    
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);

    if (isCategorySpecific) {
      const catMitraPaid = targetExpenses.filter(e => e.paidBy.toLowerCase() === 'mitra').reduce((s, e) => s + e.amount, 0);
      const catGhoshPaid = targetExpenses.filter(e => e.paidBy.toLowerCase() === 'ghosh').reduce((s, e) => s + e.amount, 0);
      doc.text(`Mitra Outflow: INR ${catMitraPaid.toLocaleString('en-IN')}`, boxX + 12, boxY + 54);
      doc.text(`Ghosh Outflow: INR ${catGhoshPaid.toLocaleString('en-IN')}`, boxX + 12, boxY + 70);
    } else {
      const mStatus = mitraData.netBalance < 0 
        ? `Owes INR ${Math.abs(mitraData.netBalance).toLocaleString('en-IN')}` 
        : `Gets INR ${mitraData.netBalance.toLocaleString('en-IN')}`;
      const gStatus = ghoshData.netBalance < 0 
        ? `Owes INR ${Math.abs(ghoshData.netBalance).toLocaleString('en-IN')}` 
        : `Gets INR ${ghoshData.netBalance.toLocaleString('en-IN')}`;
      doc.text(`Mitra Status: ${mitraData.netBalance === 0 ? 'SETTLED' : mStatus}`, boxX + 12, boxY + 54);
      doc.text(`Ghosh Status: ${ghoshData.netBalance === 0 ? 'SETTLED' : gStatus}`, boxX + 12, boxY + 70);
    }

    let nextTableStartY = boxY + boxHeight + 20;

    // 3. Category Breakdown Table (Only on full ledger export)
    if (!isCategorySpecific) {
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
        startY: nextTableStartY,
        head: [['#', 'Ledger Category', 'Total Spent', '% of Budget']],
        body: categorySummaryRows,
        theme: 'grid',
        headStyles: {
          fillColor: [37, 99, 235], // Accent blue
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

      nextTableStartY = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || (boxY + boxHeight + 140)) + 20;
    }

    // 4. Itemized Expenses Table
    const tableData: RowInput[] = targetExpenses.map((exp, index) => {
      let splitText = 'Both (50/50)';
      if (safeType(exp) === 'RECEIPT') {
        splitText = 'Deposit (N/A)';
      } else {
        const sm = getSplitMitra(exp);
        const sg = getSplitGhosh(exp);
        if (sm === exp.amount && sg === 0) splitText = '100% Mitra';
        else if (sg === exp.amount && sm === 0) splitText = '100% Ghosh';
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
      { content: 'SUBTOTAL FOR THIS STATEMENT', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `INR ${targetTotal.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }
    ]);

    autoTable(doc, {
      startY: nextTableStartY,
      head: [['S.No', 'Date', 'Description / Particulars', 'Category', 'Disbursed By', 'Split Rule', 'Amount (INR)']],
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
        0: { cellWidth: 28 },
        1: { cellWidth: 48 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 55 },
        4: { cellWidth: 55 },
        5: { cellWidth: 72 },
        6: { halign: 'right', cellWidth: 70 }
      },
      didDrawPage: function (data) {
        const pageCount = doc.getNumberOfPages();
        const yPos = pageHeight - 45;
        
        if (data.pageNumber === pageCount) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(51, 51, 51);
          const amtWords = `Amount in Words: INR ${numberToWords(targetTotal)}`;
          doc.text(amtWords, margin, yPos - 12);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(140, 140, 140);
          doc.text('[System Certified Digital Bill - Immutable Audit]', pageWidth - margin, yPos - 12, { align: 'right' });
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(51, 51, 51);
          doc.text('Authorized Expedition Finance Matrix', pageWidth - margin, yPos - 2, { align: 'right' });
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(102, 102, 102);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
      }
    });

    doc.save(`${invoiceNo}.pdf`);
  };

  const LEDGER_ACCOUNTS = [
    { key: 'FOOD', title: 'Fooding & Meals Ledger', icon: <Utensils size={18} />, total: categorySpends.FOOD, color: 'text-emerald-500' },
    { key: 'TRANS', title: 'Transport & Travel Ledger', icon: <Train size={18} />, total: categorySpends.TRANS, color: 'text-blue-500' },
    { key: 'HOTEL', title: 'Hotel & Stay Ledger', icon: <Building2 size={18} />, total: categorySpends.HOTEL, color: 'text-amber-500' },
    { key: 'SIGHT', title: 'Sightseeing & Passes Ledger', icon: <Ticket size={18} />, total: categorySpends.SIGHT, color: 'text-pink-500' },
    { key: 'OTHER', title: 'General & Misc Ledger', icon: <Package size={18} />, total: categorySpends.OTHER, color: 'text-purple-500' },
    { key: 'RECEIPT', title: 'Advances & Deposits Ledger', icon: <Coins size={18} />, total: categorySpends.RECEIPT, color: 'text-teal-500' },
  ] as const;

  if (loading || !user || user.role !== 'FAMILY_HEAD') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-mono font-black uppercase text-2xl tracking-tighter animate-pulse text-[var(--text-primary)]">
        Checking Security Clearance...
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="container-wide">
        
        {/* Brutalist Header */}
        <div className="mb-14 border-b-4 border-[var(--border-color)] pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-block bg-[var(--surface-contrast)] text-[var(--text-inverse)] px-3 py-1 font-mono text-xs font-bold uppercase mb-4 shadow-[3px_3px_0px_0px_var(--accent)]">
              Double-Entry Accounting & Debt Minimization Matrix
            </div>
            <h1 className="heading-hero text-[var(--text-primary)]">Auto-Split & Ledgers</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Multi-Currency Selector Pill Group */}
            <div className="flex items-center border-2 border-[var(--border-color)] bg-[var(--surface-light)] p-1 shadow-[3px_3px_0px_0px_var(--shadow-color)]">
              {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((cur) => {
                const isCurActive = selectedCurrency === cur;
                return (
                  <button
                    key={cur}
                    onClick={() => setSelectedCurrency(cur)}
                    className={`px-2.5 py-1 font-mono text-xs font-black uppercase flex items-center gap-1 transition-all ${
                      isCurActive 
                        ? 'bg-[var(--accent)] text-white shadow-[1px_1px_0px_0px_var(--shadow-color)]' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)]'
                    }`}
                    title={`Switch currency to ${cur}`}
                  >
                    <span>{CURRENCY_CONFIG[cur].flag}</span>
                    <span>{cur}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Bills PDF Dropdown */}
            <div className="relative" ref={pdfMenuRef}>
              <button 
                onClick={() => setIsCategoryPdfMenuOpen(!isCategoryPdfMenuOpen)}
                className="brutal-btn bg-[var(--surface-light)] text-[var(--text-primary)] hover:bg-[var(--accent-light)] flex items-center gap-2"
                title="Download Itemized Category Bills"
              >
                <Download size={16} /> 
                <span>Export PDF</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryPdfMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryPdfMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-[var(--surface-light)] text-[var(--text-primary)] border-2 border-[var(--border-color)] p-2 shadow-[6px_6px_0px_0px_var(--accent)] z-50 font-mono text-xs"
                  >
                    <div className="px-2 py-1.5 font-black uppercase tracking-wider text-[var(--text-muted)] text-[10px] border-b border-[var(--border-color)]/20 mb-1">
                      Choose Statement Scope
                    </div>
                    
                    <button
                      onClick={() => {
                        handleGeneratePDF();
                        setIsCategoryPdfMenuOpen(false);
                      }}
                      className="w-full text-left p-2 font-bold hover:bg-[var(--accent-light)] flex items-center gap-2 border border-transparent hover:border-[var(--border-color)] transition-all"
                    >
                      <FileText size={14} className="text-[var(--accent)]" />
                      <span>Full General Ledger PDF</span>
                    </button>

                    <div className="px-2 pt-2 pb-1 font-black uppercase tracking-wider text-[var(--text-muted)] text-[10px] border-t border-[var(--border-color)]/20 mt-1">
                      Itemized Category Bills
                    </div>

                    {LEDGER_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.key}
                        onClick={() => {
                          handleGeneratePDF(acc.key);
                          setIsCategoryPdfMenuOpen(false);
                        }}
                        className="w-full text-left p-2 font-bold hover:bg-[var(--accent-light)] flex items-center justify-between border border-transparent hover:border-[var(--border-color)] transition-all"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {acc.icon}
                          <span className="truncate">{acc.title.replace(' Ledger', '')}</span>
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">{formatCur(acc.total)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Record Entry CTA */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="brutal-btn brutal-btn-accent flex items-center gap-2"
            >
              <Plus size={18} /> Record Entry
            </button>
          </div>
        </div>

        {/* ── HIGH-CONTRAST THEMED ACCOUNTING DASHBOARD ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Block 1: Total Expense */}
          <div className="brutal-card p-6 bg-[var(--surface-light)] border-2 border-[var(--border-color)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
            <h3 className="font-mono font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
              <Activity size={18} className="text-amber-500" /> 1. Total Expenses Incurred
            </h3>
            <div className="text-4xl sm:text-5xl font-black mb-3 text-[var(--text-primary)]">
              {formatCur(totalExpense)}
            </div>
            <div className="inline-block bg-[var(--surface-contrast)] text-[var(--text-inverse)] px-3 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_var(--shadow-color)]">
              Across {activeFamilies.length} Registered {activeFamilies.length === 1 ? 'Family' : 'Families'}
            </div>
          </div>

          {/* Block 2: Individual Share */}
          <div className="brutal-card p-6 bg-[var(--surface-light)] border-2 border-[var(--border-color)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500" />
            <h3 className="font-mono font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
              <Wallet size={18} className="text-blue-500" /> 2. Spends List By Family (Who Owes)
            </h3>
            <div className="flex flex-col gap-3">
              {familyBalances.map(fam => {
                const isFamActive = selectedFamilyFilter.toLowerCase() === fam.name.toLowerCase();
                return (
                  <div 
                    key={fam.name}
                    className={`flex justify-between items-center p-2.5 border-2 border-[var(--border-color)] cursor-pointer transition-all ${
                      isFamActive 
                        ? 'bg-[var(--accent)] text-white shadow-[3px_3px_0px_0px_var(--shadow-color)]' 
                        : 'bg-[var(--bg-color)] hover:bg-[var(--accent-light)] text-[var(--text-primary)]'
                    }`}
                    onClick={() => setSelectedFamilyFilter(isFamActive ? 'ALL' : fam.name)}
                    title="Click to filter by this family"
                  >
                    <span className="font-bold text-sm sm:text-base uppercase flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fam.color }} />
                      {fam.name} Family {isFamActive && '(Filter Active)'}
                    </span>
                    <span className="font-black text-xl sm:text-2xl">
                      {formatCur(fam.share)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Block 3: Total Contributions (Payments + Receipts) */}
          <div className="brutal-card p-6 bg-[var(--surface-light)] border-2 border-[var(--border-color)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            <h3 className="font-mono font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
              <ArrowDownRight size={18} className="text-emerald-500" /> 3. Total Cash Outflow (Paid By)
            </h3>
            <div className="flex flex-col gap-3">
              {familyBalances.map(fam => (
                <div key={fam.name} className="flex justify-between items-center p-2.5 border-2 border-[var(--border-color)] bg-[var(--bg-color)]">
                  <span className="font-bold text-sm sm:text-base uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fam.color }} />
                    {fam.name} Family
                  </span>
                  <span className="font-black text-xl sm:text-2xl text-[var(--text-primary)]">
                    {formatCur(fam.totalContributed)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Block 4: Net Dues */}
          <div className="brutal-card p-6 bg-[var(--surface-light)] border-2 border-[var(--border-color)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500" />
            <h3 className="font-mono font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" /> 4. Net Dues (Reconciled Balance)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {familyBalances.map(fam => {
                const owes = fam.netBalance < -0.01;
                const gets = fam.netBalance > 0.01;
                return (
                  <div 
                    key={fam.name}
                    className={`border-2 border-[var(--border-color)] p-3 bg-[var(--bg-color)] shadow-[3px_3px_0px_0px_var(--shadow-color)]`}
                  >
                    <div className="font-bold uppercase text-xs mb-1.5 border-b border-[var(--border-color)]/30 pb-1 flex justify-between items-center">
                      <span>{fam.name} Family</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                        owes ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                        gets ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                        'bg-zinc-500/10 text-zinc-600 border-zinc-500/30'
                      }`}>
                        {owes ? 'DEBTOR' : gets ? 'CREDITOR' : 'SETTLED'}
                      </span>
                    </div>
                    <div className={`text-xl font-black ${
                      owes ? 'text-red-500' :
                      gets ? 'text-emerald-500' :
                      'text-[var(--text-muted)]'
                    }`}>
                      {owes 
                        ? `OWES ${formatCur(Math.abs(fam.netBalance))}`
                        : gets 
                        ? `GETS ${formatCur(fam.netBalance)}`
                        : 'BALANCED'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BLOCK 5: GREEDY GRAPH DEBT MINIMIZATION MATRIX ── */}
          <div className="brutal-card p-6 bg-[var(--surface-light)] border-2 border-[var(--border-color)] md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-mono font-black uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2 text-lg">
                  <ShieldCheck size={22} className="text-emerald-500" />
                  Graph Debt Minimization Ledger Matrix
                </h3>
                <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
                  Bipartite Min-Cash-Flow Greedily Reconciles Multilateral Balances to ≤ N-1 Optimized Transfers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
                  {minimalTransfers.length === 0 ? '✓ All Accounts Balanced' : `⚡ ${minimalTransfers.length} Optimized Transfer Resolves Full Ledger`}
                </span>
              </div>
            </div>

            {minimalTransfers.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-[var(--border-color)]/40 font-mono text-sm text-[var(--text-muted)]">
                All expedition accounts are fully balanced. No inter-family debt settlement transfers required.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Direct Settlement Flow Cards */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <div className="font-mono text-xs font-black uppercase text-[var(--text-muted)] tracking-wider">
                    Optimal Transfer Paths
                  </div>
                  {minimalTransfers.map((tx, idx) => (
                    <div 
                      key={idx}
                      className="p-4 border-2 border-[var(--border-color)] bg-[var(--bg-color)] shadow-[3px_3px_0px_0px_var(--shadow-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-red-500 text-white font-mono font-black text-xs uppercase border border-[var(--border-color)]">
                          {tx.from}
                        </div>
                        <div className="flex items-center gap-1 text-[var(--text-muted)] font-mono text-xs font-bold">
                          <span>OWES</span>
                          <ArrowRight size={16} className="text-[var(--accent)]" />
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-600 text-white font-mono font-black text-xs uppercase border border-[var(--border-color)]">
                          {tx.to}
                        </div>
                      </div>

                      <div className="text-right flex items-baseline gap-2">
                        <span className="font-mono text-xs text-[var(--text-muted)]">AMOUNT:</span>
                        <span className="text-2xl font-black text-[var(--text-primary)]">
                          {formatCur(tx.amount)}
                        </span>
                        {selectedCurrency !== 'INR' && (
                          <span className="font-mono text-xs text-[var(--text-muted)]">
                            (₹{tx.amount.toLocaleString('en-IN')})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Cross-Settlement Matrix Table */}
                <div className="flex flex-col gap-3">
                  <div className="font-mono text-xs font-black uppercase text-[var(--text-muted)] tracking-wider">
                    Bipartite Settlement Table
                  </div>
                  <div className="border-2 border-[var(--border-color)] overflow-hidden bg-[var(--bg-color)]">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="bg-[var(--surface-contrast)] text-[var(--text-inverse)] border-b-2 border-[var(--border-color)]">
                          <th className="p-2 border-r border-[var(--border-color)]">Debtor (From)</th>
                          <th className="p-2 border-r border-[var(--border-color)]">Creditor (To)</th>
                          <th className="p-2 text-right">Sum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {minimalTransfers.map((tx, i) => (
                          <tr key={i} className="border-b border-[var(--border-color)]/20 last:border-b-0 font-bold">
                            <td className="p-2 border-r border-[var(--border-color)]/20">{tx.from}</td>
                            <td className="p-2 border-r border-[var(--border-color)]/20">{tx.to}</td>
                            <td className="p-2 text-right font-black text-emerald-600 dark:text-emerald-400">
                              {formatCur(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Block 6: Category Wise Spends (Clickable to Filter + Instant PDF Trigger) */}
          <div className="brutal-card p-6 bg-[var(--surface-light)] border-2 border-[var(--border-color)] md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-500" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-mono font-black uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
                <Activity size={20} className="text-purple-500" /> 5. Category Wise Ledger Summaries
              </h3>
              <span className="font-mono text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-color)] border border-[var(--border-color)] px-3 py-1">
                Click any box to filter • Use PDF button to download itemized bill
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {LEDGER_ACCOUNTS.map((acc) => {
                const isSelected = selectedCategoryFilter === acc.key;
                return (
                  <div 
                    key={acc.key}
                    onClick={() => setSelectedCategoryFilter(isSelected ? 'ALL' : acc.key)}
                    className={`border-2 border-[var(--border-color)] p-3 bg-[var(--bg-color)] cursor-pointer transition-all hover:-translate-y-1 relative group ${
                      isSelected 
                        ? 'border-[var(--accent)] ring-2 ring-[var(--accent)] shadow-[4px_4px_0px_0px_var(--accent)]' 
                        : 'shadow-[3px_3px_0px_0px_var(--shadow-color)]'
                    }`}
                  >
                    <div className="font-bold uppercase text-xs mb-1.5 border-b border-[var(--border-color)]/30 pb-1 flex justify-between items-center text-[var(--text-primary)]">
                      <span className="truncate">{acc.title.replace(' Ledger', '')}</span>
                      {isSelected && <Check size={14} className="text-[var(--accent)]" />}
                    </div>
                    <div className="text-lg font-black text-[var(--text-primary)]">
                      {formatCur(acc.total)}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-[var(--border-color)]/20">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                        AC-{acc.key}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePDF(acc.key);
                        }}
                        className="p-1 hover:bg-[var(--accent)] hover:text-white transition-colors border border-[var(--border-color)] text-[var(--text-muted)]"
                        title={`Download ${acc.key} Itemized Bill PDF`}
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── LEDGER NAVIGATION & CONTROLS ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-[var(--surface-light)] p-5 border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--shadow-color)]">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">View:</span>
            <div className="flex border-2 border-[var(--border-color)] p-0.5 bg-[var(--bg-color)]">
              <button
                onClick={() => setViewMode('BOOK')}
                className={`px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === 'BOOK' 
                    ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--shadow-color)]' 
                    : 'hover:bg-[var(--surface-light)] text-[var(--text-primary)]'
                }`}
              >
                <BookOpen size={14} /> Ledger Accounts
              </button>
              <button
                onClick={() => setViewMode('LOG')}
                className={`px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === 'LOG' 
                    ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--shadow-color)]' 
                    : 'hover:bg-[var(--surface-light)] text-[var(--text-primary)]'
                }`}
              >
                <List size={14} /> Chronological Log
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value as typeof selectedCategoryFilter)}
              className="border-2 border-[var(--border-color)] p-2 font-mono text-xs font-bold bg-[var(--surface-light)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_var(--shadow-color)] uppercase"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD">Fooding ({formatCur(categorySpends.FOOD)})</option>
              <option value="TRANS">Transport ({formatCur(categorySpends.TRANS)})</option>
              <option value="HOTEL">Hotels ({formatCur(categorySpends.HOTEL)})</option>
              <option value="SIGHT">Sightseeing ({formatCur(categorySpends.SIGHT)})</option>
              <option value="OTHER">Misc / Other ({formatCur(categorySpends.OTHER)})</option>
              <option value="RECEIPT">Deposits / Advances ({formatCur(categorySpends.RECEIPT)})</option>
            </select>

            <span className="font-mono text-xs font-black uppercase tracking-wider text-[var(--text-muted)] ml-2">Family:</span>
            <select
              value={selectedFamilyFilter}
              onChange={(e) => setSelectedFamilyFilter(e.target.value)}
              className="border-2 border-[var(--border-color)] p-2 font-mono text-xs font-bold bg-[var(--surface-light)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_var(--shadow-color)] uppercase"
            >
              <option value="ALL">All Families</option>
              {activeFamilies.map(f => (
                <option key={f.name} value={f.name}>{f.name} Family Only</option>
              ))}
            </select>

            {(selectedCategoryFilter !== 'ALL' || selectedFamilyFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSelectedCategoryFilter('ALL');
                  setSelectedFamilyFilter('ALL');
                }}
                className="font-mono text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 px-3 py-2 hover:bg-red-500/20 transition-colors uppercase flex items-center gap-1"
              >
                <RefreshCw size={12} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── VIEW 1: AUTHENTIC LEDGER BOOK (CATEGORIZED ACCOUNTS) ── */}
        {viewMode === 'BOOK' && (
          <div className="flex flex-col gap-10">
            {LEDGER_ACCOUNTS.map((account) => {
              if (selectedCategoryFilter !== 'ALL' && selectedCategoryFilter !== account.key) {
                return null;
              }

              const accountEntries = expenses.filter(e => {
                const familyMatch = selectedFamilyFilter === 'ALL' || e.paidBy.toLowerCase() === selectedFamilyFilter.toLowerCase();
                const catMatch = matchesCategory(e, account.key);
                return familyMatch && catMatch;
              });

              const accountSubtotal = accountEntries.reduce((sum, e) => sum + e.amount, 0);

              return (
                <div key={account.key} className="brutal-card p-0 overflow-hidden bg-[var(--surface-light)] border-2 border-[var(--border-color)]">
                  {/* Account Ledger Header */}
                  <div className="p-5 border-b-2 border-[var(--border-color)] bg-[var(--bg-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[var(--surface-contrast)] text-[var(--text-inverse)] border border-[var(--border-color)] shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                        {account.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-xl uppercase tracking-wider text-[var(--text-primary)]">
                          {account.title}
                        </h3>
                        <p className="font-mono text-xs font-bold uppercase text-[var(--text-muted)]">
                          Code: AC-{account.key} • {accountEntries.length} {accountEntries.length === 1 ? 'Entry' : 'Entries'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-[var(--surface-light)] p-2.5 border-2 border-[var(--border-color)] shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                      <div className="text-right pr-3 border-r-2 border-[var(--border-color)]">
                        <div className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase">Subtotal ({selectedCurrency})</div>
                        <div className="font-black text-xl text-[var(--text-primary)]">{formatCur(accountSubtotal)}</div>
                      </div>
                      
                      <button
                        onClick={() => handleGeneratePDF(account.key)}
                        className="brutal-btn bg-[var(--surface-light)] text-[var(--text-primary)] hover:bg-[var(--accent-light)] text-xs flex items-center gap-1.5 py-1.5 px-3"
                        title={`Download itemized PDF for ${account.title}`}
                      >
                        <Download size={14} /> PDF Bill
                      </button>
                    </div>
                  </div>

                  {/* Ledger Account Entries Table */}
                  <div className="overflow-x-auto bg-[var(--surface-light)]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[var(--bg-color)] font-mono text-xs tracking-widest uppercase border-b-2 border-[var(--border-color)] text-[var(--text-muted)]">
                          <th className="p-3.5 font-black border-r-2 border-[var(--border-color)] w-28">Date</th>
                          <th className="p-3.5 font-black border-r-2 border-[var(--border-color)]">Particulars / Details</th>
                          <th className="p-3.5 font-black border-r-2 border-[var(--border-color)] w-36">Disbursed By</th>
                          <th className="p-3.5 font-black border-r-2 border-[var(--border-color)] w-48">Liability Split</th>
                          <th className="p-3.5 font-black text-right border-r-2 border-[var(--border-color)] w-40">Amount ({selectedCurrency})</th>
                          <th className="p-3.5 font-black text-center w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold text-sm uppercase text-[var(--text-primary)]">
                        {accountEntries.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-[var(--text-muted)] font-mono text-xs normal-case">
                              No entries logged under this category ledger yet. Click &quot;Record Entry&quot; to post spends.
                            </td>
                          </tr>
                        ) : (
                          accountEntries.map((exp) => (
                            <tr key={exp.id} className="hover:bg-[var(--accent-light)] transition-colors border-b border-[var(--border-color)]/20">
                              <td className="p-3.5 border-r-2 border-[var(--border-color)] font-mono text-xs text-[var(--text-muted)]">{exp.date}</td>
                              <td className="p-3.5 border-r-2 border-[var(--border-color)]">
                                <div className="flex items-center gap-2">
                                  {safeType(exp) === 'RECEIPT' && (
                                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-mono">CREDIT</span>
                                  )}
                                  <span>{exp.description}</span>
                                </div>
                              </td>
                              <td className="p-3.5 border-r-2 border-[var(--border-color)] font-mono text-xs">{exp.paidBy} Family</td>
                              <td className="p-3.5 border-r-2 border-[var(--border-color)] font-mono text-xs">
                                {safeType(exp) === 'RECEIPT' ? (
                                  <span className="text-[var(--text-muted)] font-normal">Trip Fund Deposit</span>
                                ) : (
                                  getSplitMitra(exp) === exp.amount && getSplitGhosh(exp) === 0 ? (
                                    <span className="text-blue-600 dark:text-blue-400 font-black">100% MITRA</span>
                                  ) : getSplitGhosh(exp) === exp.amount && getSplitMitra(exp) === 0 ? (
                                    <span className="text-blue-600 dark:text-blue-400 font-black">100% GHOSH</span>
                                  ) : getSplitMitra(exp) === exp.amount / 2 && getSplitGhosh(exp) === exp.amount / 2 ? (
                                    <span className="text-emerald-600 dark:text-emerald-400">50/50 EQUAL</span>
                                  ) : (
                                    <div className="flex flex-col">
                                      <span className="text-blue-600 dark:text-blue-400">M: {formatCur(getSplitMitra(exp))}</span>
                                      <span className="text-blue-600 dark:text-blue-400">G: {formatCur(getSplitGhosh(exp))}</span>
                                    </div>
                                  )
                                )}
                              </td>
                              <td className="p-3.5 text-right font-black border-r-2 border-[var(--border-color)] text-base">
                                {formatCur(exp.amount)}
                              </td>
                              <td className="p-3.5 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleEdit(exp)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Edit Entry"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                        {accountEntries.length > 0 && (
                          <tr className="bg-[var(--bg-color)] font-mono text-xs border-t-2 border-[var(--border-color)]">
                            <td colSpan={4} className="p-3.5 text-right font-black border-r-2 border-[var(--border-color)] uppercase tracking-wider text-[var(--text-muted)]">
                              Subtotal for {account.title}:
                            </td>
                            <td className="p-3.5 text-right font-black border-r-2 border-[var(--border-color)] text-lg text-[var(--text-primary)]">
                              {formatCur(accountSubtotal)}
                            </td>
                            <td className="p-3.5"></td>
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
          <div className="brutal-card p-0 overflow-hidden bg-[var(--surface-light)] border-2 border-[var(--border-color)]">
            <div className="bg-[var(--surface-contrast)] text-[var(--text-inverse)] p-5 border-b-2 border-[var(--border-color)] flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-lg uppercase tracking-widest flex items-center gap-3">
                  <Wallet size={24} className="text-[var(--accent)]" /> 
                  Unified Transaction Log 
                  {selectedFamilyFilter !== 'ALL' && ` • ${selectedFamilyFilter} Family`}
                  {selectedCategoryFilter !== 'ALL' && ` • Category: ${selectedCategoryFilter}`}
                </h3>
                <div className="text-xs font-mono text-[var(--text-muted)]">
                  Total for this view: {formatCur(filteredTotal)} ({filteredExpenses.length} entries)
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto bg-[var(--surface-light)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-color)] font-mono text-xs tracking-widest uppercase border-b-2 border-[var(--border-color)] text-[var(--text-muted)]">
                    <th className="p-4 font-black border-r-2 border-[var(--border-color)]">Date</th>
                    <th className="p-4 font-black border-r-2 border-[var(--border-color)]">Description</th>
                    <th className="p-4 font-black border-r-2 border-[var(--border-color)]">Category</th>
                    <th className="p-4 font-black border-r-2 border-[var(--border-color)]">Paid By</th>
                    <th className="p-4 font-black border-r-2 border-[var(--border-color)]">Split Rule</th>
                    <th className="p-4 font-black text-right border-r-2 border-[var(--border-color)]">Amount ({selectedCurrency})</th>
                    <th className="p-4 font-black text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm uppercase text-[var(--text-primary)]">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[var(--text-muted)] font-mono">
                        No transactions found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-[var(--accent-light)] transition-colors border-b border-[var(--border-color)]/20">
                        <td className="p-4 border-r-2 border-[var(--border-color)] font-mono text-xs text-[var(--text-muted)]">{exp.date}</td>
                        <td className="p-4 border-r-2 border-[var(--border-color)]">
                          <div className="flex items-center gap-2">
                            {safeType(exp) === 'RECEIPT' && <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-mono">RECEIPT</span>}
                            <span>{exp.description}</span>
                          </div>
                        </td>
                        <td className="p-4 border-r-2 border-[var(--border-color)]">
                          <span className="px-2.5 py-0.5 font-mono text-[10px] border border-[var(--border-color)] bg-[var(--bg-color)]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-4 border-r-2 border-[var(--border-color)] font-mono text-xs">{exp.paidBy}</td>
                        <td className="p-4 border-r-2 border-[var(--border-color)] font-mono text-xs">
                          {safeType(exp) === 'RECEIPT' ? (
                            <span className="text-[var(--text-muted)]">N/A</span>
                          ) : (
                            getSplitMitra(exp) === exp.amount && getSplitGhosh(exp) === 0 ? (
                              <span className="text-blue-600 dark:text-blue-400 font-black">100% MITRA</span>
                            ) : getSplitGhosh(exp) === exp.amount && getSplitMitra(exp) === 0 ? (
                              <span className="text-blue-600 dark:text-blue-400 font-black">100% GHOSH</span>
                            ) : getSplitMitra(exp) === exp.amount / 2 && getSplitGhosh(exp) === exp.amount / 2 ? (
                              <span>50/50 EQUAL</span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-blue-600 dark:text-blue-400">M: {formatCur(getSplitMitra(exp))}</span>
                                <span className="text-blue-600 dark:text-blue-400">G: {formatCur(getSplitGhosh(exp))}</span>
                              </div>
                            )
                          )}
                        </td>
                        <td className="p-4 text-right font-black border-r-2 border-[var(--border-color)]">{formatCur(exp.amount)}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleEdit(exp)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit Transaction"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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
                              <Trash2 size={18} />
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
              className="bg-[var(--surface-light)] text-[var(--text-primary)] border-2 border-[var(--border-color)] shadow-[8px_8px_0px_0px_var(--shadow-color)] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[var(--surface-contrast)] text-[var(--text-inverse)] p-4 flex justify-between items-center">
                <h2 className="font-black text-lg uppercase tracking-widest">{editingId ? 'Edit Ledger Entry' : 'Record New Ledger Entry'}</h2>
                <button onClick={() => { setIsAddModalOpen(false); setEditingId(null); }} className="hover:text-red-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddExpense} className="p-6 flex flex-col gap-5 font-bold uppercase text-xs">
                
                <div className="flex gap-3 mb-1">
                  <button type="button" onClick={() => setTransactionType('EXPENSE')} className={`flex-1 p-2.5 border-2 border-[var(--border-color)] font-black uppercase ${transactionType === 'EXPENSE' ? 'bg-[var(--accent)] text-white shadow-[3px_3px_0px_0px_var(--shadow-color)]' : 'bg-[var(--bg-color)] hover:bg-[var(--accent-light)]'}`}>EXPENSE (DEBIT)</button>
                  <button type="button" onClick={() => setTransactionType('RECEIPT')} className={`flex-1 p-2.5 border-2 border-[var(--border-color)] font-black uppercase ${transactionType === 'RECEIPT' ? 'bg-emerald-600 text-white shadow-[3px_3px_0px_0px_var(--shadow-color)]' : 'bg-[var(--bg-color)] hover:bg-[var(--accent-light)]'}`}>DEPOSIT (CREDIT)</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 font-mono text-[11px] tracking-widest text-[var(--text-muted)]">Date</label>
                    <input 
                      type="date" 
                      value={dateStr}
                      onChange={e => setDateStr(e.target.value)}
                      required
                      className="w-full border-2 border-[var(--border-color)] p-2.5 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] bg-[var(--surface-light)] text-[var(--text-primary)]" 
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 font-mono text-[11px] tracking-widest text-[var(--text-muted)]">Amount (INR ₹)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      required
                      min="1"
                      className="w-full border-2 border-[var(--border-color)] p-2.5 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] bg-[var(--surface-light)] text-[var(--text-primary)]" 
                      placeholder="500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  {transactionType === 'EXPENSE' && (
                    <div>
                      <label className="block mb-1.5 font-mono text-[11px] tracking-widest text-[var(--text-muted)]">Category Account</label>
                      <select 
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border-2 border-[var(--border-color)] p-2.5 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] bg-[var(--surface-light)] text-[var(--text-primary)]"
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
                    <label className="block mb-1.5 font-mono text-[11px] tracking-widest text-[var(--text-muted)]">Disbursed / Paid By</label>
                    <select 
                      value={paidBy}
                      onChange={e => setPaidBy(e.target.value)}
                      className="w-full border-2 border-[var(--border-color)] p-2.5 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] bg-[var(--surface-light)] text-[var(--text-primary)]"
                    >
                      {activeFamilies.map(f => (
                        <option key={f.name} value={f.name}>{f.name} Family</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-mono text-[11px] tracking-widest text-[var(--text-muted)]">Particulars / Item Details</label>
                  <input 
                    type="text" 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                    className="w-full border-2 border-[var(--border-color)] p-2.5 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] bg-[var(--surface-light)] text-[var(--text-primary)]" 
                    placeholder={transactionType === 'RECEIPT' ? 'e.g. Deposit to Trip Fund' : 'e.g. Dinner, Breakfast, Train snacks, Bisleri'}
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono normal-case">Write detailed particulars for audited accounting records.</p>
                </div>

                {transactionType === 'EXPENSE' && (
                  <div className="border-2 border-[var(--border-color)] p-3 bg-[var(--bg-color)] mt-1">
                    <label className="block mb-2 font-mono text-[11px] tracking-widest uppercase text-[var(--text-muted)]">Split Liability (Who Owes)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <button type="button" onClick={() => setSplitType('EQUAL')} className={`p-2 border border-[var(--border-color)] text-xs font-black uppercase ${splitType === 'EQUAL' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'bg-[var(--surface-light)] hover:bg-[var(--accent-light)]'}`}>50/50</button>
                      <button type="button" onClick={() => setSplitType('MITRA')} className={`p-2 border border-[var(--border-color)] text-xs font-black uppercase ${splitType === 'MITRA' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'bg-[var(--surface-light)] hover:bg-[var(--accent-light)]'}`}>Mitra Only</button>
                      <button type="button" onClick={() => setSplitType('GHOSH')} className={`p-2 border border-[var(--border-color)] text-xs font-black uppercase ${splitType === 'GHOSH' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'bg-[var(--surface-light)] hover:bg-[var(--accent-light)]'}`}>Ghosh Only</button>
                      <button type="button" onClick={() => setSplitType('CUSTOM')} className={`p-2 border border-[var(--border-color)] text-xs font-black uppercase ${splitType === 'CUSTOM' ? 'bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'bg-[var(--surface-light)] hover:bg-[var(--accent-light)]'}`}>Custom</button>
                    </div>

                    {splitType === 'CUSTOM' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-mono text-[10px] tracking-widest text-[var(--text-muted)]">Mitra Owe Amount (₹)</label>
                          <input 
                            type="number" 
                            value={customSplitMitra}
                            onChange={e => setCustomSplitMitra(e.target.value)}
                            required
                            min="0"
                            className="w-full border-2 border-[var(--border-color)] p-2 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] text-xs bg-[var(--surface-light)] text-[var(--text-primary)]" 
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-mono text-[10px] tracking-widest text-[var(--text-muted)]">Ghosh Owe Amount (₹)</label>
                          <input 
                            type="number" 
                            value={customSplitGhosh}
                            onChange={e => setCustomSplitGhosh(e.target.value)}
                            required
                            min="0"
                            className="w-full border-2 border-[var(--border-color)] p-2 focus:outline-none focus:border-[var(--accent)] shadow-[2px_2px_0px_0px_var(--shadow-color)] text-xs bg-[var(--surface-light)] text-[var(--text-primary)]" 
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button type="submit" className="w-full mt-2 brutal-btn brutal-btn-accent py-3">
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
