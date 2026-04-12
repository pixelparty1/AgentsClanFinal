'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Smartphone, Lock, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

type Step = 'review' | 'shipping' | 'payment';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>('review');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [processing, setProcessing] = useState(false);

  const sub = subtotal();
  const shipping = sub >= 8000 ? 0 : 499;
  const tax = sub * 0.18;
  const total = sub + shipping + tax;

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });

  const updateShipping = (field: string, val: string) =>
    setShippingInfo((p) => ({ ...p, [field]: val }));

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      const orderId = `AC-${Date.now().toString(36).toUpperCase()}`;
      clearCart();
      router.push(`/store/order-confirmation/${orderId}`);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-3">Nothing to checkout</h1>
          <Link href="/store/collection" className="text-[#34D399] hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'review', label: 'Review' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  const inputClasses = 'bg-[#141414] border border-[#222] rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#10B981]/50 transition-colors';

  return (
    <main className="min-h-screen px-6 md:px-12 lg:px-20 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="text-white text-3xl font-bold uppercase tracking-wide">Checkout</h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                  i <= currentIndex
                    ? 'bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20'
                    : 'bg-[#111] text-[#555] border border-[#222]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i <= currentIndex ? 'bg-[#10B981] text-white' : 'bg-[#222] text-[#666]'
                }`}>
                  {i + 1}
                </span>
                {s.label}
              </div>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-[#333]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* STEP 1: Review */}
            {step === 'review' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-white text-xl font-bold mb-5">Review Your Items</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4 bg-[#111] border border-[#1a1a1a] rounded-xl p-4"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#191919] flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold line-clamp-1">{item.title}</p>
                        {item.size && <p className="text-[#555] text-xs">Size: {item.size}</p>}
                        <p className="text-[#888] text-xs mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep('shipping')}
                  className="mt-8 px-8 py-3.5 bg-[#10B981] hover:bg-[#34D399] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                >
                  Continue to Shipping →
                </button>
              </motion.div>
            )}

            {/* STEP 2: Shipping */}
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-white text-xl font-bold mb-5">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={shippingInfo.firstName}
                    onChange={(e) => updateShipping('firstName', e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    placeholder="Last Name *"
                    value={shippingInfo.lastName}
                    onChange={(e) => updateShipping('lastName', e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={shippingInfo.email}
                    onChange={(e) => updateShipping('email', e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (+91) *"
                    value={shippingInfo.phone}
                    onChange={(e) => updateShipping('phone', e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={shippingInfo.address}
                    onChange={(e) => updateShipping('address', e.target.value)}
                    className={`md:col-span-2 ${inputClasses}`}
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={shippingInfo.city}
                    onChange={(e) => updateShipping('city', e.target.value)}
                    className={inputClasses}
                  />
                  <select
                    value={shippingInfo.state}
                    onChange={(e) => updateShipping('state', e.target.value)}
                    className={`${inputClasses} cursor-pointer`}
                  >
                    <option value="">Select State *</option>
                    {indianStates.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={shippingInfo.pincode}
                    onChange={(e) => updateShipping('pincode', e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={() => setStep('review')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#222] hover:border-[#444] text-[#aaa] font-medium text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className="px-8 py-3.5 bg-[#10B981] hover:bg-[#34D399] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-white text-xl font-bold mb-5">Payment Method</h2>

                {/* Method selector */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30'
                        : 'bg-[#111] text-[#888] border-[#222] hover:border-[#444]'
                    }`}
                  >
                    <CreditCard size={18} /> Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30'
                        : 'bg-[#111] text-[#888] border-[#222] hover:border-[#444]'
                    }`}
                  >
                    <Smartphone size={18} /> UPI
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <input type="text" placeholder="Card Number" className={`w-full ${inputClasses}`} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM / YY" className={inputClasses} />
                      <input type="text" placeholder="CVV" className={inputClasses} />
                    </div>
                    <input type="text" placeholder="Name on Card" className={`w-full ${inputClasses}`} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input type="text" placeholder="UPI ID (e.g. name@upi)" className={`w-full ${inputClasses}`} />
                    <div className="flex items-center gap-3">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <span
                          key={app}
                          className="px-4 py-2 bg-[#141414] border border-[#222] rounded-lg text-xs text-[#888] font-medium"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={() => setStep('shipping')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#222] hover:border-[#444] text-[#aaa] font-medium text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] hover:bg-[#34D399] text-white font-bold text-sm uppercase tracking-[0.15em] rounded-lg transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Lock size={14} />
                    {processing ? 'PROCESSING...' : `PAY ₹${total.toFixed(2)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 sticky top-[120px]">
              <h3 className="text-white text-lg font-bold mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm mb-5">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between">
                    <span className="text-[#888] line-clamp-1 flex-1 mr-2">
                      {item.title} {item.size ? `(${item.size})` : ''} × {item.quantity}
                    </span>
                    <span className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2.5 text-sm border-t border-white/6 pt-4">
                <div className="flex justify-between">
                  <span className="text-[#888]">Subtotal</span>
                  <span className="text-white">₹{sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Shipping</span>
                  <span className={shipping === 0 ? 'text-[#34D399]' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Tax (GST 18%)</span>
                  <span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/6 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
