import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
          value !== 'All'
            ? 'bg-red-600 text-white'
            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
        }`}
      >
        <span className="truncate">{label}: {value}</span>
        <ChevronDown
          size={12}
          className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-sm border border-white/[0.1] rounded-lg py-1 z-50 shadow-xl min-w-max">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                value === option
                  ? 'bg-red-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
