import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, FileText, Users, ClipboardList, ChevronRight, CheckCircle, Plus, Home, FolderOpen, BookOpen, ArrowLeft } from 'lucide-react';
import { FormularioInscricaoGeral } from './FormularioInscricaoGeral';
import { Programa } from './Programa';
import { FormularioPersonalizado } from './FormularioPersonalizado';
import { FormularioEdital } from './FormularioEdital';
import { FormularioAvaliacao } from './FormularioAvaliacao';
import { FormularioRecurso } from './FormularioRecurso';
import { FormularioInstituicaoParceira } from './FormularioInstituicaoParceira';
import { DetalhesCaptacao } from './DetalhesCaptacao';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

interface EditalInscricao {
  id: number;
  edital: string;
  proponente: string;
  dataEnvio: string;
  setor: string;
  status: string;
}

type AreaFilter = 'Todas' | 'Carreira Científica' | 'Pesquisa' | 'Difusão do Conhecimento' | 'Extensão' | 'Inovação' | 'Internacional';
type SetorFilter = 'Todos' | 'Rascunho' | 'Ativo' | 'Finalizado' | 'Enviado' | 'Em Avaliação' | 'Avaliado' | 'Aprovado' | 'Reprovado';
type VinculoFilter = 'Todos' | 'Programa' | 'Parceria';
type ActiveTab = 'dashboard' | 'captacoes' | 'inscricoes' | 'avaliacao' | 'recurso' | 'finalizado';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Enviado': return '#3b82f6';
    case 'Em Avaliação': return '#fbbf24';
    case 'Avaliado': return '#00c1af';
    case 'Aprovado': return '#22c55e';
    case 'Reprovado': return '#ef4444';
    case 'Não Aprovado': return '#ef4444';
    case 'Rascunho': return '#fbbf24';
    case 'Ativo': return '#22c55e';
    case 'Finalizado': return '#a3a3a3';
    // Recurso statuses
    case 'Recebido': return '#fbbf24';
    case 'Recusado': return '#ef4444';
    case 'Aceito': return '#22c55e';
    default: return '#a3a3a3';
  }
};

interface CaptacaoItem {
  id: number;
  codigo: string;
  titulo: string;
  tipo: 'Chamada Pública' | 'Demanda Induzida';
  vinculoTipo: 'Programa' | 'Parceria';
  vinculoNome: string;
  propostasRecebidas: number;
  dataPublicacao: string;
  area: string;
  status: 'Rascunho' | 'Ativo' | 'Finalizado';
}

const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options, placeholder }) => {
  const { T } = useThemeTokens();
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
          backgroundColor: T.bgInput,
          border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          color: T.textPrimary,
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
        <span style={{ color: value ? T.textPrimary : T.iconSubdued }}>
          {value ? options.find(o => o.value === value)?.label : (placeholder || 'Selecione...')}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: T.iconSubdued, flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          }}
        />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)', zIndex: 400, overflow: 'hidden',
          boxShadow: T.shadowMd,
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                backgroundColor: value === opt.value ? T.accentSoft : 'transparent',
                color: value === opt.value ? T.accent : T.textPrimary,
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = T.bgHover; }}
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
  onBack?: () => void;
  kind?: 'captacao' | 'fomento';
}

