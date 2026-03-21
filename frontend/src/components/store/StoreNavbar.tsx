'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/store' },
  { label: 'Collection', href: '/store/collection' },
];

export default function StoreNavbar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(totalItems());
  }, [totalItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 md:px-8 py-2 backdrop-blur-xl border rounded-full w-[92%] md:w-auto max-w-7xl h-[60px] md:h-[70px] flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-[#0b1a13]/70 border-[#00ff88]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_1px_0_rgba(0,255,136,0.1)]' : 'bg-black/30 border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'}`}>
        {/* Subtle green glow under navbar */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent blur-sm pointer-events-none" />

        {/* Left Side (Logo + Desktop Nav Links) */}
        <div className="flex items-center gap-8 md:gap-10">
          {/* Logo */}
          <Link href="/home" className="relative w-[350px] md:w-[420px] h-[90px] md:h-[105px] hover:drop-shadow-[0_0_12px_rgba(0,255,136,0.4)] transition-all duration-300">
            <Image
              src="/logo.png"
              alt="AgentsClan"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[#e6fff5]/80 text-[14px] font-medium tracking-wide hover:text-[#00ff88] transition-all duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#00ff88] to-[#00ff88]/0 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
              </Link>
            ))}
            <Link
              href="/store/collection"
              className="px-4 py-1.5 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black text-[12px] font-semibold tracking-wide rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] active:scale-95 whitespace-nowrap"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full text-[#e6fff5]/60 hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-all duration-200 cursor-pointer">
            <Search size={18} />
          </button>

          <Link
            href="/store/cart"
            className="relative p-2 rounded-full text-[#e6fff5]/60 hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-all duration-200"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#00ff88] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,255,136,0.5)]"
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-[#e6fff5]/60 hover:text-[#00ff88] hover:bg-[#00ff88]/10 transition-all duration-200 cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="border-t border-[#00ff88]/10 px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-[#e6fff5]/70 hover:text-[#00ff88] hover:bg-[#00ff88]/10 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/store/collection"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-3 mt-2 bg-[#00ff88] text-black text-sm font-bold uppercase tracking-wider rounded-full hover:shadow-[0_0_24px_rgba(0,255,136,0.4)]"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
