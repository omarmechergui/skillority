export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full bg-card border border-border rounded-DEFAULT p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Phase 1 — Project Scaffolded
        </div>
        <h1 className="text-3xl font-bold text-neutral-dark mb-2 font-sans tracking-tight">
          Skillority Platform
        </h1>
        <p className="text-neutral-slate text-sm mb-6 leading-relaxed">
          Professional learning, talent discovery, and career development platform.
        </p>
        <div className="bg-canvas border border-border rounded-md p-4 text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-neutral-slate">Frontend:</span>
            <span className="font-semibold text-emerald-600">Next.js 14 (App Router)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-slate">Styling:</span>
            <span className="font-semibold text-emerald-600">Tailwind CSS + Geist Font</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-slate">Design Tokens:</span>
            <span className="font-semibold text-primary">#2563EB Canvas: #F8FAFC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-slate">API Health:</span>
            <span className="text-neutral-dark">http://localhost:5000/api/health</span>
          </div>
        </div>
      </div>
    </main>
  );
}

