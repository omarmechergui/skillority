'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { adminNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { adminApi } from '@/lib/api';
import {
  GraduationCap,
  Mail,
  Copy,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Clock,
  Send,
} from 'lucide-react';

export default function AdminInstructorsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [invitationResult, setInvitationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);

  const loadInstructors = async () => {
    setLoadingInstructors(true);
    try {
      const res = await adminApi.getUsers({ role: 'INSTRUCTOR' });
      if (res.data?.users) {
        setInstructors(res.data.users);
      }
    } catch {
      // Safe fallback
    } finally {
      setLoadingInstructors(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setFeedback(null);
    setInvitationResult(null);
    setCopied(false);

    try {
      const res = await adminApi.inviteInstructor(email.trim().toLowerCase());
      if (res.data) {
        setInvitationResult(res.data);
        setFeedback({ type: 'success', message: res.message || 'Invitation created successfully!' });
        setEmail('');
        loadInstructors();
      } else {
        throw new Error(res.error?.message || 'Failed to generate invitation');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.error?.message || err.message || 'Error generating invitation.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!invitationResult?.invitationToken) return;
    const inviteUrl = `${window.location.origin}/register/instructor?token=${invitationResult.invitationToken}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <DashboardShell role="ADMIN" navItems={adminNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              Instructor Invitations & Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Invite qualified educators to publish curricula on Skillority and oversee instructor accounts.
            </p>
          </div>
          <Badge variant="primary" className="self-start sm:self-auto">
            {instructors.length} Active Instructors
          </Badge>
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

        {/* Invitation Form Card */}
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Invite New Instructor</h2>
            <p className="text-xs text-slate-500">
              Enter the instructor&apos;s verified email address to issue a cryptographically secured onboarding invitation.
            </p>
          </div>

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                placeholder="instructor@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9 w-full text-sm"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email.trim()}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Generating...' : 'Issue Invitation'}
            </Button>
          </form>

          {/* Invitation Link Result Preview */}
          {invitationResult && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Invitation Generated for {invitationResult.email}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Expires: {new Date(invitationResult.expiresAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register/instructor?token=${invitationResult.invitationToken}`}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 shrink-0 text-xs"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Existing Instructors List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600" />
              Current Instructors
            </h2>
          </div>

          {loadingInstructors ? (
            <Card className="p-8 text-center text-slate-400 text-sm">
              Loading instructor directory...
            </Card>
          ) : instructors.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-sm">
              No instructors have registered yet. Issue an invitation above to onboard educators.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructors.map((inst) => (
                <Card key={inst.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {inst.profile?.firstName} {inst.profile?.lastName}
                      </h3>
                      <p className="text-xs text-slate-500">{inst.email}</p>
                    </div>
                    <Badge variant={inst.isActive ? 'success' : 'default'} className="text-[10px]">
                      {inst.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {new Date(inst.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
