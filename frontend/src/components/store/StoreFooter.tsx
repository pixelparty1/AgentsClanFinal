'use client';

import Link from 'next/link';
import { ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'X' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

const policyLinks = [
  { label: 'Refund Policy', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Shipping Policy', href: '#' },
];

export default function StoreFooter() {
  const [email, setEmail] = useState('');

  return (
    <footer className="border-t border-white/4 bg-[#050505]">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Logo */}
        <Link href="/store" className="inline-flex items-center gap-2.5 mb-6">
          <img src="/logo.png" alt="AgentsClan" className="h-10 w-auto" />
          <span className="text-white text-2xl font-extrabold tracking-tight">
            STORE
          </span>
        </Link>

        <p className="text-[#666] text-sm max-w-md mx-auto leading-relaxed mb-8">
          Premium streetwear for builders, degens, and digital rebels. Built different. Worn different.
        </p>

        {/* Email subscribe */}
        <div className="flex max-w-sm mx-auto mb-10">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-[#111] border border-[#222] border-r-0 rounded-l-lg px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#10B981]/50 transition-colors"
          />
          <button className="bg-[#10B981] hover:bg-[#34D399] text-white px-5 rounded-r-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer">
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-5 mb-8">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#10B981]/40 hover:bg-[#10B981]/10 transition-all duration-200"
                aria-label={social.label}
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        {/* Policy links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          {policyLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#555] hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Payment icons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {['Visa', 'Mastercard', 'UPI', 'PayPal', 'BTC', 'ETH', 'USDT'].map((method) => (
            <span
              key={method}
              className="px-3 py-1.5 bg-[#111] rounded-md text-[10px] text-[#666] font-bold uppercase tracking-wider border border-[#1a1a1a]"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[#333] text-xs">
          © {new Date().getFullYear()} AgentsClan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