export const Editais: React.FC<EditaisProps> = ({ isFormularioMode = false, onBack, kind = 'captacao' }) => {
  const { T } = useThemeTokens();
  const isFomento = kind === 'fomento';
  const moduleLabel = isFomento ? 'Fomento' : 'Captação';
  const modulePlural = isFomento ? 'fomentos' : 'captações';
  const createLabel = isFomento ? 'Criar Fomento' : 'Criar Captação';
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFilter, setDataFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('Todas');
  const [setorFilter, setSetorFilter] = useState<SetorFilter>('Todos');
  const [instituicaoFilter, setInstituicaoFilter] = useState<VinculoFilter>('Todos');
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
  const [captacaoSelecionada, setCaptacaoSelecionada] = useState<CaptacaoItem | null>(null);
  const [showCriarPrograma, setShowCriarPrograma] = useState(false);
  const [showCriarEdital, setShowCriarEdital] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('captacoes');
  const [formularioTab, setFormularioTab] = useState<'biblioteca' | 'criados'>('biblioteca');
  const [formularioPesquisa, setFormularioPesquisa] = useState('');
  const [formularioCategoria, setFormularioCategoria] = useState('');

  const areaOptions: AreaFilter[] = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional'];
  const captacaoStatusOptions: SetorFilter[] = ['Todos', 'Rascunho', 'Ativo', 'Finalizado'];
  const propostaStatusOptions: SetorFilter[] = ['Todos', 'Enviado', 'Em Avaliação', 'Avaliado', 'Aprovado', 'Reprovado'];
  const setorOptions = activeTab === 'captacoes' ? captacaoStatusOptions : propostaStatusOptions;
  const instituicaoOptions: VinculoFilter[] = ['Todos', 'Programa', 'Parceria'];

  const captacoesData: CaptacaoItem[] = [
    { id: 1, codigo: 'captacao-1', titulo: 'Bolsas de Pesquisa 2026', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa de Bolsas de Pesquisa 2026', propostasRecebidas: 42, dataPublicacao: '01/03/2026', area: 'Pesquisa', status: 'Ativo' },
    { id: 2, codigo: 'captacao-2', titulo: 'Inovação Tecnológica', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa de Inovação Tecnológica', propostasRecebidas: 18, dataPublicacao: '15/03/2026', area: 'Inovação', status: 'Ativo' },
    { id: 3, codigo: 'captacao-3', titulo: 'Demanda Induzida IFES', tipo: 'Demanda Induzida', vinculoTipo: 'Parceria', vinculoNome: 'Parceria FAPES-IFES', propostasRecebidas: 1, dataPublicacao: '20/03/2026', area: 'Extensão', status: 'Ativo' },
    { id: 4, codigo: 'captacao-4', titulo: 'Desenvolvimento Regional', tipo: 'Chamada Pública', vinculoTipo: 'Parceria', vinculoNome: 'Parceria Desenvolvimento ES', propostasRecebidas: 27, dataPublicacao: '28/02/2026', area: 'Difusão do Conhecimento', status: 'Ativo' },
    { id: 5, codigo: 'captacao-5', titulo: 'Carreira Científica', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa de Carreira Científica', propostasRecebidas: 56, dataPublicacao: '20/01/2026', area: 'Carreira Científica', status: 'Finalizado' },
    { id: 6, codigo: 'captacao-6', titulo: 'Difusão do Conhecimento', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa de Difusão do Conhecimento', propostasRecebidas: 14, dataPublicacao: '05/01/2026', area: 'Internacional', status: 'Rascunho' },
    { id: 7, codigo: 'captacao-7', titulo: 'Pesquisa Aplicada em Saúde', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa de Pesquisa Aplicada em Saúde', propostasRecebidas: 31, dataPublicacao: '10/04/2026', area: 'Pesquisa', status: 'Ativo' },
    { id: 8, codigo: 'captacao-8', titulo: 'Laboratórios Inteligentes', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa Laboratórios Inteligentes', propostasRecebidas: 22, dataPublicacao: '18/04/2026', area: 'Inovação', status: 'Ativo' },
    { id: 9, codigo: 'captacao-9', titulo: 'Internacionalização Científica', tipo: 'Chamada Pública', vinculoTipo: 'Programa', vinculoNome: 'Programa de Internacionalização Científica', propostasRecebidas: 8, dataPublicacao: '25/04/2026', area: 'Internacional', status: 'Rascunho' },
    { id: 10, codigo: 'captacao-10', titulo: 'Empreendedorismo Capixaba', tipo: 'Demanda Induzida', vinculoTipo: 'Parceria', vinculoNome: 'Parceria FAPES-Findes', propostasRecebidas: 12, dataPublicacao: '02/05/2026', area: 'Extensão', status: 'Ativo' },
  ];
  const statusCaptacaoDashboard = captacaoStatusOptions
    .filter((status): status is CaptacaoItem['status'] => status !== 'Todos')
    .map(status => {
      const captacoes = captacoesData.filter(captacao => captacao.status === status);
      return {
        status,
        captacoes,
        quantidade: captacoes.length,
        propostas: captacoes.reduce((total, captacao) => total + captacao.propostasRecebidas, 0),
      };
    });
  const financeiroCaptacaoDashboard = {
    totalSolicitado: 12840000,
    totalDisponivel: 5000000,
    rubricas: [
      { nome: 'Bolsas', valor: 4280000, quantidade: 64, cor: '#38bdf8' },
      { nome: 'Capital', valor: 3560000, quantidade: 21, cor: '#a78bfa' },
      { nome: 'Custeio', valor: 2870000, quantidade: 34, cor: '#22c55e' },
      { nome: 'Serviços de terceiros', valor: 1490000, quantidade: 18, cor: '#fbbf24' },
      { nome: 'Diárias e passagens', valor: 640000, quantidade: 12, cor: '#fb7185' },
    ],
  };
  const maiorValorRubricaCaptacao = Math.max(...financeiroCaptacaoDashboard.rubricas.map(item => item.valor), 1);
  const bolsasSolicitadasCaptacao = [
    { nome: 'Iniciação Científica', quantidade: 48, valor: 960000 },
    { nome: 'Mestrado', quantidade: 32, valor: 1280000 },
    { nome: 'Doutorado', quantidade: 24, valor: 1440000 },
    { nome: 'BPIG-I', quantidade: 18, valor: 540000 },
    { nome: 'BPIG-II', quantidade: 15, valor: 510000 },
    { nome: 'BPIG-III', quantidade: 12, valor: 456000 },
    { nome: 'BPIG-IV', quantidade: 9, valor: 378000 },
  ];
  const maiorQuantidadeBolsasCaptacao = Math.max(...bolsasSolicitadasCaptacao.map(item => item.quantidade), 1);
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
      <FormularioEdital onBack={() => setShowCriarEdital(false)} scope={kind} />
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
      <DetalhesCaptacao captacao={captacaoSelecionada || undefined} onBack={() => setShowDetalhesCaptacao(false)} kind={kind} />
    );
  }

  // Se estiver em modo Formulário, mostrar automaticamente a tela de Formulário
  if (isFormularioMode || showFormulario) {
    return (
      <div className="flex-1" style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {isFormularioMode && onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: `1px solid ${T.borderSubtle}`,
                    borderRadius: 'var(--radius)',
                    backgroundColor: T.bgCard,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={16} style={{ color: T.textSecondary }} />
                </button>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', flexShrink: 0,
                backgroundColor: T.accentSoft,
                borderRadius: 'var(--radius)',
              }}>
                <Plus size={18} style={{ color: T.accent }} />
              </div>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                  fontWeight: 'var(--font-weight-medium)', color: T.textPrimary,
                  margin: '0 0 4px', lineHeight: '1.4',
                }}>
                  Formulário
                </h1>
                <p style={{
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  color: T.textMuted, margin: 0,
                }}>
                  Selecione um formulário já produzido ou crie um novo.
                </p>
              </div>
            </div>

            {/* Botão Formulário Personalizado */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: T.accent, border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 18px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: T.accentText,
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
          <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, marginBottom: '24px', marginTop: '20px' }} />

          {/* Tab Bar Link */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: `1px solid ${T.borderSubtle}` }}>
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
                color: formularioTab === 'biblioteca' ? '#00c1af' : T.textMuted,
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
                color: formularioTab === 'criados' ? '#00c1af' : T.textMuted,
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
                color: T.textSecondary,
                display: 'block',
                marginBottom: '6px',
              }}>
                Pesquisar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={formularioPesquisa}
                  onChange={(e) => setFormularioPesquisa(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: T.bgInput,
                    border: `1px solid ${T.borderDefault}`,
                    borderRadius: 'var(--radius)',
                    padding: '10px 38px 10px 14px',
                    color: T.textPrimary,
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = T.accent; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = T.borderDefault; }}
                />
                <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
              </div>
            </div>
            <div>
              <label style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: T.textSecondary,
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
              {/* Card — Template - Formulário de Submissão */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accent;
                  e.currentTarget.style.backgroundColor = T.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.borderSubtle;
                  e.currentTarget.style.backgroundColor = T.bgCard;
                }}
                onClick={() => setShowFormularioGeral(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: T.textPrimary,
                    margin: '0 0 6px',
                  }}>
                    Template - Formulário de Submissão
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: T.textMuted, margin: 0,
                  }}>
                    Clique para acessar o formulário de submissão
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: T.iconSubdued, flexShrink: 0 }} />
              </button>

              {/* Card — Template - Formulário de Avaliação */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accent;
                  e.currentTarget.style.backgroundColor = T.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.borderSubtle;
                  e.currentTarget.style.backgroundColor = T.bgCard;
                }}
                onClick={() => setShowFormularioAvaliacao(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: T.textPrimary,
                    margin: '0 0 6px',
                  }}>
                    Template - Formulário de Avaliação
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: T.textMuted, margin: 0,
                  }}>
                    Clique para acessar o formulário de avaliação
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: T.iconSubdued, flexShrink: 0 }} />
              </button>

              {/* Card — Template - Formulário de Recurso */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accent;
                  e.currentTarget.style.backgroundColor = T.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.borderSubtle;
                  e.currentTarget.style.backgroundColor = T.bgCard;
                }}
                onClick={() => setShowFormularioRecurso(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: T.textPrimary,
                    margin: '0 0 6px',
                  }}>
                    Template - Formulário de Recurso
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: T.textMuted, margin: 0,
                  }}>
                    Clique para acessar o formulário de recurso
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: T.iconSubdued, flexShrink: 0 }} />
              </button>

              {/* Card — Template - Instituição Parceira */}
              <button
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: '10px', padding: '24px 28px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accent;
                  e.currentTarget.style.backgroundColor = T.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.borderSubtle;
                  e.currentTarget.style.backgroundColor = T.bgCard;
                }}
                onClick={() => setShowFormularioInstituicaoParceira(true)}
              >
                <div>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: T.textPrimary,
                    margin: '0 0 6px',
                  }}>
                    Template - Instituição Parceira
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: T.textMuted, margin: 0,
                  }}>
                    Clique para acessar o formulário de instituição parceira
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: T.iconSubdued, flexShrink: 0 }} />
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">

        {/* Título */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '36px', height: '36px', backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
                <ClipboardList size={20} style={{ color: T.accent }} />
              </div>
              <div style={{ flex: 1, marginTop: '6px' }}>
                <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, lineHeight: '1.5' }}>
                  {moduleLabel}
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: '1.5' }}>
                  Acompanhe as configurações e instâncias de {modulePlural}
                </p>
              </div>
            </div>

            {/* Botão Nova Captação/Fomento */}
            <button
              onClick={() => setShowCriarEdital(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: T.accent, border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 18px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: T.accentText,
                cursor: 'pointer', transition: 'background-color 0.2s', flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
            >
              <Plus size={16} />
              {createLabel}
            </button>
          </div>
        </div>

        {/* Tab Bar Link */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {(['captacoes', 'dashboard'] as ActiveTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'dashboard' ? 'Dashboard' : isFomento ? 'Fomentos' : 'Captações';
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSetorFilter('Todos');
                  }}
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
                    color: isActive ? '#00c1af' : T.textMuted,
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.textPrimary; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.textMuted; }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, marginTop: '-1px' }} />
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: isFomento ? 'Total de Fomentos' : `Total de ${modulePlural}`, value: '10', Icon: ClipboardList },
                { label: isFomento ? 'Ativos' : 'Ativas', value: '7', Icon: FileText },
                { label: 'Propostas recebidas', value: '158', Icon: Users },
                { label: 'Finalizadas', value: '1', Icon: CheckCircle },
              ].map(({ label, value, Icon }) => (
                <div key={label} style={{ backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: T.accentSoft, borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} style={{ color: T.accent }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, fontWeight: 'var(--font-weight-normal)' }}>{label}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: T.textPrimary, lineHeight: 1, textAlign: 'center' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '22px' }}>
              <div style={{
                border: `1px solid ${T.borderSubtle}`,
                borderRadius: '8px',
                backgroundColor: T.bgSurfaceMuted,
                padding: '18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)' }}>
                    Totais solicitados por rubrica
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                    {financeiroCaptacaoDashboard.rubricas.length} rubrica(s)
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {financeiroCaptacaoDashboard.rubricas.map(rubrica => {
                    const percentual = Math.round((rubrica.valor / maiorValorRubricaCaptacao) * 100);

                    return (
                      <div key={rubrica.nome}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 110px', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                            {rubrica.nome}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.accent, textAlign: 'right' }}>
                            {formatCurrency(rubrica.valor)}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, textAlign: 'right' }}>
                            {rubrica.quantidade} projeto(s)
                          </div>
                        </div>
                        <div style={{ height: '7px', borderRadius: '999px', backgroundColor: T.borderSubtle, overflow: 'hidden' }}>
                          <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: T.accent }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{
              border: `1px solid ${T.borderSubtle}`,
              borderRadius: '8px',
              backgroundColor: T.bgSurfaceMuted,
              padding: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)' }}>
                  Tipos de bolsas solicitadas
                </div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                  {bolsasSolicitadasCaptacao.length} modalidade(s)
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {bolsasSolicitadasCaptacao.map(bolsa => {
                  const percentual = Math.round((bolsa.quantidade / maiorQuantidadeBolsasCaptacao) * 100);

                  return (
                    <div key={bolsa.nome}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 120px', gap: '12px', alignItems: 'center', marginBottom: '7px' }}>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                          {bolsa.nome}
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, textAlign: 'right' }}>
                          {formatCurrency(bolsa.valor)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, textAlign: 'right' }}>
                          {bolsa.quantidade} bolsa(s)
                        </div>
                      </div>
                      <div style={{ height: '7px', borderRadius: '999px', backgroundColor: T.borderSubtle, overflow: 'hidden' }}>
                        <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: T.accent }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        {activeTab !== 'dashboard' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isFomento ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)', gap: '16px' }}>
            {/* Pesquisar */}
            <div>
              <label htmlFor="search-input" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Pesquisar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', padding: '10px 36px 10px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' }}
                />
                <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
              </div>
            </div>

            {/* Data */}
            <div>
              <label htmlFor="date-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Data
              </label>
              <input
                id="date-filter"
                type="text"
                placeholder="dd/mm/yyyy"
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                style={{ width: '100%', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', padding: '10px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {!isFomento && (
            <div style={{ position: 'relative' }}>
              <label htmlFor="area-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Área
              </label>
              <button
                id="area-filter"
                onClick={() => { setShowAreaDropdown(!showAreaDropdown); setShowSetorDropdown(false); setShowInstituicaoDropdown(false); }}
                style={{ width: '100%', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', padding: '10px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span>{areaFilter}</span>
                <ChevronDown size={16} style={{ color: T.textSecondary }} />
              </button>
              {showAreaDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px', backgroundColor: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100 }}>
                  {areaOptions.map((option) => (
                    <button key={option} onClick={() => { setAreaFilter(option); setShowAreaDropdown(false); }}
                      style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: areaFilter === option ? T.accentSoft : 'transparent', color: areaFilter === option ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { if (areaFilter !== option) e.currentTarget.style.backgroundColor = T.bgHover; }}
                      onMouseLeave={(e) => { if (areaFilter !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >{option}</button>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Status */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="status-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Status
              </label>
              <button
                id="status-filter"
                onClick={() => { setShowSetorDropdown(!showSetorDropdown); setShowAreaDropdown(false); setShowInstituicaoDropdown(false); }}
                style={{ width: '100%', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', padding: '10px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span>{setorFilter}</span>
                <ChevronDown size={16} style={{ color: T.textSecondary }} />
              </button>
              {showSetorDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px', backgroundColor: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100 }}>
                  {setorOptions.map((option) => (
                    <button key={option} onClick={() => { setSetorFilter(option); setShowSetorDropdown(false); }}
                      style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: setorFilter === option ? T.accentSoft : 'transparent', color: setorFilter === option ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { if (setorFilter !== option) e.currentTarget.style.backgroundColor = T.bgHover; }}
                      onMouseLeave={(e) => { if (setorFilter !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >{option}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Instituição */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="category-filter" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-normal)' }}>
                Vínculo
              </label>
              <button
                id="category-filter"
                onClick={() => { setShowInstituicaoDropdown(!showInstituicaoDropdown); setShowAreaDropdown(false); setShowSetorDropdown(false); }}
                style={{ width: '100%', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', padding: '10px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span>{instituicaoFilter}</span>
                <ChevronDown size={16} style={{ color: T.textSecondary }} />
              </button>
              {showInstituicaoDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px', backgroundColor: T.bgSurface, border: `1px solid ${T.borderSubtle}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100 }}>
                  {instituicaoOptions.map((option) => (
                    <button key={option} onClick={() => { setInstituicaoFilter(option); setShowInstituicaoDropdown(false); }}
                      style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: instituicaoFilter === option ? T.accentSoft : 'transparent', color: instituicaoFilter === option ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => { if (instituicaoFilter !== option) e.currentTarget.style.backgroundColor = T.bgHover; }}
                      onMouseLeave={(e) => { if (instituicaoFilter !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >{option}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Tab Content */}
        {activeTab === 'dashboard' ? null : activeTab === 'captacoes' ? (
          <div className="space-y-3">
            {captacoesData
              .filter((captacao) => {
                const query = searchTerm.toLowerCase();
                const matchSearch = !query || `${captacao.titulo} ${captacao.vinculoNome}`.toLowerCase().includes(query);
                const matchArea = isFomento || areaFilter === 'Todas' || captacao.area === areaFilter;
                const matchVinculo = instituicaoFilter === 'Todos' || captacao.vinculoTipo === instituicaoFilter;
                const matchStatus = setorFilter === 'Todos' || captacao.status === setorFilter;
                return matchSearch && matchArea && matchVinculo && matchStatus;
              })
              .map((captacao) => (
                <div
                  key={captacao.id}
                  className="rounded-lg"
                  style={{
                    backgroundColor: T.bgCard,
                    border: `1px solid ${T.borderSubtle}`,
                    padding: '20px',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.bgHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.bgCard; }}
                  onClick={() => {
                    setCaptacaoSelecionada(captacao);
                    setShowDetalhesCaptacao(true);
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className="flex-1"
                      style={{ display: 'grid', gridTemplateColumns: isFomento ? '2.1fr 1.2fr 1.2fr 1fr 1fr' : '2.1fr 1.2fr 2fr 1.2fr 1fr 1fr', gap: '20px', alignItems: 'center' }}
                    >
                      <div>
                        <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                          {moduleLabel}
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)' }}>
                          {captacao.titulo}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                          Tipo
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                          {captacao.tipo}
                        </div>
                      </div>

                      {!isFomento && (
                      <div>
                        <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                          {captacao.vinculoTipo}
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                          {captacao.vinculoNome}
                        </div>
                      </div>
                      )}

                      <div>
                        <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                          Publicação
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                          {captacao.dataPublicacao}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                          Propostas
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                          {captacao.propostasRecebidas}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}>
                          Status
                        </div>
                        <div
                          className="inline-block rounded-full px-3 py-1"
                          style={{
                            backgroundColor: `${getStatusColor(captacao.status)}20`,
                            border: `1px solid ${getStatusColor(captacao.status)}`,
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: getStatusColor(captacao.status)
                          }}
                        >
                          {captacao.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-6 h-6" style={{ color: T.textMuted }} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : activeTab === 'inscricoes' ? (
          <div className="space-y-3">
            {inscricoesData.map((inscricao) => (
              <div
                key={inscricao.id}
                className="rounded-lg"
                style={{
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  padding: '20px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.bgHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.bgCard; }}
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
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Edital
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.edital}
                      </div>
                    </div>

                    {/* Proponente */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Proponente
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.proponente}
                      </div>
                    </div>

                    {/* Data de Envio */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Data de Envio
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.dataEnvio}
                      </div>
                    </div>

                    {/* Área */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Área
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.setor}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
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
                    <ChevronRight className="w-6 h-6" style={{ color: T.textMuted }} />
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
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  padding: '20px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = T.bgHover; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.bgCard; }}
                onClick={() => setShowDetalhesCaptacao(true)}
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1.2fr 1.4fr 1fr', gap: '24px' }}>
                    {/* Avaliador */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Avaliador</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>{item.avaliador}</div>
                    </div>
                    {/* Edital */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Edital</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>{item.edital}</div>
                    </div>
                    {/* Data de Envio */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Data de Envio</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>{item.dataEnvio}</div>
                    </div>
                    {/* Data de Avaliação */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Data de Avaliação</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: item.dataAvaliacao === '—' ? T.iconSubdued : T.textPrimary }}>{item.dataAvaliacao}</div>
                    </div>
                    {/* Área */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Área</div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>{item.area}</div>
                    </div>
                    {/* Status */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Status</div>
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
                  <ChevronRight size={20} style={{ color: T.iconSubdued, flexShrink: 0 }} />
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
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.borderSubtle}`,
                  padding: '20px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.bgHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.bgCard; }}
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
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Edital
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.edital}
                      </div>
                    </div>

                    {/* Proponente */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Proponente
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.proponente}
                      </div>
                    </div>

                    {/* Data de Envio */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Data de Envio
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.dataEnvio}
                      </div>
                    </div>

                    {/* Área */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
                      >
                        Área
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>
                        {inscricao.setor}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div
                        className="mb-1"
                        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted }}
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
                    <ChevronRight className="w-6 h-6" style={{ color: T.textMuted }} />
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
