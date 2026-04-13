import React, { useState } from 'react';
import { Search, ChevronRight, Home, Handshake, ChevronDown, Plus, FolderOpen, Briefcase, Building, Users, FileText, DollarSign, ArrowLeft } from 'lucide-react';
import { FormularioParceria } from './FormularioParceria';
import { DetalhesParceria } from './DetalhesParceria';

type StatusFilter = 'Todos' | 'Ativo' | 'Finalizado';
type ParceriaStatus = 'Ativo' | 'Finalizado';
type AreaFilter = 'Todas' | 'Carreira Científica' | 'Pesquisa' | 'Difusão do Conhecimento' | 'Extensão' | 'Inovação' | 'Internacional';

interface ParceriaItem {
  id: number;
  nome: string;
  instituicaoParceira: string;
  dataEnvio: string;
  aditivo: 'Sim' | 'Não';
  area: string;
  status: ParceriaStatus;
  investimento: string;
  dataAssinatura: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  numeroProcesso: string;
  objetivo: string;
  coordenadorNome: string;
  coordenadorEmail: string;
  coordenadorCelular: string;
  pontoFocalFapes: string;
  gerenciaResponsavel: string;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'Ativo':      return '#22c55e';
    case 'Finalizado': return '#94a3b8';
    default:           return '#94a3b8';
  }
};

interface Props {
  onBack: () => void;
}

