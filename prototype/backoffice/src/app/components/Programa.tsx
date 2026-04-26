import React, { useState } from 'react';
import { Search, ChevronRight, FolderOpen, ChevronDown, Plus, Handshake, DollarSign } from 'lucide-react';
import { FormularioPrograma } from './FormularioPrograma';
import { DetalhesPrograma } from './DetalhesPrograma';

type StatusFilter = 'Todos' | 'Em planejamento' | 'Ativo' | 'Suspenso' | 'Encerrado';
type ProgramaStatus = 'Em planejamento' | 'Ativo' | 'Suspenso' | 'Encerrado';
type ActiveTab = 'listagem' | 'dashboard';

interface ProgramaItem {
  id: number;
  nome: string;
  eixo: string;
  instituicaoDemandante: string;
  dataVigencia: string;
  status: ProgramaStatus;
  valorInvestido: number;
  valorAlocado: number;
  valorAportado: number;
  valorConsumido: number;
  iniciativas: number;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'Ativo': return '#22c55e';
    case 'Em planejamento': return '#fbbf24';
    case 'Suspenso': return '#f97316';
    case 'Encerrado': return '#94a3b8';
    default:         return '#94a3b8';
  }
};

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
);

const cardStyle = (): React.CSSProperties => ({
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '20px',
});

interface Props {
  onBack: () => void;
}

