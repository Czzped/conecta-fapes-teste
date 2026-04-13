import React, { useState } from 'react';
import { Search, ChevronRight, Home, FolderOpen, ChevronDown, Plus, Activity, Layers, TrendingUp, DollarSign } from 'lucide-react';
import { FormularioPrograma } from './FormularioPrograma';
import { DetalhesPrograma } from './DetalhesPrograma';

type StatusFilter = 'Todos' | 'Aberto' | 'Rascunho' | 'Fechado';
type ProgramaStatus = 'Aberto' | 'Rascunho' | 'Fechado';

interface ProgramaItem {
  id: number;
  nome: string;
  eixo: string;
  dataVigencia: string;
  status: ProgramaStatus;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'Aberto':   return '#22c55e';
    case 'Rascunho': return '#fbbf24';
    case 'Fechado':  return '#94a3b8';
    default:         return '#94a3b8';
  }
};

interface Props {
  onBack: () => void;
}

export const Programa: React.FC<Props> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [eixoFilter, setEixoFilter] = useState('Todos');
  const [showEixoDropdown, setShowEixoDropdown] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState<ProgramaItem | null>(null);

  const statusOptions: StatusFilter[] = ['Todos', 'Aberto', 'Rascunho', 'Fechado'];

  const programasData: ProgramaItem[] = [
    { id: 1, nome: 'Programa de Bolsas de Pesquisa 2026', eixo: 'Ciência e Tecnologia', dataVigencia: '01/01/2026 - 31/12/2026', status: 'Aberto' },
    { id: 2, nome: 'Programa de Inovação Tecnológica', eixo: 'Inovação e Desenvolvimento', dataVigencia: '15/02/2026 - 14/02/2027', status: 'Aberto' },
    { id: 3, nome: 'Programa de Extensão Universitária', eixo: 'Formação de Recursos Humanos', dataVigencia: '01/03/2026 - 28/02/2027', status: 'Rascunho' },
    { id: 4, nome: 'Programa de Infraestrutura Laboratorial', eixo: 'Infraestrutura de Pesquisa', dataVigencia: '01/04/2026 - 31/03/2027', status: 'Rascunho' },
    { id: 5, nome: 'Programa de Carreira Científica 2025', eixo: 'Formação de Recursos Humanos', dataVigencia: '01/01/2025 - 31/12/2025', status: 'Fechado' },
    { id: 6, nome: 'Programa de Difusão do Conhecimento', eixo: 'Ciência e Tecnologia', dataVigencia: '01/06/2025 - 31/05/2026', status: 'Fechado' },
  ];

  const filtered = programasData.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const matchEixo = eixoFilter === 'Todos' || p.eixo === eixoFilter;
    return matchSearch && matchStatus && matchEixo;
  });

  if (showFormulario) {
    return <FormularioPrograma onBack={() => setShowFormulario(false)} />;
  }

  if (selectedPrograma) {
    return <DetalhesPrograma onBack={() => setSelectedPrograma(null)} />;
  }

  const cardStyle = (accentColor: string): React.CSSProperties => ({
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '20px',
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

        {/* Cards de Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            {
              icon: <FolderOpen size={18} style={{ color: '#00c1af' }} />,
              bg: 'rgba(0,193,175,0.15)',
              label: 'Programas Ativos',
              value: '4',
            },
            {
              icon: <Layers size={18} style={{ color: '#3b82f6' }} />,
              bg: 'rgba(59,130,246,0.15)',
              label: 'Projetos Ativos Vinculados',
              value: '87',
            },
            {
              icon: <DollarSign size={18} style={{ color: '#22c55e' }} />,
              bg: 'rgba(34,197,94,0.15)',
              label: 'Investimento Total',
              value: 'R$ 12,4M',
            },
            {
              icon: <TrendingUp size={18} style={{ color: '#fbbf24' }} />,
              bg: 'rgba(251,191,36,0.15)',
              label: 'Investimento em Execução',
              value: 'R$ 7,8M',
            },
          ].map(({ icon, bg, label, value }) => (
            <div key={label} style={cardStyle('#00c1af')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: bg, borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icon}
                </div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

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
              Data
            </label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
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
              Status
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
                      Eixo Estratégico
                    </span>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                      {prog.eixo}
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
                      Status
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

      </div>
    </div>
  );
};