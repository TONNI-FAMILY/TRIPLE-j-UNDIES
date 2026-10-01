import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const TopNavBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    favorites,
    cartCount,
    searchQuery,
    setSearchQuery,
    setIsCartDrawerOpen,
    openWishlist,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    setActiveTab('shop');
  };

  return (
    <header className="bg-[#fff8f6]/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#d9c1be]/40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 w-full">
        {/* Brand Slot / Adaptable Vector Crest Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setActiveTab('home');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-[#f8ebe8] flex items-center justify-center border border-[#d9c1be]/60 group-hover:bg-[#ffdad4] transition-colors">
              <span className="font-serif text-lg text-[#8c493f] leading-none font-semibold">
                J
              </span>
            </div>
            <span className="font-serif text-xl tracking-tight uppercase text-[#201a18] font-semibold">
              TRIPLE J UNDIES
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 ml-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`font-sans text-sm pb-1 transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'border-b-2 border-[#8c493f] text-[#8c493f] font-semibold'
                  : 'text-[#534340] hover:text-[#201a18]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`font-sans text-sm pb-1 transition-colors cursor-pointer ${
                activeTab === 'shop'
                  ? 'border-b-2 border-[#8c493f] text-[#8c493f] font-semibold'
                  : 'text-[#534340] hover:text-[#201a18]'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setActiveTab('lookbook')}
              className={`font-sans text-sm pb-1 transition-colors cursor-pointer ${
                activeTab === 'lookbook'
                  ? 'border-b-2 border-[#8c493f] text-[#8c493f] font-semibold'
                  : 'text-[#534340] hover:text-[#201a18]'
              }`}
            >
              Lookbook
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`font-sans text-sm pb-1 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-b-2 border-[#8c493f] text-[#8c493f] font-semibold'
                  : 'text-[#534340] hover:text-[#201a18]'
              }`}
            >
              Chat
              <span className="w-2 h-2 rounded-full bg-[#506355] inline-block animate-pulse"></span>
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`font-sans text-sm pb-1 transition-colors cursor-pointer ${
                activeTab === 'account'
                  ? 'border-b-2 border-[#8c493f] text-[#8c493f] font-semibold'
                  : 'text-[#534340] hover:text-[#201a18]'
              }`}
            >
              Account
            </button>
          </nav>
        </div>

        {/* Right Trailing Actions */}
        <div className="flex items-center gap-2 md:gap-3.5">
          {/* Live Support Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#d2e8d6]/60 border border-[#d9c1be]/40 text-[#384b3e] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#506355]"></span>
            <span>Online Now</span>
          </div>

          {/* Interactive Search Bar (Desktop) */}
          <div ref={searchContainerRef} className="relative hidden sm:block w-56 lg:w-64">
            <div className="flex items-center bg-[#ffffff] border border-[#d9c1be]/80 rounded-full px-3 py-1.5 focus-within:border-[#8c493f] focus-within:ring-2 focus-within:ring-[#8c493f]/20 transition-all">
              <span className="material-symbols-outlined text-[#867370] text-[18px] mr-2">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsSearchFocused(false);
                    setActiveTab('shop');
                  }
                }}
                placeholder="Search breathable sets..."
                className="w-full bg-transparent border-0 p-0 text-xs text-[#201a18] focus:ring-0 focus:outline-hidden placeholder:text-[#867370]/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#867370] hover:text-[#201a18] text-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Dropdown Quick Suggestions */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#ffffff] border border-[#d9c1be]/70 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <p className="text-[11px] uppercase tracking-wider text-[#867370] px-2 mb-2 font-semibold">
                  Popular Searches
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    'High-rise cotton',
                    'Seamless bare',
                    'Bralette set',
                    '3-pack bundle',
                    'Zero pinch modal',
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchSelect(term)}
                      className="text-left px-2 py-1.5 rounded-lg text-xs hover:bg-[#f8ebe8] text-[#201a18] flex items-center justify-between group cursor-pointer transition-colors"
                    >
                      <span>{term}</span>
                      <span className="material-symbols-outlined text-[#867370] text-[15px] group-hover:text-[#8c493f]">
                        trending_up
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setActiveTab('shop')}
            className="sm:hidden p-2 text-[#534340] hover:text-[#8c493f] transition-colors cursor-pointer"
            aria-label="Search Collection"
          >
            <span className="material-symbols-outlined text-xl">search</span>
          </button>

          {/* Wishlist Action */}
          <button
            onClick={openWishlist}
            aria-label={`Wishlist (${favorites.length} items)`}
            className="relative p-2 text-[#534340] hover:text-[#8c493f] transition-colors active:scale-95 cursor-pointer rounded-full hover:bg-[#f8ebe8]"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8c493f] text-[#ffffff] font-bold text-[10px] flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Action */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label={`Shopping Bag (${cartCount} items)`}
            className="relative p-2 text-[#534340] hover:text-[#8c493f] transition-colors active:scale-95 cursor-pointer rounded-full hover:bg-[#f8ebe8]"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#aa6055] text-[#ffffff] font-bold text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Direct Concierge Chat Action */}
          <button
            onClick={() => setActiveTab('chat')}
            aria-label="Open Chat Concierge"
            className="relative p-2 text-[#534340] hover:text-[#8c493f] transition-colors active:scale-95 cursor-pointer rounded-full hover:bg-[#f8ebe8]"
          >
            <span className="material-symbols-outlined text-[22px]">chat</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#506355] ring-2 ring-[#fff8f6]"></span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#534340] hover:text-[#8c493f] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fff8f6] border-b border-[#d9c1be]/40 px-4 py-4 space-y-3">
          <div className="flex items-center bg-[#ffffff] border border-[#d9c1be] rounded-full px-3 py-2 mb-3">
            <span className="material-symbols-outlined text-[#867370] text-sm mr-2">search</span>
            <input
              type="text"
              placeholder="Search fits, fabric, bundles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setMobileMenuOpen(false);
                  setActiveTab('shop');
                }
              }}
              className="w-full text-xs text-[#201a18] bg-transparent border-0 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left cursor-pointer ${
                activeTab === 'home' ? 'bg-[#ffdad4] text-[#8c493f] font-semibold' : 'bg-[#f8ebe8]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left cursor-pointer ${
                activeTab === 'shop' ? 'bg-[#ffdad4] text-[#8c493f] font-semibold' : 'bg-[#f8ebe8]'
              }`}
            >
              Shop Collection
            </button>
            <button
              onClick={() => {
                setActiveTab('lookbook');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left cursor-pointer ${
                activeTab === 'lookbook' ? 'bg-[#ffdad4] text-[#8c493f] font-semibold' : 'bg-[#f8ebe8]'
              }`}
            >
              Lookbook & Reels
            </button>
            <button
              onClick={() => {
                setActiveTab('chat');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer ${
                activeTab === 'chat' ? 'bg-[#ffdad4] text-[#8c493f] font-semibold' : 'bg-[#f8ebe8]'
              }`}
            >
              <span>Chat Concierge</span>
              <span className="w-2 h-2 rounded-full bg-[#506355]"></span>
            </button>
            <button
              onClick={() => {
                setActiveTab('account');
                setMobileMenuOpen(false);
              }}
              className={`col-span-2 p-2.5 rounded-xl text-left cursor-pointer ${
                activeTab === 'account' ? 'bg-[#ffdad4] text-[#8c493f] font-semibold' : 'bg-[#f8ebe8]'
              }`}
            >
              My Account & Orders
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
