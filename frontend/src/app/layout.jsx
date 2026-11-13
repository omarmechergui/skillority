import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

export const metadata = {
  title: 'Skillority — Professional Learning & Career Development',
  description: 'Enterprise skill learning, interactive courses, talent discovery, and career development.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-canvas text-neutral-dark min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

