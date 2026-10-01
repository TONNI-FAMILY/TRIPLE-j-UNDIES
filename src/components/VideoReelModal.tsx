import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export const VideoReelModal: React.FC = () => {
  const { selectedVideo, closeVideoPlayer, addToCart, startChatAboutProduct } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  if (!selectedVideo) return null;

  const featuredProduct =
    PRODUCTS.find((p) => p.id === selectedVideo.featuredProductId) || PRODUCTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeVideoPlayer}
        className="fixed inset-0 bg-[#201a18]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-[#ffffff] rounded-2xl max-w-3xl w-full shadow-2xl border border-[#d9c1be]/60 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#f8ebe8] border-b border-[#d9c1be]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#aa6055] text-[#ffffff] text-[10px] font-semibold uppercase tracking-wider">
                {selectedVideo.tag}
              </span>
              <h3 className="font-serif text-lg text-[#201a18] font-medium truncate">
                {selectedVideo.title}
              </h3>
            </div>
            <button
              onClick={closeVideoPlayer}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ffdad4] text-[#534340] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Video Player Display Frame */}
          <div className="relative aspect-16/9 bg-[#201a18] overflow-hidden group">
            <img
              src={selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105 filter brightness-95' : 'filter brightness-80'
              }`}
            />

            {/* Video overlay controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#201a18]/90 via-transparent to-black/20 flex flex-col justify-between p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="bg-black/50 backdrop-blur-md text-[#ffffff] text-xs px-2.5 py-1 rounded-full font-medium">
                  {selectedVideo.category} • {selectedVideo.duration}
                </span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-[#ffffff] flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
              </div>

              {/* Center Play/Pause button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[#8c493f] text-[#ffffff] flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              {/* Bottom Progress Bar */}
              <div>
                <div className="w-full bg-[#ffffff]/30 h-1 rounded-full overflow-hidden mb-2">
                  <div
                    className={`bg-[#ffdad4] h-full ${
                      isPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#ffffff]/80">
                  <span>Playing 4K Motion Reel</span>
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Featured Product Card */}
          <div className="p-6 bg-[#fff8f6] space-y-5">
            <p className="text-xs text-[#534340] leading-relaxed">
              {selectedVideo.description}
            </p>

            {/* Shoppable Featured Product Anchor */}
            <div className="p-4 rounded-xl bg-[#ffffff] border border-[#d9c1be]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.name}
                  className="w-14 h-16 rounded-lg object-cover bg-[#f8ebe8] border border-[#d9c1be]/40 shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8c493f] tracking-wider">
                    Featured in this reel
                  </span>
                  <h4 className="font-sans text-sm font-semibold text-[#201a18]">
                    {featuredProduct.name}
                  </h4>
                  <p className="text-xs text-[#534340] font-medium">${featuredProduct.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    closeVideoPlayer();
                    startChatAboutProduct(
                      featuredProduct,
                      'M',
                      featuredProduct.colors[0],
                      `Hi! I saw the "${selectedVideo.title}" reel and would love advice on whether the ${featuredProduct.name} fits my body shape.`
                    );
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-[#d9c1be] text-xs font-semibold text-[#201a18] hover:bg-[#f8ebe8] transition-colors cursor-pointer"
                >
                  Ask Sizing Specialist
                </button>
                <button
                  onClick={() => {
                    addToCart(featuredProduct);
                    closeVideoPlayer();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all cursor-pointer shadow-xs"
                >
                  Quick Add (${featuredProduct.price})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
