import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ListPagination({ currentPage, totalPages, onPageChange }: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
  };

  const renderButton = (content: number | ReactNode, page: number, label: string, disabled = false) => {
    const isActive = page === currentPage && typeof content === 'number';

    return (
      <button
        key={label}
        type="button"
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        disabled={disabled}
        onClick={() => goToPage(page)}
        className="flex items-center justify-center transition-colors"
        style={{
          width: '36px',
          height: '36px',
          border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          backgroundColor: isActive ? 'var(--primary)' : 'transparent',
          color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
          fontSize: '14px',
          fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
        }}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="flex justify-end mt-6">
      <div className="flex items-center gap-1.5">
        {renderButton(<ChevronsLeft size={16} />, 1, 'Primeira página', currentPage === 1)}
        {renderButton(<ChevronLeft size={16} />, currentPage - 1, 'Página anterior', currentPage === 1)}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) =>
          renderButton(page, page, `Página ${page}`),
        )}
        {renderButton(<ChevronRight size={16} />, currentPage + 1, 'Próxima página', currentPage === totalPages)}
        {renderButton(<ChevronsRight size={16} />, totalPages, 'Última página', currentPage === totalPages)}
      </div>
    </div>
  );
}
