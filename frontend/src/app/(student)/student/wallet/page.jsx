'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { walletApi } from '@/lib/api';
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
  PlayCircle,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';

const COIN_ECONOMY_RULES = {
  freeChapters: 'Chapters 0 through 5 are permanently free and open to all enrolled learners.',
  chapter6Cost: 50,
  chapter7Cost: 50,
  quizReward: 20,
  dailyMissionRange: '5 - 10 Coins (up to 25/day)',
};

export default function StudentWalletPage() {
  const [filter, setFilter] = useState('ALL');
  const [wallet, setWallet] = useState({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    rules: COIN_ECONOMY_RULES,
    transactions: [],
  });
  const [missions, setMissions] = useState([]);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [claimingAd, setClaimingAd] = useState(false);
  const [claimingMissionId, setClaimingMissionId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const loadData = async () => {
    try {
      const [walletRes, missionsRes] = await Promise.allSettled([
        walletApi.getWallet(),
        walletApi.getDailyMissions(),
      ]);

      if (walletRes.status === 'fulfilled') {
        const liveW = walletRes.value.data?.wallet || walletRes.value.data;
        if (liveW && typeof liveW.balance === 'number') {
          const txs = Array.isArray(liveW.transactions) ? liveW.transactions : [];
          const earned = txs.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
          const spent = txs.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
          setWallet((prev) => ({
            ...prev,
            balance: liveW.balance,
            totalEarned: earned,
            totalSpent: spent,
            transactions: txs.map((t) => ({
              id: t.id,
              type: t.amount > 0 ? 'EARNED' : 'SPENT',
              amount: t.amount > 0 ? `+${t.amount}` : `${t.amount}`,
              description: t.description || 'Coin Transaction',
              date: new Date(t.createdAt).toLocaleDateString(),
              category: t.type,
            })),
          }));
        }
      }

      if (missionsRes.status === 'fulfilled' && missionsRes.value.data?.missions) {
        setMissions(missionsRes.value.data.missions);
      }
    } catch {
      // Safe fallback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimDaily = async () => {
    if (claimingDaily) return;
    setClaimingDaily(true);
    setFeedback(null);
    try {
      const res = await walletApi.claimDailyLogin();
      const coinsAwarded = res.data?.coinsAwarded ?? res.data?.awardedCoins;
      const newBalance = res.data?.balance ?? res.data?.newBalance;

      if (coinsAwarded !== undefined && newBalance !== undefined) {
        setWallet((prev) => ({
          ...prev,
          balance: newBalance,
          totalEarned: prev.totalEarned + coinsAwarded,
        }));
        setFeedback({ type: 'success', message: `Success: Claimed +${coinsAwarded} Coins for daily check-in!` });
        loadData();
      } else {
        const errMsg = res.error?.message || 'Daily login reward already claimed today.';
        setFeedback({ type: 'error', message: errMsg });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Could not claim daily reward.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setClaimingDaily(false);
    }
  };

  const handleClaimAd = async () => {
    if (claimingAd) return;
    setClaimingAd(true);
    setFeedback(null);
    try {
      const initRes = await walletApi.initiateAdSession();
      const token = initRes.data?.adSessionToken;
      if (!token) {
        throw new Error(initRes.error?.message || 'Failed to initialize ad playback session');
      }

      const claimRes = await walletApi.claimAdReward(token);
      const coinsAwarded = claimRes.data?.coinsAwarded ?? claimRes.data?.awardedCoins;
      const newBalance = claimRes.data?.balance ?? claimRes.data?.newBalance;

      if (coinsAwarded !== undefined && newBalance !== undefined) {
        setWallet((prev) => ({
          ...prev,
          balance: newBalance,
          totalEarned: prev.totalEarned + coinsAwarded,
        }));
        setFeedback({ type: 'success', message: `Success: Earned +${coinsAwarded} Coins from rewarded video!` });
        loadData();
      } else {
        const errMsg = claimRes.error?.message || 'Could not claim ad reward.';
        setFeedback({ type: 'error', message: errMsg });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Error claiming ad reward.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setClaimingAd(false);
    }
  };

  const handleClaimMission = async (missionId) => {
    if (claimingMissionId) return;
    setClaimingMissionId(missionId);
    setFeedback(null);
    try {
      const res = await walletApi.claimDailyMission(missionId);
      const coinsAwarded = res.data?.coinsAwarded;
      const newBalance = res.data?.balance;

      if (coinsAwarded !== undefined && newBalance !== undefined) {
        setWallet((prev) => ({
          ...prev,
          balance: newBalance,
          totalEarned: prev.totalEarned + coinsAwarded,
        }));
        setFeedback({ type: 'success', message: `Mission reward claimed! +${coinsAwarded} Coins added.` });
        loadData();
      } else {
        const errMsg = res.error?.message || 'Failed to claim mission reward.';
        setFeedback({ type: 'error', message: errMsg });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Error claiming mission reward.';
      setFeedback({ type: 'error', message: errMsg });
    } finally {
      setClaimingMissionId(null);
    }
  };

  const { balance, totalEarned, totalSpent, rules, transactions } = wallet;

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
              Verified Economy Ledger
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

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

        {/* Daily Rewards & Missions Action Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Earn Free Coins Today</h2>
              <p className="text-xs text-slate-500">Claim daily login bonuses, watch short sponsored videos, and finish learning missions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Login Reward Card */}
            <Card className="p-5 flex flex-col justify-between gap-4 border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Daily Check-In</h3>
                    <p className="text-xs text-slate-500">Login once per day to collect your daily attendance bonus.</p>
                  </div>
                </div>
                <Badge variant="warning" className="font-bold text-xs">+5 Coins</Badge>
              </div>
              <Button
                onClick={handleClaimDaily}
                disabled={claimingDaily}
                className="w-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {claimingDaily ? 'Claiming Attendance...' : 'Claim Daily +5 Coins'}
              </Button>
            </Card>

            {/* Rewarded Video Card */}
            <Card className="p-5 flex flex-col justify-between gap-4 border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Watch Rewarded Video</h3>
                    <p className="text-xs text-slate-500">Watch a quick sponsor video to earn 1-5 Coins (max 5 ads per day).</p>
                  </div>
                </div>
                <Badge variant="info" className="font-bold text-xs">+1 to +5 Coins</Badge>
              </div>
              <Button
                variant="outline"
                onClick={handleClaimAd}
                disabled={claimingAd}
                className="w-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-blue-500" />
                {claimingAd ? 'Verifying Ad Session...' : 'Watch Video & Claim Coins'}
              </Button>
            </Card>
          </div>

          {/* Daily Missions Checklist */}
          {missions.length > 0 && (
            <Card className="p-5 space-y-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Learning Missions</h3>
                  <p className="text-xs text-slate-500">Missions reset daily at midnight (capped at +25 Coins/day).</p>
                </div>
                <Flame className="w-5 h-5 text-amber-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {missions.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-xs">{m.title}</span>
                        <span className="font-extrabold text-xs text-amber-600">+{m.coinsReward} Coins</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{m.description}</p>
                    </div>

                    <div>
                      {m.isClaimed ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 pt-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Claimed Today</span>
                        </div>
                      ) : m.isCompleted ? (
                        <Button
                          size="sm"
                          onClick={() => handleClaimMission(m.id)}
                          disabled={claimingMissionId === m.id}
                          className="w-full text-xs font-bold"
                        >
                          {claimingMissionId === m.id ? 'Claiming...' : 'Claim Reward'}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Incomplete</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
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
              {filteredTransactions.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 text-xs">
                  No transactions recorded in your ledger yet.
                </Card>
              ) : (
                filteredTransactions.map((tx) => (
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
                          {tx.description}
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
                        {tx.amount} Coins
                      </div>
                    </div>
                  </Card>
                ))
              )}
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
                    Chapter 6+ costs <strong>{rules.chapter6Cost} Coins</strong> per chapter.
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
