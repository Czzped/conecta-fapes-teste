import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  PlaneTakeoff,
  ReceiptText,
  Search,
} from 'lucide-react';

type StatusSolicitacaoDiaria = 'ALOCADA' | 'APROVADA' | 'CANCELADA' | 'RECUSADA';
type EstadoAceiteDiaria = 'PENDENTE' | 'ASSINADO' | 'RECUSADO' | 'CANCELADO';

interface SolicitacaoDiaria {
  id: string;
  iniciativa: string;
  coordenador: string;
  alocacaoBolsistaRef: string;
  bolsistaNome: string;
  destino: string;
  partida: string;
  chegada: string;
  motivo: string;
  status: StatusSolicitacaoDiaria;
  estadoAceite: EstadoAceiteDiaria;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipoDiariaRef: string;
  parametroCalculoDiariaRef: string;
  transacaoComprometimentoRef?: string;
  transacaoReversaoRef?: string;
  justificativaCancelamento?: string;
  justificativaRecusa?: string;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const statusConfig = {
  ALOCADA: { label: 'Alocada', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)' },
  APROVADA: { label: 'Aprovada', color: '#00c1af', bg: 'rgba(0, 193, 175, 0.12)' },
  CANCELADA: { label: 'Cancelada', color: '#64748b', bg: 'rgba(100, 116, 139, 0.14)' },
  RECUSADA: { label: 'Recusada pelo bolsista', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
};

type StatusFilter = 'TODOS' | StatusSolicitacaoDiaria;

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: 'TODOS', label: 'Todos os status' },
  { value: 'ALOCADA', label: statusConfig.ALOCADA.label },
  { value: 'APROVADA', label: statusConfig.APROVADA.label },
  { value: 'CANCELADA', label: statusConfig.CANCELADA.label },
  { value: 'RECUSADA', label: statusConfig.RECUSADA.label },
];

interface SolicitacoesDiariasProps {
  embedded?: boolean;
  iniciativaFiltro?: string;
}

