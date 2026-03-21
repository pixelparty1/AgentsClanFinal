export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  badge?: string;
  description: string;
  details: string[];
  sizes?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    handle: 'agents-clan-hoodie-black',
    title: 'Agents Clan Hoodie — Black',
    price: 7499,
    compareAtPrice: 9999,
    images: [
      '/mentors/mentor0.jpg',
      '/mentors/mentor1.png',
      '/mentors/mentor2.jpg',
    ],
    category: 'Hoodies',
    badge: 'Best Seller',
    description:
      'Premium heavyweight hoodie featuring the iconic Agents Clan emblem. 400 GSM French terry, embroidered logo, oversized fit for maximum comfort. Built for late-night coding sessions and beyond.',
    details: [
      '400 GSM heavyweight French terry cotton',
      'Embroidered logo on chest & back',
      'Oversized relaxed fit',
      'Kangaroo pocket with hidden cord port',
      'Reinforced ribbed cuffs & hem',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviews: 142,
    inStock: true,
  },
  {
    id: '2',
    handle: 'neural-network-tee',
    title: 'Neural Network Tee',
    price: 3999,
    images: [
      '/mentors/mentor1.png',
      '/mentors/mentor2.jpg',
    ],
    category: 'T-Shirts',
    badge: 'New',
    description:
      'All-over neural network visualization print on premium cotton. A wearable piece of AI art for the forward-thinking builder.',
    details: [
      '220 GSM combed cotton',
      'All-over sublimation print',
      'Regular fit',
      'Ribbed crew neck',
      'Pre-shrunk fabric',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviews: 87,
    inStock: true,
  },
  {
    id: '3',
    handle: 'cyber-cap',
    title: 'Cyber Cap',
    price: 2999,
    images: [
      '/mentors/mentor0.jpg',
      '/mentors/bg.jpg',
    ],
    category: 'Accessories',
    description:
      'Structured 5-panel cap with laser-etched metal badge. Adjustable strap, breathable mesh back.',
    details: [
      'Structured 5-panel design',
      'Laser-etched metal logo badge',
      'Breathable mesh back panels',
      'Adjustable snapback closure',
      'One size fits most',
    ],
    rating: 4.9,
    reviews: 63,
    inStock: true,
  },
  {
    id: '4',
    handle: 'agents-clan-crewneck',
    title: 'Agents Clan Crewneck',
    price: 5999,
    compareAtPrice: 7499,
    images: [
      '/mentors/mentor2.jpg',
      '/mentors/bg1.jpg',
    ],
    category: 'Hoodies',
    badge: 'Limited',
    description:
      'Classic crewneck sweatshirt with puff-print logo. Midweight fleece that works for any season. Only 200 units produced.',
    details: [
      '350 GSM midweight fleece',
      'Puff-print logo on chest',
      'Relaxed fit',
      'Flat-lock seams for comfort',
      'Limited run — 200 units only',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.7,
    reviews: 38,
    inStock: true,
  },
  {
    id: '5',
    handle: 'dev-mode-joggers',
    title: 'Dev Mode Joggers',
    price: 5499,
    images: [
      '/mentors/mentor1.png',
      '/mentors/mentor0.jpg',
    ],
    category: 'Bottoms',
    description:
      'Technical joggers for the all-day grind. Zippered pockets, tapered leg, stretch waistband. Code in comfort.',
    details: [
      'Poly-cotton blend with stretch',
      'Zippered side pockets',
      'Elastic waistband with drawcord',
      'Tapered leg with ribbed cuffs',
      'Reflective logo detail',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 56,
    inStock: true,
  },
  {
    id: '6',
    handle: 'matrix-socks-3-pack',
    title: 'Matrix Socks — 3 Pack',
    price: 1999,
    images: [
      '/mentors/bg.jpg',
      '/mentors/mentor2.jpg',
    ],
    category: 'Accessories',
    badge: 'New',
    description:
      'Three pairs of premium crew socks with unique data-stream inspired patterns. Cushioned sole, arch support.',
    details: [
      'Combed cotton blend',
      '3 unique data-stream patterns',
      'Cushioned sole with arch support',
      'Reinforced heel and toe',
      'Machine washable',
    ],
    rating: 4.4,
    reviews: 29,
    inStock: true,
  },
  {
    id: '7',
    handle: 'code-breaker-jacket',
    title: 'Code Breaker Jacket',
    price: 10999,
    images: [
      '/mentors/mentor0.jpg',
      '/mentors/mentor1.png',
      '/mentors/bg1.jpg',
    ],
    category: 'Outerwear',
    badge: 'Premium',
    description:
      'Lightweight technical jacket with water-resistant shell. Hidden hood, multiple pockets, reflective accents for night visibility.',
    details: [
      'Water-resistant ripstop nylon shell',
      'Packable hidden hood',
      '4 zippered pockets + internal media pocket',
      'Reflective logo and accents',
      'Adjustable cuffs and hem',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviews: 71,
    inStock: true,
  },
  {
    id: '8',
    handle: 'debug-beanie',
    title: 'Debug Beanie',
    price: 2499,
    images: [
      '/mentors/mentor2.jpg',
      '/mentors/bg.jpg',
    ],
    category: 'Accessories',
    description:
      'Ribbed knit beanie with woven label. Double-layered for warmth. The dev essential for cold-weather coding.',
    details: [
      'Ribbed knit acrylic-wool blend',
      'Double-layered for warmth',
      'Woven logo label',
      'One size fits most',
      'Fold-over or slouch style',
    ],
    rating: 4.6,
    reviews: 44,
    inStock: true,
  },
];

export const categories = ['All', 'Hoodies', 'T-Shirts', 'Outerwear', 'Bottoms', 'Accessories'];

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}
