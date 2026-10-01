import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    promoCode,
    promoDiscount,
    createOrder,
    userProfile,
    startChatAboutOrder,
    setActiveTab,
    setAccountSubTab,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    address: '422 Willow St',
    apt: 'Apt 4B',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '08/28',
    cardCvc: '888',
    discreetPackaging: true,
  });

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const submitTimerRef = useRef<number | null>(null);

  // Sync latest user profile whenever checkout opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || prev.name,
        email: userProfile.email || prev.email,
        phone: userProfile.phone || prev.phone,
        discreetPackaging: userProfile.discreetPackaging ?? prev.discreetPackaging,
      }));
      setValidationError('');
      setIsSubmitting(false);
    }
  }, [isCheckoutOpen, userProfile]);

  // Clean up submit timer on unmount
  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  if (!isCheckoutOpen) return null;

  const shippingCost = formData.deliveryMethod === 'express' ? 8 : cartSubtotal >= 40 ? 0 : 5;
  const total = Math.max(0, cartSubtotal - promoDiscount + shippingCost);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setValidationError('Please enter your full name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setValidationError('Please enter a valid email address for your order confirmation.');
      return false;
    }
    if (!formData.address.trim()) {
      setValidationError('Please enter your delivery street address.');
      return false;
    }
    if (!formData.city.trim()) {
      setValidationError('Please enter your city.');
      return false;
    }
    if (!formData.zip.trim() || formData.zip.trim().length < 3) {
      setValidationError('Please enter a valid postal / zip code.');
      return false;
    }
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        setValidationError('Please provide a payment card number.');
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cart.length === 0) {
      setValidationError('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);

    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
    }

    submitTimerRef.current = window.setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        image: item.product.images[0],
        colorName: item.selectedColor.name,
        size: item.selectedSize,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const newOrder = createOrder({
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim(),
        shippingAddress: `${formData.address.trim()}, ${
          formData.apt ? formData.apt.trim() + ', ' : ''
        }${formData.city.trim()}, ${formData.state.trim()} ${formData.zip.trim()}`,
        items: orderItems,
        subtotal: cartSubtotal,
        shipping: shippingCost,
        discount: promoDiscount,
        total,
        status: 'Confirmed',
        statusNote: 'Order received and entering gentle unbranded preparation.',
        trackingNumber: `TJ-TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
        carbonNeutral: true,
      });

      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      showToast(`Order #${newOrder.id} successfully placed!`, 'check_circle');
    }, 1200);
  };

  const handleFinish = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setAccountSubTab('orders');
    setActiveTab('account');
  };

  const handleChatAboutThisOrder = (orderId: string) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    startChatAboutOrder(orderId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!isSubmitting) setIsCheckoutOpen(false);
        }}
        className="fixed inset-0 bg-[#201a18]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-[#ffffff] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#d9c1be]/60 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-5 bg-[#f8ebe8] border-b border-[#d9c1be]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8c493f]">lock</span>
              <h3 className="font-serif text-xl text-[#201a18] font-medium">
                {completedOrder ? 'Order Confirmation' : 'Discreet Encrypted Checkout'}
              </h3>
            </div>
            {!isSubmitting && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ffdad4] text-[#534340] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {completedOrder ? (
            /* Order Success View */
            <div className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#d2e8d6] text-[#506355] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h3 className="font-serif text-2xl text-[#201a18]">
                  Thank you, {completedOrder.customerName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-[#534340]">
                  Your order <strong className="text-[#8c493f]">#{completedOrder.id}</strong> has been
                  confirmed. We’ve sent a digital receipt to {completedOrder.customerEmail}.
                </p>
              </div>

              {/* Status stepper */}
              <div className="p-4 rounded-xl bg-[#fef1ed] border border-[#ffdad4] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8c493f]">
                  <span>Status: {completedOrder.status}</span>
                  <span className="text-[#506355] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">local_shipping</span>
                    Carbon Neutral
                  </span>
                </div>
                <p className="text-xs text-[#534340]">{completedOrder.statusNote}</p>
                <div className="flex items-center justify-between text-[11px] text-[#867370] pt-1 border-t border-[#ffdad4]/60">
                  <span>Tracking Code: <strong>{completedOrder.trackingNumber}</strong></span>
                  <span>Total Charged: <strong className="text-[#201a18]">${completedOrder.total.toFixed(2)}</strong></span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#201a18] uppercase tracking-wider">
                  Ordered Items ({completedOrder.items.length})
                </h4>
                <div className="divide-y divide-[#d9c1be]/30 max-h-48 overflow-y-auto pr-1">
                  {completedOrder.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-12 object-cover rounded bg-[#f8ebe8]"
                        />
                        <div>
                          <p className="font-medium text-[#201a18]">{item.productName}</p>
                          <p className="text-[#867370]">
                            Size: {item.size} · {item.colorName} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#201a18]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#d9c1be]/40 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => handleChatAboutThisOrder(completedOrder.id)}
                  className="w-full sm:flex-1 py-3 rounded-full bg-[#f8ebe8] hover:bg-[#ffdad4] text-[#8c493f] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#d9c1be]/50"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>Discuss Order in Chat Concierge</span>
                </button>
                <button
                  onClick={handleFinish}
                  className="w-full sm:flex-1 py-3 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all cursor-pointer shadow-xs text-center"
                >
                  View in Order History
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart Guard */
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#f8ebe8] text-[#8c493f] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">shopping_basket</span>
              </div>
              <h4 className="font-serif text-xl text-[#201a18]">Your bag is empty</h4>
              <p className="text-xs text-[#534340] max-w-sm mx-auto">
                Please add your desired organic cotton or micro-modal essentials before completing
                checkout.
              </p>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveTab('shop');
                }}
                className="px-6 py-2.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all cursor-pointer"
              >
                Browse Shop Collection
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {validationError && (
                <div className="p-3 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{validationError}</span>
                </div>
              )}

              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8c493f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>1. Contact &amp; Shipping Address</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#534340] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#fff8f6] border border-[#d9c1be] rounded-lg px-3 py-2 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#534340] block mb-1">Email for Receipt</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#fff8f6] border border-[#d9c1be] rounded-lg px-3 py-2 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-[#534340] block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-[#fff8f6] border border-[#d9c1be] rounded-lg px-3 py-2 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#534340] block mb-1">Apartment / Suite</label>
                    <input
                      type="text"
                      value={formData.apt}
                      onChange={(e) => setFormData({ ...formData, apt: e.target.value })}
                      className="w-full bg-[#fff8f6] border border-[#d9c1be] rounded-lg px-3 py-2 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#534340] block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#fff8f6] border border-[#d9c1be] rounded-lg px-3 py-2 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#534340] block mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full bg-[#fff8f6] border border-[#d9c1be] rounded-lg px-3 py-2 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="space-y-3 pt-2 border-t border-[#d9c1be]/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8c493f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  <span>2. Delivery Speed</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                      formData.deliveryMethod === 'standard'
                        ? 'bg-[#ffdad4]/30 border-[#8c493f]'
                        : 'border-[#d9c1be] bg-[#fff8f6]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={formData.deliveryMethod === 'standard'}
                        onChange={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                        className="mt-0.5 text-[#8c493f] focus:ring-[#8c493f]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#201a18]">
                          Carbon-Neutral Ground
                        </p>
                        <p className="text-[11px] text-[#867370]">2–4 business days</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#506355]">
                      {cartSubtotal >= 40 ? 'FREE' : '$5.00'}
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                      formData.deliveryMethod === 'express'
                        ? 'bg-[#ffdad4]/30 border-[#8c493f]'
                        : 'border-[#d9c1be] bg-[#fff8f6]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={formData.deliveryMethod === 'express'}
                        onChange={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                        className="mt-0.5 text-[#8c493f] focus:ring-[#8c493f]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#201a18]">Priority Discreet</p>
                        <p className="text-[11px] text-[#867370]">1–2 business days</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#201a18]">$8.00</span>
                  </label>
                </div>
              </div>

              {/* Discreet Packaging Assurance */}
              <div className="p-3 rounded-xl bg-[#f8ebe8] border border-[#d9c1be]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8c493f]">inventory_2</span>
                  <span className="text-[#534340]">
                    Shipped in 100% unbranded recyclable kraft mailer for privacy
                  </span>
                </div>
                <span className="text-[#506355] font-semibold text-[11px]">Included Free</span>
              </div>

              {/* Payment selection */}
              <div className="space-y-3 pt-2 border-t border-[#d9c1be]/40">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8c493f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  <span>3. Payment Method</span>
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      formData.paymentMethod === 'card'
                        ? 'bg-[#201a18] text-[#ffffff] border-[#201a18]'
                        : 'border-[#d9c1be] text-[#534340] hover:bg-[#f8ebe8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">credit_card</span>
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'apple' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      formData.paymentMethod === 'apple'
                        ? 'bg-[#201a18] text-[#ffffff] border-[#201a18]'
                        : 'border-[#d9c1be] text-[#534340] hover:bg-[#f8ebe8]'
                    }`}
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'invoice' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      formData.paymentMethod === 'invoice'
                        ? 'bg-[#201a18] text-[#ffffff] border-[#201a18]'
                        : 'border-[#d9c1be] text-[#534340] hover:bg-[#f8ebe8]'
                    }`}
                  >
                    Pay on Invoice
                  </button>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="grid grid-cols-4 gap-2 p-3 bg-[#fff8f6] rounded-xl border border-[#d9c1be]">
                    <div className="col-span-2">
                      <label className="text-[10px] text-[#867370] block">Card Number</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        placeholder="16-digit card number"
                        className="w-full bg-transparent border-0 p-0 text-xs font-mono text-[#201a18] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#867370] block">Expires</label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full bg-transparent border-0 p-0 text-xs font-mono text-[#201a18] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#867370] block">CVC</label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        placeholder="CVC"
                        className="w-full bg-transparent border-0 p-0 text-xs font-mono text-[#201a18] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order breakdown */}
              <div className="p-3 rounded-xl bg-[#fff8f6] border border-[#d9c1be]/50 space-y-1 text-xs text-[#534340]">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span className="text-[#201a18] font-medium">${cartSubtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#8c493f] font-semibold">
                    <span>Discount ({promoCode})</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#201a18]">
                    {shippingCost === 0 ? <strong className="text-[#506355]">FREE</strong> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 border-t border-[#d9c1be]/40 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#534340]">Final Amount</span>
                  <span className="font-serif text-2xl text-[#8c493f] font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 rounded-full bg-[#8c493f] text-[#ffffff] font-semibold text-sm hover:bg-[#aa6055] transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin"></span>
                      <span>Encrypting &amp; Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      <span>Authorize &amp; Complete Order (${total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
