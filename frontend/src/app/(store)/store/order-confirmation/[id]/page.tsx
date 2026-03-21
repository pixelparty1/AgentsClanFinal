'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg w-full text-center"
      >
        {/* Success icon */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-2xl scale-150" />
          <div className="relative w-24 h-24 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center">
            <CheckCircle size={48} className="text-[#34D399]" />
          </div>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">
          Thank You!
        </h1>
        <p className="text-[#888] text-lg mb-2">
          Your order has been placed successfully.
        </p>

        {/* Order ID */}
        <div className="inline-flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg px-5 py-3 mt-4 mb-8">
          <Package size={16} className="text-[#34D399]" />
          <span className="text-[#888] text-sm">Order ID:</span>
          <span className="text-white font-bold text-sm tracking-wider">{orderId}</span>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6 mb-8 text-left">
          <h3 className="text-white text-sm font-semibold mb-3">What&apos;s next?</h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 text-[#888] text-sm">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
              You&apos;ll receive an order confirmation email shortly.
            </li>
            <li className="flex items-start gap-2.5 text-[#888] text-sm">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
              We&apos;ll notify you when your order ships (usually 2-3 business days).
            </li>
            <li className="flex items-start gap-2.5 text-[#888] text-sm">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
              Track your delivery status from your account dashboard.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/store/collection"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] hover:bg-[#34D399] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-200 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
          >
            CONTINUE SHOPPING <ArrowRight size={16} />
          </Link>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#222] hover:border-[#444] text-[#aaa] font-medium text-sm rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
