'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();
  const shipping = sub >= 8000 ? 0 : 499;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-6">
            <ShoppingBag size={32} className="text-[#555]" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-[#888] text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/store/collection"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] hover:bg-[#34D399] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-200 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
          >
            <ShoppingBag size={16} /> START SHOPPING
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-20 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-wide pt-8 pb-8">
          Your Cart <span className="text-[#555] text-lg font-normal">({items.length} item{items.length !== 1 ? 's' : ''})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 bg-[#111] border border-[#1a1a1a] rounded-2xl p-4 md:p-5"
              >
                {/* Image */}
                <Link href={`/store/products/${item.handle}`} className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-[#191919]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/store/products/${item.handle}`} className="text-white text-sm font-semibold hover:text-[#34D399] transition-colors line-clamp-1">
                    {item.title}
                  </Link>
                  {item.size && (
                    <p className="text-[#555] text-xs mt-1">Size: {item.size}</p>
                  )}
                  <p className="text-white text-sm font-bold mt-2">₹{item.price.toFixed(2)}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-[#222] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="px-3 py-1.5 text-[#888] hover:text-white hover:bg-[#191919] transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1.5 text-white text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="px-3 py-1.5 text-[#888] hover:text-white hover:bg-[#191919] transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-[#555] hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/store/collection"
              className="inline-flex items-center gap-2 text-[#888] hover:text-white text-sm transition-colors mt-4"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 sticky top-[120px]">
              <h3 className="text-white text-lg font-bold mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888]">Subtotal</span>
                  <span className="text-white font-medium">₹{sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Shipping</span>
                  <span className="text-white font-medium">
                    {shipping === 0 ? (
                      <span className="text-[#34D399]">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {sub < 8000 && (
                  <p className="text-xs text-[#10B981]/70">
                    Add ₹{(8000 - sub).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-white/6 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/store/checkout"
                className="flex items-center justify-center gap-2 w-full mt-6 py-4 bg-[#10B981] hover:bg-[#34D399] text-white font-bold text-sm uppercase tracking-[0.15em] rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </Link>

              {/* Payment badges */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {['Visa', 'MC', 'UPI', 'BTC'].map((m) => (
                  <span key={m} className="px-2 py-0.5 bg-[#191919] rounded text-[9px] text-[#555] font-medium uppercase border border-[#222]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
