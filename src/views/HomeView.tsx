import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, VIDEO_STORIES } from '../data/products';
import { Product } from '../types';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    openProductDetails,
    addToCart,
    toggleFavorite,
    isFavorite,
    startChatAboutProduct,
    openVideoPlayer,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'High-Rise' | 'Seamless'>('All');

  // Filter 4 featured products
  const featuredProducts = PRODUCTS.slice(0, 4).filter((p) => {
    if (activeFilter === 'High-Rise') return p.fitType === 'High-Rise';
    if (activeFilter === 'Seamless') return p.category === 'seamless';
    return true;
  });

  return (
    <div className="w-full">
      {/* HERO SECTION: Warm, editorial & high-utility */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fef1ed] via-[#fff8f6] to-[#fff8f6] pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#d9c1be]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Editorial Copy Column */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8ebe8] border border-[#d9c1be]/50">
                <span className="font-sans text-xs font-semibold tracking-widest text-[#8c493f] uppercase">
                  New Spring Intimates
                </span>
                <span className="w-1 h-1 rounded-full bg-[#867370]"></span>
                <span className="font-sans text-xs text-[#534340]">Zero-Chafe Modal</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] text-[#201a18] font-normal tracking-tight leading-[1.12]">
                Intimate comfort crafted for real life.
              </h1>

              <p className="font-sans text-base md:text-lg text-[#534340] max-w-xl leading-relaxed">
                Breathable organic cottons, second-skin modal, and seamless everyday essentials
                designed to move with you without pinching or riding up.
              </p>

              {/* Dual CTA Action Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <button
                  onClick={() => setActiveTab('shop')}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#8c493f] text-[#ffffff] font-semibold text-sm shadow-sm hover:bg-[#aa6055] active:scale-98 transition-all min-h-[50px] cursor-pointer"
                >
                  Explore Collection
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#ece0dc] border border-[#d9c1be]/60 text-[#201a18] font-semibold text-sm hover:bg-[#f8ebe8] active:scale-98 transition-all min-h-[50px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#8c493f]">forum</span>
                  <span>Ask About Fit &amp; Sizing</span>
                </button>
              </div>

              {/* Social Micro-Proof */}
              <div className="pt-4 flex items-center gap-4 border-t border-[#d9c1be]/40 w-full text-[#534340]">
                <div className="flex -space-x-1 overflow-hidden shrink-0">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#fff8f6] bg-[#f8ebe8] flex items-center justify-center text-xs font-bold text-[#8c493f]">
                    4.9★
                  </div>
                </div>
                <p className="text-xs leading-normal">
                  Rated <strong className="text-[#201a18] font-semibold">4.9/5</strong> by over
                  24,000 women who value gentle fabric on sensitive skin.
                </p>
              </div>
            </div>

            {/* Hero Imagery Mosaic */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-3.5 sm:gap-4 relative">
              <div
                onClick={() => openProductDetails(PRODUCTS[0])}
                className="col-span-7 rounded-2xl overflow-hidden border border-[#d9c1be]/40 shadow-sm bg-[#f8ebe8] cursor-pointer group"
              >
                <img
                  className="w-full h-80 sm:h-96 object-cover object-center transform group-hover:scale-104 transition-transform duration-500"
                  alt="Editorial lifestyle of woman in soft taupe modal underwear"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkxHu364iC3oz3xX9kBkKeljzP7RyiawcODY99qb0ZpE8X2LaB4NAQIkYmcNWKYZJ76vY69HDhwIkwmNN4Yif6LFL3gaLtjFkLog7gYts5m4r7vcq-x7Tez1zlDUD1s4rpMmZa-CSNLTJYtHyB43kYjgSpr-aXDQlTlC-vLCyjWiu1f9_nk62djTUdW9L7t0sJ9ae6tS636odmij6tao4E4dPjWp6HlmrgMn5faIq7xrzp95oMVUKtfA"
                />
              </div>

              <div className="col-span-5 flex flex-col gap-3.5 sm:gap-4">
                <div className="rounded-2xl overflow-hidden border border-[#d9c1be]/40 shadow-sm bg-[#f8ebe8] flex-1">
                  <img
                    className="w-full h-full min-h-[140px] object-cover object-center transform hover:scale-104 transition-transform duration-500"
                    alt="Macro texture of fine combed organic cotton weave"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtBABjmdBxfTjvmDmkk1bwTWBG0mNLDA-sunErfg56DByv0qhFpFoGD9zbS0aqTtI0qwQf0bHF9OL43UbIumeD5g-VSStNKw6NHQtg2DNdsw38yG9a9aApuaTqfMJ1npXdkuh65ev9L6CcW38ROOujnJVWG7edRe8zIrMhvNsJHlhdD5GD4yl51JOv-IYWXFfDeaTka6nxfO-fK_Vl2a205nzoobNyCM2jIQb6Ni2m0-AhT5Dq9E9dCw"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#f2e6e2] border border-[#d9c1be]/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] text-[#8c493f] uppercase font-bold tracking-wider">
                      The Standard
                    </span>
                    <span className="material-symbols-outlined text-[#506355] text-lg">
                      verified
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#201a18] font-semibold mt-2">
                    100% Oeko-Tex Free of Harms
                  </p>
                  <span className="text-[11px] text-[#534340] mt-0.5">
                    Naturally breathable botanical fibers.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE FUNCTIONAL PILLARS QUICK-BAR (Bento Style Hub) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 sm:-mt-8 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Discover & Shop */}
          <div className="bg-[#ffffff]/95 backdrop-blur-xs rounded-2xl p-5 border border-[#d9c1be]/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs uppercase tracking-wider text-[#8c493f] font-bold">
                  Discover &amp; Shop
                </span>
                <span className="material-symbols-outlined text-[#534340] text-xl">
                  dresser
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#201a18] font-medium mb-1.5">
                Everyday Essentials
              </h3>
              <p className="text-xs text-[#534340] mb-4">
                Targeted cuts built for all silhouettes with frictionless waistband technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d9c1be]/30">
              <button
                onClick={() => setActiveTab('shop')}
                className="p-2.5 rounded-xl bg-[#fef1ed] hover:bg-[#f8ebe8] transition-colors flex flex-col text-left cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#201a18]">Everyday Cottons</span>
                <span className="text-[11px] text-[#867370]">14 Styles</span>
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="p-2.5 rounded-xl bg-[#fef1ed] hover:bg-[#f8ebe8] transition-colors flex flex-col text-left cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#201a18]">Seamless Invisible</span>
                <span className="text-[11px] text-[#867370]">9 Cuts</span>
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="p-2.5 rounded-xl bg-[#fef1ed] hover:bg-[#f8ebe8] transition-colors flex flex-col text-left cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#201a18]">Cloud Modal</span>
                <span className="text-[11px] text-[#867370]">12 Silhouettes</span>
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="p-2.5 rounded-xl bg-[#fef1ed] hover:bg-[#f8ebe8] transition-colors flex flex-col text-left cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#201a18]">Multi-packs</span>
                <span className="text-[11px] text-[#506355] font-semibold">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: Editorial Lookbook */}
          <div className="bg-[#ffffff]/95 backdrop-blur-xs rounded-2xl p-5 border border-[#d9c1be]/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs uppercase tracking-wider text-[#506355] font-bold">
                  Editorial Lookbook
                </span>
                <span className="material-symbols-outlined text-[#506355] text-xl">
                  auto_stories
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#201a18] font-medium mb-1.5">
                Volume IV: Soft Foundations
              </h3>
              <p className="text-xs text-[#534340] mb-4">
                Discover motion tests, video fit reels, and real fabric drape stories across
                diverse body curves.
              </p>
            </div>
            <div
              onClick={() => openVideoPlayer(VIDEO_STORIES[0])}
              className="relative rounded-xl overflow-hidden h-28 border border-[#d9c1be]/40 group cursor-pointer"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt="Editorial lookbook models in organic underwear"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrrYBIEY0KeYxS50Gyw7LaAL91gugf5QlodYBJKeT5OTjkPEZ9BhmQLP3V_gTaoK-rdM1jemZxarwqLIqlQzrrVmyzRC3f3V0Mrberf4Wlm1FmM_e8MenEII4in1cP_71hqjzlrDyenEf6M2xXV9jzaIuvXz_jgwRK5372BEz1vUjm4J1aF77zYyZPvF1XCfeT8trvMgx8lM2eQrOkWu0AbAydYSoppJDZnrtr_9oUXVmW5lag_dwMoQ"
              />
              <div className="absolute inset-0 bg-[#201a18]/30 flex items-center justify-center">
                <div className="px-3.5 py-1.5 rounded-full bg-[#fff8f6]/95 text-[#201a18] text-xs font-semibold flex items-center gap-1.5 shadow-sm group-hover:bg-[#ffffff]">
                  <span className="material-symbols-outlined text-[#8c493f] text-base">
                    play_circle
                  </span>
                  <span>Watch Fit Guide Reel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Direct Business Chat */}
          <div className="bg-[#fef1ed] rounded-2xl p-5 border border-[#d9c1be]/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#ffdad4]/40 blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs uppercase tracking-wider text-[#8c493f] font-bold">
                  Direct Intimate Chat
                </span>
                <span className="inline-flex items-center gap-1 text-[#506355] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#506355]"></span>
                  <span>Active</span>
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#201a18] font-medium mb-1.5">
                Personal Sizing Concierge
              </h3>
              <p className="text-xs text-[#534340] mb-4">
                Need sizing advice, maternity recommendations, or bridal party packs? Talk directly
                to our fitting specialists.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full py-3 px-4 rounded-full bg-[#aa6055] text-[#ffffff] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#8c493f] transition-all active:scale-98 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Start Instant Sizing Chat</span>
              </button>
              <p className="text-[11px] text-center text-[#867370] mt-2">
                Average reply time: under 90 seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED NEW ARRIVALS GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-[#8c493f] font-bold">
              Signature Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#201a18] font-normal mt-1">
              Featured New Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {(['All', 'High-Rise', 'Seamless'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                  activeFilter === filter
                    ? 'bg-[#f8ebe8] text-[#201a18] border-[#d9c1be]'
                    : 'bg-[#ffffff] text-[#534340] border-[#d9c1be]/50 hover:text-[#201a18]'
                }`}
              >
                {filter === 'All' ? 'All Fits' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const favorited = isFavorite(product.id);
            return (
              <div
                key={product.id}
                className="group bg-[#ffffff] rounded-2xl border border-[#d9c1be]/40 p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Image Container with Aspect Ratio 4:5 */}
                  <div
                    onClick={() => openProductDetails(product)}
                    className="relative aspect-4/5 rounded-xl overflow-hidden bg-[#f8ebe8] mb-3.5 border border-[#d9c1be]/20 cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={product.name}
                      src={product.images[0]}
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-[#fff8f6]/90 backdrop-blur-md flex items-center justify-center text-[#201a18] hover:text-[#8c493f] shadow-sm transition-transform active:scale-95 cursor-pointer"
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

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#fff8f6]/95 backdrop-blur-md text-[11px] font-semibold text-[#201a18] shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Stock status & Price */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#506355] flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#506355]"></span>
                      {product.stockStatus}
                    </span>
                    <span className="text-base font-semibold text-[#201a18]">
                      ${product.price}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => openProductDetails(product)}
                    className="font-sans text-sm font-medium text-[#201a18] hover:text-[#8c493f] cursor-pointer mb-1 leading-snug line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#534340] mb-3 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Color Swatches */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.colors.map((c, i) => (
                      <span
                        key={c.id}
                        className={`w-4 h-4 rounded-full border border-[#d9c1be] ${
                          i === 0 ? 'ring-2 ring-[#8c493f] ring-offset-1' : ''
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    {product.bundleIncludes && (
                      <span className="text-[11px] text-[#867370] truncate">
                        {product.bundleIncludes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-2 border-t border-[#d9c1be]/30 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 py-2.5 px-3 rounded-full bg-[#f8ebe8] hover:bg-[#ffdad4] text-[#201a18] text-xs font-semibold transition-colors text-center cursor-pointer active:scale-98"
                  >
                    Quick Add
                  </button>
                  <button
                    onClick={() =>
                      startChatAboutProduct(
                        product,
                        'M',
                        product.colors[0],
                        `Hi Sarah! Could you advise on the fit and stretch of the ${product.name}?`
                      )
                    }
                    className="p-2.5 rounded-full bg-[#fef1ed] hover:bg-[#ffdad4] text-[#8c493f] transition-colors cursor-pointer"
                    title="Chat about this fit"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MARKETING / CONTENT SPOTLIGHT CARD */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="rounded-3xl bg-[#f8ebe8] border border-[#d9c1be]/50 p-6 md:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text and Story Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2e6e2] border border-[#d9c1be]/40">
                <span className="text-xs text-[#8c493f] uppercase font-bold tracking-wider">
                  Behind The Seams
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#867370]"></span>
                <span className="text-xs text-[#534340]">Fabric Engineering</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#201a18] leading-tight">
                Why 60s Modal Cotton Matters for Daily Wear.
              </h2>

              <p className="font-sans text-sm md:text-base text-[#534340] leading-relaxed">
                Unlike synthetics that trap moisture or heavy cotton that stretches out by noon, our
                60s micro-modal provides botanical breathability, natural antibacterial balance,
                and silk-like drape that softens with every wash cycle.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => openVideoPlayer(VIDEO_STORIES[1])}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#201a18] text-[#ffffff] text-xs font-semibold hover:bg-[#362f2d] active:scale-98 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  <span>Watch the 45-Sec Fabric Test</span>
                </button>

                <button
                  onClick={() => openProductDetails(PRODUCTS[2])}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8c493f] hover:text-[#aa6055] underline underline-offset-4 transition-colors cursor-pointer"
                >
                  <span>Shop the featured Cloud Bralette Set</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Video Preview Frame */}
            <div className="lg:col-span-6">
              <div
                onClick={() => openVideoPlayer(VIDEO_STORIES[1])}
                className="relative rounded-2xl overflow-hidden shadow-sm border border-[#d9c1be]/50 bg-[#ece0dc] group cursor-pointer"
              >
                <img
                  className="w-full h-72 md:h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  alt="Fabric stretch and softness test in studio"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiHXCBQzWmuGghe2ahTlvgRn9i1nhN6uyvril5fP1J396-Lfne6LOnk7UshbXguEpma9ApLDiPfKw8a9AxEyaPr1-gww7sk5bnQGnK1J2KOnGNZGJztxQ9nID0BDpGtwYnjkByC2V_Z9QTOlFdXVe3w--902bBAJM-oeqjrJ3X0vyVSmNPvijWtB3eXmXNroYdMNDnwfBnhv0kLMeH0DPQ9ES5yMJb5J38tunL9BKQ_FvKY5fb49k1TQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201a18]/70 via-transparent to-transparent flex items-end p-6">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="px-2.5 py-1 rounded bg-[#fff8f6]/90 text-[#201a18] text-[10px] font-bold uppercase tracking-wider">
                        Watch &amp; Shop
                      </span>
                      <p className="text-[#ffffff] font-serif text-lg mt-1 font-medium">
                        Wear-Testing 14 Days Under Silk &amp; Denim
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#8c493f] text-[#ffffff] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">play_arrow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & REASSURANCE STRIP (4 Pillars) */}
      <section className="border-y border-[#d9c1be]/40 bg-[#fef1ed] py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe8] shrink-0 flex items-center justify-center text-[#8c493f] border border-[#d9c1be]/40">
                <span className="material-symbols-outlined text-xl">spa</span>
              </div>
              <div>
                <h4 className="font-sans text-sm font-semibold text-[#201a18]">Tactile Softness</h4>
                <p className="text-xs text-[#534340] mt-0.5">
                  Non-sensitizing, dye-safe organic fibers tested on reactive skin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe8] shrink-0 flex items-center justify-center text-[#8c493f] border border-[#d9c1be]/40">
                <span className="material-symbols-outlined text-xl">sync</span>
              </div>
              <div>
                <h4 className="font-sans text-sm font-semibold text-[#201a18]">Fit Guarantee</h4>
                <p className="text-xs text-[#534340] mt-0.5">
                  Try your first pair risk-free. If it doesn't fit, we exchange it free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe8] shrink-0 flex items-center justify-center text-[#8c493f] border border-[#d9c1be]/40">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div>
                <h4 className="font-sans text-sm font-semibold text-[#201a18]">
                  Discreet Packaging
                </h4>
                <p className="text-xs text-[#534340] mt-0.5">
                  100% recyclable, unlabeled unbleached card boxes for your privacy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe8] shrink-0 flex items-center justify-center text-[#506355] border border-[#d9c1be]/40">
                <span className="material-symbols-outlined text-xl">support_agent</span>
              </div>
              <div>
                <h4 className="font-sans text-sm font-semibold text-[#201a18]">
                  Live Chat Support
                </h4>
                <p className="text-xs text-[#534340] mt-0.5">
                  Friendly sizing advisers available directly via instant chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
