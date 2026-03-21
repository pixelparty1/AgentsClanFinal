'use client';

import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/store-data';

interface Props {
  product: Product;
  selectedSize?: string;
  quantity: number;
}

export default function AddToCartButton({ product, selectedSize, quantity }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (product.sizes && !selectedSize) {
      toast.error('Please select a size', {
        style: { background: '#191919', color: '#fff', border: '1px solid #333' },
      });
      return;
    }

    addItem(
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
      },
      quantity
    );

    setAdded(true);
    toast.success('Added to cart ✓', {
      style: { background: '#191919', color: '#fff', border: '1px solid #333' },
      iconTheme: { primary: '#10B981', secondary: '#fff' },
    });

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
        added
          ? 'bg-[#059669] text-white'
          : 'bg-[#10B981] hover:bg-[#34D399] text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
      }`}
    >
      {added ? (
        <>
          <Check size={18} /> ADDED TO CART
        </>
      ) : (
        <>
          <ShoppingBag size={18} /> ADD TO CART
        </>
      )}
    </button>
  );
}
