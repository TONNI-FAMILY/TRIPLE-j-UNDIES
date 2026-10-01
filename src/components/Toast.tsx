import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-4 sm:left-6 z-50 max-w-sm w-auto animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#201a18] text-[#ffffff] shadow-2xl text-xs font-medium border border-[#362f2d]/80 backdrop-blur-md">
        <span className="material-symbols-outlined text-[#ffdad4] text-base shrink-0">
          {toast.icon || 'check_circle'}
        </span>
        <span className="truncate">{toast.message}</span>
      </div>
    </div>
  );
};