export const Programa: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('listagem');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [eixoFilter, setEixoFilter] = useState('Todos');
  const [showEixoDropdown, setShowEixoDropdown] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState<ProgramaItem | null>(null);

  const statusOptions: StatusFilter[] = ['Todos', 'Em planejamento', 'Ativo', 'Suspenso', 'Encerrado'];

  const programasData: ProgramaItem[] = [
    { id: 1, nome: 'Programa de Bolsas de Pesquisa 2026', eixo: 'Ciência e Tecnologia', instituicaoDemandante: 'Ufes', dataVigencia: '01/01/2026 - 31/12/2026', status: 'Ativo', valorInvestido: 4200000, valorAlocado: 3600000, valorAportado: 2980000, valorConsumido: 1840000, iniciativas: 24 },
    { id: 2, nome: 'Programa de Inovação Tecnológica', eixo: 'Inovação e Desenvolvimento', instituicaoDemandante: 'Findes', dataVigencia: '15/02/2026 - 14/02/2027', status: 'Ativo', valorInvestido: 3200000, valorAlocado: 2700000, valorAportado: 2180000, valorConsumido: 1490000, iniciativas: 18 },
    { id: 3, nome: 'Programa de Extensão Universitária', eixo: 'Formação de Recursos Humanos', instituicaoDemandante: 'Ifes', dataVigencia: '01/03/2026 - 28/02/2027', status: 'Em planejamento', valorInvestido: 1800000, valorAlocado: 920000, valorAportado: 430000, valorConsumido: 120000, iniciativas: 9 },
    { id: 4, nome: 'Programa de Infraestrutura Laboratorial', eixo: 'Infraestrutura de Pesquisa', instituicaoDemandante: 'Ufes', dataVigencia: '01/04/2026 - 31/03/2027', status: 'Em planejamento', valorInvestido: 2600000, valorAlocado: 1600000, valorAportado: 980000, valorConsumido: 360000, iniciativas: 11 },
    { id: 5, nome: 'Programa de Carreira Científica 2025', eixo: 'Formação de Recursos Humanos', instituicaoDemandante: 'Fapes', dataVigencia: '01/01/2025 - 31/12/2025', status: 'Encerrado', valorInvestido: 1450000, valorAlocado: 1450000, valorAportado: 1320000, valorConsumido: 1280000, iniciativas: 17 },
    { id: 6, nome: 'Programa de Difusão do Conhecimento', eixo: 'Ciência e Tecnologia', instituicaoDemandante: 'Secti', dataVigencia: '01/06/2025 - 31/05/2026', status: 'Suspenso', valorInvestido: 980000, valorAlocado: 760000, valorAportado: 540000, valorConsumido: 410000, iniciativas: 8 },
  ];

  const filtered = programasData.filter(p => {
    const matchSearch = `${p.nome} ${p.instituicaoDemandante}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const matchEixo = eixoFilter === 'Todos' || p.eixo === eixoFilter;
    const matchData = !dataFilter || p.dataVigencia.includes(dataFilter);
    return matchSearch && matchStatus && matchEixo && matchData;
  });

  if (showFormulario) {
    return <FormularioPrograma onBack={() => setShowFormulario(false)} />;
  }

  if (selectedPrograma) {
    return <DetalhesPrograma onBack={() => setSelectedPrograma(null)} programaNome={selectedPrograma.nome} />;
  }

  const totalInvestido = programasData.reduce((total, programa) => total + programa.valorInvestido, 0);
  const totalAlocado = programasData.reduce((total, programa) => total + programa.valorAlocado, 0);
  const totalAportado = programasData.reduce((total, programa) => total + programa.valorAportado, 0);
  const totalConsumido = programasData.reduce((total, programa) => total + programa.valorConsumido, 0);
  const saldoDisponivel = Math.max(totalInvestido - totalAlocado, 0);
  const percentualAportado = totalAlocado > 0 ? (totalAportado / totalAlocado) * 100 : 0;
  const percentualAlocado = totalInvestido > 0 ? (totalAlocado / totalInvestido) * 100 : 0;
  const percentualConsumido = totalAportado > 0 ? (totalConsumido / totalAportado) * 100 : 0;
  const percentualDisponivel = totalInvestido > 0 ? (saldoDisponivel / totalInvestido) * 100 : 0;
  const programasPortfolio = programasData.map(programa => ({
    ...programa,
    saldo: Math.max(programa.valorInvestido - programa.valorAlocado, 0),
    percentualAlocado: programa.valorInvestido > 0 ? (programa.valorAlocado / programa.valorInvestido) * 100 : 0,
    percentualAportado: programa.valorAlocado > 0 ? (programa.valorAportado / programa.valorAlocado) * 100 : 0,
    percentualConsumido: programa.valorAportado > 0 ? (programa.valorConsumido / programa.valorAportado) * 100 : 0,
    percentualDisponivel: programa.valorInvestido > 0 ? (Math.max(programa.valorInvestido - programa.valorAlocado, 0) / programa.valorInvestido) * 100 : 0,
  }));
  const rubricasPortfolio = [
    { nome: 'Bolsas', peso: 0.42, fatorAportado: 0.86, fatorConsumido: 0.62 },
    { nome: 'Capital', peso: 0.34, fatorAportado: 0.72, fatorConsumido: 0.48 },
    { nome: 'Custeio', peso: 0.24, fatorAportado: 0.78, fatorConsumido: 0.56 },
  ].map(rubrica => {
    const alocado = totalAlocado * rubrica.peso;
    const aportado = alocado * rubrica.fatorAportado;
    const consumido = aportado * rubrica.fatorConsumido;
    return {
      nome: rubrica.nome,
      alocado,
      aportado,
      consumido,
      saldo: Math.max(alocado - aportado, 0),
      percentualAlocado: totalAlocado > 0 ? (alocado / totalAlocado) * 100 : 0,
      percentualAportado: alocado > 0 ? (aportado / alocado) * 100 : 0,
      percentualConsumido: aportado > 0 ? (consumido / aportado) * 100 : 0,
      percentualDisponivel: alocado > 0 ? (Math.max(alocado - aportado, 0) / alocado) * 100 : 0,
    };
  });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">

        {/* Header */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
                <FolderOpen size={18} style={{ color: '#00c1af' }} />
              </div>
              <div style={{ flex: 1, marginTop: '6px' }}>
                <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', lineHeight: '1.5' }}>
                  Programa
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.5' }}>
                  Crie e gerencie um conjunto organizado de iniciativas e editais voltados a um objetivo estratégico de fomento.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFormulario(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#00c1af', border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 18px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: '#0f172a',
                cursor: 'pointer', flexShrink: 0, transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a99a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
            >
              <Plus size={16} />
              Novo Programa
            </button>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />

        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '28px' }}>
          {[
            { id: 'listagem' as ActiveTab, label: 'Programas' },
            { id: 'dashboard' as ActiveTab, label: 'Dashboard' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #00c1af' : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === tab.id ? '#00c1af' : 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: '-1px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Investido', value: formatCurrency(totalInvestido), Icon: DollarSign, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
                { label: 'Total Aportado', value: formatCurrency(totalAportado), detail: `${formatPercent(percentualAportado)} do alocado`, Icon: Handshake, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
                { label: 'Total Alocado', value: formatCurrency(totalAlocado), detail: `${formatPercent(percentualAlocado)} do investido`, Icon: FolderOpen, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                { label: 'Total Consumido', value: formatCurrency(totalConsumido), detail: `${formatPercent(percentualConsumido)} do aportado`, Icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
                { label: 'Saldo disponível', value: formatCurrency(saldoDisponivel), detail: `${formatPercent(percentualDisponivel)} do investido`, Icon: DollarSign, color: '#00c1af', bg: 'rgba(0,193,175,0.12)' },
              ].map(({ label, value, detail, Icon, color, bg }) => (
                <div key={label} style={cardStyle()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: bg, borderRadius: 'var(--radius)', flexShrink: 0 }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      {label}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: '#ffffff', textAlign: 'center', margin: 0 }}>
                    {value}
                  </p>
                  {detail && (
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: '6px 0 0' }}>
                      {detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div style={cardStyle()}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                    Consumo por programa
                  </h2>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                    Quanto cada programa recebeu de aporte, alocou, consumiu e ainda possui disponível.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {programasPortfolio.map(programa => (
                  <div key={programa.id} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(15,23,42,0.35)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                      <ListCell label="Programa" value={programa.nome} strong />
                      <ListCell label="Aportado" value={formatCurrency(programa.valorAportado)} highlight detail={`${formatPercent(programa.percentualAportado)} do alocado`} />
                      <ListCell label="Alocado" value={formatCurrency(programa.valorAlocado)} detail={`${formatPercent(programa.percentualAlocado)} do investido`} />
                      <ListCell label="Consumido" value={formatCurrency(programa.valorConsumido)} detail={`${formatPercent(programa.percentualConsumido)} do aportado`} />
                      <ListCell label="Disponível" value={formatCurrency(programa.saldo)} detail={`${formatPercent(programa.percentualDisponivel)} do investido`} />
                    </div>
                    <div style={{ height: '8px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(programa.percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: programa.percentualConsumido < 50 ? '#f59e0b' : '#22c55e' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...cardStyle(), marginTop: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                Consumo por rubrica
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: '0 0 20px' }}>
                Somatória por rubrica em todos os programas cadastrados.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rubricasPortfolio.map(rubrica => (
                  <div key={rubrica.nome} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(15,23,42,0.35)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                      <ListCell label="Rubrica" value={rubrica.nome} strong />
                      <ListCell label="Aportado" value={formatCurrency(rubrica.aportado)} highlight detail={`${formatPercent(rubrica.percentualAportado)} do alocado`} />
                      <ListCell label="Alocado" value={formatCurrency(rubrica.alocado)} detail={`${formatPercent(rubrica.percentualAlocado)} do total`} />
                      <ListCell label="Consumido" value={formatCurrency(rubrica.consumido)} detail={`${formatPercent(rubrica.percentualConsumido)} da rubrica`} />
                      <ListCell label="Disponível" value={formatCurrency(rubrica.saldo)} detail={`${formatPercent(rubrica.percentualDisponivel)} da rubrica`} />
                    </div>
                    <div style={{ height: '8px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(rubrica.percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: rubrica.percentualConsumido < 50 ? '#f59e0b' : '#22c55e' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listagem' && (
        <>
        {/* Filtros */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>

          {/* Pesquisar */}
          <div>
            <label style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>
              Pesquisar
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar programa..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', backgroundColor: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                  padding: '10px 12px 10px 36px', color: '#ffffff',
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            </div>
          </div>

          {/* Eixo Estratégico */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>
              Eixo Estratégico
            </label>
            <button
              onClick={() => { setShowEixoDropdown(!showEixoDropdown); setShowStatusDropdown(false); }}
              style={{
                width: '100%', backgroundColor: 'rgba(30,41,59,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                padding: '10px 12px', color: eixoFilter === 'Todos' ? 'rgba(255,255,255,0.4)' : '#ffffff',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {eixoFilter === 'Todos' ? 'Selecionar eixo...' : eixoFilter}
              </span>
              <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0, transform: showEixoDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {showEixoDropdown && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
                backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', overflow: 'hidden', zIndex: 100,
              }}>
                {['Todos', 'Ciência e Tecnologia', 'Formação de Recursos Humanos', 'Infraestrutura de Pesquisa', 'Inovação e Desenvolvimento'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setEixoFilter(opt); setShowEixoDropdown(false); }}
                    style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left',
                      backgroundColor: eixoFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                      color: eixoFilter === opt ? '#00c1af' : '#ffffff',
                      fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                      border: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (eixoFilter !== opt) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (eixoFilter !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {opt === 'Todos' ? 'Todos' : opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data */}
          <div>
            <label style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>
              Vigência
            </label>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              value={dataFilter}
              onChange={e => setDataFilter(e.target.value)}
              style={{
                width: '100%', backgroundColor: 'rgba(30,41,59,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                padding: '10px 12px', color: '#ffffff',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>
              Estado
            </label>
            <button
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowEixoDropdown(false); }}
              style={{
                width: '100%', backgroundColor: 'rgba(30,41,59,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                padding: '10px 12px', color: '#ffffff',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
              }}
            >
              <span>{statusFilter}</span>
              <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.5)', transform: showStatusDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {showStatusDropdown && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
                backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', overflow: 'hidden', zIndex: 100,
              }}>
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setShowStatusDropdown(false); }}
                    style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left',
                      backgroundColor: statusFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                      color: statusFilter === opt ? '#00c1af' : '#ffffff',
                      fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                      border: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (statusFilter !== opt) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (statusFilter !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista de Programas */}
        {/* Header da lista — removido; títulos agora ficam dentro de cada card */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 20px',
              border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.3)',
            }}>
              Nenhum programa encontrado.
            </div>
          ) : filtered.map(prog => (
            <div
              key={prog.id}
              style={{
                backgroundColor: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '18px 20px',
                cursor: 'pointer', transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.85)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.6)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
              onClick={() => setSelectedPrograma(prog)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.5fr 1fr', gap: '24px', alignItems: 'start' }}>

                  {/* Programa */}
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                      Programa
                    </span>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                      {prog.nome}
                    </span>
                  </div>

                  {/* Eixo Estratégico */}
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                      Eixo / Instituição
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.78)', marginBottom: '4px' }}>
                      {prog.eixo}
                    </span>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.46)' }}>
                      {prog.instituicaoDemandante}
                    </span>
                  </div>

                  {/* Data de Vigência */}
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                      Data de Vigência
                    </span>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                      {prog.dataVigencia}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                      Estado
                    </span>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: `${statusColor(prog.status)}20`,
                      border: `1px solid ${statusColor(prog.status)}`,
                      borderRadius: '999px', padding: '3px 12px',
                      fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: statusColor(prog.status),
                    }}>
                      {prog.status}
                    </div>
                  </div>

                </div>
                <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
        </>
        )}

      </div>
    </div>
  );
};

const ListCell: React.FC<{ label: string; value: string; detail?: string; strong?: boolean; highlight?: boolean }> = ({ label, value, detail, strong, highlight }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
      {label}
    </div>
    <div style={{
      fontFamily: 'var(--font-family)',
      fontSize: 'var(--text-sm)',
      color: highlight ? '#22c55e' : strong ? '#ffffff' : 'rgba(255,255,255,0.75)',
      fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
      lineHeight: 1.4,
    }}>
      {value}
    </div>
    {detail && (
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
        {detail}
      </div>
    )}
  </div>
);
