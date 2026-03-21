
'use client';

// ProductImage component for image error handling
function ProductImage({ images, name }: { images: string; name: string }) {
  const [imageError, setImageError] = useState(false);
  try {
    const imageArr = JSON.parse(images);
    const firstImage = Array.isArray(imageArr) ? imageArr[0] : imageArr;
    if (firstImage && typeof firstImage === 'string') {
      // If the string is a full URL, use it directly
      const isUrl = firstImage.startsWith('http://') || firstImage.startsWith('https://');
      const src = isUrl
        ? firstImage
        : `https://cloud.appwrite.io/v1/storage/buckets/69ac2f1900366fd84f06/files/${firstImage}/preview?width=500&height=500&project=69a7f212001b0a737d22`;
      if (imageError) {
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/40">
            <Package className="w-16 h-16 text-emerald-900/50" />
          </div>
        );
      }
      return (
        <img
          key={`img-${firstImage}`}
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => {
            setImageError(true);
          }}
        />
      );
    }
  } catch (e) {
    console.error('Error parsing images:', e, images);
  }
  return <Package className="w-16 h-16 text-emerald-900/50" />;
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Package, DollarSign, Box } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from '@/lib/admin';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    price: '',
    category: 'general',
    stock: true,
    sizes: '',
    photos: [] as File[],
    active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter product name');
      return;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      alert('Please enter valid price');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    try {
      const payload = {
        name: formData.name,
        handle: formData.handle || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        stock: formData.stock,
        sizes: formData.sizes,
        active: formData.active,
      };

      let imageFileIds: string[] = [];
      
      // Upload images if any
      if (formData.photos && formData.photos.length > 0) {
        const formDataWithFiles = new FormData();
        formData.photos.forEach((photo) => {
          formDataWithFiles.append('files', photo);
        });
        
        try {
          const uploadResponse = await fetch('http://localhost:3001/api/products/upload', {
            method: 'POST',
            body: formDataWithFiles,
            headers: {
              'X-Wallet-Address': localStorage.getItem('walletAddress') || '',
            },
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            imageFileIds = uploadData.data?.fileIds || [];
          }
        } catch (uploadError) {
          console.warn('Failed to upload images:', uploadError);
        }
      }

      const finalPayload = {
        ...payload,
        images: imageFileIds,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.$id, finalPayload);
      } else {
        await createProduct(finalPayload);
      }
      
      fetchProducts();
      closeModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to save product:', error);
      alert(`Failed to save product: ${errorMessage}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  function openCreateModal() {
    setEditingProduct(null);
    setFormData({
      name: '',
      handle: '',
      description: '',
      price: '',
      category: 'general',
      stock: true,
      sizes: '',
      photos: [],
      active: true,
    });
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      handle: product.handle,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      stock: product.stock,
      sizes: typeof product.sizes === 'string' ? product.sizes : (product.sizes?.[0] || ''),
      photos: [],
      active: product.active,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <GradientHeading as="h1" className="text-3xl mb-2">
            Products
          </GradientHeading>
          <p className="text-gray-400">Manage merch store products and inventory.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No products found</div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              key={product.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlowCard>
                <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 overflow-hidden h-full">
                  {/* Product Image Placeholder */}
                  <div className="aspect-square bg-emerald-950/40 flex items-center justify-center relative overflow-hidden group">
                    {product.images && typeof product.images === 'string' && product.images.trim().length > 0 ? (
                      <ProductImage images={product.images} name={product.name} />
                    ) : (
                      <Package className="w-16 h-16 text-emerald-900/50" />
                    )}
                    {!product.active && (
                      <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 z-10">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Box className="w-4 h-4" />
                        <span>{product.stock ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-900/20">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.$id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Handle (URL slug)</label>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    placeholder="auto-generated"
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stock</label>
                  <select
                    value={formData.stock ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === 'true' })}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Upload Photos</label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, photos: Array.from(e.target.files || []) })}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-black hover:file:bg-emerald-400"
                  />
                </div>
                {formData.photos.length > 0 && (
                  <div className="mt-3 text-sm text-gray-400">
                    {formData.photos.length} file(s) selected
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="general">General</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Stickers">Stickers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sizes</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="e.g., small, medium, large"
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded bg-emerald-950/30 border-emerald-900/30 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-400">Active (visible in store)</span>
              </label>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-xl border border-emerald-900/30 text-gray-400 hover:text-white hover:border-emerald-500/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
