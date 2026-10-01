import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductSize, ProductColor } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductDetails,
    addToCart,
    toggleFavorite,
    isFavorite,
    startChatAboutProduct,
    setIsSizeDrawerOpen,
    userProfile,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Reset variant selections whenever selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setQuantity(1);
      setSelectedColor(selectedProduct.colors[0] || null);

      if (selectedProduct.sizes.includes(userProfile.preferredSize)) {
        setSelectedSize(userProfile.preferredSize);
      } else {
        setSelectedSize(selectedProduct.sizes[0] || 'M');
      }
    }
  }, [selectedProduct?.id, userProfile.preferredSize]);

  if (!selectedProduct) return null;

  // Ensure selectedColor belongs to this product; otherwise default to first available
  const currentColor =
    selectedProduct.colors.find((c) => c.id === selectedColor?.id) ||
    selectedProduct.colors[0] || {
      id: 'default',
      name: 'Natural',
      hex: '#ece0dc',
    };

  const favorited = isFavorite(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, currentColor, quantity);
  };

  const handleAskAboutProduct = () => {
    startChatAboutProduct(
      selectedProduct,
      selectedSize,
      currentColor,
      `Hi! I have a question about the ${selectedProduct.name} in size ${selectedSize} (${currentColor.name}). How does this cut feel on?`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeProductDetails}
        className="fixed inset-0 bg-[#201a18]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-[#ffffff] rounded-2xl max-w-4xl w-full shadow-2xl border border-[#d9c1be]/50 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={closeProductDetails}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#fff8f6]/90 backdrop-blur-md flex items-center justify-center text-[#534340] hover:text-[#8c493f] shadow-sm transition-colors cursor-pointer"
            aria-label="Close product modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="bg-[#f8ebe8] p-6 flex flex-col justify-between">
              {/* Main image */}
              <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-[#ece0dc] border border-[#d9c1be]/40 shadow-xs mb-4">
                <img
                  src={
                    selectedProduct.images[activeImageIndex] ||
                    selectedProduct.images[0]
                  }
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {selectedProduct.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#fff8f6]/95 backdrop-blur-md text-[#8c493f] font-semibold text-xs border border-[#8c493f]/30">
                    {selectedProduct.badge}
                  </span>
                )}
                <button
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#fff8f6]/90 backdrop-blur-md flex items-center justify-center text-[#201a18] hover:text-[#8c493f] shadow-sm transition-transform active:scale-95 cursor-pointer"
                  aria-label="Toggle wishlist"
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      favorited ? 'text-[#8c493f] fill icon-fill' : ''
                    }`}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#8c493f] ring-2 ring-[#8c493f]/20 scale-102'
                          : 'border-[#d9c1be]/60 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Right */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Micro category & Stock Indicator */}
                <div className="flex items-center justify-between gap-2 text-xs mb-2">
                  <span className="text-[#8c493f] font-semibold uppercase tracking-wider">
                    {selectedProduct.fabric}
                  </span>
                  <span className="text-[#506355] font-semibold flex items-center gap-1.5 bg-[#d2e8d6]/60 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#506355]"></span>
                    {selectedProduct.stockStatus}
                  </span>
                </div>

                <h2 className="font-serif text-3xl text-[#201a18] font-normal tracking-tight">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-sans text-2xl font-semibold text-[#201a18]">
                    ${selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-[#867370] line-through">
                      ${selectedProduct.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-[#506355] font-medium">Free Carbon-Neutral Delivery</span>
                </div>

                <p className="text-xs text-[#534340] mt-3 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Color Selector */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#201a18] font-semibold">Color:</span>
                    <span className="text-[#867370]">{currentColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {selectedProduct.colors.map((c) => {
                      const isCurrent = currentColor.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative ${
                            isCurrent
                              ? 'ring-2 ring-offset-2 ring-[#8c493f] scale-110'
                              : 'hover:scale-105 border border-[#d9c1be]'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector & Fit Finder Link */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#201a18] font-semibold">Select Size:</span>
                    <button
                      onClick={() => setIsSizeDrawerOpen(true)}
                      className="text-[#8c493f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">straighten</span>
                      <span>Interactive Fit Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((sz) => {
                      const isChosen = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-10 h-10 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isChosen
                              ? 'bg-[#201a18] text-[#ffffff] shadow-sm'
                              : 'border border-[#d9c1be] text-[#201a18] hover:border-[#8c493f]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Features Pill List */}
                <div className="mt-5 pt-4 border-t border-[#d9c1be]/40 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#867370] block mb-1">
                    Signature Comfort Details
                  </span>
                  {selectedProduct.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#534340]">
                      <span className="material-symbols-outlined text-[#506355] text-sm shrink-0">
                        check
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#d9c1be]/40 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-[#d9c1be] rounded-full bg-[#ffffff] h-12 px-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#534340] hover:text-[#8c493f] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#201a18]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#534340] hover:text-[#8c493f] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 rounded-full bg-[#8c493f] text-[#ffffff] font-semibold text-sm hover:bg-[#aa6055] transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    <span>Add to Bag • ${(selectedProduct.price * quantity).toFixed(2)}</span>
                  </button>
                </div>

                {/* Direct Ask About Product Button */}
                <button
                  onClick={handleAskAboutProduct}
                  className="w-full py-2.5 rounded-full bg-[#f8ebe8] hover:bg-[#ffdad4] text-[#8c493f] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#d9c1be]/40"
                >
                  <span className="material-symbols-outlined text-sm">forum</span>
                  <span>Ask Specialist About This Fit &amp; Size</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
