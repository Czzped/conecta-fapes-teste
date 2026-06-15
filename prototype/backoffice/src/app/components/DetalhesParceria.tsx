import React, { useState } from 'react';
import { Archive, ChevronDown, ChevronRight, DollarSign, Edit3, FileText, FolderOpen, Handshake, PauseCircle, Plus, Save, Search, Upload, X } from 'lucide-react';
import type { ParceriaItem } from './Parceria';
import { useThemeTokens } from '../theme/ThemeContext';

interface Props {
  parceria: ParceriaItem;
  onBack: () => void;
  onOpenPrograma?: (programa: { codigo: string; nome: string }) => void;
}

type DetailStatus = ParceriaItem['status'] | 'SUSPENSA';

const statusLabel: Record<DetailStatus, string> = {
  EM_ELABORACAO: 'Rascunho',
  VIGENTE: 'Ativo',
  ENCERRADA: 'Encerrada',
  SUSPENSA: 'Suspenso',
};

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
);

const calcularPercentualAcaoTransversal = (valor: number) => {
  if (valor < 50000) return 0;
  if (valor <= 2000000) return 5;
  if (valor <= 5000000) return 4;
  return 3;
};

const calcularReservaAcaoTransversal = (valor: number) => valor * calcularPercentualAcaoTransversal(valor) / 100;

const definirFaixaAcaoTransversal = (valor: number) => {
  if (valor < 50000) return 'Sem retenção';
  if (valor <= 2000000) return 'Faixa 1';
  if (valor <= 5000000) return 'Faixa 2';
  return 'Faixa 3';
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '24px',
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(38, 38, 38, 0.6)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '24px',
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  backgroundColor: 'rgba(0,0,0,0.62)',
};

const modalContentStyle: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: '#262626',
  width: 'min(920px, 100%)',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  marginBottom: 0,
  boxShadow: '0 24px 80px rgba(0,0,0,0.42)',
};

const modalCloseButtonStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 'var(--radius)',
  backgroundColor: 'transparent',
  color: 'rgba(255,255,255,0.72)',
  cursor: 'pointer',
};

const modalSecondaryButtonStyle: React.CSSProperties = {
  minWidth: '120px',
  height: '44px',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 'var(--radius)',
  backgroundColor: 'transparent',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
};

