import { Plus, Minus } from 'lucide-react';

interface BolsaCardProps {
  modalidade: string;
  valor: number;
  cotasDisponiveis: number;
  cotasDesejadas: number;
  onCotasChange: (value: number) => void;
}

export function BolsaCard({ modalidade, valor, cotasDisponiveis, cotasDesejadas, onCotasChange }: BolsaCardProps) {
  return (
    <div 
      className="p-4"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}
    >
      <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-24 md:justify-between md:items-start">
        <div className="w-[45%] md:w-auto md:flex-1">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem' }}>
            Modalidade
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            {modalidade}
          </div>
        </div>
        <div className="w-[45%] md:w-auto md:flex-1">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>
            Valor da Bolsa
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="w-[45%] md:w-auto md:flex-1">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>
            Cotas Disponíveis
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            {cotasDisponiveis}
          </div>
        </div>
        <div className="w-[45%] md:w-auto md:flex-1">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>
            Cotas Desejadas
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCotasChange(Math.max(0, cotasDesejadas - 1))}
              className="transition-colors"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={cotasDesejadas === 0}
            >
              <Minus size={16} style={{ color: cotasDesejadas === 0 ? 'var(--muted-foreground)' : '#0891b2' }} />
            </button>
            <div 
              style={{ 
                color: 'var(--foreground)', 
                fontSize: 'var(--text-sm)',
                minWidth: '30px',
                textAlign: 'center',
              }}
            >
              {cotasDesejadas}
            </div>
            <button
              onClick={() => onCotasChange(cotasDesejadas + 1)}
              className="transition-colors"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={16} style={{ color: '#0891b2' }} />
            </button>
          </div>
        </div>
        <div className="w-[45%] md:w-auto md:flex-1">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem' }}>
            Valor Total
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            R$ {(cotasDesejadas * valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}