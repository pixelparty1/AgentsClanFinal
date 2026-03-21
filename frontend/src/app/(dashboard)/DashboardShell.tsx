'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => setMounted(true), []);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <>
      {/* ── Top-right AWAKEN / Wallet button ──────────────────────────── */}
      <div className="fixed top-5 right-5 z-50">
        {mounted && isConnected && address ? (
          <button
            onClick={() => disconnect()}
            className="group px-5 py-2.5 rounded-full border border-[#00ff88]/50 text-[#00ff88] text-sm font-mono font-semibold tracking-wide bg-[#00ff88]/5 backdrop-blur-xl hover:border-[#ff6b6b]/80 hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] transition-all duration-300 shadow-[0_0_12px_rgba(0,255,136,0.15)]"
          >
            <span className="block group-hover:hidden">{shortAddress}</span>
            <span className="hidden group-hover:block">Disconnect</span>
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                const metaMask = connectors.find(
                  (c) => c.id === 'metaMask' || c.name === 'MetaMask',
                );
                if (metaMask) await connectAsync({ connector: metaMask });
              } catch (err) {
                console.error('Wallet Connect Error:', err);
              }
            }}
            disabled={isConnecting}
            className="relative group px-7 py-2.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] text-[#0b1a13] text-sm font-bold uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all duration-300 disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.45)]"
          >
            {isConnecting ? 'Connecting...' : 'AWAKEN'}
          </button>
        )}
      </div>

      {/* ── Page content ──────────────────────────────────────────────── */}
      {children}
    </>
  );
}
