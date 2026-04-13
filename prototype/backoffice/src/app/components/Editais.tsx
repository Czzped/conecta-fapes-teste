import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, FileText, Clock, Users, ClipboardList, ChevronRight, CheckCircle, Plus, Home, FolderOpen, BookOpen } from 'lucide-react';
import { FormularioInscricaoGeral } from './FormularioInscricaoGeral';
import { Programa } from './Programa';
import { FormularioPersonalizado } from './FormularioPersonalizado';
import { FormularioEdital } from './FormularioEdital';
import { FormularioAvaliacao } from './FormularioAvaliacao';
import { FormularioRecurso } from './FormularioRecurso';
import { FormularioInstituicaoParceira } from './FormularioInstituicaoParceira';
import { DetalhesCaptacao } from './DetalhesCaptacao';

interface EditalInscricao {
  id: number;
  edital: string;
  proponente: string;
  dataEnvio: string;
  setor: string;
  status: string;
}

type AreaFilter = 'Todas' | 'Carreira Científica' | 'Pesquisa' | 'Difusão do Conhecimento' | 'Extensão' | 'Inovação' | 'Internacional';
type SetorFilter = 'Todos' | 'Enviado' | 'Em Avaliação' | 'Avaliado' | 'Aprovado' | 'Reprovado';
type InstituicaoFilter = 'Todos' | 'Ufes' | 'Ifes';
type ActiveTab = 'inscricoes' | 'avaliacao' | 'recurso' | 'finalizado';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Enviado': return '#3b82f6';
    case 'Em Avaliação': return '#fbbf24';
    case 'Avaliado': return '#00c1af';
    case 'Aprovado': return '#22c55e';
    case 'Reprovado': return '#ef4444';
    case 'Não Aprovado': return '#ef4444';
    // Edital statuses
    case 'Aberto': return '#22c55e';
    case 'Em Andamento': return '#fbbf24';
    case 'Fechado': return '#94a3b8';
    // Recurso statuses
    case 'Recebido': return '#fbbf24';
    case 'Recusado': return '#ef4444';
    case 'Aceito': return '#22c55e';
    default: return '#94a3b8';
  }
};

interface EditalItem {
  id: number;
  programa: string;
  edital: string;
  projetosInscritos: number;
  dataSubmissao: string;
  area: string;
  status: 'Aberto' | 'Em Andamento' | 'Fechado';
}

const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
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
          boxSizing: 'border-box' as const,
          transition: 'border-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ color: value ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
          {value ? options.find(o => o.value === value)?.label : (placeholder || 'Selecione...')}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: 'rgba(255,255,255,0.4)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          }}
        />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius)', zIndex: 400, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                backgroundColor: value === opt.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                color: value === opt.value ? '#00c1af' : '#ffffff',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface EditaisProps {
  isFormularioMode?: boolean;
}

