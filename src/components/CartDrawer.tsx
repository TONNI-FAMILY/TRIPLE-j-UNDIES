import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    setIsCheckoutOpen,
    setActiveTab,
    promoCode,
    promoDiscount,
    promoError,
    applyPromo,
    clearPromo,
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 40;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const shippingCost = isFreeShipping ? 0 : 5.0;

  const finalTotal = Math.max(0, cartSubtotal - promoDiscount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(inputCode)) {
      setInputCode('');
    }
  };

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-[#201a18]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#ffffff] shadow-2xl border-l border-[#d9c1be]/40 z-50 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#d9c1be]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#8c493f] text-2xl">
              shopping_bag
            </span>
            <h3 className="font-serif text-2xl text-[#201a18] font-medium">
              Your Shopping Bag
            </h3>
            <span className="text-xs bg-[#f8ebe8] text-[#8c493f] font-semibold px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f8ebe8] text-[#867370] hover:text-[#201a18] transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="bg-[#fef1ed] px-6 py-3 border-b border-[#ffdad4]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#8c493f] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">eco</span>
              {isFreeShipping
                ? 'Unlocked Free Carbon-Neutral Shipping!'
                : `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`}
            </span>
            <span className="text-[#867370] text-[11px]">
              {Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100))}%
            </span>
          </div>
          <div className="w-full bg-[#d9c1be]/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#8c493f] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#d9c1be]/30">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f8ebe8] text-[#8c493f] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">shopping_basket</span>
              </div>
              <h4 className="font-serif text-xl text-[#201a18]">Your bag is currently empty</h4>
              <p className="text-xs text-[#534340] max-w-xs mx-auto leading-relaxed">
                Discover our signature second-skin modal high-rise and organic ribbed cotton
                essentials crafted for zero pinch.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActiveTab('shop');
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all cursor-pointer"
              >
                <span>Browse The Collection</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#ece0dc] border border-[#d9c1be]/50 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-sans text-sm font-semibold text-[#201a18] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-sm font-semibold text-[#201a18] shrink-0">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>

                  <p className="text-xs text-[#534340] mt-0.5">
                    Size: <strong className="text-[#201a18]">{item.selectedSize}</strong> ·{' '}
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block border border-[#d9c1be]"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.name}
                    </span>
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity stepper */}
                    <div className="inline-flex items-center border border-[#d9c1be] rounded-full bg-[#ffffff]">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-[#534340] hover:text-[#8c493f] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#201a18]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#534340] hover:text-[#8c493f] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-[#867370] hover:text-[#ba1a1a] transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-sm">delete_outline</span>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#f8ebe8]/50 border-t border-[#d9c1be]/40 space-y-4">
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder='Promo code (e.g. "SOFT20")'
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-[#ffffff] border border-[#d9c1be] rounded-full px-3.5 py-1.5 text-xs text-[#201a18] focus:outline-hidden focus:border-[#8c493f]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-[#f8ebe8] border border-[#d9c1be] text-xs font-semibold text-[#8c493f] hover:bg-[#ffdad4] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="text-[11px] text-[#ba1a1a]">{promoError}</p>}
            {promoDiscount > 0 && (
              <div className="flex items-center justify-between text-[11px] text-[#506355] font-semibold bg-[#d2e8d6]/50 px-3 py-1.5 rounded-lg border border-[#d2e8d6]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Code {promoCode} applied (-${promoDiscount.toFixed(2)})
                </span>
                <button
                  type="button"
                  onClick={clearPromo}
                  className="text-[#867370] hover:text-[#ba1a1a] underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#534340] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#201a18] font-medium">${cartSubtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#8c493f]">
                  <span>Discount</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Carbon-Neutral Shipping</span>
                <span className="text-[#201a18]">
                  {shippingCost === 0 ? (
                    <strong className="text-[#506355]">FREE</strong>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#201a18] pt-2 border-t border-[#d9c1be]/40">
                <span>Estimated Total</span>
                <span className="text-[#8c493f] font-bold text-base">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-full bg-[#8c493f] text-[#ffffff] font-semibold text-sm hover:bg-[#aa6055] transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Discreet Checkout</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-[#867370]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#506355]">lock</span>
                256-bit SSL
              </span>
              <span>·</span>
              <span>30-Day First Pair Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
