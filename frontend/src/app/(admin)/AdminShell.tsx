'use client';

import { useAdmin } from '@/context/AdminContext';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  ShoppingBag,
  Package,
  Users,
  Swords,
  Briefcase,
  Bell,
  BarChart3,
  LogOut,
  Wallet,
  Shield,
  Loader2,
  Settings,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { RealtimeNotifications } from '@/components/admin/RealtimeNotifications';
import { useAdminStore } from '@/lib/admin-store';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/memberships', label: 'Memberships', icon: Users },
  { href: '/admin/quests', label: 'Quests', icon: Swords },
  { href: '/admin/applications', label: 'Applications', icon: Briefcase },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { 
    isAdmin, 
    isLoading, 
    walletAddress, 
    googleEmail, 
    googleName, 
    googleImage,
  } = useAdmin();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  
  const { sidebarCollapsed, toggleSidebar } = useAdminStore();

  const handleWalletConnect = async () => {
    try {
      await connectAsync({ connector: injected({ target: 'metaMask' }) });
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/admin' });
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const handleLogout = async () => {
    // Clear admin session from sessionStorage
    sessionStorage.removeItem('adminSession');
    if (isConnected) {
      disconnect();
    }
    if (googleEmail) {
      await signOut({ callbackUrl: '/sign-up' });
    } else {
      window.location.href = '/sign-up';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          <p className="text-emerald-400/70">Verifying access...</p>
        </motion.div>
      </div>
    );
  }

  // DEVELOPMENT MODE: Skip login requirement
  // TODO: Remove this bypass before production
  // if (!isConnected && !googleEmail) {
  if (false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="relative rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-8 text-center backdrop-blur-sm">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="relative">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-emerald-400/60 mb-6">
                Sign in to access the admin dashboard.
              </p>
              
              {/* Google Login */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-6 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-900/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#0a0f0d] text-gray-500">or</span>
                </div>
              </div>

              {/* Wallet Connect */}
              <button
                onClick={handleWalletConnect}
                className="w-full py-3 px-6 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-3"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Not admin state - connected but not authorized
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="relative rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center backdrop-blur-sm">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent" />
            <div className="relative">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-red-400/60 mb-4">
                {googleEmail 
                  ? "Your Google account does not have admin privileges."
                  : "Your wallet does not have admin privileges."}
              </p>
              <p className="text-xs text-gray-500 font-mono mb-6 break-all">
                {googleEmail || walletAddress}
              </p>
              
              {/* Try another method */}
              {!googleEmail && !isConnected && (
                <div className="mb-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
                  <p className="text-sm text-emerald-400/70 mb-3">Try another sign-in method:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGoogleSignIn}
                      className="flex-1 py-2 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      onClick={handleWalletConnect}
                      className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-6 rounded-xl border border-red-500/30 text-red-400 font-medium hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors text-center"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: sidebarCollapsed ? -64 : -280 }}
        animate={{ x: 0, width: sidebarCollapsed ? 80 : 256 }}
        className={`fixed left-0 top-0 h-screen border-r border-emerald-900/30 bg-[#080c0a] flex flex-col z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-emerald-900/30">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">AgentsClan</h1>
                <p className="text-xs text-emerald-400/60">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-2 border-t border-emerald-900/30">
          {googleEmail ? (
            <div className={`px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
              {googleImage ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={googleImage} 
                    alt={googleName || 'Profile'} 
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  {!sidebarCollapsed && (
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-emerald-400 truncate">{googleName}</p>
                      <p className="text-xs text-emerald-400/60 truncate">{googleEmail}</p>
                    </div>
                  )}
                </div>
              ) : (
                !sidebarCollapsed && (
                  <div>
                    <p className="text-xs text-emerald-400/60 mb-1">Signed in as</p>
                    <p className="text-xs truncate text-emerald-400">{googleEmail}</p>
                  </div>
                )
              )}
            </div>
          ) : walletAddress && (
            <div className={`px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs text-emerald-400/60 mb-1">Connected Wallet</p>
                    <p className="text-xs font-mono truncate text-emerald-400">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
            className={`mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors ${sidebarCollapsed ? 'px-2' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && 'Sign Out'}
          </button>
        </div>
        
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 h-16 border-b border-emerald-900/30 bg-[#080c0a]/95 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RealtimeNotifications />
            {/* User Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {googleImage ? (
                <img src={googleImage} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <Wallet className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs text-emerald-400 font-medium">
                {googleName || (walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Admin')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-screen p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
