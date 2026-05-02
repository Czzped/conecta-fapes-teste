import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, FileText, FolderKanban, PauseCircle, PlayCircle, Search, XCircle } from 'lucide-react';
import { SolicitacoesDiarias } from './SolicitacoesDiarias';

type StatusIniciativa = 'Submetida' | 'Aprovada' | 'Em contratação' | 'Em execução' | 'Suspensa' | 'Concluída' | 'Cancelada';

interface Iniciativa {
  codigo: string;
  titulo: string;
  proponente: string;
  coordenador: string;
  edital: string;
  status: StatusIniciativa;
  dataSubmissao: string;
  valorAprovado: string;
}

const iniciativas: Iniciativa[] = [
  {
    codigo: 'INI-2026-001',
    titulo: 'Conecta Fapes',
    proponente: 'Instituto Federal do Espírito Santo',
    coordenador: 'Marina Costa',
    edital: 'Edital 27/2025',
    status: 'Em execução',
    dataSubmissao: '15/01/2026',
    valorAprovado: 'R$ 1.250.000,00',
  },
  {
    codigo: 'INI-2026-002',
    titulo: 'Bioinsumos para agricultura de precisão',
    proponente: 'Universidade Federal do Espírito Santo',
    coordenador: 'André Carvalho',
    edital: 'Edital 18/2025',
    status: 'Submetida',
    dataSubmissao: '14/02/2026',
    valorAprovado: 'Em análise',
  },
  {
    codigo: 'INI-2026-003',
    titulo: 'Observatório Capixaba de Inovação',
    proponente: 'Fundação de Apoio à Pesquisa',
    coordenador: 'Helena Duarte',
    edital: 'Edital 21/2025',
    status: 'Aprovada',
    dataSubmissao: '28/01/2026',
    valorAprovado: 'R$ 420.000,00',
  },
  {
    codigo: 'INI-2026-004',
    titulo: 'Rede de sensores para cidades resilientes',
    proponente: 'Prefeitura Municipal de Vitória',
    coordenador: 'Ricardo Torres',
    edital: 'Edital 03/2026',
    status: 'Em contratação',
    dataSubmissao: '28/02/2026',
    valorAprovado: 'R$ 210.000,00',
  },
  {
    codigo: 'INI-2025-017',
    titulo: 'Pesquisa aplicada em saúde digital',
    proponente: 'Hospital Universitário Cassiano Antonio Moraes',
    coordenador: 'Paula Nascimento',
    edital: 'Edital 09/2025',
    status: 'Suspensa',
    dataSubmissao: '11/09/2025',
    valorAprovado: 'R$ 360.000,00',
  },
  {
    codigo: 'INI-2024-042',
    titulo: 'Laboratório móvel de educação científica',
    proponente: 'Universidade Vila Velha',
    coordenador: 'Lucas Moreira',
    edital: 'Edital 12/2024',
    status: 'Concluída',
    dataSubmissao: '03/05/2024',
    valorAprovado: 'R$ 180.000,00',
  },
  {
    codigo: 'INI-2024-038',
    titulo: 'Plataforma de dados ambientais',
    proponente: 'Instituto Jones dos Santos Neves',
    coordenador: 'Sofia Almeida',
    edital: 'Edital 07/2024',
    status: 'Cancelada',
    dataSubmissao: '18/04/2024',
    valorAprovado: 'R$ 95.000,00',
  },
];

const statusStyle: Record<StatusIniciativa, { color: string; bg: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  Submetida: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', Icon: FileText },
  Aprovada: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', Icon: CheckCircle },
  'Em contratação': { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', Icon: Clock },
  'Em execução': { color: '#00c1af', bg: 'rgba(0, 193, 175, 0.12)', Icon: PlayCircle },
  Suspensa: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', Icon: PauseCircle },
  Concluída: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.14)', Icon: CheckCircle },
  Cancelada: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', Icon: XCircle },
};

const filtros: Array<'Todas' | StatusIniciativa> = ['Todas', 'Submetida', 'Aprovada', 'Em contratação', 'Em execução', 'Suspensa', 'Concluída', 'Cancelada'];

