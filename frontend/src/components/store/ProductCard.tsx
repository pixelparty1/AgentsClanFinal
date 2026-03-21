'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/store-data';

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: product.sizes ? product.sizes[1] : undefined,
    });
    toast.success(`${product.title} added!`, {
      style: { background: '#191919', color: '#fff', border: '1px solid #333' },
      iconTheme: { primary: '#10B981', secondary: '#fff' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/store/products/${product.handle}`} className="group block">
        {/* Image container */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#111] border border-[#1a1a1a] group-hover:border-[#10B981]/60 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-4">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[#10B981] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              {product.badge}
            </span>
          )}

          {/* Sale badge */}
          {product.compareAtPrice && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-[#FF2D78] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}

          {/* Quick Add - circular purple button */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#34D399] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer hover:scale-110"
          >
            <ShoppingBag size={16} />
          </button>

          {/* Purple overlay glow on hover */}
          <div className="absolute inset-0 bg-[#10B981]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Noise texture overlay */}
          <div className="absolute inset-0 store-noise-overlay opacity-[0.015] pointer-events-none" />
        </div>

        {/* Product info */}
        <h3 className="text-white text-sm font-semibold group-hover:text-[#34D399] transition-colors duration-200 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-white text-sm font-bold">₹{product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-[#555] text-xs line-through">₹{product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