export const Parceria: React.FC<Props> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('Todas');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [instituicaoFilter, setInstituicaoFilter] = useState('Todos');
  const [showInstituicaoDropdown, setShowInstituicaoDropdown] = useState(false);
  const [showNovaParceria, setShowNovaParceria] = useState(false);
  const [selectedParceria, setSelectedParceria] = useState<ParceriaItem | null>(null);

  const statusOptions: StatusFilter[] = ['Todos', 'Ativo', 'Finalizado'];
  const areaOptions: AreaFilter[] = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional'];
  const instituicaoOptions = ['Todos', 'Ufes', 'Ifes', 'UFMG', 'USP'];

  const parceriasData: ParceriaItem[] = [
    { 
      id: 1, 
      nome: 'Cooperação Ufes-CNPq', 
      instituicaoParceira: 'CNPq', 
      dataEnvio: '15/01/2026', 
      aditivo: 'Não', 
      area: 'Pesquisa', 
      status: 'Ativo',
      investimento: 'R$ 2.500.000,00',
      dataAssinatura: '10/01/2026',
      vigenciaInicio: '01/02/2026',
      vigenciaFim: '31/01/2029',
      numeroProcesso: '123456',
      objetivo: 'Desenvolvimento de projetos de pesquisa científica nas áreas de ciências exatas e da terra.',
      coordenadorNome: 'Dr. Carlos Silva',
      coordenadorEmail: 'carlos.silva@cnpq.br',
      coordenadorCelular: '(11) 98765-4321',
      pontoFocalFapes: 'Dr. João Pereira',
      gerenciaResponsavel: 'Dr. Maria Oliveira'
    },
    { 
      id: 2, 
      nome: 'Parceria Ifes-Fapesp', 
      instituicaoParceira: 'Fapesp', 
      dataEnvio: '10/02/2026', 
      aditivo: 'Sim', 
      area: 'Inovação', 
      status: 'Ativo',
      investimento: 'R$ 3.800.000,00',
      dataAssinatura: '05/02/2026',
      vigenciaInicio: '01/03/2026',
      vigenciaFim: '28/02/2030',
      numeroProcesso: '789012',
      objetivo: 'Cooperação técnica para projetos de inovação tecnológica e desenvolvimento regional.',
      coordenadorNome: 'Dra. Maria Santos',
      coordenadorEmail: 'maria.santos@fapesp.br',
      coordenadorCelular: '(11) 98765-4321',
      pontoFocalFapes: 'Dr. João Pereira',
      gerenciaResponsavel: 'Dr. Maria Oliveira'
    },
    { 
      id: 3, 
      nome: 'Termo Ufes-UFMG', 
      instituicaoParceira: 'UFMG', 
      dataEnvio: '05/03/2026', 
      aditivo: 'Não', 
      area: 'Extensão', 
      status: 'Ativo',
      investimento: 'R$ 1.200.000,00',
      dataAssinatura: '01/03/2026',
      vigenciaInicio: '01/04/2026',
      vigenciaFim: '31/03/2028',
      numeroProcesso: '345678',
      objetivo: 'Termo de cooperação para ações de extensão universitária e desenvolvimento comunitário.',
      coordenadorNome: 'Prof. João Oliveira',
      coordenadorEmail: 'joao.oliveira@ufmg.br',
      coordenadorCelular: '(11) 98765-4321',
      pontoFocalFapes: 'Dr. João Pereira',
      gerenciaResponsavel: 'Dr. Maria Oliveira'
    },
    { 
      id: 4, 
      nome: 'Cooperação USP-Fapes', 
      instituicaoParceira: 'USP', 
      dataEnvio: '20/12/2025', 
      aditivo: 'Sim', 
      area: 'Pesquisa', 
      status: 'Finalizado',
      investimento: 'R$ 4.500.000,00',
      dataAssinatura: '15/12/2025',
      vigenciaInicio: '01/01/2026',
      vigenciaFim: '31/12/2030',
      numeroProcesso: '901234',
      objetivo: 'Parceria finalizada para pesquisa em ciências da saúde e desenvolvimento de novos tratamentos.',
      coordenadorNome: 'Dra. Ana Paula Costa',
      coordenadorEmail: 'ana.costa@usp.br',
      coordenadorCelular: '(11) 98765-4321',
      pontoFocalFapes: 'Dr. João Pereira',
      gerenciaResponsavel: 'Dr. Maria Oliveira'
    },
    { 
      id: 5, 
      nome: 'Parceria Internacional MIT', 
      instituicaoParceira: 'MIT', 
      dataEnvio: '15/11/2025', 
      aditivo: 'Não', 
      area: 'Internacional', 
      status: 'Finalizado',
      investimento: 'R$ 8.900.000,00',
      dataAssinatura: '10/11/2025',
      vigenciaInicio: '01/12/2025',
      vigenciaFim: '30/11/2028',
      numeroProcesso: '567890',
      objetivo: 'Cooperação internacional concluída para intercâmbio científico e desenvolvimento conjunto de pesquisas.',
      coordenadorNome: 'Prof. Richard Brown',
      coordenadorEmail: 'r.brown@mit.edu',
      coordenadorCelular: '(11) 98765-4321',
      pontoFocalFapes: 'Dr. João Pereira',
      gerenciaResponsavel: 'Dr. Maria Oliveira'
    },
    { 
      id: 6, 
      nome: 'Termo Carreira Científica', 
      instituicaoParceira: 'Capes', 
      dataEnvio: '01/10/2025', 
      aditivo: 'Sim', 
      area: 'Carreira Científica', 
      status: 'Finalizado',
      investimento: 'R$ 5.200.000,00',
      dataAssinatura: '25/09/2025',
      vigenciaInicio: '01/10/2025',
      vigenciaFim: '30/09/2029',
      numeroProcesso: '123456',
      objetivo: 'Termo de cooperação finalizado para formação e capacitação de pesquisadores.',
      coordenadorNome: 'Dr. Pedro Fernandes',
      coordenadorEmail: 'pedro.fernandes@capes.gov.br',
      coordenadorCelular: '(11) 98765-4321',
      pontoFocalFapes: 'Dr. João Pereira',
      gerenciaResponsavel: 'Dr. Maria Oliveira'
    },
  ];

  const filtered = parceriasData.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const matchArea = areaFilter === 'Todas' || p.area === areaFilter;
    const matchInstituicao = instituicaoFilter === 'Todos' || p.instituicaoParceira === instituicaoFilter;
    return matchSearch && matchStatus && matchArea && matchInstituicao;
  });

  // Calcular investimento total
  const investimentoTotal = parceriasData
    .filter(p => p.status === 'Ativo')
    .reduce((acc, p) => {
      const value = parseFloat(p.investimento.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
      return acc + value;
    }, 0);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cardStyle = (): React.CSSProperties => ({
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '20px',
  });

  // Tela de Detalhes da Parceria
  if (selectedParceria) {
    return <DetalhesParceria parceria={selectedParceria} onBack={() => setSelectedParceria(null)} />;
  }

  // Tela de Nova Parceria
  if (showNovaParceria) {
    return <FormularioParceria onBack={() => setShowNovaParceria(false)} />;
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">

        {/* Header */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
                <Handshake size={18} style={{ color: '#00c1af' }} />
              </div>
              <div style={{ flex: 1, marginTop: '6px' }}>
                <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', lineHeight: '1.5' }}>
                  Parceria
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.5' }}>
                  Crie e gerencie uma cooperação entre a fundação e outras instituições para viabilizar ações de fomento.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNovaParceria(true)}
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
              Nova Parceria
            </button>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '24px' }} />
        </div>

        {/* Cards de Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Parcerias Abertas', value: '4', Icon: Handshake, iconColor: '#00c1af', iconBg: 'rgba(0,193,175,0.12)' },
            { label: 'Programas Relacionados', value: '8', Icon: FolderOpen, iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)' },
            { label: 'Projetos Relacionados', value: '23', Icon: Briefcase, iconColor: '#fbbf24', iconBg: 'rgba(251,191,36,0.12)' },
            { label: 'Parceiros', value: '12', Icon: Users, iconColor: '#a855f7', iconBg: 'rgba(168,85,247,0.12)' },
            { label: 'Investimento Total', value: formatCurrency(investimentoTotal), Icon: DollarSign, iconColor: '#22c55e', iconBg: 'rgba(34,197,94,0.12)' },
          ].map(({ label, value, Icon, iconColor, iconBg }) => (
            <div
              key={label}
              style={{
                ...cardStyle(),
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: iconBg, 
                    borderRadius: 'var(--radius)',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color: iconColor }} />
                </div>
                <p style={{ 
                  fontFamily: 'var(--font-family)', 
                  fontSize: 'var(--text-sm)', 
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 'var(--font-weight-normal)',
                  margin: 0,
                }}>
                  {label}
                </p>
              </div>
              <p style={{ 
                fontFamily: 'var(--font-family)', 
                fontSize: label === 'Investimento Total' ? 'var(--text-lg)' : 'var(--text-2xl)', 
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Filtros com Labels */}
        <div className="mb-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {/* Campo de Pesquisa */}
            <div>
              <label htmlFor="search-input" style={{
                display: 'block',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '8px',
                fontWeight: 'var(--font-weight-normal)',
              }}>
                Pesquisar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius)',
                    padding: '10px 14px 10px 38px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Filtro Instituição */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="instituicao-filter" style={{
                display: 'block',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '8px',
                fontWeight: 'var(--font-weight-normal)',
              }}>
                Instituição
              </label>
              <button
                id="instituicao-filter"
                onClick={() => {
                  setShowInstituicaoDropdown(!showInstituicaoDropdown);
                  setShowStatusDropdown(false);
                  setShowAreaDropdown(false);
                }}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <span>{instituicaoFilter}</span>
                <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
              {showInstituicaoDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  zIndex: 400,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                  {instituicaoOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setInstituicaoFilter(opt);
                        setShowInstituicaoDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: instituicaoFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                        color: instituicaoFilter === opt ? '#00c1af' : '#ffffff',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { if (instituicaoFilter !== opt) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { if (instituicaoFilter !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro Data */}
            <div>
              <label htmlFor="data-filter" style={{
                display: 'block',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '8px',
                fontWeight: 'var(--font-weight-normal)',
              }}>
                Data
              </label>
              <input
                id="data-filter"
                type="text"
                placeholder="dd/mm/yyyy"
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Filtro Área */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="area-filter" style={{
                display: 'block',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '8px',
                fontWeight: 'var(--font-weight-normal)',
              }}>
                Área
              </label>
              <button
                id="area-filter"
                onClick={() => {
                  setShowAreaDropdown(!showAreaDropdown);
                  setShowStatusDropdown(false);
                  setShowInstituicaoDropdown(false);
                }}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <span>{areaFilter}</span>
                <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
              {showAreaDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  zIndex: 400,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  maxHeight: '240px',
                  overflowY: 'auto',
                }}>
                  {areaOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setAreaFilter(opt);
                        setShowAreaDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: areaFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                        color: areaFilter === opt ? '#00c1af' : '#ffffff',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { if (areaFilter !== opt) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { if (areaFilter !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro Status */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="status-filter" style={{
                display: 'block',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '8px',
                fontWeight: 'var(--font-weight-normal)',
              }}>
                Status
              </label>
              <button
                id="status-filter"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowAreaDropdown(false);
                  setShowInstituicaoDropdown(false);
                }}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <span>{statusFilter}</span>
                <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
              {showStatusDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  zIndex: 400,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                  {statusOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setShowStatusDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: statusFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                        color: statusFilter === opt ? '#00c1af' : '#ffffff',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
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
        </div>

        {/* Lista em Formato de Cards */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedParceria(p)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(0,193,175,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Conteúdo em grid */}
                <div style={{ 
                  flex: 1, 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 1fr 1fr', 
                  gap: '24px',
                  alignItems: 'center',
                }}>
                  {/* Parceria */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}>
                      Parceria
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: '#ffffff',
                    }}>
                      {p.nome}
                    </div>
                  </div>

                  {/* Instituição Parceira */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}>
                      Instituição Parceira
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: '#ffffff',
                    }}>
                      {p.instituicaoParceira}
                    </div>
                  </div>

                  {/* Data de Envio */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}>
                      Data de Envio
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: '#ffffff',
                    }}>
                      {p.dataEnvio}
                    </div>
                  </div>

                  {/* Aditivo */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}>
                      Aditivo
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: '#ffffff',
                    }}>
                      {p.aditivo}
                    </div>
                  </div>

                  {/* Área */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}>
                      Área
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: '#ffffff',
                    }}>
                      {p.area}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}>
                      Status
                    </div>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: `${statusColor(p.status)}20`,
                        color: statusColor(p.status),
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        border: `1px solid ${statusColor(p.status)}`,
                      }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ícone de seta */}
                <div style={{ flexShrink: 0 }}>
                  <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};