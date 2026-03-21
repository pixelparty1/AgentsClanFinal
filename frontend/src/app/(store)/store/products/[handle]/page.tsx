'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus } from 'lucide-react';
import { getProductByHandle, getRelatedProducts } from '@/lib/store-data';
import ProductImageGallery from '@/components/store/ProductImageGallery';
import AddToCartButton from '@/components/store/AddToCartButton';
import ProductCard from '@/components/store/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const handle = params.handle as string;
  const product = getProductByHandle(handle);

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-3">Product Not Found</h1>
          <p className="text-[#888] mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/store/collection" className="text-[#34D399] hover:underline">
            ← Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  const related = getRelatedProducts(product.id, 4);

  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-20 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#555] pt-6 pb-8">
        <Link href="/store" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/store/collection" className="hover:text-white transition-colors">Collection</Link>
        <ChevronRight size={12} />
        <span className="text-[#aaa]">{product.title}</span>
      </div>

      {/* Product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Images */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProductImageGallery images={product.images} title={product.title} />
        </motion.div>

        {/* Right: Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Badge */}
          {product.badge && (
            <span className="inline-block px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {product.badge}
            </span>
          )}

          <h1 className="text-white text-3xl md:text-4xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#333]'}
                />
              ))}
            </div>
            <span className="text-[#888] text-sm">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-5">
            <span className="text-white text-3xl font-bold">₹{product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-[#555] text-lg line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                <span className="px-2 py-0.5 bg-[#FF2D78]/10 text-[#FF2D78] text-xs font-bold rounded">
                  -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-[#888] text-sm mt-5 leading-relaxed">{product.description}</p>

          {/* Size selector */}
          {product.sizes && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-sm font-semibold">Size</span>
                <button className="text-[#34D399] text-xs hover:underline cursor-pointer">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#10B981] text-white border-[#10B981]'
                        : 'bg-[#141414] text-[#aaa] border-[#222] hover:border-[#10B981]/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <span className="text-white text-sm font-semibold block mb-3">Quantity</span>
            <div className="inline-flex items-center border border-[#222] rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-[#888] hover:text-white hover:bg-[#141414] transition-colors cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="px-5 py-3 text-white text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 py-3 text-[#888] hover:text-white hover:bg-[#141414] transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCartButton product={product} selectedSize={selectedSize} quantity={quantity} />
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { icon: Truck, text: 'Free Shipping' },
              { icon: Shield, text: 'Secure Payment' },
              { icon: RotateCcw, text: '30-Day Returns' },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.text} className="flex flex-col items-center gap-1.5 py-3 bg-[#111] rounded-lg border border-[#1a1a1a]">
                  <Icon size={16} className="text-[#10B981]" />
                  <span className="text-[#888] text-[11px] font-medium">{badge.text}</span>
                </div>
              );
            })}
          </div>

          {/* Product details */}
          <div className="mt-8 border-t border-white/6 pt-6">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Product Details</h3>
            <ul className="space-y-2">
              {product.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[#888] text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-white/6">
          <h2 className="text-white text-2xl font-bold uppercase tracking-wide mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
