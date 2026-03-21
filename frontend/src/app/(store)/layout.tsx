import type { Metadata } from 'next';
import '../globals.css';
import StoreShell from './StoreShell';

export const metadata: Metadata = {
  title: 'AgentsClan Store — Premium Streetwear',
  description: 'Premium streetwear for builders, degens, and digital rebels. Free shipping over $100.',
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0a0a0a] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
