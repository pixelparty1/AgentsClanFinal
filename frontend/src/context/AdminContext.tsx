'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import { isOwnerWallet } from '@/lib/admin';
import { isAdminEmail } from '@/lib/auth';

type AuthMethod = 'wallet' | 'google' | 'both' | null;

interface AdminContextValue {
  isAdmin: boolean;
  isLoading: boolean;
  walletAddress: string | undefined;
  // Google OAuth
  googleEmail: string | null;
  googleName: string | null;
  googleImage: string | null;
  // Auth method
  authMethod: AuthMethod;
  isWalletAdmin: boolean;
  isGoogleAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  isLoading: true,
  walletAddress: undefined,
  googleEmail: null,
  googleName: null,
  googleImage: null,
  authMethod: null,
  isWalletAdmin: false,
  isGoogleAdmin: false,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for both wallet and Google session to settle
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isConnected, address, sessionStatus]);

  // Check for admin session stored in sessionStorage (from email/password login)
  let hasAdminSession = false;
  try {
    if (typeof window !== 'undefined') {
      const adminSession = sessionStorage.getItem('adminSession');
      if (adminSession) {
        const parsed = JSON.parse(adminSession);
        if (parsed.email && parsed.role) {
          hasAdminSession = true;
        }
      }
    }
  } catch (error) {
    console.error('Failed to parse admin session:', error);
  }

  // Check wallet admin
  const isWalletAdmin = isConnected && isOwnerWallet(address);
  
  // Check Google admin
  const isGoogleAdmin = session?.user?.email ? isAdminEmail(session.user.email) : false;
  
  // Admin is authenticated via email/password, wallet, or Google OAuth
  const isAdmin = hasAdminSession || isWalletAdmin || isGoogleAdmin;

  // Determine auth method
  let authMethod: AuthMethod = null;
  if (hasAdminSession) {
    authMethod = 'wallet'; // email/password is treated as wallet auth in this context
  } else if (isWalletAdmin && isGoogleAdmin) {
    authMethod = 'both';
  } else if (isWalletAdmin) {
    authMethod = 'wallet';
  } else if (isGoogleAdmin) {
    authMethod = 'google';
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoading: isLoading || sessionStatus === 'loading',
        walletAddress: address,
        googleEmail: session?.user?.email ?? null,
        googleName: session?.user?.name ?? null,
        googleImage: session?.user?.image ?? null,
        authMethod,
        isWalletAdmin,
        isGoogleAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
