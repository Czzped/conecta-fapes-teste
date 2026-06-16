import React, { useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';

const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const toInputDate = (year: number, monthIndex: number, day: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, monthIndex: month - 1, day };
};

const formatDate = (value: string) => {
  const parsed = parseDate(value);
  if (!parsed) return '';
  return `${String(parsed.day).padStart(2, '0')}/${String(parsed.monthIndex + 1).padStart(2, '0')}/${parsed.year}`;
};

interface BackofficeDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}

export const BackofficeDatePicker: React.FC<BackofficeDatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'dd/mm/aaaa',
  style,
  onFocus,
  onBlur,
}) => {
  const { T } = useThemeTokens();
  const parsed = parseDate(value);
  const today = new Date();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => ({
    year: parsed?.year ?? today.getFullYear(),
    monthIndex: parsed?.monthIndex ?? today.getMonth(),
  }));

  const days = useMemo(() => {
    const firstWeekday = new Date(cursor.year, cursor.monthIndex, 1).getDay();
    const currentDays = new Date(cursor.year, cursor.monthIndex + 1, 0).getDate();
    const previousMonthDays = new Date(cursor.year, cursor.monthIndex, 0).getDate();
    const cells: Array<{ day: number; current: boolean }> = [];

    for (let i = firstWeekday - 1; i >= 0; i -= 1) {
      cells.push({ day: previousMonthDays - i, current: false });
    }
    for (let day = 1; day <= currentDays; day += 1) {
      cells.push({ day, current: true });
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      cells.push({ day: cells.length - firstWeekday - currentDays + 1, current: false });
    }

    return cells;
  }, [cursor]);

  const selected = parseDate(value);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 399 }} onClick={() => setOpen(false)} />}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          const current = parseDate(value);
          if (current) setCursor({ year: current.year, monthIndex: current.monthIndex });
          setOpen(open => !open);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : style?.opacity,
        }}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <CalendarDays size={16} style={{ color: T.iconColor, flexShrink: 0 }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '320px',
            maxWidth: 'calc(100vw - 32px)',
            padding: '14px',
            backgroundColor: '#171717',
            border: '1px solid rgba(56,189,248,0.18)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 18px 42px rgba(0,0,0,0.45)',
            zIndex: 400,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '32px 32px 1fr 32px 32px', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <button type="button" aria-label="Ano anterior" onClick={() => setCursor(c => ({ ...c, year: c.year - 1 }))} style={{ height: '32px', background: 'transparent', border: 'none', color: '#f5f5f5', cursor: 'pointer' }}><ChevronsLeft size={20} /></button>
            <button type="button" aria-label="Mês anterior" onClick={() => setCursor(c => c.monthIndex === 0 ? { year: c.year - 1, monthIndex: 11 } : { ...c, monthIndex: c.monthIndex - 1 })} style={{ height: '32px', background: 'transparent', border: 'none', color: '#f5f5f5', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
            <strong style={{ color: '#f5f5f5', fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-semibold)', textAlign: 'center' }}>{monthNames[cursor.monthIndex]} de {cursor.year}</strong>
            <button type="button" aria-label="Próximo mês" onClick={() => setCursor(c => c.monthIndex === 11 ? { year: c.year + 1, monthIndex: 0 } : { ...c, monthIndex: c.monthIndex + 1 })} style={{ height: '32px', background: 'transparent', border: 'none', color: '#f5f5f5', cursor: 'pointer' }}><ChevronRight size={20} /></button>
            <button type="button" aria-label="Próximo ano" onClick={() => setCursor(c => ({ ...c, year: c.year + 1 }))} style={{ height: '32px', background: 'rgba(115,115,115,0.16)', border: 'none', borderRadius: 'var(--radius)', color: '#f5f5f5', cursor: 'pointer' }}><ChevronsRight size={20} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {weekDays.map((day, index) => (
              <div key={`${day}-${index}`} style={{ color: '#00c1af', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', textAlign: 'center', padding: '4px 0' }}>
                {day}
              </div>
            ))}
            {days.map((cell, index) => {
              const isSelected = Boolean(selected && cell.current && selected.year === cursor.year && selected.monthIndex === cursor.monthIndex && selected.day === cell.day);

              return (
                <button
                  key={`${cell.day}-${index}`}
                  type="button"
                  disabled={!cell.current}
                  onClick={() => {
                    if (!cell.current) return;
                    onChange(toInputDate(cursor.year, cursor.monthIndex, cell.day));
                    setOpen(false);
                  }}
                  style={{
                    height: '34px',
                    border: 'none',
                    borderRadius: '999px',
                    backgroundColor: isSelected ? '#00c1af' : 'transparent',
                    color: isSelected ? '#052f2a' : cell.current ? '#f5f5f5' : '#737373',
                    cursor: cell.current ? 'pointer' : 'default',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
