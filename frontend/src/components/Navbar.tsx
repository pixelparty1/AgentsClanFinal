'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useSession } from 'next-auth/react';

const Navbar = () => {
    const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for short address
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const navLinks = [
        { name: 'Membership', href: '/membership', hasDropdown: false },
        { 
            name: 'Events', 
            href: '/events', 
            hasDropdown: true,
            dropdownItems: ['Upcoming Events', 'Past Events', 'Achievements']
        },
        { 
            name: 'Rewards', 
            href: '/rewards', 
            hasDropdown: true, 
            dropdownItems: ['Daily Quests', 'Leaderboard', 'Store'] 
        },
        { 
            name: 'Community', 
            href: '/community', 
            hasDropdown: true, 
            dropdownItems: ['Careers', 'Testimonials', 'Book a Call'] 
        },
    ];

    const dropdownHrefs: Record<string, string> = {
        'Upcoming Events': '/events',
        'Past Events': '/events#past',
        'Achievements': '/achievements',
        'Daily Quests': '/rewards/daily-quests',
        'Leaderboard': '/rewards/leaderboard',
        'Store': '/store',
        'Careers': '/community/careers',
        'Testimonials': '/community/testimonials',
        'Book a Call': '/book-a-call',
    };

    const toggleDropdown = (name: string) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    return (
        <>
        <nav className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 md:px-8 py-3 backdrop-blur-xl border rounded-full w-[92%] md:w-auto max-w-7xl h-[56px] md:h-[68px] flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-[#0b1a13]/70 border-[#00ff88]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_1px_0_rgba(0,255,136,0.1)]' : 'bg-black/30 border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'}`}>
            {/* Subtle green glow under navbar */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent blur-sm pointer-events-none" />

            {/* Left Side (Logo + Desktop Nav Links) */}
            <div className="flex items-center gap-8 md:gap-10">
                {/* Logo */}
                <Link href="/" className="relative w-[300px] md:w-[350px] h-[80px] md:h-[95px] hover:drop-shadow-[0_0_12px_rgba(0,255,136,0.4)] transition-all duration-300">
                    <Image
                        src="/logo.png"
                        alt="AgentsClan"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Dashboarsession signed in */}
                    {mounted && isConnected && address && (
                        <Link
                            href="/dashboard"
                            className="relative flex items-center gap-1.5 text-[#e6fff5]/80 text-[14px] font-semibold tracking-wide hover:text-[#00ff88] transition-all duration-300 py-2 px-4 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 shadow-[0_0_8px_rgba(0,255,136,0.10)]"
                        >
                            Dashboard
                        </Link>
                    )}
                    {navLinks.map((link) => (
                        <div 
                            key={link.name} 
                            className="relative group"
                            onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                            onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className="relative flex items-center gap-1.5 text-[#e6fff5]/80 text-[14px] font-medium tracking-wide hover:text-[#00ff88] transition-all duration-300 py-2"
                            >
                                {link.name}
                                {link.hasDropdown && <ChevronDown size={13} className="text-[#e6fff5]/50 group-hover:text-[#00ff88] transition-colors duration-300" />}
                                {/* Glow underline on hover */}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#00ff88] to-[#00ff88]/0 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
                            </Link>

                            {/* Desktop Dropdown */}
                            {link.hasDropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute top-full left-0 mt-3 w-52 bg-[#0b1a13]/90 border border-[#00ff88]/15 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_1px_rgba(0,255,136,0.1)] backdrop-blur-2xl overflow-hidden"
                                        >
                                            <div className="flex flex-col py-2">
                                                {link.dropdownItems?.map((item) => (
                                                    <Link
                                                        key={item}
                                                        href={dropdownHrefs[item] ?? '#'}
                                                        className="px-5 py-3 text-[13px] font-medium text-[#e6fff5]/70 hover:bg-[#00ff88]/10 hover:text-[#00ff88] transition-all duration-200"
                                                    >
                                                        {item}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Button (Desktop) */}
            <div className="hidden md:block">
              {mounted && isConnected && address ? (
                <button 
                  onClick={() => disconnect()}
                  className="group px-5 py-2.5 rounded-full border border-[#00ff88]/50 text-[#00ff88] text-sm font-mono font-semibold tracking-wide bg-[#00ff88]/5 backdrop-blur-sm hover:border-[#ff6b6b]/80 hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] transition-all duration-300 shadow-[0_0_12px_rgba(0,255,136,0.15)]"
                >
                  <span className="block group-hover:hidden">{shortAddress}</span>
                  <span className="hidden group-hover:block">Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      const metaMask = connectors.find(c => c.id === 'metaMask' || c.name === 'MetaMask');
                      if (metaMask) await connectAsync({ connector: metaMask });
                    } catch (err) {
                      console.error('Navbar Connect Error:', err);
                    }
                  }}
                  disabled={isConnecting}
                  className="relative group px-7 py-2.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] text-[#0b1a13] text-sm font-bold uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all duration-300 disabled:opacity-70 shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.45)]"
                >
                  {isConnecting ? 'Connecting...' : 'AWAKEN'}
                </button>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <button 
                className="md:hidden text-[#e6fff5] hover:text-[#00ff88] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 mt-4 w-full bg-[#0b1a13]/95 border border-[#00ff88]/15 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col px-6 py-6 gap-5">
                            {navLinks.map((link) => (
                                <div key={link.name} className="flex flex-col gap-3">
                                    <div 
                                        className="flex items-center justify-between text-[#e6fff5] text-base font-medium cursor-pointer"
                                        onClick={() => link.hasDropdown && toggleDropdown(link.name)}
                                    >
                                        <Link href={link.href ?? '#'} className="hover:text-[#00ff88] transition-colors duration-300">
                                            {link.name}
                                        </Link>
                                        {link.hasDropdown && (
                                            <ChevronDown 
                                                size={16} 
                                                className={`text-[#e6fff5]/50 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180 text-[#00ff88]' : ''}`} 
                                            />
                                        )}
                                    </div>
                                    
                                    {/* Mobile Dropdown Items */}
                                    <AnimatePresence>
                                        {link.hasDropdown && activeDropdown === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex flex-col gap-3 pl-4 border-l border-[#00ff88]/20"
                                            >
                                                {link.dropdownItems?.map((item) => (
                                                    <Link 
                                                        key={item} 
                                                        href={dropdownHrefs[item] ?? '#'} 
                                                        className="text-[#e6fff5]/60 text-sm hover:text-[#00ff88] transition-colors duration-200"
                                                    >
                                                        {item}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                            {/* Mobile Dsessionshow if signed in */}
                            {mounted && isConnected && address && (
                                <div className="flex justify-center">
                                    <Link
                                        href="/dashboard"
                                        className="text-[#e6fff5] text-base font-medium hover:text-[#00ff88] transition-colors duration-300 py-2 px-4"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            )}
                                    {/* Mobile Wallet / Awaken Button */}
                                    <div className="mt-6 pt-5 border-t border-[#00ff88]/10 w-full relative z-10 flex justify-center">
                                      {mounted && isConnected && address ? (
                                        <button 
                                          onClick={() => disconnect()}
                                          className="group px-6 py-3 rounded-full border border-[#00ff88]/50 text-[#00ff88] text-sm font-mono font-semibold tracking-wide bg-[#00ff88]/5 backdrop-blur-sm hover:border-[#ff6b6b]/80 hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] transition-all duration-300"
                                        >
                                          <span className="block group-hover:hidden">{shortAddress}</span>
                                          <span className="hidden group-hover:block">Disconnect</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={async () => {
                                            try {
                                              const metaMask = connectors.find(c => c.id === 'metaMask' || c.name === 'MetaMask');
                                              if (metaMask) await connectAsync({ connector: metaMask });
                                            } catch (err) {
                                              console.error('Mobile Navbar Connect Error:', err);
                                            }
                                          }}
                                          disabled={isConnecting}
                                          className="w-full relative group px-8 py-4 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] text-[#0b1a13] text-base font-bold uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all duration-300 disabled:opacity-70 shadow-[0_0_24px_rgba(0,255,136,0.3)]"
                                        >
                                          {isConnecting ? 'Connecting...' : 'AWAKEN'}
                                        </button>
                                      )}
                                    </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
        </>
    );
};

export default Navbar;
