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

export const products: Product[] = [];

export const categories = ['All', 'Hoodies', 'T-Shirts', 'Outerwear', 'Bottoms', 'Accessories'];

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}
