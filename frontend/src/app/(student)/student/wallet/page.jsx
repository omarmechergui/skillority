'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockWalletData } from '@/lib/mockStudentData';
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Lock,
  Unlock,
  CheckCircle2,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function StudentWalletPage() {
  const [filter, setFilter] = useState('ALL');
  const { balance, totalEarned, totalSpent, rules, transactions } = mockWalletData;

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'EARNED') return tx.type === 'EARNED';
    if (filter === 'SPENT') return tx.type === 'SPENT';
    return true;
  });

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-6 sm:p-8 rounded-2xl text-white shadow-md relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-amber-50">
              <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              Skillority Economy
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Coins Wallet & Rewards
            </h1>
            <p className="text-sm text-amber-100 max-w-lg">
              Earn coins through quizzes, study streaks, and daily missions. Spend coins to unlock advanced course chapters.
            </p>
          </div>

          {/* Current Balance Display Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 min-w-[240px] space-y-1 relative z-10">
            <div className="text-xs uppercase font-medium text-amber-100 tracking-wider">
              Available Balance
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {balance}
              </span>
              <span className="text-base font-semibold text-amber-200">Coins</span>
            </div>
            <div className="text-[11px] text-amber-100/90 pt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              Verified On-Chain Ledger
            </div>
          </div>
        </div>

        {/* Stats Grid: Earned vs Spent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Coins className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Holdings</p>
              <p className="text-2xl font-extrabold text-slate-900">{balance} Coins</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Earned</p>
              <p className="text-2xl font-extrabold text-emerald-600">+{totalEarned} Coins</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Spent</p>
              <p className="text-2xl font-extrabold text-rose-600">-{totalSpent} Coins</p>
            </div>
          </Card>
        </div>

        {/* Two-Column Grid: Transaction History + Economy Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Ledger (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
                <p className="text-xs text-slate-500">Record of earned rewards and chapter unlocks</p>
              </div>

              {/* Filter */}
              <div className="inline-flex rounded-lg border border-border p-1 bg-slate-50 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    filter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('EARNED')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    filter === 'EARNED' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Earned
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('SPENT')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    filter === 'SPENT' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Spent
                </button>
              </div>
            </div>

            {/* Transactions Card List */}
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <Card
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        tx.type === 'EARNED'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {tx.type === 'EARNED' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {tx.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                        <span className="font-medium text-slate-600">{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div
                      className={`text-base font-extrabold ${
                        tx.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.type === 'EARNED' ? `+${tx.amount}` : tx.amount} Coins
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Balance: {tx.balanceAfter}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar: Platform Coin Rules & Unlock Pricing (1 col) */}
          <div className="space-y-6">
            {/* Rules Card */}
            <Card className="p-6 space-y-5 bg-white border border-border">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
                  How Skillority Coins Work
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fair, transparent, merit-based economy rules.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Rule 1 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Chapters 0 — 5 Are Free
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    {rules.freeChapters}
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-600" />
                    Chapter 6+ Advanced Unlock
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Chapter 6 costs <strong>{rules.chapter6Cost} Coins</strong>, Chapter 7 costs <strong>{rules.chapter7Cost} Coins</strong>.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    Earn Coins as You Learn
                  </div>
                  <p className="text-blue-800 text-[11px] leading-relaxed">
                    Passing a Chapter Quiz grants <strong>+{rules.quizReward} Coins</strong>. Daily missions award <strong>{rules.dailyMissionRange}</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/student/learn">
                  <Button variant="outline" className="w-full text-xs font-semibold flex items-center justify-center gap-1.5">
                    Start Learning to Earn
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Fast Quick Links */}
            <Card className="p-6 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Quick Navigation
              </h4>
              <div className="space-y-2 text-xs">
                <Link
                  href="/student/progress"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                >
                  <span>View Learning Progress</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/student/dashboard"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                >
                  <span>Student Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

