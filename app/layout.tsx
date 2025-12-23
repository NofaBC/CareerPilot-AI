import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerPilot AI™ – Autonomous Job Hunt Agent',
  description: 'Turn your resume, skills, and goals into a fully guided job search with AI-powered profile building, job matching, applications, and interview prep.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen text-slate-100 antialiased bg-gradient-radial from-slate-900 via-slate-950 to-slate-950`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
