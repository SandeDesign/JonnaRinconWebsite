import { useState } from 'react';
import { X, Sliders } from 'lucide-react';

interface FilterOption {
  label: string;
  options: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
}

interface FilterModalProps {
  filters: FilterOption[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({
  filters,
  isOpen,
  onClose,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/[0.06] bg-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Sliders size={20} className="text-red-500" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors text-white/60 hover:text-white"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-6">
            {filters.map((filter) => (
              <div key={filter.label}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                  {filter.label}
                </h3>
                <div className="space-y-2">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        filter.onChange(option);
                      }}
                      className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all text-left ${
                        filter.value === option
                          ? 'bg-red-600 text-white'
                          : 'bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.12]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex gap-3 p-6 border-t border-white/[0.06] bg-black/60 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white text-black rounded-lg font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
