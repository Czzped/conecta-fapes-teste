import React, { useState } from 'react';
import { ChevronDown, ChevronRight, DollarSign, FolderOpen, Handshake, PauseCircle, Plus, Search } from 'lucide-react';
import { FormularioParceria } from './FormularioParceria';
import { DetalhesParceria } from './DetalhesParceria';
import { DetalhesPrograma } from './DetalhesPrograma';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

type StatusFilter = 'Rascunho' | 'Ativo' | 'Finalizado';
type ParceriaStatus = StatusFilter;
type DataFimSort = 'Mais Recente' | 'Mais Antiga';

export interface ParceriaItem {
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
  aporteTotal: number;
  valorAlocado: number;
  saldoDisponivel: number;
  percentualAcaoTransversal: number;
  faixaAcaoTransversal: string;
  valorReservaAcaoTransversal: number;
  contaBancariaAcaoTransversal: string;
  saldoAlocavelEmProgramas: number;
  programasRelacionados: number;
  iniciativasImpactadas: number;
  documentoSolicitacao: string;
  documentoFormalizador: string;
  termoDescentralizacao: string;
  contaBancariaDestino: string;
}

const statusLabel: Record<ParceriaStatus, string> = {
  Rascunho: 'Rascunho',
  Ativo: 'Ativo',
  Finalizado: 'Finalizado',
};

const statusColor = (status: ParceriaStatus) => {
  switch (status) {
    case 'Rascunho': return '#f59e0b';
    case 'Ativo': return '#22c55e';
    case 'Finalizado': return '#a3a3a3';
    default: return '#a3a3a3';
  }
};

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
);

const parseDateBR = (value: string) => {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
};

const calcularPercentualAcaoTransversal = (valor: number) => {
  if (valor < 50000) return 0;
  if (valor <= 2000000) return 5;
  if (valor <= 5000000) return 4;
  return 3;
};

const calcularReservaAcaoTransversal = (valor: number) => {
  const percentual = calcularPercentualAcaoTransversal(valor);
  return {
    percentual,
    reserva: Math.round(valor * percentual) / 100,
  };
};

const definirFaixaAcaoTransversal = (valor: number) => {
  if (valor < 50000) return 'Sem retenção';
  if (valor <= 2000000) return 'Faixa 1';
  if (valor <= 5000000) return 'Faixa 2';
  return 'Faixa 3';
};

const calcularReservaConsolidada = (valorTotal: number, aditivo: 'Sim' | 'Não') => {
  const parcelas = aditivo === 'Sim' ? [Math.max(valorTotal - 500000, 0), 500000] : [valorTotal];
  const reservas = parcelas.map(valor => {
    const { percentual, reserva } = calcularReservaAcaoTransversal(valor);
    return {
      valor,
      percentual,
      reserva,
      faixa: definirFaixaAcaoTransversal(valor),
    };
  });
  const reservaTotal = reservas.reduce((total, item) => total + item.reserva, 0);
  const percentualEfetivo = valorTotal > 0 ? (reservaTotal / valorTotal) * 100 : 0;
  const faixas = Array.from(new Set(reservas.map(item => item.faixa)));
  const faixaLabel = reservas.length > 1 ? `${faixas.join(' + ')} (${reservas.length} aportes)` : faixas[0];

  return {
    percentual: percentualEfetivo,
    reserva: reservaTotal,
    faixa: faixaLabel,
  };
};

const buildCardStyle = (T: ThemeTokens): React.CSSProperties => ({
  backgroundColor: T.bgCard,
  border: `1px solid ${T.borderSubtle}`,
  borderRadius: '10px',
  padding: '20px',
});

interface Props {
  onBack: () => void;
}

