import {
  AlertTriangle,
  CheckCircle,
  Upload, Paperclip, FileText, Edit2, Trash2,
  ChevronDown, Check, Info, Search, X, Send, Plus, Save, Trash, RotateCcw, DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Payment {
  tipo: string;
  operacao?: string;
  classificacao?: string;
  valor: string;
  data: string;
  cnpj: string;
  status: string;
  statusColor: { bg: string; color: string; border: string };
  origemTerceiro?: string;
  debitoEstornado?: string;
  creditoEstorno?: string;
  prestacaoAssociada?: string;
  situacaoPrestacao?: string;
  modoAssociacao?: string;
  situacaoDebito?: string;
  efeitoLiquido?: string;
  debitoOriginal?: string;
  valorOriginal?: string;
  valorDevolvido?: string;
  valorResidual?: string;
  comprovanteObrigatorio?: string;
}
interface FinanceiraDetalhesProps {
  payment: Payment;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface DiariaPrestacao {
  solicitacaoRef: string;
  nome: string;
  tipo: string;
  valorUnit: string;
  numDiarias: string;
  valorTotal: string;
  origem: string;
  destino: string;
  dataSaida: string;
  horarioSaida: string;
  dataChegada: string;
  horarioChegada: string;
  status: string;
  prestadaContas: boolean;
}

// Mock data para tabela de diárias
const mockDiarias: DiariaPrestacao[] = [
  { solicitacaoRef: 'SD-2026-001', nome: 'Ana Carolina Silva', tipo: 'Nacional - Dentro do Estado', valorUnit: 'R$ 260,00', numDiarias: '3', valorTotal: 'R$ 780,00', origem: 'Vila Velha', destino: 'Vitória', dataSaida: '15/03/2026', horarioSaida: '08:00', dataChegada: '18/03/2026', horarioChegada: '17:00', status: 'Aprovada', prestadaContas: false },
  { solicitacaoRef: 'SD-2026-002', nome: 'Carlos Eduardo Rocha', tipo: 'Nacional - Fora do Estado', valorUnit: 'R$ 320,00', numDiarias: '5', valorTotal: 'R$ 1.600,00', origem: 'Vitória', destino: 'São Paulo', dataSaida: '20/03/2026', horarioSaida: '06:30', dataChegada: '25/03/2026', horarioChegada: '20:00', status: 'Aprovada', prestadaContas: false },
  { solicitacaoRef: 'SD-2026-003', nome: 'Fernanda Martins', tipo: 'Internacional', valorUnit: 'R$ 620,00', numDiarias: '7', valorTotal: 'R$ 4.340,00', origem: 'Vitória', destino: 'Lisboa', dataSaida: '10/04/2026', horarioSaida: '14:00', dataChegada: '17/04/2026', horarioChegada: '22:30', status: 'Aprovada', prestadaContas: true },
  { solicitacaoRef: 'SD-2026-004', nome: 'Roberto Oliveira', tipo: 'Nacional - Fora do Estado', valorUnit: 'R$ 320,00', numDiarias: '4', valorTotal: 'R$ 1.280,00', origem: 'Vitória', destino: 'Rio de Janeiro', dataSaida: '05/05/2026', horarioSaida: '07:00', dataChegada: '09/05/2026', horarioChegada: '19:00', status: 'Aprovada', prestadaContas: false },
  { solicitacaoRef: 'SD-2026-005', nome: 'Beatriz Costa', tipo: 'Nacional - Dentro do Estado', valorUnit: 'R$ 260,00', numDiarias: '2', valorTotal: 'R$ 520,00', origem: 'Vitória', destino: 'Cachoeiro', dataSaida: '12/05/2026', horarioSaida: '09:00', dataChegada: '14/05/2026', horarioChegada: '16:00', status: 'Aprovada', prestadaContas: false },
];

const tiposViagemDiaria = [
  { codigo: 'TVI-001', nome: 'Dentro do Estado', abrangencia: 'Nacional' },
  { codigo: 'TVI-002', nome: 'Fora do Estado', abrangencia: 'Nacional' },
  { codigo: 'TVI-003', nome: 'Internacional', abrangencia: 'Internacional' },
];

const diariasVigentesPrestacao = [
  { codigo: 'DIA-2026-001', tipoViagem: 'Dentro do Estado', valor: 260, fracaoCalculo: '12h' },
  { codigo: 'DIA-2026-002', tipoViagem: 'Fora do Estado', valor: 320, fracaoCalculo: '12h' },
  { codigo: 'DIA-2026-003', tipoViagem: 'Internacional', valor: 620, fracaoCalculo: '24h' },
];

function calcularQuantidadeDiarias(partida: string, chegada: string) {
  if (!partida || !chegada) return 0;

  const inicioData = new Date(partida);
  const fimData = new Date(chegada);
  const inicio = inicioData.getTime();
  const fim = fimData.getTime();
  if (!Number.isFinite(inicio) || !Number.isFinite(fim) || fim <= inicio) return 0;

  const horas = (fim - inicio) / 36e5;
  if (horas < 6) return 0;

  const diaInicio = new Date(inicioData.getFullYear(), inicioData.getMonth(), inicioData.getDate()).getTime();
  const diaFim = new Date(fimData.getFullYear(), fimData.getMonth(), fimData.getDate()).getTime();
  const diasFora = Math.round((diaFim - diaInicio) / 86400000);

  if (diasFora <= 0) return 0.5;

  const horaRetorno = fimData.getHours() + fimData.getMinutes() / 60;

  return diasFora + (horaRetorno > 14 ? 0.5 : 0);
}

function relatorioEnviadoPrestacaoDiaria(diaria: Pick<DiariaPrestacao, 'prestadaContas'>) {
  return diaria.prestadaContas ? 'Sim' : 'Não';
}

function formatarData(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

function formatarHora(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function formatarMoeda(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

/* ─── helpers ──────────────────────────────────────────────── */
const PESSOAS_FICTICIAS = [
  'Marcela Starling', 'João Paulo Silva', 'Ana Lima',
  'Carlos Eduardo Rocha', 'Fernanda Martins', 'Roberto Oliveira',
  'Patrícia Santos', 'Rodrigo Almeida', 'Beatriz Costa', 'Lucas Ferreira',
];


/* small inline helpers */
const labelSt: React.CSSProperties = {
  display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)',
};
const inputSt = (disabled?: boolean): React.CSSProperties => ({
  width: '100%', padding: '0.625rem 0.75rem',
  backgroundColor: 'transparent',
  color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
  border: '1px solid var(--border)', borderRadius: 'var(--radius)',
  fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
  outline: 'none', cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.7 : 1,
});

/* ─── component ─────────────────────────────────────────────── */
export function FinanceiraDetalhes({ payment, onBack, onNavigate }: FinanceiraDetalhesProps) {
  useLanguage();
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const contestacaoFileInputRef = useRef<HTMLInputElement>(null);
  const cotacaoInputRef  = useRef<HTMLInputElement>(null);
  const benefSearch      = useRef<HTMLInputElement>(null);
  const passSearch       = useRef<HTMLInputElement>(null);

  const isReadOnly = payment.status !== 'Pendente';
  const isCreditoEstorno = payment.operacao === 'CREDITO' && payment.classificacao === 'ESTORNO';
  const isCreditoDevolucao = payment.operacao === 'CREDITO' && payment.classificacao === 'DEVOLUCAO';
  const [estornoAssociado, setEstornoAssociado] = useState(false);
  const [devolucaoComprovanteAnexado, setDevolucaoComprovanteAnexado] = useState(false);
  const [devolucaoAssociada, setDevolucaoAssociada] = useState(false);
  const [justificativaReprovacao, setJustificativaReprovacao] = useState('');
  const [arquivoContestacao, setArquivoContestacao] = useState('');
  const [contestacaoArquivoExpandido, setContestacaoArquivoExpandido] = useState(false);

  /* ── Step 1 ── */
  const [selectedDocumento, setSelectedDocumento] = useState('');
  const [isDocumentoOpen,   setIsDocumentoOpen]   = useState(false);

  // Associar Compra - arrays para múltiplos itens
  const [selectedCategoriasItem, setSelectedCategoriasItem] = useState<string[]>(['']);
  const [openCategoriaIdx, setOpenCategoriaIdx] = useState<number | null>(null);
  const [selectedItensEdital, setSelectedItensEdital] = useState<string[]>(['']);
  const [openItemIdx, setOpenItemIdx] = useState<number | null>(null);

  // Diária
  const [selectedDiariaIdx, setSelectedDiariaIdx] = useState<number | null>(null);
  const [diariasPrestacao, setDiariasPrestacao] = useState<DiariaPrestacao[]>(mockDiarias);
  const [isCriarDiariaModalOpen, setIsCriarDiariaModalOpen] = useState(false);
  const [novaDiariaBolsistas, setNovaDiariaBolsistas] = useState<string[]>([PESSOAS_FICTICIAS[0]]);
  const [novaDiariaBeneficiarioSearch, setNovaDiariaBeneficiarioSearch] = useState('');
  const [novaDiariaTipo, setNovaDiariaTipo] = useState('Dentro do Estado');
  const [novaDiariaPartida, setNovaDiariaPartida] = useState('2026-06-20T08:00');
  const [novaDiariaChegada, setNovaDiariaChegada] = useState('2026-06-21T18:00');
  const [novaDiariaDestino, setNovaDiariaDestino] = useState('Vitória');
  const [novaDiariaMotivo, setNovaDiariaMotivo] = useState('');

  // Passagem
  const [passQuery,    setPassQuery]    = useState('');
  const [passageiro,   setPassageiro]   = useState('');
  const [isPassOpen,   setIsPassOpen]   = useState(false);
  const [localizador,  setLocalizador]  = useState('');
  const [valorPassagemComprada, setValorPassagemComprada] = useState('');
  const [dataEmissao,  setDataEmissao]  = useState('');
  const [passOrigem,   setPassOrigem]   = useState('');
  const [passDestino,  setPassDestino]  = useState('');
  const [dataSaida,    setDataSaida]    = useState('');
  const [horaSaida,    setHoraSaida]    = useState('');
  const [dataChegada,  setDataChegada]  = useState('');
  const [horaChegada,  setHoraChegada]  = useState('');

  // Nota Fiscal
  const [isNFExpanded, setIsNFExpanded] = useState(false);
  const [nfChave, setNFChave] = useState('35240112345678000190550010000123451234567890');
  const [nfDataEmissao, setNFDataEmissao] = useState('15/03/2026');
  const [nfCNPJ, setNFCNPJ] = useState('12.345.678/0001-90');
  const [nfUF, setNFUF] = useState('ES');
  const [nfICMS, setNFICMS] = useState('R$ 450,00');
  const [nfPIS, setNFPIS] = useState('R$ 65,40');
  const [nfIPI, setNFIPI] = useState('R$ 0,00');
  const [nfISS, setNFISS] = useState('R$ 0,00');
  const nfItens = [
    { descricao: 'Monitor LCD 27" Full HD', quantidade: '2', valorUnit: 'R$ 850,00', valorTotal: 'R$ 1.700,00' },
    { descricao: 'Teclado Mecânico RGB', quantidade: '2', valorUnit: 'R$ 450,00', valorTotal: 'R$ 900,00' },
    { descricao: 'Mouse Gamer', quantidade: '2', valorUnit: 'R$ 200,00', valorTotal: 'R$ 400,00' },
  ];

  // Descrição
  const [descricao, setDescricao] = useState('');
  const maxDesc = 250;

  /* ── Step 2 ── */
  const [isDragging,       setIsDragging]        = useState(false);
  const [uploadedFiles,    setUploadedFiles]     = useState<File[]>([]);
  const [fileNames,        setFileNames]         = useState<string[]>([]);
  const [editingFileIdx,   setEditingFileIdx]    = useState<number | null>(null);
  const [tempFileName,     setTempFileName]      = useState('');
  const [expandedFileIdx,  setExpandedFileIdx]   = useState<number | null>(null);
  const [filePreviewUrls,  setFilePreviewUrls]   = useState<(string | null)[]>([]);

  /* ── Step 3 ── */
  const [isDraggingCotacao,    setIsDraggingCotacao]    = useState(false);
  const [cotacaoFiles,         setCotacaoFiles]          = useState<File[]>([]);
  const [cotacaoFileNames,     setCotacaoFileNames]      = useState<string[]>([]);
  const [editingCotacaoIdx,    setEditingCotacaoIdx]     = useState<number | null>(null);
  const [tempCotacaoName,      setTempCotacaoName]       = useState('');
  const [expandedCotacaoIdx,   setExpandedCotacaoIdx]    = useState<number | null>(null);
  const [cotacaoPreviewUrls,   setCotacaoPreviewUrls]    = useState<(string | null)[]>([]);
  const [selectedCotacaoIdx,   setSelectedCotacaoIdx]    = useState(0);

  /* ── data lists ─────────────────────────────── */
  const documentos = [
    'Nota Fiscal (Produto ou Serviço)',
    'Diária',
    'Passagem',
    'Invoice (Pagamento Internacional)',
  ];
  const categoriasItem = ['Material Permanente', 'Material de Consumo'];
  const categoriasInvoice = ['Material Permanente', 'Material de Consumo', 'Pessoa Jurídica'];
  const itensEdital = [
    'Monitor LCD 27"', 'Notebook Dell Inspiron 15', 'Impressora HP LaserJet Pro',
    'Projetor Epson PowerLite', 'Câmera Sony Alpha A6400', 'Roteador TP-Link Archer AX73',
    'Scanner Fujitsu ScanSnap', 'Tablet Apple iPad Pro 11"', 'HD Externo Seagate 4TB',
    'Webcam Logitech Brio 4K',
  ];
  const passagFiltrado = PESSOAS_FICTICIAS.filter(n => n.toLowerCase().includes(passQuery.toLowerCase()));
  const diariasElegiveisPrestacao = diariasPrestacao
    .map((diaria, originalIndex) => ({ ...diaria, originalIndex }))
    .filter(diaria => diaria.status === 'Aprovada');
  const totalDiariasJaPrestadas = diariasPrestacao.filter((diaria) => diaria.status === 'Aprovada' && diaria.prestadaContas).length;
  const diariaSelecionada = selectedDiariaIdx === null ? null : diariasPrestacao[selectedDiariaIdx];
  const tipoViagemNovaDiaria = tiposViagemDiaria.find((tipo) => tipo.nome === novaDiariaTipo) ?? tiposViagemDiaria[0];
  const diariaVigenteNovaDiaria = diariasVigentesPrestacao.find((diaria) => diaria.tipoViagem === tipoViagemNovaDiaria.nome) ?? diariasVigentesPrestacao[0];
  const quantidadeNovaDiaria = calcularQuantidadeDiarias(novaDiariaPartida, novaDiariaChegada);
  const valorBeneficiarioNovaDiaria = quantidadeNovaDiaria * diariaVigenteNovaDiaria.valor;
  const valorTotalNovaDiaria = valorBeneficiarioNovaDiaria * novaDiariaBolsistas.length;
  const beneficiariosNovaDiariaEncontrados = PESSOAS_FICTICIAS
    .filter((nome) => !novaDiariaBolsistas.includes(nome))
    .filter((nome) => nome.toLowerCase().includes(novaDiariaBeneficiarioSearch.trim().toLowerCase()))
    .slice(0, 4);

  /* ── derived flags ──────────────────────────── */
  const isStep1Complete = selectedDocumento !== '';
  const isStep2Complete = uploadedFiles.length > 0;
  const showStep3 = selectedDocumento === 'Diária' ? selectedDiariaIdx !== null : isStep2Complete;
  const allowMultipleFiles = ['Diária', 'Passagem', 'Invoice (Pagamento Internacional)'].includes(selectedDocumento);
  const showCotacao = ['Nota Fiscal (Produto ou Serviço)', 'Invoice (Pagamento Internacional)', 'Passagem'].includes(selectedDocumento);

  const step2Title =
    selectedDocumento === 'Diária'
      ? 'Anexar Comprovante da Diária'
      : selectedDocumento === 'Passagem'
        ? 'Anexar Comprovantes da Passagem'
        : 'Anexar Documento Fiscal';
  const step2Subtitle =
    selectedDocumento === 'Diária'
      ? 'Inclua o comprovante de pagamento da diária.'
      : selectedDocumento === 'Passagem'
        ? 'Inclua o comprovante de pagamento da passagem e o comprovante de realização da viagem.'
        : 'Inclua o Documento Fiscal que justifique esse pagamento.';
  const step2ButtonLabel =
    selectedDocumento === 'Diária'
      ? 'Anexar Comprovante da Diária'
      : selectedDocumento === 'Passagem'
        ? 'Anexar Comprovantes da Passagem'
        : 'Anexar Documento Fiscal';

  /* reset specific fields on document change */
  const handleDocumentoChange = (doc: string) => {
    setSelectedDocumento(doc);
    setIsDocumentoOpen(false);
    setSelectedCategoriasItem(['']);
    setSelectedItensEdital(['']);
    setOpenCategoriaIdx(null);
    setOpenItemIdx(null);
    setSelectedDiariaIdx(null);
    setPassQuery(''); setPassageiro(''); setLocalizador(''); setDataEmissao('');
    setValorPassagemComprada('');
    setPassOrigem(''); setPassDestino('');
    setDataSaida(''); setHoraSaida(''); setDataChegada(''); setHoraChegada('');
  };

  const enviarContestacao = () => {
    toast.success('Contestação enviada com sucesso!');
    window.setTimeout(onBack, 800);
  };

  const selecionarDiariaPrestacao = (diaria: DiariaPrestacao & { originalIndex: number }) => {
    if (isReadOnly) return;

    setSelectedDiariaIdx(diaria.originalIndex);

    if (!diaria.prestadaContas) {
      toast.custom(() => (
        <div
          className="rounded-md px-4 py-3 flex items-start gap-3"
          style={{
            backgroundColor: '#4f481f',
            border: '1px solid #eab308',
            color: 'var(--foreground)',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.24)',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 1.5,
            maxWidth: '420px',
          }}
        >
          <AlertTriangle size={20} style={{ color: '#eab308', flexShrink: 0, marginTop: '1px' }} />
          <span>Em Detalhes da Diária, o bolsita ou o coordenador devem enviar o Relatório da Atividade</span>
        </div>
      ), {
        duration: 15000,
        position: 'bottom-right',
      });
    }
  };

  const criarDiariaPrestacao = () => {
    if (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) return;

    const novasDiarias: DiariaPrestacao[] = novaDiariaBolsistas.map((nome, index) => ({
      solicitacaoRef: `SD-2026-${String(diariasPrestacao.length + index + 1).padStart(3, '0')}`,
      nome,
      tipo: novaDiariaTipo,
      valorUnit: formatarMoeda(diariaVigenteNovaDiaria.valor),
      numDiarias: quantidadeNovaDiaria.toLocaleString('pt-BR'),
      valorTotal: formatarMoeda(valorBeneficiarioNovaDiaria),
      origem: 'Vitória',
      destino: novaDiariaDestino,
      dataSaida: formatarData(novaDiariaPartida),
      horarioSaida: formatarHora(novaDiariaPartida),
      dataChegada: formatarData(novaDiariaChegada),
      horarioChegada: formatarHora(novaDiariaChegada),
      status: 'Aprovada',
      prestadaContas: false,
    }));

    setDiariasPrestacao((current) => {
      const next = [...novasDiarias, ...current];
      setSelectedDiariaIdx(0);
      return next;
    });
    setIsCriarDiariaModalOpen(false);
    setNovaDiariaMotivo('');
    setNovaDiariaBeneficiarioSearch('');
  };

  /* ── prefill for read-only ─────────────────── */
  useEffect(() => {
    if (!isReadOnly) return;
    setSelectedDocumento('Nota Fiscal (Produto ou Serviço)');
    // Para Nota Fiscal mostramos 2 itens, para Invoice seria apenas 1
    setSelectedCategoriasItem(['Material Permanente', 'Material de Consumo']);
    setSelectedItensEdital(['Monitor LCD 27"', 'Teclado Mecânico RGB']);
    setDescricao('Compra de equipamentos para o laboratório de pesquisa do projeto FAPES 2024.');
    const f = new File([''], 'Nota_Fiscal_Monitor_2024.pdf', { type: 'application/pdf' });
    setUploadedFiles([f]);
    setFileNames([f.name]);
    setFilePreviewUrls([null]);
    const c1 = new File([''], 'Cotacao_Loja_A.pdf', { type: 'application/pdf' });
    const c2 = new File([''], 'Cotacao_Loja_B.pdf', { type: 'application/pdf' });
    const c3 = new File([''], 'Cotacao_Loja_C.pdf', { type: 'application/pdf' });
    setCotacaoFiles([c1, c2, c3]);
    setCotacaoFileNames([c1.name, c2.name, c3.name]);
    setCotacaoPreviewUrls([null, null, null]);
  }, [isReadOnly]);

  /* ── status message ─────────────────────────── */
  const getStatusMessage = () => {
    switch (payment.status) {
      case 'Em Validação': return { text: 'Esta Prestação de Contas está Em Validação. Após verificarmos todos os dados enviados, seu status irá ser atualizado na tela inicial. Enquanto isso, você não consegue alterar as informações enviadas.', bg: 'rgba(59,130,246,.1)', border: 'rgba(59,130,246,.3)', color: 'rgb(59,130,246)' };
      case 'Reprovado':    return { text: '10/06/2026 - Esta Prestação de Contas não foi aprovada por X motivo. Você deve repositar o valor para a conta do projeto em até 30 dias corridos.', bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.3)', color: 'rgb(239,68,68)' };
      case 'Revisar':      return { text: '10/06/2026 - Esta Prestação de Contas ainda não foi aprovada e precisa de revisão. Você tem até 15 dias úteis para contestá-la. Para isso, basta enviar sua a justificativa da solicitação de revisão.\n\nMensagem enviada pela Fapes: A cotação está errada.', bg: 'rgba(234,179,8,.1)', border: 'rgba(234,179,8,.3)', color: 'rgb(234,179,8)' };
      default: return null;
    }
  };
  const statusMessage = getStatusMessage();

  /* ── file handlers ──────────────────────────── */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (allowMultipleFiles) {
      setUploadedFiles(prev => [...prev, ...files]);
      setFileNames(prev => [...prev, ...files.map(f => f.name)]);
      setFilePreviewUrls(prev => [...prev, ...files.map(() => null)]);
    } else {
      const f = files[0];
      if (f) {
        setUploadedFiles([f]);
        setFileNames([f.name]);
        setFilePreviewUrls([null]);
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (allowMultipleFiles) {
      setUploadedFiles(prev => [...prev, ...files]);
      setFileNames(prev => [...prev, ...files.map(f => f.name)]);
      setFilePreviewUrls(prev => [...prev, ...files.map(() => null)]);
    } else {
      const f = files[0];
      if (f) {
        setUploadedFiles([f]);
        setFileNames([f.name]);
        setFilePreviewUrls([null]);
      }
    }
  };
  const handleDeleteFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    setFileNames(prev => prev.filter((_, i) => i !== idx));
    if (filePreviewUrls[idx]) URL.revokeObjectURL(filePreviewUrls[idx]!);
    setFilePreviewUrls(prev => prev.filter((_, i) => i !== idx));
    if (expandedFileIdx === idx) setExpandedFileIdx(null);
  };
  const toggleFilePreview = (idx: number) => {
    if (expandedFileIdx === idx) {
      setExpandedFileIdx(null);
      return;
    }
    setExpandedFileIdx(idx);
    if (!filePreviewUrls[idx]) {
      const urls = [...filePreviewUrls];
      urls[idx] = URL.createObjectURL(uploadedFiles[idx]);
      setFilePreviewUrls(urls);
    }
  };
  const handleCotacaoDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDraggingCotacao(false);
    const files = Array.from(e.dataTransfer.files);
    setCotacaoFiles(p => [...p, ...files]);
    setCotacaoFileNames(p => [...p, ...files.map(f => f.name)]);
    setCotacaoPreviewUrls(p => [...p, ...files.map(() => null)]);
  };
  const handleCotacaoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCotacaoFiles(p => [...p, ...files]);
    setCotacaoFileNames(p => [...p, ...files.map(f => f.name)]);
    setCotacaoPreviewUrls(p => [...p, ...files.map(() => null)]);
  };
  const handleCotacaoDeleteFile = (i: number) => {
    setCotacaoFiles(p => p.filter((_, idx) => idx !== i));
    setCotacaoFileNames(p => p.filter((_, idx) => idx !== i));
    setCotacaoPreviewUrls(p => p.filter((_, idx) => idx !== i));
    if (selectedCotacaoIdx >= i) setSelectedCotacaoIdx(Math.max(0, selectedCotacaoIdx - 1));
  };
  const toggleCotacaoPreview = (i: number) => {
    if (expandedCotacaoIdx === i) { setExpandedCotacaoIdx(null); return; }
    setExpandedCotacaoIdx(i);
    if (!cotacaoPreviewUrls[i]) {
      const urls = [...cotacaoPreviewUrls];
      urls[i] = URL.createObjectURL(cotacaoFiles[i]);
      setCotacaoPreviewUrls(urls);
    }
  };

  /* ── style factories ─────────────────────────── */
  const dropdownMenu: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
    backgroundColor: 'var(--popover)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)',
    zIndex: 50, overflow: 'hidden', maxHeight: '220px', overflowY: 'auto',
  };
  const dropItemSt = (sel: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.625rem 0.75rem',
    backgroundColor: sel ? 'color-mix(in srgb, var(--primary) 10%, var(--popover))' : 'var(--popover)',
    color: sel ? 'var(--primary)' : 'var(--foreground)',
    border: 'none', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
    textAlign: 'left', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color .15s',
  });
  const triggerSt = (disabled?: boolean, hasValue?: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.625rem 0.75rem',
    backgroundColor: 'transparent',
    color: disabled ? 'var(--muted-foreground)' : hasValue ? 'var(--foreground)' : 'var(--muted-foreground)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
    cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    opacity: disabled ? 0.7 : 1, textAlign: 'left',
  });
  const stepCircle: React.CSSProperties = {
    width: '24px', height: '24px', borderRadius: '50%',
    backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)',
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)',
    fontFamily: 'var(--font-family)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  };
  const stepTitle: React.CSSProperties = {
    color: 'var(--foreground)', fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-weight-semibold)', margin: 0, fontFamily: 'var(--font-family)',
  };
  const stepSubtitle: React.CSSProperties = {
    color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
    marginLeft: '36px', marginBottom: '1.5rem', marginTop: '0.25rem', lineHeight: '1.5',
  };
  const infoBox = (color = 'var(--primary)'): React.CSSProperties => ({
    padding: '0.875rem 1rem',
    backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
    border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
    borderRadius: 'var(--radius)', marginBottom: '1.25rem',
    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
  });


  /* ── Searchable person select ─────────────────── */
  const PersonSelect = ({
    label, query, setQuery, selected, setSelected,
    isOpen, setIsOpen, filtered, inputRef, disabled,
  }: {
    label: string; query: string; setQuery: (v: string) => void;
    selected: string; setSelected: (v: string) => void;
    isOpen: boolean; setIsOpen: (v: boolean) => void;
    filtered: string[]; inputRef: React.RefObject<HTMLInputElement | null>;
    disabled?: boolean;
  }) => (
    <div className="relative">
      <label style={labelSt}>{label}</label>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 0.75rem',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Search size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          placeholder="Buscar ou selecionar..."
          value={selected || query}
          disabled={disabled}
          onChange={e => { setQuery(e.target.value); setSelected(''); setIsOpen(true); }}
          onFocus={() => { if (!disabled) setIsOpen(true); }}
          style={{
            flex: 1, padding: '0.625rem 0', backgroundColor: 'transparent',
            color: 'var(--foreground)', border: 'none', outline: 'none',
            fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        {(selected || query) && !disabled && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSelected(''); setIsOpen(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--muted-foreground)', display: 'flex' }}
          >
            <X size={14} />
          </button>
        )}
        <ChevronDown size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
      </div>
      {isOpen && !disabled && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsOpen(false)} />
          <div style={dropdownMenu}>
            {filtered.length === 0 ? (
              <div style={{ padding: '0.625rem 0.75rem', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                Nenhum resultado encontrado
              </div>
            ) : filtered.map(name => (
              <button
                key={name}
                type="button"
                style={dropItemSt(selected === name)}
                onClick={() => { setSelected(name); setQuery(''); setIsOpen(false); }}
                onMouseEnter={e => { if (selected !== name) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                onMouseLeave={e => { if (selected !== name) e.currentTarget.style.backgroundColor = 'var(--popover)'; }}
              >
                {selected === name && <Check size={13} style={{ flexShrink: 0, color: 'var(--primary)' }} />}
                <span style={{ marginLeft: selected === name ? 0 : '21px', fontFamily: 'var(--font-family)' }}>{name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  /* ── File rows (nota fiscal / comprovante) ─────── */
  const FileRows = () => (
    <div style={{ marginLeft: '36px' }} className="space-y-2">
      {uploadedFiles.map((file, idx) => (
        <div key={idx}>
          <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div className="flex items-center gap-3 flex-1">
              <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              {editingFileIdx === idx ? (
                <input
                  type="text" value={tempFileName}
                  onChange={e => setTempFileName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (tempFileName.trim()) {
                        const newNames = [...fileNames];
                        newNames[idx] = tempFileName;
                        setFileNames(newNames);
                      }
                      setEditingFileIdx(null);
                    }
                    if (e.key === 'Escape') setEditingFileIdx(null);
                  }}
                  autoFocus
                  style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--primary)', outline: 'none', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)', width: '100%', padding: '2px 0' }}
                />
              ) : (
                <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)' }}>{fileNames[idx]}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {editingFileIdx === idx ? (
                <>
                  <button type="button" onClick={() => {
                    if (tempFileName.trim()) {
                      const newNames = [...fileNames];
                      newNames[idx] = tempFileName;
                      setFileNames(newNames);
                    }
                    setEditingFileIdx(null);
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'rgb(34,197,94)', display: 'flex', borderRadius: 'var(--radius)' }}><Check size={18} /></button>
                  <button type="button" onClick={() => setEditingFileIdx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)' }}><X size={18} /></button>
                </>
              ) : (
                <>
                  {!isReadOnly && (
                    <>
                      <button type="button" onClick={() => { setEditingFileIdx(idx); setTempFileName(fileNames[idx]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}><Edit2 size={18} /></button>
                      <button type="button" onClick={() => handleDeleteFile(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}><Trash2 size={18} /></button>
                    </>
                  )}
                  <button type="button" onClick={() => toggleFilePreview(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'all .2s', transform: expandedFileIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}><ChevronDown size={18} /></button>
                </>
              )}
            </div>
          </div>
          {expandedFileIdx === idx && filePreviewUrls[idx] && (
            <div className="mt-2 p-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <img src={filePreviewUrls[idx]!} alt={fileNames[idx]} style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', borderRadius: 'var(--radius)' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="w-full px-4 md:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
        <button onClick={onBack} className="hidden md:inline" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', transition: 'color .2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--foreground)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}>Prestação de Contas</button>
        <span className="hidden md:inline">&gt;</span>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', transition: 'color .2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--foreground)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}>Financeira</button>
        <span>&gt;</span>
        <span style={{ color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>Detalhes</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <DollarSign size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }}>Detalhes do Pagamento</h1>
      </div>

      {/* Payment card */}
      <div className="p-6 mb-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div className="hidden md:grid grid-cols-5 gap-20">
          {[['Pagamento', payment.tipo], ['Valor', payment.valor], ['Data', payment.data], ['CNPJ', payment.cnpj]].map(([l, v]) => (
            <div key={l}>
              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>{l}</div>
              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Status</div>
            <span className="inline-flex items-center px-2.5 py-1" style={{ backgroundColor: payment.statusColor.bg, color: payment.statusColor.color, border: `1px solid ${payment.statusColor.border}`, borderRadius: '9999px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>{payment.status}</span>
          </div>
        </div>
        <div className="md:hidden space-y-4">
          {[['Pagamento', payment.tipo], ['Valor', payment.valor], ['Data', payment.data], ['CNPJ', payment.cnpj]].map(([l, v]) => (
            <div key={l}>
              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }}>{l}</div>
              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }}>Status</div>
            <span className="inline-flex items-center px-2.5 py-1" style={{ backgroundColor: payment.statusColor.bg, color: payment.statusColor.color, border: `1px solid ${payment.statusColor.border}`, borderRadius: '9999px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>{payment.status}</span>
          </div>
        </div>
      </div>

      {isCreditoEstorno && (
        <section className="mb-6">
          <div
            className="p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, rgb(34, 197, 94) 8%, transparent)',
              border: '1px solid color-mix(in srgb, rgb(34, 197, 94) 24%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div>
                <h1 style={{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }}>
                  Estorno identificado
                </h1>
                <p style={{ color: 'var(--muted-foreground)', margin: '0.75rem 0 0', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                  Crédito de terceiro que anula um débito anterior e pode ser associado como ajuste conciliatório.
                </p>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-family)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Terceiro', value: payment.origemTerceiro ?? payment.cnpj },
                  { label: 'Crédito', value: payment.valor, color: 'rgb(34, 197, 94)' },
                  { label: 'Classificação', value: payment.classificacao ?? '-' },
                  { label: 'Situação do débito', value: payment.situacaoDebito ?? '-' },
                  { label: 'Efeito líquido', value: payment.efeitoLiquido ?? '-', color: 'var(--primary)' },
                  { label: 'Modo', value: payment.modoAssociacao ?? '-' },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: item.color ?? 'var(--foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {estornoAssociado && (
                <div
                  className="mt-4 p-3"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 'var(--radius)',
                    color: 'rgb(34, 197, 94)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  Estorno associado à {payment.prestacaoAssociada ?? 'prestação existente'} como {payment.modoAssociacao ?? 'ajuste conciliatório'}.
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2"
                  aria-pressed={estornoAssociado}
                  onClick={() => setEstornoAssociado(true)}
                  style={{
                    backgroundColor: estornoAssociado ? 'rgba(34, 197, 94, 0.14)' : 'var(--primary)',
                    color: estornoAssociado ? 'rgb(34, 197, 94)' : 'var(--primary-foreground)',
                    border: `1px solid ${estornoAssociado ? 'rgba(34, 197, 94, 0.35)' : 'var(--primary)'}`,
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: estornoAssociado ? 'default' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {estornoAssociado ? <CheckCircle size={16} /> : <RotateCcw size={16} />}
                  {estornoAssociado ? 'Associado à prestação existente' : 'Associar à prestação existente'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {isCreditoDevolucao && (
        <section className="mb-6">
          <div
            className="p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, rgb(234, 179, 8) 8%, transparent)',
              border: '1px solid color-mix(in srgb, rgb(234, 179, 8) 24%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="p-2"
                style={{
                  color: 'rgb(234, 179, 8)',
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <Upload size={18} />
              </div>
              <div>
                <h1 style={{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }}>
                  Devolução do coordenador
                </h1>
                <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                  Crédito feito pelo coordenador para devolver valor integral ou parcial. Exige comprovante, como Pix, TED ou boleto.
                </p>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-family)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Origem do crédito', value: payment.cnpj },
                  { label: 'Valor devolvido', value: payment.valorDevolvido ?? payment.valor, color: 'rgb(34, 197, 94)' },
                  { label: 'Valor original', value: payment.valorOriginal ?? '-' },
                  {
                    label: 'Comprovante',
                    value: devolucaoComprovanteAnexado ? 'Anexado' : payment.comprovanteObrigatorio ?? '-',
                    color: devolucaoComprovanteAnexado ? 'rgb(34, 197, 94)' : 'rgb(234, 179, 8)',
                  },
                  { label: 'Modo', value: payment.modoAssociacao ?? '-' },
                  { label: 'Classificação', value: payment.classificacao ?? '-' },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: item.color ?? 'var(--foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {devolucaoAssociada && (
                <div
                  className="mt-4 p-3"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 'var(--radius)',
                    color: 'rgb(34, 197, 94)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  Devolução associada à {payment.prestacaoAssociada ?? 'prestação existente'}. Saldo residual: {payment.valorResidual ?? '-'}.
                </div>
              )}

              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2"
                  aria-pressed={devolucaoComprovanteAnexado}
                  onClick={() => setDevolucaoComprovanteAnexado(true)}
                  style={{
                    backgroundColor: devolucaoComprovanteAnexado ? 'rgba(34, 197, 94, 0.14)' : 'transparent',
                    color: devolucaoComprovanteAnexado ? 'rgb(34, 197, 94)' : 'var(--foreground)',
                    border: `1px solid ${devolucaoComprovanteAnexado ? 'rgba(34, 197, 94, 0.35)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {devolucaoComprovanteAnexado ? <CheckCircle size={16} /> : <Upload size={16} />}
                  {devolucaoComprovanteAnexado ? 'Comprovante anexado' : 'Anexar comprovante'}
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2"
                  aria-pressed={devolucaoAssociada}
                  disabled={!devolucaoComprovanteAnexado || devolucaoAssociada}
                  onClick={() => setDevolucaoAssociada(true)}
                  style={{
                    backgroundColor: devolucaoAssociada
                      ? 'rgba(34, 197, 94, 0.14)'
                      : devolucaoComprovanteAnexado
                        ? 'var(--primary)'
                        : 'transparent',
                    color: devolucaoAssociada
                      ? 'rgb(34, 197, 94)'
                      : devolucaoComprovanteAnexado
                        ? 'var(--primary-foreground)'
                        : 'var(--muted-foreground)',
                    border: `1px solid ${devolucaoAssociada ? 'rgba(34, 197, 94, 0.35)' : devolucaoComprovanteAnexado ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    whiteSpace: 'nowrap',
                    cursor: !devolucaoComprovanteAnexado || devolucaoAssociada ? 'not-allowed' : 'pointer',
                    opacity: !devolucaoComprovanteAnexado && !devolucaoAssociada ? 0.7 : 1,
                  }}
                >
                  {devolucaoAssociada ? <CheckCircle size={16} /> : <RotateCcw size={16} />}
                  {devolucaoAssociada ? 'Devolução associada' : 'Associar prestação'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Status alert */}
      {statusMessage && (
        <>
          <div className={payment.status === 'Revisar' || payment.status === 'Reprovado' ? 'p-4' : 'p-4 mb-6'} style={{ backgroundColor: statusMessage.bg, border: `1px solid ${statusMessage.border}`, borderRadius: 'var(--radius)' }}>
            <p style={{ color: statusMessage.color, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>{statusMessage.text}</p>
          </div>
          {payment.status === 'Reprovado' && (
            <section
              className="mt-4 mb-6"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <h2 style={stepTitle}>Contestação</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label style={labelSt}>Data de envio</label>
                  <div className="px-3 py-2" style={{ backgroundColor: 'var(--input-background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                    12/06/2026
                  </div>
                </div>
                <div>
                  <label style={labelSt}>Justificativa</label>
                  <div className="px-3 py-2" style={{ minHeight: '96px', backgroundColor: 'var(--input-background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
                    A cotação anexada foi substituída por documento fiscal atualizado, com os valores corrigidos conforme solicitado pela FAPES.
                  </div>
                </div>
                <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <div className="flex items-center gap-3 flex-1">
                    <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)' }}>
                      Contestacao_Cotacao_Corrigida.pdf
                    </span>
                  </div>
                  <ChevronDown size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                </div>
              </div>
            </section>
          )}
          {payment.status === 'Revisar' && (
            <>
              <section
                className="mt-4"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '2rem',
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <h2 style={stepTitle}>Contestação</h2>
                </div>
                <div>
                  <label style={labelSt}>
                    Justificativa
                    <textarea
                      value={justificativaReprovacao}
                      onChange={(event) => setJustificativaReprovacao(event.target.value)}
                      rows={4}
                      className="mt-2 w-full px-3 py-2"
                      placeholder="Digite a justificativa da solicitação de revisão"
                      style={{
                        backgroundColor: 'var(--input-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        resize: 'vertical',
                      }}
                    />
                  </label>
                </div>
                <input
                  ref={contestacaoFileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    setArquivoContestacao(event.target.files?.[0]?.name ?? '');
                    setContestacaoArquivoExpandido(false);
                  }}
                />
                {arquivoContestacao && (
                  <div className="mt-3">
                    <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                      <div className="flex items-center gap-3 flex-1">
                        <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)' }}>
                          {arquivoContestacao}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContestacaoArquivoExpandido((current) => !current)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          color: 'var(--muted-foreground)',
                          display: 'flex',
                          borderRadius: 'var(--radius)',
                          transition: 'all .2s',
                          transform: contestacaoArquivoExpandido ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    {contestacaoArquivoExpandido && (
                      <div className="mt-2 p-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                        Pré-visualização indisponível para este arquivo.
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2"
                    onClick={() => contestacaoFileInputRef.current?.click()}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Paperclip size={16} />
                    Anexar Arquivo
                  </button>
                </div>
              </section>
              <div className="mt-4 mb-6 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2"
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
                  Salvar Rascunho
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2"
                  onClick={enviarContestacao}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-family)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Enviar Contestação
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ══ Steps container ══ */}
      <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', marginBottom: '2rem' }}>

        {/* ─── Step 1: Informações Gerais ─── */}
        <section className="mb-8">
          <div className="flex items-start gap-3 mb-1">
            <div style={stepCircle}>1</div>
            <h2 style={stepTitle}>Informações Gerais <span style={{ color: 'rgb(239,68,68)' }}>*</span></h2>
          </div>
          <p style={{ ...stepSubtitle, maxWidth: '800px' }}>Selecione o tipo de Documento e descreva o contexto da compra.</p>

          <div style={{ marginLeft: '36px' }}>

            {/* Documento select */}
            <div className="mb-4" style={{ maxWidth: '480px' }}>
              <label style={labelSt}>Documento</label>
              <div className="relative">
                <button
                  type="button"
                  style={triggerSt(isReadOnly, !!selectedDocumento)}
                  onClick={!isReadOnly ? () => setIsDocumentoOpen(!isDocumentoOpen) : undefined}
                  disabled={isReadOnly}
                >
                  <span style={{ fontFamily: 'var(--font-family)' }}>{selectedDocumento || 'Selecione um documento'}</span>
                  <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0, transform: isDocumentoOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
                </button>
                {isDocumentoOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsDocumentoOpen(false)} />
                    <div style={dropdownMenu}>
                      {documentos.map(doc => (
                        <button key={doc} type="button"
                          style={dropItemSt(selectedDocumento === doc)}
                          onClick={() => handleDocumentoChange(doc)}
                          onMouseEnter={e => { if (selectedDocumento !== doc) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                          onMouseLeave={e => { if (selectedDocumento !== doc) e.currentTarget.style.backgroundColor = 'var(--popover)'; }}
                        >
                          {selectedDocumento === doc && <Check size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />}
                          <span style={{ marginLeft: selectedDocumento === doc ? 0 : '21px', fontFamily: 'var(--font-family)' }}>{doc}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Document-specific messages ── */}

            {/* DIÁRIA */}
            {selectedDocumento === 'Diária' && (
              <>
                <div style={{ ...infoBox(), alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div className="flex items-start gap-3">
                    <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.6' }}>
                      Selecione uma diária já cadastrada para associar a esta Prestação de Contas. Se você ainda não fez a Solicitação da Diária,{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate?.('certificados-diarias-criar')}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          font: 'inherit',
                          fontWeight: 'var(--font-weight-medium)',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        faça aqui a solicitação
                      </button>
                      .
                    </p>
                  </div>
                </div>

                <div className="mb-4 space-y-3">
                  <div
                    className="flex flex-wrap items-center gap-2 p-3"
                    style={{
                      backgroundColor: 'var(--muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    <span>{diariasElegiveisPrestacao.length} diárias disponíveis para prestação de contas</span>
                    <span>•</span>
                    <span>{totalDiariasJaPrestadas} com relatório enviado</span>
                  </div>

                  <div className="space-y-3">
                    {diariasElegiveisPrestacao.map((diaria) => (
                      <button
                        key={diaria.solicitacaoRef}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => selecionarDiariaPrestacao(diaria)}
                        className="p-4 text-left w-full"
                        style={{
                          backgroundColor: selectedDiariaIdx === diaria.originalIndex ? 'color-mix(in srgb, var(--primary) 8%, var(--card))' : 'var(--card)',
                          border: `1px solid ${selectedDiariaIdx === diaria.originalIndex ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius)',
                          color: 'var(--foreground)',
                          cursor: isReadOnly ? 'default' : 'pointer',
                          fontFamily: 'var(--font-family)',
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <span
                            aria-hidden="true"
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '9999px',
                              border: `2px solid ${selectedDiariaIdx === diaria.originalIndex ? 'var(--primary)' : 'var(--border)'}`,
                              backgroundColor: selectedDiariaIdx === diaria.originalIndex ? 'var(--primary)' : 'transparent',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '0.15rem',
                            }}
                          >
                            {selectedDiariaIdx === diaria.originalIndex && (
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '9999px',
                                  backgroundColor: 'var(--primary-foreground)',
                                }}
                              />
                            )}
                          </span>
                          <div className="flex-1 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                              {[
                                { label: 'Bolsista', value: diaria.nome },
                                { label: 'Valor Total', value: diaria.valorTotal },
                                { label: 'Período', value: `${diaria.dataSaida} a ${diaria.dataChegada}` },
                                { label: 'Destino', value: diaria.destino },
                                { label: 'Relatório Enviado', value: relatorioEnviadoPrestacaoDiaria(diaria) },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  style={
                                    item.label === 'Valor Total'
                                      ? { paddingLeft: '0.75rem' }
                                      : item.label === 'Destino'
                                        ? { paddingLeft: '4rem' }
                                        : item.label === 'Período'
                                          ? { whiteSpace: 'nowrap' }
                                          : item.label === 'Relatório Enviado'
                                            ? { paddingLeft: '2rem' }
                                        : undefined
                                  }
                                >
                                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
                                    {item.label}
                                  </div>
                                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
                                    {item.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* PASSAGEM */}
            {selectedDocumento === 'Passagem' && (
              <div style={infoBox()}>
                <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.6' }}>
                  Informe o valor da passagem comprada, envie o comprovante de pagamento da passagem e o comprovante de realização da viagem. O comprovante de realização pode ser cartão de embarque, declaração de participação, certificado, carta de aceite de artigo ou declaração de reunião ou visita técnica.
                </p>
              </div>
            )}

            {/* INVOICE */}
            {selectedDocumento === 'Invoice (Pagamento Internacional)' && (
              <div style={infoBox()}>
                <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.6' }}>
                  Envie o comprovante de pagamento (Invoice), que deve ter o nome do coordenador, descrição do item, quantidade, valor e identificação do fornecedor. Se foi usado um cartão de crédito para realizar o pagamento final, também envie a imagem Fatura do Cartão do Coordenador em que consta a compra.
                </p>
              </div>
            )}

            {/* Descrição — opcional na prestação de contas */}
            {selectedDocumento !== '' && selectedDocumento !== 'Diária' && (
              <div>
                <label style={labelSt}>
                  Descrição
                </label>
                <textarea
                  value={descricao}
                  onChange={e => { if (e.target.value.length <= maxDesc) setDescricao(e.target.value); }}
                  placeholder="Descreva o contexto da compra ou pagamento..."
                  rows={3}
                  disabled={isReadOnly}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', resize: 'vertical', outline: 'none', opacity: isReadOnly ? 0.7 : 1, cursor: isReadOnly ? 'not-allowed' : 'text', boxSizing: 'border-box' }}
                  onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)', marginTop: '0.25rem', display: 'block' }}>
                  {descricao.length}/{maxDesc} caracteres
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ─── Step 2: Anexar Documento Fiscal ─── */}
        {isStep1Complete && selectedDocumento !== 'Diária' && (
          <section className="mb-8">
            <div className="flex items-start gap-3 mb-1">
              <div style={stepCircle}>2</div>
              <h2 style={stepTitle}>{step2Title} <span style={{ color: 'rgb(239,68,68)' }}>*</span></h2>
            </div>
            <p style={stepSubtitle}>{step2Subtitle}</p>

            {!isReadOnly && (uploadedFiles.length === 0 || allowMultipleFiles) && (
              <div
                className="p-8 flex flex-col items-center justify-center text-center"
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundColor: 'transparent', border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all .2s', minHeight: '180px', marginLeft: '36px', marginBottom: uploadedFiles.length > 0 ? '1rem' : 0 }}
              >
                <div style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}><Upload size={32} /></div>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0 0 1.25rem' }}>Arraste e solte o arquivo aqui ou</p>
                <button type="button" className="inline-flex items-center gap-2 px-4 py-2"
                  style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)', cursor: 'pointer', transition: 'all .2s' }}
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Paperclip size={16} />{step2ButtonLabel}
                </button>
              </div>
            )}

            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" multiple={allowMultipleFiles} onChange={handleFileChange} />
            {uploadedFiles.length > 0 && <FileRows />}

            {/* Card de Informações da Nota Fiscal (só para Nota Fiscal) */}
            {uploadedFiles.length > 0 && selectedDocumento === 'Nota Fiscal (Produto ou Serviço)' && (
              <div className="mt-4" style={{ marginLeft: '36px' }}>
                <div
                  className="p-4"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  {/* Header do card */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsNFExpanded(!isNFExpanded)}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'var(--font-family)',
                        color: 'var(--foreground)',
                      }}
                    >
                      Informações da Nota Fiscal
                    </span>
                    <ChevronDown
                      size={20}
                      style={{
                        color: 'var(--muted-foreground)',
                        transform: isNFExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </div>

                  {/* Conteúdo expandido */}
                  {isNFExpanded && (
                    <div className="mt-4 space-y-4">
                      {/* Campos da NF em grid 2 colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label style={labelSt}>Chave de Acesso</label>
                          <input type="text" value={nfChave} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>Data de Emissão</label>
                          <input type="text" value={nfDataEmissao} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>CNPJ</label>
                          <input type="text" value={nfCNPJ} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>UF</label>
                          <input type="text" value={nfUF} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>Total ICMS</label>
                          <input type="text" value={nfICMS} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>Total PIS</label>
                          <input type="text" value={nfPIS} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>Total IPI</label>
                          <input type="text" value={nfIPI} disabled style={inputSt(true)} />
                        </div>
                        <div>
                          <label style={labelSt}>Total ISS</label>
                          <input type="text" value={nfISS} disabled style={inputSt(true)} />
                        </div>
                      </div>

                      {/* Cards de Itens da Nota Fiscal */}
                      <div>
                        <h4
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            fontFamily: 'var(--font-family)',
                            marginBottom: '0.75rem',
                          }}
                        >
                          Itens da Nota Fiscal
                        </h4>
                        <div className="space-y-3">
                          {nfItens.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4"
                              style={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                              }}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <div
                                    style={{
                                      color: 'var(--muted-foreground)',
                                      fontSize: 'var(--text-xs)',
                                      marginBottom: '0.5rem',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    Descrição
                                  </div>
                                  <div
                                    style={{
                                      color: 'var(--foreground)',
                                      fontSize: 'var(--text-sm)',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    {item.descricao}
                                  </div>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      color: 'var(--muted-foreground)',
                                      fontSize: 'var(--text-xs)',
                                      marginBottom: '0.5rem',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    Quantidade
                                  </div>
                                  <div
                                    style={{
                                      color: 'var(--foreground)',
                                      fontSize: 'var(--text-sm)',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    {item.quantidade}
                                  </div>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      color: 'var(--muted-foreground)',
                                      fontSize: 'var(--text-xs)',
                                      marginBottom: '0.5rem',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    Valor Unitário
                                  </div>
                                  <div
                                    style={{
                                      color: 'var(--foreground)',
                                      fontSize: 'var(--text-sm)',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    {item.valorUnit}
                                  </div>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      color: 'var(--muted-foreground)',
                                      fontSize: 'var(--text-xs)',
                                      marginBottom: '0.5rem',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    Valor Total
                                  </div>
                                  <div
                                    style={{
                                      color: 'var(--foreground)',
                                      fontSize: 'var(--text-sm)',
                                      fontFamily: 'var(--font-family)',
                                    }}
                                  >
                                    {item.valorTotal}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ─── Step 3: Específico por Documento ─── */}
        {showStep3 && (
          <>
            {/* NOTA FISCAL: Associar Compra */}
            {selectedDocumento === 'Nota Fiscal (Produto ou Serviço)' && (
              <section className="mb-8">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>3</div>
                  <h2 style={stepTitle}>Associar Compra</h2>
                </div>
                <p style={stepSubtitle}>Associe o item comprado ao item aprovado no seu Edital.</p>

                <div style={{ marginLeft: '36px' }} className="space-y-6">
                  {/* Iterar sobre cada item da nota fiscal */}
                  {nfItens.slice(0, 2).map((nfItem, itemIdx) => (
                    <div key={itemIdx} className="space-y-4">
                      {/* Categoria e Item lado a lado */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selecione a Categoria do item */}
                        <div>
                          <label style={labelSt}>Selecione a Categoria do item</label>
                          <div className="relative">
                            <button
                              type="button"
                              style={triggerSt(isReadOnly, !!selectedCategoriasItem[itemIdx])}
                              onClick={!isReadOnly ? () => setOpenCategoriaIdx(openCategoriaIdx === itemIdx ? null : itemIdx) : undefined}
                              disabled={isReadOnly}
                            >
                              <span style={{ fontFamily: 'var(--font-family)' }}>{selectedCategoriasItem[itemIdx] || 'Selecione uma categoria'}</span>
                              <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0, transform: openCategoriaIdx === itemIdx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
                            </button>
                            {openCategoriaIdx === itemIdx && (
                              <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpenCategoriaIdx(null)} />
                                <div style={dropdownMenu}>
                                  {categoriasItem.map(cat => (
                                    <button key={cat} type="button"
                                      style={dropItemSt(selectedCategoriasItem[itemIdx] === cat)}
                                      onClick={() => {
                                        const newCats = [...selectedCategoriasItem];
                                        newCats[itemIdx] = cat;
                                        setSelectedCategoriasItem(newCats);
                                        setOpenCategoriaIdx(null);
                                      }}
                                      onMouseEnter={e => { if (selectedCategoriasItem[itemIdx] !== cat) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                                      onMouseLeave={e => { if (selectedCategoriasItem[itemIdx] !== cat) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                      {selectedCategoriasItem[itemIdx] === cat && <Check size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />}
                                      <span style={{ marginLeft: selectedCategoriasItem[itemIdx] === cat ? 0 : '21px', fontFamily: 'var(--font-family)' }}>{cat}</span>
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Selecione o Item */}
                        {selectedCategoriasItem[itemIdx] !== 'Pessoa Jurídica' && (
                          <div>
                            <label style={labelSt}>Selecione o Item</label>
                            <div className="relative">
                              <button
                                type="button"
                                style={triggerSt(isReadOnly, !!selectedItensEdital[itemIdx])}
                                onClick={!isReadOnly ? () => setOpenItemIdx(openItemIdx === itemIdx ? null : itemIdx) : undefined}
                                disabled={isReadOnly}
                              >
                                <span style={{ fontFamily: 'var(--font-family)' }}>{selectedItensEdital[itemIdx] || 'Selecione um item'}</span>
                                <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0, transform: openItemIdx === itemIdx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
                              </button>
                              {openItemIdx === itemIdx && (
                                <>
                                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpenItemIdx(null)} />
                                  <div style={dropdownMenu}>
                                    {itensEdital.map(item => (
                                      <button key={item} type="button"
                                        style={dropItemSt(selectedItensEdital[itemIdx] === item)}
                                        onClick={() => {
                                          const newItems = [...selectedItensEdital];
                                          newItems[itemIdx] = item;
                                          setSelectedItensEdital(newItems);
                                          setOpenItemIdx(null);
                                        }}
                                        onMouseEnter={e => { if (selectedItensEdital[itemIdx] !== item) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                                        onMouseLeave={e => { if (selectedItensEdital[itemIdx] !== item) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                      >
                                        {selectedItensEdital[itemIdx] === item && <Check size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />}
                                        <span style={{ marginLeft: selectedItensEdital[itemIdx] === item ? 0 : '21px', fontFamily: 'var(--font-family)' }}>{item}</span>
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedCategoriasItem[itemIdx] !== 'Pessoa Jurídica' && (
                          <>
                            <div>
                              <label style={labelSt}>Quantidade</label>
                              <input type="text" defaultValue={nfItem.quantidade} disabled={isReadOnly} style={inputSt(isReadOnly)} />
                            </div>
                            <div>
                              <label style={labelSt}>Valor</label>
                              <input type="text" defaultValue={nfItem.valorTotal} disabled={isReadOnly} style={inputSt(isReadOnly)} />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Card do item da NF - mesmo formato do Passo 2 */}
                      <div
                        className="p-4"
                        style={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div
                              style={{
                                color: 'var(--muted-foreground)',
                                fontSize: 'var(--text-xs)',
                                marginBottom: '0.5rem',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              Descrição
                            </div>
                            <div
                              style={{
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              {nfItem.descricao}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: 'var(--muted-foreground)',
                                fontSize: 'var(--text-xs)',
                                marginBottom: '0.5rem',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              Quantidade
                            </div>
                            <div
                              style={{
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              {nfItem.quantidade}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: 'var(--muted-foreground)',
                                fontSize: 'var(--text-xs)',
                                marginBottom: '0.5rem',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              Valor Unitário
                            </div>
                            <div
                              style={{
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              {nfItem.valorUnit}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: 'var(--muted-foreground)',
                                fontSize: 'var(--text-xs)',
                                marginBottom: '0.5rem',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              Valor Total
                            </div>
                            <div
                              style={{
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              {nfItem.valorTotal}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* INVOICE: Associar Compra (apenas campos, sem cards) */}
            {selectedDocumento === 'Invoice (Pagamento Internacional)' && (
              <section className="mb-8">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>3</div>
                  <h2 style={stepTitle}>Associar Compra</h2>
                </div>
                <p style={stepSubtitle}>Associe o item comprado ao item aprovado no seu Edital.</p>

                <div style={{ marginLeft: '36px' }} className="space-y-4">
                  {/* Iterar sobre os pares de campos */}
                  {selectedCategoriasItem.map((_, itemIdx) => {
                    const isLastItem = itemIdx === selectedCategoriasItem.length - 1;
                    return (
                      <div key={itemIdx} className="flex items-end gap-4">
                        {/* Categoria e Item lado a lado */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                          {/* Selecione a Categoria do item */}
                          <div>
                            <label style={labelSt}>Selecione a Categoria do item</label>
                            <div className="relative">
                              <button
                                type="button"
                                style={triggerSt(isReadOnly, !!selectedCategoriasItem[itemIdx])}
                                onClick={!isReadOnly ? () => setOpenCategoriaIdx(openCategoriaIdx === itemIdx ? null : itemIdx) : undefined}
                                disabled={isReadOnly}
                              >
                                <span style={{ fontFamily: 'var(--font-family)' }}>{selectedCategoriasItem[itemIdx] || 'Selecione uma categoria'}</span>
                                <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0, transform: openCategoriaIdx === itemIdx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
                              </button>
                              {openCategoriaIdx === itemIdx && (
                                <>
                                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpenCategoriaIdx(null)} />
                                  <div style={dropdownMenu}>
                                    {categoriasInvoice.map(cat => (
                                      <button key={cat} type="button"
                                        style={dropItemSt(selectedCategoriasItem[itemIdx] === cat)}
                                        onClick={() => {
                                          const newCats = [...selectedCategoriasItem];
                                          newCats[itemIdx] = cat;
                                          setSelectedCategoriasItem(newCats);
                                          setOpenCategoriaIdx(null);
                                        }}
                                        onMouseEnter={e => { if (selectedCategoriasItem[itemIdx] !== cat) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                                        onMouseLeave={e => { if (selectedCategoriasItem[itemIdx] !== cat) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                      >
                                        {selectedCategoriasItem[itemIdx] === cat && <Check size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />}
                                        <span style={{ marginLeft: selectedCategoriasItem[itemIdx] === cat ? 0 : '21px', fontFamily: 'var(--font-family)' }}>{cat}</span>
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Selecione o Item */}
                          {selectedCategoriasItem[itemIdx] !== 'Pessoa Jurídica' && (
                            <div>
                              <label style={labelSt}>Selecione o Item</label>
                              <div className="relative">
                                <button
                                  type="button"
                                  style={triggerSt(isReadOnly, !!selectedItensEdital[itemIdx])}
                                  onClick={!isReadOnly ? () => setOpenItemIdx(openItemIdx === itemIdx ? null : itemIdx) : undefined}
                                  disabled={isReadOnly}
                                >
                                  <span style={{ fontFamily: 'var(--font-family)' }}>{selectedItensEdital[itemIdx] || 'Selecione um item'}</span>
                                  <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0, transform: openItemIdx === itemIdx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
                                </button>
                                {openItemIdx === itemIdx && (
                                  <>
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpenItemIdx(null)} />
                                    <div style={dropdownMenu}>
                                      {itensEdital.map(item => (
                                        <button key={item} type="button"
                                          style={dropItemSt(selectedItensEdital[itemIdx] === item)}
                                          onClick={() => {
                                            const newItems = [...selectedItensEdital];
                                            newItems[itemIdx] = item;
                                            setSelectedItensEdital(newItems);
                                            setOpenItemIdx(null);
                                          }}
                                          onMouseEnter={e => { if (selectedItensEdital[itemIdx] !== item) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                                          onMouseLeave={e => { if (selectedItensEdital[itemIdx] !== item) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                        >
                                          {selectedItensEdital[itemIdx] === item && <Check size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />}
                                          <span style={{ marginLeft: selectedItensEdital[itemIdx] === item ? 0 : '21px', fontFamily: 'var(--font-family)' }}>{item}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          <div>
                            <label style={labelSt}>Quantidade</label>
                            <input type="text" placeholder="Informe a quantidade" disabled={isReadOnly} style={inputSt(isReadOnly)} />
                          </div>
                          <div>
                            <label style={labelSt}>Valor</label>
                            <input type="text" placeholder="R$ 0,00" disabled={isReadOnly} style={inputSt(isReadOnly)} />
                          </div>
                        </div>

                        {/* Botão + (última linha) ou Lixeira (linhas anteriores) */}
                        {!isReadOnly && (
                          <>
                            {isLastItem ? (
                              // Botão + (Ghost Button)
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategoriasItem([...selectedCategoriasItem, '']);
                                  setSelectedItensEdital([...selectedItensEdital, '']);
                                }}
                                style={{
                                  width: '42px',
                                  height: '42px',
                                  backgroundColor: 'transparent',
                                  color: 'var(--foreground)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all .2s',
                                  flexShrink: 0,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <Plus size={20} />
                              </button>
                            ) : (
                              // Botão Lixeira (Ghost Button)
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategoriasItem(selectedCategoriasItem.filter((_, i) => i !== itemIdx));
                                  setSelectedItensEdital(selectedItensEdital.filter((_, i) => i !== itemIdx));
                                }}
                                style={{
                                  width: '42px',
                                  height: '42px',
                                  backgroundColor: 'transparent',
                                  color: 'var(--foreground)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all .2s',
                                  flexShrink: 0,
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                  e.currentTarget.style.borderColor = 'rgb(239, 68, 68)';
                                  e.currentTarget.style.color = 'rgb(239, 68, 68)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.borderColor = 'var(--border)';
                                  e.currentTarget.style.color = 'var(--foreground)';
                                }}
                              >
                                <Trash size={20} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* DIÁRIA: Associar Diária */}
            {false && selectedDocumento === 'Diária' && (
              <section className="mb-8">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>3</div>
                  <h2 style={stepTitle}>Associar Diária</h2>
                </div>
                <p style={stepSubtitle}>Selecione uma diária aprovada que ainda não foi prestada contas.</p>

                <div style={{ marginLeft: '36px' }} className="space-y-3">
                  <div
                    className="flex flex-wrap items-center gap-2 p-3"
                    style={{
                      backgroundColor: 'var(--muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    <span>{diariasElegiveisPrestacao.length} diárias disponíveis para prestação de contas</span>
                    <span>•</span>
                    <span>{totalDiariasJaPrestadas} com relatório enviado</span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => setIsCriarDiariaModalOpen(true)}
                        className="px-3 py-2 flex items-center gap-2"
                        style={{
                          marginLeft: 'auto',
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-foreground)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          fontFamily: 'var(--font-family)',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={16} />
                        Criar diária
                      </button>
                    )}
                  </div>

                  {diariaSelecionada && (
                    <div
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary) 6%, var(--background))',
                        border: '1px solid color-mix(in srgb, var(--primary) 24%, var(--border))',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-family)',
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>Diária selecionada</div>
                        <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{diariaSelecionada.solicitacaoRef}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>Bolsista</div>
                        <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{diariaSelecionada.nome}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>Valor da diária</div>
                        <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{diariaSelecionada.valorTotal}</strong>
                      </div>
                    </div>
                  )}

                  {diariasElegiveisPrestacao.map((diaria) => (
                    <div
                      key={diaria.solicitacaoRef}
                      className="p-4"
                      onClick={() => selecionarDiariaPrestacao(diaria)}
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        cursor: isReadOnly ? 'default' : 'pointer',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Radio button */}
                        <button
                          type="button"
                          disabled={isReadOnly}
                          onClick={(e) => {
                            e.stopPropagation();
                            selecionarDiariaPrestacao(diaria);
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedDiariaIdx === diaria.originalIndex ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: selectedDiariaIdx === diaria.originalIndex ? 'var(--primary)' : 'transparent',
                            cursor: isReadOnly ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isReadOnly ? 0.5 : 1,
                            flexShrink: 0,
                            marginTop: '0.25rem',
                          }}
                        >
                          {selectedDiariaIdx === diaria.originalIndex && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-foreground)',
                              }}
                            />
                          )}
                        </button>

                        {/* Card content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                              {diaria.solicitacaoRef}
                            </span>
                            <span
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '999px',
                                backgroundColor: 'var(--secondary)',
                                color: 'var(--secondary-foreground)',
                                fontSize: 'var(--text-xs)',
                                fontFamily: 'var(--font-family)',
                              }}
                            >
                              Não prestada
                            </span>
                          </div>

                          {/* Primeira linha */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Bolsista</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.nome}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Tipo de Viagem</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.tipo}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Número de Diárias</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.numDiarias}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Valor Total</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.valorTotal}</div>
                            </div>
                          </div>

                          {/* Segunda linha */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Destino</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.destino}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Data de Saída</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.dataSaida}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Data de Chegada</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.dataChegada}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {false && isCriarDiariaModalOpen && (
                  <>
                    <div
                      style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 90,
                      }}
                      onClick={() => setIsCriarDiariaModalOpen(false)}
                    />
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="criar-diaria-title"
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 100,
                        width: 'min(720px, calc(100vw - 2rem))',
                        maxHeight: 'calc(100vh - 2rem)',
                        overflowY: 'auto',
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.24)',
                        padding: '1.25rem',
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3
                            id="criar-diaria-title"
                            style={{
                              color: 'var(--foreground)',
                              fontSize: 'var(--text-lg)',
                              fontWeight: 'var(--font-weight-semibold)',
                              fontFamily: 'var(--font-family)',
                              margin: 0,
                            }}
                          >
                            Solicitação de Diárias
                          </h3>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0.35rem 0 0' }}>
                            Use o mesmo formulário de solicitação para criar a diária operacional e associá-la a esta prestação de contas.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCriarDiariaModalOpen(false)}
                          aria-label="Fechar"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'transparent',
                            color: 'var(--foreground)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div
                        className="mb-4 p-3"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--primary) 6%, var(--background))',
                          border: '1px solid color-mix(in srgb, var(--primary) 20%, var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-sm)',
                          fontFamily: 'var(--font-family)',
                        }}
                      >
                        Diária vigente: {diariaVigenteNovaDiaria.codigo} · {formatarMoeda(diariaVigenteNovaDiaria.valor)} · fração {diariaVigenteNovaDiaria.fracaoCalculo} · cálculo pela normativa FAPES
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label style={labelSt}>Partida</label>
                          <input
                            type="datetime-local"
                            value={novaDiariaPartida}
                            onChange={(event) => setNovaDiariaPartida(event.target.value)}
                            style={inputSt(false)}
                          />
                        </div>
                        <div>
                          <label style={labelSt}>Chegada</label>
                          <input
                            type="datetime-local"
                            value={novaDiariaChegada}
                            onChange={(event) => setNovaDiariaChegada(event.target.value)}
                            style={inputSt(false)}
                          />
                        </div>
                        <div>
                          <label style={labelSt}>Destino</label>
                          <input
                            value={novaDiariaDestino}
                            onChange={(event) => setNovaDiariaDestino(event.target.value)}
                            placeholder="Ex.: Vitória/ES"
                            style={inputSt(false)}
                          />
                        </div>
                        <div>
                          <label style={labelSt}>Tipo de viagem</label>
                          <select
                            value={novaDiariaTipo}
                            onChange={(event) => setNovaDiariaTipo(event.target.value)}
                            style={inputSt(false)}
                          >
                            {tiposViagemDiaria.map((tipo) => (
                              <option key={tipo.codigo} value={tipo.nome}>
                                {tipo.nome} · {tipo.abrangencia}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label style={labelSt}>Beneficiários</label>
                          <div className="flex items-center gap-2 mb-2">
                            <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
                            <input
                              value={novaDiariaBeneficiarioSearch}
                              onChange={(event) => setNovaDiariaBeneficiarioSearch(event.target.value)}
                              placeholder="Buscar bolsista do projeto"
                              style={inputSt(false)}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {beneficiariosNovaDiariaEncontrados.map((nome) => (
                              <button
                                key={nome}
                                type="button"
                                onClick={() => {
                                  setNovaDiariaBolsistas((current) => [...current, nome]);
                                  setNovaDiariaBeneficiarioSearch('');
                                }}
                                className="px-3 py-2 flex items-center gap-2"
                                style={{
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  backgroundColor: 'var(--background)',
                                  color: 'var(--foreground)',
                                  fontSize: 'var(--text-sm)',
                                  fontFamily: 'var(--font-family)',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                }}
                              >
                                <Plus size={16} style={{ color: 'var(--muted-foreground)' }} />
                                {nome}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {novaDiariaBolsistas.map((nome) => (
                              <span
                                key={nome}
                                className="px-3 py-2 flex items-center gap-2"
                                style={{
                                  border: '1px solid var(--primary)',
                                  borderRadius: '999px',
                                  backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                                  color: 'var(--foreground)',
                                  fontSize: 'var(--text-sm)',
                                  fontFamily: 'var(--font-family)',
                                }}
                              >
                                {nome}
                                <button
                                  type="button"
                                  onClick={() => setNovaDiariaBolsistas((current) => current.length === 1 ? current : current.filter((item) => item !== nome))}
                                  aria-label={`Remover ${nome}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'var(--muted-foreground)',
                                    padding: 0,
                                    cursor: novaDiariaBolsistas.length === 1 ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label style={labelSt}>Motivo</label>
                          <textarea
                            value={novaDiariaMotivo}
                            onChange={(event) => setNovaDiariaMotivo(event.target.value)}
                            rows={3}
                            placeholder="Descreva a atividade vinculada à viagem"
                            style={{
                              ...inputSt(false),
                              resize: 'vertical',
                            }}
                          />
                        </div>
                      </div>

                      <div
                        className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5 p-4"
                        style={{
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>Diárias</span>
                          <strong className="block mt-1" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                            {quantidadeNovaDiaria.toLocaleString('pt-BR')}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>Beneficiários</span>
                          <strong className="block mt-1" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                            {novaDiariaBolsistas.length}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>Valor por bolsista</span>
                          <strong className="block mt-1" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                            {formatarMoeda(valorBeneficiarioNovaDiaria)}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>Valor total</span>
                          <strong className="block mt-1" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                            {formatarMoeda(valorTotalNovaDiaria)}
                          </strong>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCriarDiariaModalOpen(false)}
                          className="px-4 py-2"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            fontFamily: 'var(--font-family)',
                            cursor: 'pointer',
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={criarDiariaPrestacao}
                          className="px-4 py-2 flex items-center justify-center gap-2"
                          disabled={novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0}
                          style={{
                            backgroundColor: (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) ? 'var(--muted)' : 'var(--primary)',
                            color: (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            fontFamily: 'var(--font-family)',
                            cursor: (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <Save size={16} />
                          Solicitar e selecionar diária
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* PASSAGEM: Informações da Passagem */}
            {selectedDocumento === 'Passagem' && (
              <section className="mb-8">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>3</div>
                  <h2 style={stepTitle}>Informações da Passagem</h2>
                </div>
                <p style={stepSubtitle}>Preencha os dados da passagem realizada. O valor informado será associado à rubrica de passagem.</p>

                <div style={{ marginLeft: '36px' }}>
                  {/* Linha 1: Passageiro + Valor + Localizador + Data de Emissão */}
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <PersonSelect
                        label="Nome do Passageiro"
                        query={passQuery} setQuery={setPassQuery}
                        selected={passageiro} setSelected={setPassageiro}
                        isOpen={isPassOpen} setIsOpen={setIsPassOpen}
                        filtered={passagFiltrado} inputRef={passSearch}
                        disabled={isReadOnly}
                      />
                      <div>
                        <label style={labelSt}>Valor</label>
                        <input
                          type="text"
                          value={valorPassagemComprada}
                          onChange={e => setValorPassagemComprada(e.target.value)}
                          placeholder="R$ 0,00"
                          disabled={isReadOnly}
                          style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelSt}>Localizador</label>
                        <input type="text" value={localizador} onChange={e => setLocalizador(e.target.value)} placeholder="Ex.: ABC123" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelSt}>Data de Emissão</label>
                        <input type="text" value={dataEmissao} onChange={e => setDataEmissao(e.target.value)} placeholder="dd/mm/aaaa" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Linha 2: Local de Origem + Data de Saída + Hora */}
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label style={labelSt}>Local de Origem</label>
                        <input type="text" value={passOrigem} onChange={e => setPassOrigem(e.target.value)} placeholder="Ex.: Vitória – ES" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelSt}>Data de Saída</label>
                        <input type="text" value={dataSaida} onChange={e => setDataSaida(e.target.value)} placeholder="dd/mm/aaaa" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelSt}>Horário</label>
                        <input type="text" value={horaSaida} onChange={e => setHoraSaida(e.target.value)} placeholder="00:00" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Linha 3: Local de Destino + Data de Chegada + Hora */}
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label style={labelSt}>Local de Destino</label>
                        <input type="text" value={passDestino} onChange={e => setPassDestino(e.target.value)} placeholder="Ex.: São Paulo – SP" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelSt}>Data de Chegada</label>
                        <input type="text" value={dataChegada} onChange={e => setDataChegada(e.target.value)} placeholder="dd/mm/aaaa" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelSt}>Horário</label>
                        <input type="text" value={horaChegada} onChange={e => setHoraChegada(e.target.value)} placeholder="00:00" disabled={isReadOnly} style={inputSt(isReadOnly)}
                          onFocus={e => { if (!isReadOnly) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; } }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* COTAÇÃO (só para Nota Fiscal e Invoice) */}
            {showCotacao && (
              <section className="mb-4">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>4</div>
                  <h2 style={stepTitle}>Cotação</h2>
                </div>
                <p style={stepSubtitle}>
                  Se você comprou um item de valor superior a R$ 1.400, envie 3 orçamentos e selecione o de menor valor. O de menor valor deve ser o que você comprou. Se há mais de um item na Nota Fiscal com valor acima de R$ 1.400, você deve enviar 3 orçamentos para cada item.
                </p>

                {!isReadOnly && (
                  <div
                    className="p-8 flex flex-col items-center justify-center text-center"
                    onDragOver={e => { e.preventDefault(); setIsDraggingCotacao(true); }}
                    onDragLeave={() => setIsDraggingCotacao(false)}
                    onDrop={handleCotacaoDrop}
                    onClick={() => cotacaoInputRef.current?.click()}
                    style={{ backgroundColor: 'transparent', border: `2px dashed ${isDraggingCotacao ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all .2s', minHeight: '180px', marginLeft: '36px', marginBottom: cotacaoFiles.length > 0 ? '1rem' : 0 }}
                  >
                    <div style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}><Upload size={32} /></div>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0 0 1.25rem' }}>Arraste e solte o arquivo aqui ou</p>
                    <button type="button" className="inline-flex items-center gap-2 px-4 py-2"
                      style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)', cursor: 'pointer', transition: 'all .2s' }}
                      onClick={e => { e.stopPropagation(); cotacaoInputRef.current?.click(); }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Paperclip size={16} />Anexar Cotação {cotacaoFiles.length}/3
                    </button>
                  </div>
                )}

                <input type="file" ref={cotacaoInputRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={handleCotacaoFileChange} />

                {cotacaoFiles.length > 0 && (
                  <div className="mt-4 space-y-2" style={{ marginLeft: '36px' }}>
                    {cotacaoFiles.map((_, index) => (
                      <div key={index}>
                        <div className="p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                          <button type="button" onClick={() => setSelectedCotacaoIdx(index)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedCotacaoIdx === index ? 'var(--primary)' : 'var(--border)'}`, backgroundColor: selectedCotacaoIdx === index ? 'var(--primary)' : 'transparent', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                            {selectedCotacaoIdx === index && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-foreground)' }} />}
                          </button>
                          <div className="flex items-center gap-3 flex-1">
                            <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                            {editingCotacaoIdx === index ? (
                              <input type="text" value={tempCotacaoName} onChange={e => setTempCotacaoName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { if (tempCotacaoName.trim()) { const n = [...cotacaoFileNames]; n[index] = tempCotacaoName; setCotacaoFileNames(n); } setEditingCotacaoIdx(null); } if (e.key === 'Escape') setEditingCotacaoIdx(null); }}
                                autoFocus style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--primary)', outline: 'none', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)', width: '100%', padding: '2px 0' }}
                              />
                            ) : (
                              <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)' }}>{cotacaoFileNames[index]}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {editingCotacaoIdx === index ? (
                              <>
                                <button type="button" onClick={() => { if (tempCotacaoName.trim()) { const n = [...cotacaoFileNames]; n[index] = tempCotacaoName; setCotacaoFileNames(n); } setEditingCotacaoIdx(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'rgb(34,197,94)', display: 'flex', borderRadius: 'var(--radius)' }}><Check size={18} /></button>
                                <button type="button" onClick={() => setEditingCotacaoIdx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)' }}><X size={18} /></button>
                              </>
                            ) : (
                              <>
                                {!isReadOnly && (
                                  <>
                                    <button type="button" onClick={() => { setEditingCotacaoIdx(index); setTempCotacaoName(cotacaoFileNames[index]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}><Edit2 size={18} /></button>
                                    <button type="button" onClick={() => handleCotacaoDeleteFile(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}><Trash2 size={18} /></button>
                                  </>
                                )}
                                <button type="button" onClick={() => toggleCotacaoPreview(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'all .2s', transform: expandedCotacaoIdx === index ? 'rotate(180deg)' : 'rotate(0deg)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}><ChevronDown size={18} /></button>
                              </>
                            )}
                          </div>
                        </div>
                        {expandedCotacaoIdx === index && cotacaoPreviewUrls[index] && (
                          <div className="mt-2 p-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                            <img src={cotacaoPreviewUrls[index] as string} alt={cotacaoFileNames[index]} style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', borderRadius: 'var(--radius)' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {selectedDocumento === 'Diária' && isCriarDiariaModalOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 90 }}
            onClick={() => setIsCriarDiariaModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="criar-diaria-prestacao-title"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              width: 'min(760px, calc(100vw - 2rem))',
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.24)',
              padding: '1.25rem',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 id="criar-diaria-prestacao-title" style={{ color: 'var(--foreground)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-family)', margin: 0 }}>
                  Solicitação de Diárias
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0.35rem 0 0' }}>
                  Crie a diária operacional usando o mesmo formulário de solicitação e associe-a a esta prestação de contas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCriarDiariaModalOpen(false)}
                aria-label="Fechar"
                style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 6%, var(--background))', border: '1px solid color-mix(in srgb, var(--primary) 20%, var(--border))', borderRadius: 'var(--radius)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
              Diária vigente: {diariaVigenteNovaDiaria.codigo} · {formatarMoeda(diariaVigenteNovaDiaria.valor)} · fração {diariaVigenteNovaDiaria.fracaoCalculo} · cálculo pela normativa FAPES
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label style={labelSt}>Partida</label>
                <input type="datetime-local" value={novaDiariaPartida} onChange={(event) => setNovaDiariaPartida(event.target.value)} style={inputSt(false)} />
              </div>
              <div>
                <label style={labelSt}>Chegada</label>
                <input type="datetime-local" value={novaDiariaChegada} onChange={(event) => setNovaDiariaChegada(event.target.value)} style={inputSt(false)} />
              </div>
              <div>
                <label style={labelSt}>Destino</label>
                <input value={novaDiariaDestino} onChange={(event) => setNovaDiariaDestino(event.target.value)} placeholder="Ex.: Vitória/ES" style={inputSt(false)} />
              </div>
              <div>
                <label style={labelSt}>Tipo de viagem</label>
                <select value={novaDiariaTipo} onChange={(event) => setNovaDiariaTipo(event.target.value)} style={inputSt(false)}>
                  {tiposViagemDiaria.map((tipo) => (
                    <option key={tipo.codigo} value={tipo.nome}>
                      {tipo.nome} · {tipo.abrangencia}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label style={labelSt}>Beneficiários</label>
                <div className="flex items-center gap-2 mb-2">
                  <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
                  <input value={novaDiariaBeneficiarioSearch} onChange={(event) => setNovaDiariaBeneficiarioSearch(event.target.value)} placeholder="Buscar bolsista do projeto" style={inputSt(false)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {beneficiariosNovaDiariaEncontrados.map((nome) => (
                    <button
                      key={nome}
                      type="button"
                      onClick={() => {
                        setNovaDiariaBolsistas((current) => [...current, nome]);
                        setNovaDiariaBeneficiarioSearch('');
                      }}
                      className="px-3 py-2 flex items-center gap-2"
                      style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--background)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', textAlign: 'left', cursor: 'pointer' }}
                    >
                      <Plus size={16} style={{ color: 'var(--muted-foreground)' }} />
                      {nome}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {novaDiariaBolsistas.map((nome) => (
                    <span key={nome} className="px-3 py-2 flex items-center gap-2" style={{ border: '1px solid var(--primary)', borderRadius: '999px', backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                      {nome}
                      <button type="button" onClick={() => setNovaDiariaBolsistas((current) => current.length === 1 ? current : current.filter((item) => item !== nome))} aria-label={`Remover ${nome}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', color: 'var(--muted-foreground)', padding: 0, cursor: novaDiariaBolsistas.length === 1 ? 'not-allowed' : 'pointer' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label style={labelSt}>Motivo</label>
                <textarea value={novaDiariaMotivo} onChange={(event) => setNovaDiariaMotivo(event.target.value)} rows={3} placeholder="Descreva a atividade vinculada à viagem" style={{ ...inputSt(false), resize: 'vertical' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5 p-4" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              {[
                { label: 'Diárias', value: quantidadeNovaDiaria.toLocaleString('pt-BR') },
                { label: 'Beneficiários', value: String(novaDiariaBolsistas.length) },
                { label: 'Valor por bolsista', value: formatarMoeda(valorBeneficiarioNovaDiaria) },
                { label: 'Valor total', value: formatarMoeda(valorTotalNovaDiaria) },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>{item.label}</span>
                  <strong className="block mt-1" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={() => setIsCriarDiariaModalOpen(false)} className="px-4 py-2" style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={criarDiariaPrestacao}
                className="px-4 py-2 flex items-center justify-center gap-2"
                disabled={novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0}
                style={{
                  backgroundColor: (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) ? 'var(--muted)' : 'var(--primary)',
                  color: (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-family)',
                  cursor: (novaDiariaBolsistas.length === 0 || !novaDiariaDestino.trim() || !novaDiariaMotivo.trim() || quantidadeNovaDiaria <= 0) ? 'not-allowed' : 'pointer',
                }}
              >
                <Save size={16} />
                Solicitar e selecionar diária
              </button>
            </div>
          </div>
        </>
      )}

      {/* Botões Salvar Rascunho e Enviar */}
      {showStep3 && !isReadOnly && (
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="inline-flex items-center gap-2 px-6 py-3"
            style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Save size={16} />Salvar Rascunho
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-6 py-3"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <Send size={16} />Enviar
          </button>
        </div>
      )}

    </div>
  );
}
