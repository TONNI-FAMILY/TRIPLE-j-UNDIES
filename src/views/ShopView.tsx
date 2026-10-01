import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { CategoryId, Product, ProductSize } from '../types';

export const ShopView: React.FC = () => {
  const {
    openProductDetails,
    addToCart,
    toggleFavorite,
    isFavorite,
    startChatAboutProduct,
    setIsSizeDrawerOpen,
    selectedFilterSize,
    setSelectedFilterSize,
    searchQuery,
    setSearchQuery,
    setActiveTab,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular');

  const categories: { id: CategoryId; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: PRODUCTS.length },
    {
      id: 'everyday-cotton',
      label: 'Everyday Cotton',
      count: PRODUCTS.filter((p) => p.category === 'everyday-cotton').length,
    },
    {
      id: 'seamless',
      label: 'Seamless / No-Show',
      count: PRODUCTS.filter((p) => p.category === 'seamless').length,
    },
    {
      id: 'modal-luxe',
      label: 'Modal Luxe',
      count: PRODUCTS.filter((p) => p.category === 'modal-luxe').length,
    },
    {
      id: 'sets-bundles',
      label: 'Sets & Bundles',
      count: PRODUCTS.filter((p) => p.category === 'sets-bundles').length,
    },
    { id: 'maternity', label: 'Maternity & Easy Fit', count: 3 },
  ];

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && selectedCategory !== 'maternity') {
        if (p.category !== selectedCategory) return false;
      }

      // Size filter from drawer
      if (selectedFilterSize) {
        if (!p.sizes.includes(selectedFilterSize)) return false;
      }

      // Color filter
      if (selectedColorFilter !== 'all') {
        if (!p.colors.some((c) => c.id.includes(selectedColorFilter))) return false;
      }

      // Price filter
      if (maxPrice !== null) {
        if (p.price > maxPrice) return false;
      }

      // Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesFabric = p.fabric.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesFit = p.fitType.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesFabric && !matchesCategory && !matchesFit) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return b.reviewsCount - a.reviewsCount;
      return b.rating - a.rating;
    });
  }, [selectedCategory, selectedFilterSize, selectedColorFilter, maxPrice, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFilterSize(null);
    setSelectedColorFilter('all');
    setMaxPrice(null);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedFilterSize !== null ||
    selectedColorFilter !== 'all' ||
    maxPrice !== null ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-20 w-full">
      {/* Breadcrumbs & Fit Guide Prompt */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#867370] mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="hover:text-[#8c493f] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#d9c1be]">/</span>
          <span className="text-[#201a18] font-semibold">Shop Catalog</span>
        </div>
        <button
          onClick={() => setIsSizeDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 text-[#8c493f] hover:text-[#aa6055] font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">straighten</span>
          <span>Interactive Size &amp; Fit Guide</span>
        </button>
      </div>

      {/* Editorial Shop Header */}
      <section className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#d9c1be]/40 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8ebe8] text-[#8c493f] text-xs font-semibold tracking-widest uppercase mb-3 border border-[#d9c1be]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c493f]"></span>
            100% Cotton &amp; Pure Modal
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#201a18] mb-3 font-normal">
            The Underwear Collection
          </h1>
          <p className="font-sans text-sm md:text-base text-[#534340] leading-relaxed">
            Breathable, gentle-on-skin essentials designed with natural silhouettes and zero pinch.
            Crafted for pure all-day ease.
          </p>
        </div>

        {/* Quick Trust Indicators */}
        <div className="hidden lg:flex items-center gap-6 text-[#534340] border-l border-[#d9c1be]/50 pl-6 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#506355] text-2xl">verified</span>
            <div className="text-left">
              <p className="font-sans text-xs font-semibold text-[#201a18]">Zero Pinch Grip</p>
              <p className="text-[11px] text-[#867370]">Seamless bonded hems</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#506355] text-2xl">eco</span>
            <div className="text-left">
              <p className="font-sans text-xs font-semibold text-[#201a18]">OEKO-TEX® Safe</p>
              <p className="text-[11px] text-[#867370]">Non-toxic botanic dyes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY & FILTER CONTROLS BAR */}
      <div className="sticky top-16 z-30 bg-[#fff8f6]/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-[#d9c1be]/30 transition-all">
        {/* Horizontal Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full font-sans text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#201a18] text-[#ffffff] font-semibold shadow-xs'
                    : 'bg-[#ffffff] border border-[#d9c1be] text-[#201a18] hover:border-[#8c493f]'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns & Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Size Filter Trigger */}
            <button
              onClick={() => setIsSizeDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#d9c1be] text-[#201a18] text-xs font-medium hover:border-[#8c493f] cursor-pointer"
            >
              <span>Size:</span>
              <strong className="text-[#8c493f]">
                {selectedFilterSize ? selectedFilterSize : 'All Sizes'}
              </strong>
              <span className="material-symbols-outlined text-sm text-[#867370]">straighten</span>
            </button>

            {/* Color Filter Dropdown */}
            <select
              value={selectedColorFilter}
              onChange={(e) => setSelectedColorFilter(e.target.value)}
              className="bg-[#ffffff] border border-[#d9c1be] text-[#201a18] text-xs rounded-full py-1.5 pl-3 pr-7 focus:ring-1 focus:ring-[#8c493f] cursor-pointer"
            >
              <option value="all">Color: All</option>
              <option value="sand">Sand / Oat</option>
              <option value="rose">Blush / Rose</option>
              <option value="olive">Sage / Olive</option>
              <option value="espresso">Espresso / Dark</option>
              <option value="white">Cloud White</option>
            </select>

            {/* Price Filter Dropdown */}
            <select
              value={maxPrice === null ? 'all' : maxPrice.toString()}
              onChange={(e) =>
                setMaxPrice(e.target.value === 'all' ? null : parseInt(e.target.value, 10))
              }
              className="bg-[#ffffff] border border-[#d9c1be] text-[#201a18] text-xs rounded-full py-1.5 pl-3 pr-7 focus:ring-1 focus:ring-[#8c493f] cursor-pointer"
            >
              <option value="all">Price: All</option>
              <option value="25">Under $25</option>
              <option value="35">Under $35</option>
              <option value="45">Under $45</option>
            </select>

            {/* Active Tag Pills */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 ml-1">
                {selectedFilterSize && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f8ebe8] text-[#201a18] text-xs border border-[#d9c1be]/40">
                    Size: {selectedFilterSize}
                    <button
                      onClick={() => setSelectedFilterSize(null)}
                      className="text-[#867370] hover:text-[#8c493f] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                {maxPrice !== null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f8ebe8] text-[#201a18] text-xs border border-[#d9c1be]/40">
                    Under ${maxPrice}
                    <button
                      onClick={() => setMaxPrice(null)}
                      className="text-[#867370] hover:text-[#8c493f] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f8ebe8] text-[#201a18] text-xs border border-[#d9c1be]/40">
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[#867370] hover:text-[#8c493f] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8c493f] hover:underline cursor-pointer font-medium ml-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Right: Sorter & Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <p className="text-xs text-[#867370]">
              Showing <span className="font-semibold text-[#201a18]">{filteredProducts.length}</span>{' '}
              of {PRODUCTS.length} items
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#867370] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#ffffff] border border-[#d9c1be] text-[#201a18] text-xs font-semibold rounded-full py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-[#8c493f] cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Search / Filter State */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#f8ebe8] text-[#8c493f] mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <h3 className="font-serif text-2xl text-[#201a18]">No products match your filters</h3>
          <p className="text-xs text-[#534340] max-w-sm mx-auto">
            Try adjusting your size, color, or search term to discover available gentle intimates.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* PRODUCT CATALOG GRID WITH IN-CATALOG CONCIERGE CARD */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map((product, index) => {
            const favorited = isFavorite(product.id);

            // Inject the Bento Fit Concierge Card at position 3 for seamless discovery
            const showConciergeCard = index === 3;

            return (
              <React.Fragment key={product.id}>
                {showConciergeCard && (
                  <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1 bg-[#f8ebe8] rounded-2xl p-6 border border-[#d9c1be]/70 flex flex-col justify-between relative overflow-hidden shadow-xs">
                    <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#ffdad4]/40 blur-2xl pointer-events-none" />
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#8c493f] text-[#ffffff] flex items-center justify-center mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-xl">support_agent</span>
                      </div>
                      <span className="text-[11px] uppercase tracking-wider text-[#8c493f] font-semibold block mb-1">
                        Personal Fit Concierge
                      </span>
                      <h3 className="font-serif text-2xl text-[#201a18] mb-3 leading-snug">
                        Not sure about your cut or size?
                      </h3>
                      <p className="text-xs text-[#534340] mb-6 leading-relaxed">
                        Our fit specialist is ready in chat with confidential, zero-judgment sizing
                        help tailored to your preferred rise and fit.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#506355] animate-pulse"></span>
                        <span className="text-xs text-[#201a18] font-semibold">
                          Sarah is live • ~1 min reply
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="w-full py-3 px-5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>Start Size Consultation</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Card */}
                <article className="group bg-[#ffffff] rounded-2xl border border-[#d9c1be]/50 p-3 hover:border-[#8c493f]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Image Container with Aspect Ratio 4:5 */}
                    <div
                      onClick={() => openProductDetails(product)}
                      className="relative aspect-4/5 rounded-xl overflow-hidden bg-[#ece0dc] border border-[#d9c1be]/30 mb-3 cursor-pointer"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={product.name}
                        src={product.images[0]}
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {product.badge && (
                          <span className="bg-[#fff8f6]/95 backdrop-blur-xs border border-[#8c493f] text-[#8c493f] text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                            {product.badge}
                          </span>
                        )}
                        <span className="bg-[#d2e8d6]/95 backdrop-blur-xs text-[#384b3e] text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#506355] inline-block"></span>
                          {product.stockStatus.includes('Low Stock') ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#fff8f6]/85 backdrop-blur-md flex items-center justify-center text-[#201a18] hover:text-[#8c493f] shadow-sm transition-transform active:scale-95 cursor-pointer"
                        aria-label="Save to Wishlist"
                      >
                        <span
                          className={`material-symbols-outlined text-lg ${
                            favorited ? 'text-[#8c493f] fill icon-fill' : ''
                          }`}
                        >
                          favorite
                        </span>
                      </button>

                      {/* Quick Add Overlay on Hover */}
                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-full py-2.5 bg-[#8c493f] text-[#ffffff] text-xs font-semibold rounded-full shadow-md hover:bg-[#aa6055] transition-colors flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">
                            add_shopping_cart
                          </span>
                          <span>Quick Add • XS-{product.sizes[product.sizes.length - 1]}</span>
                        </button>
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                      {product.colors.map((c, i) => (
                        <span
                          key={c.id}
                          className={`w-3.5 h-3.5 rounded-full border border-[#d9c1be] ${
                            i === 0 ? 'ring-2 ring-offset-1 ring-[#8c493f]' : ''
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      {product.bundleIncludes && (
                        <span className="text-[10px] text-[#867370] truncate">
                          + Custom bundle
                        </span>
                      )}
                    </div>

                    {/* Title & Price */}
                    <div className="px-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2
                          onClick={() => openProductDetails(product)}
                          className="font-serif text-lg text-[#201a18] group-hover:text-[#8c493f] transition-colors cursor-pointer leading-tight line-clamp-1"
                        >
                          {product.name}
                        </h2>
                        <span className="text-sm font-semibold text-[#201a18] shrink-0">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-xs text-[#867370] line-clamp-1 mb-2">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Ask Chat & Badge */}
                  <div className="pt-2 px-1 border-t border-[#d9c1be]/30 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        startChatAboutProduct(
                          product,
                          'M',
                          product.colors[0],
                          `Hi Sarah, I would like to ask about sizing for the ${product.name}.`
                        )
                      }
                      className="inline-flex items-center gap-1 text-[#867370] hover:text-[#8c493f] font-semibold transition-colors py-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>Ask size question</span>
                    </button>
                    <span className="text-[11px] font-semibold text-[#506355]">
                      {product.lowStockSize ? `Low Stock in ${product.lowStockSize}` : 'Free exchanges'}
                    </span>
                  </div>
                </article>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* FABRIC CARE & CRAFT NOTE BANNER */}
      <section className="mt-16 bg-[#fef1ed] rounded-3xl border border-[#d9c1be]/50 p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f8ebe8] flex items-center justify-center text-[#8c493f] border border-[#d9c1be]/40">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <h4 className="font-serif text-xl text-[#201a18]">Gentle Machine Wash</h4>
            <p className="text-xs text-[#534340] leading-relaxed">
              Cold cycle with like delicates. Retains ultra-soft micromodal elasticity wash after
              wash with zero pilling.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f8ebe8] flex items-center justify-center text-[#8c493f] border border-[#d9c1be]/40">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <h4 className="font-serif text-xl text-[#201a18]">100% Discreet Packaging</h4>
            <p className="text-xs text-[#534340] leading-relaxed">
              Recyclable unbranded kraft mailers with plant-based moisture barrier and confidential
              shipping labels.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f8ebe8] flex items-center justify-center text-[#8c493f] border border-[#d9c1be]/40">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </div>
            <h4 className="font-serif text-xl text-[#201a18]">First Pair Guarantee</h4>
            <p className="text-xs text-[#534340] leading-relaxed">
              Try your first pair worry-free. If it isn't your most comfortable underwear, keep it and
              we'll refund or swap.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
