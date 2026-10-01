import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsSizeDrawerOpen, showToast } = useApp();

  return (
    <footer className="bg-[#f8ebe8] border-t border-[#d9c1be]/40 mt-16 text-[#201a18]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Narrative Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-tight uppercase text-[#201a18] font-semibold">
                TRIPLE J UNDIES
              </span>
            </div>
            <p className="font-sans text-sm text-[#534340] max-w-sm leading-relaxed">
              Intimate comfort and soft tactile minimalism. Thoughtfully crafted intimates
              designed to support you comfortably from morning to night.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#f2e6e2] text-[#201a18] text-xs font-medium border border-[#d9c1be]/40">
                B-Corp Certified
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f2e6e2] text-[#201a18] text-xs font-medium border border-[#d9c1be]/40">
                Carbon Neutral Delivery
              </span>
            </div>
          </div>

          {/* Links Column 1: Our Commitments */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sans text-sm text-[#201a18] font-semibold uppercase tracking-wider">
              Our Commitments
            </h4>
            <ul className="space-y-2.5 text-xs text-[#534340]">
              <li>
                <button
                  onClick={() =>
                    showToast(
                      'Softness Promise: Micro-modal and organic combed cotton tested on sensitive skin.',
                      'spa'
                    )
                  }
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left"
                >
                  Softness Promise
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    showToast(
                      'Size Guarantee: First pair exchanges are 100% free if it does not fit.',
                      'sync'
                    )
                  }
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left"
                >
                  Size Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    showToast(
                      'Discreet Packaging: Shipped in plain, recyclable unbranded kraft envelopes.',
                      'lock'
                    )
                  }
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left"
                >
                  Discreet Packaging
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Assistance */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sans text-sm text-[#201a18] font-semibold uppercase tracking-wider">
              Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#534340]">
              <li>
                <button
                  onClick={() => setIsSizeDrawerOpen(true)}
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Size &amp; Fit Guide</span>
                  <span className="material-symbols-outlined text-[14px]">straighten</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('account')}
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="text-[#8c493f] font-semibold hover:underline cursor-pointer text-left flex items-center gap-1"
                >
                  <span>Direct Chat</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#506355]"></span>
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal & Transparency */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-sans text-sm text-[#201a18] font-semibold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#534340]">
              <li>
                <button
                  onClick={() =>
                    showToast(
                      'Privacy Policy: We never share or sell your intimate measurements or orders.',
                      'verified_user'
                    )
                  }
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    showToast(
                      'Terms of Service: Simple, fair customer purchase and exchange guarantees.',
                      'gavel'
                    )
                  }
                  className="hover:text-[#8c493f] transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Sub-bar */}
        <div className="pt-8 border-t border-[#d9c1be]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#534340]">
          <p>© 2024 Triple J Undies. All rights reserved. Intimate comfort &amp; soft tactile minimalism.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[#506355] font-medium">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Encrypted 256-bit Checkout
            </span>
            <span className="hidden sm:inline text-[#867370]">·</span>
            <span>Designed with respect for every curve.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
