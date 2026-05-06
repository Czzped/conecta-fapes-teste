import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  backgroundColor?: string;
}

export function Dropdown({ value, onChange, options, placeholder = 'Selecione', className = '', disabled = false, backgroundColor = 'var(--input-background)' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 pr-10 text-left transition-colors"
        style={{
          backgroundColor,
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {displayText}
      </button>

      {/* Chevron Icon */}
      <ChevronDown
        size={16}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--muted-foreground)',
          pointerEvents: 'none',
          transition: 'transform 0.2s',
          ...(isOpen && { transform: 'translateY(-50%) rotate(180deg)' }),
        }}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 overflow-hidden"
          style={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--elevation-sm)',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left transition-colors flex items-center gap-3"
                style={{
                  backgroundColor: isSelected ? 'color-mix(in srgb, var(--primary) 16%, var(--popover))' : 'transparent',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: 'var(--primary-foreground)',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={16} />}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
