import Link from 'next/link';

export function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkHref }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary text-white rounded-md flex items-center justify-center font-bold text-lg shadow-sm">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-dark">
            Skillority
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-card border border-border rounded-DEFAULT p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-dark tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-slate mt-1.5">{subtitle}</p>}
        </div>

        {children}

        {footerText && footerLinkHref && (
          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-neutral-slate">
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
  );
}
