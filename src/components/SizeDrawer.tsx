import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductSize } from '../types';

interface SizeGuideRow {
  size: ProductSize;
  waist: string;
  hips: string;
  recommendedCuts: string;
}

const SIZE_CHART: SizeGuideRow[] = [
  { size: 'XS', waist: '24 - 25"', hips: '34 - 35"', recommendedCuts: 'Breathe Bare Bikini, Cloud Modal' },
  { size: 'S', waist: '26 - 28"', hips: '36 - 38"', recommendedCuts: 'High-Rise Brief, Ribbed Cotton Bikini' },
  { size: 'M', waist: '29 - 31"', hips: '39 - 41"', recommendedCuts: 'All silhouettes, Boy Short, Bralette Set' },
  { size: 'L', waist: '32 - 34"', hips: '42 - 44"', recommendedCuts: 'Cloud Modal High-Rise, Boy Short' },
  { size: 'XL', waist: '35 - 37"', hips: '45 - 47"', recommendedCuts: 'Cloud Modal High-Rise, Bralette Set' },
  { size: '2XL', waist: '38 - 40"', hips: '48 - 50"', recommendedCuts: 'High-Rise Brief, Boy Short' },
  { size: '3XL', waist: '41 - 43"', hips: '51 - 53"', recommendedCuts: 'High-Rise Brief, Boy Short' },
];

export const SizeDrawer: React.FC = () => {
  const {
    isSizeDrawerOpen,
    setIsSizeDrawerOpen,
    selectedFilterSize,
    setSelectedFilterSize,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeSize, setActiveSize] = useState<ProductSize>(selectedFilterSize || 'M');

  // Synchronize active size with current selectedFilterSize whenever drawer opens
  React.useEffect(() => {
    if (isSizeDrawerOpen) {
      setActiveSize(selectedFilterSize || 'M');
    }
  }, [isSizeDrawerOpen, selectedFilterSize]);

  if (!isSizeDrawerOpen) return null;

  const handleApply = () => {
    setSelectedFilterSize(activeSize);
    setIsSizeDrawerOpen(false);
    setActiveTab('shop');
    showToast(`Applied size ${activeSize} filter to catalog`, 'tune');
  };

  const selectedRow = SIZE_CHART.find((r) => r.size === activeSize);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsSizeDrawerOpen(false)}
        className="absolute inset-0 bg-[#201a18]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#ffffff] shadow-2xl border-l border-[#d9c1be]/40 z-50 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#d9c1be]/40 mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8c493f] text-[24px]">
                straighten
              </span>
              <h3 className="font-serif text-2xl text-[#201a18] font-medium">
                Fit &amp; Size Finder
              </h3>
            </div>
            <button
              onClick={() => setIsSizeDrawerOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f8ebe8] text-[#867370] hover:text-[#201a18] transition-colors cursor-pointer"
              aria-label="Close size drawer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <p className="font-sans text-xs text-[#534340] mb-5 leading-relaxed">
            Select your hip and waist measurements to find your custom Triple J contour match.
            All fabrics feature gentle 4-way micro-elasticity that moves with you without pinching.
          </p>

          {/* Size Pills Grid */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#201a18] block mb-2.5">
              Select Size Pill
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'] as const).map((sz) => {
                const isSelected = activeSize === sz;
                const isUnavailable = sz === '4XL';

                if (isUnavailable) {
                  return (
                    <button
                      key={sz}
                      disabled
                      className="h-11 rounded-full bg-[#f8ebe8] text-[#867370] line-through text-xs font-semibold cursor-not-allowed border border-[#d9c1be]/40"
                    >
                      {sz}
                    </button>
                  );
                }

                return (
                  <button
                    key={sz}
                    onClick={() => setActiveSize(sz)}
                    className={`h-11 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#201a18] text-[#ffffff] shadow-sm ring-2 ring-[#8c493f]/40'
                        : 'border border-[#d9c1be] text-[#201a18] hover:border-[#8c493f]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Active Contour Preview */}
          {selectedRow && (
            <div className="mb-6 p-4 rounded-xl bg-[#fef1ed] border border-[#ffdad4]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#8c493f] uppercase tracking-wide">
                  Contour Profile for Size {activeSize}
                </span>
                <span className="text-xs font-medium text-[#506355] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#506355]"></span>
                  True to Body Ease
                </span>
              </div>
              <p className="text-xs text-[#534340]">
                Waist: <strong className="text-[#201a18]">{selectedRow.waist}</strong> · Hips:{' '}
                <strong className="text-[#201a18]">{selectedRow.hips}</strong>
              </p>
              <p className="text-[11px] text-[#867370] mt-1">
                Best loved in: {selectedRow.recommendedCuts}
              </p>
            </div>
          )}

          {/* Guidance Matrix Table */}
          <div className="rounded-xl border border-[#d9c1be]/50 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#f8ebe8] text-[#201a18] font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Waist (in)</th>
                  <th className="p-2.5">Hips (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9c1be]/30 text-[#534340]">
                {SIZE_CHART.map((row) => (
                  <tr
                    key={row.size}
                    onClick={() => setActiveSize(row.size)}
                    className={`cursor-pointer transition-colors ${
                      activeSize === row.size ? 'bg-[#ffdad4]/40 font-semibold text-[#201a18]' : 'hover:bg-[#fff8f6]'
                    }`}
                  >
                    <td className="p-2.5 font-semibold text-[#201a18]">{row.size}</td>
                    <td className="p-2.5">{row.waist}</td>
                    <td className="p-2.5">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-[#d9c1be]/40 space-y-2.5">
          <button
            onClick={handleApply}
            className="w-full py-3.5 rounded-full bg-[#8c493f] text-[#ffffff] font-semibold text-sm hover:bg-[#aa6055] transition-all active:scale-98 shadow-sm cursor-pointer"
          >
            Apply Size {activeSize} to Filters
          </button>
          {selectedFilterSize && (
            <button
              onClick={() => {
                setSelectedFilterSize(null);
                setIsSizeDrawerOpen(false);
                showToast('Cleared size filter', 'close');
              }}
              className="w-full py-2 text-center text-xs text-[#867370] hover:text-[#8c493f] cursor-pointer"
            >
              Clear Active Size Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
