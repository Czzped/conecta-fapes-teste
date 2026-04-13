import React, { useState } from 'react';
import { ChevronRight, Home, ArrowLeft, FileText, Plus, ChevronDown, Search, Handshake, FolderOpen, Briefcase, Users, DollarSign } from 'lucide-react';

type StatusFilter = 'Todos' | 'Ativo' | 'Finalizado' | 'Em Andamento' | 'Aprovado' | 'Em Análise' | 'Enviado' | 'Avaliado' | 'Aberto';
type AreaFilter = 'Todas' | 'Carreira Científica' | 'Pesquisa' | 'Difusão do Conhecimento' | 'Extensão' | 'Inovação' | 'Internacional' | 'Ciências da Computação' | 'Saúde Pública';
type InstituicaoFilter = 'Todos' | 'Ufes' | 'Ifes' | 'UFMG' | 'USP' | 'CNPq' | 'Fapesp';
type TipoFilter = 'Captação' | 'Programa';

interface ParceriaItem {
  id: number;
  nome: string;
  instituicaoParceira: string;
  dataEnvio: string;
  aditivo: 'Sim' | 'Não';
  area: string;
  status: string;
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

interface Props {
  parceria: ParceriaItem;
  onBack: () => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '24px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.6)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '24px',
};

// Mock data - mistura de programas e captação (20 linhas)
const mockData = [
  { type: 'programa', id: 1, programa: 'Programa de Bolsas de Pesquisa 2026', eixo: 'Ciência e Tecnologia', dataVigencia: '01/01/2026 - 31/12/2026', status: 'Aberto' },
  { type: 'captacao', id: 2, edital: '002/2026 - Inovação Tecnológica', proponente: 'Maria Santos', dataEnvio: '14/03/2026 - 16:45', area: 'Inovação', status: 'Enviado' },
  { type: 'programa', id: 3, programa: 'Programa de Inovação Tecnológica', eixo: 'Inovação e Desenvolvimento', dataVigencia: '15/02/2026 - 14/02/2027', status: 'Aberto' },
  { type: 'captacao', id: 4, edital: '003/2026 - Extensão Universitária', proponente: 'Carlos Lima', dataEnvio: '13/03/2026 - 10:20', area: 'Extensão', status: 'Avaliado' },
  { type: 'programa', id: 5, programa: 'Programa de Desenvolvimento Sustentável', eixo: 'Meio Ambiente', dataVigencia: '10/02/2026 - 09/02/2027', status: 'Em Andamento' },
  { type: 'captacao', id: 6, edital: '001/2026 - Pesquisa Científica', proponente: 'Dr. João Silva', dataEnvio: '20/03/2026 - 14:30', area: 'Ciências da Computação', status: 'Aprovado' },
  { type: 'programa', id: 7, programa: 'Programa de Extensão Comunitária', eixo: 'Extensão', dataVigencia: '05/03/2026 - 04/03/2027', status: 'Aberto' },
  { type: 'captacao', id: 8, edital: '004/2026 - PPSUS', proponente: 'Dra. Maria Santos', dataEnvio: '15/03/2026 - 09:15', area: 'Saúde Pública', status: 'Em Análise' },
  { type: 'programa', id: 9, programa: 'Programa de Internacionalização', eixo: 'Internacional', dataVigencia: '01/04/2026 - 31/03/2027', status: 'Em Andamento' },
  { type: 'captacao', id: 10, edital: '005/2026 - Difusão Cultural', proponente: 'Prof. Ana Costa', dataEnvio: '18/03/2026 - 11:00', area: 'Difusão do Conhecimento', status: 'Enviado' },
  { type: 'programa', id: 11, programa: 'Programa de Apoio à Carreira', eixo: 'Carreira Científica', dataVigencia: '10/01/2026 - 09/01/2027', status: 'Aberto' },
  { type: 'captacao', id: 12, edital: '006/2026 - Universal', proponente: 'Dr. Pedro Alves', dataEnvio: '22/03/2026 - 15:20', area: 'Pesquisa', status: 'Aprovado' },
  { type: 'programa', id: 13, programa: 'Programa de Fomento à Inovação', eixo: 'Inovação', dataVigencia: '15/03/2026 - 14/03/2027', status: 'Em Andamento' },
  { type: 'captacao', id: 14, edital: '007/2026 - Tecnologia Social', proponente: 'Dra. Beatriz Rocha', dataEnvio: '25/03/2026 - 10:45', area: 'Extensão', status: 'Em Análise' },
  { type: 'programa', id: 15, programa: 'Programa de Pesquisa Aplicada', eixo: 'Pesquisa', dataVigencia: '20/02/2026 - 19/02/2027', status: 'Aberto' },
  { type: 'captacao', id: 16, edital: '008/2026 - Jovem Pesquisador', proponente: 'Lucas Fernandes', dataEnvio: '27/03/2026 - 16:30', area: 'Carreira Científica', status: 'Enviado' },
  { type: 'programa', id: 17, programa: 'Programa de Cooperação Internacional', eixo: 'Internacional', dataVigencia: '01/05/2026 - 30/04/2027', status: 'Em Andamento' },
  { type: 'captacao', id: 18, edital: '009/2026 - Inovação Aberta', proponente: 'Mariana Oliveira', dataEnvio: '28/03/2026 - 14:15', area: 'Inovação', status: 'Avaliado' },
  { type: 'programa', id: 19, programa: 'Programa de Educação Continuada', eixo: 'Difusão do Conhecimento', dataVigencia: '10/03/2026 - 09/03/2027', status: 'Aberto' },
  { type: 'captacao', id: 20, edital: '010/2026 - Mestrado e Doutorado', proponente: 'Rafael Costa', dataEnvio: '30/03/2026 - 11:50', area: 'Carreira Científica', status: 'Aprovado' },
];

// Mock data - 10 linhas de cada tipo
const mockProgramas = [
  { type: 'programa', id: 1, programa: 'Programa de Bolsas de Pesquisa 2026', eixo: 'Ciência e Tecnologia', dataVigencia: '01/01/2026 - 31/12/2026', status: 'Aberto' },
  { type: 'programa', id: 3, programa: 'Programa de Inovação Tecnológica', eixo: 'Inovação e Desenvolvimento', dataVigencia: '15/02/2026 - 14/02/2027', status: 'Aberto' },
  { type: 'programa', id: 5, programa: 'Programa de Desenvolvimento Sustentável', eixo: 'Meio Ambiente', dataVigencia: '10/02/2026 - 09/02/2027', status: 'Em Andamento' },
  { type: 'programa', id: 7, programa: 'Programa de Extensão Comunitária', eixo: 'Extensão', dataVigencia: '05/03/2026 - 04/03/2027', status: 'Aberto' },
  { type: 'programa', id: 9, programa: 'Programa de Internacionalização', eixo: 'Internacional', dataVigencia: '01/04/2026 - 31/03/2027', status: 'Em Andamento' },
  { type: 'programa', id: 11, programa: 'Programa de Apoio à Carreira', eixo: 'Carreira Científica', dataVigencia: '10/01/2026 - 09/01/2027', status: 'Aberto' },
  { type: 'programa', id: 13, programa: 'Programa de Fomento à Inovação', eixo: 'Inovação', dataVigencia: '15/03/2026 - 14/03/2027', status: 'Em Andamento' },
  { type: 'programa', id: 15, programa: 'Programa de Pesquisa Aplicada', eixo: 'Pesquisa', dataVigencia: '20/02/2026 - 19/02/2027', status: 'Aberto' },
  { type: 'programa', id: 17, programa: 'Programa de Cooperação Internacional', eixo: 'Internacional', dataVigencia: '01/05/2026 - 30/04/2027', status: 'Em Andamento' },
  { type: 'programa', id: 19, programa: 'Programa de Educação Continuada', eixo: 'Difusão do Conhecimento', dataVigencia: '10/03/2026 - 09/03/2027', status: 'Aberto' },
];

const mockCaptacao = [
  { type: 'captacao', id: 2, edital: '002/2026 - Inovação Tecnológica', proponente: 'Maria Santos', dataEnvio: '14/03/2026 - 16:45', area: 'Inovação', status: 'Enviado' },
  { type: 'captacao', id: 4, edital: '003/2026 - Extensão Universitária', proponente: 'Carlos Lima', dataEnvio: '13/03/2026 - 10:20', area: 'Extensão', status: 'Avaliado' },
  { type: 'captacao', id: 6, edital: '001/2026 - Pesquisa Científica', proponente: 'Dr. João Silva', dataEnvio: '20/03/2026 - 14:30', area: 'Ciências da Computação', status: 'Aprovado' },
  { type: 'captacao', id: 8, edital: '004/2026 - PPSUS', proponente: 'Dra. Maria Santos', dataEnvio: '15/03/2026 - 09:15', area: 'Saúde Pública', status: 'Em Análise' },
  { type: 'captacao', id: 10, edital: '005/2026 - Difusão Cultural', proponente: 'Prof. Ana Costa', dataEnvio: '18/03/2026 - 11:00', area: 'Difusão do Conhecimento', status: 'Enviado' },
  { type: 'captacao', id: 12, edital: '006/2026 - Universal', proponente: 'Dr. Pedro Alves', dataEnvio: '22/03/2026 - 15:20', area: 'Pesquisa', status: 'Aprovado' },
  { type: 'captacao', id: 14, edital: '007/2026 - Tecnologia Social', proponente: 'Dra. Beatriz Rocha', dataEnvio: '25/03/2026 - 10:45', area: 'Extensão', status: 'Em Análise' },
  { type: 'captacao', id: 16, edital: '008/2026 - Jovem Pesquisador', proponente: 'Lucas Fernandes', dataEnvio: '27/03/2026 - 16:30', area: 'Carreira Científica', status: 'Enviado' },
  { type: 'captacao', id: 18, edital: '009/2026 - Inovação Aberta', proponente: 'Mariana Oliveira', dataEnvio: '28/03/2026 - 14:15', area: 'Inovação', status: 'Avaliado' },
  { type: 'captacao', id: 20, edital: '010/2026 - Mestrado e Doutorado', proponente: 'Rafael Costa', dataEnvio: '30/03/2026 - 11:50', area: 'Carreira Científica', status: 'Aprovado' },
];

const statusColor = (s: string) => {
  switch (s) {
    case 'Aberto': return '#22c55e';
    case 'Em Andamento': return '#3b82f6';
    case 'Aprovado': return '#22c55e';
    case 'Em Análise': return '#fbbf24';
    case 'Enviado': return '#3b82f6';
    case 'Avaliado': return '#a855f7';
    default: return '#94a3b8';
  }
};

export const DetalhesParceria: React.FC<Props> = ({ parceria, onBack }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'parceria'>('geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [instituicaoFilter, setInstituicaoFilter] = useState<InstituicaoFilter>('Todos');
  const [showInstituicaoDropdown, setShowInstituicaoDropdown] = useState(false);
  const [dataFilter, setDataFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('Todas');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [tipoFilter, setTipoFilter] = useState<TipoFilter>('Captação');
  const [showTipoDropdown, setShowTipoDropdown] = useState(false);

  const statusOptions: StatusFilter[] = ['Todos', 'Aberto', 'Em Andamento', 'Aprovado', 'Em Análise', 'Enviado', 'Avaliado'];
  const areaOptions: AreaFilter[] = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional', 'Ciências da Computação', 'Saúde Pública'];
  const instituicaoOptions: InstituicaoFilter[] = ['Todos', 'Ufes', 'Ifes', 'UFMG', 'USP', 'CNPq', 'Fapesp'];
  const tipoOptions: TipoFilter[] = ['Captação', 'Programa'];

  const renderTabBar = () => (
    <div style={{ 
      display: 'flex', 
      gap: '4px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '28px',
    }}>
      <button
        onClick={() => setActiveTab('geral')}
        style={{
          flex: '0 0 auto',
          padding: '12px 24px',
          background: 'none',
          border: 'none',
          borderBottom: activeTab === 'geral' ? '2px solid #00c1af' : '2px solid transparent',
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: activeTab === 'geral' ? '#00c1af' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
          marginBottom: '-1px',
        }}
        onMouseEnter={e => {
          if (activeTab !== 'geral') e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
        }}
        onMouseLeave={e => {
          if (activeTab !== 'geral') e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
        }}
      >
        Informações Gerais
      </button>
      <button
        onClick={() => setActiveTab('parceria')}
        style={{
          flex: '0 0 auto',
          padding: '12px 24px',
          background: 'none',
          border: 'none',
          borderBottom: activeTab === 'parceria' ? '2px solid #00c1af' : '2px solid transparent',
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: activeTab === 'parceria' ? '#00c1af' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
          marginBottom: '-1px',
        }}
        onMouseEnter={e => {
          if (activeTab !== 'parceria') e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
        }}
        onMouseLeave={e => {
          if (activeTab !== 'parceria') e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
        }}
      >
        Informações da Parceria
      </button>
    </div>
  );

  const renderInformacoesGerais = () => (
    <>
      {/* Cards de métricas - estilo igual ao da tela Parceria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Programas Relacionados', value: '2', Icon: FolderOpen, iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)' },
          { label: 'Projetos Relacionados', value: '8', Icon: Briefcase, iconColor: '#fbbf24', iconBg: 'rgba(251,191,36,0.12)' },
          { label: 'Investimento Total', value: parceria.investimento, Icon: DollarSign, iconColor: '#22c55e', iconBg: 'rgba(34,197,94,0.12)' },
          { label: 'Investimento Utilizado', value: 'R$ 85.000,00', Icon: DollarSign, iconColor: '#00c1af', iconBg: 'rgba(0,193,175,0.12)' },
        ].map(({ label, value, Icon, iconColor, iconBg }) => (
          <div
            key={label}
            style={{
              ...metricCardStyle,
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
              fontSize: label.includes('Investimento') ? 'var(--text-lg)' : 'var(--text-2xl)', 
              color: '#ffffff',
              textAlign: 'center',
              margin: 0,
            }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros - sem card em volta - todos na mesma linha */}
      <div className="mb-6">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '16px' }}>
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
                  ...inputStyle,
                  paddingLeft: '38px',
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

          {/* Filtro Tipo */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="tipo-filter" style={{
              display: 'block',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '8px',
              fontWeight: 'var(--font-weight-normal)',
            }}>
              Tipo
            </label>
            <button
              id="tipo-filter"
              onClick={() => {
                setShowTipoDropdown(!showTipoDropdown);
                setShowStatusDropdown(false);
                setShowAreaDropdown(false);
                setShowInstituicaoDropdown(false);
              }}
              style={{
                ...inputStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>{tipoFilter}</span>
              <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {showTipoDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius)',
                marginTop: '4px',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {tipoOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTipoFilter(opt);
                      setShowTipoDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: tipoFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: tipoFilter === opt ? '#00c1af' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = tipoFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent'}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
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
                setShowTipoDropdown(false);
              }}
              style={{
                ...inputStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>{instituicaoFilter}</span>
              <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {showInstituicaoDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius)',
                marginTop: '4px',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {instituicaoOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setInstituicaoFilter(opt);
                      setShowInstituicaoDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: instituicaoFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: instituicaoFilter === opt ? '#00c1af' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = instituicaoFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent'}
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
              placeholder="Selecionar data"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
              style={inputStyle}
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
                setShowTipoDropdown(false);
              }}
              style={{
                ...inputStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>{areaFilter}</span>
              <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {showAreaDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius)',
                marginTop: '4px',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {areaOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setAreaFilter(opt);
                      setShowAreaDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: areaFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: areaFilter === opt ? '#00c1af' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = areaFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent'}
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
                setShowTipoDropdown(false);
              }}
              style={{
                ...inputStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>{statusFilter}</span>
              <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {showStatusDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius)',
                marginTop: '4px',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setShowStatusDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: statusFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: statusFilter === opt ? '#00c1af' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = statusFilter === opt ? 'rgba(0,193,175,0.1)' : 'transparent'}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista unificada de Programas e Captação - 20 linhas alternadas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(tipoFilter === 'Captação' ? mockCaptacao : mockProgramas).map((item: any) => {
          if (item.type === 'programa') {
            return (
              <div
                key={`programa-${item.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1.5fr 1.5fr 0.8fr 40px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '20px 24px',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Programa
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
                    {item.programa}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Eixo Estratégico
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                    {item.eixo}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Data de Vigência
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                    {item.dataVigencia}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Status
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    backgroundColor: `${statusColor(item.status)}20`,
                    color: statusColor(item.status),
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={`captacao-${item.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 0.8fr 40px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '20px 24px',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Edital
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
                    {item.edital}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Proponente
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                    {item.proponente}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Data de Envio
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                    {item.dataEnvio}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Área
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                    {item.area}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                    Status
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    backgroundColor: `${statusColor(item.status)}20`,
                    color: statusColor(item.status),
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );

  const renderInformacoesParceria = () => (
    <>
      {/* Card único com todas as informações */}
      <div style={cardStyle}>
        <h2 style={{
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: '#00c1af',
          margin: '0 0 20px',
        }}>
          Identificação da Parceria
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Nome da Parceria */}
          <div>
            <label style={labelStyle}>Nome da Parceria</label>
            <input type="text" value={parceria.nome} readOnly style={inputStyle} />
          </div>

          {/* Instituição Parceira e Valor Investido */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Instituição Parceira</label>
              <input type="text" value={parceria.instituicaoParceira} readOnly style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Valor Investido (R$)</label>
              <input 
                type="text" 
                value={parceria.investimento} 
                readOnly 
                style={{
                  ...inputStyle,
                  color: '#00c1af',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              />
            </div>
          </div>

          {/* Área e Número do Processo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Área</label>
              <input type="text" value={parceria.area} readOnly style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Número do Processo</label>
              <input type="text" value={parceria.numeroProcesso} readOnly style={inputStyle} />
            </div>
          </div>

          {/* Data de Assinatura, Vigência Início e Fim */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Data da Assinatura</label>
              <input type="text" value={parceria.dataAssinatura} readOnly style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data de Vigência (Início)</label>
              <input type="text" value={parceria.vigenciaInicio} readOnly style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data de Vigência (Fim)</label>
              <input type="text" value={parceria.vigenciaFim} readOnly style={inputStyle} />
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <label style={labelStyle}>Objetivo</label>
            <textarea
              value={parceria.objetivo}
              readOnly
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: '1.6',
              }}
            />
          </div>

          {/* Divisor */}
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

          {/* Coordenador */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 16px',
            }}>
              Coordenador
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input type="text" value={parceria.coordenadorNome} readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input type="text" value={parceria.coordenadorEmail} readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Celular</label>
                <input type="text" value={parceria.coordenadorCelular} readOnly style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

          {/* Gestão */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 16px',
            }}>
              Gestão
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Ponto Focal Fapes</label>
                <input type="text" value={parceria.pontoFocalFapes} readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Gerência Responsável</label>
                <input type="text" value={parceria.gerenciaResponsavel} readOnly style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentos Relacionados */}
      <div style={cardStyle}>
        <h2 style={{
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: '#00c1af',
          margin: '0 0 20px',
        }}>
          Documentos Relacionados
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { nome: 'Formulário de Monitoramento', data: '15/03/2026', tipo: 'PDF' },
            { nome: 'Termo de Cooperação', data: parceria.dataAssinatura, tipo: 'PDF' },
          ].map((doc, idx) => (
            <button
              key={idx}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px 20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(0,193,175,0.12)',
                  borderRadius: 'var(--radius)',
                }}>
                  <FileText size={18} style={{ color: '#00c1af' }} />
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}>
                    {doc.nome}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-xs)',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {doc.tipo} • Atualizado em {doc.data}
                  </div>
                </div>
              </div>
              <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Parceria
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--text-sm)',
            color: '#00c1af',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Detalhes da Parceria
          </span>
        </div>

        {/* Header com botão Voltar e Adicionar Aditivo (condicional) */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  flexShrink: 0,
                  backgroundColor: 'rgba(0,193,175,0.15)',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.25)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
              >
                <ArrowLeft size={18} style={{ color: '#00c1af' }} />
              </button>
              <div style={{ flex: 1 }}>
                <h1 style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#ffffff',
                  margin: '0 0 8px',
                  lineHeight: '1.4',
                }}>
                  Detalhes da Parceria
                </h1>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                }}>
                  Verifique as informações dessa Parceria.
                </p>
              </div>
            </div>

            {/* Botão Adicionar Aditivo - aparece apenas na tab "Informações da Parceria" */}
            {activeTab === 'parceria' && (
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(0,193,175,0.4)',
                  borderRadius: 'var(--radius)',
                  color: '#00c1af',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)';
                  e.currentTarget.style.borderColor = '#00c1af';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
                }}
              >
                <Plus size={16} />
                Adicionar Aditivo
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        {renderTabBar()}

        {/* Conteúdo das Tabs */}
        {activeTab === 'geral' ? renderInformacoesGerais() : renderInformacoesParceria()}
      </div>
    </div>
  );
};