const modalPrimaryButtonStyle: React.CSSProperties = {
  minWidth: '120px',
  height: '44px',
  border: 'none',
  borderRadius: 'var(--radius)',
  backgroundColor: '#00c1af',
  color: '#171717',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-xs)',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '6px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: '#ffffff',
  margin: 0,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(38, 38, 38, 0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const instituicoesOptions = [
  { value: 'Ufes', label: 'Universidade Federal do Espírito Santo (Ufes)', cnpj: '32.479.123/0001-43' },
  { value: 'Ifes', label: 'Instituto Federal do Espírito Santo (Ifes)', cnpj: '10.838.653/0001-06' },
  { value: 'CNPq', label: 'Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq)', cnpj: '33.654.831/0001-36' },
  { value: 'Fapesp', label: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (Fapesp)', cnpj: '43.828.151/0001-45' },
  { value: 'UFMG', label: 'Universidade Federal de Minas Gerais (UFMG)', cnpj: '17.217.985/0001-04' },
  { value: 'USP', label: 'Universidade de São Paulo (USP)', cnpj: '63.025.530/0001-04' },
  { value: 'MIT', label: 'Massachusetts Institute of Technology (MIT)', cnpj: 'Exterior' },
];

const maskDate = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const maskCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const numberValue = Number(digits) / 100;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrency = (value: string) => Number(value.replace(/\./g, '').replace(',', '.')) || 0;

const tipoDocumentoOptions = [
  'Termo de Cooperação',
  'Termo de Descentralização',
  'Termo Aditivo',
  'Anexo',
  'Portaria',
  'Procuração',
];

export const DetalhesParceria: React.FC<Props> = ({ parceria, onBack, onOpenPrograma }) => {
  const { T } = useThemeTokens();
  const [activeTab, setActiveTab] = useState<'resumo' | 'financeiro' | 'dashboard'>('resumo');
  const [currentStatus, setCurrentStatus] = useState<DetailStatus>(parceria.status);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [editingCadastro, setEditingCadastro] = useState(false);
  const [showAditivo, setShowAditivo] = useState(false);
  const [showSuspensao, setShowSuspensao] = useState(false);
  const [showEncerramento, setShowEncerramento] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [suspensao, setSuspensao] = useState({ origem: 'Área de Parcerias', motivo: '' });
  const [suspensaoRegistrada, setSuspensaoRegistrada] = useState<{ origem: string; motivo: string } | null>(null);
  const [encerramento, setEncerramento] = useState({ justificativa: '' });
  const [encerramentoRegistrado, setEncerramentoRegistrado] = useState<{ justificativa: string; programasAfetados: string[] } | null>(null);
  const [aditivoTipo, setAditivoTipo] = useState<'financeiro' | 'tempo'>('financeiro');
  const [temAditivo, setTemAditivo] = useState(parceria.aditivo === 'Sim');
  const [aditivosFinanceiros, setAditivosFinanceiros] = useState<Array<{ data: string; valor: number; documento: string }>>(
    parceria.aditivo === 'Sim' ? [{ data: '15/03/2026', valor: 500000, documento: 'Termo de descentralização aditivo' }] : []
  );
  const [aditivosTempo, setAditivosTempo] = useState<Array<{ vigenciaFimAnterior: string; vigenciaFim: string; documento: string }>>([]);
  const [aditivoFinanceiro, setAditivoFinanceiro] = useState({ valor: '', data: '', documento: '' });
  const [aditivoTempo, setAditivoTempo] = useState({ vigenciaFim: '', documento: '' });
  const [cadastroData, setCadastroData] = useState({
    nome: parceria.nome,
    instituicaoParceira: parceria.instituicaoParceira,
    numeroProcesso: parceria.numeroProcesso,
    dataAssinatura: parceria.dataAssinatura,
    vigenciaInicio: parceria.vigenciaInicio,
    vigenciaFim: parceria.vigenciaFim,
    objetivo: parceria.objetivo,
    contaBancariaDestino: parceria.contaBancariaDestino,
    contaBancariaAcaoTransversal: parceria.contaBancariaAcaoTransversal,
    aporteTotal: parceria.aporteTotal,
    valorAlocado: parceria.valorAlocado,
  });
  const [draftCadastroData, setDraftCadastroData] = useState(cadastroData);
  const [documentos, setDocumentos] = useState([
    { id: 'DOC-001', tipo: 'Termo de Cooperação', descricao: 'Documento formalizador da parceria', dataEmissao: parceria.dataAssinatura || parceria.dataEnvio, arquivo: parceria.documentoFormalizador },
    { id: 'DOC-002', tipo: 'Termo de Descentralização', descricao: 'Aporte financeiro original da parceria', dataEmissao: parceria.dataEnvio, arquivo: parceria.termoDescentralizacao },
    ...(parceria.aditivo === 'Sim' ? [{ id: 'DOC-003', tipo: 'Termo Aditivo', descricao: 'Documento de aditivo financeiro registrado', dataEmissao: '15/03/2026', arquivo: 'Termo aditivo 001/2026' }] : []),
  ]);
  const [novoDocumento, setNovoDocumento] = useState({
    tipo: 'Anexo',
    descricao: '',
    dataEmissao: '',
    arquivo: '',
  });

  const anexarDocumento = () => {
    if (!novoDocumento.tipo || !novoDocumento.arquivo) return;
    setDocumentos(prev => [
      ...prev,
      {
        id: `DOC-${String(prev.length + 1).padStart(3, '0')}`,
        tipo: novoDocumento.tipo,
        descricao: novoDocumento.descricao || novoDocumento.arquivo,
        dataEmissao: novoDocumento.dataEmissao || 'Pendente',
        arquivo: novoDocumento.arquivo,
      },
    ]);
    setNovoDocumento({ tipo: 'Anexo', descricao: '', dataEmissao: '', arquivo: '' });
  };

  const startEditingCadastro = () => {
    if (!podeEditarCadastro) return;
    setDraftCadastroData(cadastroData);
    setEditingCadastro(true);
  };

  const saveCadastroData = () => {
    setCadastroData(draftCadastroData);
    setEditingCadastro(false);
  };

  const totalAditivosFinanceiros = aditivosFinanceiros.reduce((total, aditivo) => total + aditivo.valor, 0);
  const aporteOriginal = Math.max(cadastroData.aporteTotal - totalAditivosFinanceiros, 0);

  const aportes = [
    { tipo: 'Original', data: cadastroData.dataAssinatura || parceria.dataEnvio, valor: aporteOriginal, conta: cadastroData.contaBancariaDestino, documento: parceria.termoDescentralizacao },
    ...aditivosFinanceiros.map((aditivo, index) => ({ tipo: `Aditivo financeiro ${index + 1}`, data: aditivo.data, valor: aditivo.valor, conta: cadastroData.contaBancariaDestino, documento: aditivo.documento || 'Pendente' })),
  ];
  const reservasAcaoTransversal = aportes.map(aporte => ({
    ...aporte,
    faixa: definirFaixaAcaoTransversal(aporte.valor),
    percentual: calcularPercentualAcaoTransversal(aporte.valor),
    valorReserva: calcularReservaAcaoTransversal(aporte.valor),
    saldoLiquido: Math.max(aporte.valor - calcularReservaAcaoTransversal(aporte.valor), 0),
    contaAcaoTransversal: cadastroData.contaBancariaAcaoTransversal,
  }));
  const valorReservaAcaoTransversal = reservasAcaoTransversal.reduce((total, reserva) => total + reserva.valorReserva, 0);
  const saldoDisponivel = Math.max(cadastroData.aporteTotal - valorReservaAcaoTransversal - cadastroData.valorAlocado, 0);
  const percentualReservaTotal = cadastroData.aporteTotal > 0 ? (valorReservaAcaoTransversal / cadastroData.aporteTotal) * 100 : 0;
  const valorAditivoPreview = parseCurrency(aditivoFinanceiro.valor);
  const percentualAditivoPreview = calcularPercentualAcaoTransversal(valorAditivoPreview);
  const reservaAditivoPreview = calcularReservaAcaoTransversal(valorAditivoPreview);
  const podeEditarCadastro = currentStatus === 'Rascunho' || currentStatus === 'Suspensa';

  const registrarAditivo = () => {
    if (currentStatus === 'SUSPENSA' || currentStatus === 'ENCERRADA') return;
    if (aditivoTipo === 'financeiro') {
      const valor = parseCurrency(aditivoFinanceiro.valor);
      if (valor > 0) {
        setCadastroData(prev => ({ ...prev, aporteTotal: prev.aporteTotal + valor }));
        setAditivosFinanceiros(prev => [...prev, { data: aditivoFinanceiro.data, valor, documento: aditivoFinanceiro.documento }]);
      }
      setAditivoFinanceiro({ valor: '', data: '', documento: '' });
    } else {
      const vigenciaFimAnterior = cadastroData.vigenciaFim;
      setCadastroData(prev => ({
        ...prev,
        vigenciaFim: aditivoTempo.vigenciaFim || prev.vigenciaFim,
      }));
      if (aditivoTempo.vigenciaFim) {
        setAditivosTempo(prev => [...prev, { vigenciaFimAnterior, vigenciaFim: aditivoTempo.vigenciaFim, documento: aditivoTempo.documento }]);
      }
      setAditivoTempo({ vigenciaFim: '', documento: '' });
    }
    setTemAditivo(true);
    setShowAditivo(false);
  };

  const removerAditivoFinanceiro = (index: number) => {
    const aditivo = aditivosFinanceiros[index];
    if (!aditivo) return;
    const proximosAditivos = aditivosFinanceiros.filter((_, currentIndex) => currentIndex !== index);
    setAditivosFinanceiros(proximosAditivos);
    setCadastroData(prev => ({ ...prev, aporteTotal: Math.max(prev.aporteTotal - aditivo.valor, 0) }));
    setTemAditivo(proximosAditivos.length > 0 || aditivosTempo.length > 0);
  };

  const removerAditivoTempo = (index: number) => {
    const proximosAditivos = aditivosTempo.filter((_, currentIndex) => currentIndex !== index);
    const ultimoAditivo = proximosAditivos[proximosAditivos.length - 1];
    const novaVigenciaFim = ultimoAditivo?.vigenciaFim || parceria.vigenciaFim;
    setAditivosTempo(proximosAditivos);
    setCadastroData(prev => ({ ...prev, vigenciaFim: novaVigenciaFim }));
    setTemAditivo(aditivosFinanceiros.length > 0 || proximosAditivos.length > 0);
  };

  const programas = [
    { nome: 'Programa de Pesquisa Aplicada', valor: Math.min(cadastroData.valorAlocado, 950000), estado: currentStatus === 'ENCERRADA' ? 'ENCERRADO' : currentStatus === 'SUSPENSA' ? 'SUSPENSO' : 'EM_EXECUCAO' },
    { nome: 'Programa de Inovação Regional', valor: Math.max(cadastroData.valorAlocado - 950000, 0), estado: currentStatus === 'ENCERRADA' ? 'ENCERRADO' : currentStatus === 'SUSPENSA' ? 'SUSPENSO' : 'EM_EXECUCAO' },
  ].filter(p => p.valor > 0);
  const dashboardPorPrograma = programas.map((programa, index) => {
    const fatorAportado = index === 0 ? 0.62 : 0.38;
    const valorAportado = Math.min(programa.valor * fatorAportado, programa.valor);
    const valorConsumido = Math.min(programa.valor * (fatorAportado + 0.18), programa.valor);
    const saldoDisponivelPrograma = Math.max(programa.valor - valorConsumido, 0);
    const percentualConsumido = programa.valor > 0 ? (valorConsumido / programa.valor) * 100 : 0;
    return {
      ...programa,
      codigo: index === 0 ? 'PRG-2026-001' : 'PRG-2026-002',
      valorAportado,
      valorConsumido,
      saldoDisponivelPrograma,
      percentualConsumido,
    };
  });
  const valorAportado = dashboardPorPrograma.reduce((total, programa) => total + programa.valorAportado, 0);
  const valorConsumido = dashboardPorPrograma.reduce((total, programa) => total + programa.valorConsumido, 0);
  const percentualConsumido = cadastroData.valorAlocado > 0 ? (valorConsumido / cadastroData.valorAlocado) * 100 : 0;
  const dashboardRubricas = dashboardPorPrograma.flatMap((programa, programaIndex) => {
    const itens = programaIndex === 0 ? [
      { rubrica: 'Bolsas', subrubrica: 'Bolsas de mestrado', iniciativa: 'Projeto Pesquisa Aplicada em Saúde', peso: 0.36 },
      { rubrica: 'Capital', subrubrica: 'Equipamentos de laboratório', iniciativa: 'Projeto Pesquisa Aplicada em Saúde', peso: 0.42 },
      { rubrica: 'Custeio', subrubrica: 'Material de consumo', iniciativa: 'Projeto Formação Científica Integrada', peso: 0.22 },
    ] : [
      { rubrica: 'Bolsas', subrubrica: 'Bolsas de inovação', iniciativa: 'Projeto Laboratório de Inovação Regional', peso: 0.30 },
      { rubrica: 'Capital', subrubrica: 'Protótipos e equipamentos', iniciativa: 'Projeto Laboratório de Inovação Regional', peso: 0.50 },
      { rubrica: 'Custeio', subrubrica: 'Serviços de terceiros', iniciativa: 'Projeto Formação Científica Integrada', peso: 0.20 },
    ];

    return itens.map(item => {
      const alocado = programa.valor * item.peso;
      const aportado = programa.valorAportado * item.peso;
      const consumido = programa.valorConsumido * item.peso;
      const disponivel = Math.max(alocado - consumido, 0);
      return {
        programa: programa.nome,
        iniciativa: item.iniciativa,
        rubrica: item.rubrica,
        subrubrica: item.subrubrica,
        alocado,
        aportado,
        consumido,
        disponivel,
        percentualConsumido: alocado > 0 ? (consumido / alocado) * 100 : 0,
      };
    });
  });
  const rubricasConsolidadas = Object.values(dashboardRubricas.reduce<Record<string, { rubrica: string; aportado: number; alocado: number; consumido: number; disponivel: number; programas: Set<string> }>>((acc, item) => {
    if (!acc[item.rubrica]) {
      acc[item.rubrica] = { rubrica: item.rubrica, aportado: 0, alocado: 0, consumido: 0, disponivel: 0, programas: new Set<string>() };
    }
    acc[item.rubrica].aportado += item.aportado;
    acc[item.rubrica].alocado += item.alocado;
    acc[item.rubrica].consumido += item.consumido;
    acc[item.rubrica].disponivel += item.disponivel;
    acc[item.rubrica].programas.add(item.programa);
    return acc;
  }, {}));
  const programasAfetados = programas.map(programa => programa.nome);
  const iniciativasAfetadas = [
    'Projeto Pesquisa Aplicada em Saúde',
    'Projeto Laboratório de Inovação Regional',
    'Projeto Formação Científica Integrada',
  ];

  const confirmarSuspensao = () => {
    if (!suspensao.motivo.trim()) return;
    setCurrentStatus('SUSPENSA');
    setSuspensaoRegistrada(suspensao);
    setShowSuspensao(false);
    setShowAditivo(false);
  };

  const reativarParceria = () => {
    setCurrentStatus('VIGENTE');
    setSuspensaoRegistrada(null);
  };

  const confirmarEncerramento = () => {
    if (!encerramento.justificativa.trim()) return;
    setCurrentStatus('ENCERRADA');
    setEncerramentoRegistrado({ justificativa: encerramento.justificativa, programasAfetados });
    setShowEncerramento(false);
    setShowSuspensao(false);
    setShowAditivo(false);
    setConfirmDelete(false);
    setSuspensaoRegistrada(null);
    setEncerramento({ justificativa: '' });
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
            Parcerias
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }}>
            Detalhes
          </span>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Handshake size={18} style={{ color: '#00c1af' }} />
            </div>
            <div style={{ flex: 1, marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: 0 }}>
                  {cadastroData.nome}
                </h1>
              </div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                Instituição vinculada: {cadastroData.instituicaoParceira} · Processo {cadastroData.numeroProcesso}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAditivo(true)}
              disabled={currentStatus === 'SUSPENSA' || currentStatus === 'ENCERRADA'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: '1px solid rgba(0,193,175,0.45)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'transparent',
                color: '#00c1af',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: currentStatus === 'SUSPENSA' || currentStatus === 'ENCERRADA' ? 'not-allowed' : 'pointer',
                opacity: currentStatus === 'SUSPENSA' || currentStatus === 'ENCERRADA' ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              <Plus size={16} />
              Adicionar Aditivo
            </button>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setShowActionDropdown(prev => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: `1px solid ${T.borderDefault}`, borderRadius: 'var(--radius)', backgroundColor: T.bgCard, color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
              >
                Ações
                <ChevronDown size={15} style={{ transform: showActionDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {showActionDropdown && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', minWidth: '190px', backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: 'var(--radius)', overflow: 'hidden', zIndex: 30, boxShadow: T.shadowLg }}>
                  {[
                    { label: currentStatus === 'SUSPENSA' ? 'Reativar' : 'Suspender', onClick: () => currentStatus === 'SUSPENSA' ? reativarParceria() : setShowSuspensao(true), disabled: currentStatus === 'ENCERRADA' },
                    { label: 'Encerrar', onClick: () => setShowEncerramento(true), disabled: currentStatus === 'ENCERRADA' },
                    { label: 'Deletar', onClick: () => setConfirmDelete(true), danger: true },
                  ].map(action => (
                    <button
                      key={action.label}
                      type="button"
                      disabled={action.disabled}
                      onClick={() => {
                        if (action.disabled) return;
                        action.onClick();
                        setShowActionDropdown(false);
                      }}
                      style={{ width: '100%', padding: '11px 14px', border: 'none', backgroundColor: 'transparent', color: action.disabled ? T.textMuted : action.danger ? '#f87171' : T.textPrimary, textAlign: 'left', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: action.disabled ? 'not-allowed' : 'pointer' }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '20px' }} />
        </div>

        {confirmDelete && (
          <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                  {programas.length > 0 ? 'Remoção bloqueada' : 'Confirmar exclusão da parceria'}
                </h2>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  {programas.length > 0
                    ? 'A parceria não pode ser removida porque possui aporte financeiro em programas.'
                    : 'Esta ação remove a parceria cadastrada por erro e registra a remoção no histórico de auditoria.'}
                </p>
              </div>
              <button type="button" onClick={() => setConfirmDelete(false)} style={modalCloseButtonStyle} aria-label="Fechar">
                <X size={22} />
              </button>
            </div>
            {programas.length > 0 && (
              <ImpactList title="Programas que impedem a remoção" items={programas.map(programa => `${programa.nome} (${formatCurrency(programa.valor)})`)} />
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setConfirmDelete(false)} style={modalSecondaryButtonStyle}>Cancelar</button>
              {programas.length === 0 && (
                <button type="button" onClick={onBack} style={modalPrimaryButtonStyle}>Salvar</button>
              )}
            </div>
          </div>
          </div>
        )}

        {showEncerramento && (
          <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                  Encerrar parceria
                </h2>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  {programasAfetados.length > 0
                    ? 'O encerramento finaliza a parceria e encerra os programas aportados em cascata.'
                    : 'Esta parceria não possui programas aportados e pode ser encerrada diretamente.'}
                </p>
              </div>
              <button type="button" onClick={() => setShowEncerramento(false)} style={modalCloseButtonStyle} aria-label="Fechar">
                <X size={22} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <TextAreaEditField label="Justificativa do encerramento" value={encerramento.justificativa} onChange={(justificativa) => setEncerramento({ justificativa })} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <ImpactList title="Programas que serão encerrados" items={programasAfetados} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowEncerramento(false)} style={modalSecondaryButtonStyle}>Cancelar</button>
              <button type="button" onClick={confirmarEncerramento} style={modalPrimaryButtonStyle}>Salvar</button>
            </div>
          </div>
          </div>
        )}

        {showSuspensao && (
          <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                  Suspender
                </h2>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  A suspensão afeta os programas aportados e os projetos vinculados.
                </p>
              </div>
              <button type="button" onClick={() => setShowSuspensao(false)} style={modalCloseButtonStyle} aria-label="Fechar">
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={labelStyle}>Origem da solicitação</div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {['Área de Parcerias', 'Instituição vinculada'].map(origem => (
                    <label
                      key={origem}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#ffffff',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="origem-suspensao"
                        checked={suspensao.origem === origem}
                        onChange={() => setSuspensao(prev => ({ ...prev, origem }))}
                        style={{ accentColor: '#00c1af' }}
                      />
                      {origem}
                    </label>
                  ))}
                </div>
              </div>
              <TextAreaEditField label="Motivo da suspensão" value={suspensao.motivo} onChange={(motivo) => setSuspensao(prev => ({ ...prev, motivo }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <ImpactList title="Programas que serão suspensos" items={programasAfetados} />
              <ImpactList title="Projetos que serão suspensos" items={iniciativasAfetadas} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowSuspensao(false)} style={modalSecondaryButtonStyle}>Cancelar</button>
              <button type="button" onClick={confirmarSuspensao} style={modalPrimaryButtonStyle}>Salvar</button>
            </div>
          </div>
          </div>
        )}

        {suspensaoRegistrada && currentStatus === 'SUSPENSA' && (
          <div style={{ ...cardStyle, borderColor: 'rgba(249,115,22,0.35)', backgroundColor: 'rgba(249,115,22,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Info label="Origem da suspensão" value={suspensaoRegistrada.origem} />
              <Info label="Motivo registrado" value={suspensaoRegistrada.motivo} />
              <Info label="Operações bloqueadas" value="Aditivos e novos aportes" />
            </div>
          </div>
        )}

        {encerramentoRegistrado && currentStatus === 'ENCERRADA' && (
          <div style={{ ...cardStyle, borderColor: 'rgba(163, 163, 163,0.35)', backgroundColor: 'rgba(163, 163, 163,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Info label="Justificativa do encerramento" value={encerramentoRegistrado.justificativa} />
              <Info label="Programas encerrados" value={String(encerramentoRegistrado.programasAfetados.length)} />
              <Info label="Operações bloqueadas" value="Aditivos e suspensão" />
            </div>
          </div>
        )}

        {showAditivo && (
          <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 4px' }}>
                  Adicionar Aditivo
                </h2>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                  Escolha se o aditivo altera o valor financeiro ou a vigência da parceria.
                </p>
              </div>
              <button type="button" onClick={() => setShowAditivo(false)} style={modalCloseButtonStyle} aria-label="Fechar">
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              {[
                { id: 'financeiro', label: 'Aditivo Financeiro' },
                { id: 'tempo', label: 'Aditivo de Tempo' },
              ].map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAditivoTipo(option.id as 'financeiro' | 'tempo')}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderBottom: aditivoTipo === option.id ? '2px solid #00c1af' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: aditivoTipo === option.id ? '#00c1af' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {aditivoTipo === 'financeiro' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'end' }}>
                  <CurrencyEditField label="Valor do aditivo financeiro" value={aditivoFinanceiro.valor} onChange={(valor) => setAditivoFinanceiro(prev => ({ ...prev, valor }))} labelColor="#ffffff" />
                  <DateMaskEditField label="Data do aporte" value={aditivoFinanceiro.data} onChange={(data) => setAditivoFinanceiro(prev => ({ ...prev, data }))} labelColor="#ffffff" />
                  <UploadEditField label="Documento de descentralização" fileName={aditivoFinanceiro.documento} onChange={(documento) => setAditivoFinanceiro(prev => ({ ...prev, documento }))} labelColor="#ffffff" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px', padding: '14px', border: '1px solid rgba(0,193,175,0.28)', borderRadius: '8px', backgroundColor: 'rgba(0,193,175,0.08)' }}>
                  <Info label="Percentual no aditivo" value={formatPercent(percentualAditivoPreview)} labelColor="#ffffff" />
                  <Info label="Reserva do aditivo" value={formatCurrency(reservaAditivoPreview)} labelColor="#ffffff" />
                  <Info label="Líquido para programas" value={formatCurrency(Math.max(valorAditivoPreview - reservaAditivoPreview, 0))} labelColor="#ffffff" />
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
                <DateMaskEditField label="Nova data fim da parceria" value={aditivoTempo.vigenciaFim} onChange={(vigenciaFim) => setAditivoTempo(prev => ({ ...prev, vigenciaFim }))} labelColor="#ffffff" />
                <UploadEditField label="Documento do aditivo de tempo" fileName={aditivoTempo.documento} onChange={(documento) => setAditivoTempo(prev => ({ ...prev, documento }))} labelColor="#ffffff" />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowAditivo(false)} style={modalSecondaryButtonStyle}>Cancelar</button>
              <button type="button" onClick={registrarAditivo} style={modalPrimaryButtonStyle}>Salvar</button>
            </div>
          </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Investido', value: formatCurrency(cadastroData.aporteTotal), Icon: DollarSign },
            { label: 'Ação Transversal', value: formatCurrency(valorReservaAcaoTransversal), Icon: Handshake },
            { label: 'Total Aportado', value: formatCurrency(valorAportado), Icon: Handshake },
            { label: 'Total Alocado', value: formatCurrency(cadastroData.valorAlocado), Icon: FolderOpen },
            { label: 'Total Consumido', value: formatCurrency(valorConsumido), Icon: DollarSign },
            { label: 'Saldo programas', value: formatCurrency(saldoDisponivel), Icon: DollarSign },
          ].map(({ label, value, Icon }) => (
            <div key={label} style={metricCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(0,193,175,0.12)', borderRadius: 'var(--radius)', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: '#00c1af' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                  {label}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: label.includes('impactados') || label.includes('induzidas') ? 'var(--text-2xl)' : 'var(--text-lg)', color: '#ffffff', textAlign: 'center', margin: 0 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '28px' }}>
          {[
            { id: 'resumo', label: 'Resumo' },
            { id: 'dashboard', label: 'Dashboard' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #00c1af' : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === tab.id ? '#00c1af' : 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: '-1px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'resumo' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              {editingCadastro ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <SmallButton icon={<X size={14} />} label="Cancelar" onClick={() => setEditingCadastro(false)} muted />
                  <SmallButton icon={<Save size={14} />} label="Salvar" onClick={saveCadastroData} />
                </div>
              ) : (
                podeEditarCadastro && <SmallButton icon={<Edit3 size={14} />} label="Editar" onClick={startEditingCadastro} />
              )}
            </div>

            <SummarySection number="1" title="Identificação da Parceria" subtitle="Dados básicos do processo e da instituição vinculada">
              {editingCadastro ? (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <TextEditField label="Nome da parceria" value={draftCadastroData.nome} onChange={(nome) => setDraftCadastroData(prev => ({ ...prev, nome }))} />
                  <TextEditField label="Número do processo" value={draftCadastroData.numeroProcesso} onChange={(numeroProcesso) => setDraftCadastroData(prev => ({ ...prev, numeroProcesso }))} />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '16px' }}>
                  <Info label="Nome da parceria" value={cadastroData.nome} />
                  <Info label="Número do processo" value={cadastroData.numeroProcesso} />
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                {editingCadastro ? (
                  <InstitutionEditField label="Instituição vinculada" value={draftCadastroData.instituicaoParceira} onChange={(instituicaoParceira) => setDraftCadastroData(prev => ({ ...prev, instituicaoParceira }))} />
                ) : (
                  <Info label="Instituição vinculada" value={cadastroData.instituicaoParceira} />
                )}
              </div>
              {editingCadastro ? (
                <TextAreaEditField label="Objetivo" value={draftCadastroData.objetivo} onChange={(objetivo) => setDraftCadastroData(prev => ({ ...prev, objetivo }))} />
              ) : (
                <Info label="Objetivo" value={cadastroData.objetivo} full />
              )}
            </SummarySection>

            <SummarySection number="2" title="Vigência Original" subtitle="Período inicial de validade da parceria">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {editingCadastro ? (
                  <>
                    <TextEditField label="Data de assinatura" value={draftCadastroData.dataAssinatura} onChange={(dataAssinatura) => setDraftCadastroData(prev => ({ ...prev, dataAssinatura }))} />
                    <TextEditField label="Início da vigência" value={draftCadastroData.vigenciaInicio} onChange={(vigenciaInicio) => setDraftCadastroData(prev => ({ ...prev, vigenciaInicio }))} />
                    <TextEditField label="Fim da vigência" value={draftCadastroData.vigenciaFim} onChange={(vigenciaFim) => setDraftCadastroData(prev => ({ ...prev, vigenciaFim }))} />
                  </>
                ) : (
                  <>
                    <Info label="Data de assinatura" value={cadastroData.dataAssinatura || 'Pendente'} />
                    <Info label="Início da vigência" value={cadastroData.vigenciaInicio} />
                    <Info label="Fim da vigência" value={cadastroData.vigenciaFim} />
                  </>
                )}
              </div>
              {aditivosTempo.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' }}>
                  {aditivosTempo.map((aditivo, index) => (
                    <Row key={`${aditivo.vigenciaFim}-${index}`}>
                      <Info label="Aditivo de tempo" value={`Aditivo ${index + 1}`} />
                      <Info label="Fim anterior" value={aditivo.vigenciaFimAnterior} />
                      <Info label="Novo fim" value={aditivo.vigenciaFim} />
                      <Info label="Documento" value={aditivo.documento || 'Pendente'} />
                      <RemoveButton label="Remover" onClick={() => removerAditivoTempo(index)} />
                    </Row>
                  ))}
                </div>
              )}
            </SummarySection>

            <SummarySection number="3" title="Aporte Financeiro Original" subtitle="Valor investido pela instituição vinculada e conta de destino">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                {editingCadastro ? (
                  <>
                    <NumberEditField label="Total investido" value={draftCadastroData.aporteTotal} onChange={(aporteTotal) => setDraftCadastroData(prev => ({ ...prev, aporteTotal }))} />
                    <Info label="Estado atual" value={statusLabel[currentStatus]} />
                  </>
                ) : (
                  <>
                    <Info label="Total investido" value={formatCurrency(cadastroData.aporteTotal)} />
                    <Info label="Estado atual" value={statusLabel[currentStatus]} />
                  </>
                )}
              </div>
              {editingCadastro ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <TextEditField label="Conta bancária de destino da parceria" value={draftCadastroData.contaBancariaDestino} onChange={(contaBancariaDestino) => setDraftCadastroData(prev => ({ ...prev, contaBancariaDestino }))} />
                  <TextEditField label="Conta Ação Transversal" value={draftCadastroData.contaBancariaAcaoTransversal} onChange={(contaBancariaAcaoTransversal) => setDraftCadastroData(prev => ({ ...prev, contaBancariaAcaoTransversal }))} />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <Info label="Conta bancária de destino da parceria" value={cadastroData.contaBancariaDestino} />
                  <Info label="Conta Ação Transversal" value={cadastroData.contaBancariaAcaoTransversal} />
                </div>
              )}
            </SummarySection>

            <SummarySection number="4" title="Ação Transversal" subtitle="Reserva normativa bloqueada para gestão contábil e financeira">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <Info label="Política aplicada" value="Res. CCAF 334/2023" />
                <Info label="Faixa aplicada" value={definirFaixaAcaoTransversal(cadastroData.aporteTotal)} />
                <Info label="Percentual médio reservado" value={formatPercent(percentualReservaTotal)} />
                <Info label="Valor reservado" value={formatCurrency(valorReservaAcaoTransversal)} />
                <Info label="Conta destino" value={cadastroData.contaBancariaAcaoTransversal} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Info label="Saldo alocável em programas" value={formatCurrency(saldoDisponivel)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reservasAcaoTransversal.map((reserva, index) => (
                  <Row key={`${reserva.tipo}-${index}`}>
                    <Info label="Origem" value={reserva.tipo} />
                    <Info label="Base de cálculo" value={formatCurrency(reserva.valor)} />
                    <Info label="Faixa aplicada" value={reserva.faixa} />
                    <Info label="Percentual" value={formatPercent(reserva.percentual)} />
                    <Info label="Reserva financeira" value={formatCurrency(reserva.valorReserva)} />
                    <Info label="Conta destino" value={reserva.contaAcaoTransversal} />
                    <Info label="Líquido programas" value={formatCurrency(reserva.saldoLiquido)} />
                  </Row>
                ))}
              </div>
            </SummarySection>

            <SummarySection number="5" title="Documentos" subtitle="Documentos que sustentam a formalização da parceria">
              <div style={{ ...cardStyle, padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                    Documentos da parceria
                  </h2>
                </div>

                {documentos.length === 0 ? (
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                    Nenhum documento cadastrado.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {documentos.map(documento => (
                      <Row key={documento.id}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.12)', border: '1px solid rgba(0,193,175,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={17} style={{ color: '#00c1af' }} />
                          </div>
                          <Info label="Tipo" value={documento.tipo} />
                        </div>
                        <Info label="Descrição" value={documento.descricao} />
                        <Info label="Data de emissão" value={documento.dataEmissao} />
                        <Info label="Arquivo" value={documento.arquivo} />
                      </Row>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ ...cardStyle, padding: '20px', marginBottom: 0 }}>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                    Anexar documento
                  </h2>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                    Faça upload do arquivo e classifique o documento por tipo.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr 1.2fr', gap: '16px', alignItems: 'end' }}>
                  <SelectEditField
                    label="Tipo do documento"
                    value={novoDocumento.tipo}
                    options={tipoDocumentoOptions}
                    onChange={(tipo) => setNovoDocumento(prev => ({ ...prev, tipo }))}
                  />
                  <TextEditField
                    label="Descrição"
                    value={novoDocumento.descricao}
                    onChange={(descricao) => setNovoDocumento(prev => ({ ...prev, descricao }))}
                  />
                  <DateMaskEditField
                    label="Data de emissão"
                    value={novoDocumento.dataEmissao}
                    onChange={(dataEmissao) => setNovoDocumento(prev => ({ ...prev, dataEmissao }))}
                  />
                  <UploadEditField
                    label="Arquivo"
                    fileName={novoDocumento.arquivo}
                    onChange={(arquivo) => setNovoDocumento(prev => ({ ...prev, arquivo }))}
                  />
                </div>
              </div>
            </SummarySection>
          </div>
        )}

        {activeTab === 'financeiro' && (
          <>
            <div style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 20px' }}>
                Aportes financeiros
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {aportes.map((aporte, index) => (
                  <Row key={`${aporte.tipo}-${aporte.data}`}>
                    <Info label="Tipo" value={aporte.tipo} />
                    <Info label="Data" value={aporte.data} />
                    <Info label="Valor" value={formatCurrency(aporte.valor)} />
                    <Info label="Conta destino" value={aporte.conta} />
                    <Info label="Documento" value={aporte.documento} />
                    {index === 0 ? <Info label="Ação" value="-" /> : <RemoveButton label="Remover" onClick={() => removerAditivoFinanceiro(index - 1)} />}
                  </Row>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 20px' }}>
                Reserva de Ação Transversal
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reservasAcaoTransversal.map((reserva, index) => (
                  <Row key={`${reserva.tipo}-${reserva.data}-${index}`}>
                    <Info label="Origem" value={reserva.tipo} />
                    <Info label="Valor base" value={formatCurrency(reserva.valor)} />
                    <Info label="Faixa aplicada" value={reserva.faixa} />
                    <Info label="Percentual" value={formatPercent(reserva.percentual)} />
                    <Info label="Valor reservado" value={formatCurrency(reserva.valorReserva)} />
                    <Info label="Conta destino" value={reserva.contaAcaoTransversal} />
                  </Row>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 20px' }}>
                Alocação em programas
              </h2>
              {programas.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  Nenhum programa recebeu aporte desta parceria.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {programas.map(programa => (
                    <Row key={programa.nome}>
                      <Info label="Programa" value={programa.nome} />
                      <Info label="Valor alocado" value={formatCurrency(programa.valor)} />
                      <Info label="Estado" value={programa.estado} />
                    </Row>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div style={{ ...cardStyle, padding: '16px 18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                  Impactos da Parceria
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
                  {[
                    { label: 'Programas', value: String(parceria.programasRelacionados), Icon: FolderOpen },
                    { label: 'Demandas induzidas', value: String(Math.max(1, Math.floor(parceria.programasRelacionados / 2))), Icon: Handshake },
                    { label: 'Projetos', value: String(parceria.iniciativasImpactadas), Icon: Handshake },
                  ].map(({ label, value, Icon }) => (
                    <div key={label} style={{ padding: '16px 18px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.28)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', backgroundColor: 'rgba(0,193,175,0.12)', borderRadius: '7px', flexShrink: 0 }}>
                          <Icon size={17} style={{ color: '#00c1af' }} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                          {label}
                        </div>
                      </div>
                      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: 0, textAlign: 'center' }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                    Detalhamento por programa
                  </h3>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    Acompanhamento do recurso aportado, alocado, consumido e disponível em cada programa.
                  </p>
                </div>
              </div>

              {dashboardPorPrograma.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  Nenhum programa recebeu aporte desta parceria.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dashboardPorPrograma.map(programa => (
                    <div
                      key={programa.codigo}
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenPrograma?.({ codigo: programa.codigo, nome: programa.nome })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onOpenPrograma?.({ codigo: programa.codigo, nome: programa.nome });
                        }
                      }}
                      style={{
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(23, 23, 23,0.35)',
                        cursor: onOpenPrograma ? 'pointer' : 'default',
                        outline: 'none',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                        <Info label="Programa" value={`${programa.codigo} · ${programa.nome}`} />
                        <Info label="Aportado" value={formatCurrency(programa.valorAportado)} />
                        <Info label="Alocado" value={formatCurrency(programa.valor)} />
                        <Info label="Consumido" value={formatCurrency(programa.valorConsumido)} />
                        <Info label="Disponível" value={formatCurrency(programa.saldoDisponivelPrograma)} />
                      </div>
                      <div style={{ height: '6px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(programa.percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: T.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div style={{ ...cardStyle, marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                    Consumo por rubricas
                  </h3>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                    Somatória de cada rubrica em todos os programas aportados por esta parceria.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
                {rubricasConsolidadas.map(rubrica => {
                  const percentual = rubrica.alocado > 0 ? (rubrica.consumido / rubrica.alocado) * 100 : 0;
                  return (
                    <div key={rubrica.rubrica} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.35)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.15fr repeat(5, 1fr)', columnGap: '24px', rowGap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                        <Info label="Rubrica" value={rubrica.rubrica} />
                        <Info label="Programas com rubrica" value={String(rubrica.programas.size)} />
                        <Info label="Aportado total" value={formatCurrency(rubrica.aportado)} />
                        <Info label="Alocado total" value={formatCurrency(rubrica.alocado)} />
                        <Info label="Consumido total" value={formatCurrency(rubrica.consumido)} />
                        <Info label="Disponível total" value={formatCurrency(rubrica.disponivel)} />
                        <Info label="Consumo" value={formatPercent(percentual)} />
                      </div>
                      <div style={{ height: '6px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(percentual, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: T.accent }} />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

const SummarySection: React.FC<{ number: string; title: string; subtitle: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => (
  <div style={cardStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>{number}</span>
      </div>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: 0 }}>
        {title}
      </p>
    </div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: '0 0 24px' }}>
      {subtitle}
    </p>
    {children}
  </div>
);

const SmallButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; muted?: boolean; danger?: boolean }> = ({ icon, label, onClick, muted, danger }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '34px',
      padding: '0 12px',
      backgroundColor: danger ? 'rgba(239,68,68,0.08)' : muted ? 'transparent' : 'rgba(0,193,175,0.12)',
      border: danger ? '1px solid rgba(239,68,68,0.28)' : muted ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,193,175,0.35)',
      borderRadius: 'var(--radius)',
      color: danger ? '#f87171' : muted ? 'rgba(255,255,255,0.7)' : '#00c1af',
      fontFamily: 'var(--font-family)',
      fontSize: 'var(--text-sm)',
      cursor: 'pointer',
    }}
  >
    {icon}
    {label}
  </button>
);

const ImpactList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.35)' }}>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
          Nenhum item afetado.
        </p>
      ) : items.map(item => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.72)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316', flexShrink: 0 }} />
          {item}
        </div>
      ))}
    </div>
  </div>
);

const RemoveButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <div>
    <div style={labelStyle}>Ação</div>
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '34px',
        padding: '0 12px',
        backgroundColor: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.28)',
        borderRadius: 'var(--radius)',
        color: '#f87171',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--text-xs)',
        cursor: 'pointer',
      }}
    >
      <Trash2 size={14} />
      {label}
    </button>
  </div>
);

const TextEditField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <div style={labelStyle}>{label}</div>
    <input value={value} onChange={event => onChange(event.target.value)} style={inputStyle} />
  </div>
);

const SelectEditField: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <div>
    <div style={labelStyle}>{label}</div>
    <select value={value} onChange={event => onChange(event.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
      {options.map(option => (
        <option key={option} value={option} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const DateMaskEditField: React.FC<{ label: string; value: string; onChange: (value: string) => void; labelColor?: string }> = ({ label, value, onChange, labelColor }) => (
  <div>
    <div style={{ ...labelStyle, color: labelColor || labelStyle.color }}>{label}</div>
    <input
      value={value}
      onChange={event => onChange(maskDate(event.target.value))}
      placeholder="dd/mm/aaaa"
      maxLength={10}
      inputMode="numeric"
      style={inputStyle}
    />
  </div>
);

const CurrencyEditField: React.FC<{ label: string; value: string; onChange: (value: string) => void; labelColor?: string }> = ({ label, value, onChange, labelColor }) => (
  <div>
    <div style={{ ...labelStyle, color: labelColor || labelStyle.color }}>{label}</div>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
        R$
      </span>
      <input
        value={value}
        onChange={event => onChange(maskCurrency(event.target.value))}
        placeholder="0,00"
        inputMode="decimal"
        style={{ ...inputStyle, paddingLeft: '38px' }}
      />
    </div>
  </div>
);

const NumberEditField: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <div style={labelStyle}>{label}</div>
    <input
      type="number"
      min="0"
      step="1000"
      value={value}
      onChange={event => onChange(Number(event.target.value))}
      style={inputStyle}
    />
  </div>
);

const TextAreaEditField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div style={{ gridColumn: '1 / -1' }}>
    <div style={labelStyle}>{label}</div>
    <textarea
      value={value}
      onChange={event => onChange(event.target.value)}
      style={{ ...inputStyle, minHeight: '96px', resize: 'vertical', lineHeight: '1.5' }}
    />
  </div>
);

const UploadEditField: React.FC<{ label: string; fileName: string; onChange: (fileName: string) => void; labelColor?: string }> = ({ label, fileName, onChange, labelColor }) => (
  <div>
    <div style={{ ...labelStyle, color: labelColor || labelStyle.color }}>{label}</div>
    <label
      style={{
        ...inputStyle,
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        cursor: 'pointer',
        color: fileName ? '#ffffff' : 'rgba(255,255,255,0.45)',
      }}
    >
      <span>{fileName || 'Selecionar arquivo'}</span>
      <Upload size={15} style={{ color: '#00c1af', flexShrink: 0 }} />
      <input
        type="file"
        accept=".pdf,.doc,.docx,.odt"
        onChange={event => onChange(event.target.files?.[0]?.name || '')}
        style={{ display: 'none' }}
      />
    </label>
  </div>
);

const InstitutionEditField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = instituicoesOptions.find(option => option.value === value);
  const normalizedQuery = query.toLowerCase().replace(/\D/g, '');
  const filtered = instituicoesOptions.filter(option => {
    const labelMatch = option.label.toLowerCase().includes(query.toLowerCase());
    const cnpjMatch = option.cnpj.replace(/\D/g, '').includes(normalizedQuery);
    return query.length === 0 || labelMatch || cnpjMatch;
  });

  return (
    <div style={{ position: 'relative' }}>
      <div style={labelStyle}>{label}</div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
      >
        <span>{selected ? `${selected.label} · ${selected.cnpj}` : value}</span>
        <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', zIndex: 350, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ position: 'relative', padding: '10px' }}>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Digite nome ou CNPJ"
              style={{ ...inputStyle, paddingLeft: '36px', backgroundColor: 'rgba(23, 23, 23,0.8)' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setQuery('');
                  setOpen(false);
                }}
                style={{ width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none', backgroundColor: value === option.value ? 'rgba(0,193,175,0.1)' : 'transparent', color: value === option.value ? '#00c1af' : '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
              >
                <span style={{ display: 'block' }}>{option.label}</span>
                <span style={{ display: 'block', marginTop: '3px', color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-xs)' }}>
                  CNPJ {option.cnpj}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Info: React.FC<{ label: string; value: string; full?: boolean; labelColor?: string }> = ({ label, value, full, labelColor }) => (
  <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
    <div style={{ ...labelStyle, color: labelColor || labelStyle.color }}>{label}</div>
    <p style={{ ...valueStyle, color: value === 'Pendente' ? '#f59e0b' : valueStyle.color, lineHeight: '1.5' }}>
      {value}
    </p>
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.35)' }}>
    {children}
  </div>
);
