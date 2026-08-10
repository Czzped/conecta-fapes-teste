import { Users, Plus, UserPlus, ChevronDown, Search, FileText, X, GraduationCap, User, Calendar, Target, ClipboardList, Send, CheckCircle, ArrowUpDown, ArrowDown, ArrowUp, Check, AlertTriangle, HandCoins, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import * as echarts from 'echarts';
import { DatePicker } from '@/app/components/DatePicker';
import { PaymentsPage } from '@/app/components/PaymentsPage';
import { ListPagination } from '@/app/components/ListPagination';
import { AdicionarVoluntario } from '@/app/components/AdicionarVoluntario';

interface MyTeamPageProps {
  accessType: 'voluntario' | 'bolsista' | 'bolsistaSolicitarBolsa' | 'minhaEquipeExemplo' | 'proponente' | 'coordenador';
  onNavigate?: (page: string) => void;
  hideHeader?: boolean;
  defaultTab?: 'bolsistas' | 'informacoes' | 'pagamentos';
  hideTabs?: boolean;
  hidePaymentsTab?: boolean;
  hideAddButton?: boolean;
  hideExpandable?: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: 'BPIG-VII' | 'BPIG-VI' | 'BPIG-V' | 'BPIG-IV' | 'BPIG-III' | 'BPIG-II' | 'Voluntário' | 'AUX-MOR';
  status: 'Em Andamento' | 'Finalizada' | 'Cancelada' | 'Reprovada' | 'Doc. Pendente' | 'Revisar' | 'Em Avaliação' | 'Reprovado';
  isVoluntario?: boolean;
  email: string;
  phone: string;
  documents: {
    id: number;
    requisito: string;
    documento: string;
    dataEnvio: string;
    status: 'Validado' | 'Pendente' | 'Em Validação' | 'Reprovado';
  }[];
}

export function MyTeamPage({ accessType, onNavigate, hideHeader = false, defaultTab = 'informacoes', hideTabs = false, hidePaymentsTab = false, hideAddButton = false, hideExpandable = false }: MyTeamPageProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bolsistas' | 'informacoes' | 'pagamentos'>(defaultTab);
  const showPaymentsTab = !hidePaymentsTab;
  const [expandedBolsistaId, setExpandedBolsistaId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalidade, setSelectedModalidade] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [isModalidadeOpen, setIsModalidadeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMemberForDetails, setSelectedMemberForDetails] = useState<TeamMember | null>(null);
  const [detailsTab, setDetailsTab] = useState<'informacoes' | 'aprovacao' | 'historico'>('informacoes');
  const [selectedMemberPage, setSelectedMemberPage] = useState<TeamMember | null>(null);
  const [memberPageTab, setMemberPageTab] = useState<'documentos' | 'informacoes' | 'historico'>('documentos');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedMemberForCancel, setSelectedMemberForCancel] = useState<TeamMember | null>(null);
  const [cancelJustification, setCancelJustification] = useState('');
  const [cancelDate, setCancelDate] = useState('');
  const [isCancelRequestModalOpen, setIsCancelRequestModalOpen] = useState(false);
  const [selectedMemberForCancelRequest, setSelectedMemberForCancelRequest] = useState<TeamMember | null>(null);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isAddVoluntarioOpen, setIsAddVoluntarioOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isPermitScholarModalOpen, setIsPermitScholarModalOpen] = useState(false);
  const [selectedScholarCpf, setSelectedScholarCpf] = useState('');
  const [selectedVolunteerToFinish, setSelectedVolunteerToFinish] = useState<TeamMember | null>(null);
  const [volunteerEndDate, setVolunteerEndDate] = useState('');
  const [volunteerDetailsTab, setVolunteerDetailsTab] = useState<'informacoes' | 'historico'>('informacoes');
  const itemsPerPage = 10;
  const isExampleFlow = accessType === 'minhaEquipeExemplo';
  
  const periodChartRef = useRef<HTMLDivElement>(null);
  const acoesMenuRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown de Ações ao clicar fora
  useEffect(() => {
    if (!isActionsMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!acoesMenuRef.current?.contains(target)) {
        setIsActionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActionsMenuOpen]);

  // Um membro é de auxílio quando a modalidade começa com "AUX"
  const isAuxilio = (m: TeamMember) => m.type.startsWith('AUX');

  const defaultDocuments = [
    { id: 1, requisito: 'Nível Médio', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Pendente' as const },
    { id: 2, requisito: 'Nível Superior', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Em Validação' as const },
    { id: 3, requisito: 'RG', documento: 'Imagem Frente e Verso do RG', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 4, requisito: 'CPF', documento: 'CPF ou Comprovante de Situação Cadastral', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 5, requisito: 'Comprovante de Residência', documento: 'Dentre os últimos 6 meses', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 6, requisito: 'Lattes', documento: 'PDF gerado pela plataforma', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 7, requisito: 'Certidão Negativa de Débito - Municipal', documento: 'Certidão de Regularidade Fiscal Municipal', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 8, requisito: 'Certidão Negativa de Débito - Estadual', documento: 'Certidão de Regularidade Fiscal Estadual', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 9, requisito: 'Certidão Negativa de Débito - Federal', documento: 'Certidão de Regularidade Fiscal Federal', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 10, requisito: 'Certidão Negativa de Débito - Trabalhista', documento: 'Extrato CAGED', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 11, requisito: 'Nível Acadêmico', documento: 'Diploma de maior titulação', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 12, requisito: 'Plano de Trabalho', documento: 'Formulário de Atividades Bolsista', dataEnvio: '20/02/2026', status: 'Validado' as const },
    { id: 13, requisito: 'Não ter vínculo empregatício', documento: 'CNIS', dataEnvio: '20/02/2026', status: 'Reprovado' as const },
  ];

  const revisarDocuments = defaultDocuments.map((document) =>
    document.requisito === 'Nível Médio'
      ? { ...document, status: 'Reprovado' as const }
      : document
  );

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 101, name: 'Ana Clara Ribeiro Monteiro', startDate: '01/03/2026', endDate: '01/03/2027', type: 'Voluntário', status: 'Aguardando Aceite', isVoluntario: true, email: 'ana.monteiro@example.com', phone: '(27) 99123-4567', documents: [] },
    { id: 102, name: 'Bruno Tavares Almeida', startDate: '01/02/2026', endDate: '01/02/2027', type: 'Voluntário', status: 'Em Andamento', isVoluntario: true, email: 'bruno.almeida@example.com', phone: '(27) 99234-5678', documents: [] },
    { id: 103, name: 'Carla Menezes Fontoura', startDate: '01/03/2026', endDate: '01/08/2026', type: 'AUX-MOR', status: 'Em Andamento', email: 'carla.fontoura@example.com', phone: '(27) 99345-6789', documents: [] },
    { id: 1, name: 'Paulo Sérgio dos Santos Junior', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VII', status: 'Doc. Pendente', email: 'paulo.junior@example.com', phone: '(27) 99999-9999', documents: defaultDocuments },
    { id: 2, name: 'Felipe Frechiani de Oliveira', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VI', status: 'Doc. Pendente', email: 'felipe.frechiani@example.com', phone: '(27) 99888-8888', documents: defaultDocuments },
    { id: 3, name: 'Fabiano Borges Ruy', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-V', status: 'Finalizada', email: 'fabiano.ruy@example.com', phone: '(27) 99777-7777', documents: defaultDocuments },
    { id: 4, name: 'Victorio Albani de Carvalho', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-IV', status: 'Em Andamento', email: 'victorio.albani@example.com', phone: '(27) 99666-6666', documents: defaultDocuments },
    { id: 5, name: 'Sofia de Alcantara Silva', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-III', status: 'Revisar', email: 'sofia.alcantara@example.com', phone: '(27) 99555-5555', documents: revisarDocuments },
    { id: 6, name: 'Rafael Emerick Zape de Oliveira', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-II', status: 'Cancelada', email: 'rafael.zape@example.com', phone: '(27) 99444-4444', documents: defaultDocuments },
    { id: 7, name: 'Moisés Savedra Omena', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-VII', status: 'Doc. Pendente', email: 'moises.omena@example.com', phone: '(27) 99333-3333', documents: defaultDocuments },
    { id: 8, name: 'Michele Rudio Constatino', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VI', status: 'Em Andamento', email: 'michele.rudio@example.com', phone: '(27) 99222-2222', documents: defaultDocuments },
    { id: 9, name: 'Marcela Starling Ferreira Lage', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-V', status: 'Finalizada', email: 'marcela.lage@example.com', phone: '(27) 99111-1111', documents: defaultDocuments },
    { id: 10, name: 'Vinícius de Jesus Estevam', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-IV', status: 'Em Andamento', email: 'vinicius.estevam@example.com', phone: '(27) 98999-9999', documents: defaultDocuments },
    { id: 11, name: 'Jennifer Gonçalves do Amaral', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-III', status: 'Reprovada', email: 'jennifer.amaral@example.com', phone: '(27) 98888-8888', documents: defaultDocuments },
    { id: 12, name: 'Maria Luiza Guimarães Silva Mantovanelli', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-II', status: 'Em Andamento', email: 'maria.mantovanelli@example.com', phone: '(27) 98777-7777', documents: defaultDocuments },
    { id: 13, name: 'Heitor Lima Peixoto', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VII', status: 'Em Andamento', email: 'heitor.peixoto@example.com', phone: '(27) 98666-6666', documents: defaultDocuments },
    { id: 14, name: 'Felipe Costabeber Schneider', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-VI', status: 'Finalizada', email: 'felipe.schneider@example.com', phone: '(27) 98555-5555', documents: defaultDocuments },
    { id: 15, name: 'Diogo Alves do Nascimento Barcelos', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-V', status: 'Em Andamento', email: 'diogo.barcelos@example.com', phone: '(27) 98444-4444', documents: defaultDocuments },
    { id: 16, name: 'Daniel Cruz Cavalieri', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-IV', status: 'Em Andamento', email: 'daniel.cavalieri@example.com', phone: '(27) 98333-3333', documents: defaultDocuments },
    { id: 17, name: 'Caio Lessa Simão', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-III', status: 'Cancelada', email: 'caio.simao@example.com', phone: '(27) 98222-2222', documents: defaultDocuments },
    { id: 18, name: 'Leandro Camatta de Assis', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-II', status: 'Em Andamento', email: 'leandro.assis@example.com', phone: '(27) 98111-1111', documents: defaultDocuments },
    { id: 19, name: 'João Pedro Hulle Gomes de Jesus', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-VII', status: 'Em Andamento', email: 'joao.jesus@example.com', phone: '(27) 97999-9999', documents: defaultDocuments },
    { id: 20, name: 'André Luiz Coelho Silva', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-VI', status: 'Em Andamento', email: 'andre.silva@example.com', phone: '(27) 97888-8888', documents: defaultDocuments },
  ]);

  // Sort team members by end date
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    const dateA = new Date(a.endDate.split('/').reverse().join('-'));
    const dateB = new Date(b.endDate.split('/').reverse().join('-'));
    return sortOrder === 'recent' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  // Apply filters
  const filteredMembers = sortedTeamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModalidade = selectedModalidade === 'Todos' || member.type === selectedModalidade;
    const matchesStatus = selectedStatus === 'Todos' || member.status === selectedStatus;
    return matchesSearch && matchesModalidade && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);
  const visibleMembersCount = Math.min(itemsPerPage, filteredMembers.length);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedBolsistaId(null); // Close any expanded item when changing page
  };

  const handleAddVoluntario = (voluntario: { name: string; cpf: string; email: string; dataInicio: string }) => {
    const [year, month] = voluntario.dataInicio.split('-');
    const startDate = `01/${month}/${year}`;
    const endDate = `01/${month}/${Number(year) + 1}`;
    setTeamMembers((prev) => [
      {
        id: Date.now(),
        name: voluntario.name,
        startDate,
        endDate,
        type: 'Voluntário',
        status: 'Em Avaliação',
        isVoluntario: true,
        email: voluntario.email,
        phone: '',
        documents: [],
      },
      ...prev,
    ]);
    setCurrentPage(1);
  };

  const isVolunteer = (member: TeamMember) => member.type === 'Voluntário';

  const handleMemberRowClick = (member: TeamMember) => {
    if (hideExpandable) return;
    if (isVolunteer(member)) {
      setSelectedVolunteerToFinish(member);
      setVolunteerEndDate('');
      setVolunteerDetailsTab('informacoes');
      return;
    }
    if (isExampleFlow) {
      setSelectedMemberPage(member);
      setMemberPageTab('documentos');
      setExpandedBolsistaId(null);
      return;
    }
    setExpandedBolsistaId(expandedBolsistaId === member.id ? null : member.id);
  };

  const formatDateForDisplay = (value: string) => {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleFinishVolunteering = () => {
    if (!selectedVolunteerToFinish) return;
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === selectedVolunteerToFinish.id
          ? {
              ...member,
              status: 'Finalizada',
              endDate: formatDateForDisplay(volunteerEndDate) || member.endDate,
            }
          : member
      )
    );
    setSelectedVolunteerToFinish(null);
    setVolunteerEndDate('');
    setVolunteerDetailsTab('informacoes');
    toast.success('Voluntariado finalizado com sucesso.');
  };

  const getStatusStyles = (status: TeamMember['status']) => {
    switch (status) {
      case 'Em Andamento':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        };
      case 'Finalizada':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          color: '#22c55e',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'Cancelada':
        return {
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          color: '#fb923c',
          border: '1px solid rgba(251, 146, 60, 0.3)',
        };
      case 'Reprovada':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'Doc. Pendente':
      case 'Revisar':
      case 'Em Avaliação':
      case 'Aguardando Aceite':
        return {
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          color: '#eab308',
          border: '1px solid rgba(234, 179, 8, 0.3)',
        };
      case 'Reprovado':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      default:
        return {
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          border: '1px solid var(--border)',
        };
    }
  };

  const getDocumentStatusColor = (status: 'Validado' | 'Pendente' | 'Em Validação' | 'Reprovado') => {
    switch (status) {
      case 'Validado':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.2)' };
      case 'Pendente':
        return { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.2)' };
      case 'Em Validação':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.2)' };
      case 'Reprovado':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: 'rgba(239, 68, 68, 0.2)' };
      default:
        return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' };
    }
  };

  // Chart data by year
  const chartDataByYear: Record<string, { ativas: number[], entraram: number[], sairam: number[] }> = {
    '2024': {
      ativas: [38, 40, 42, 44, 43, 41, 40, 38, 37, 35, 33, 30],
      entraram: [4, 2, 2, 3, 1, 0, 1, 0, 1, 0, 0, 0],
      sairam: [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 3],
    },
    '2025': {
      ativas: [30, 34, 38, 40, 42, 44, 45, 43, 42, 40, 38, 36],
      entraram: [0, 4, 4, 2, 2, 2, 1, 0, 0, 0, 0, 0],
      sairam: [0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2],
    },
    '2026': {
      ativas: [44, 48, 46, 45, 44, 44, 44, 39, 39, 31, 0, 0],
      entraram: [0, 5, 6, 1, 2, 2, 1, 0, 1, 0, 0, 0],
      sairam: [0, 0, 4, 1, 0, 0, 0, 0, 0, 8, 13, 0],
    },
  };

  // Chart effect
  useEffect(() => {
    if (!periodChartRef.current) return;

    const updateChart = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const foregroundColor = rootStyles.getPropertyValue('--foreground').trim();
      const cardColor = rootStyles.getPropertyValue('--card').trim();
      const borderColor = rootStyles.getPropertyValue('--border').trim();
      const mutedForegroundColor = rootStyles.getPropertyValue('--muted-foreground').trim();

      const existingChart = echarts.getInstanceByDom(periodChartRef.current!);
      const periodChart = existingChart || echarts.init(periodChartRef.current!);
      
      const currentData = chartDataByYear[selectedYear];
      
      const periodOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: cardColor,
          borderColor: borderColor,
          textStyle: {
            color: foregroundColor,
            fontFamily: 'Poppins, sans-serif',
          },
        },
        legend: {
          data: ['Ativas', 'Entraram', 'Saíram'],
          bottom: '0%',
          left: 'center',
          textStyle: {
            color: foregroundColor,
            fontFamily: 'Poppins, sans-serif',
          },
          itemWidth: 16,
          itemHeight: 16,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          top: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          axisLine: {
            lineStyle: {
              color: borderColor,
            },
          },
          axisLabel: {
            color: mutedForegroundColor,
            fontFamily: 'Poppins, sans-serif',
          },
        },
        yAxis: {
          type: 'value',
          max: 50,
          axisLine: {
            lineStyle: {
              color: borderColor,
            },
          },
          axisLabel: {
            color: mutedForegroundColor,
            fontFamily: 'Poppins, sans-serif',
          },
          splitLine: {
            lineStyle: {
              color: borderColor,
            },
          },
        },
        series: [
          {
            name: 'Ativas',
            type: 'line',
            data: currentData.ativas,
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#22d3ee',
            },
            itemStyle: {
              color: '#22d3ee',
            },
            symbol: 'circle',
            symbolSize: 8,
          },
          {
            name: 'Entraram',
            type: 'line',
            data: currentData.entraram,
            smooth: true,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              color: '#10b981',
            },
            symbol: 'circle',
            symbolSize: 8,
          },
          {
            name: 'Saíram',
            type: 'line',
            data: currentData.sairam,
            smooth: true,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              color: '#f59e0b',
            },
            symbol: 'circle',
            symbolSize: 8,
          },
        ],
      };
      
      periodChart.setOption(periodOption);
    };

    updateChart();

    const handleResize = () => {
      if (periodChartRef.current) {
        const chart = echarts.getInstanceByDom(periodChartRef.current);
        chart?.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateChart();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      
      if (periodChartRef.current) {
        const chart = echarts.getInstanceByDom(periodChartRef.current);
        chart?.dispose();
      }
    };
  }, [selectedYear]);

  const renderDocumentsList = (member: TeamMember, compact = false) => (
    <div className="space-y-3">
      {member.status === 'Revisar' && (
        <div
          className="flex items-start gap-3 p-3"
          style={{
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'rgb(234, 179, 8)',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.5,
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>Diploma de Nível Médio Recusado. Falta o verso do documento. Reenviar em até X dias.</span>
        </div>
      )}

      {member.documents.map((doc) => {
        const statusColors = getDocumentStatusColor(doc.status);
        return (
          <div
            key={doc.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: compact ? '0.75rem' : '1rem',
            }}
          >
            <div className={compact ? 'space-y-3' : 'grid grid-cols-12 gap-4'}>
              <div className={compact ? '' : 'col-span-3'}>
                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                  Requisito
                </div>
                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                  {doc.requisito}
                </div>
              </div>

              <div className={compact ? '' : 'col-span-4'}>
                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                  Documento
                </div>
                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                  {doc.documento}
                </div>
              </div>

              <div className={compact ? '' : 'col-span-3'}>
                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                  Data de Envio
                </div>
                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                  {doc.dataEnvio}
                </div>
              </div>

              <div className={compact ? '' : 'col-span-2'}>
                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                  Status
                </div>
                <span
                  className="inline-flex items-center px-2.5 py-1"
                  style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.color,
                    border: `1px solid ${statusColors.border}`,
                    borderRadius: '9999px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderScholarshipInfo = (member: TeamMember) => (
    <div
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
      }}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Nome</div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{member.name}</div>
        </div>

        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>E-mail</div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{member.email}</div>
        </div>

        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Telefone</div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{member.phone}</div>
        </div>

        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Vigência</div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{member.startDate} até {member.endDate}</div>
        </div>

        {[
          ['Valor da Bolsa', 'R$ 2.500,00'],
        ].map(([label, value]) => (
          <div key={label} className="md:col-span-2">
            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{value}</div>
          </div>
        ))}

        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Modalidade</div>
          <span
            className="inline-flex items-center px-3 py-1"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: '9999px',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {member.type}
          </span>
        </div>

        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Status</div>
          <span
            className="inline-flex items-center px-3 py-1"
            style={{
              ...getStatusStyles(member.status),
              borderRadius: '9999px',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {member.status}
          </span>
        </div>

        <div className="md:col-span-4">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Objetivos</div>
          <div
            style={{
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.6,
              minHeight: '6rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              backgroundColor: 'var(--input-background)',
            }}
          >
            Apoiar as atividades técnicas e científicas previstas no projeto, com participação em entregas, registros e acompanhamento das metas pactuadas.
          </div>
        </div>

        <div className="md:col-span-4">
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>Plano de Trabalho</div>
          <div
            style={{
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.6,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              backgroundColor: 'var(--input-background)',
            }}
          >
            A.1 - Levantamento de dados do projeto, organização das entregas previstas e apoio na execução das atividades técnicas da equipe.
          </div>
        </div>
      </div>
    </div>
  );

  const renderScholarshipHistory = () => (
    <div
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem',
      }}
    >
      <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
        <ClipboardList size={16} />
        Registro
      </div>
      <div className="space-y-5">
        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
            Usuário que Solicitou a Bolsa
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Dra. Maria Silva
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
            Data da Solicitação da Bolsa
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            09/02/2026 às 14:35
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
            Data do Aceite do Bolsista
          </div>
          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            12/02/2026 às 09:18
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-full overflow-x-hidden ${!hideHeader ? 'p-4 md:p-8' : ''}`}>
      <section>
        {isExampleFlow && selectedMemberPage && !hideHeader && (
          <nav
            className="mb-4 flex items-center gap-2"
            style={{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            <span>Minha Equipe</span>
            <ChevronRight size={16} />
            <button
              type="button"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--muted-foreground)',
                border: 'none',
                padding: 0,
                font: 'inherit',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedMemberPage(null);
                setMemberPageTab('documentos');
              }}
            >
              Bolsistas do Projeto
            </button>
            <ChevronRight size={16} />
            <span style={{ color: 'var(--foreground)' }}>Detalhes</span>
          </nav>
        )}

        {/* Header with icon */}
        {!hideHeader && (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 transition-colors"
                  style={{
                    color: 'var(--title-icon-foreground)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                }}
              >
                <Users size={20} />
              </div>
              <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
                {isExampleFlow && selectedMemberPage ? selectedMemberPage.name : 'Minha Equipe'}
              </h1>
              </div>

              {isExampleFlow && selectedMemberPage && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    className="px-4 py-2 transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedMemberForCancel(selectedMemberPage);
                      setIsCancelModalOpen(true);
                    }}
                  >
                    Cancelar Bolsa
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsPermitScholarModalOpen(true)}
                  >
                    Delegar - Solicitar Bolsa
                  </button>
                </div>
              )}
            </div>

            {/* Subtitle and actions */}
            {!(isExampleFlow && selectedMemberPage) && (
              <div
              className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
              style={{
                marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
              }}
            >
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  margin: 0,
                }}
              >
                Acompanhe as informações dos bolsistas do seu projeto.
              </p>

              {activeTab === 'bolsistas' && !hideAddButton && isExampleFlow && (
                <div className="flex flex-col gap-2 md:flex-row md:-mt-2">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsAddVoluntarioOpen(true)}
                  >
                    <UserPlus size={16} />
                    Adicionar Voluntário
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                    onClick={() => onNavigate?.('cadastrar-bolsista')}
                  >
                    <Plus size={16} />
                    Solicitar Bolsa
                  </button>
                </div>
              )}

              {activeTab === 'bolsistas' && !hideAddButton && !isExampleFlow && (
                <div ref={acoesMenuRef} className="relative md:-mt-2">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => setIsActionsMenuOpen((current) => !current)}
                  >
                    Ações
                    <ChevronDown size={18} />
                  </button>

                  {isActionsMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 overflow-hidden"
                      style={{
                        minWidth: '320px',
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 30,
                      }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors"
                        style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setIsActionsMenuOpen(false);
                          setIsAddVoluntarioOpen(true);
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, var(--popover))'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <UserPlus size={16} />
                        Adicionar Voluntário
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors"
                        style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setIsActionsMenuOpen(false);
                          onNavigate?.('cadastrar-bolsista');
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, var(--popover))'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Plus size={16} />
                        Solicitar Bolsa
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors"
                        style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setIsActionsMenuOpen(false);
                          onNavigate?.('solicitar-auxilio');
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, var(--popover))'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <HandCoins size={16} />
                        Solicitar Auxílio
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors"
                        style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setIsActionsMenuOpen(false);
                          setIsPermitScholarModalOpen(true);
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, var(--popover))'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Users size={16} />
                        Permitir Bolsista - Solicitar Bolsa
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            )}
          </>
        )}

        {/* Tab Bar Link - Horizontal for Desktop, Vertical for Mobile */}
        
        {!(isExampleFlow && selectedMemberPage) && !hideTabs && (
          <>
        {/* Desktop Tab Bar - Horizontal */}
        <div 
          className="hidden md:flex gap-1 mb-6"
          style={{
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => setActiveTab('informacoes')}
            style={{
              padding: '0.625rem 1rem',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: activeTab === 'informacoes' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'informacoes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s',
              marginBottom: '-1px',
            }}
          >
            Informações das Bolsas
          </button>
          <button
            onClick={() => setActiveTab('bolsistas')}
            style={{
              padding: '0.625rem 1rem',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: activeTab === 'bolsistas' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'bolsistas' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s',
              marginBottom: '-1px',
            }}
          >
            Bolsistas do Projeto
          </button>
          {showPaymentsTab && (
            <button
              onClick={() => setActiveTab('pagamentos')}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: activeTab === 'pagamentos' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'pagamentos' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s',
                marginBottom: '-1px',
              }}
            >
              Pagamentos
            </button>
          )}
        </div>

        {/* Mobile Tab Bar - Vertical */}
        <div 
          className="flex md:hidden flex-col mb-6"
          style={{
            borderLeft: '2px solid var(--border)',
          }}
        >
          <button
            onClick={() => setActiveTab('informacoes')}
            className="py-3 pl-4 text-left"
            style={{
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: activeTab === 'informacoes' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'informacoes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              marginLeft: '-2px',
            }}
          >
            Informações das Bolsas
          </button>
          <button
            onClick={() => setActiveTab('bolsistas')}
            className="py-3 pl-4 text-left"
            style={{
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: activeTab === 'bolsistas' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'bolsistas' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              marginLeft: '-2px',
            }}
          >
            Bolsistas do Projeto
          </button>
          {showPaymentsTab && (
            <button
              onClick={() => setActiveTab('pagamentos')}
              className="py-3 pl-4 text-left"
              style={{
                backgroundColor: 'transparent',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderLeft: activeTab === 'pagamentos' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'pagamentos' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                marginLeft: '-2px',
              }}
            >
              Pagamentos
            </button>
          )}
        </div>
          </>
        )}

        {isExampleFlow && selectedMemberPage && (
          <div className="space-y-6">
            <div
              className="flex gap-1"
              style={{
                borderBottom: '1px solid var(--border)',
              }}
            >
              <button
                onClick={() => setMemberPageTab('documentos')}
                style={{
                  padding: '0.625rem 1rem',
                  backgroundColor: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: memberPageTab === 'documentos' ? '2px solid var(--primary)' : '2px solid transparent',
                  color: memberPageTab === 'documentos' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                Documentos
              </button>
              <button
                onClick={() => setMemberPageTab('informacoes')}
                style={{
                  padding: '0.625rem 1rem',
                  backgroundColor: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: memberPageTab === 'informacoes' ? '2px solid var(--primary)' : '2px solid transparent',
                  color: memberPageTab === 'informacoes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                Informações
              </button>
              <button
                onClick={() => setMemberPageTab('historico')}
                style={{
                  padding: '0.625rem 1rem',
                  backgroundColor: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: memberPageTab === 'historico' ? '2px solid var(--primary)' : '2px solid transparent',
                  color: memberPageTab === 'historico' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                Histórico
              </button>
            </div>

            {memberPageTab === 'documentos' && renderDocumentsList(selectedMemberPage)}
            {memberPageTab === 'informacoes' && renderScholarshipInfo(selectedMemberPage)}
            {memberPageTab === 'historico' && renderScholarshipHistory()}
          </div>
        )}

        {/* Tab Content: Informações das Bolsas */}
        {!(isExampleFlow && selectedMemberPage) && activeTab === 'informacoes' && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Orçamento */}
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
              }}
            >
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '1rem',
                }}
              >
                Orçamento
              </p>
              <div className="space-y-3">
                <div>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      margin: 0,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                    }}
                  >
                    R$ 300.000
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      margin: 0,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Utilizado
                  </p>
                  <p
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                    }}
                  >
                    R$ 175.000
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      margin: 0,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Disponível
                  </p>
                  <p
                    style={{
                      color: 'var(--primary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                    }}
                  >
                    R$ 125.000,00
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bolsas Ativas */}
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Ativas
              </p>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    margin: 0,
                  }}
                >
                  60
                </p>
              </div>
            </div>

            {/* Alocado */}
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Alocadas
              </p>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    margin: 0,
                  }}
                >
                  82
                </p>
              </div>
            </div>

            {/* Utilizadas */}
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Utilizadas
              </p>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    margin: 0,
                  }}
                >
                  68
                </p>
              </div>
            </div>

            {/* Disponíveis */}
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Disponíveis
              </p>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    margin: 0,
                  }}
                >
                  14
                </p>
              </div>
            </div>
          </div>

          {/* Bolsas por Modalidade Card */}
          <div
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
            }}
          >
            {/* Header */}
            <h2
              style={{
                color: 'var(--foreground)',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              Bolsas por Modalidade
            </h2>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                margin: 0,
                marginBottom: '1.5rem',
              }}
            >
              Quantidade planejada vs utilizada por tipo de bolsa
            </p>

            {/* Modalidades List */}
            <div className="space-y-4">
              {[
                { name: 'BPIG-I', used: 2, total: 4, color: '#22d3ee' },
                { name: 'BPIG-II', used: 2, total: 3, color: '#22d3ee' },
                { name: 'BPIG-III', used: 1, total: 2, color: '#22d3ee' },
                { name: 'BPIG-IV', used: 0, total: 1, color: '#22d3ee' },
                { name: 'BPIG-V', used: 1, total: 2, color: '#22d3ee' },
                { name: 'BPIG-VI', used: 0, total: 0, color: '#22d3ee' },
                { name: 'BPIG-VII', used: 0, total: 0, color: '#22d3ee' },
                { name: 'BPIG-VIII', used: 0, total: 0, color: '#22d3ee' },
                { name: 'BPIG-IX', used: 0, total: 0, color: '#22d3ee' },
                { name: 'BPIG-X', used: 0, total: 0, color: '#22d3ee' },
              ].filter((modalidade) => !(modalidade.used === 0 && modalidade.total === 0)).map((modalidade, index) => {
                const available = modalidade.total - modalidade.used;
                const percentage = modalidade.total > 0 ? Math.round((modalidade.used / modalidade.total) * 100) : 0;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {modalidade.name}
                        </div>
                        <div
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {modalidade.used} de {modalidade.total} utilizadas
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {available > 0 && (
                          <span
                            style={{
                              padding: '0.25rem 0.625rem',
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              color: '#22c55e',
                              border: '1px solid rgba(34, 197, 94, 0.2)',
                              borderRadius: '9999px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {available} {available === 1 ? 'disponível' : 'disponíveis'}
                          </span>
                        )}
                        <span
                          style={{
                            padding: '0.25rem 0.625rem',
                            backgroundColor: `${modalidade.color}20`,
                            color: modalidade.color,
                            border: `1px solid ${modalidade.color}55`,
                            borderRadius: '9999px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-semibold)',
                            minWidth: '45px',
                            textAlign: 'center',
                          }}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'var(--muted)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: modalidade.color,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quantidade de Bolsas Card */}
          <div
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              marginTop: '1.5rem',
            }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <h2
                  style={{
                    color: 'var(--foreground)',
                    margin: 0,
                    marginBottom: '0.5rem',
                  }}
                >
                  Quantidade de Bolsas
                </h2>
                <p
                  style={{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    margin: 0,
                  }}
                >
                  Evolução mensal das bolsas ativas, entradas e saídas
                </p>
              </div>

              {/* Year Filter */}
              <div className="relative" style={{ minWidth: '120px' }}>
                <button
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <span>{selectedYear}</span>
                  <ChevronDown size={16} style={{ 
                    transform: isYearOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </button>
                
                {isYearOpen && (
                  <>
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 40,
                      }}
                      onClick={() => setIsYearOpen(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.25rem)',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        boxShadow: 'var(--elevation-sm)',
                        zIndex: 50,
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                    >
                      {['2024', '2025', '2026'].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setIsYearOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.625rem 1rem',
                            backgroundColor: selectedYear === year ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                            color: selectedYear === year ? 'var(--primary)' : 'var(--foreground)',
                            border: 'none',
                            fontSize: 'var(--text-sm)',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedYear !== year) {
                              e.currentTarget.style.backgroundColor = 'var(--muted)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedYear !== year) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <span>{year}</span>
                          {selectedYear === year && (
                            <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Chart */}
            <div 
              ref={periodChartRef}
              style={{
                width: '100%',
                height: '350px',
              }}
            />
          </div>
          </>
        )}

        {/* Tab Content: Bolsistas do Projeto */}
        {!(isExampleFlow && selectedMemberPage) && activeTab === 'bolsistas' && (
          <div className="w-full max-w-full" style={{ overflowX: 'hidden' }}>
        {/* Filters and Actions Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-4 w-full max-w-full">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <label
              style={{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }}
            >
              Pesquisar
            </label>
            <div className="relative">
              <div
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-foreground)',
                  pointerEvents: 'none',
                }}
              >
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.625rem 0.75rem',
                  paddingLeft: '2.5rem',
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="w-full md:w-48 min-w-0">
            <label
              style={{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }}
            >
              Data
            </label>
            <DatePicker
              selectedDate={cancelDate}
              onDateChange={setCancelDate}
              placeholder="Selecionar data"
            />
          </div>

          {/* Modalidade Filter */}
          <div className="w-full md:w-48 min-w-0">
            <label
              style={{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }}
            >
              Modalidade
            </label>
            <div className="relative">
              <button
                onClick={() => setIsModalidadeOpen(!isModalidadeOpen)}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.625rem 0.75rem',
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {selectedModalidade}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: isModalidadeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isModalidadeOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  {['Todos', 'BPIG-VII', 'BPIG-VI', 'BPIG-V', 'BPIG-IV', 'BPIG-III', 'BPIG-II', 'AUX-MOR'].map((modalidade) => (
                    <button
                      key={modalidade}
                      onClick={() => {
                        setSelectedModalidade(modalidade);
                        setIsModalidadeOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        backgroundColor: selectedModalidade === modalidade ? 'color-mix(in srgb, var(--primary) 16%, var(--popover))' : 'transparent',
                        color: 'var(--foreground)',
                        border: 'none',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s, color 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedModalidade !== modalidade) {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, var(--popover))';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedModalidade !== modalidade) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: selectedModalidade === modalidade ? 'var(--primary)' : 'transparent',
                          color: 'var(--primary-foreground)',
                          flexShrink: 0,
                        }}
                      >
                        {selectedModalidade === modalidade && <Check size={16} />}
                      </span>
                      {modalidade}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48 min-w-0">
            <label
              style={{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }}
            >
              Status
            </label>
            <div className="relative">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.625rem 0.75rem',
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {selectedStatus}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: isStatusOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isStatusOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  {['Todos', 'Em Andamento', 'Revisar', 'Doc. Pendente', 'Finalizada', 'Cancelada', 'Reprovada'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setIsStatusOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        backgroundColor: selectedStatus === status ? 'color-mix(in srgb, var(--primary) 16%, var(--popover))' : 'transparent',
                        color: 'var(--foreground)',
                        border: 'none',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s, color 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedStatus !== status) {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, var(--popover))';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedStatus !== status) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: selectedStatus === status ? 'var(--primary)' : 'transparent',
                          color: 'var(--primary-foreground)',
                          flexShrink: 0,
                        }}
                      >
                        {selectedStatus === status && <Check size={16} />}
                      </span>
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
        {/* Bolsistas List */}
        <div className="space-y-4 max-w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
              Mostrando {visibleMembersCount} resultados de {filteredMembers.length}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Download size={16} />
              Exportar CSV
            </button>
          </div>
          {/* Desktop Cards */}
          <div className="hidden md:block space-y-4">
            {currentMembers.map((member) => (
              <div 
                key={member.id}
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                {/* Card Header - Clicável */}
                <div 
                  className={hideExpandable ? 'p-5' : 'p-5 cursor-pointer'}
                  onClick={hideExpandable ? undefined : () => handleMemberRowClick(member)}
                >
                  <div className="grid grid-cols-12 gap-x-12 items-center">
                    {!hideExpandable && !isExampleFlow && (
                      <div className="col-span-1 flex items-center">
                        <ChevronDown
                          size={16}
                          style={{
                            color: 'var(--muted-foreground)',
                            transform: expandedBolsistaId === member.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      </div>
                    )}

                    {/* Nome */}
                    <div className="col-span-3" style={!hideExpandable && !isExampleFlow ? { marginLeft: '-2.5rem' } : undefined}>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Nome
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {member.name}
                      </div>
                    </div>

                    {/* Início */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Início
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        {member.startDate}
                      </div>
                    </div>

                    {/* Término */}
                    <div className="col-span-2">
                      <div 
                        style={{ 
                          color: 'var(--muted-foreground)', 
                          fontSize: 'var(--text-xs)', 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        Término
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.125rem',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--primary)',
                          }}
                          title={sortOrder === 'recent' ? 'Ordenar por mais antigo' : 'Ordenar por mais recente'}
                        >
                          {sortOrder === 'recent' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                        </button>
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        {member.type === 'Voluntário' ? '-' : member.endDate}
                      </div>
                    </div>

                    {/* Modalidade */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Modalidade
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        {member.type}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Status
                      </div>
                      <span
                        className="inline-flex items-center px-3 py-1"
                        style={{
                          ...getStatusStyles(member.status),
                          borderRadius: '9999px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.status}
                      </span>
                    </div>

                    {!hideExpandable && isExampleFlow && (
                      <div className="col-span-1 flex justify-end">
                        <ChevronRight
                          size={18}
                          style={{
                            color: 'var(--muted-foreground)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {!hideExpandable && expandedBolsistaId === member.id && (
                  <div 
                    className="px-5 pb-5"
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '1.25rem',
                    }}
                  >
                    {/* Documentos Solicitados Section */}
                    <div>
                      {/* Section Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          Documentos Solicitados
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1.5 transition-colors"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--foreground)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMemberForDetails(member);
                              setIsDetailsModalOpen(true);
                              setDetailsTab('informacoes');
                            }}
                          >
                            {expandedBolsistaId === member.id ? (isAuxilio(member) ? 'Detalhes do Auxílio' : 'Detalhes da Bolsa') : 'Ver Detalhes'}
                          </button>
                          <button
                            className="px-3 py-1.5 transition-colors"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--foreground)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (expandedBolsistaId === member.id) {
                                if (member.status === 'Doc. Pendente') {
                                  setSelectedMemberForCancelRequest(member);
                                  setIsCancelRequestModalOpen(true);
                                } else {
                                  setSelectedMemberForCancel(member);
                                  setIsCancelModalOpen(true);
                                }
                              }
                            }}
                          >
                            {expandedBolsistaId === member.id
                              ? (member.status === 'Doc. Pendente' ? 'Excluir Solicitação' : (isAuxilio(member) ? 'Cancelar Auxílio' : 'Cancelar Bolsa'))
                              : (isAuxilio(member) ? 'Editar Auxílio' : 'Editar Bolsa')}
                          </button>
                        </div>
                      </div>

                      {member.status === 'Revisar' && (
                        <div
                          className="mb-4 flex items-start gap-3 p-3"
                          style={{
                            backgroundColor: 'rgba(234, 179, 8, 0.1)',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            borderRadius: 'var(--radius)',
                            color: 'rgb(234, 179, 8)',
                            fontSize: 'var(--text-sm)',
                            lineHeight: 1.5,
                          }}
                        >
                          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                          <span>Diploma de Nível Médio Recusado. Falta o verso do documento. Reenviar em até X dias.</span>
                        </div>
                      )}

                      {/* Documents List */}
                      <div className="space-y-3">
                          {member.documents.map((doc) => {
                            const statusColors = getDocumentStatusColor(doc.status);
                            return (
                              <div 
                                key={doc.id}
                                style={{
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  padding: '1rem',
                                }}
                              >
                                <div className="grid grid-cols-12 gap-4">
                                  {/* Requisito */}
                                  <div className="col-span-3">
                                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                      Requisito
                                    </div>
                                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                                      {doc.requisito}
                                    </div>
                                  </div>

                                  {/* Documento */}
                                  <div className="col-span-4">
                                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                      Documento
                                    </div>
                                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                                      {doc.documento}
                                    </div>
                                  </div>

                                  {/* Data de Envio */}
                                  <div className="col-span-3" style={{ marginLeft: '4rem' }}>
                                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                      Data de Envio
                                    </div>
                                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                                      {doc.dataEnvio}
                                    </div>
                                  </div>

                                  {/* Status */}
                                  <div className="col-span-2">
                                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                      Status
                                    </div>
                                    <span
                                      className="inline-flex items-center px-2.5 py-1"
                                      style={{
                                        backgroundColor: statusColors.bg,
                                        color: statusColors.color,
                                        border: `1px solid ${statusColors.border}`,
                                        borderRadius: '9999px',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 'var(--font-weight-medium)',
                                      }}
                                    >
                                      {doc.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 max-w-full">
            {currentMembers.map((member) => (
              <div 
                key={member.id}
                className="max-w-full overflow-hidden"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div 
                  className={hideExpandable ? 'p-4 max-w-full' : 'p-4 cursor-pointer max-w-full'}
                  onClick={hideExpandable ? undefined : () => handleMemberRowClick(member)}
                  style={{ boxSizing: 'border-box' }}
                >
                  {/* Header: Nome and Status */}
                  <div className="flex justify-between items-start mb-3 gap-2 max-w-full">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {!hideExpandable && !isExampleFlow && (
                        <div className="mt-1 flex-shrink-0">
                          <ChevronDown
                            size={16}
                            style={{
                              color: 'var(--muted-foreground)',
                              transform: expandedBolsistaId === member.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Nome
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', wordBreak: 'break-word' }}>
                          {member.name}
                        </div>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center px-2 py-0.5 flex-shrink-0"
                      style={{
                        ...getStatusStyles(member.status),
                        borderRadius: '9999px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {member.status}
                    </span>
                    {!hideExpandable && isExampleFlow && (
                      <ChevronRight
                        size={18}
                        style={{
                          color: 'var(--muted-foreground)',
                          flexShrink: 0,
                          marginTop: '0.125rem',
                        }}
                      />
                    )}
                  </div>

                  {/* Período de Vigência */}
                  <div className={!hideExpandable && !isExampleFlow ? 'mb-3 ml-6' : 'mb-3'}>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                      Período de Vigência
                    </div>
                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      {member.startDate} - {member.type === 'Voluntário' ? '-' : member.endDate}
                    </div>
                  </div>

                  {/* Modalidade */}
                  <div className={!hideExpandable && !isExampleFlow ? 'ml-6' : undefined}>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                      Modalidade
                    </div>
                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      {member.type}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {!hideExpandable && expandedBolsistaId === member.id && (
                  <div 
                    className="px-4 pb-4 max-w-full"
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '1rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Documentos Solicitados Section */}
                    <div>
                      {/* Section Header */}
                      <div className="mb-4">
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          Documentos Solicitados
                        </div>
                      </div>

                      {member.status === 'Revisar' && (
                        <div
                          className="mb-4 flex items-start gap-3 p-3"
                          style={{
                            backgroundColor: 'rgba(234, 179, 8, 0.1)',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            borderRadius: 'var(--radius)',
                            color: 'rgb(234, 179, 8)',
                            fontSize: 'var(--text-sm)',
                            lineHeight: 1.5,
                          }}
                        >
                          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                          <span>Diploma de Nível Médio Recusado. Falta o verso do documento. Reenviar em até X dias.</span>
                        </div>
                      )}

                      {/* Documents List */}
                      <div className="space-y-3 mb-4 max-w-full">
                        {member.documents.map((doc) => {
                          const statusColors = getDocumentStatusColor(doc.status);
                          return (
                            <div 
                              key={doc.id}
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                padding: '0.75rem',
                              }}
                            >
                              <div className="space-y-3">
                                {/* Requisito */}
                                <div>
                                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                                    Requisito
                                  </div>
                                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                                    {doc.requisito}
                                  </div>
                                </div>

                                {/* Documento */}
                                <div>
                                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                                    Documento
                                  </div>
                                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                                    {doc.documento}
                                  </div>
                                </div>

                                {/* Data de Envio */}
                                <div>
                                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                                    Data de Envio
                                  </div>
                                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                                    {doc.dataEnvio}
                                  </div>
                                </div>

                                {/* Status */}
                                <div>
                                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                                    Status
                                  </div>
                                  <span
                                    className="inline-flex items-center px-2.5 py-1"
                                    style={{
                                      backgroundColor: statusColors.bg,
                                      color: statusColors.color,
                                      border: `1px solid ${statusColors.border}`,
                                      borderRadius: '9999px',
                                      fontSize: 'var(--text-xs)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {doc.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Buttons - Mobile */}
                      <div className="flex flex-col gap-2">
                        <button
                          className="w-full px-3 py-2 transition-colors"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMemberForDetails(member);
                            setIsDetailsModalOpen(true);
                            setDetailsTab('informacoes');
                          }}
                        >
                          {isAuxilio(member) ? 'Detalhes do Auxílio' : 'Detalhes da Bolsa'}
                        </button>
                        <button
                          className="w-full px-3 py-2 transition-colors"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (member.status === 'Doc. Pendente') {
                              setSelectedMemberForCancelRequest(member);
                              setIsCancelRequestModalOpen(true);
                            } else {
                              setSelectedMemberForCancel(member);
                              setIsCancelModalOpen(true);
                            }
                          }}
                        >
                          {member.status === 'Doc. Pendente' ? 'Excluir Solicitação' : (isAuxilio(member) ? 'Cancelar Auxílio' : 'Cancelar Bolsa')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ListPagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </div>
        </div>
        )}

        {!(isExampleFlow && selectedMemberPage) && activeTab === 'pagamentos' && (
          <PaymentsPage scope="project" embedded />
        )}
      </section>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedMemberForDetails && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setIsDetailsModalOpen(false)}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              zIndex: 1000,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    color: 'var(--primary)',
                  }}
                >
                  <GraduationCap size={24} />
                </div>
                <h2 style={{ color: 'var(--foreground)', margin: 0 }}>
                  {selectedMemberForDetails && isAuxilio(selectedMemberForDetails) ? 'Detalhes do Auxílio' : 'Detalhes da Bolsa'}
                </h2>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div
              className="flex gap-2 px-6"
              style={{
                borderBottom: '1px solid var(--border)',
              }}
            >
              <button
                onClick={() => setDetailsTab('informacoes')}
                className="px-4 py-2 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: detailsTab === 'informacoes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  border: 'none',
                  borderBottom: detailsTab === 'informacoes' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                }}
              >
                Informações
              </button>
              <button
                onClick={() => setDetailsTab('aprovacao')}
                className="px-4 py-2 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: detailsTab === 'aprovacao' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  border: 'none',
                  borderBottom: detailsTab === 'aprovacao' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                }}
              >
                Aprovação FAPES
              </button>
              <button
                onClick={() => setDetailsTab('historico')}
                className="px-4 py-2 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: detailsTab === 'historico' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  border: 'none',
                  borderBottom: detailsTab === 'historico' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                }}
              >
                Histórico
              </button>
            </div>

            {/* Modal Content */}
            {detailsTab === 'informacoes' && (
              <div className="p-6 space-y-6">
                {/* Profile Section */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.5rem' }}>
                      {selectedMemberForDetails.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <line x1="9" y1="3" x2="9" y2="21"/>
                        </svg>
                        123.456.789-00
                      </div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                        {selectedMemberForDetails.email}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className="inline-flex items-center px-2.5 py-1"
                        style={{
                          backgroundColor: 'var(--muted)',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                          borderRadius: '9999px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Iniciação Científica
                      </span>
                      <span
                        className="inline-flex items-center px-2.5 py-1"
                        style={{
                          ...getStatusStyles(selectedMemberForDetails.status),
                          borderRadius: '9999px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {selectedMemberForDetails.status}
                      </span>
                      <span
                        className="inline-flex items-center px-2.5 py-1"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          color: '#22c55e',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '9999px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        Aprovada pela FAPES
                      </span>
                    </div>
                  </div>

                  {/* Valor da Bolsa */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 1 }}>
                      R$ 700,00
                    </div>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>
                      por mês
                    </div>
                  </div>
                </div>

                {/* Orientador e Período da Bolsa - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Orientador */}
                  <div
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                      <User size={16} />
                      Orientador
                    </div>
                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      Dr. Maria Silva
                    </div>
                  </div>

                  {/* Período da Bolsa */}
                  <div
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                      <Calendar size={16} />
                      Período da Bolsa
                    </div>
                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      {selectedMemberForDetails.startDate} até {selectedMemberForDetails.endDate}
                    </div>
                  </div>
                </div>

                {/* Plano de Trabalho */}
                <div
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                    minHeight: '9rem',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    <FileText size={16} />
                    Plano de Trabalho
                  </div>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 0 }}>
                    Desenvolvimento de algoritmos de machine learning para análise de imagens médicas, com foco em detecção precoce de anomalias em radiografias torácicas.
                  </p>
                </div>

                {/* Objetivos */}
                <div
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    <Target size={16} />
                    Objetivos
                  </div>
                  <ol style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem' }}>
                    <li>Estudar técnicas de deep learning aplicadas à área médica</li>
                    <li>Desenvolver modelos de classificação de imagens</li>
                    <li>Validar resultados com especialistas da área de saúde</li>
                  </ol>
                </div>
              </div>
            )}

            {detailsTab === 'historico' && (
              <div className="p-6">
                <div
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    <ClipboardList size={16} />
                    Registro
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Usuário que solicitou a bolsa
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Dra. Maria Silva
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Data da Solicitação da Bolsa
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        09/02/2026 às 14:35
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Data do Aceite do Bolsista
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        12/02/2026 às 09:18
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailsTab === 'aprovacao' && (
              <div className="p-6 space-y-6">
                {/* Status FAPES Header */}
                <div className="flex items-center gap-3">
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    Status FAPES:
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Aprovada pela FAPES
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative" style={{ paddingLeft: '4.5rem' }}>
                  {/* Vertical Line - Centered with icons */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '2rem',
                      top: '1rem',
                      height: '8rem',
                      width: '3px',
                      backgroundColor: 'var(--primary)',
                    }}
                  />

                  {/* Timeline Events */}
                  <div className="space-y-8">
                    {/* Event 1 - Solicitação Enviada */}
                    <div className="relative">
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center"
                        style={{
                          position: 'absolute',
                          left: '-3.5rem',
                          top: 0,
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          backgroundColor: 'var(--background)',
                          border: '3px solid var(--primary)',
                          color: 'var(--primary)',
                        }}
                      >
                        <Send size={14} />
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                            Solicitação Enviada
                          </h4>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                            09/02/2024
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                          <User size={14} />
                          <span>Dr. Maria Silva · Coordenador</span>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                          Solicitação de bolsa de IC para o aluno João Santos
                        </p>
                      </div>
                    </div>

                    {/* Event 2 - Aprovada pelo Gerente */}
                    <div className="relative">
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center"
                        style={{
                          position: 'absolute',
                          left: '-3.5rem',
                          top: 0,
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          backgroundColor: 'var(--background)',
                          border: '3px solid var(--primary)',
                          color: 'var(--primary)',
                        }}
                      >
                        <CheckCircle size={14} />
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                            Aprovada pelo Gerente
                          </h4>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                            19/02/2024
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                          <User size={14} />
                          <span>Carlos Mendes · Gerente FAPES</span>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                          Documentação completa. Aprovado conforme edital.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && selectedMemberForCancel && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => {
              setIsCancelModalOpen(false);
              setCancelJustification('');
              setCancelDate('');
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'visible',
              zIndex: 1000,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Header */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
                  Cancelar bolsa
                </h1>
                <button
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setCancelJustification('');
                    setCancelDate('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    color: 'var(--muted-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Alert Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  lineHeight: '1.5',
                  marginBottom: '0.75rem',
                }}>
                  Tem certeza que deseja cancelar a bolsa de <strong>{selectedMemberForCancel.name}</strong>? Essa ação é irreversível.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Justificativa */}
                <div>
                  <label
                    htmlFor="cancel-justification"
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Justificativa do cancelamento *
                  </label>
                  <textarea
                    id="cancel-justification"
                    value={cancelJustification}
                    onChange={(e) => setCancelJustification(e.target.value)}
                    placeholder="Digite aqui a justificativa"
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Data */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Último dia de atividades *
                  </label>
                  <DatePicker
                    value={cancelDate}
                    onChange={setCancelDate}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                
                {/* Observation Text */}
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  lineHeight: '1.5',
                  marginTop: '1rem',
                }}>
                  <strong>Observação:</strong> se o cancelamento da bolsa for feito após o dia 15, o bolsista irá receber o pagamento deste mês.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setCancelJustification('');
                    setCancelDate('');
                  }}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Handle cancellation logic here
                    console.log('Cancelar bolsa:', {
                      member: selectedMemberForCancel.name,
                      justification: cancelJustification,
                      date: cancelDate,
                    });
                    setIsCancelModalOpen(false);
                    setCancelJustification('');
                    setCancelDate('');
                  }}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--background)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                  }}
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
          </div>
        </>
      )}

      {/* Cancel Request Modal */}
      {isCancelRequestModalOpen && selectedMemberForCancelRequest && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => {
              setIsCancelRequestModalOpen(false);
              setSelectedMemberForCancelRequest(null);
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--card)',
              borderRadius: 'var(--radius)',
              width: '90%',
              maxWidth: '500px',
              zIndex: 1000,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ 
                  color: 'var(--foreground)', 
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  margin: 0 
                }}>
                  Excluir Solicitação
                </h2>
                <button
                  onClick={() => {
                    setIsCancelRequestModalOpen(false);
                    setSelectedMemberForCancelRequest(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    color: 'var(--muted-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Message */}
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: '1.5',
                marginBottom: '1.5rem',
              }}>
                Tem certeza que deseja excluir essa solicitação de bolsa do bolsista <strong>{selectedMemberForCancelRequest.name}</strong>?
              </p>

              {/* Footer */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsCancelRequestModalOpen(false);
                    setSelectedMemberForCancelRequest(null);
                  }}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                  }}
                >
                  Não, voltar
                </button>
                <button
                  onClick={() => {
                    const memberName = selectedMemberForCancelRequest.name;
                    // Remove the member from the list
                    setTeamMembers(teamMembers.filter(m => m.id !== selectedMemberForCancelRequest.id));
                    setIsCancelRequestModalOpen(false);
                    setSelectedMemberForCancelRequest(null);
                    toast.success('Solicitação cancelada com sucesso!', {
                      description: `A solicitação de bolsa de ${memberName} foi cancelada.`,
                    });
                  }}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--background)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                  }}
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedVolunteerToFinish && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
            onClick={() => {
              setSelectedVolunteerToFinish(null);
              setVolunteerEndDate('');
              setVolunteerDetailsTab('informacoes');
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              width: '90%',
              maxWidth: '520px',
              zIndex: 1000,
              boxShadow: 'var(--elevation-sm)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '1.25rem' }}>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <UserPlus size={22} />
                  </div>
                  <div>
                    <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
                      Finalizar Voluntariado
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: '0.15rem 0 0 0', fontFamily: 'var(--font-family)' }}>
                      {selectedVolunteerToFinish.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedVolunteerToFinish(null);
                    setVolunteerEndDate('');
                    setVolunteerDetailsTab('informacoes');
                  }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', flexShrink: 0, transition: 'all 0.15s' }}
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setVolunteerDetailsTab('informacoes')}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: volunteerDetailsTab === 'informacoes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                    border: 'none',
                    borderBottom: volunteerDetailsTab === 'informacoes' ? '2px solid var(--primary)' : '2px solid transparent',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  Informações
                </button>
                <button
                  type="button"
                  onClick={() => setVolunteerDetailsTab('historico')}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: volunteerDetailsTab === 'historico' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                    border: 'none',
                    borderBottom: volunteerDetailsTab === 'historico' ? '2px solid var(--primary)' : '2px solid transparent',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  Histórico
                </button>
              </div>

              {volunteerDetailsTab === 'informacoes' && (
                <>
                  <div className="mb-5">
                    <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
                      CPF do Voluntário <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value="000.000.000-00"
                      readOnly
                      style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--input-background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
                    />
                  </div>

                  <div className="mb-5">
                    <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
                      Data de Fim <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
                    </label>
                    <DatePicker
                      value={volunteerEndDate}
                      onChange={setVolunteerEndDate}
                      placeholder="Selecione a data de fim"
                    />
                  </div>

                  <div
                    className="flex items-start gap-2 px-3 py-2"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <Info size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
                      Após finalizar o voluntariado, o membro do projeto não irá mais aparecer na lista para solicitar Diária e Passagem.
                    </span>
                  </div>

                  <div className="flex justify-end gap-3" style={{ marginTop: '1.5rem' }}>
                    <button
                      onClick={() => {
                        setSelectedVolunteerToFinish(null);
                        setVolunteerEndDate('');
                        setVolunteerDetailsTab('informacoes');
                      }}
                      style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleFinishVolunteering}
                      style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
                    >
                      Finalizar Voluntariado
                    </button>
                  </div>
                </>
              )}

              {volunteerDetailsTab === 'historico' && (
                <div
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Usuário que Solicitou a Bolsa
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Dra. Maria Silva
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Data da Solicitação da Bolsa
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        09/02/2026 às 14:35
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Data do Aceite do Bolsista
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        12/02/2026 às 09:18
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isPermitScholarModalOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => {
              setIsPermitScholarModalOpen(false);
              setSelectedScholarCpf('');
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              width: '90%',
              maxWidth: '560px',
              zIndex: 1000,
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '1.25rem' }}>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <Users size={22} />
                  </div>
                  <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
                    Permitir Bolsista - Solicitar Bolsa
                  </h1>
                </div>
                <button
                  onClick={() => {
                    setIsPermitScholarModalOpen(false);
                    setSelectedScholarCpf('');
                  }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.6,
                  margin: '0 0 1.25rem',
                }}
              >
                O coordenador do projeto pode permitir que um bolsista da sua equipe tenha acesso as funcionalidade de Minha Equipe e possa Adicionar Voluntário e Solicitar Bolsa. Selecione o bolsista que deseja oferecer esse acesso.
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
                  CPF do Bolsista
                </label>
                <select
                  value={selectedScholarCpf}
                  onChange={(event) => setSelectedScholarCpf(event.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    backgroundColor: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <option value="">Selecione o CPF do bolsista</option>
                  <option value="123.456.789-00">123.456.789-00 - Sofia de Alcantara Silva</option>
                  <option value="234.567.890-11">234.567.890-11 - Vinícius de Jesus Estevam</option>
                  <option value="345.678.901-22">345.678.901-22 - Camila Rocha</option>
                </select>
              </div>

              <div
                className="flex items-start gap-2 px-3 py-2"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                  border: '1px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '1.5rem',
                }}
              >
                <Info size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
                  O bolsita deve entrar em sua conta e aceitar o convite.
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsPermitScholarModalOpen(false);
                    setSelectedScholarCpf('');
                  }}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setIsPermitScholarModalOpen(false);
                    setSelectedScholarCpf('');
                    toast.success('Convite enviado ao bolsista.');
                  }}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isAddVoluntarioOpen && (
        <AdicionarVoluntario
          onClose={() => setIsAddVoluntarioOpen(false)}
          onAdd={handleAddVoluntario}
        />
      )}
    </div>
  );
}
