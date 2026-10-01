import React from 'react';
import { useApp } from '../context/AppContext';

export const FloatingChatWidget: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  if (activeTab === 'chat') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Speech Bubble Teaser */}
      <button
        onClick={() => setActiveTab('chat')}
        className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#ffffff]/95 backdrop-blur-md border border-[#d9c1be]/60 shadow-lg text-[#201a18] transition-all transform hover:-translate-y-0.5 cursor-pointer text-left"
      >
        <span className="w-2 h-2 rounded-full bg-[#506355] animate-pulse"></span>
        <p className="font-sans text-xs">
          Have a question on size?{' '}
          <strong className="text-[#201a18] font-semibold">We are online.</strong>
        </p>
      </button>

      {/* Floating Action Button */}
      <button
        onClick={() => setActiveTab('chat')}
        aria-label="Open Live Chat Concierge"
        className="w-14 h-14 rounded-full bg-[#8c493f] text-[#ffffff] flex items-center justify-center shadow-lg hover:bg-[#aa6055] active:scale-95 transition-all cursor-pointer group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
          chat
        </span>
      </button>
    </div>
  );
};