export const Parceria: React.FC<Props> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const cardStyle = buildCardStyle(T);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'listagem'>('listagem');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter | 'Todos'>('Todos');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [dataFimSort, setDataFimSort] = useState<DataFimSort>('Mais Recente');
  const [showDataFimDropdown, setShowDataFimDropdown] = useState(false);
  const [instituicaoFilter, setInstituicaoFilter] = useState('Todos');
  const [showInstituicaoDropdown, setShowInstituicaoDropdown] = useState(false);
  const [showNovaParceria, setShowNovaParceria] = useState(false);
  const [selectedParceria, setSelectedParceria] = useState<ParceriaItem | null>(null);
  const [selectedProgramaFromParceria, setSelectedProgramaFromParceria] = useState<{ codigo: string; nome: string } | null>(null);

  const statusOptions: StatusFilter[] = ['Rascunho', 'Ativo', 'Finalizado'];
  const dataFimOptions: DataFimSort[] = ['Mais Recente', 'Mais Antiga'];
  const parceriasBase = [
    {
      id: 1,
      nome: 'Cooperação Fapes-Ufes em Pesquisa Aplicada',
      instituicaoParceira: 'Ufes',
      dataEnvio: '15/01/2026',
      aditivo: 'Sim',
      area: 'Pesquisa',
      status: 'Ativo',
      investimento: 'R$ 2.500.000,00',
      dataAssinatura: '10/01/2026',
      vigenciaInicio: '01/02/2026',
      vigenciaFim: '31/01/2029',
      numeroProcesso: '2026-AB12F',
      objetivo: 'Viabilizar programas e iniciativas de pesquisa aplicada em áreas estratégicas para o Espírito Santo.',
      coordenadorNome: 'Dr. Carlos Silva',
      coordenadorEmail: 'carlos.silva@ufes.br',
      coordenadorCelular: '(27) 98765-4321',
      aporteTotal: 2500000,
      valorAlocado: 1850000,
      saldoDisponivel: 650000,
      programasRelacionados: 3,
      iniciativasImpactadas: 12,
      documentoSolicitacao: 'Solicitação institucional Ufes 015/2026',
      documentoFormalizador: 'Termo de Cooperação 004/2026',
      termoDescentralizacao: 'TED 018/2026',
      contaBancariaDestino: 'Banco 001 / Ag. 1234 / CC 98765-0',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000123-4',
    },
    {
      id: 2,
      nome: 'Parceria Fapes-Ifes para Inovação',
      instituicaoParceira: 'Ifes',
      dataEnvio: '10/02/2026',
      aditivo: 'Não',
      area: 'Inovação',
      status: 'Ativo',
      investimento: 'R$ 3.800.000,00',
      dataAssinatura: '05/02/2026',
      vigenciaInicio: '01/03/2026',
      vigenciaFim: '28/02/2030',
      numeroProcesso: '2026-CD34G',
      objetivo: 'Apoiar ações de inovação tecnológica, empreendedorismo e desenvolvimento regional.',
      coordenadorNome: 'Dra. Maria Santos',
      coordenadorEmail: 'maria.santos@ifes.edu.br',
      coordenadorCelular: '(27) 99911-2233',
      aporteTotal: 3800000,
      valorAlocado: 2200000,
      saldoDisponivel: 1600000,
      programasRelacionados: 2,
      iniciativasImpactadas: 9,
      documentoSolicitacao: 'Ofício Ifes 048/2026',
      documentoFormalizador: 'Termo de Cooperação 009/2026',
      termoDescentralizacao: 'TED 027/2026',
      contaBancariaDestino: 'Banco 104 / Ag. 0221 / CC 45678-2',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000124-2',
    },
    {
      id: 3,
      nome: 'Termo Fapes-UFMG para Extensão Científica',
      instituicaoParceira: 'UFMG',
      dataEnvio: '05/03/2026',
      aditivo: 'Não',
      area: 'Extensão',
      status: 'Rascunho',
      investimento: 'R$ 1.200.000,00',
      dataAssinatura: '',
      vigenciaInicio: '01/05/2026',
      vigenciaFim: '30/04/2028',
      numeroProcesso: '2026-EF56H',
      objetivo: 'Estruturar ações de extensão científica integradas a programas de formação.',
      coordenadorNome: 'Prof. João Oliveira',
      coordenadorEmail: 'joao.oliveira@ufmg.br',
      coordenadorCelular: '(31) 98888-4455',
      aporteTotal: 1200000,
      valorAlocado: 0,
      saldoDisponivel: 1200000,
      programasRelacionados: 0,
      iniciativasImpactadas: 0,
      documentoSolicitacao: 'Solicitação UFMG 021/2026',
      documentoFormalizador: 'Pendente',
      termoDescentralizacao: 'Pendente',
      contaBancariaDestino: 'A definir',
      contaBancariaAcaoTransversal: 'A definir',
    },
    {
      id: 4,
      nome: 'Cooperação Fapes-USP em Saúde',
      instituicaoParceira: 'USP',
      dataEnvio: '20/12/2025',
      aditivo: 'Sim',
      area: 'Pesquisa',
      status: 'Finalizado',
      investimento: 'R$ 4.500.000,00',
      dataAssinatura: '15/12/2025',
      vigenciaInicio: '01/01/2026',
      vigenciaFim: '31/12/2030',
      numeroProcesso: '2025-IJ78K',
      objetivo: 'Promover pesquisa em ciências da saúde e desenvolvimento de novas soluções assistenciais.',
      coordenadorNome: 'Dra. Ana Paula Costa',
      coordenadorEmail: 'ana.costa@usp.br',
      coordenadorCelular: '(11) 98765-4321',
      aporteTotal: 4500000,
      valorAlocado: 3100000,
      saldoDisponivel: 1400000,
      programasRelacionados: 4,
      iniciativasImpactadas: 18,
      documentoSolicitacao: 'Ofício USP 190/2025',
      documentoFormalizador: 'Termo de Cooperação 032/2025',
      termoDescentralizacao: 'TED 091/2025',
      contaBancariaDestino: 'Banco 001 / Ag. 4410 / CC 11223-9',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000118-8',
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
      numeroProcesso: '2025-LM90N',
      objetivo: 'Cooperação internacional para intercâmbio científico e desenvolvimento conjunto de pesquisas.',
      coordenadorNome: 'Prof. Richard Brown',
      coordenadorEmail: 'r.brown@mit.edu',
      coordenadorCelular: '+1 617 555-0100',
      aporteTotal: 8900000,
      valorAlocado: 8900000,
      saldoDisponivel: 0,
      programasRelacionados: 5,
      iniciativasImpactadas: 24,
      documentoSolicitacao: 'Letter of Intent MIT 2025-11',
      documentoFormalizador: 'Cooperation Agreement 011/2025',
      termoDescentralizacao: 'Não aplicável',
      contaBancariaDestino: 'International transfer account',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000109-9',
    },
    {
      id: 6,
      nome: 'Parceria Fapes-Secti para Transformação Digital',
      instituicaoParceira: 'Secti',
      dataEnvio: '08/04/2026',
      aditivo: 'Não',
      area: 'Inovação',
      status: 'Ativo',
      investimento: 'R$ 2.100.000,00',
      dataAssinatura: '02/04/2026',
      vigenciaInicio: '01/05/2026',
      vigenciaFim: '30/04/2029',
      numeroProcesso: '2026-NO12P',
      objetivo: 'Apoiar iniciativas digitais vinculadas à transformação tecnológica do Estado.',
      coordenadorNome: 'Dra. Lívia Castro',
      coordenadorEmail: 'livia.castro@secti.es.gov.br',
      coordenadorCelular: '(27) 98888-1200',
      aporteTotal: 2100000,
      valorAlocado: 980000,
      saldoDisponivel: 1120000,
      programasRelacionados: 2,
      iniciativasImpactadas: 7,
      documentoSolicitacao: 'Ofício Secti 034/2026',
      documentoFormalizador: 'Termo de Cooperação 014/2026',
      termoDescentralizacao: 'TED 041/2026',
      contaBancariaDestino: 'Banco 021 / Ag. 0007 / CC 55432-1',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000131-0',
    },
    {
      id: 7,
      nome: 'Cooperação Fapes-Findes em Empreendedorismo',
      instituicaoParceira: 'Findes',
      dataEnvio: '12/04/2026',
      aditivo: 'Sim',
      area: 'Inovação',
      status: 'Ativo',
      investimento: 'R$ 3.200.000,00',
      dataAssinatura: '07/04/2026',
      vigenciaInicio: '01/06/2026',
      vigenciaFim: '31/05/2030',
      numeroProcesso: '2026-QR34S',
      objetivo: 'Estruturar programas de empreendedorismo e inovação aberta.',
      coordenadorNome: 'Marcos Vieira',
      coordenadorEmail: 'marcos.vieira@findes.org.br',
      coordenadorCelular: '(27) 97777-4500',
      aporteTotal: 3200000,
      valorAlocado: 1640000,
      saldoDisponivel: 1560000,
      programasRelacionados: 3,
      iniciativasImpactadas: 11,
      documentoSolicitacao: 'Ofício Findes 078/2026',
      documentoFormalizador: 'Termo de Cooperação 016/2026',
      termoDescentralizacao: 'TED 047/2026',
      contaBancariaDestino: 'Banco 001 / Ag. 0910 / CC 66321-8',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000133-6',
    },
    {
      id: 8,
      nome: 'Parceria Fapes-Sesa em Pesquisa Clínica',
      instituicaoParceira: 'Sesa',
      dataEnvio: '18/04/2026',
      aditivo: 'Não',
      area: 'Pesquisa',
      status: 'Ativo',
      investimento: 'R$ 2.850.000,00',
      dataAssinatura: '12/04/2026',
      vigenciaInicio: '01/06/2026',
      vigenciaFim: '31/05/2029',
      numeroProcesso: '2026-TU56V',
      objetivo: 'Financiar iniciativas de pesquisa clínica e saúde pública aplicada.',
      coordenadorNome: 'Dra. Camila Nunes',
      coordenadorEmail: 'camila.nunes@sesa.es.gov.br',
      coordenadorCelular: '(27) 96666-2300',
      aporteTotal: 2850000,
      valorAlocado: 1180000,
      saldoDisponivel: 1670000,
      programasRelacionados: 2,
      iniciativasImpactadas: 9,
      documentoSolicitacao: 'Ofício Sesa 112/2026',
      documentoFormalizador: 'Termo de Cooperação 019/2026',
      termoDescentralizacao: 'TED 052/2026',
      contaBancariaDestino: 'Banco 104 / Ag. 1102 / CC 77120-3',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000137-9',
    },
    {
      id: 9,
      nome: 'Parceria Fapes-IJSN em Dados Públicos',
      instituicaoParceira: 'IJSN',
      dataEnvio: '22/04/2026',
      aditivo: 'Não',
      area: 'Difusão',
      status: 'Ativo',
      investimento: 'R$ 1.650.000,00',
      dataAssinatura: '18/04/2026',
      vigenciaInicio: '01/07/2026',
      vigenciaFim: '30/06/2028',
      numeroProcesso: '2026-WX78Y',
      objetivo: 'Apoiar o uso de dados públicos em pesquisas estratégicas.',
      coordenadorNome: 'Eduardo Rios',
      coordenadorEmail: 'eduardo.rios@ijsn.es.gov.br',
      coordenadorCelular: '(27) 95555-9800',
      aporteTotal: 1650000,
      valorAlocado: 720000,
      saldoDisponivel: 930000,
      programasRelacionados: 1,
      iniciativasImpactadas: 5,
      documentoSolicitacao: 'Ofício IJSN 045/2026',
      documentoFormalizador: 'Termo de Cooperação 021/2026',
      termoDescentralizacao: 'TED 058/2026',
      contaBancariaDestino: 'Banco 021 / Ag. 0042 / CC 88001-2',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000140-1',
    },
    {
      id: 10,
      nome: 'Cooperação Fapes-UVV em Educação Científica',
      instituicaoParceira: 'UVV',
      dataEnvio: '28/04/2026',
      aditivo: 'Não',
      area: 'Extensão',
      status: 'Ativo',
      investimento: 'R$ 1.950.000,00',
      dataAssinatura: '23/04/2026',
      vigenciaInicio: '01/07/2026',
      vigenciaFim: '30/06/2029',
      numeroProcesso: '2026-ZA90B',
      objetivo: 'Ampliar ações de educação científica em escolas públicas.',
      coordenadorNome: 'Profa. Beatriz Lopes',
      coordenadorEmail: 'beatriz.lopes@uvv.br',
      coordenadorCelular: '(27) 94444-7810',
      aporteTotal: 1950000,
      valorAlocado: 860000,
      saldoDisponivel: 1090000,
      programasRelacionados: 2,
      iniciativasImpactadas: 8,
      documentoSolicitacao: 'Ofício UVV 063/2026',
      documentoFormalizador: 'Termo de Cooperação 024/2026',
      termoDescentralizacao: 'TED 061/2026',
      contaBancariaDestino: 'Banco 001 / Ag. 2210 / CC 99012-7',
      contaBancariaAcaoTransversal: 'BANESTES / Ag. 0192 / CC AT-000142-8',
    },
  ];

  const parceriasData: ParceriaItem[] = parceriasBase.map(parceria => {
    const { percentual, reserva, faixa } = calcularReservaConsolidada(parceria.aporteTotal, parceria.aditivo);
    return {
      ...parceria,
      percentualAcaoTransversal: percentual,
      faixaAcaoTransversal: faixa,
      valorReservaAcaoTransversal: reserva,
      saldoDisponivel: Math.max(parceria.aporteTotal - reserva - parceria.valorAlocado, 0),
      saldoAlocavelEmProgramas: Math.max(parceria.aporteTotal - reserva - parceria.valorAlocado, 0),
    };
  });

  const instituicaoOptions = ['Todos', ...Array.from(new Set(parceriasData.map(p => p.instituicaoParceira)))];

  const filtered = parceriasData.filter(p => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      p.nome.toLowerCase().includes(query) ||
      p.instituicaoParceira.toLowerCase().includes(query) ||
      p.numeroProcesso.toLowerCase().includes(query);
    const matchStatus = statusFilter === 'Todos' || p.status === statusFilter;
    const matchInstituicao = instituicaoFilter === 'Todos' || p.instituicaoParceira === instituicaoFilter;
    return matchSearch && matchStatus && matchInstituicao;
  }).sort((a, b) => {
    const delta = parseDateBR(b.vigenciaFim) - parseDateBR(a.vigenciaFim);
    return dataFimSort === 'Mais Recente' ? delta : -delta;
  });

  const totalInvestido = parceriasData.reduce((acc, p) => acc + p.aporteTotal, 0);
  const totalAcaoTransversal = parceriasData.reduce((acc, p) => acc + p.valorReservaAcaoTransversal, 0);
  const totalAlocado = parceriasData.reduce((acc, p) => acc + p.valorAlocado, 0);
  const saldoTotal = parceriasData.reduce((acc, p) => acc + p.saldoAlocavelEmProgramas, 0);
  const totalAportado = parceriasData.reduce((acc, p) => {
    const fatorAportado = p.status === 'Finalizado' ? 0.92 : p.status === 'Rascunho' ? 0 : 0.58;
    return acc + Math.min(p.valorAlocado * fatorAportado, p.valorAlocado);
  }, 0);
  const percentualAportadoPortfolio = totalAlocado > 0 ? (totalAportado / totalAlocado) * 100 : 0;
  const percentualAlocadoPortfolio = totalInvestido > 0 ? (totalAlocado / totalInvestido) * 100 : 0;
  const percentualDisponivelPortfolio = totalInvestido > 0 ? (saldoTotal / totalInvestido) * 100 : 0;
  const programasPortfolio = [
    {
      nome: 'Programa de Pesquisa Aplicada',
      alocado: parceriasData.reduce((acc, p) => acc + Math.min(p.valorAlocado, Math.round(p.valorAlocado * 0.52)), 0),
      fatorAportado: 0.62,
    },
    {
      nome: 'Programa de Inovação Regional',
      alocado: parceriasData.reduce((acc, p) => acc + Math.round(p.valorAlocado * 0.30), 0),
      fatorAportado: 0.48,
    },
    {
      nome: 'Programa de Formação Científica',
      alocado: parceriasData.reduce((acc, p) => acc + Math.max(p.valorAlocado - Math.round(p.valorAlocado * 0.82), 0), 0),
      fatorAportado: 0.36,
    },
  ].filter(programa => programa.alocado > 0).map(programa => {
    const aportado = Math.min(programa.alocado * programa.fatorAportado, programa.alocado);
    const consumido = Math.min(programa.alocado * (programa.fatorAportado + 0.18), programa.alocado);
    return {
      nome: programa.nome,
      alocado: programa.alocado,
      aportado,
      consumido,
      saldo: Math.max(programa.alocado - consumido, 0),
      percentualAlocado: totalAlocado > 0 ? (programa.alocado / totalAlocado) * 100 : 0,
      percentualDisponivel: programa.alocado > 0 ? (Math.max(programa.alocado - consumido, 0) / programa.alocado) * 100 : 0,
      percentualConsumido: programa.alocado > 0 ? (consumido / programa.alocado) * 100 : 0,
    };
  });
  const totalConsumidoPortfolio = programasPortfolio.reduce((acc, programa) => acc + programa.consumido, 0);
  const percentualConsumidoPortfolio = totalAlocado > 0 ? (totalConsumidoPortfolio / totalAlocado) * 100 : 0;
  const rubricasPortfolio = [
    { nome: 'Bolsas', peso: 0.34, fatorAportado: 0.60 },
    { nome: 'Capital', peso: 0.42, fatorAportado: 0.45 },
    { nome: 'Custeio', peso: 0.24, fatorAportado: 0.54 },
  ].map(rubrica => {
    const alocado = totalAlocado * rubrica.peso;
    const aportado = alocado * rubrica.fatorAportado;
    const consumido = Math.min(alocado * (rubrica.fatorAportado + 0.16), alocado);
    return {
      nome: rubrica.nome,
      alocado,
      aportado,
      consumido,
      saldo: Math.max(alocado - consumido, 0),
      percentualAlocado: totalAlocado > 0 ? (alocado / totalAlocado) * 100 : 0,
      percentualDisponivel: alocado > 0 ? (Math.max(alocado - consumido, 0) / alocado) * 100 : 0,
      percentualConsumido: alocado > 0 ? (consumido / alocado) * 100 : 0,
    };
  });

  if (selectedParceria && selectedProgramaFromParceria) {
    return (
      <DetalhesPrograma
        programaNome={selectedProgramaFromParceria.nome}
        onBack={() => setSelectedProgramaFromParceria(null)}
      />
    );
  }

  if (selectedParceria) {
    return (
      <DetalhesParceria
        parceria={selectedParceria}
        onBack={() => {
          setSelectedProgramaFromParceria(null);
          setSelectedParceria(null);
        }}
        onOpenPrograma={setSelectedProgramaFromParceria}
      />
    );
  }

  if (showNovaParceria) {
    return <FormularioParceria onBack={() => setShowNovaParceria(false)} />;
  }

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
                <Handshake size={18} style={{ color: T.accent }} />
              </div>
              <div style={{ flex: 1, marginTop: '6px' }}>
                <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, lineHeight: '1.5' }}>
                  Parcerias
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: '1.5' }}>
                  Acompanhe a formalização, vigência, aportes e saldo disponível de cada parceria institucional.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNovaParceria(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: T.accent, border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 18px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: T.accentText,
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Plus size={16} />
              Nova Parceria
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.borderSubtle}`, marginBottom: '28px' }}>
          {[
            { id: 'listagem', label: 'Parcerias' },
            { id: 'dashboard', label: 'Dashboard' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${T.accent}` : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === tab.id ? T.accent : T.textSecondary, cursor: 'pointer', marginBottom: '-1px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Investido', value: formatCurrency(totalInvestido), Icon: DollarSign, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
              { label: 'Ação Transversal', value: formatCurrency(totalAcaoTransversal), detail: 'Reserva normativa', Icon: Handshake, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
              { label: 'Total Aportado', value: formatCurrency(totalAportado), detail: `${formatPercent(percentualAportadoPortfolio)} do alocado`, Icon: Handshake, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
              { label: 'Total Alocado', value: formatCurrency(totalAlocado), detail: `${formatPercent(percentualAlocadoPortfolio)} do investido`, Icon: FolderOpen, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
              { label: 'Total Consumido', value: formatCurrency(totalConsumidoPortfolio), detail: `${formatPercent(percentualConsumidoPortfolio)} do alocado`, Icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
              { label: 'Saldo para programas', value: formatCurrency(saldoTotal), detail: `${formatPercent(percentualDisponivelPortfolio)} do investido`, Icon: DollarSign, color: '#00c1af', bg: 'rgba(0,193,175,0.12)' },
            ].map(({ label, value, detail, Icon, color, bg }) => (
              <div key={label} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: bg, borderRadius: 'var(--radius)', flexShrink: 0 }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
                    {label}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: T.textPrimary, textAlign: 'center', margin: 0 }}>
                  {value}
                </p>
                {detail && (
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, textAlign: 'center', margin: '6px 0 0' }}>
                    {detail}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                  Consumo por programa
                </h2>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
                  Quanto cada programa recebeu de aporte, alocou, consumiu e ainda possui disponível.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {programasPortfolio.map(programa => (
                <div key={programa.nome} style={{ padding: '16px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                    <ListCell label="Programa" value={programa.nome} strong />
                    <ListCell label="Aportado" value={formatCurrency(programa.aportado)} strong />
                    <ListCell label="Alocado" value={formatCurrency(programa.alocado)} detail={`${formatPercent(programa.percentualAlocado)} do total`} strong />
                    <ListCell label="Consumido" value={formatCurrency(programa.consumido)} detail={`${formatPercent(programa.percentualConsumido)} do programa`} strong />
                    <ListCell label="Disponível" value={formatCurrency(programa.saldo)} detail={`${formatPercent(programa.percentualDisponivel)} do programa`} strong />
                  </div>
                  <div style={{ height: '4px', width: '100%', borderRadius: '999px', backgroundColor: T.bgChip, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(programa.percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: programa.percentualConsumido < 50 ? '#f59e0b' : T.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
              Consumo por rubrica
            </h2>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 20px' }}>
              Somatória por rubrica em todos os programas aportados pelas parcerias.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rubricasPortfolio.map(rubrica => (
                <div key={rubrica.nome} style={{ padding: '16px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                    <ListCell label="Rubrica" value={rubrica.nome} strong />
                    <ListCell label="Aportado" value={formatCurrency(rubrica.aportado)} strong />
                    <ListCell label="Alocado" value={formatCurrency(rubrica.alocado)} detail={`${formatPercent(rubrica.percentualAlocado)} do total`} strong />
                    <ListCell label="Consumido" value={formatCurrency(rubrica.consumido)} detail={`${formatPercent(rubrica.percentualConsumido)} da rubrica`} strong />
                    <ListCell label="Disponível" value={formatCurrency(rubrica.saldo)} detail={`${formatPercent(rubrica.percentualDisponivel)} da rubrica`} strong />
                  </div>
                  <div style={{ height: '4px', width: '100%', borderRadius: '999px', backgroundColor: T.bgChip, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(rubrica.percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: rubrica.percentualConsumido < 50 ? '#f59e0b' : T.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        )}

        {activeTab === 'listagem' && (
        <>
        <div className="mb-6">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="search-input" style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, marginBottom: '8px' }}>
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
                    backgroundColor: T.bgInput,
                    border: `1px solid ${T.borderDefault}`,
                    borderRadius: 'var(--radius)',
                    padding: '10px 38px 10px 14px',
                    color: T.textPrimary,
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Search size={15} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued, pointerEvents: 'none' }} />
              </div>
            </div>

            <DropdownFilter
              label="Data de Fim"
              value={dataFimSort}
              options={dataFimOptions}
              open={showDataFimDropdown}
              setOpen={setShowDataFimDropdown}
              onSelect={(value) => setDataFimSort(value as DataFimSort)}
              onBeforeOpen={() => {
                setShowInstituicaoDropdown(false);
                setShowStatusDropdown(false);
              }}
            />

            <DropdownFilter
              label="Instituição"
              value={instituicaoFilter}
              options={instituicaoOptions}
              open={showInstituicaoDropdown}
              setOpen={setShowInstituicaoDropdown}
              onSelect={setInstituicaoFilter}
              onBeforeOpen={() => {
                setShowDataFimDropdown(false);
                setShowStatusDropdown(false);
              }}
            />

            <DropdownFilter
              label="Status"
              value={statusFilter}
              displayValue={statusFilter === 'Todos' ? 'Todos' : statusLabel[statusFilter]}
              options={statusOptions}
              optionLabel={(opt) => statusLabel[opt as StatusFilter]}
              open={showStatusDropdown}
              setOpen={setShowStatusDropdown}
              onSelect={(value) => setStatusFilter(value as StatusFilter)}
              onBeforeOpen={() => {
                setShowDataFimDropdown(false);
                setShowInstituicaoDropdown(false);
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((parceria) => (
            <button
              key={parceria.id}
              onClick={() => setSelectedParceria(parceria)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.1fr 0.9fr 1fr 0.9fr 40px',
                gap: '16px',
                alignItems: 'center',
                width: '100%',
                padding: '20px 24px',
                backgroundColor: T.bgCard,
                border: `1px solid ${T.borderSubtle}`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <ListCell label="Parceria" value={parceria.nome} strong />
              <ListCell label="Instituição" value={parceria.instituicaoParceira} />
              <ListCell label="Vigência" value={`${parceria.vigenciaInicio} - ${parceria.vigenciaFim}`} />
              <div style={{ paddingLeft: '1.25rem' }}>
                <ListCell label="Aporte total" value={formatCurrency(parceria.aporteTotal)} />
              </div>
              <div style={{ paddingLeft: '0.75rem' }}>
                <ListCell label="Saldo com Programas" value={formatCurrency(parceria.saldoAlocavelEmProgramas)} />
              </div>
              <div style={{ paddingLeft: '2.25rem' }}>
                <CellLabel label="Status" />
                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: `${statusColor(parceria.status)}20`, border: `1px solid ${statusColor(parceria.status)}`, color: statusColor(parceria.status) }}>
                  {statusLabel[parceria.status]}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ChevronRight size={18} style={{ color: T.iconSubdued }} />
              </div>
            </button>
          ))}
        </div>
        </>
        )}
      </div>
    </div>
  );
};

const CellLabel: React.FC<{ label: string }> = ({ label }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>{label}</div>
  );
};

const ListCell: React.FC<{ label: string; value: string; detail?: string; strong?: boolean; highlight?: boolean }> = ({ label, value, detail, strong, highlight }) => {
  const { T } = useThemeTokens();
  return (
    <div>
      <CellLabel label={label} />
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: highlight ? '#22c55e' : strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}>
        {value}
      </div>
      {detail && (
        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginTop: '4px' }}>
          {detail}
        </div>
      )}
    </div>
  );
};

const DropdownFilter: React.FC<{
  label: string;
  value: string;
  displayValue?: string;
  options: string[];
  optionLabel?: (value: any) => string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (value: string) => void;
  onBeforeOpen?: () => void;
}> = ({ label, value, displayValue, options, optionLabel, open, setOpen, onSelect, onBeforeOpen }) => {
  const { T, isLight } = useThemeTokens();
  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, marginBottom: '8px' }}>
        {label}
      </label>
      <button
        onClick={() => {
          onBeforeOpen?.();
          setOpen(!open);
        }}
        style={{
          width: '100%',
          backgroundColor: T.bgInput,
          border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          color: T.textPrimary,
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <span>{displayValue || value}</span>
        <ChevronDown size={15} style={{ color: T.iconSubdued }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: 'var(--radius)', zIndex: 400, overflow: 'hidden', boxShadow: T.shadowMd }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: value === opt ? T.accentSoft : 'transparent',
                color: value === opt ? T.accent : T.textPrimary,
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {optionLabel ? optionLabel(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
