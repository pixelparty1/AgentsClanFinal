'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { products, categories } from '@/lib/store-data';

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  let filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-8 pb-10 md:pt-12 md:pb-14"
      >
        <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-[0.1em] text-center">
          THE COLLECTION
        </h1>
        <p className="text-[#666] text-sm text-center mt-3 max-w-lg mx-auto">
          Every piece designed for builders who move different. Limited runs, premium materials.
        </p>
      </motion.div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/6">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#141414] text-[#888] border border-[#222] hover:border-[#10B981]/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#141414] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-[#aaa] outline-none cursor-pointer"
        >
          <option value="default">Sort by: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name: A → Z</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-[#666] text-sm mb-6">
        Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[#666] text-lg">No products found in this category.</p>
        </div>
      )}
    </main>
  );
}
