import Link from 'next/link';
import { ShieldCheck, HelpCircle, Award, CheckCircle2, Coins } from 'lucide-react';

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  badgeText = 'Skill Verification Platform',
  editorialTitle = 'Your gateway to certified expertise.',
  editorialSubtitle = 'Resume chapters, take interactive quizzes, and unlock vetted career opportunities in tech.',
  imageAlt = 'Student analyzing modern software engineering curricula',
}) {
  return (
    <div className="min-h-screen bg-canvas text-neutral-dark flex flex-col justify-between antialiased selection:bg-primary-light selection:text-primary">
      {/* Top Global Header matching Stitch */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-primary-hover transition-colors font-bold text-base">
              S
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Skillority</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Secure Onboarding</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help & Support</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Editorial Showcase + Right Form Card */}
      <main className="w-full flex-1 flex flex-col justify-center py-10 lg:py-16">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Editorial & Brand Showcase (Stitch Layout) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-between self-stretch p-8 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white text-primary border border-slate-200 shadow-xs text-xs font-semibold">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span>{badgeText}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                    {editorialTitle}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {editorialSubtitle}
                  </p>
                </div>

                {/* Ambient visual badge card */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-xs bg-gradient-to-br from-slate-900 to-slate-800 p-5 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">Merit Engine</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <p className="text-sm font-semibold">Industry-Ready Pathways</p>
                    </div>
                    <p className="text-xs text-slate-300">Verified by top hiring partners and instructors</p>
                  </div>
                </div>
              </div>

              {/* Bottom trust indicators */}
              <div className="relative z-10 pt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/70 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-900">Platform Coins Ready</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Auto-Synced
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trusted by thousands of active learners, instructors, and hiring managers.
                </p>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="col-span-1 lg:col-span-7 flex justify-center">
              <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-2xl border border-border shadow-sm flex flex-col">
                <div className="flex flex-col gap-2 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                  {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
                </div>

                {children}

                {footerText && footerLinkHref && (
                  <div className="mt-8 pt-6 border-t border-border text-center text-xs text-slate-500">
                    {footerText}{' '}
                    <Link
                      href={footerLinkHref}
                      className="font-semibold text-primary hover:text-primary-hover underline underline-offset-4"
                    >
                      {footerLinkText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-white text-center text-xs text-slate-400">
        <p>© 2026 Skillority Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
