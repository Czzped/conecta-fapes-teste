import React, { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';

interface CalendarioFolhaProps {
  onBack: () => void;
}

type CalendarField = 'solicitacao' | 'geracao' | 'pagamento';

interface MonthSchedule {
  monthIndex: number;
  monthName: string;
  solicitacao: string;
  geracao: string;
  pagamento: string;
}

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const fieldLabels: Record<CalendarField, string> = {
  solicitacao: 'Solicitação de Bolsas',
  geracao: 'Geração das Folhas',
  pagamento: 'Pagamento da Folha',
};

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const toInputDate = (year: number, monthIndex: number, day: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const lastDayOfMonth = (year: number, monthIndex: number) =>
  new Date(year, monthIndex + 1, 0).getDate();

const buildSchedule = (year: number): MonthSchedule[] =>
  monthNames.map((monthName, monthIndex) => ({
    monthIndex,
    monthName,
    solicitacao: toInputDate(year, monthIndex, 3),
    geracao: toInputDate(year, monthIndex, 18),
    pagamento: toInputDate(year, monthIndex, lastDayOfMonth(year, monthIndex)),
  }));

export const CalendarioFolha: React.FC<CalendarioFolhaProps> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [schedule, setSchedule] = useState<MonthSchedule[]>(() => buildSchedule(currentYear));
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState<{ monthIndex: number; field: CalendarField } | null>(null);
  const [calendarCursor, setCalendarCursor] = useState(() => ({ monthIndex: currentMonthIndex, year: currentYear }));

  const yearOptions = useMemo(
    () => Array.from({ length: 5 }, (_, index) => currentYear - 1 + index),
    [currentYear],
  );

  const displayedSchedule = useMemo(() => {
    const scheduleYear = Number(schedule[0]?.solicitacao.split('-')[0]);
    return scheduleYear === selectedYear ? schedule : buildSchedule(selectedYear);
  }, [schedule, selectedYear]);

  const isEditableMonth = (monthIndex: number) =>
    selectedYear > currentYear || (selectedYear === currentYear && monthIndex >= currentMonthIndex);

  const updateDate = (monthIndex: number, field: CalendarField, value: string) => {
    setSchedule((current) => {
      const currentYearInState = Number(current[0]?.solicitacao.split('-')[0]);
      const base = currentYearInState === selectedYear ? current : buildSchedule(selectedYear);

      return base.map((month) =>
        month.monthIndex === monthIndex ? { ...month, [field]: value } : month,
      );
    });
  };

  const openCalendar = (monthIndex: number, field: CalendarField, value: string) => {
    const [year, month] = value.split('-').map(Number);
    setCalendarCursor({ year, monthIndex: month - 1 });
    setOpenDatePicker({ monthIndex, field });
  };

  const selectDate = (day: number) => {
    if (!openDatePicker) return;
    updateDate(openDatePicker.monthIndex, openDatePicker.field, toInputDate(calendarCursor.year, calendarCursor.monthIndex, day));
    setOpenDatePicker(null);
  };

  const calendarDays = useMemo(() => {
    const firstWeekday = new Date(calendarCursor.year, calendarCursor.monthIndex, 1).getDay();
    const daysInMonth = lastDayOfMonth(calendarCursor.year, calendarCursor.monthIndex);
    const previousMonthIndex = calendarCursor.monthIndex === 0 ? 11 : calendarCursor.monthIndex - 1;
    const previousMonthYear = calendarCursor.monthIndex === 0 ? calendarCursor.year - 1 : calendarCursor.year;
    const daysInPreviousMonth = lastDayOfMonth(previousMonthYear, previousMonthIndex);
    const cells: Array<{ day: number; current: boolean }> = [];

    for (let index = firstWeekday - 1; index >= 0; index -= 1) {
      cells.push({ day: daysInPreviousMonth - index, current: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, current: true });
    }

    while (cells.length < 42) {
      cells.push({ day: cells.length - firstWeekday - daysInMonth + 1, current: false });
    }

    return cells;
  }, [calendarCursor]);

  const inputStyle = (editable: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem 0.875rem',
    backgroundColor: editable ? T.bgInput : T.bgSurfaceMuted,
    color: editable ? T.textPrimary : T.textMuted,
    border: `1px solid ${T.borderStrong}`,
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    cursor: editable ? 'pointer' : 'not-allowed',
    colorScheme: T.bgPage === '#fafafa' ? 'light' : 'dark',
  });

  const DatePickerPopover = () => (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 0.5rem)',
        left: 0,
        right: 0,
        backgroundColor: T.bgSurface,
        border: `1px solid ${T.borderStrong}`,
        borderRadius: 'var(--radius)',
        boxShadow: T.shadowMd,
        padding: '1rem',
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button type="button" aria-label="Ano anterior" onClick={() => setCalendarCursor((cursor) => ({ ...cursor, year: cursor.year - 1 }))} style={{ background: 'none', border: 'none', color: T.textPrimary, cursor: 'pointer', padding: '0.25rem' }}>
          <ChevronsLeft size={18} />
        </button>
        <button type="button" aria-label="Mês anterior" onClick={() => setCalendarCursor((cursor) => cursor.monthIndex === 0 ? { year: cursor.year - 1, monthIndex: 11 } : { ...cursor, monthIndex: cursor.monthIndex - 1 })} style={{ background: 'none', border: 'none', color: T.textPrimary, cursor: 'pointer', padding: '0.25rem' }}>
          <ChevronLeft size={18} />
        </button>
        <strong style={{ color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', textTransform: 'lowercase' }}>
          {monthNames[calendarCursor.monthIndex]} de {calendarCursor.year}
        </strong>
        <button type="button" aria-label="Próximo mês" onClick={() => setCalendarCursor((cursor) => cursor.monthIndex === 11 ? { year: cursor.year + 1, monthIndex: 0 } : { ...cursor, monthIndex: cursor.monthIndex + 1 })} style={{ background: 'none', border: 'none', color: T.textPrimary, cursor: 'pointer', padding: '0.25rem' }}>
          <ChevronRight size={18} />
        </button>
        <button type="button" aria-label="Próximo ano" onClick={() => setCalendarCursor((cursor) => ({ ...cursor, year: cursor.year + 1 }))} style={{ background: 'none', border: 'none', color: T.textPrimary, cursor: 'pointer', padding: '0.25rem' }}>
          <ChevronsRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.375rem' }}>
        {weekDays.map((day, index) => (
          <div key={`${day}-${index}`} style={{ color: '#06b6d4', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', textAlign: 'center', padding: '0.35rem 0' }}>
            {day}
          </div>
        ))}
        {calendarDays.map((cell, index) => {
          const selected = openDatePicker ? displayedSchedule[openDatePicker.monthIndex]?.[openDatePicker.field] === toInputDate(calendarCursor.year, calendarCursor.monthIndex, cell.day) && cell.current : false;

          return (
            <button
              key={`${cell.day}-${index}`}
              type="button"
              disabled={!cell.current}
              onClick={() => cell.current && selectDate(cell.day)}
              style={{
                height: '34px',
                border: 'none',
                borderRadius: '999px',
                backgroundColor: selected ? T.accent : 'transparent',
                color: selected ? T.accentText : cell.current ? T.textPrimary : T.textMuted,
                cursor: cell.current ? 'pointer' : 'default',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-family)',
              }}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', marginBottom: '0.75rem' }}>
              <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, color: T.textSecondary, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                Configurações
              </button>
              <ChevronRight size={14} />
              <span style={{ color: T.textPrimary }}>Calendário da Folha</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={onBack}
                aria-label="Voltar para configurações"
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  backgroundColor: T.accentSoft,
                  color: T.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, margin: 0, lineHeight: '1.5' }}>
                Calendário da Folha
              </h1>
            </div>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 0 48px', lineHeight: '1.5' }}>
              Configure as datas mensais de solicitação, geração e pagamento da folha de bolsas.
            </p>
        </div>

        <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, margin: '20px 0 28px' }} />

        <section style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>
              Ano
            </label>
            <div style={{ position: 'relative', width: '220px' }}>
              <button
                type="button"
                onClick={() => setIsYearOpen((open) => !open)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.875rem',
                  backgroundColor: T.bgInput,
                  color: T.textPrimary,
                  border: `1px solid ${T.borderStrong}`,
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                {selectedYear}
                <ChevronDown size={16} style={{ color: T.iconSubdued }} />
              </button>
              {isYearOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setIsYearOpen(false)} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 0.375rem)', left: 0, right: 0, backgroundColor: T.bgSurface, border: `1px solid ${T.borderStrong}`, borderRadius: 'var(--radius)', boxShadow: T.shadowMd, overflow: 'hidden', zIndex: 30 }}>
                    {yearOptions.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.875rem',
                          backgroundColor: selectedYear === year ? T.accentSoft : 'transparent',
                          color: selectedYear === year ? T.accent : T.textPrimary,
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
        </section>

        <section style={{ position: 'relative' }}>
            <div className="space-y-8">
            {displayedSchedule.map((month, index) => {
              const editable = isEditableMonth(month.monthIndex);
              const isCurrent = selectedYear === currentYear && month.monthIndex === currentMonthIndex;
              const isLast = index === displayedSchedule.length - 1;

              return (
                <article key={month.monthIndex} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', columnGap: '28px' }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: '7px' }}>
                    {!isLast && (
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '31px',
                          bottom: '-38px',
                          width: '3px',
                          backgroundColor: isCurrent ? T.accent : T.borderStrong,
                          borderRadius: '999px',
                        }}
                      />
                    )}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'relative',
                      width: '18px',
                      height: '18px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: isCurrent ? T.accent : T.borderStrong,
                    }}
                  />
                  </div>
                  <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px', marginBottom: '18px' }}>
                    <h2 style={{ color: editable ? T.textPrimary : T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                      {month.monthName}
                    </h2>
                    {isCurrent && (
                      <span style={{ color: T.accent, backgroundColor: T.accentSoft, border: `1px solid ${T.accent}`, borderRadius: '999px', padding: '0.125rem 0.5rem', fontSize: 'var(--text-xs)', lineHeight: 1.2, fontWeight: 'var(--font-weight-medium)' }}>
                        Atual
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {(Object.keys(fieldLabels) as CalendarField[]).map((field) => (
                      <div key={field} style={{ position: 'relative' }}>
                        <label style={{ display: 'block', color: editable ? T.textPrimary : T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem' }}>
                          {fieldLabels[field]}
                        </label>
                        {editable ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openCalendar(month.monthIndex, field, month[field])}
                              style={{ ...inputStyle(true), display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
                            >
                              <span>{formatDate(month[field])}</span>
                              <CalendarDays size={16} style={{ color: T.iconColor }} />
                            </button>
                            {openDatePicker?.monthIndex === month.monthIndex && openDatePicker.field === field && (
                              <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setOpenDatePicker(null)} />
                                <DatePickerPopover />
                              </>
                            )}
                          </>
                        ) : (
                          <div style={{ ...inputStyle(false), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{formatDate(month[field])}</span>
                            <CalendarDays size={16} style={{ color: T.iconSubdued }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </div>
                </article>
              );
            })}
            </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
          <button
            type="button"
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: T.accent,
              color: T.accentText,
              border: `1px solid ${T.accent}`,
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
            }}
          >
            Salvar Calendário
          </button>
        </div>
      </div>
    </div>
  );
};
