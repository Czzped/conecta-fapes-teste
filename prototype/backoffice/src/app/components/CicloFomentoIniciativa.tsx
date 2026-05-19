import React from 'react';
import {
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  FileEdit,
  FileText,
  PauseCircle,
  PlayCircle,
  Send,
  UserCheck,
  XCircle,
} from 'lucide-react';

type EstadoEstagio = 'CONCLUIDO' | 'ATUAL' | 'PENDENTE' | 'CANCELADO';

interface EstagioCiclo {
  ordem: number;
  marco: string;
  fase: 'PRE_AWARD' | 'AWARD' | 'POST_AWARD';
  estado: EstadoEstagio;
  data?: string;
  moduloOrigem: string;
  referenciaOrigemId?: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

const estagios: EstagioCiclo[] = [
  { ordem: 1, marco: 'SUBMISSAO', fase: 'PRE_AWARD', estado: 'CONCLUIDO', data: '15/01/2024', moduloOrigem: 'M011', referenciaOrigemId: 'PROP-2024-088', Icon: Send },
  { ordem: 2, marco: 'AVALIACAO_DOCUMENTOS', fase: 'PRE_AWARD', estado: 'CONCLUIDO', data: '20/01/2024', moduloOrigem: 'M011', referenciaOrigemId: 'HAB-2024-031', Icon: FileText },
  { ordem: 3, marco: 'AVALIACAO_AD_HOC', fase: 'PRE_AWARD', estado: 'CONCLUIDO', data: '05/02/2024', moduloOrigem: 'M011', referenciaOrigemId: 'MER-2024-044', Icon: UserCheck },
  { ordem: 4, marco: 'EM_CONTRATACAO', fase: 'AWARD', estado: 'CONCLUIDO', data: '20/02/2024', moduloOrigem: 'M022', referenciaOrigemId: 'OUT-2024-017', Icon: FileEdit },
  { ordem: 5, marco: 'CONTRATADO', fase: 'AWARD', estado: 'CONCLUIDO', data: '01/03/2024', moduloOrigem: 'M003', referenciaOrigemId: 'INI-2024-014', Icon: CheckCircle },
  { ordem: 6, marco: 'EM_EXECUCAO', fase: 'POST_AWARD', estado: 'ATUAL', data: '16/03/2024', moduloOrigem: 'M003', referenciaOrigemId: 'INI-2024-014', Icon: PlayCircle },
  { ordem: 7, marco: 'SUSPENSA', fase: 'POST_AWARD', estado: 'PENDENTE', moduloOrigem: 'M015', Icon: PauseCircle },
  { ordem: 8, marco: 'EM_APROVACAO_CONTAS', fase: 'POST_AWARD', estado: 'PENDENTE', moduloOrigem: 'M014', Icon: DollarSign },
  { ordem: 9, marco: 'CONCLUIDO', fase: 'POST_AWARD', estado: 'PENDENTE', moduloOrigem: 'M015', Icon: Award },
  { ordem: 10, marco: 'CANCELADA', fase: 'POST_AWARD', estado: 'PENDENTE', moduloOrigem: 'M015', Icon: XCircle },
];

const estadoStyle = {
  CONCLUIDO: { label: 'Concluido', color: '#00c1af', bg: 'rgba(0, 193, 175, 0.12)' },
  ATUAL: { label: 'Atual', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.14)' },
  PENDENTE: { label: 'Pendente', color: '#a3a3a3', bg: 'rgba(163, 163, 163, 0.14)' },
  CANCELADO: { label: 'Cancelado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
};

const faseLabel = {
  PRE_AWARD: 'Pre-award',
  AWARD: 'Award',
  POST_AWARD: 'Post-award',
};

export const CicloFomentoIniciativa: React.FC = () => {
  const atual = estagios.find((estagio) => estagio.estado === 'ATUAL');

  return (
    <div className="pt-8 px-8 pb-10">
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: '36px', height: '36px', backgroundColor: 'rgba(59, 130, 246, 0.12)', borderRadius: 'var(--radius)' }}
          >
            <Clock size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div className="flex-1" style={{ marginTop: '4px' }}>
            <h1
              className="mb-2"
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--dash-text-primary)',
                lineHeight: '1.5',
              }}
            >
              Ciclo de Fomento da Iniciativa
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>
              Timeline transversal com marcos de captacao, contratacao, execucao e encerramento.
            </p>
          </div>
        </div>
        <div className="mt-6" style={{ width: '100%', height: '1px', backgroundColor: 'var(--dash-divider)' }} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Iniciativa', value: 'INI-2024-014' },
          { label: 'Marco atual', value: atual?.marco.replaceAll('_', ' ') ?? 'Nao definido' },
          { label: 'Origem atual', value: atual ? `${atual.moduloOrigem} · ${atual.referenciaOrigemId}` : 'Nao definida' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--dash-card-bg)',
              border: '1px solid var(--dash-card-border)',
              boxShadow: 'var(--dash-shadow)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 6px' }}>{label}</p>
            <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', color: 'var(--dash-text-primary)' }}>{value}</strong>
          </div>
        ))}
      </section>

      <section
        className="rounded-lg p-5"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-card-border)',
          boxShadow: 'var(--dash-shadow)',
        }}
      >
        <div className="space-y-3">
          {estagios.map((estagio) => {
            const Icon = estagio.Icon;
            const state = estadoStyle[estagio.estado];

            return (
              <article
                key={estagio.marco}
                className="grid grid-cols-[44px_minmax(0,1fr)_auto] gap-4 items-start rounded-lg p-4"
                style={{
                  backgroundColor: estagio.estado === 'ATUAL' ? 'rgba(59, 130, 246, 0.08)' : 'var(--dash-input-bg)',
                  border: estagio.estado === 'ATUAL' ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid var(--dash-card-border)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: state.bg,
                    color: state.color,
                  }}
                >
                  <Icon size={20} style={{ color: state.color }} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', color: 'var(--dash-text-primary)', margin: 0 }}>
                      {estagio.ordem}. {estagio.marco.replaceAll('_', ' ')}
                    </h2>
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: state.bg, color: state.color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}
                    >
                      {state.label}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
                    {faseLabel[estagio.fase]} · Origem {estagio.moduloOrigem}
                    {estagio.referenciaOrigemId ? ` · ${estagio.referenciaOrigemId}` : ''}
                  </p>
                </div>

                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>
                  {estagio.data ?? 'Pendente'}
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
