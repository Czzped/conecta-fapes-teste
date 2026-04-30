import {
  Home, Upload, Paperclip, FileText, Edit2, Trash2,
  ChevronDown, Check, Info, Search, X, Send, Plus, Save, Trash,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Payment {
  tipo: string;
  valor: string;
  data: string;
  cnpj: string;
  status: string;
  statusColor: { bg: string; color: string; border: string };
}
interface FinanceiraDetalhesProps {
  payment: Payment;
  onBack: () => void;
}

// Mock data para tabela de diárias
const mockDiarias = [
  { nome: 'Ana Carolina Silva', tipo: 'Nacional - Dentro do Estado', valorUnit: 'R$ 320,00', numDiarias: '3', valorTotal: 'R$ 960,00', destino: 'Vitória', dataSaida: '15/03/2026', horarioSaida: '08:00', dataChegada: '18/03/2026', horarioChegada: '17:00' },
  { nome: 'Carlos Eduardo Rocha', tipo: 'Nacional - Fora do Estado', valorUnit: 'R$ 320,00', numDiarias: '5', valorTotal: 'R$ 1.600,00', destino: 'São Paulo', dataSaida: '20/03/2026', horarioSaida: '06:30', dataChegada: '25/03/2026', horarioChegada: '20:00' },
  { nome: 'Fernanda Martins', tipo: 'Internacional', valorUnit: 'R$ 320,00', numDiarias: '7', valorTotal: 'R$ 2.240,00', destino: 'Lisboa', dataSaida: '10/04/2026', horarioSaida: '14:00', dataChegada: '17/04/2026', horarioChegada: '22:30' },
  { nome: 'Roberto Oliveira', tipo: 'Nacional - Fora do Estado', valorUnit: 'R$ 320,00', numDiarias: '4', valorTotal: 'R$ 1.280,00', destino: 'Rio de Janeiro', dataSaida: '05/05/2026', horarioSaida: '07:00', dataChegada: '09/05/2026', horarioChegada: '19:00' },
  { nome: 'Beatriz Costa', tipo: 'Nacional - Dentro do Estado', valorUnit: 'R$ 320,00', numDiarias: '2', valorTotal: 'R$ 640,00', destino: 'Cachoeiro', dataSaida: '12/05/2026', horarioSaida: '09:00', dataChegada: '14/05/2026', horarioChegada: '16:00' },
];

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
  backgroundColor: disabled ? 'var(--muted)' : 'var(--background)',
  color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
  border: '1px solid var(--border)', borderRadius: 'var(--radius)',
  fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
  outline: 'none', cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.7 : 1,
});

