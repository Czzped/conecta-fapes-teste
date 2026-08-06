import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Moon, Bell, Globe, User, Sun, Monitor, X, Search, CheckCircle, AlertTriangle, AlertCircle, RotateCcw, ChevronRight, ChevronLeft, DollarSign, Calendar, ChevronDown, Home, FileText, Info, Plus, FolderOpen, Clock, Eye, Handshake, BookOpen, LayoutDashboard, CreditCard, ClipboardCheck, Settings, Inbox, Landmark, Building2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import conectaSymbol from 'figma:asset/db135b6708f6cc7f72f27c6a31dd02aa5500d030.png';
import fapesLogo from 'figma:asset/affecf58de5f5168c562fa312b9d450b8432233b.png';
import { Editais } from './Editais';
import { EditaisLight } from './EditaisLight';
import { Programa } from './Programa';
import { Parceria } from './Parceria';
import { PlanejamentoEstrategico } from './PlanejamentoEstrategico';
import { Instituicoes } from './Instituicoes';
import { Configuracoes } from './Configuracoes';
import { CalendarioFolha } from './CalendarioFolha';
import { ControleAcessos } from './ControleAcessos';
import { BackofficeDatePicker } from './BackofficeDatePicker';
import { PessoasFisicas } from './PessoasFisicas';
import { Rubricas } from './Rubricas';
import { ReferenciasCorporativas } from './ReferenciasCorporativas';
import { DocumentosExigidos } from './DocumentosExigidos';
import { SurveyFormBuilder } from './SurveyFormBuilder';
import { CaixaEntrada } from './CaixaEntrada';
import { AcaoTransversalFinanceiro } from './AcaoTransversalFinanceiro';
import { RegrasAcaoTransversal } from './RegrasAcaoTransversal';
import { Iniciativas } from './Iniciativas';
import { ThemeProvider } from '../theme/ThemeContext';
import { PAGE_TO_PATH, DEFAULT_PAGE, pathToPage, detalhesIdFromPath } from '../routing/paths';

interface DashboardProps {
  onLogout: () => void;
}

type Theme = 'light' | 'dark' | 'auto';
type Contrast = 'normal' | 'high' | 'maximum';
type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type Language = 'pt' | 'en' | 'es';
type NotificationTab = 'avisos' | 'editais';
type ActivePage = 'home' | 'dashboard' | 'caixa-entrada' | 'financeira' | 'pagamento' | 'contabilidade-financeiro' | 'detalhes' | 'fomento' | 'editais' | 'editais-light' | 'planejamento' | 'programa' | 'parceria' | 'formulario' | 'instituicoes' | 'iniciativas' | 'rubricas' | 'configuracoes' | 'pessoas' | 'referencias' | 'documentos' | 'regras-acao-transversal' | 'calendario-folha' | 'controle-acessos';
type StatusFilter = 'Todos' | 'Pendente' | 'Em Validação' | 'Validado' | 'Revisar' | 'Reprovado' | 'Contestada';
type CategoriaFilter = 'Todos' | 'Material Permanente' | 'Material de Consumo' | 'Passagem' | 'Diária' | 'Pessoa Física' | 'Pessoa Jurídica';
type ProjetoFilter = 'Todos' | 'Conecta Fapes' | 'Outro Projeto Exemplo' | 'Mais um Projeto Exemplo';

type PagamentoCategoria = Exclude<CategoriaFilter, 'Todos'>;
type PagamentoVariante = 'passagem' | 'nota-fiscal' | 'invoice';

interface PagamentoCard {
  id: number;
  tipo: 'Boleto' | 'Pix';
  operacao: 'Débito' | 'Crédito';
  valor: string;
  data: string;
  categoria: PagamentoCategoria;
  variante: PagamentoVariante;
  projeto: string;
  status: StatusFilter;
}

interface Passageiro {
  id: number;
  nome: string;
  valor: string;
  localizador: string;
  emissao: string;
}

interface Viagem {
  origem: string;
  saida: string;
  horaSaida: string;
  destino: string;
  chegada: string;
  horaChegada: string;
}

