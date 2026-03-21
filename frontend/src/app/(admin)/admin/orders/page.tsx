'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Eye, ChevronDown } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { getOrders, updateOrderStatus, type Order } from '@/lib/admin';

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  paid: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-red-500/20 text-red-400',
  refunded: 'bg-gray-500/20 text-gray-400',
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  paid: <CheckCircle className="w-4 h-4" />,
  processing: <Package className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
  refunded: <XCircle className="w-4 h-4" />,
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingStatus(orderId);
    try {
      await updateOrderStatus(orderId, newStatus as Order['status']);
      setOrders(orders.map(order => 
        order.$id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  }

  function viewOrderDetails(order: Order) {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.$id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_wallet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <GradientHeading as="h1" className="text-3xl mb-2">
          Orders
        </GradientHeading>
        <p className="text-gray-400">Track and manage customer orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold">{orderStats.total}</p>
            <p className="text-sm text-gray-400">Total Orders</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/20 text-center">
            <p className="text-2xl font-bold text-amber-400">{orderStats.pending}</p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-purple-900/30 bg-purple-950/20 text-center">
            <p className="text-2xl font-bold text-purple-400">{orderStats.processing}</p>
            <p className="text-sm text-gray-400">Processing</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-cyan-900/30 bg-cyan-950/20 text-center">
            <p className="text-2xl font-bold text-cyan-400">{orderStats.shipped}</p>
            <p className="text-sm text-gray-400">Shipped</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">{orderStats.delivered}</p>
            <p className="text-sm text-gray-400">Delivered</p>
          </div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by order ID, wallet, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Order ID</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Customer</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Amount</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Payment</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Date</th>
                <th className="px-6 py-4 text-right text-sm text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.$id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">
                        {order.$id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.shipping_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {order.user_wallet?.slice(0, 6)}...{order.user_wallet?.slice(-4)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ['paid', 'processing', 'shipped', 'delivered'].includes(order.status)
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ['cancelled', 'refunded'].includes(order.status)
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) 
                          ? 'paid' 
                          : order.status === 'pending' 
                          ? 'pending' 
                          : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.$id, e.target.value as OrderStatus)}
                          disabled={updatingStatus === order.$id}
                          className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-sm font-medium ${
                            STATUS_COLORS[order.status as OrderStatus]
                          } bg-opacity-20 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer disabled:opacity-50`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {STATUS_ICONS[order.status as OrderStatus]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(order.$createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-sm text-gray-400 font-mono">{selectedOrder.$id}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                STATUS_COLORS[selectedOrder.status as OrderStatus]
              }`}>
                {selectedOrder.status}
              </span>
            </div>
            
            {/* Customer Info */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p>{selectedOrder.shipping_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Wallet</p>
                  <p className="font-mono text-xs">{selectedOrder.user_wallet}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p>{selectedOrder.shipping_email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p>{selectedOrder.shipping_phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
              <h3 className="font-medium mb-3">Shipping Address</h3>
              <p className="text-sm text-gray-300">
                {selectedOrder.shipping_address || 'N/A'}<br />
                {selectedOrder.shipping_city && `${selectedOrder.shipping_city}, `}
                {selectedOrder.shipping_state && `${selectedOrder.shipping_state} `}
                {selectedOrder.shipping_pincode}
              </p>
            </div>

            {/* Order Summary */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
              <h3 className="font-medium mb-3">Payment Information</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Payment Status</span>
                <span className={`px-2 py-1 rounded-full ${
                  ['paid', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status)
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {['paid', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'paid' : selectedOrder.status}
                </span>
              </div>
              {selectedOrder.stripe_session_id && (
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Stripe Session</span>
                  <span className="font-mono text-xs">{selectedOrder.stripe_session_id.slice(0, 20)}...</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold mt-4 pt-4 border-t border-emerald-900/20">
                <span>Total</span>
                <span className="text-emerald-400">{formatPrice(selectedOrder.total_price)}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 rounded-xl border border-emerald-900/30 text-gray-400 hover:text-white hover:border-emerald-500/30 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
