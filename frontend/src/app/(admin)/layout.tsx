import type { Metadata } from 'next';
import '../globals.css';
import { Web3Provider } from '@/context/Web3Provider';
import { AdminProvider } from '@/context/AdminContext';
import { SessionProvider } from 'next-auth/react';
import AdminShell from './AdminShell';

export const metadata: Metadata = {
  title: 'Admin Dashboard — AgentsClan',
  description: 'AgentsClan Admin Dashboard - Manage community, events, store, and more.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-general bg-[#0a0f0d] text-[#e6fff5]">
        <SessionProvider>
          <Web3Provider>
            <AdminProvider>
              <AdminShell>{children}</AdminShell>
            </AdminProvider>
          </Web3Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
