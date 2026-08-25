'use client';

import React, { useState } from 'react';
import { TRIP_CONFIG } from '@/lib/tripData';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, Split, Activity } from 'lucide-react';

export default function ExpensesPage() {
  const [isAuthenticated] = useState(false); // Simplified for this UI demo

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h1 className="heading-hero text-gradient mb-4">Auto-Split Expenses</h1>
            <p className="text-body-large text-muted max-w-2xl">
              A transparent, real-time ledger for the Mitra & Ghosh families. 
              Add an expense, and the system automatically calculates exactly who owes what.
            </p>
          </div>
          <button className="tap bg-white text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0">
            <Plus size={20} /> Add Expense
          </button>
        </div>

        {/* Overview Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Total Spending */}
          <div className="glass-card p-8 lg:col-span-1 bg-gradient-to-br from-blue-900/20 to-transparent">
            <div className="flex items-center gap-3 text-blue-400 mb-4">
              <Activity size={24} />
              <h3 className="font-bold tracking-widest uppercase text-sm">Total Trip Expense</h3>
            </div>
            <div className="text-5xl font-black mb-2">₹1,42,000</div>
            <p className="text-muted text-sm font-medium">As of today • Across both families</p>
          </div>

          {/* Settlement Status */}
          <div className="glass-card p-8 lg:col-span-2 relative overflow-hidden bg-gradient-to-r from-emerald-900/10 to-transparent">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
              <Split size={200} className="text-emerald-500" style={{ transform: 'translate(20%, -20%)' }} />
            </div>
            
            <h3 className="font-bold tracking-widest uppercase text-sm text-emerald-400 mb-6">Current Settlement</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
              
              <div className="text-center flex-1">
                <div className="text-xl font-bold mb-1">Mitra Family</div>
                <div className="text-3xl font-black text-red-400 flex items-center justify-center gap-2">
                  <ArrowUpRight size={24} /> Owe ₹12,500
                </div>
                <p className="text-xs text-muted mt-2">Paid ₹48,000 • Share ₹60,500</p>
              </div>

              <div className="hidden md:block w-px h-16 bg-white/10" />

              <div className="text-center flex-1">
                <div className="text-xl font-bold mb-1">Ghosh Family</div>
                <div className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-2">
                  <ArrowDownRight size={24} /> Get ₹12,500
                </div>
                <p className="text-xs text-muted mt-2">Paid ₹94,000 • Share ₹81,500</p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-[var(--border-glass)] bg-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Wallet size={20} className="text-accent-secondary" /> Recent Transactions
            </h3>
            <span className="text-sm font-bold text-muted bg-black/50 px-3 py-1 rounded-full">Viewing All</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-xs tracking-widest uppercase text-muted">
                  <th className="p-4 font-bold border-b border-[var(--border-glass)]">Date</th>
                  <th className="p-4 font-bold border-b border-[var(--border-glass)]">Description</th>
                  <th className="p-4 font-bold border-b border-[var(--border-glass)]">Category</th>
                  <th className="p-4 font-bold border-b border-[var(--border-glass)]">Paid By</th>
                  <th className="p-4 font-bold border-b border-[var(--border-glass)] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {/* Dummy Rows */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 border-b border-[var(--border-glass)] text-muted">Oct 16, 2026</td>
                  <td className="p-4 border-b border-[var(--border-glass)]">Howrah to Jalgaon Tickets</td>
                  <td className="p-4 border-b border-[var(--border-glass)]"><span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">Transport</span></td>
                  <td className="p-4 border-b border-[var(--border-glass)]">Sudip Ghosh</td>
                  <td className="p-4 border-b border-[var(--border-glass)] text-right font-bold text-white">₹24,500</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 border-b border-[var(--border-glass)] text-muted">Oct 17, 2026</td>
                  <td className="p-4 border-b border-[var(--border-glass)]">Hotel Booking - Jalgaon (2 Nights)</td>
                  <td className="p-4 border-b border-[var(--border-glass)]"><span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">Accommodation</span></td>
                  <td className="p-4 border-b border-[var(--border-glass)]">Sudip Ghosh</td>
                  <td className="p-4 border-b border-[var(--border-glass)] text-right font-bold text-white">₹18,000</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 border-b border-[var(--border-glass)] text-muted">Oct 17, 2026</td>
                  <td className="p-4 border-b border-[var(--border-glass)]">Ajanta Caves Entry & Guide</td>
                  <td className="p-4 border-b border-[var(--border-glass)]"><span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">Sightseeing</span></td>
                  <td className="p-4 border-b border-[var(--border-glass)]">Gopal Mitra</td>
                  <td className="p-4 border-b border-[var(--border-glass)] text-right font-bold text-white">₹4,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 text-center border-t border-[var(--border-glass)] text-sm text-blue-400 font-bold hover:text-white cursor-pointer transition-colors">
            Load More Transactions
          </div>
        </div>

      </div>
    </div>
  );
}
