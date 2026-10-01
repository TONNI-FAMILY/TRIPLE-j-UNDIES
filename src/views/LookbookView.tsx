import React from 'react';
import { useApp } from '../context/AppContext';
import { VIDEO_STORIES, PRODUCTS } from '../data/products';

export const LookbookView: React.FC = () => {
  const { openVideoPlayer, openProductDetails, addToCart, startChatAboutProduct } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-20 w-full space-y-12">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f8ebe8] border border-[#d9c1be]/40 text-[#8c493f] text-xs font-semibold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c493f]"></span>
          Editorial Motion &amp; Craft
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#201a18] font-normal">
          The Fabric &amp; Drape Lookbook
        </h1>
        <p className="font-sans text-sm md:text-base text-[#534340] leading-relaxed">
          See how our Austrian micro-modal and Greek organic cotton move in natural life. Watch 4K
          fit guide reels, motion tests, and fabric recovery demonstrations.
        </p>
      </section>

      {/* Featured Reel Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIDEO_STORIES.map((story) => {
          const featuredProduct =
            PRODUCTS.find((p) => p.id === story.featuredProductId) || PRODUCTS[0];

          return (
            <div
              key={story.id}
              className="bg-[#ffffff] rounded-3xl border border-[#d9c1be]/50 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Video Thumbnail Hero */}
              <div
                onClick={() => openVideoPlayer(story)}
                className="relative aspect-16/10 bg-[#201a18] overflow-hidden group cursor-pointer"
              >
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#201a18]/70 via-transparent to-black/20 flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#fff8f6]/95 backdrop-blur-md text-[#201a18] text-xs font-semibold uppercase tracking-wider">
                      {story.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[#ffffff] text-xs">
                      {story.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#ffffff] font-serif text-xl sm:text-2xl font-medium drop-shadow-sm">
                      {story.title}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-[#8c493f] text-[#ffffff] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      <span className="material-symbols-outlined text-2xl">play_arrow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Narrative & Shoppable Link */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-[#534340] leading-relaxed">{story.description}</p>

                {/* Shoppable Product Anchor Card */}
                <div className="pt-3 border-t border-[#d9c1be]/30 flex items-center justify-between gap-4">
                  <div
                    onClick={() => openProductDetails(featuredProduct)}
                    className="flex items-center gap-3 cursor-pointer group/prod"
                  >
                    <img
                      src={featuredProduct.images[0]}
                      alt={featuredProduct.name}
                      className="w-12 h-14 rounded-lg object-cover bg-[#f8ebe8] border border-[#d9c1be]/40 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8c493f] tracking-wider block">
                        Featured Piece
                      </span>
                      <h4 className="font-sans text-xs font-semibold text-[#201a18] group-hover/prod:text-[#8c493f] transition-colors line-clamp-1">
                        {featuredProduct.name}
                      </h4>
                      <p className="text-xs text-[#534340] font-semibold">
                        ${featuredProduct.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        startChatAboutProduct(
                          featuredProduct,
                          'M',
                          featuredProduct.colors[0],
                          `Hi Sarah, I just watched "${story.title}" and wanted to ask about the fit on the ${featuredProduct.name}.`
                        )
                      }
                      className="p-2.5 rounded-full bg-[#f8ebe8] hover:bg-[#ffdad4] text-[#8c493f] transition-colors cursor-pointer"
                      title="Ask in Chat"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                    </button>
                    <button
                      onClick={() => addToCart(featuredProduct)}
                      className="px-4 py-2 rounded-full bg-[#8c493f] hover:bg-[#aa6055] text-[#ffffff] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Behind The Seams: Fabric Engineering Breakdown */}
      <section className="rounded-3xl bg-[#f8ebe8] border border-[#d9c1be]/50 p-8 md:p-10">
        <div className="max-w-3xl mb-8 space-y-2">
          <span className="text-xs text-[#8c493f] uppercase font-bold tracking-wider">
            Material Science
          </span>
          <h2 className="font-serif text-3xl text-[#201a18]">
            Why Botanical Micro-Modal Trumps Synthetic Elastane
          </h2>
          <p className="text-xs text-[#534340] leading-relaxed">
            Every fabric in the Triple J catalog is engineered with single-origin botanical fibers.
            Here is how our fabrics perform under real daily wear conditions:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d9c1be]/40 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#f8ebe8] text-[#8c493f] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">air</span>
            </div>
            <h4 className="font-sans text-sm font-semibold text-[#201a18]">
              Thermal Regulation
            </h4>
            <p className="text-xs text-[#534340] leading-relaxed">
              Beechwood modal fibers have micro-porous channels that naturally release heat and
              evaporate sweat 50% faster than standard cotton.
            </p>
          </div>

          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d9c1be]/40 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#f8ebe8] text-[#8c493f] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">straighten</span>
            </div>
            <h4 className="font-sans text-sm font-semibold text-[#201a18]">
              Zero-Pinch Elasticity
            </h4>
            <p className="text-xs text-[#534340] leading-relaxed">
              Woven with 4-way micro-elasticity rather than tight rubber cords, preventing red
              waistband indentations and evening chafing.
            </p>
          </div>

          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d9c1be]/40 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#f8ebe8] text-[#506355] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">spa</span>
            </div>
            <h4 className="font-sans text-sm font-semibold text-[#201a18]">
              OEKO-TEX Standard 100
            </h4>
            <p className="text-xs text-[#534340] leading-relaxed">
              Independently certified free from harmful chemical dyes, formaldehyde, and skin
              sensitizers for direct all-day contact.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