export const SolicitacoesDiarias: React.FC<SolicitacoesDiariasProps> = ({ embedded = false, iniciativaFiltro }) => {
  const [solicitacoes] = useState<SolicitacaoDiaria[]>([
    {
      id: 'SD-2026-002',
      iniciativa: 'Conecta Fapes',
      coordenador: 'Marina Costa',
      alocacaoBolsistaRef: 'ALO-2026-003',
      bolsistaNome: 'Carla Nunes',
      destino: 'Linhares/ES',
      partida: '2026-06-18T07:00',
      chegada: '2026-06-19T19:00',
      motivo: 'Coleta de evidências de execução da atividade de campo.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-047',
    },
    {
      id: 'SD-2026-005',
      iniciativa: 'Conecta Fapes',
      coordenador: 'Marina Costa',
      alocacaoBolsistaRef: 'ALO-2026-004',
      bolsistaNome: 'Diego Rocha',
      destino: 'Linhares/ES',
      partida: '2026-06-18T07:00',
      chegada: '2026-06-19T19:00',
      motivo: 'Coleta de evidências de execução da atividade de campo.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-052',
    },
    {
      id: 'SD-2026-003',
      iniciativa: 'Bioinsumos para agricultura de precisão',
      coordenador: 'André Carvalho',
      alocacaoBolsistaRef: 'ALO-2026-005',
      bolsistaNome: 'Fernanda Alves',
      destino: 'Colatina/ES',
      partida: '2026-06-24T06:30',
      chegada: '2026-06-25T18:30',
      motivo: 'Visita técnica para levantamento de dados junto aos parceiros locais.',
      status: 'ALOCADA',
      estadoAceite: 'PENDENTE',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-048',
    },
    {
      id: 'SD-2026-001',
      iniciativa: 'Conecta Fapes',
      coordenador: 'Marina Costa',
      alocacaoBolsistaRef: 'ALO-2026-001',
      bolsistaNome: 'Ana Souza',
      destino: 'Vitória/ES',
      partida: '2026-06-10T08:00',
      chegada: '2026-06-12T18:00',
      motivo: 'Participação em reunião técnica do projeto.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 2.5,
      valorUnitario: 260,
      valorTotal: 650,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-045',
    },
    {
      id: 'SD-2026-006',
      iniciativa: 'Conecta Fapes',
      coordenador: 'Marina Costa',
      alocacaoBolsistaRef: 'ALO-2026-002',
      bolsistaNome: 'Bruno Lima',
      destino: 'Vitória/ES',
      partida: '2026-06-10T08:00',
      chegada: '2026-06-12T18:00',
      motivo: 'Participação em reunião técnica do projeto.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 2.5,
      valorUnitario: 260,
      valorTotal: 650,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-053',
    },
    {
      id: 'SD-2026-000',
      iniciativa: 'Conecta Fapes',
      coordenador: 'Marina Costa',
      alocacaoBolsistaRef: 'ALO-2026-001',
      bolsistaNome: 'Ana Souza',
      destino: 'Serra/ES',
      partida: '2026-05-20T09:00',
      chegada: '2026-05-20T18:00',
      motivo: 'Agenda técnica cancelada pelo parceiro.',
      status: 'CANCELADA',
      estadoAceite: 'CANCELADO',
      quantidade: 0.5,
      valorUnitario: 260,
      valorTotal: 130,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-031',
      transacaoReversaoRef: 'TR-2026-036',
      justificativaCancelamento: 'Agenda cancelada antes do início da viagem.',
    },
    {
      id: 'SD-2026-004',
      iniciativa: 'Rede de sensores para cidades resilientes',
      coordenador: 'Ricardo Torres',
      alocacaoBolsistaRef: 'ALO-2026-009',
      bolsistaNome: 'Juliana Martins',
      destino: 'Cachoeiro de Itapemirim/ES',
      partida: '2026-05-28T08:00',
      chegada: '2026-05-29T17:00',
      motivo: 'Oficina presencial de validação com equipe municipal.',
      status: 'RECUSADA',
      estadoAceite: 'RECUSADO',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      transacaoComprometimentoRef: 'TR-2026-049',
      transacaoReversaoRef: 'TR-2026-050',
      justificativaRecusa: 'Beneficiária recusou a viagem por conflito de agenda acadêmica.',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [pageSize, setPageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const solicitacoesEscopo = useMemo(
    () => iniciativaFiltro ? solicitacoes.filter((solicitacao) => solicitacao.iniciativa === iniciativaFiltro) : solicitacoes,
    [iniciativaFiltro, solicitacoes],
  );
  const pendentes = useMemo(
    () => solicitacoesEscopo.filter((solicitacao) => solicitacao.status === 'ALOCADA').length,
    [solicitacoesEscopo],
  );

  const filteredSolicitacoes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const startDate = dataInicio ? new Date(`${dataInicio}T00:00:00`) : null;
    const endDate = dataFim ? new Date(`${dataFim}T23:59:59`) : null;

    return solicitacoesEscopo.filter((solicitacao) => {
      const searchable = [
        solicitacao.id,
        solicitacao.iniciativa,
        solicitacao.coordenador,
        solicitacao.destino,
        solicitacao.motivo,
        solicitacao.tipoDiariaRef,
        solicitacao.parametroCalculoDiariaRef,
        solicitacao.alocacaoBolsistaRef,
        solicitacao.bolsistaNome,
      ].join(' ').toLowerCase();
      const departureDate = new Date(solicitacao.partida);

      const matchesSearch = normalizedSearch.length === 0 || searchable.includes(normalizedSearch);
      const matchesStatus = statusFilter === 'TODOS' || solicitacao.status === statusFilter;
      const matchesStart = !startDate || departureDate >= startDate;
      const matchesEnd = !endDate || departureDate <= endDate;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [dataFim, dataInicio, searchTerm, solicitacoesEscopo, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSolicitacoes.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSolicitacoes = filteredSolicitacoes.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetPage = () => setCurrentPage(1);

  const limparFiltros = () => {
    setSearchTerm('');
    setStatusFilter('TODOS');
    setDataInicio('');
    setDataFim('');
    setCurrentPage(1);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '42px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--dash-input-bg)',
    border: '1px solid var(--dash-card-border)',
    color: 'var(--dash-text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
  };

  return (
    <div className={embedded ? '' : 'pt-8 px-8 pb-10'}>
      {!embedded && (
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(0, 193, 175, 0.12)',
              borderRadius: 'var(--radius)',
            }}
          >
            <PlaneTakeoff size={20} style={{ color: '#00c1af' }} />
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
              Diárias
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>
              Consulta operacional de diárias solicitadas pelo coordenador, com rubrica separada das transações.
            </p>
          </div>
        </div>
        <div className="mt-6" style={{ width: '100%', height: '1px', backgroundColor: 'var(--dash-divider)' }} />
      </div>
      )}

      <section className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Alocadas', value: pendentes, Icon: Clock, color: '#38bdf8' },
          ].map(({ label, value, Icon, color }) => (
            <div
              key={label}
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'var(--dash-card-bg)',
                border: '1px solid var(--dash-card-border)',
                boxShadow: 'var(--dash-shadow)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', backgroundColor: `${color}22` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>{label}</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: 'var(--dash-text-primary)' }}>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-lg p-5 mb-6"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-card-border)',
          boxShadow: 'var(--dash-shadow)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(56, 189, 248, 0.12)' }}>
              <Filter size={20} style={{ color: '#38bdf8' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', margin: '0 0 5px' }}>
                Filtros
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
                Refine por solicitação, projeto, bolsista, status ou período de partida.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={limparFiltros}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--dash-text-secondary)',
              border: '1px solid var(--dash-card-border)',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
            }}
          >
            Limpar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <label className="lg:col-span-2" style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>
            Buscar
            <div style={{ position: 'relative', marginTop: '8px' }}>
              <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--dash-text-muted)' }} />
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  resetPage();
                }}
                placeholder="Buscar"
                style={{ ...inputStyle, padding: '0 38px 0 12px' }}
              />
            </div>
          </label>

          <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>
            Status
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                resetPage();
              }}
              style={{ ...inputStyle, marginTop: '8px', padding: '0 12px' }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>
            Partida de
            <input
              type="date"
              value={dataInicio}
              onChange={(event) => {
                setDataInicio(event.target.value);
                resetPage();
              }}
              style={{ ...inputStyle, marginTop: '8px', padding: '0 12px' }}
            />
          </label>

          <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>
            Partida até
            <input
              type="date"
              value={dataFim}
              onChange={(event) => {
                setDataFim(event.target.value);
                resetPage();
              }}
              style={{ ...inputStyle, marginTop: '8px', padding: '0 12px' }}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        {paginatedSolicitacoes.map((solicitacao) => {
          const config = statusConfig[solicitacao.status];

          return (
            <article
              key={solicitacao.id}
              className="rounded-lg p-5"
              style={{
                backgroundColor: 'var(--dash-card-bg)',
                border: '1px solid var(--dash-card-border)',
                boxShadow: 'var(--dash-shadow)',
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <ReceiptText size={18} style={{ color: '#00c1af' }} />
                    <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', color: 'var(--dash-text-primary)', margin: 0 }}>
                      {solicitacao.id} · {solicitacao.iniciativa}
                    </h2>
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
                    {solicitacao.coordenador} · {solicitacao.destino} · {solicitacao.bolsistaNome}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: config.bg,
                    color: config.color,
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-xs)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {config.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
                {[
                  { label: 'Período', value: `${new Date(solicitacao.partida).toLocaleString('pt-BR')} até ${new Date(solicitacao.chegada).toLocaleString('pt-BR')}` },
                  { label: 'Diárias', value: solicitacao.quantidade.toLocaleString('pt-BR') },
                  { label: 'Valor unitário', value: currency.format(solicitacao.valorUnitario) },
                  { label: 'Cadastro/Parâmetro', value: `${solicitacao.tipoDiariaRef} · ${solicitacao.parametroCalculoDiariaRef}` },
                  { label: 'Total', value: currency.format(solicitacao.valorTotal) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>{label}</p>
                    <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{value}</strong>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: '0 0 16px' }}>
                {solicitacao.motivo}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {solicitacao.transacaoComprometimentoRef && (
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-secondary)' }}>
                    Comprometimento: {solicitacao.transacaoComprometimentoRef}
                  </span>
                )}
                {solicitacao.transacaoReversaoRef && (
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#3b82f6' }}>
                    Reversão: {solicitacao.transacaoReversaoRef}
                  </span>
                )}
                {solicitacao.justificativaCancelamento && (
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>
                    Justificativa da remoção: {solicitacao.justificativaCancelamento}
                  </span>
                )}
                {solicitacao.justificativaRecusa && (
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>
                    Justificativa da recusa: {solicitacao.justificativaRecusa}
                  </span>
                )}
              </div>
            </article>
          );
        })}

        {paginatedSolicitacoes.length === 0 && (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--dash-card-bg)',
              border: '1px solid var(--dash-card-border)',
              boxShadow: 'var(--dash-shadow)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
              Nenhuma diária encontrada para os filtros aplicados.
            </p>
          </div>
        )}
      </section>

      <section
        className="mt-5 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-card-border)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>
          Exibindo {filteredSolicitacoes.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filteredSolicitacoes.length)} de {filteredSolicitacoes.length} diária(s)
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>
            Por página
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              style={{ ...inputStyle, width: '86px', padding: '0 10px' }}
            >
              {[2, 5, 10].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-lg"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--dash-card-border)',
                backgroundColor: currentPage === 1 ? 'var(--dash-input-bg)' : 'transparent',
                color: currentPage === 1 ? 'var(--dash-text-muted)' : 'var(--dash-text-primary)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ minWidth: '90px', textAlign: 'center', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="rounded-lg"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--dash-card-border)',
                backgroundColor: currentPage === totalPages ? 'var(--dash-input-bg)' : 'transparent',
                color: currentPage === totalPages ? 'var(--dash-text-muted)' : 'var(--dash-text-primary)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