export const Iniciativas: React.FC = () => {
  const [iniciativaSelecionada, setIniciativaSelecionada] = useState<Iniciativa | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<'Todas' | StatusIniciativa>('Todas');
  const [busca, setBusca] = useState('');

  const iniciativasFiltradas = useMemo(() => {
    const normalizedBusca = busca.trim().toLowerCase();

    return iniciativas.filter((iniciativa) => {
      const matchStatus = statusFiltro === 'Todas' || iniciativa.status === statusFiltro;
      const matchBusca =
        !normalizedBusca ||
        iniciativa.codigo.toLowerCase().includes(normalizedBusca) ||
        iniciativa.titulo.toLowerCase().includes(normalizedBusca) ||
        iniciativa.proponente.toLowerCase().includes(normalizedBusca) ||
        iniciativa.coordenador.toLowerCase().includes(normalizedBusca);

      return matchStatus && matchBusca;
    });
  }, [busca, statusFiltro]);

  const totalPorStatus = (status: StatusIniciativa) => iniciativas.filter((iniciativa) => iniciativa.status === status).length;

  return (
    <div className="pt-8 px-8 pb-10">
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: '36px', height: '36px', backgroundColor: 'rgba(0, 193, 175, 0.12)', borderRadius: 'var(--radius)' }}
          >
            <FolderKanban size={20} style={{ color: '#00c1af' }} />
          </div>
          <div className="flex-1" style={{ marginTop: '4px' }}>
            <h1 className="mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: 'var(--dash-text-primary)', lineHeight: '1.5' }}>
              Iniciativas
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
              Consulte as iniciativas submetidas, aprovadas, contratadas e em execução.
            </p>
          </div>
        </div>
        <div className="mt-6" style={{ width: '100%', height: '1px', backgroundColor: 'var(--dash-divider)' }} />
      </div>

      {iniciativaSelecionada ? (
        <section>
          <nav className="mb-5" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
            <button
              type="button"
              onClick={() => setIniciativaSelecionada(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--dash-text-secondary)',
                cursor: 'pointer',
              }}
            >
              Iniciativas
            </button>
            <span style={{ color: 'var(--dash-text-muted)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--dash-text-primary)' }}>{iniciativaSelecionada.codigo}</span>
          </nav>

          <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_180px_180px_170px] gap-5">
              <div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', color: 'var(--dash-text-primary)', margin: '0 0 8px' }}>
                  {iniciativaSelecionada.codigo} · {iniciativaSelecionada.titulo}
                </h2>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
                  {iniciativaSelecionada.proponente} · Coordenador: {iniciativaSelecionada.coordenador}
                </p>
              </div>
              <Info label="Edital" value={iniciativaSelecionada.edital} />
              <Info label="Status" value={iniciativaSelecionada.status} />
              <Info label="Valor aprovado" value={iniciativaSelecionada.valorAprovado} />
            </div>
          </div>

          <SolicitacoesDiarias embedded iniciativaFiltro={iniciativaSelecionada.titulo} />
        </section>
      ) : (
        <>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Submetidas', value: totalPorStatus('Submetida'), status: 'Submetida' as StatusIniciativa },
          { label: 'Aprovadas', value: totalPorStatus('Aprovada'), status: 'Aprovada' as StatusIniciativa },
          { label: 'Em contratação', value: totalPorStatus('Em contratação'), status: 'Em contratação' as StatusIniciativa },
          { label: 'Em execução', value: totalPorStatus('Em execução'), status: 'Em execução' as StatusIniciativa },
          { label: 'Suspensas', value: totalPorStatus('Suspensa'), status: 'Suspensa' as StatusIniciativa },
          { label: 'Finalizadas', value: totalPorStatus('Concluída'), status: 'Concluída' as StatusIniciativa },
          { label: 'Canceladas', value: totalPorStatus('Cancelada'), status: 'Cancelada' as StatusIniciativa },
        ].map(({ label, value, status }) => {
          const { color, bg, Icon } = statusStyle[status];

          return (
            <button
              key={label}
              type="button"
              onClick={() => setStatusFiltro(status)}
              className="rounded-lg p-4 text-left"
              style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)', cursor: 'pointer' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', backgroundColor: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>{label}</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: 'var(--dash-text-primary)' }}>{value}</strong>
            </button>
          );
        })}
      </section>

      <section className="rounded-lg p-5 mb-5" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dash-text-muted)' }} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por código, título, proponente ou coordenador"
              className="w-full rounded-lg"
              style={{
                padding: '10px 12px 10px 40px',
                backgroundColor: 'var(--dash-input-bg)',
                border: '1px solid var(--dash-card-border)',
                color: 'var(--dash-text-primary)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                type="button"
                onClick={() => setStatusFiltro(filtro)}
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: statusFiltro === filtro ? 'rgba(0, 193, 175, 0.16)' : 'transparent',
                  border: statusFiltro === filtro ? '1px solid rgba(0, 193, 175, 0.45)' : '1px solid var(--dash-card-border)',
                  color: statusFiltro === filtro ? '#00c1af' : 'var(--dash-text-secondary)',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                }}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {iniciativasFiltradas.map((iniciativa) => {
          const { color, bg, Icon } = statusStyle[iniciativa.status];

          return (
            <article
              key={iniciativa.codigo}
              className="rounded-lg p-5"
              role="button"
              tabIndex={0}
              onClick={() => setIniciativaSelecionada(iniciativa)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setIniciativaSelecionada(iniciativa);
                }
              }}
              style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)', cursor: 'pointer' }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_180px_170px] gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', color: 'var(--dash-text-primary)' }}>
                      {iniciativa.codigo} · {iniciativa.titulo}
                    </strong>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
                      <Icon size={13} />
                      {iniciativa.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
                    {iniciativa.proponente} · Coordenador: {iniciativa.coordenador}
                  </p>
                </div>

                <div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Submissão</p>
                  <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{iniciativa.dataSubmissao}</strong>
                </div>

                <div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Valor aprovado</p>
                  <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{iniciativa.valorAprovado}</strong>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--dash-divider)' }}>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-secondary)' }}>
                  {iniciativa.edital}
                </span>
              </div>
            </article>
          );
        })}
      </section>
        </>
      )}
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>{label}</p>
    <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{value}</strong>
  </div>
);