interface CotacaoItem {
  file: string;
  fornecedor: string;
  valor: string;
  data: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showNotificationsSidebar, setShowNotificationsSidebar] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  // Roteamento por URL: `activePage` deriva do caminho e `setActivePage` navega.
  // Assim os ~40 pontos de navegação existentes seguem inalterados.
  const location = useLocation();
  const navigate = useNavigate();
  const detalhesId = detalhesIdFromPath(location.pathname);
  const activePage = (detalhesId ? 'detalhes' : pathToPage(location.pathname) ?? DEFAULT_PAGE) as ActivePage;
  const setActivePage = (page: ActivePage) => {
    // 'detalhes' depende do id do pagamento: quem navega é setSelectedPagamento.
    if (page === 'detalhes') return;
    navigate(PAGE_TO_PATH[page] ?? '/');
  };
  const [pageVersion, setPageVersion] = useState(0);
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('conecta-theme');
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? (saved as Theme) : 'dark';
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('conecta-theme', theme);
    }
  }, [theme]);
  const [contrast, setContrast] = useState<Contrast>('normal');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [language, setLanguage] = useState<Language>('pt');
  const [notificationTab, setNotificationTab] = useState<NotificationTab>('avisos');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);
  
  // Filtros da página Financeira
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Em Validação');
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaFilter>('Todos');
  const [projetoFilter, setProjetoFilter] = useState<ProjetoFilter>('Todos');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoriaDropdown, setShowCategoriaDropdown] = useState(false);
  const [showProjetoDropdown, setShowProjetoDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para observação
  const [observacao, setObservacao] = useState('');
  const maxObservacaoLength = 500;
  
  // Estados para avaliação
  const [statusAvaliacao, setStatusAvaliacao] = useState<'validado' | 'revisar' | 'reprovado' | null>(null);
  const [motivoRevisao, setMotivoRevisao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  // Mock data para os cards de pagamento
  const [pagamentosData, setPagamentosData] = useState<PagamentoCard[]>([
    { id: 1, tipo: 'Boleto', operacao: 'Débito', valor: 'R$ 3.456,70', data: '27/02/2026 - 09:35', categoria: 'Material Permanente', variante: 'nota-fiscal', projeto: 'Conecta Fapes', status: 'Em Validação' },
    { id: 2, tipo: 'Pix', operacao: 'Débito', valor: 'R$ 4.567,90', data: '25/02/2026 - 10:05', categoria: 'Material de Consumo', variante: 'invoice', projeto: 'Outro Projeto', status: 'Em Validação' },
    { id: 3, tipo: 'Pix', operacao: 'Crédito', valor: 'R$ 789,00', data: '23/02/2026 - 12:50', categoria: 'Passagem', variante: 'passagem', projeto: 'Mais um Projeto', status: 'Em Validação' },
    { id: 4, tipo: 'Boleto', operacao: 'Débito', valor: 'R$ 2.100,00', data: '22/02/2026 - 11:20', categoria: 'Material de Consumo', variante: 'nota-fiscal', projeto: 'Conecta Fapes', status: 'Revisar' },
    { id: 5, tipo: 'Boleto', operacao: 'Débito', valor: 'R$ 1.890,50', data: '20/02/2026 - 11:45', categoria: 'Passagem', variante: 'passagem', projeto: 'Outro Projeto', status: 'Em Validação' },
    { id: 6, tipo: 'Boleto', operacao: 'Débito', valor: 'R$ 2.345,60', data: '19/02/2026 - 17:25', categoria: 'Pessoa Jurídica', variante: 'nota-fiscal', projeto: 'Mais um Projeto', status: 'Reprovado' },
    { id: 7, tipo: 'Pix', operacao: 'Débito', valor: 'R$ 567,80', data: '18/02/2026 - 16:45', categoria: 'Diária', variante: 'nota-fiscal', projeto: 'Conecta Fapes', status: 'Em Validação' },
    { id: 8, tipo: 'Pix', operacao: 'Crédito', valor: 'R$ 2.567,30', data: '15/02/2026 - 16:00', categoria: 'Material Permanente', variante: 'nota-fiscal', projeto: 'Conecta Fapes', status: 'Contestada' },
    { id: 9, tipo: 'Pix', operacao: 'Débito', valor: 'R$ 5.234,20', data: '14/02/2026 - 08:40', categoria: 'Material de Consumo', variante: 'invoice', projeto: 'Outro Projeto', status: 'Em Validação' },
    { id: 10, tipo: 'Boleto', operacao: 'Débito', valor: 'R$ 3.690,00', data: '12/02/2026 - 08:15', categoria: 'Passagem', variante: 'passagem', projeto: 'Mais um Projeto', status: 'Em Validação' },
  ]);

  // Pagamento da tela de detalhes: derivado do id na URL (/financeira/:id), o que
  // faz deep-link e refresh funcionarem. `setSelectedPagamento` passa a navegar.
  // Declarado aqui (antes dos efeitos que o consomem) para evitar uso antes da
  // inicialização.
  const selectedPagamento = detalhesId
    ? pagamentosData.find((p) => String(p.id) === detalhesId) ?? null
    : null;
  const setSelectedPagamento = (pagamento: PagamentoCard | null) => {
    if (pagamento) navigate(`/financeira/${pagamento.id}`);
    // null: a saída da tela já é feita por setActivePage('financeira')
  };

  // Id inexistente na URL volta para a lista.
  useEffect(() => {
    if (detalhesId && !selectedPagamento) navigate('/financeira', { replace: true });
  }, [detalhesId, selectedPagamento, navigate]);

  // Pré-preenche a Avaliação Fapes quando a prestação já está em Revisar
  React.useEffect(() => {
    if (selectedPagamento?.status === 'Revisar') {
      setStatusAvaliacao('revisar');
      setMotivoRevisao('Está faltando um comprovante');
      setJustificativa('teste de avaliação');
    } else if (selectedPagamento?.status === 'Reprovado') {
      setStatusAvaliacao('reprovado');
      setMotivoRevisao('Cotação enviada não está adequada');
      setJustificativa('A cotação de menor valor não corresponde ao item adquirido.');
    } else {
      setStatusAvaliacao(null);
      setMotivoRevisao('');
      setJustificativa('');
    }
  }, [selectedPagamento]);
  const [showMotivoDropdown, setShowMotivoDropdown] = useState(false);
  const [showConfirmacaoModal, setShowConfirmacaoModal] = useState(false);
  const [showCadastrarMotivoModal, setShowCadastrarMotivoModal] = useState(false);
  const [novoMotivo, setNovoMotivo] = useState('');
  const maxNovoMotivoLength = 50;
  
  // Estados para seleção em lote
  const [selectedPagamentos, setSelectedPagamentos] = useState<number[]>([]);
  const [showValidarLoteModal, setShowValidarLoteModal] = useState(false);

  // Estados do detalhe da prestação (cotação e passageiros)
  const [cotacaoSelecionada, setCotacaoSelecionada] = useState('Cotacao_Loja_A.pdf');
  const [cotacaoExpandida, setCotacaoExpandida] = useState<string | null>('Cotacao_Loja_A.pdf');
  const [passageiros] = useState<Passageiro[]>([
    { id: 1, nome: 'Ana Beatriz Costa', valor: 'R$ 1.280,00', localizador: 'ABX9F2', emissao: '10/02/2026' },
    { id: 2, nome: 'Carlos Henrique Dias', valor: 'R$ 1.280,00', localizador: 'ABX9F3', emissao: '10/02/2026' },
  ]);
  const viagem: Viagem = { origem: 'Vitória – ES', saida: '18/02/2026', horaSaida: '08:15', destino: 'São Paulo – SP', chegada: '18/02/2026', horaChegada: '09:55' };

  const languageNames = {
    pt: 'Português',
    en: 'Inglês',
    es: 'Espanhol'
  };

  /* ── Design tokens derivados do tema ─────────────────────────── */
  const isLight = theme === 'light';
  const T = {
    bgPage:           isLight ? '#fafafa'                 : '#0a0a0a',
    bgSidebar:        isLight ? '#ffffff'                 : 'rgba(23, 23, 23, 0.96)',
    sidebarBorder:    isLight ? '#e5e5e5'                 : 'rgba(255, 255, 255, 0.1)',
    bgHeader:         isLight ? 'rgba(255,255,255,0.92)'  : 'rgba(23, 23, 23, 0.82)',
    headerBorder:     isLight ? '#e5e5e5'                 : 'rgba(255, 255, 255, 0.1)',
    iconColor:        isLight ? '#525252'                 : '#ffffff',
    textPrimary:      isLight ? '#171717'                 : '#ffffff',
    textSecondary:    isLight ? '#525252'                 : 'rgba(255, 255, 255, 0.7)',
    textMuted:        isLight ? '#a3a3a3'                 : 'rgba(255, 255, 255, 0.5)',
    toggleBorder:     isLight ? '#e5e5e5'                 : 'rgba(255, 255, 255, 0.2)',
    menuActiveBg:     isLight ? '#f0fdfa'                 : 'rgba(255, 255, 255, 0.1)',
    menuActiveText:   '#00c1af',
    menuInactiveText: isLight ? '#525252'                 : 'rgba(255, 255, 255, 0.7)',
    dropdownBg:       isLight ? '#ffffff'                 : 'rgba(38, 38, 38, 0.95)',
    dropdownBorder:   isLight ? '#e5e5e5'                 : 'rgba(255, 255, 255, 0.1)',
    dropdownText:     isLight ? '#171717'                 : '#ffffff',
    hoverClass:       isLight ? 'hover:bg-black/5'        : 'hover:bg-white/10',
  } as const;

  const statusOptions: StatusFilter[] = ['Todos', 'Pendente', 'Em Validação', 'Validado', 'Revisar', 'Reprovado', 'Contestada'];
  const categoriaOptions: CategoriaFilter[] = ['Todos', 'Material Permanente', 'Material de Consumo', 'Passagem', 'Diária', 'Pessoa Física', 'Pessoa Jurídica'];
  const projetoOptions: ProjetoFilter[] = ['Todos', 'Conecta Fapes', 'Outro Projeto Exemplo', 'Mais um Projeto Exemplo'];

  const getStatusColor = (status: StatusFilter): string => {
    switch (status) {
      case 'Pendente':
        return '#f97316'; // orange
      case 'Em Validação':
        return '#3b82f6'; // blue
      case 'Validado':
        return '#10b981'; // green
      case 'Revisar':
        return '#f59e0b'; // amber/yellow
      case 'Reprovado':
        return '#ef4444'; // red
      case 'Contestada':
        return '#a855f7'; // purple
      default:
        return '#ffffff';
    }
  };

  // Passo "Cotação" reutilizado pelas 3 variantes do detalhe (Passagem, Nota Fiscal, Invoice)
  const renderCotacao = (stepNumber: number, intro: string, itens: CotacaoItem[]) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>{stepNumber}</div>
        <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Cotação</h2>
      </div>
      <div style={{ marginLeft: '32px' }}>
        <p className="mb-4" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', lineHeight: '1.6' }}>{intro}</p>
        <div className="space-y-3">
          {itens.map((item) => {
            const selected = cotacaoSelecionada === item.file;
            const expanded = cotacaoExpandida === item.file;
            return (
              <div key={item.file} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--dash-input-bg)', border: `1px solid ${expanded ? '#00c1af' : 'var(--dash-card-border)'}`, transition: 'border-color .2s' }}>
                <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setCotacaoExpandida(expanded ? null : item.file)}>
                  <div
                    onClick={(e) => { e.stopPropagation(); setCotacaoSelecionada(item.file); }}
                    className="flex items-center justify-center rounded-full"
                    style={{ width: '20px', height: '20px', border: `2px solid ${selected ? '#00c1af' : 'var(--dash-card-border)'}`, backgroundColor: selected ? '#00c1af' : 'transparent', flexShrink: 0, cursor: 'pointer' }}
                  >
                    {selected && <div className="rounded-full" style={{ width: '8px', height: '8px', backgroundColor: '#ffffff' }} />}
                  </div>
                  <FileText className="w-5 h-5" style={{ color: 'var(--dash-text-secondary)' }} />
                  <span className="flex-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{item.file}</span>
                  <button onClick={(e) => { e.stopPropagation(); toast.info('Visualizar comprovante'); }} title="Visualizar" style={{ background: 'transparent', border: 'none', color: 'var(--dash-icon-subdued)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--dash-icon-subdued)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </div>
                {expanded && (
                  <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--dash-card-border)' }}>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Fornecedor <span style={{ color: '#ef4444' }}>*</span></label>
                        <input readOnly value={item.fornecedor} className="w-full rounded-lg px-4 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                      </div>
                      <div>
                        <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Valor <span style={{ color: '#ef4444' }}>*</span></label>
                        <input readOnly value={item.valor} className="w-full rounded-lg px-4 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Data <span style={{ color: '#ef4444' }}>*</span></label>
                        <div className="relative">
                          <input readOnly value={item.data} className="w-full rounded-lg px-4 py-2 pr-10" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                          <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--dash-icon-subdued)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <ThemeProvider isLight={isLight}>
    <div
      className="min-h-screen"
      data-theme={theme === 'auto' ? 'dark' : theme}
      style={{ backgroundColor: T.bgPage, transition: 'background-color 0.3s' }}
    >
      <style>{`
        .backoffice-sidebar-menu {
          scrollbar-gutter: stable;
        }

        .backoffice-sidebar-menu.collapsed {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .backoffice-sidebar-menu.collapsed::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .backoffice-sidebar-menu.expanded {
          scrollbar-width: thin;
          scrollbar-color: rgba(163, 163, 163, 0.28) transparent;
        }

        .backoffice-sidebar-menu.expanded::-webkit-scrollbar {
          width: 6px;
        }

        .backoffice-sidebar-menu.expanded::-webkit-scrollbar-track {
          background: transparent;
        }

        .backoffice-sidebar-menu.expanded::-webkit-scrollbar-thumb {
          background-color: rgba(163, 163, 163, 0.28);
          border-radius: 999px;
        }
      `}</style>

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out"
        style={{
          width: sidebarExpanded ? '240px' : '80px',
          backgroundColor: T.bgSidebar,
          borderRight: `1px solid ${T.sidebarBorder}`,
          transition: 'width 0.3s ease-in-out, background-color 0.3s, border-color 0.3s',
        }}
      >
        <div className="flex h-full flex-col items-center py-6">
          {/* Logo */}
          <div
            className="mb-6 flex h-12 items-center overflow-hidden"
            style={{
              justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              width: sidebarExpanded ? '180px' : '48px',
            }}
          >
            <img
              src={conectaSymbol}
              alt=""
              aria-hidden="true"
              className="h-10 w-10 object-contain"
            />
            {sidebarExpanded && (
              <span
                className="ml-3"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: T.textPrimary,
                  lineHeight: 1,
                }}
              >
                Conecta
              </span>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className={`flex items-center justify-center rounded-full transition-all duration-200 ${T.hoverClass}`}
            aria-label={sidebarExpanded ? 'Recolher navegação lateral' : 'Expandir navegação lateral'}
            style={{
              width: '32px',
              height: '32px',
              border: `1px solid ${T.toggleBorder}`,
              color: T.iconColor,
              transition: 'color 0.3s, border-color 0.3s',
            }}
          >
            {sidebarExpanded ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {/* Menu */}
          <div
            className={`backoffice-sidebar-menu mt-6 transition-all duration-300 ${sidebarExpanded ? 'expanded w-full px-4' : 'collapsed w-auto'}`}
            style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: 0, flex: '1 1 auto', paddingBottom: '24px' }}
          >
            {/* Seção FOMENTO */}
            {sidebarExpanded && (
              <h3 
                className="mb-3 px-2"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: T.textMuted,
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
              >
                FOMENTO
              </h3>
            )}
            
            {/* Itens do menu FOMENTO */}
            {([
              { key: 'parceria' as ActivePage, Icon: Handshake, label: 'Parceria' },
              { key: 'programa' as ActivePage, Icon: FolderOpen, label: 'Programa' },
              { key: 'fomento' as ActivePage, Icon: BookOpen, label: 'Fomento' },
              { key: 'editais' as ActivePage, Icon: FileText, label: 'Captação' },
              { key: 'iniciativas' as ActivePage, Icon: FolderOpen, label: 'Projetos' },
            ]).map(({ key, Icon, label }, index) => {
              const active = activePage === key;
              return (
                <button
                  key={key}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${index > 0 ? 'mt-2' : ''}`}
                  aria-label={label}
                  style={{
                    backgroundColor: active ? T.menuActiveBg : 'transparent',
                    padding: sidebarExpanded ? '12px 16px' : '12px',
                    width: sidebarExpanded ? '100%' : '48px',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  }}
                  onClick={() => {
                    setActivePage(key);
                    if (key === 'editais' || key === 'fomento') {
                      setPageVersion(version => version + 1);
                    }
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: active ? T.menuActiveText : T.menuInactiveText,
                      flexShrink: 0,
                      transition: 'color 0.3s',
                    }}
                  />
                  {sidebarExpanded && (
                    <span
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: active ? T.menuActiveText : T.menuInactiveText,
                        transition: 'color 0.3s',
                      }}
                    >
                      {label}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Espaçamento entre seções */}
            <div style={{ height: '24px' }} />

            {/* Seção FINANCEIRO */}
            {sidebarExpanded && (
              <h3
                className="mb-3 px-2"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: T.textMuted,
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
              >
                FINANCEIRO
              </h3>
            )}

            {/* Itens do menu FINANCEIRO */}
            {([
              { key: 'contabilidade-financeiro' as ActivePage, Icon: Landmark, label: 'Ação Transversal' },
            ]).map(({ key, Icon, label }, index) => {
              const active = activePage === key;
              return (
                <button
                  key={key}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${index > 0 ? 'mt-2' : ''}`}
                  aria-label={label}
                  style={{
                    backgroundColor: active ? T.menuActiveBg : 'transparent',
                    padding: sidebarExpanded ? '12px 16px' : '12px',
                    width: sidebarExpanded ? '100%' : '48px',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  }}
                  onClick={() => setActivePage(key)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: active ? T.menuActiveText : T.menuInactiveText,
                      flexShrink: 0,
                      transition: 'color 0.3s',
                    }}
                  />
                  {sidebarExpanded && (
                    <span
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: active ? T.menuActiveText : T.menuInactiveText,
                        transition: 'color 0.3s',
                      }}
                    >
                      {label}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Espaçamento entre seções */}
            <div style={{ height: '24px' }} />
            
            {/* Seção BOLSAS */}
            {sidebarExpanded && (
              <h3 
                className="mb-3 px-2"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: T.textMuted,
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
              >
                BOLSAS
              </h3>
            )}
            
            {/* Pagamento */}
            <button
              className="flex items-center gap-3 rounded-lg transition-all duration-200"
              aria-label="Pagamento"
              style={{
                backgroundColor: activePage === 'pagamento' ? T.menuActiveBg : 'transparent',
                padding: sidebarExpanded ? '12px 16px' : '12px',
                width: sidebarExpanded ? '100%' : '48px',
                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              }}
              onClick={() => setActivePage('pagamento')}
              onMouseEnter={(e) => { if (activePage !== 'pagamento') e.currentTarget.style.backgroundColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={(e) => { if (activePage !== 'pagamento') e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <CreditCard 
                size={20} 
                style={{ 
                  color: activePage === 'pagamento' ? T.menuActiveText : T.menuInactiveText,
                  flexShrink: 0,
                  transition: 'color 0.3s',
                }} 
              />
              {sidebarExpanded && (
                <span
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: activePage === 'pagamento' ? T.menuActiveText : T.menuInactiveText,
                    transition: 'color 0.3s',
                  }}
                >
                  Pagamento
                </span>
              )}
            </button>

            {/* Espaçamento entre seções */}
            <div style={{ height: '24px' }} />

            {/* Seção PRESTAÇÃO DE CONTAS */}
            {sidebarExpanded && (
              <h3 
                className="mb-3 px-2"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: T.textMuted,
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
              >
                PRESTAÇÃO DE CONTAS
              </h3>
            )}

            {([
              { key: 'financeira' as ActivePage, Icon: DollarSign, label: 'Financeira' },
            ]).map(({ key, Icon, label }, index) => {
              const active = activePage === key;
              return (
                <button
                  key={key}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${index > 0 ? 'mt-2' : ''}`}
                  aria-label={label}
                  style={{
                    backgroundColor: active ? T.menuActiveBg : 'transparent',
                    padding: sidebarExpanded ? '12px 16px' : '12px',
                    width: sidebarExpanded ? '100%' : '48px',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  }}
                  onClick={() => setActivePage(key)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: active ? T.menuActiveText : T.menuInactiveText,
                      flexShrink: 0,
                      transition: 'color 0.3s',
                    }}
                  />
                  {sidebarExpanded && (
                    <span
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: active ? T.menuActiveText : T.menuInactiveText,
                        transition: 'color 0.3s',
                      }}
                    >
                      {label}
                    </span>
                  )}
                </button>
              );
            })}

            <div style={{ height: '24px' }} />
            
            {/* Seção CADASTROS */}
            {sidebarExpanded && (
              <h3 
                className="mb-3 px-2"
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: T.textMuted,
                  letterSpacing: '0.05em',
                  transition: 'color 0.3s',
                }}
              >
                CADASTROS
              </h3>
            )}
            
            {/* Itens do menu CADASTROS */}
            {([
              { key: 'instituicoes' as ActivePage, Icon: Building2, label: 'Instituições' },
              { key: 'pessoas' as ActivePage, Icon: UserRound, label: 'Pessoas' },
            ]).map(({ key, Icon, label }, index) => {
              const active = activePage === key;
              return (
                <button
                  key={key}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${index > 0 ? 'mt-2' : ''}`}
                  aria-label={label}
                  style={{
                    backgroundColor: active ? T.menuActiveBg : 'transparent',
                    padding: sidebarExpanded ? '12px 16px' : '12px',
                    width: sidebarExpanded ? '100%' : '48px',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  }}
                  onClick={() => setActivePage(key)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: active ? T.menuActiveText : T.menuInactiveText,
                      flexShrink: 0,
                      transition: 'color 0.3s',
                    }}
                  />
                  {sidebarExpanded && (
                    <span
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: active ? T.menuActiveText : T.menuInactiveText,
                        transition: 'color 0.3s',
                      }}
                    >
                      {label}
                    </span>
                  )}
                </button>
              );
            })}

          </div>
        </div>
      </aside>

      {/* Header */}
      <header 
        className="fixed top-0 right-0 z-50 h-16 transition-all duration-300"
        style={{
          left: sidebarExpanded ? '240px' : '80px',
          backgroundColor: T.bgHeader,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${T.headerBorder}`,
          transition: 'left 0.3s ease-in-out, background-color 0.3s, border-color 0.3s',
        }}
      >
        <div className="flex items-center justify-between gap-4 h-16 px-4 md:px-8">
          <div className="h-9 w-[104px] overflow-hidden" aria-label="FAPES" role="img">
            <img
              src={fapesLogo}
              alt=""
              aria-hidden="true"
              className="h-9 w-auto max-w-none"
              style={{ transform: 'translateX(-36px)' }}
            />
          </div>

          <div className="flex items-center justify-end gap-1">
          {/* Toggle de Tema (Claro/Escuro) */}
          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`p-2 transition-colors rounded-lg ${T.hoverClass}`}
            style={{ color: T.iconColor }}
            title={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
            aria-label={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
          >
            {isLight ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Ícone de Configurações */}
          <button
            onClick={() => {
              setActivePage('configuracoes');
              setShowLanguageDropdown(false);
              setShowUserDropdown(false);
            }}
            className={`p-2 transition-colors rounded-lg ${T.hoverClass}`}
            style={{ color: activePage === 'configuracoes' ? '#00c1af' : T.iconColor }}
            title="Configurações"
            aria-label="Configurações"
          >
            <Settings size={20} />
          </button>

          {/* Ícone de Notificações */}
          <button 
            onClick={() => setShowNotificationsSidebar(true)}
            className={`relative p-2 transition-colors rounded-lg ${T.hoverClass}`}
            style={{ color: T.iconColor }}
            aria-label="Abrir notificações"
          >
            <Bell size={20} />
            <span 
              className="absolute top-1 right-1 flex size-2 items-center justify-center rounded-full"
              style={{ backgroundColor: '#ef4444' }}
            />
          </button>

          {/* Ícone de Idioma */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowLanguageDropdown(!showLanguageDropdown);
                setShowUserDropdown(false);
              }}
              className={`p-2 transition-colors rounded-lg ${T.hoverClass}`}
              style={{ color: T.iconColor }}
              aria-label="Selecionar idioma"
            >
              <Globe size={20} />
            </button>
            
            {/* Dropdown de Idioma */}
            {showLanguageDropdown && (
              <div 
                className="absolute right-0 top-12 w-48 rounded-xl shadow-lg overflow-hidden"
                style={{
                  backgroundColor: T.dropdownBg,
                  border: `1px solid ${T.dropdownBorder}`,
                  boxShadow: isLight
                    ? '0 8px 24px rgba(0,0,0,0.12)'
                    : '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 transition-colors ${T.hoverClass}`}
                    style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: T.dropdownText,
                    }}
                  >
                    <span>{languageNames[lang]}</span>
                    {language === lang && (
                      <div className="size-2 rounded-full" style={{ backgroundColor: '#00c1af' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ícone de Usuário */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowLanguageDropdown(false);
              }}
              className={`p-2 transition-colors rounded-lg ${T.hoverClass}`}
              style={{ color: T.iconColor }}
              aria-label="Abrir menu do usuário"
            >
              <User size={20} />
            </button>
            
            {/* Dropdown de Usuário */}
            {showUserDropdown && (
              <div 
                className="absolute right-0 top-12 w-36 rounded-xl shadow-lg overflow-hidden"
                style={{
                  backgroundColor: T.dropdownBg,
                  border: `1px solid ${T.dropdownBorder}`,
                  boxShadow: isLight
                    ? '0 8px 24px rgba(0,0,0,0.12)'
                    : '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <button
                  onClick={onLogout}
                  className={`w-full px-4 py-3 text-left transition-colors ${T.hoverClass}`}
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    color: T.dropdownText,
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Modal de Acessibilidade */}
      {showAccessibilityModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowAccessibilityModal(false)}
          />
          {/* Drawer lateral direito */}
          <div className="fixed right-0 top-0 bottom-0 flex flex-col"
            style={{ zIndex: 9999, width: '300px', backgroundColor: T.bgSidebar, borderLeft: `1px solid ${T.sidebarBorder}`, boxShadow: '-8px 0 32px rgba(0,0,0,0.25)', transition: 'background-color 0.3s' }}>
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0"
              style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${T.sidebarBorder}` }}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: T.textPrimary, letterSpacing: '0.1em', margin: 0 }}>ACESSIBILIDADE</h2>
              <button onClick={() => setShowAccessibilityModal(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--dash-badge-bg)', color: T.textMuted, cursor: 'pointer', transition: 'background-color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--dash-hover-bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--dash-badge-bg)'; }}>
                <X size={15} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto" style={{ padding: '20px' }}>

              {/* TEMA */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: T.textMuted, letterSpacing: '0.1em', marginBottom: '10px' }}>TEMA</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {([
                    { key: 'light' as Theme, Icon: Sun,     label: 'Claro'  },
                    { key: 'dark'  as Theme, Icon: Moon,    label: 'Escuro' },
                    { key: 'auto'  as Theme, Icon: Monitor, label: 'Auto'   },
                  ]).map(({ key, Icon, label }) => {
                    const active = theme === key;
                    return (
                      <button key={key} onClick={() => setTheme(key)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 8px', borderRadius: '10px', border: active ? '1.5px solid #00c1af' : `1px solid ${T.toggleBorder}`, backgroundColor: active ? '#00c1af' : 'var(--dash-badge-bg)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--dash-hover-bg)'; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--dash-badge-bg)'; }}>
                        <Icon size={20} style={{ color: active ? '#171717' : T.iconColor }} />
                        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', color: active ? '#171717' : T.textPrimary }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CONTRASTE */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: T.textMuted, letterSpacing: '0.1em', marginBottom: '10px' }}>CONTRASTE</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {([
                    { key: 'normal'  as Contrast, label: 'Normal' },
                    { key: 'high'    as Contrast, label: 'Alto'   },
                    { key: 'maximum' as Contrast, label: 'Máximo' },
                  ]).map(({ key, label }) => {
                    const active = contrast === key;
                    return (
                      <button key={key} onClick={() => setContrast(key)}
                        style={{ padding: '12px 8px', borderRadius: '10px', textAlign: 'center', border: active ? '1.5px solid #00c1af' : `1px solid ${T.toggleBorder}`, backgroundColor: active ? '#00c1af' : 'var(--dash-badge-bg)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', color: active ? '#171717' : T.textPrimary, cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--dash-hover-bg)'; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--dash-badge-bg)'; }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAMANHO DA FONTE */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: T.textMuted, letterSpacing: '0.1em', marginBottom: '10px' }}>TAMANHO DA FONTE</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {([
                    { key: 'small'  as FontSize, fs: '13px' },
                    { key: 'medium' as FontSize, fs: '17px' },
                    { key: 'large'  as FontSize, fs: '21px' },
                    { key: 'xlarge' as FontSize, fs: '26px' },
                  ]).map(({ key, fs }) => {
                    const active = fontSize === key;
                    return (
                      <button key={key} onClick={() => setFontSize(key)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '52px', borderRadius: '10px', border: active ? '1.5px solid #00c1af' : `1px solid ${T.toggleBorder}`, backgroundColor: active ? '#00c1af' : 'var(--dash-badge-bg)', fontFamily: 'var(--font-family)', fontSize: fs, fontWeight: 'var(--font-weight-semibold)', color: active ? '#171717' : T.textPrimary, cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--dash-hover-bg)'; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--dash-badge-bg)'; }}>
                        A
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OPÇÕES ADICIONAIS */}
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: T.textMuted, letterSpacing: '0.1em', marginBottom: '12px' }}>OPÇÕES ADICIONAIS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {([
                    { checked: reduceMotion,         onChange: setReduceMotion,         title: 'Reduzir Movimento',           desc: 'Minimiza animações e transições'             },
                    { checked: focusIndicators,       onChange: setFocusIndicators,       title: 'Indicadores de Foco',          desc: 'Destaca elementos focados'                   },
                    { checked: screenReaderOptimized, onChange: setScreenReaderOptimized, title: 'Otimizar para Leitor de Tela', desc: 'Melhora compatibilidade com leitores de tela' },
                  ] as { checked: boolean; onChange: (v: boolean) => void; title: string; desc: string }[]).map((opt, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                      <div onClick={() => opt.onChange(!opt.checked)}
                        style={{ flexShrink: 0, marginTop: '2px', width: '18px', height: '18px', borderRadius: '4px', border: opt.checked ? '1.5px solid #00c1af' : `1.5px solid ${T.toggleBorder}`, backgroundColor: opt.checked ? '#00c1af' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', cursor: 'pointer' }}>
                        {opt.checked && (<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: T.textPrimary, margin: '0 0 3px' }}>{opt.title}</p>
                        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: 0 }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer: Restaurar Padrões */}
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.sidebarBorder}`, flexShrink: 0 }}>
              <button
                onClick={() => { setTheme('dark'); setContrast('normal'); setFontSize('medium'); setReduceMotion(false); setFocusIndicators(false); setScreenReaderOptimized(false); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,193,175,0.35)', backgroundColor: 'rgba(0,193,175,0.06)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.06)'; }}>
                <RotateCcw size={15} />
                Restaurar Padrões
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sidebar de Notificações */}
      {showNotificationsSidebar && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowNotificationsSidebar(false)}
          />
          
          {/* Sidebar */}
          <div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
            style={{ backgroundColor: T.bgSidebar, borderLeft: `1px solid ${T.sidebarBorder}`, transition: 'background-color 0.3s' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: T.textPrimary }}>Notificações</h2>
                  <span className="rounded-full px-3 py-1" style={{ backgroundColor: '#00c1af', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>3 Novas</span>
                </div>
                <button onClick={() => setShowNotificationsSidebar(false)} className={`p-2 transition-colors ${T.hoverClass} rounded-lg`} style={{ color: T.iconColor }}>
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6 relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--dash-icon-subdued)' }} />
                <input type="text" placeholder="Buscar" className="w-full rounded-lg py-3 pl-4 pr-10"
                  style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-2">
                {(['avisos', 'editais'] as NotificationTab[]).map((tab) => (
                  <button key={tab} onClick={() => setNotificationTab(tab)} className="rounded-lg px-4 py-2 transition-all"
                    style={{ backgroundColor: notificationTab === tab ? '#00c1af' : 'var(--dash-badge-bg)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: notificationTab === tab ? '#171717' : 'var(--dash-text-primary)' }}>
                    {tab === 'avisos' ? 'Avisos (1)' : 'Captação (2)'}
                  </button>
                ))}
              </div>

              {/* Notificações */}
              <div className="space-y-4">
                {notificationTab === 'avisos' ? (
                  <>
                    {([
                      { Icon: CheckCircle,   iconColor: '#10b981', title: 'Pagamento do mês de janeiro foi processado', desc: 'Mantenha o seu cadastro sempre atualizado!' },
                      { Icon: AlertTriangle, iconColor: '#f59e0b', title: 'Atualize seus documentos', desc: 'O envio do Diploma de Nível Superior está Pendente.' },
                      { Icon: AlertCircle,   iconColor: '#ef4444', title: 'Manutenção Programada', desc: 'O sistema ficará indisponível nesta sexta-feira das 00:00 às 06:00 para atualizações de segurança.' },
                    ] as { Icon: React.ElementType; iconColor: string; title: string; desc: string }[]).map(({ Icon, iconColor, title, desc }) => (
                      <div key={title} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                        <div className="mb-2 flex items-start gap-3">
                          <Icon size={20} style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <h3 className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>{title}</h3>
                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>{desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { mes: 'FEV', dia: '20', title: 'Inscrições Edital 04/2026',  desc: 'Data limite para submissão de propostas de inovação.' },
                      { mes: 'MAR', dia: '15', title: 'Resultado da captação 27/2025',   desc: 'Divulgação dos projetos aprovados para apoio à publicação.' },
                    ].map(({ mes, dia, title, desc }) => (
                      <div key={title} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div style={{ fontFamily: 'var(--font-family)', fontSize: '10px', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>{mes}</div>
                              <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: '#00c1af' }}>{dia}</div>
                            </div>
                            <div>
                              <h3 className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>{title}</h3>
                              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>{desc}</p>
                            </div>
                          </div>
                          <div className="size-2 rounded-full" style={{ backgroundColor: '#00c1af', flexShrink: 0 }} />
                        </div>
                        <button style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>Ver Edital →</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conteúdo Principal */}
      <div 
        className="pt-16 transition-all duration-300 ease-in-out" 
        style={{
          marginLeft: sidebarExpanded ? '240px' : '80px',
          minHeight: '100vh',
          backgroundColor: T.bgPage,
          transition: 'margin-left 0.3s ease-in-out, background-color 0.3s',
        }}
      >
        {activePage === 'financeira' ? (
          <div className="pt-8 px-8 pb-1">
            {/* Título e Subtítulo */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                {/* Ícone em quadrado */}
                <div 
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: 'var(--radius)'
                  }}
                >
                  <DollarSign 
                    size={20} 
                    className="text-teal-500"
                  />
                </div>
                
                {/* Texto do título e subtítulo */}
                <div className="flex-1" style={{ marginTop: '6px' }}>
                  <h1 
                    className="mb-3"
                    style={{ 
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-md)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--dash-text-primary)',
                      lineHeight: '1.5'
                    }}
                  >
                    Prestação de Contas Financeira
                  </h1>
                  
                  <p 
                    style={{ 
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--dash-text-secondary)',
                      lineHeight: '1.5'
                    }}
                  >
                    Acompanhe a comprovação dos gastos dos projetos
                  </p>
                </div>
              </div>
              
              {/* Divider */}
              <div 
                className="mt-6"
                style={{ 
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'var(--dash-divider)'
                }}
              />
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Projetos ativos', value: '12', Icon: FolderOpen, iconColor: '#14b8a6', iconBg: 'rgba(20,184,166,0.12)' },
                { label: 'Pendente',         value: '8',  Icon: Clock,       iconColor: '#14b8a6', iconBg: 'rgba(20,184,166,0.12)' },
                { label: 'Em Validação',     value: '5',  Icon: Eye,         iconColor: '#14b8a6', iconBg: 'rgba(20,184,166,0.12)'  },
                { label: 'Revisão',          value: '3',  Icon: AlertTriangle,iconColor: '#14b8a6', iconBg: 'rgba(20,184,166,0.12)'  },
              ].map(({ label, value, Icon, iconColor, iconBg }) => (
                <div
                  key={label}
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: 'var(--dash-card-bg)',
                    border: '1px solid var(--dash-card-border)',
                    boxShadow: 'var(--dash-shadow)',
                    transition: 'background-color 0.3s, border-color 0.3s',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: '40px', height: '40px', backgroundColor: iconBg, borderRadius: 'var(--radius)' }}
                    >
                      <Icon size={20} style={{ color: iconColor }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>
                      {label}
                    </p>
                  </div>
                  <p className="text-center" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)', color: 'var(--dash-text-primary)' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Filtros */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-4">
                {/* Campo de Pesquisa + Selecionar Todos */}
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>
                    Pesquisar
                  </label>
                  <div className="relative">
                    <input
                      type="text" placeholder="Buscar"
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg px-4 py-2 pr-10"
                      style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }}
                    />
                    <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--dash-icon-subdued)' }} />
                  </div>
                  <div className="flex items-center gap-3 flex-nowrap mt-5">
                    <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedPagamentos.length === pagamentosData.length && pagamentosData.length > 0}
                        onChange={(e) => { if (e.target.checked) { setSelectedPagamentos(pagamentosData.map(p => p.id)); } else { setSelectedPagamentos([]); } }}
                        className="flex-shrink-0"
                      />
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                        Selecionar todos
                      </span>
                    </label>
                    {selectedPagamentos.length > 0 && (
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', whiteSpace: 'nowrap' }}>
                        ({selectedPagamentos.length} selecionado{selectedPagamentos.length > 1 ? 's' : ''})
                      </span>
                    )}
                    {selectedPagamentos.length > 0 && (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowValidarLoteModal(true); }}
                        className="px-6 py-2 rounded-lg transition-all ml-auto"
                        style={{ backgroundColor: '#00c1af', border: '1px solid #00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                        Validar
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtros de dropdown genéricos */}
                {([
                  { label: 'Projeto',    value: projetoFilter,   options: projetoOptions,   show: showProjetoDropdown,   setShow: setShowProjetoDropdown,   setValue: setProjetoFilter,   others: [setShowDateDropdown, setShowStatusDropdown, setShowCategoriaDropdown] },
                  { label: 'Data',       value: dateFilter,      options: [] as string[],   show: false,                 setShow: () => {},                 setValue: setDateFilter,      others: [] },
                  { label: 'Status',     value: statusFilter,    options: statusOptions,    show: showStatusDropdown,    setShow: setShowStatusDropdown,    setValue: setStatusFilter,    others: [setShowDateDropdown, setShowCategoriaDropdown, setShowProjetoDropdown] },
                  { label: 'Rubrica',    value: categoriaFilter, options: categoriaOptions, show: showCategoriaDropdown, setShow: setShowCategoriaDropdown, setValue: setCategoriaFilter, others: [setShowDateDropdown, setShowStatusDropdown, setShowProjetoDropdown] },
                ] as { label: string; value: string; options: string[]; show: boolean; setShow: (v: boolean) => void; setValue: (v: any) => void; others: ((v: boolean) => void)[] }[]).map(({ label, value, options, show, setShow, setValue, others }) =>
                  label === 'Data' ? (
                    <div key={label} className="relative">
                      <label className="mb-2 block" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Data</label>
                      <div className="relative">
                        <BackofficeDatePicker value={dateFilter} onChange={setDateFilter}
                          style={{ width: '100%', backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', borderRadius: 'var(--radius)', padding: '8px 14px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                      </div>
                    </div>
                  ) : (
                    <div key={label} className="relative">
                      <label className="mb-2 block" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>{label}</label>
                      <button
                        onClick={() => { setShow(!show); others.forEach(fn => fn(false)); }}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-2 transition-all"
                        style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}
                      >
                        <span>{value}</span>
                        <ChevronDown size={18} style={{ color: 'var(--dash-icon-subdued)' }} />
                      </button>
                      {show && (
                        <div className="absolute left-0 top-full mt-1 w-full rounded-lg shadow-lg z-50 overflow-hidden"
                          style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                          {options.map((opt) => (
                            <button key={opt} onClick={() => { setValue(opt); setShow(false); }}
                              className={`flex w-full items-center justify-between px-4 py-3 transition-colors ${T.hoverClass} first:rounded-t-lg last:rounded-b-lg`}
                              style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', textAlign: 'left' }}>
                              <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word' }}>{opt}</span>
                              {value === opt && <div className="size-2 rounded-full flex-shrink-0 ml-2" style={{ backgroundColor: '#00c1af' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Cards de Pagamento */}
            <div className="space-y-3">
              {pagamentosData.map((pagamento) => (
                <div
                  key={pagamento.id}
                  className="rounded-lg p-5 transition-colors"
                  style={{
                    backgroundColor: 'var(--dash-card-bg)',
                    border: '1px solid var(--dash-card-border)',
                    boxShadow: 'var(--dash-shadow)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedPagamentos.includes(pagamento.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (selectedPagamentos.includes(pagamento.id)) {
                          setSelectedPagamentos(selectedPagamentos.filter(id => id !== pagamento.id));
                        } else {
                          setSelectedPagamentos([...selectedPagamentos, pagamento.id]);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0"
                    />
                    
                    {/* Conteúdo do Card */}
                    <div
                      className="flex items-center gap-6 flex-1 cursor-pointer"
                      onClick={() => { setSelectedPagamento(pagamento); setActivePage('detalhes'); }}
                      onMouseEnter={(e) => { (e.currentTarget.parentElement!.parentElement as HTMLElement).style.backgroundColor = isLight ? '#fafafa' : 'rgba(38, 38, 38,0.8)'; }}
                      onMouseLeave={(e) => { (e.currentTarget.parentElement!.parentElement as HTMLElement).style.backgroundColor = 'var(--dash-card-bg)'; }}
                    >
                      <div className="grid grid-cols-5 gap-6 flex-1">
                        {[
                          { label: 'Projeto',       value: pagamento.projeto,   cls: '' },
                          { label: 'Pagamento',     value: pagamento.operacao,  cls: '' },
                          { label: 'Valor',         value: pagamento.valor,     cls: '' },
                          { label: 'Data de Envio', value: pagamento.data,      cls: '' },
                        ].map(({ label, value, cls }) => (
                          <div key={label} className={cls}>
                            <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>{label}</div>
                            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{value}</div>
                          </div>
                        ))}
                        <div className="pl-6">
                          <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>Status</div>
                          <div className="inline-block rounded-full px-3 py-1" style={{ backgroundColor: `${getStatusColor(pagamento.status)}20`, border: `1px solid ${getStatusColor(pagamento.status)}`, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: getStatusColor(pagamento.status) }}>
                            {pagamento.status}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ChevronRight className="w-6 h-6" style={{ color: 'var(--dash-icon-subdued)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Paginação */}
              <div className="flex justify-end mt-10 mb-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 transition-colors"
                    style={{ color: currentPage === 1 ? 'var(--dash-text-muted)' : 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  {[1, 2].map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className="px-4 py-2 rounded-lg transition-all"
                      style={{ backgroundColor: currentPage === page ? '#00c1af' : 'var(--dash-badge-bg)', color: currentPage === page ? '#ffffff' : 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: currentPage === page ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)', minWidth: '40px' }}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(prev => Math.min(2, prev + 1))} disabled={currentPage === 2}
                    className="flex items-center gap-2 px-4 py-2 transition-colors"
                    style={{ color: currentPage === 2 ? 'var(--dash-text-muted)' : 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: currentPage === 2 ? 'not-allowed' : 'pointer' }}>
                    Próximo <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activePage === 'detalhes' && selectedPagamento ? (
          <div className="pt-8 px-8 pb-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <span className="cursor-pointer" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }} onClick={() => setActivePage('financeira')}>Prestação de Contas</span>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--dash-text-muted)' }} />
              <span className="cursor-pointer" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }} onClick={() => setActivePage('financeira')}>Financeira</span>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--dash-text-muted)' }} />
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>Detalhes</span>
            </div>

            {/* Título */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(20, 184, 166, 0.1)', borderRadius: 'var(--radius)' }}>
                <DollarSign size={20} className="text-teal-500" />
              </div>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: 'var(--dash-text-primary)', lineHeight: '1.5' }}>
                Detalhes do Pagamento
              </h1>
            </div>

            {/* Card do Pagamento */}
            <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
              <div className="grid grid-cols-5 gap-6">
                {([
                  { label: 'Projeto',       value: selectedPagamento.projeto,   kind: 'text' },
                  { label: 'Pagamento',     value: selectedPagamento.operacao,  kind: 'text' },
                  { label: 'Valor',         value: selectedPagamento.valor,     kind: 'text' },
                  { label: 'Data de Envio', value: selectedPagamento.data,      kind: 'text' },
                  { label: 'Status',        value: selectedPagamento.status,    kind: 'status' },
                ] as { label: string; value: string; kind: 'text' | 'categoria' | 'status' }[]).map(({ label, value, kind }) => (
                  <div key={label}>
                    <div className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>{label}</div>
                    {kind === 'categoria' ? (
                      <div className="inline-block rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(0,193,175,0.1)', border: '1px solid rgba(0,193,175,0.4)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
                        {value}
                      </div>
                    ) : kind === 'status' ? (
                      <div className="inline-block rounded-full px-3 py-1" style={{ backgroundColor: `${getStatusColor(value as StatusFilter)}20`, border: `1px solid ${getStatusColor(value as StatusFilter)}`, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: getStatusColor(value as StatusFilter) }}>
                        {value}
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Informações Gerais */}
            {selectedPagamento.operacao === 'Crédito' && (
            <div
              className="mt-8 rounded-lg p-6"
              style={{
                backgroundColor: 'var(--dash-card-bg)',
                border: '1px solid var(--dash-card-border)',
                boxShadow: 'var(--dash-shadow)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}
                >
                  1
                </div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>
                  Informações Gerais
                </h2>
              </div>
              <p className="mb-5" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>
                Este valor entrou na conta do projeto. Justifique o que aconteceu e anexe o comprovante.
              </p>

              <div className="space-y-5" style={{ marginLeft: '32px' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>
                      Classificação
                    </label>
                    <input readOnly value={selectedPagamento.id === 3 ? 'Devolução' : 'Estorno'} className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>
                      Associe esse Crédito (entrada) a um Débito (saída).
                    </label>
                    <input readOnly value="Débito · R$ 3.456,70 · 27/02/2026" className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>
                    Descrição
                  </label>
                  <textarea
                    readOnly
                    rows={4}
                    value={selectedPagamento.id === 3 ? 'Valor creditado referente à devolução realizada para a conta do projeto.' : 'Valor creditado referente ao estorno de uma compra realizada no projeto.'}
                    className="w-full rounded-lg px-3 py-3 resize-none"
                    style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none', lineHeight: '1.5' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>
                    Arquivo anexado
                  </label>
                  <div className="rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" style={{ color: 'var(--dash-text-secondary)' }} />
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{selectedPagamento.id === 3 ? 'Comprovante_de_Devolucao.png' : 'Print do E-mail do Estorno.png'}</span>
                    </div>
                    <button onClick={() => toast.info('Visualizar comprovante')} title="Expandir" style={{ background: 'transparent', border: 'none', color: 'var(--dash-icon-subdued)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Contestação (status Contestada) */}
            {selectedPagamento.status === 'Contestada' && (
              <div className="mt-8 rounded-lg p-6" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                <h2 className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Contestação</h2>
                <p className="mb-4" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)' }}>Contestação enviada pelo coordenador em resposta à reprovação. Analise e decida se mantém a reprovação ou valida a prestação.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Data de envio</label>
                    <input readOnly value="12/06/2026" className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Justificativa</label>
                    <textarea readOnly rows={3} value="A cotação anexada foi substituída por documento fiscal atualizado, com os valores corrigidos conforme solicitado pela FAPES." className="w-full rounded-lg px-3 py-3 resize-none" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none', lineHeight: '1.5' }} />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>Anexo</label>
                    <div className="rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" style={{ color: 'var(--dash-text-secondary)' }} />
                        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>Contestacao_Cotacao_Corrigida.pdf</span>
                      </div>
                      <button onClick={() => toast.info('Visualizar contestação')} title="Visualizar" style={{ background: 'transparent', border: 'none', color: 'var(--dash-icon-subdued)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--dash-divider)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setPagamentosData(prev => prev.map(p => p.id === selectedPagamento?.id ? { ...p, status: 'Reprovado' as StatusFilter } : p)); toast.success('Prestação reprovada.'); setTimeout(() => { setActivePage('financeira'); setSelectedPagamento(null); }, 1000); }} className="px-6 py-2 rounded-lg transition-all" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                    Reprovado
                  </button>
                  <button onClick={() => setShowConfirmacaoModal(true)} className="px-6 py-2 rounded-lg transition-all" style={{ backgroundColor: '#00c1af', border: '1px solid #00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
                    Validar
                  </button>
                </div>
              </div>
            )}

            {/* Passo a Passo */}
            <div 
              className="hidden"
              style={{
                backgroundColor: 'var(--dash-card-bg)',
                border: '1px solid var(--dash-card-border)',
                boxShadow: 'var(--dash-shadow)',
              }}
            >
              <div className="space-y-6">
              {selectedPagamento.variante === 'passagem' ? (
                <>
                  {/* Passo 1: Descrição */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>1</div>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Descrição</h2>
                    </div>
                    <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>Motivo e detalhes da viagem informados na prestação.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)', marginLeft: '32px' }}>
                      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', lineHeight: '1.6' }}>Viagem para participação no workshop de acompanhamento de projetos em São Paulo, conforme cronograma aprovado no edital. Deslocamento ida e volta no mesmo dia.</p>
                    </div>
                  </div>

                  {/* Passo 2: Anexos da Passagem */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>2</div>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Anexos da Passagem</h2>
                    </div>
                    <div style={{ marginLeft: '32px' }}>
                      {[
                        { label: 'Comprovante de Pagamento', file: 'Comprovante_Pagamento_Passagem.pdf' },
                        { label: 'Comprovante de Realização da Viagem', file: 'Cartao_Embarque_Ida_Volta.pdf' },
                      ].map(({ label, file }) => (
                        <div key={file} className="mb-4">
                          <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>{label}</label>
                          <div className="rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5" style={{ color: 'var(--dash-text-secondary)' }} />
                              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{file}</span>
                            </div>
                            <button onClick={() => toast.info('Visualizar anexo')} title="Visualizar" style={{ background: 'transparent', border: 'none', color: 'var(--dash-icon-subdued)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Passo 3: Informações da Passagem */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Informações da Passagem</h2>
                    </div>
                    <p className="mb-4" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>Dados da passagem realizada. O valor informado é associado à rubrica de passagem.</p>
                    <div className="space-y-4" style={{ marginLeft: '32px' }}>
                      {passageiros.map((p, idx) => (
                        <div key={p.id} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                          <div className="mb-3">
                            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Passageiro {idx + 1}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {[
                              { label: 'Nome do Passageiro', value: p.nome },
                              { label: 'Valor', value: p.valor },
                              { label: 'Localizador', value: p.localizador },
                              { label: 'Data de Emissão', value: p.emissao },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>{label}</label>
                                <input readOnly value={value} className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Local de Origem', value: viagem.origem },
                          { label: 'Data de Saída', value: viagem.saida },
                          { label: 'Horário', value: viagem.horaSaida },
                          { label: 'Local de Destino', value: viagem.destino },
                          { label: 'Data de Chegada', value: viagem.chegada },
                          { label: 'Horário', value: viagem.horaChegada },
                        ].map(({ label, value }, i) => (
                          <div key={label + i}>
                            <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>{label}</label>
                            <input readOnly value={value} className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Passo 4: Cotação */}
                  {renderCotacao(4, 'Orçamentos de passagens enviados na prestação. O orçamento selecionado é o de menor valor e corresponde à passagem adquirida.', [
                    { file: 'Cotacao_Loja_A.pdf', fornecedor: 'Passagens Aéreas Alfa', valor: 'R$ 1.280,00', data: '05/02/2026' },
                    { file: 'Cotacao_Loja_B.pdf', fornecedor: 'Passagens Aéreas Beta', valor: 'R$ 1.340,00', data: '04/02/2026' },
                    { file: 'Cotacao_Loja_C.pdf', fornecedor: 'Passagens Aéreas Gama', valor: 'R$ 1.390,00', data: '03/02/2026' },
                  ])}
                </>
              ) : selectedPagamento.variante === 'invoice' ? (
                <>
                  {/* Passo 1: Descrição */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>1</div>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Descrição</h2>
                    </div>
                    <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>Descrição do Invoice (Pagamento Internacional) informada na prestação.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)', marginLeft: '32px' }}>
                      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', lineHeight: '1.6' }}>Compra internacional de insumos de laboratório importados, referentes aos itens aprovados no edital. Pagamento realizado via invoice em moeda estrangeira.</p>
                    </div>
                  </div>

                  {/* Passo 2: Invoice (Pagamento Internacional) */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>2</div>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Invoice (Pagamento Internacional)</h2>
                    </div>
                    <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>Invoice (Pagamento Internacional) enviado para justificar este pagamento.</p>
                    <div className="rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)', marginLeft: '32px' }}>
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" style={{ color: 'var(--dash-text-secondary)' }} />
                        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>Invoice_Internacional_2026.pdf</span>
                      </div>
                      <button onClick={() => toast.info('Visualizar Invoice')} title="Visualizar" style={{ background: 'transparent', border: 'none', color: 'var(--dash-icon-subdued)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Passo 3: Compra Associada */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>3</div>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Compra Associada</h2>
                    </div>
                    <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>Itens comprados associados aos itens aprovados no Edital.</p>
                    <div className="space-y-3" style={{ marginLeft: '32px' }}>
                      {[
                        { categoria: 'Material de Consumo', item: 'Reagente para cromatografia', qtd: '10', valor: 'R$ 2.283,95' },
                        { categoria: 'Material de Consumo', item: 'Kit de vidraria laboratorial', qtd: '2', valor: 'R$ 2.283,95' },
                      ].map((compra, i) => (
                        <div key={i} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                          <div className="grid grid-cols-4 gap-4">
                            {[
                              { label: 'Categoria do item', value: compra.categoria },
                              { label: 'Item', value: compra.item },
                              { label: 'Quantidade', value: compra.qtd },
                              { label: 'Valor', value: compra.valor },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>{label}</label>
                                <input readOnly value={value} className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Passo 4: Cotação */}
                  {renderCotacao(4, 'Orçamentos enviados na prestação. O orçamento selecionado é o de menor valor e corresponde ao item adquirido. Para itens acima de R$ 1.400, são exigidos 3 orçamentos por item.', [
                    { file: 'Cotacao_Loja_A.pdf', fornecedor: 'Global Tech Ltd.', valor: 'R$ 2.283,95', data: '05/02/2026' },
                    { file: 'Cotacao_Loja_B.pdf', fornecedor: 'Overseas Supply Co.', valor: 'R$ 2.560,00', data: '04/02/2026' },
                    { file: 'Cotacao_Loja_C.pdf', fornecedor: 'Import Partners Inc.', valor: 'R$ 2.780,00', data: '03/02/2026' },
                  ])}
                </>
              ) : (
                <>
              {/* Passo 1: Nota Fiscal */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}
                  >
                    1
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>
                    Nota Fiscal
                  </h2>
                </div>
                <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>
                  Nota Fiscal enviada para justificar este pagamento.
                </p>
                <div className="rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)', marginLeft: '32px' }}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" style={{ color: 'var(--dash-text-secondary)' }} />
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>
                      Nota_Fiscal_Monitor_2024.pdf
                    </span>
                  </div>
                  <button onClick={() => toast.info('Visualizar Nota Fiscal')} title="Visualizar" style={{ background: 'transparent', border: 'none', color: 'var(--dash-icon-subdued)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Passo 2: Compra Associada */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: '24px', height: '24px', backgroundColor: '#00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}
                  >
                    2
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>
                    Compra Associada
                  </h2>
                </div>
                <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>
                  Itens comprados associados aos itens aprovados no Edital.
                </p>
                <div className="space-y-3" style={{ marginLeft: '32px' }}>
                  {[
                    { categoria: 'Material Permanente', item: 'Monitor de Vídeo LCD 22"', qtd: '1', valor: 'R$ 3.456,70' },
                  ].map((compra, i) => (
                    <div key={i} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'Categoria do item', value: compra.categoria },
                          { label: 'Item', value: compra.item },
                          { label: 'Quantidade', value: compra.qtd },
                          { label: 'Valor', value: compra.valor },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <label className="block mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)' }}>{label}</label>
                            <input readOnly value={value} className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passo 3: Cotação */}
              {renderCotacao(3, 'Orçamentos enviados na prestação. O orçamento selecionado é o de menor valor e corresponde ao item adquirido. Para itens acima de R$ 1.400, são exigidos 3 orçamentos por item.', [
                { file: 'Cotacao_Loja_A.pdf', fornecedor: 'Loja A Informática', valor: 'R$ 1.280,00', data: '05/02/2026' },
                { file: 'Cotacao_Loja_B.pdf', fornecedor: 'Loja B Suprimentos', valor: 'R$ 1.420,00', data: '04/02/2026' },
                { file: 'Cotacao_Loja_C.pdf', fornecedor: 'Loja C Tecnologia', valor: 'R$ 1.510,00', data: '03/02/2026' },
              ])}
                </>
              )}
              </div>
            </div>

            {/* Seção de Observação (apenas Nota Fiscal, oculta em Revisar) */}
            {selectedPagamento.variante === 'nota-fiscal' && selectedPagamento.status !== 'Revisar' && (
            <div className="hidden">
              <div className="flex items-center gap-2 mb-3" style={{ marginLeft: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Observação</h3>
              </div>
              <p className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginLeft: '32px' }}>
                Se o gasto precisa de justificativa, use o espaço abaixo.
              </p>
              <textarea
                value={observacao}
                onChange={(e) => { if (e.target.value.length <= maxObservacaoLength) { setObservacao(e.target.value); } }}
                placeholder="Exemplo: motivo da viagem ou da compra do curso."
                rows={4}
                className="rounded-lg px-4 py-3 resize-none"
                style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none', marginLeft: '32px', marginRight: '32px', width: 'calc(100% - 64px)' }}
              />
              <p className="mt-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-muted)', marginLeft: '32px' }}>
                {observacao.length}/{maxObservacaoLength} caracteres
              </p>
            </div>
            )}

            {/* Divider + Avaliação Fapes (oculta quando Contestada) */}
            {selectedPagamento.status !== 'Contestada' && (
            <>
            {/* Divider antes da Avaliação Fapes */}
            <div style={{ marginTop: '32px', marginBottom: '32px', marginLeft: '32px', marginRight: '32px' }}>
              <div style={{ height: '1px', backgroundColor: 'var(--dash-divider)' }}></div>
            </div>

            {/* Seção de Avaliação */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3" style={{ marginLeft: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>Avaliação Fapes</h3>
              </div>
              
              <div className="flex gap-4" style={{ marginLeft: '32px', marginBottom: '40px' }}>
                <button
                  onClick={() => {
                    setShowConfirmacaoModal(true);
                  }}
                  className="px-6 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: statusAvaliacao === 'validado' ? '#14b8a6' : 'rgba(20, 184, 166, 0.1)',
                    border: `1px solid ${statusAvaliacao === 'validado' ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
                    color: statusAvaliacao === 'validado' ? '#171717' : '#14b8a6',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer'
                  }}
                >
                  Validado
                </button>
                
                <button
                  onClick={() => {
                    setStatusAvaliacao('revisar');
                  }}
                  className="px-6 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: statusAvaliacao === 'revisar' ? '#eab308' : 'rgba(234, 179, 8, 0.1)',
                    border: `1px solid ${statusAvaliacao === 'revisar' ? '#eab308' : 'rgba(234, 179, 8, 0.3)'}`,
                    color: statusAvaliacao === 'revisar' ? '#171717' : '#eab308',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer'
                  }}
                >
                  Revisar
                </button>
                
                <button
                  onClick={() => {
                    setStatusAvaliacao('reprovado');
                  }}
                  className="px-6 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: statusAvaliacao === 'reprovado' ? '#ef4444' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${statusAvaliacao === 'reprovado' ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: statusAvaliacao === 'reprovado' ? (theme === 'dark' ? '#171717' : '#ffffff') : '#ef4444',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer'
                  }}
                >
                  Reprovado
                </button>
              </div>
              
              {/* Campos condicionais para Revisar ou Reprovado */}
              {(statusAvaliacao === 'revisar' || statusAvaliacao === 'reprovado') && (
                <div className="mt-6">
                  {/* Dropdown Motivo */}
                  <div className="mb-4">
                    <label className="mb-2 block" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)', marginLeft: '32px' }}>
                      Motivo
                    </label>
                    <div className="flex gap-2" style={{ marginLeft: '32px', marginRight: '32px' }}>
                      <div className="relative flex-1">
                        <button
                          onClick={() => setShowMotivoDropdown(!showMotivoDropdown)}
                          className="rounded-lg px-4 py-3 flex items-center justify-between"
                          style={{
                            backgroundColor: 'var(--dash-input-bg)',
                            border: '1px solid var(--dash-input-border)',
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--text-sm)',
                            color: motivoRevisao ? 'var(--dash-text-primary)' : 'var(--dash-text-muted)',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          <span>{motivoRevisao || 'Selecione um motivo'}</span>
                          <ChevronDown className="w-5 h-5" style={{ color: 'var(--dash-icon-subdued)' }} />
                        </button>
                      
                      {showMotivoDropdown && (
                        <div className="absolute top-full mt-1 w-full rounded-lg overflow-hidden z-10" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                          {['Comprovante enviado está errado', 'Está faltando um comprovante', 'Compra associada não está no edital', 'Cotação enviada não está adequada'].map((motivo) => (
                            <button key={motivo} onClick={() => { setMotivoRevisao(motivo); setShowMotivoDropdown(false); }}
                              className="w-full px-4 py-3 text-left transition-colors"
                              style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', backgroundColor: motivoRevisao === motivo ? 'rgba(0,193,175,0.1)' : 'transparent' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; }}
                              onMouseLeave={(e) => { if (motivoRevisao !== motivo) e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >{motivo}</button>
                          ))}
                        </div>
                      )}
                      </div>
                      <button onClick={() => setShowCadastrarMotivoModal(true)}
                        className="rounded-lg px-3 py-3 transition-all"
                        style={{ backgroundColor: 'transparent', border: '1px solid var(--dash-card-border)', color: 'var(--dash-text-secondary)', cursor: 'pointer', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--dash-hover-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Campo Justifique */}
                  <div className="mb-4">
                    <label className="mb-2 block" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--dash-text-primary)', marginLeft: '32px' }}>
                      Justifique
                    </label>
                    <textarea value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
                      placeholder="Explique o motivo da sua decisão..." rows={4}
                      className="rounded-lg px-4 py-3 resize-none"
                      style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none', marginLeft: '32px', marginRight: '32px', width: 'calc(100% - 64px)' }}
                    />
                  </div>
                  
                  {/* Botão Enviar */}
                  <div style={{ marginLeft: '32px', marginRight: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        if (!motivoRevisao || !justificativa) {
                          toast.error('Por favor, preencha todos os campos');
                          return;
                        }
                        toast.success(statusAvaliacao === 'revisar' ? 'Solicitação de revisão enviada!' : 'Reprovação registrada!');
                        setTimeout(() => {
                          setActivePage('financeira');
                          setSelectedPagamento(null);
                          setStatusAvaliacao(null);
                          setMotivoRevisao('');
                          setJustificativa('');
                        }, 1000);
                      }}
                      className="px-8 py-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: '#00c1af',
                        border: '1px solid #00c1af',
                        color: '#171717',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        cursor: 'pointer'
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>
            )}
          </div>
        ) : activePage === 'caixa-entrada' ? (
          <CaixaEntrada
            isLight={isLight}
            onNavigate={(destino) => setActivePage(destino as ActivePage)}
          />
        ) : activePage === 'pagamento' ? (
          <div />
        ) : activePage === 'contabilidade-financeiro' ? (
          <AcaoTransversalFinanceiro onBack={() => setActivePage('parceria')} />
        ) : activePage === 'iniciativas' ? (
          <Iniciativas />
        ) : activePage === 'rubricas' ? (
          <Rubricas onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'fomento' ? (
          <Editais key={`fomento-${pageVersion}`} kind="fomento" />
        ) : activePage === 'editais' ? (
          <Editais key={`captacao-${pageVersion}`} kind="captacao" />
        ) : activePage === 'editais-light' ? (
          <EditaisLight />
        ) : activePage === 'configuracoes' ? (
          <Configuracoes
            onBack={() => setActivePage('home')}
            onOpenPlanejamento={() => setActivePage('planejamento')}
            onOpenReferencias={() => setActivePage('referencias')}
            onOpenRubricas={() => setActivePage('rubricas')}
            onOpenDocumentos={() => setActivePage('documentos')}
            onOpenFormularios={() => setActivePage('formulario')}
            onOpenRegrasAcaoTransversal={() => setActivePage('regras-acao-transversal')}
            onOpenCalendarioFolha={() => setActivePage('calendario-folha')}
            onOpenControleAcessos={() => setActivePage('controle-acessos')}
          />
        ) : activePage === 'planejamento' ? (
          <PlanejamentoEstrategico onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'calendario-folha' ? (
          <CalendarioFolha onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'controle-acessos' ? (
          <ControleAcessos onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'pessoas' ? (
          <PessoasFisicas onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'referencias' ? (
          <ReferenciasCorporativas onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'documentos' ? (
          <DocumentosExigidos onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'regras-acao-transversal' ? (
          <RegrasAcaoTransversal onBack={() => setActivePage('configuracoes')} />
        ) : activePage === 'programa' ? (
          <Programa onBack={() => setActivePage('parceria')} />
        ) : activePage === 'parceria' ? (
          <Parceria onBack={() => setActivePage('parceria')} />
        ) : activePage === 'instituicoes' ? (
          <Instituicoes onBack={() => setActivePage('parceria')} />
        ) : activePage === 'formulario' ? (
          <SurveyFormBuilder onBack={() => setActivePage('configuracoes')} />
        ) : (
          <div className="p-8">
            <div>
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'rgba(0,193,175,0.15)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <LayoutDashboard size={20} style={{ color: '#00c1af' }} />
                  </div>
                  <div className="flex-1" style={{ marginTop: '6px' }}>
                    <h1
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-md)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: T.textPrimary,
                        lineHeight: '1.5',
                      }}
                    >
                      Dashboard
                    </h1>
                    <p
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        color: T.textSecondary,
                        lineHeight: '1.5',
                        margin: 0,
                      }}
                    >
                      Acompanhe operações críticas, mantenha cadastros atualizados e acesse os fluxos mais usados do back-office.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Captações em andamento', value: '18', Icon: FileText, tone: '#4f6fce' },
                  { label: 'Parcerias ativas', value: '7', Icon: Handshake, tone: '#00c1af' },
                  { label: 'Pagamentos em validação', value: '5', Icon: CreditCard, tone: '#3b82f6' },
                  { label: 'Pendências críticas', value: '3', Icon: AlertTriangle, tone: '#f59e0b' },
                ].map(({ label, value, Icon, tone }) => (
                  <div
                    key={label}
                    className="rounded-lg p-5"
                    style={{
                      backgroundColor: 'var(--dash-card-bg)',
                      border: '1px solid var(--dash-card-border)',
                      boxShadow: 'var(--dash-shadow)',
                    }}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div
                        className="flex items-center justify-center rounded-lg"
                        style={{ width: 40, height: 40, backgroundColor: `${tone}22` }}
                      >
                        <Icon size={20} style={{ color: tone }} />
                      </div>
                    </div>
                    <p style={{ color: T.textSecondary, fontSize: '14px' }}>{label}</p>
                    <p className="mt-2" style={{ color: T.textPrimary, fontSize: '30px', fontWeight: 600, lineHeight: 1 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <section
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: 'var(--dash-card-bg)',
                    border: '1px solid var(--dash-card-border)',
                    boxShadow: 'var(--dash-shadow)',
                  }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 600 }}>Trabalho prioritário</h2>
                      <p className="mt-1" style={{ color: T.textSecondary, fontSize: '14px' }}>Itens que precisam de decisão ou revisão.</p>
                    </div>
                    <button
                      onClick={() => setActivePage('financeira')}
                      className={`rounded-lg px-3 py-2 ${T.hoverClass}`}
                      style={{ color: '#00c1af', fontSize: '14px', fontWeight: 600 }}
                    >
                      Ver fila
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: 'Prestações financeiras aguardando validação', meta: '5 itens', Icon: DollarSign },
                      { title: 'Documentos obrigatórios pendentes de revisão', meta: '12 documentos', Icon: ClipboardCheck },
                      { title: 'Captações com publicação próxima', meta: '2 captações', Icon: Calendar },
                    ].map(({ title, meta, Icon }) => (
                      <button
                        key={title}
                        onClick={() => setActivePage(title.includes('financeiras') ? 'financeira' : 'editais')}
                        className={`flex w-full items-center justify-between rounded-lg p-4 text-left transition-all ${T.hoverClass}`}
                        style={{
                          backgroundColor: isLight ? '#ffffff' : 'rgba(255,255,255,0.035)',
                          border: '1px solid var(--dash-card-border)',
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} style={{ color: '#00c1af' }} />
                          <span>
                            <span style={{ display: 'block', color: T.textPrimary, fontSize: '14px', fontWeight: 600 }}>{title}</span>
                            <span style={{ display: 'block', color: T.textMuted, fontSize: '13px', marginTop: 2 }}>{meta}</span>
                          </span>
                        </span>
                        <ChevronRight size={18} style={{ color: T.textMuted }} />
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section
                className="mt-6 rounded-lg p-5"
                style={{
                  backgroundColor: 'var(--dash-card-bg)',
                  border: '1px solid var(--dash-card-border)',
                  boxShadow: 'var(--dash-shadow)',
                }}
              >
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 600 }}>Área de controle operacional</h2>
                    <p className="mt-1" style={{ color: T.textSecondary, fontSize: '14px' }}>
                      Visão consolidada das pendências de bolsa, captação e avaliações que exigem acompanhamento.
                    </p>
                  </div>
                  <span
                    className="rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: isLight ? '#eef6ff' : 'rgba(79, 111, 206, 0.16)',
                      color: isLight ? '#264a99' : '#9db2ff',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    SLA crítico: 4 itens
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Análise de bolsas',
                      subtitle: 'Pendências por prioridade',
                      Icon: BookOpen,
                      tone: '#00c1af',
                      action: 'Abrir bolsas',
                      page: 'pagamento' as ActivePage,
                      rows: [
                        { label: 'Bolsas aguardando enquadramento', value: '9', meta: '3 vencem hoje', status: '#ef4444' },
                        { label: 'Solicitações com documentação incompleta', value: '14', meta: 'aguardando coordenador', status: '#f59e0b' },
                        { label: 'Renovações para parecer técnico', value: '6', meta: 'prazo médio 2 dias', status: '#3b82f6' },
                      ],
                    },
                    {
                      title: 'Avisos de avaliação',
                      subtitle: 'Bolsas e projetos',
                      Icon: Bell,
                      tone: '#f59e0b',
                      action: 'Ver avisos',
                      page: 'financeira' as ActivePage,
                      rows: [
                        { label: 'Avaliação de bolsa sem parecer', value: '5', meta: 'responsável definido', status: '#ef4444' },
                        { label: 'Projetos com avaliação parcial pendente', value: '8', meta: 'aguardando área técnica', status: '#f59e0b' },
                        { label: 'Relatórios finais para homologação', value: '11', meta: 'fila regular', status: '#00c1af' },
                      ],
                    },
                    {
                      title: 'Processos de captação',
                      subtitle: 'Captações e propostas em curso',
                      Icon: FileText,
                      tone: '#4f6fce',
                      action: 'Abrir captação',
                      page: 'editais' as ActivePage,
                      rows: [
                        { label: 'Captações em análise jurídica', value: '4', meta: '1 bloqueando publicação', status: '#ef4444' },
                        { label: 'Propostas recebidas sem triagem', value: '27', meta: 'últimas 24h', status: '#f59e0b' },
                        { label: 'Chamadas próximas da publicação', value: '3', meta: 'esta semana', status: '#3b82f6' },
                      ],
                    },
                  ].map(({ title, subtitle, Icon, tone, action, page, rows }) => (
                    <div
                      key={title}
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.035)',
                        border: '1px solid var(--dash-card-border)',
                      }}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex items-center justify-center rounded-lg"
                            style={{ width: 34, height: 34, backgroundColor: `${tone}22`, color: tone }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <h3 style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 700 }}>{title}</h3>
                            <p className="mt-1" style={{ color: T.textMuted, fontSize: '13px' }}>{subtitle}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActivePage(page)}
                          className={`rounded-lg px-2.5 py-1.5 ${T.hoverClass}`}
                          style={{ color: tone, fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}
                        >
                          {action}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {rows.map((row) => (
                          <button
                            key={row.label}
                            onClick={() => setActivePage(page)}
                            className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${T.hoverClass}`}
                            style={{
                              backgroundColor: isLight ? '#fafafa' : 'rgba(255,255,255,0.035)',
                              border: '1px solid var(--dash-card-border)',
                            }}
                          >
                            <span className="flex min-w-0 items-start gap-3">
                              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: row.status }} />
                              <span className="min-w-0">
                                <span style={{ display: 'block', color: T.textPrimary, fontSize: '12px', fontWeight: 600, lineHeight: 1.35 }}>
                                  {row.label}
                                </span>
                                <span style={{ display: 'block', color: T.textMuted, fontSize: '11px', marginTop: 3 }}>
                                  {row.meta}
                                </span>
                              </span>
                            </span>
                            <span style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>
                              {row.value}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Aprovação */}
      {showConfirmacaoModal && (
        <div className="fixed inset-0 flex items-start justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: '20vh', zIndex: 9999 }} onClick={() => setShowConfirmacaoModal(false)}>
          <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: isLight ? '#ffffff' : '#262626', border: '1px solid var(--dash-card-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowConfirmacaoModal(false)} className="absolute top-4 right-4 p-1 rounded-lg transition-all" style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--dash-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <div className="flex items-start gap-3 mb-6 pr-8">
              <div className="flex items-center justify-center flex-shrink-0 rounded-full" style={{ width: '44px', height: '44px', backgroundColor: 'rgba(0,193,175,0.12)' }}>
                <CheckCircle size={24} style={{ color: '#00c1af' }} />
              </div>
              <div>
                <h3 className="mb-1" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--dash-text-primary)' }}>
                  Validar prestação?
                </h3>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', lineHeight: '1.6' }}>
                  Tem certeza que deseja validar esta Prestação de Contas Financeira? Após confirmar, <strong style={{ color: 'var(--dash-text-primary)', fontWeight: 'var(--font-weight-semibold)' }}>não é possível desfazer</strong> esta ação.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmacaoModal(false)} className="px-6 py-2 rounded-lg transition-all"
                style={{ backgroundColor: 'transparent', border: '1px solid var(--dash-card-border)', color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => { setPagamentosData(prev => prev.map(p => p.id === selectedPagamento?.id ? { ...p, status: 'Validado' as StatusFilter } : p)); setStatusAvaliacao('validado'); setShowConfirmacaoModal(false); toast.success('Pagamento validado com sucesso!'); setTimeout(() => { setActivePage('financeira'); setSelectedPagamento(null); }, 1000); }}
                className="px-6 py-2 rounded-lg transition-all"
                style={{ backgroundColor: '#00c1af', border: '1px solid #00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer'
                }}
              >
                Validar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastrar Novo Motivo */}
      {showCadastrarMotivoModal && (
        <div 
          className="fixed inset-0 flex items-start justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingTop: '20vh',
            zIndex: 9999
          }}
          onClick={() => {
            setShowCadastrarMotivoModal(false);
            setNovoMotivo('');
          }}
        >
          <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: isLight ? '#ffffff' : '#262626', border: '1px solid var(--dash-card-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setShowCadastrarMotivoModal(false); setNovoMotivo(''); }}
              className="absolute top-4 right-4 p-1 rounded-lg transition-all"
              style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--dash-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 className="mb-4 pr-8" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--dash-text-primary)' }}>
              Cadastrar novo motivo
            </h3>
            <div className="mb-6">
              <input type="text" value={novoMotivo} onChange={(e) => { if (e.target.value.length <= maxNovoMotivoLength) setNovoMotivo(e.target.value); }}
                placeholder="Digite o novo motivo" className="rounded-lg px-4 py-3 w-full"
                style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-input-border)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', outline: 'none' }} />
              <p className="mt-2 text-right" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>{novoMotivo.length}/{maxNovoMotivoLength}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowCadastrarMotivoModal(false); setNovoMotivo(''); }}
                className="px-6 py-2 rounded-lg transition-all"
                style={{ backgroundColor: 'transparent', border: '1px solid var(--dash-card-border)', color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => { if (novoMotivo.trim()) { toast.success('Motivo cadastrado com sucesso!'); setMotivoRevisao(novoMotivo); setShowCadastrarMotivoModal(false); setNovoMotivo(''); } else { toast.error('Por favor, digite um motivo válido'); } }}
                className="px-6 py-2 rounded-lg transition-all"
                style={{ backgroundColor: '#00c1af', border: '1px solid #00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Validação em Lote */}
      {showValidarLoteModal && (
        <div className="fixed inset-0 flex items-start justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: '20vh', zIndex: 9999 }} onClick={() => setShowValidarLoteModal(false)}>
          <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: isLight ? '#ffffff' : '#262626', border: '1px solid var(--dash-card-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowValidarLoteModal(false)} className="absolute top-4 right-4 p-1 rounded-lg transition-all" style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--dash-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 className="mb-6" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--dash-text-primary)' }}>
              Tem certeza que deseja validar {selectedPagamentos.length} Prestação{selectedPagamentos.length > 1 ? 'ões' : ''} de Contas Financeira{selectedPagamentos.length > 1 ? 's' : ''} selecionada{selectedPagamentos.length > 1 ? 's' : ''}? Após confirmar, <strong style={{ color: 'var(--dash-text-primary)', fontWeight: 'var(--font-weight-semibold)' }}>não é possível desfazer</strong> esta ação.
            </h3>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowValidarLoteModal(false)} className="px-6 py-2 rounded-lg transition-all"
                style={{ backgroundColor: 'transparent', border: '1px solid var(--dash-card-border)', color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => { setShowValidarLoteModal(false); const count = selectedPagamentos.length; toast.success(`${count} pagamento${count > 1 ? 's validados' : ' validado'} com sucesso!`); setSelectedPagamentos([]); }}
                className="px-6 py-2 rounded-lg transition-all"
                style={{ backgroundColor: '#00c1af', border: '1px solid #00c1af', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Validar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ThemeProvider>
  );
};