export const Editais: React.FC<EditaisProps> = ({ isFormularioMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('Todas');
  const [setorFilter, setSetorFilter] = useState<SetorFilter>('Todos');
  const [instituicaoFilter, setInstituicaoFilter] = useState<InstituicaoFilter>('Todos');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showSetorDropdown, setShowSetorDropdown] = useState(false);
  const [showInstituicaoDropdown, setShowInstituicaoDropdown] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [showFormularioGeral, setShowFormularioGeral] = useState(false);
  const [showFormularioPersonalizado, setShowFormularioPersonalizado] = useState(false);
  const [showFormularioAvaliacao, setShowFormularioAvaliacao] = useState(false);
  const [showFormularioRecurso, setShowFormularioRecurso] = useState(false);
  const [showFormularioInstituicaoParceira, setShowFormularioInstituicaoParceira] = useState(false);
  const [showDetalhesCaptacao, setShowDetalhesCaptacao] = useState(false);
  const [showCriarPrograma, setShowCriarPrograma] = useState(false);
  const [showCriarEdital, setShowCriarEdital] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('inscricoes');
  const [formularioTab, setFormularioTab] = useState<'biblioteca' | 'criados'>('biblioteca');
  const [formularioPesquisa, setFormularioPesquisa] = useState('');
  const [formularioCategoria, setFormularioCategoria] = useState('');

  const areaOptions: AreaFilter[] = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional'];
  const setorOptions: SetorFilter[] = ['Todos', 'Enviado', 'Em Avaliação', 'Avaliado', 'Aprovado', 'Reprovado'];
  const instituicaoOptions: InstituicaoFilter[] = ['Todos', 'Ufes', 'Ifes'];

  const editaisData: EditalItem[] = [
    { id: 1, programa: 'Bolsas de Pesquisa', edital: '001/2026 - Bolsas de Pesquisa', projetosInscritos: 42, dataSubmissao: '31/03/2026', area: 'Pesquisa', status: 'Aberto' },
    { id: 2, programa: 'Inovação Tecnológica', edital: '002/2026 - Inovação Tecnológica', projetosInscritos: 18, dataSubmissao: '15/04/2026', area: 'Inovação', status: 'Aberto' },
    { id: 3, programa: 'Extensão Universitária', edital: '003/2026 - Extensão Universitária', projetosInscritos: 31, dataSubmissao: '10/02/2026', area: 'Extensão', status: 'Em Andamento' },
    { id: 4, programa: 'Desenvolvimento Regional', edital: '004/2026 - Desenvolvimento Regional', projetosInscritos: 27, dataSubmissao: '28/02/2026', area: 'Difusão do Conhecimento', status: 'Em Andamento' },
    { id: 5, programa: 'Carreira Científica', edital: '005/2026 - Carreira Científica', projetosInscritos: 56, dataSubmissao: '20/01/2026', area: 'Carreira Científica', status: 'Fechado' },
    { id: 6, programa: 'Internacional', edital: '006/2026 - Difusão do Conhecimento', projetosInscritos: 14, dataSubmissao: '05/01/2026', area: 'Internacional', status: 'Fechado' },
  ];

  const avaliacaoData = [
    { id: 1, avaliador: 'Prof. Dr. Marcos Andrade', edital: '001/2026 - Bolsas de Pesquisa', dataEnvio: '15/03/2026', dataAvaliacao: '22/03/2026', area: 'Pesquisa', status: 'Avaliado' },
    { id: 2, avaliador: 'Dra. Fernanda Rocha', edital: '002/2026 - Inovação Tecnológica', dataEnvio: '14/03/2026', dataAvaliacao: '—', area: 'Inovação', status: 'Em Avaliação' },
    { id: 3, avaliador: 'Prof. Eduardo Martins', edital: '003/2026 - Extensão Universitária', dataEnvio: '13/03/2026', dataAvaliacao: '20/03/2026', area: 'Extensão', status: 'Avaliado' },
    { id: 4, avaliador: 'Dra. Carla Vasconcelos', edital: '001/2026 - Bolsas de Pesquisa', dataEnvio: '12/03/2026', dataAvaliacao: '—', area: 'Carreira Científica', status: 'Em Avaliação' },
    { id: 5, avaliador: 'Prof. Dr. Ricardo Fontes', edital: '004/2026 - Desenvolvimento Regional', dataEnvio: '11/03/2026', dataAvaliacao: '18/03/2026', area: 'Difusão do Conhecimento', status: 'Avaliado' },
    { id: 6, avaliador: 'Dra. Patrícia Lemos', edital: '005/2026 - Carreira Científica', dataEnvio: '10/03/2026', dataAvaliacao: '—', area: 'Carreira Científica', status: 'Em Avaliação' },
  ];

  const inscricoesData: EditalInscricao[] = [
    { id: 1, edital: '001/2026 - Bolsas de Pesquisa', proponente: 'João Silva', dataEnvio: '15/03/2026 - 14:30', setor: 'Pesquisa', status: 'Em Avaliação' },
    { id: 2, edital: '002/2026 - Inovação Tecnológica', proponente: 'Maria Santos', dataEnvio: '14/03/2026 - 16:45', setor: 'Inovação', status: 'Enviado' },
    { id: 3, edital: '003/2026 - Extensão Universitária', proponente: 'Carlos Lima', dataEnvio: '13/03/2026 - 10:20', setor: 'Extensão', status: 'Avaliado' },
    { id: 4, edital: '001/2026 - Bolsas de Pesquisa', proponente: 'Ana Paula Rodrigues', dataEnvio: '12/03/2026 - 11:15', setor: 'Carreira Científica', status: 'Em Avaliação' },
    { id: 5, edital: '004/2026 - Desenvolvimento Regional', proponente: 'Pedro Costa', dataEnvio: '11/03/2026 - 09:00', setor: 'Difusão do Conhecimento', status: 'Aprovado' },
    { id: 6, edital: '005/2026 - Carreira Científica', proponente: 'Sandra Oliveira', dataEnvio: '10/03/2026 - 13:40', setor: 'Carreira Científica', status: 'Reprovado' },
    { id: 7, edital: '006/2026 - Difusão do Conhecimento', proponente: 'Ricardo Melo', dataEnvio: '09/03/2026 - 08:55', setor: 'Internacional', status: 'Enviado' },
  ];

  if (showFormularioPersonalizado) {
    return <FormularioPersonalizado onBack={() => setShowFormularioPersonalizado(false)} />;
  }

  if (showCriarPrograma) {
    return <Programa onBack={() => setShowCriarPrograma(false)} />;
  }

  if (showCriarEdital) {
    return (
      <FormularioEdital onBack={() => setShowCriarEdital(false)} />
    );
  }

  if (showFormularioGeral) {
    return (
      <FormularioInscricaoGeral
        onBack={() => setShowFormularioGeral(false)}
        onBackToEditais={() => { setShowFormularioGeral(false); setShowFormulario(false); }}
        isTemplate={true}
      />
    );
  }

  if (showFormularioAvaliacao) {
    return (
      <FormularioAvaliacao onBack={() => setShowFormularioAvaliacao(false)} />
    );
  }

  if (showFormularioRecurso) {
    return (
      <FormularioRecurso onBack={() => setShowFormularioRecurso(false)} />
    );
  }

  if (showFormularioInstituicaoParceira) {
    return (
      <FormularioInstituicaoParceira onBack={() => setShowFormularioInstituicaoParceira(false)} />
    );
  }

  if (showDetalhesCaptacao) {
    return (
      <DetalhesCaptacao onBack={() => setShowDetalhesCaptacao(false)} />
    );
  }

  // Se estiver em modo Formulário, mostrar automaticamente a tela de Formulário
  if (isFormularioMode || showFormulario) {
    return (
      <div className="flex-1" style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', flexShrink: 0,
                backgroundColor: 'rgba(0, 193, 175, 0.15)',
                borderRadius: 'var(--radius)',
              }}>
                <Plus size={18} style={{ color: '#00c1af' }} />
              </div>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                  fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                  margin: '0 0 4px', lineHeight: '1.4',
                }}>
                  Formulário
                </h1>
                <p style={{
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.55)', margin: 0,
                }}>
                  Selecione um formulário já produzido ou crie um novo.
                </p>
              </div>
            </div>

            {/* Botão Formulário Personalizado */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#00c1af', border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 18px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: '#0f172a',
                cursor: 'pointer', flexShrink: 0, transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
              onClick={() => setShowFormularioPersonalizado(true)}
            >
              <Plus size={16} />
              Novo Formulário
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '24px', marginTop: '20px' }} />

          {/* Tab Bar Link */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => setFormularioTab('biblioteca')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 12px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: formularioTab === 'biblioteca' ? '#00c1af' : 'rgba(255,255,255,0.5)',
                borderBottom: formularioTab === 'biblioteca' ? '2px solid #00c1af' : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              Biblioteca
            </button>
            <button
              onClick={() => setFormularioTab('criados')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 12px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: formularioTab === 'criados' ? '#00c1af' : 'rgba(255,255,255,0.5)',
                borderBottom: formularioTab === 'criados' ? '2px solid #00c1af' : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              Formulários Criados
            </button>
          </div>

          {/* Filtros: Pesquisar e Categoria */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                display: 'block',
                marginBottom: '6px',
              }}>
                Pesquisar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="buscar"
                  value={formularioPesquisa}
                  onChange={(e) => setFormularioPesquisa(e.target.value)}
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
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              </div>
            </div>
            <div>
              <label style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.7)',
                display: 'block',
                marginBottom: '6px',
              }}>
                Categoria
              </label>
              <SelectField
                value={formularioCategoria}
                onChange={setFormularioCategoria}
                placeholder="Categoria"
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'inscricao', label: 'Inscrição' },
                  { value: 'avaliacao', label: 'Avaliação' },
                  { value: 'recurso', label: 'Recurso' },
                  { value: 'outro', label: 'Outro Exemplo' }
                ]}
              />
            </div>
          </div>

          {/* Conteúdo condicional baseado na aba ativa */}
          {formularioTab === 'biblioteca' && (
            <>
              {/* Card — Template - Formulário de Inscrição */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
                }}
                onClick={() => setShowFormularioGeral(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                    margin: '0 0 6px',
                  }}>
                    Template - Formulário de Inscrição
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: 'rgba(255,255,255,0.5)', margin: 0,
                  }}>
                    Clique para acessar o formulário de submissão
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              </button>

              {/* Card — Template - Formulário de Avaliação */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
                }}
                onClick={() => setShowFormularioAvaliacao(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                    margin: '0 0 6px',
                  }}>
                    Template - Formulário de Avaliação
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: 'rgba(255,255,255,0.5)', margin: 0,
                  }}>
                    Clique para acessar o formulário de avaliação
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              </button>

              {/* Card — Template - Formulário de Recurso */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
                }}
                onClick={() => setShowFormularioRecurso(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                    margin: '0 0 6px',
                  }}>
                    Template - Formulário de Recurso
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: 'rgba(255,255,255,0.5)', margin: 0,
                  }}>
                    Clique para acessar o formulário de recurso
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              </button>

              {/* Card — Template - Instituição Parceira */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)';
                }}
                onClick={() => setShowFormularioInstituicaoParceira(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                    margin: '0 0 6px',
                  }}>
                    Template - Instituição Parceira
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: 'rgba(255,255,255,0.5)', margin: 0,
                  }}>
                    Clique para acessar o formulário de instituição parceira
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">

        {/* Título */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '36px', height: '36px', backgroundColor: 'rgba(0, 193, 175, 0.1)', borderRadius: 'var(--radius)' }}>
                <ClipboardList size={20} style={{ color: '#00c1af' }} />
              </div>
              <div style={{ flex: 1, marginTop: '6px' }}>
                <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', lineHeight: '1.5' }}>
                  Captação
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: '1.5' }}>
                  Acompanhe as chamadas para projetos
                </p>
              </div>
            </div>

            {/* Botão Nova Captação */}
            <button
              onClick={() => setShowCriarEdital(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#00c1af', border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 18px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: '#0f172a',
                cursor: 'pointer', transition: 'background-color 0.2s', flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
            >
              <Plus size={16} />
              Nova Captação
            </button>
          </div>
          <div className="mt-6" style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Cards de Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(0, 193, 175, 0.15)', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} style={{ color: '#00c1af' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'var(--font-weight-normal)' }}>Editais Abertos</span>
            </div>
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>6</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} style={{ color: '#fbbf24' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'var(--font-weight-normal)' }}>Em Andamento</span>
            </div>
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>4</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} style={{ color: '#3b82f6' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'var(--font-weight-normal)' }}>Em Avaliação</span>
            </div>
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>12</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} style={{ color: '#22c55e' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'var(--font-weight-normal)' }}>Avaliados</span>
            </div>
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>38</div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={18} style={{ color: '#ef4444' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'var(--font-weight-normal)' }}>Total de Inscrições</span>
            </div>
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>247</div>
          </div>
        </div>

        {/* Tab Bar Link */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {(['inscricoes', 'avaliacao', 'recurso', 'finalizado'] as ActiveTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'inscricoes' ? 'Inscrições' : tab === 'avaliacao' ? 'Avaliação' : tab === 'recurso' ? 'Recurso' : 'Finalizado';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0 0 12px 0',
                    marginRight: '28px',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #00c1af' : '2px solid transparent',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                    color: isActive ? '#00c1af' : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '-1px' }} />
        </div>

        {/* Filtros */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {/* Pesquisar */}
            <div>
              <label htmlFor="search-input" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Pesquisar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '10px 12px 10px 36px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              </div>
            </div>

            {/* Data */}
            <div>
              <label htmlFor="date-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Data
              </label>
              <input
                id="date-filter"
                type="text"
                placeholder="dd/mm/yyyy"
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '10px 12px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Área */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="area-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Área
              </label>
              <button
                id="area-filter"
                onClick={() => { setShowAreaDropdown(!showAreaDropdown); setShowSetorDropdown(false); setShowInstituicaoDropdown(false); }}
                style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '10px 12px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span>{areaFilter}</span>
                <ChevronDown size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </button>
              {showAreaDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px', backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden', zIndex: 100 }}>
                  {areaOptions.map((option) => (
                    <button key={option} onClick={() => { setAreaFilter(option); setShowAreaDropdown(false); }}
                      style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: areaFilter === option ? 'rgba(0, 193, 175, 0.1)' : 'transparent', color: areaFilter === option ? '#00c1af' : '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { if (areaFilter !== option) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { if (areaFilter !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >{option}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="status-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Status
              </label>
              <button
                id="status-filter"
                onClick={() => { setShowSetorDropdown(!showSetorDropdown); setShowAreaDropdown(false); setShowInstituicaoDropdown(false); }}
                style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '10px 12px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span>{setorFilter}</span>
                <ChevronDown size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </button>
              {showSetorDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px', backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden', zIndex: 100 }}>
                  {setorOptions.map((option) => (
                    <button key={option} onClick={() => { setSetorFilter(option); setShowSetorDropdown(false); }}
                      style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: setorFilter === option ? 'rgba(0, 193, 175, 0.1)' : 'transparent', color: setorFilter === option ? '#00c1af' : '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { if (setorFilter !== option) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { if (setorFilter !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >{option}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Instituição */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="category-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Instituição
              </label>
              <button
                id="category-filter"
                onClick={() => { setShowInstituicaoDropdown(!showInstituicaoDropdown); setShowAreaDropdown(false); setShowSetorDropdown(false); }}
                style={{ width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '10px 12px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span>{instituicaoFilter}</span>
                <ChevronDown size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </button>
              {showInstituicaoDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px', backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden', zIndex: 100 }}>
                  {instituicaoOptions.map((option) => (
                    <button key={option} onClick={() => { setInstituicaoFilter(option); setShowInstituicaoDropdown(false); }}
                      style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: instituicaoFilter === option ? 'rgba(0, 193, 175, 0.1)' : 'transparent', color: instituicaoFilter === option ? '#00c1af' : '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { if (instituicaoFilter !== option) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { if (instituicaoFilter !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >{option}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'inscricoes' ? (
          <div className="space-y-3">
            {inscricoesData.map((inscricao) => (
              <div
                key={inscricao.id}
                className="rounded-lg"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'; }}
                onClick={() => setShowDetalhesCaptacao(true)}
              >
                <div className="flex items-center gap-6">
                  {/* Conteúdo em grid de colunas */}
                  <div
                    className="flex-1"
                    style={{ display: 'grid', gridTemplateColumns: '2.8fr 1.6fr 1.5fr 1.9fr 1fr', gap: '24px' }}
                  >

                    {/* Edital */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Edital
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.edital}
                      </div>
                    </div>

                    {/* Proponente */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Proponente
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.proponente}
                      </div>
                    </div>

                    {/* Data de Envio */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Data de Envio
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.dataEnvio}
                      </div>
                    </div>

                    {/* Área */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Área
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.setor}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Status
                      </div>
                      <div
                        className="inline-block rounded-full px-3 py-1"
                        style={{
                          backgroundColor: `${getStatusColor(inscricao.status)}20`,
                          border: `1px solid ${getStatusColor(inscricao.status)}`,
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: getStatusColor(inscricao.status)
                        }}
                      >
                        {inscricao.status}
                      </div>
                    </div>

                  </div>

                  {/* Ícone de seta */}
                  <div className="flex items-center justify-center">
                    <ChevronRight className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'avaliacao' ? (
          <div className="space-y-3">
            {avaliacaoData.map((item) => (
              <div
                key={item.id}
                className="rounded-lg"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'; }}
                onClick={() => setShowDetalhesCaptacao(true)}
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1.2fr 1.4fr 1fr', gap: '24px' }}>
                    {/* Avaliador */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Avaliador</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>{item.avaliador}</div>
                    </div>
                    {/* Edital */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Edital</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>{item.edital}</div>
                    </div>
                    {/* Data de Envio */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Data de Envio</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>{item.dataEnvio}</div>
                    </div>
                    {/* Data de Avaliação */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Data de Avaliação</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: item.dataAvaliacao === '—' ? 'rgba(255,255,255,0.3)' : '#ffffff' }}>{item.dataAvaliacao}</div>
                    </div>
                    {/* Área */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Área</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>{item.area}</div>
                    </div>
                    {/* Status */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Status</div>
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: `${getStatusColor(item.status)}20`,
                          border: `1px solid ${getStatusColor(item.status)}`,
                          borderRadius: '999px',
                          padding: '2px 10px',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Lista de Inscrições */
          <div className="space-y-3">
            {inscricoesData.map((inscricao) => (
              <div
                key={inscricao.id}
                className="rounded-lg"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'; }}
                onClick={() => setShowDetalhesCaptacao(true)}
              >
                <div className="flex items-center gap-6">
                  {/* Conteúdo em grid de colunas */}
                  <div
                    className="flex-1"
                    style={{ display: 'grid', gridTemplateColumns: '2.8fr 1.6fr 1.5fr 1.9fr 1fr', gap: '24px' }}
                  >

                    {/* Edital */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Edital
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.edital}
                      </div>
                    </div>

                    {/* Proponente */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Proponente
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.proponente}
                      </div>
                    </div>

                    {/* Data de Envio */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Data de Envio
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.dataEnvio}
                      </div>
                    </div>

                    {/* Área */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Área
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                        {inscricao.setor}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        Status
                      </div>
                      <div
                        className="inline-block rounded-full px-3 py-1"
                        style={{
                          backgroundColor: `${getStatusColor(inscricao.status)}20`,
                          border: `1px solid ${getStatusColor(inscricao.status)}`,
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: getStatusColor(inscricao.status)
                        }}
                      >
                        {inscricao.status}
                      </div>
                    </div>

                  </div>

                  {/* Ícone de seta */}
                  <div className="flex items-center justify-center">
                    <ChevronRight className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};