/* ─── component ─────────────────────────────────────────────── */
export function FinanceiraDetalhes({ payment, onBack }: FinanceiraDetalhesProps) {
  useLanguage();
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const cotacaoInputRef  = useRef<HTMLInputElement>(null);
  const benefSearch      = useRef<HTMLInputElement>(null);
  const passSearch       = useRef<HTMLInputElement>(null);

  const isReadOnly = payment.status !== 'Pendente';

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

  // Passagem
  const [passQuery,    setPassQuery]    = useState('');
  const [passageiro,   setPassageiro]   = useState('');
  const [isPassOpen,   setIsPassOpen]   = useState(false);
  const [localizador,  setLocalizador]  = useState('');
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

  /* ── derived flags ──────────────────────────── */
  const isStep1Complete = selectedDocumento !== '' && descricao.trim().length > 0;
  const isStep2Complete = uploadedFiles.length > 0;
  const showStep3 = isStep2Complete;
  const allowMultipleFiles = ['Diária', 'Passagem', 'Invoice (Pagamento Internacional)'].includes(selectedDocumento);
  const showCotacao = ['Nota Fiscal (Produto ou Serviço)', 'Invoice (Pagamento Internacional)', 'Passagem'].includes(selectedDocumento);

  const step2Title    = 'Anexar Documento Fiscal';
  const step2Subtitle = 'Inclua o Documento Fiscal que justifique esse pagamento.';

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
    setPassOrigem(''); setPassDestino('');
    setDataSaida(''); setHoraSaida(''); setDataChegada(''); setHoraChegada('');
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
      case 'Reprovado':    return { text: 'Esta Prestação de Contas não foi aprovada por X motivo. Você deve repositar o valor para a conta do projeto em até 30 dias corridos.', bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.3)', color: 'rgb(239,68,68)' };
      case 'Revisar':      return { text: 'Esta Prestação de Contas ainda não foi aprovada e precisa de revisão.\n\nMensagem enviada pela Fapes: X', bg: 'rgba(234,179,8,.1)', border: 'rgba(234,179,8,.3)', color: 'rgb(234,179,8)' };
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
    backgroundColor: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)',
    zIndex: 50, overflow: 'hidden', maxHeight: '220px', overflowY: 'auto',
  };
  const dropItemSt = (sel: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.625rem 0.75rem',
    backgroundColor: sel ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
    color: sel ? 'var(--primary)' : 'var(--foreground)',
    border: 'none', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)',
    textAlign: 'left', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color .15s',
  });
  const triggerSt = (disabled?: boolean, hasValue?: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.625rem 0.75rem',
    backgroundColor: disabled ? 'var(--muted)' : 'var(--background)',
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
          backgroundColor: disabled ? 'var(--muted)' : 'var(--background)',
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
                onMouseLeave={e => { if (selected !== name) e.currentTarget.style.backgroundColor = 'transparent'; }}
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
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', transition: 'color .2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--foreground)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}><Home size={16} /></button>
        <span>&gt;</span>
        <button onClick={onBack} className="hidden md:inline" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', transition: 'color .2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--foreground)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}>Prestação de Contas</button>
        <span className="hidden md:inline">&gt;</span>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', transition: 'color .2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--foreground)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}>Financeira</button>
        <span>&gt;</span>
        <span style={{ color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}>Detalhes</span>
      </nav>

      <h1 style={{ color: 'var(--foreground)', margin: '0 0 2rem', fontFamily: 'var(--font-family)' }}>Detalhes do Pagamento</h1>

      {/* Payment card */}
      <div className="p-6 mb-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div className="hidden md:grid grid-cols-5 gap-6">
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

      {/* Status alert */}
      {statusMessage && (
        <div className="p-4 mb-6" style={{ backgroundColor: statusMessage.bg, border: `1px solid ${statusMessage.border}`, borderRadius: 'var(--radius)' }}>
          <p style={{ color: statusMessage.color, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>{statusMessage.text}</p>
        </div>
      )}

      {/* ══ Steps container ══ */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', marginBottom: '2rem' }}>

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
                          onMouseLeave={e => { if (selectedDocumento !== doc) e.currentTarget.style.backgroundColor = 'transparent'; }}
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
              <div style={infoBox()}>
                <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.6' }}>
                  Aceitamos apenas diárias com até 15 dias consecutivos por viagem. Na descrição, escreva as atividades realizadas na viagem e no próximo passo anexe o comprovante da atividade, que pode ser certificado de participação, crachá ou fotos.
                </p>
              </div>
            )}

            {/* PASSAGEM */}
            {selectedDocumento === 'Passagem' && (
              <div style={infoBox()}>
                <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: 0, lineHeight: '1.6' }}>
                  Envie o comprovante de pagamento, cartão de embarque (se houver) e comprovante da atividade que justifique a viagem, como certificado de participação em evento, carta de aceite de artigo ou declaração de reunião ou visita técnica.
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

            {/* Descrição — sempre mostrada quando documento selecionado */}
            {selectedDocumento !== '' && (
              <div>
                <label style={labelSt}>
                  Descrição <span style={{ color: 'rgb(239,68,68)' }}>*</span>
                </label>
                <textarea
                  value={descricao}
                  onChange={e => { if (e.target.value.length <= maxDesc) setDescricao(e.target.value); }}
                  placeholder="Descreva o contexto da compra ou pagamento..."
                  rows={3}
                  disabled={isReadOnly}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: isReadOnly ? 'var(--muted)' : 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', resize: 'vertical', outline: 'none', opacity: isReadOnly ? 0.7 : 1, cursor: isReadOnly ? 'not-allowed' : 'text', boxSizing: 'border-box' }}
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
        {isStep1Complete && (
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
                style={{ backgroundColor: 'var(--background)', border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all .2s', minHeight: '180px', marginLeft: '36px', marginBottom: uploadedFiles.length > 0 ? '1rem' : 0 }}
              >
                <div style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}><Upload size={32} /></div>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0 0 1.25rem' }}>Arraste e solte o arquivo aqui ou</p>
                <button type="button" className="inline-flex items-center gap-2 px-4 py-2"
                  style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)', cursor: 'pointer', transition: 'all .2s' }}
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Paperclip size={16} />Anexar Documento Fiscal
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
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
            {selectedDocumento === 'Diária' && (
              <section className="mb-8">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>3</div>
                  <h2 style={stepTitle}>Associar Diária</h2>
                </div>
                <p style={stepSubtitle}>Selecione a diária correspondente ao pagamento realizado.</p>

                <div style={{ marginLeft: '36px' }} className="space-y-3">
                  {mockDiarias.map((diaria, idx) => (
                    <div
                      key={idx}
                      className="p-4"
                      onClick={() => { if (!isReadOnly) setSelectedDiariaIdx(idx); }}
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
                            if (!isReadOnly) setSelectedDiariaIdx(idx);
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedDiariaIdx === idx ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: selectedDiariaIdx === idx ? 'var(--primary)' : 'transparent',
                            cursor: isReadOnly ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isReadOnly ? 0.5 : 1,
                            flexShrink: 0,
                            marginTop: '0.25rem',
                          }}
                        >
                          {selectedDiariaIdx === idx && (
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
                          {/* Primeira linha */}
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Nome do Membro</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.nome}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Tipo de Viagem</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.tipo}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Valor Unitário</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.valorUnit}</div>
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
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Destino</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.destino}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Data de Saída</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.dataSaida}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Horário</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.horarioSaida}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Data de Chegada</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.dataChegada}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>Horário</div>
                              <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>{diaria.horarioChegada}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PASSAGEM: Informações da Passagem */}
            {selectedDocumento === 'Passagem' && (
              <section className="mb-8">
                <div className="flex items-start gap-3 mb-1">
                  <div style={stepCircle}>3</div>
                  <h2 style={stepTitle}>Informações da Passagem</h2>
                </div>
                <p style={stepSubtitle}>Preencha os dados da passagem realizada.</p>

                <div style={{ marginLeft: '36px' }}>
                  {/* Linha 1: Passageiro + Localizador + Data de Emissão */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <PersonSelect
                      label="Nome do Passageiro"
                      query={passQuery} setQuery={setPassQuery}
                      selected={passageiro} setSelected={setPassageiro}
                      isOpen={isPassOpen} setIsOpen={setIsPassOpen}
                      filtered={passagFiltrado} inputRef={passSearch}
                      disabled={isReadOnly}
                    />
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
                    style={{ backgroundColor: 'var(--background)', border: `2px dashed ${isDraggingCotacao ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all .2s', minHeight: '180px', marginLeft: '36px', marginBottom: cotacaoFiles.length > 0 ? '1rem' : 0 }}
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
