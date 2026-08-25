'use client';

import React, { useState } from 'react';
import { TRIP_CONFIG } from '@/lib/tripData';
import { Wallet, Plus, ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';

export default function ExpensesPage() {
  const [isAuthenticated] = useState(false);

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
          <button className="brutal-btn brutal-btn-accent flex items-center gap-2">
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
            <div className="text-6xl font-black mb-4">₹1.42L</div>
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
              <div className="text-center w-full md:w-auto">
                <div className="text-3xl font-black uppercase mb-4">Mitra</div>
                <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_#EF4444]">
                  <div className="text-4xl font-black text-red-600 flex items-center justify-center gap-2 mb-2">
                    <ArrowUpRight size={32} /> OWE ₹12,500
                  </div>
                  <p className="font-mono text-xs font-bold">PAID ₹48K // SHARE ₹60.5K</p>
                </div>
              </div>

              <div className="hidden md:block w-4 h-32 border-r-4 border-black border-dashed border-y-0 border-l-0" />

              <div className="text-center w-full md:w-auto">
                <div className="text-3xl font-black uppercase mb-4">Ghosh</div>
                <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_#10B981]">
                  <div className="text-4xl font-black text-emerald-600 flex items-center justify-center gap-2 mb-2">
                    <ArrowDownRight size={32} /> GET ₹12,500
                  </div>
                  <p className="font-mono text-xs font-bold">PAID ₹94K // SHARE ₹81.5K</p>
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
            <span className="font-mono text-xs font-bold bg-[var(--accent)] px-3 py-1 text-white border-2 border-white">
              ALL ENTRIES
            </span>
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
                <tr className="hover:bg-gray-100 transition-colors border-b-2 border-black">
                  <td className="p-6 border-r-2 border-black font-mono text-sm">Oct 16</td>
                  <td className="p-6 border-r-2 border-black">Howrah to Jalgaon Tickets</td>
                  <td className="p-6 border-r-2 border-black"><span className="bg-blue-100 border-2 border-blue-600 text-blue-600 px-3 py-1 font-mono text-xs shadow-[2px_2px_0px_0px_#2563EB]">TRANS</span></td>
                  <td className="p-6 border-r-2 border-black">Ghosh</td>
                  <td className="p-6 text-right font-black">₹24,500</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors border-b-2 border-black">
                  <td className="p-6 border-r-2 border-black font-mono text-sm">Oct 17</td>
                  <td className="p-6 border-r-2 border-black">Hotel Booking - Jalgaon</td>
                  <td className="p-6 border-r-2 border-black"><span className="bg-orange-100 border-2 border-orange-600 text-orange-600 px-3 py-1 font-mono text-xs shadow-[2px_2px_0px_0px_#EA580C]">HOTEL</span></td>
                  <td className="p-6 border-r-2 border-black">Ghosh</td>
                  <td className="p-6 text-right font-black">₹18,000</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors border-b-2 border-black">
                  <td className="p-6 border-r-2 border-black font-mono text-sm">Oct 17</td>
                  <td className="p-6 border-r-2 border-black">Ajanta Caves Entry & Guide</td>
                  <td className="p-6 border-r-2 border-black"><span className="bg-pink-100 border-2 border-pink-600 text-pink-600 px-3 py-1 font-mono text-xs shadow-[2px_2px_0px_0px_#DB2777]">SIGHT</span></td>
                  <td className="p-6 border-r-2 border-black">Mitra</td>
                  <td className="p-6 text-right font-black">₹4,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-[#E5E5E5] text-center font-mono font-black uppercase tracking-widest text-[var(--accent)] hover:bg-black hover:text-white cursor-pointer transition-colors border-t-4 border-black">
            Load More Transactions
          </div>
        </div>

      </div>
    </div>
  );
}
