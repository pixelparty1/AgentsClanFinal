'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, Gem, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/lib/store-data';
import { productsApi } from '@/lib/api';

export default function StoreHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await productsApi.list();
        const dbProducts = response.data?.items || [];
        const transformedProducts: Product[] = dbProducts.map((p: any) => ({
          id: p.$id,
          handle: p.handle,
          title: p.name,
          price: p.price,
          images: p.image_url ? [p.image_url] : [],
          category: p.category,
          badge: undefined,
          description: p.description || '',
          details: [],
          rating: 0,
          reviews: 0,
          inStock: p.stock !== false,
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const featured = products.slice(0, 4);
  const newDrops = products.filter((p) => p.badge === 'New' || p.badge === 'Limited');

  return (
    <main className="min-h-screen">
      {/* ═══ Hero Banner ═══ */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/store/bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h1 className="text-white text-7xl md:text-[9rem] lg:text-[12rem] font-black italic uppercase leading-[0.85] tracking-tight mix-blend-difference">
              AGENTS
              <br />
              CLAN.
            </h1>

            <Link
              href="/store/collection"
              className="inline-flex items-center justify-center px-16 md:px-24 py-5 md:py-6 mt-10 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white text-sm md:text-base font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:tracking-[0.4em]"
            >
              VIEW THE COLLECTION
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ Latest Collection ═══ */}
      <section className="px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sparkles size={20} className="text-[#10B981]" />
            <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-[0.1em]">
              LATEST COLLECTION
            </h2>
            <Sparkles size={20} className="text-[#10B981]" />
          </div>
          <p className="text-[#666] text-sm tracking-wide">
            Handpicked pieces from our newest drop
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/store/collection"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#222] hover:border-[#10B981]/50 text-white/70 hover:text-white text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            VIEW ALL PRODUCTS <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ Lookbook / Promo Banner ═══ */}
      {/* ═══ Featured Drops ═══ */}
      {newDrops.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 pb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Sparkles size={20} className="text-[#10B981]" />
              <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-[0.1em]">
                FEATURED DROPS
              </h2>
              <Sparkles size={20} className="text-[#10B981]" />
            </div>
            <p className="text-[#666] text-sm tracking-wide">
              Limited releases &amp; new arrivals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {newDrops.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ Value Props ═══ */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Free Shipping', desc: 'On all orders over ₹8,000. Worldwide delivery.', Icon: Truck },
            { title: 'Premium Quality', desc: 'Heavyweight fabrics, detailed craftsmanship.', Icon: Gem },
            { title: '30-Day Returns', desc: 'Not your vibe? Send it back, no questions.', Icon: RotateCcw },
          ].map((v) => (
            <div
              key={v.title}
              className="bg-[#111] border border-[#1a1a1a] rounded-xl p-8 text-center hover:border-[#10B981]/20 transition-all duration-300 group"
            >
              <v.Icon size={24} className="text-[#10B981] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-2">
                {v.title}
              </h4>
              <p className="text-[#666] text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
