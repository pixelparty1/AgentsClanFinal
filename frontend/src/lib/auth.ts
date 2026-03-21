/* ══════════════════════════════════════════════════════════════════════════════
   NextAuth Configuration
   Supports Google OAuth + Wallet verification for admin access
   ══════════════════════════════════════════════════════════════════════════════ */

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// Allowed admin emails (Google OAuth)
export const ALLOWED_ADMIN_EMAILS = [
  'owner@agentsclan.xyz',
  // Add more admin emails here
  process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

// Allowed admin wallet addresses
export const ALLOWED_ADMIN_WALLETS = [
  process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS?.toLowerCase(),
  // Add more admin wallets here
].filter(Boolean) as string[];

// Check if email is an admin
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );
}

// Check if wallet is an admin
export function isAdminWallet(walletAddress: string | null | undefined): boolean {
  if (!walletAddress) return false;
  return ALLOWED_ADMIN_WALLETS.some(
    (adminWallet) => adminWallet?.toLowerCase() === walletAddress.toLowerCase()
  );
}

// Check if user is admin (either by email or wallet)
export function isAdmin(
  email: string | null | undefined,
  walletAddress: string | null | undefined
): boolean {
  return isAdminEmail(email) || isAdminWallet(walletAddress);
}

// Determine secret: prefer NEXTAUTH_SECRET/AUTH_SECRET, allow a dev fallback to avoid server misconfiguration errors in development
const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? process.env.SECRET ??
  (process.env.NODE_ENV === 'development' ? 'dev-secret' : undefined);

// Register providers only when credentials are present to avoid server misconfiguration errors
const providers = [] as any[];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
} else if (process.env.NODE_ENV === 'development') {
  // In development it's helpful to warn instead of throwing so the app stays up
  // and developers see a clear message in the server console.
  // eslint-disable-next-line no-console
  console.warn(
    'Google OAuth provider not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in.'
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow admin emails to sign in
      return isAdminEmail(user.email);
    },
    async session({ session }) {
      // Add admin flag to session
      if (session.user) {
        (session.user as { isAdmin?: boolean }).isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin after successful login
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return `${baseUrl}/admin`;
    },
  },
  session: {
    strategy: 'jwt',
  },
  // Supply secret if available. Auth.js requires a secret for production; fallback used only for local development.
  secret: NEXTAUTH_SECRET,
});

// Auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}
