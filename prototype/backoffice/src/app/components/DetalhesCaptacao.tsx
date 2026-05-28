import React, { useState } from 'react';
import { toast } from 'sonner';
import { ChevronRight, ArrowLeft, ChevronDown, X, Save, FileText, CheckCircle, ClipboardCheck, ListChecks, RotateCcw, Trophy, ShieldCheck } from 'lucide-react';
import { FormularioEdital } from './FormularioEdital';

interface CaptacaoDetalhe {
  titulo: string;
  tipo: string;
  vinculoTipo: string;
  vinculoNome: string;
  propostasRecebidas: number;
  dataPublicacao: string;
  area: string;
  status: 'Rascunho' | 'Ativo' | 'Finalizado';
}

interface Props {
  onBack: () => void;
  captacao?: CaptacaoDetalhe;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '24px',
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '20px',
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

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: '#00c1af',
  margin: '0 0 20px',
};

const NumberedSectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>{number}</span>
    </div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: 0 }}>
      {title}
    </p>
  </div>
);

const subSectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'rgba(255,255,255,0.9)',
  margin: '0 0 16px',
};

const dividerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  margin: '16px 0',
};

// Dados fictícios de avaliadores
const avaliadores = [
  { id: 1, nome: 'Carlos Alberto Silva', cpf: '123.456.789-00' },
  { id: 2, nome: 'Maria Fernanda Santos', cpf: '234.567.890-11' },
  { id: 3, nome: 'João Pedro Oliveira', cpf: '345.678.901-22' },
  { id: 4, nome: 'Ana Paula Costa', cpf: '456.789.012-33' },
  { id: 5, nome: 'Roberto Carlos Lima', cpf: '567.890.123-44' },
  { id: 6, nome: 'Patricia Souza Alves', cpf: '678.901.234-55' },
  { id: 7, nome: 'Fernando José Pereira', cpf: '789.012.345-66' },
  { id: 8, nome: 'Juliana Menezes Rocha', cpf: '890.123.456-77' },
];

const fasesIniciativas = [
  { fase: 'Submetida', quantidade: 42, cor: '#38bdf8' },
  { fase: 'Habilitação', quantidade: 31, cor: '#fbbf24' },
  { fase: 'Avaliação Ad Hoc', quantidade: 24, cor: '#a78bfa' },
  { fase: 'Resultado Preliminar', quantidade: 18, cor: '#fb7185' },
  { fase: 'Recurso', quantidade: 6, cor: '#f97316' },
  { fase: 'Aprovados', quantidade: 12, cor: '#22c55e' },
  { fase: 'Reprovados', quantidade: 8, cor: '#ef4444' },
];

const iniciativasEnviadas = [
  { codigo: 'INI-2026-001', titulo: 'Plataforma inteligente de monitoramento hídrico', proponente: 'Instituto Federal do Espírito Santo', ortogado: 'Mariana Lopes', fase: 'Avaliação Ad Hoc', data: '12/02/2026', categoria: 'Inovação', faixa: 'Faixa 2', valorSolicitado: 'R$ 420.000,00', valorNumerico: 420000, resumo: 'Solução para monitorar bacias hidrográficas com sensores conectados e painéis de alerta.', rubricas: [{ nome: 'Bolsas', valor: 140000, cor: '#38bdf8' }, { nome: 'Capital', valor: 180000, cor: '#a78bfa' }, { nome: 'Custeio', valor: 100000, cor: '#22c55e' }] },
  { codigo: 'INI-2026-002', titulo: 'Bioinsumos para agricultura de precisão', proponente: 'Universidade Federal do Espírito Santo', ortogado: 'André Carvalho', fase: 'Habilitação', data: '14/02/2026', categoria: 'Pesquisa', faixa: 'Faixa 1', valorSolicitado: 'R$ 180.000,00', valorNumerico: 180000, resumo: 'Pesquisa aplicada para validação de bioinsumos em cadeias produtivas regionais.', rubricas: [{ nome: 'Bolsas', valor: 90000, cor: '#38bdf8' }, { nome: 'Custeio', valor: 70000, cor: '#22c55e' }, { nome: 'Diárias e passagens', valor: 20000, cor: '#fb7185' }] },
  { codigo: 'INI-2026-003', titulo: 'Sistema de rastreabilidade para cadeias produtivas', proponente: 'Findes Lab', ortogado: 'Patrícia Almeida', fase: 'Resultado Preliminar', data: '20/02/2026', categoria: 'Inovação', faixa: 'Faixa 2', valorSolicitado: 'R$ 390.000,00', valorNumerico: 390000, resumo: 'Plataforma para rastrear origem, qualidade e movimentação de produtos industriais.', rubricas: [{ nome: 'Capital', valor: 170000, cor: '#a78bfa' }, { nome: 'Serviços de terceiros', valor: 150000, cor: '#fbbf24' }, { nome: 'Custeio', valor: 70000, cor: '#22c55e' }] },
  { codigo: 'INI-2026-004', titulo: 'Tecnologia assistiva para educação inclusiva', proponente: 'Instituto Capixaba de Tecnologia', ortogado: 'Lucas Rocha', fase: 'Recurso', data: '22/02/2026', categoria: 'Extensão', faixa: 'Faixa 1', valorSolicitado: 'R$ 150.000,00', valorNumerico: 150000, resumo: 'Ferramentas digitais e dispositivos de apoio para estudantes com deficiência.', rubricas: [{ nome: 'Bolsas', valor: 60000, cor: '#38bdf8' }, { nome: 'Capital', valor: 50000, cor: '#a78bfa' }, { nome: 'Custeio', valor: 40000, cor: '#22c55e' }] },
  { codigo: 'INI-2026-005', titulo: 'Observatório de inovação em saúde pública', proponente: 'Hospital Universitário Cassiano Antônio Moraes', ortogado: 'Fernanda Costa', fase: 'Resultado Final', data: '25/02/2026', categoria: 'Pesquisa', faixa: 'Faixa 2', valorSolicitado: 'R$ 480.000,00', valorNumerico: 480000, resumo: 'Observatório para consolidar indicadores, evidências e projetos de inovação em saúde.', rubricas: [{ nome: 'Bolsas', valor: 180000, cor: '#38bdf8' }, { nome: 'Capital', valor: 160000, cor: '#a78bfa' }, { nome: 'Serviços de terceiros', valor: 90000, cor: '#fbbf24' }, { nome: 'Custeio', valor: 50000, cor: '#22c55e' }] },
  { codigo: 'INI-2026-006', titulo: 'Rede de sensores para cidades resilientes', proponente: 'Prefeitura Municipal de Vitória', ortogado: 'Ricardo Torres', fase: 'Submetida', data: '28/02/2026', categoria: 'Inovação', faixa: 'Faixa 1', valorSolicitado: 'R$ 210.000,00', valorNumerico: 210000, resumo: 'Rede de sensores urbanos para apoiar resposta rápida a eventos climáticos.', rubricas: [{ nome: 'Capital', valor: 130000, cor: '#a78bfa' }, { nome: 'Custeio', valor: 50000, cor: '#22c55e' }, { nome: 'Diárias e passagens', valor: 30000, cor: '#fb7185' }] },
  { codigo: 'INI-2026-007', titulo: 'Modelos preditivos para gestão costeira', proponente: 'Universidade Vila Velha', ortogado: 'Beatriz Nascimento', fase: 'Avaliação Ad Hoc', data: '01/03/2026', categoria: 'Pesquisa', faixa: 'Faixa 2', valorSolicitado: 'R$ 360.000,00', valorNumerico: 360000, resumo: 'Modelos analíticos para apoiar decisões sobre erosão costeira e ocupação urbana.', rubricas: [{ nome: 'Bolsas', valor: 120000, cor: '#38bdf8' }, { nome: 'Capital', valor: 140000, cor: '#a78bfa' }, { nome: 'Custeio', valor: 100000, cor: '#22c55e' }] },
  { codigo: 'INI-2026-008', titulo: 'Automação para laboratórios de biotecnologia', proponente: 'SENAI Cimatec ES', ortogado: 'Gustavo Almeida', fase: 'Resultado Preliminar', data: '03/03/2026', categoria: 'Inovação', faixa: 'Faixa 2', valorSolicitado: 'R$ 440.000,00', valorNumerico: 440000, resumo: 'Automação de processos laboratoriais para ampliar capacidade de pesquisa aplicada.', rubricas: [{ nome: 'Capital', valor: 210000, cor: '#a78bfa' }, { nome: 'Serviços de terceiros', valor: 150000, cor: '#fbbf24' }, { nome: 'Custeio', valor: 80000, cor: '#22c55e' }] },
  { codigo: 'INI-2026-009', titulo: 'Plataforma de educação científica aberta', proponente: 'Fundação de Apoio à Educação Científica', ortogado: 'Camila Ribeiro', fase: 'Recurso', data: '05/03/2026', categoria: 'Extensão', faixa: 'Faixa 1', valorSolicitado: 'R$ 160.000,00', valorNumerico: 160000, resumo: 'Ambiente digital para divulgação científica e formação de professores da rede pública.', rubricas: [{ nome: 'Bolsas', valor: 70000, cor: '#38bdf8' }, { nome: 'Custeio', valor: 60000, cor: '#22c55e' }, { nome: 'Serviços de terceiros', valor: 30000, cor: '#fbbf24' }] },
  { codigo: 'INI-2026-010', titulo: 'Energia renovável em comunidades isoladas', proponente: 'Instituto de Energia do Espírito Santo', ortogado: 'Thiago Monteiro', fase: 'Resultado Final', data: '07/03/2026', categoria: 'Inovação', faixa: 'Faixa 2', valorSolicitado: 'R$ 510.000,00', valorNumerico: 510000, resumo: 'Implantação piloto de soluções renováveis para comunidades de difícil acesso.', rubricas: [{ nome: 'Capital', valor: 260000, cor: '#a78bfa' }, { nome: 'Custeio', valor: 150000, cor: '#22c55e' }, { nome: 'Bolsas', valor: 100000, cor: '#38bdf8' }] },
];

const avaliacoesAdHoc = [
  { iniciativaCodigo: 'INI-2026-001', revisor: 'Helena Martins', area: 'Pesquisa em Saúde', status: 'Concluída', nota: '88', parecer: 'Proposta consistente, com boa clareza metodológica e impacto regional relevante.' },
  { iniciativaCodigo: 'INI-2026-001', revisor: 'Rafael Nogueira', area: 'Inovação Tecnológica', status: 'Em avaliação', nota: '-', parecer: 'Avaliação técnica em andamento.' },
  { iniciativaCodigo: 'INI-2026-003', revisor: 'Livia Barbosa', area: 'Educação e Extensão', status: 'Concluída', nota: '81', parecer: 'Boa aderência ao edital, com necessidade de detalhar indicadores de adoção.' },
  { iniciativaCodigo: 'INI-2026-004', revisor: 'Marcos Teixeira', area: 'Ciências Agrárias', status: 'Solicitada revisão', nota: '74', parecer: 'Revisão solicitada para esclarecer plano de execução e orçamento.' },
  { iniciativaCodigo: 'INI-2026-005', revisor: 'Helena Martins', area: 'Pesquisa em Saúde', status: 'Concluída', nota: '92', parecer: 'Excelente alinhamento com a política pública e boa capacidade de execução.' },
  { iniciativaCodigo: 'INI-2026-006', revisor: 'Rafael Nogueira', area: 'Inovação Tecnológica', status: 'Em avaliação', nota: '-', parecer: 'Análise de viabilidade técnica em andamento.' },
  { iniciativaCodigo: 'INI-2026-007', revisor: 'Livia Barbosa', area: 'Educação e Extensão', status: 'Concluída', nota: '86', parecer: 'Boa estrutura metodológica e impacto territorial mensurável.' },
  { iniciativaCodigo: 'INI-2026-008', revisor: 'Marcos Teixeira', area: 'Ciências Agrárias', status: 'Concluída', nota: '89', parecer: 'Proposta robusta, com orçamento coerente e cronograma factível.' },
  { iniciativaCodigo: 'INI-2026-009', revisor: 'Helena Martins', area: 'Pesquisa em Saúde', status: 'Solicitada revisão', nota: '76', parecer: 'Necessário detalhar indicadores de disseminação e governança.' },
  { iniciativaCodigo: 'INI-2026-010', revisor: 'Rafael Nogueira', area: 'Inovação Tecnológica', status: 'Concluída', nota: '91', parecer: 'Excelente aderência ao edital e potencial de replicabilidade.' },
];

const revisoresAdHocDashboard = [
  { nome: 'Helena Martins', area: 'Pesquisa em Saúde', titulacao: 'Doutorado', instituicao: 'UFES', status: 'Ativa' },
  { nome: 'Rafael Nogueira', area: 'Inovação Tecnológica', titulacao: 'Doutorado', instituicao: 'IFES', status: 'Ativo' },
  { nome: 'Livia Barbosa', area: 'Educação e Extensão', titulacao: 'Doutorado', instituicao: 'UFES', status: 'Ativa' },
  { nome: 'Marcos Teixeira', area: 'Ciências Agrárias', titulacao: 'Mestrado', instituicao: 'Incaper', status: 'Ativo' },
];

const avaliadoresAdHoc = [
  { nome: 'Ana Beatriz Couto', area: 'Saúde', especializacao: 'Doutorado' },
  { nome: 'Bruno Henrique Matos', area: 'Tecnologia', especializacao: 'Mestrado' },
  { nome: 'Carolina Duarte Nunes', area: 'Meio Ambiente', especializacao: 'Pós-Graduação' },
  { nome: 'Diego Ferreira Lima', area: 'Tecnologia', especializacao: 'Doutorado' },
  { nome: 'Elisa Campos Rocha', area: 'Saúde', especializacao: 'Mestrado' },
  { nome: 'Felipe Augusto Reis', area: 'Meio Ambiente', especializacao: 'Doutorado' },
];

const financeiroCaptacaoDetalhe = {
  totalSolicitado: iniciativasEnviadas.reduce((total, iniciativa) => total + iniciativa.valorNumerico, 0),
  totalDisponivel: 5000000,
  rubricas: [
    { nome: 'Bolsa', valor: 620000, quantidade: 4, cor: '#38bdf8' },
    { nome: 'Material de Consumo', valor: 510000, quantidade: 3, cor: '#a78bfa' },
    { nome: 'Material Permanente', valor: 430000, quantidade: 5, cor: '#22c55e' },
    { nome: 'Passagem', valor: 190000, quantidade: 2, cor: '#fbbf24' },
    { nome: 'Diária', valor: 80000, quantidade: 1, cor: '#fb7185' },
    { nome: 'Pessoa Jurídica', valor: 260000, quantidade: 3, cor: '#00c1af' },
    { nome: 'Pessoa Física', valor: 150000, quantidade: 2, cor: '#60a5fa' },
  ],
};

const financeiroPorFaixaCaptacao = Array.from(new Set(iniciativasEnviadas.map(iniciativa => iniciativa.faixa))).map(faixa => {
  const iniciativasDaFaixa = iniciativasEnviadas.filter(iniciativa => iniciativa.faixa === faixa);
  const rubricas = iniciativasDaFaixa.reduce<Array<{ nome: string; valor: number; quantidade: number; cor: string }>>((totais, iniciativa) => {
    iniciativa.rubricas.forEach(rubrica => {
      const totalExistente = totais.find(item => item.nome === rubrica.nome);

      if (totalExistente) {
        totalExistente.valor += rubrica.valor;
        totalExistente.quantidade += 1;
      } else {
        totais.push({ nome: rubrica.nome, valor: rubrica.valor, quantidade: 1, cor: rubrica.cor });
      }
    });

    return totais;
  }, []);

  return {
    faixa,
    quantidadeIniciativas: iniciativasDaFaixa.length,
    valorTotal: iniciativasDaFaixa.reduce((total, iniciativa) => total + iniciativa.valorNumerico, 0),
    rubricas,
  };
});

export const DetalhesCaptacao: React.FC<Props> = ({ onBack, captacao }) => {
  const [activeTab, setActiveTab] = useState<'informacoes' | 'dashboard' | 'proposta' | 'avaliacao' | 'avaliacaoAdHoc' | 'recurso' | 'recursoParcial' | 'resultadoFinal'>('informacoes');
  const [editingResumo, setEditingResumo] = useState(false);
  const [showFormularioEdicao, setShowFormularioEdicao] = useState(false);
  const [iniciativaSelecionadaCodigo, setIniciativaSelecionadaCodigo] = useState(iniciativasEnviadas[0].codigo);
  const [propostaOrdenacao, setPropostaOrdenacao] = useState<'data-recente' | 'data-antiga' | 'valor-maior' | 'valor-menor'>('data-recente');
  const [showModal, setShowModal] = useState(false);
  const [avaliador1, setAvaliador1] = useState('');
  const [avaliador2, setAvaliador2] = useState('');
  const [avaliador3, setAvaliador3] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [fasePropostaFiltro, setFasePropostaFiltro] = useState('Todos');
  const [showOrdenacaoDropdown, setShowOrdenacaoDropdown] = useState(false);
  const [showFaseDropdown, setShowFaseDropdown] = useState(false);
  const [showAvaliadorModal, setShowAvaliadorModal] = useState(false);
  const [avaliadorBusca, setAvaliadorBusca] = useState('');
  const [avaliadorSelecionado, setAvaliadorSelecionado] = useState<typeof avaliadoresAdHoc[number] | null>(null);
  const [propostaAvaliadorSelecionada, setPropostaAvaliadorSelecionada] = useState('');
  const [habilitacaoSelecionada, setHabilitacaoSelecionada] = useState<typeof iniciativasEnviadas[number] | null>(null);
  const [resultadoHabilitacao, setResultadoHabilitacao] = useState<'Habilitada' | 'Não Habilitada' | ''>('');
  const [statusHabilitacaoFiltro, setStatusHabilitacaoFiltro] = useState('Habilitado');
  const [showStatusHabilitacaoDropdown, setShowStatusHabilitacaoDropdown] = useState(false);
  const [statusAvaliacaoAdHocFiltro, setStatusAvaliacaoAdHocFiltro] = useState('Aguardando Avaliador');
  const [showStatusAvaliacaoAdHocDropdown, setShowStatusAvaliacaoAdHocDropdown] = useState(false);
  const resumoInputStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: editingResumo ? 'rgba(23, 23, 23,0.95)' : inputStyle.backgroundColor,
    border: editingResumo ? '1px solid rgba(0,193,175,0.42)' : inputStyle.border,
  };
  const iniciativaSelecionada = iniciativasEnviadas.find(item => item.codigo === iniciativaSelecionadaCodigo) || iniciativasEnviadas[0];
  const maiorValorRubricaDetalhe = Math.max(...financeiroCaptacaoDetalhe.rubricas.map(item => item.valor), 1);
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const captacaoAtual = captacao || {
    titulo: 'Bolsas de Pesquisa 2026',
    tipo: 'Chamada Pública',
    vinculoTipo: 'Programa',
    vinculoNome: 'Programa de Bolsas de Pesquisa 2026',
    propostasRecebidas: 42,
    dataPublicacao: '01/03/2026',
    area: 'Pesquisa',
    status: 'Ativo' as const,
  };
  const podeEditar = captacaoAtual.status === 'Rascunho' || captacaoAtual.status === 'Finalizado';
  const detalheLinhaStyle: React.CSSProperties = {
    display: 'grid',
    gap: '20px',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  };
  const detalheRotuloStyle: React.CSSProperties = {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-xs)',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '4px',
  };
  const detalheValorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: '#ffffff',
    lineHeight: 1.4,
  };
  const parseDataEnvio = (data: string) => {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia).getTime();
  };
  const fasePropostaLabel = (fase: string) => fase === 'Submetida' ? 'Enviada' : fase === 'Resultado Preliminar' ? 'Resultado Parcial' : fase;
  const propostasOrdenadas = [...iniciativasEnviadas].sort((a, b) => {
    if (propostaOrdenacao === 'data-antiga') return parseDataEnvio(a.data) - parseDataEnvio(b.data);
    if (propostaOrdenacao === 'valor-maior') return b.valorNumerico - a.valorNumerico;
    if (propostaOrdenacao === 'valor-menor') return a.valorNumerico - b.valorNumerico;
    return parseDataEnvio(b.data) - parseDataEnvio(a.data);
  });
  const propostasExibidas = propostasOrdenadas.filter(iniciativa =>
    fasePropostaFiltro === 'Todos' || fasePropostaLabel(iniciativa.fase) === fasePropostaFiltro
  );
  const ordenacaoOptions: Array<{ value: typeof propostaOrdenacao; label: string }> = [
    { value: 'data-recente', label: 'Data de envio: mais recente' },
    { value: 'data-antiga', label: 'Data de envio: mais antiga' },
    { value: 'valor-maior', label: 'Valor: maior' },
    { value: 'valor-menor', label: 'Valor: menor' },
  ];
  const fasePropostaOptions = ['Todos', 'Enviada', 'Habilitação', 'Avaliação Ad Hoc', 'Resultado Parcial', 'Recurso', 'Resultado Final'];
  const avaliadoresFiltrados = avaliadoresAdHoc.filter((avaliador) =>
    `${avaliador.nome} ${avaliador.area} ${avaliador.especializacao}`.toLowerCase().includes(avaliadorBusca.toLowerCase())
  );
  const propostasPorInstituicao = [
    { instituicao: 'Ifes', quantidade: 18 },
    { instituicao: 'Ufes', quantidade: 14 },
    { instituicao: 'UVV', quantidade: 9 },
    { instituicao: 'Senai', quantidade: 7 },
    { instituicao: 'Findes', quantidade: 11 },
  ];
  const maiorQuantidadeInstituicao = Math.max(...propostasPorInstituicao.map(item => item.quantidade), 1);
  const tiposBolsasSolicitadas = [
    { tipo: 'Iniciação Científica', quantidade: 24 },
    { tipo: 'Mestrado', quantidade: 18 },
    { tipo: 'Doutorado', quantidade: 12 },
    { tipo: 'BPIG - IV', quantidade: 9 },
  ];
  const maiorQuantidadeBolsa = Math.max(...tiposBolsasSolicitadas.map(item => item.quantidade), 1);
  const propostasPorLocalizacao = [
    { localizacao: 'Vitória', quantidade: 16 },
    { localizacao: 'Vila Velha', quantidade: 13 },
    { localizacao: 'Serra', quantidade: 11 },
    { localizacao: 'Cariacica', quantidade: 8 },
    { localizacao: 'Guarapari', quantidade: 6 },
    { localizacao: 'Viana', quantidade: 5 },
    { localizacao: 'Colatina', quantidade: 4 },
  ];
  const maiorQuantidadeLocalizacao = Math.max(...propostasPorLocalizacao.map(item => item.quantidade), 1);
  const filtroCampoStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    height: '40px',
  };
  const renderCustomDropdown = <T extends string,>({
    label,
    value,
    options,
    open,
    setOpen,
    onSelect,
  }: {
    label: string;
    value: T;
    options: Array<{ value: T; label: string }>;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSelect: (value: T) => void;
  }) => {
    const selectedLabel = options.find(option => option.value === value)?.label || value;

    return (
      <div style={{ position: 'relative' }}>
        <label style={labelStyle}>{label}</label>
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            if (label === 'Ordenar por') setShowFaseDropdown(false);
            if (label === 'Fase') setShowOrdenacaoDropdown(false);
          }}
          style={{
            ...filtroCampoStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedLabel}</span>
          <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.55)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 40,
            overflow: 'hidden',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(255,255,255,0.12)',
            backgroundColor: '#262626',
            boxShadow: '0 18px 38px rgba(0,0,0,0.38)',
          }}>
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = option.value === value ? 'rgba(0,193,175,0.12)' : 'transparent'; }}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: 'none',
                  backgroundColor: option.value === value ? 'rgba(0,193,175,0.12)' : 'transparent',
                  color: option.value === value ? '#00c1af' : '#ffffff',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  const renderListFilters = (statusOptions: string[], includeDate = false) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: includeDate ? '1.3fr 180px 220px' : '1fr 220px',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end',
    }}>
      <div>
        <label style={labelStyle}>Busca</label>
        <input type="text" placeholder="Buscar" style={filtroCampoStyle} />
      </div>
      {includeDate && (
        <div>
          <label style={labelStyle}>Data</label>
          <input type="text" placeholder="dd/mm/aaaa" style={filtroCampoStyle} />
        </div>
      )}
      <div>
        <label style={labelStyle}>Status</label>
        <select defaultValue="Todos" style={{ ...filtroCampoStyle, appearance: 'none', cursor: 'pointer' }}>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );

  if (showFormularioEdicao && podeEditar) {
    return <FormularioEdital mode="edit" onBack={() => setShowFormularioEdicao(false)} />;
  }

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        // Fecha os dropdowns se clicar fora deles
        if (e.target === e.currentTarget) {
          setShowDropdown1(false);
          setShowDropdown2(false);
          setShowDropdown3(false);
        }
      }}
      >
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => {
          // Impede a propagação para não fechar ao clicar dentro do modal
          e.stopPropagation();
        }}
        >
          {/* Header do Modal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#ffffff',
                margin: '0 0 8px',
              }}>
                Selecione os avaliadores
              </h2>
              <p style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}>
                Informe quem irá avaliar essa Captação.
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Campos de Avaliadores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Avaliador 1 */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="avaliador1" style={labelStyle}>Avaliador 1</label>
              <input
                id="avaliador1"
                type="text"
                placeholder="Digite ou selecione um avaliador"
                value={avaliador1}
                onChange={(e) => setAvaliador1(e.target.value)}
                onFocus={() => setShowDropdown1(true)}
                style={inputStyle}
              />
              {showDropdown1 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(38, 38, 38, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  marginTop: '4px',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {avaliadores
                    .filter(a => a.nome.toLowerCase().includes(avaliador1.toLowerCase()) || a.cpf.includes(avaliador1))
                    .map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setAvaliador1(`${av.nome} - ${av.cpf}`);
                          setShowDropdown1(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>{av.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{av.cpf}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Avaliador 2 */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="avaliador2" style={labelStyle}>Avaliador 2</label>
              <input
                id="avaliador2"
                type="text"
                placeholder="Digite ou selecione um avaliador"
                value={avaliador2}
                onChange={(e) => setAvaliador2(e.target.value)}
                onFocus={() => setShowDropdown2(true)}
                style={inputStyle}
              />
              {showDropdown2 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(38, 38, 38, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  marginTop: '4px',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {avaliadores
                    .filter(a => a.nome.toLowerCase().includes(avaliador2.toLowerCase()) || a.cpf.includes(avaliador2))
                    .map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setAvaliador2(`${av.nome} - ${av.cpf}`);
                          setShowDropdown2(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>{av.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{av.cpf}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Avaliador 3 */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="avaliador3" style={labelStyle}>Avaliador 3</label>
              <input
                id="avaliador3"
                type="text"
                placeholder="Digite ou selecione um avaliador"
                value={avaliador3}
                onChange={(e) => setAvaliador3(e.target.value)}
                onFocus={() => setShowDropdown3(true)}
                style={inputStyle}
              />
              {showDropdown3 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(38, 38, 38, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  marginTop: '4px',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {avaliadores
                    .filter(a => a.nome.toLowerCase().includes(avaliador3.toLowerCase()) || a.cpf.includes(avaliador3))
                    .map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setAvaliador3(`${av.nome} - ${av.cpf}`);
                          setShowDropdown3(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>{av.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{av.cpf}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Botões do Modal */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius)',
                color: '#ffffff',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                console.log({ avaliador1, avaliador2, avaliador3 });
                setShowModal(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#00c1af',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: '#1e293b',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a89a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
            >
              <Save size={16} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const abrirModalAvaliador = (avaliacao: typeof avaliacoesAdHoc[number]) => {
    const iniciativaAvaliada = iniciativasEnviadas.find(item => item.codigo === avaliacao.iniciativaCodigo);
    const avaliadorAtual = avaliadoresAdHoc.find(avaliador => avaliacao.revisor.includes(avaliador.nome.split(' ').slice(-1)[0]));

    setPropostaAvaliadorSelecionada(iniciativaAvaliada?.titulo || avaliacao.iniciativaCodigo);
    setAvaliadorBusca('');
    setAvaliadorSelecionado(avaliadorAtual || null);
    setShowAvaliadorModal(true);
  };

  const renderAvaliadorModal = () => {
    if (!showAvaliadorModal) return null;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: 'rgba(0,0,0,0.72)',
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setShowAvaliadorModal(false);
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-avaliador-title"
          style={{
            width: 'min(760px, 100%)',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.14)',
            backgroundColor: '#262626',
            boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
            padding: '28px',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h2 id="modal-avaliador-title" style={{
                margin: '0 0 8px',
                color: '#ffffff',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                Selecione o Avaliador
              </h2>
              <p style={{
                margin: 0,
                color: 'rgba(255,255,255,0.62)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
              }}>
                Escolha a pessoa que irá avaliar essa proposta.
              </p>
            </div>
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setShowAvaliadorModal(false)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.58)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label style={{ ...labelStyle, color: '#ffffff' }}>Proposta</label>
              <div style={{
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '10px 0',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
              }}>
                {propostaAvaliadorSelecionada}
              </div>
            </div>

            <div>
              <label style={{ ...labelStyle, color: '#ffffff' }}>Buscar avaliador</label>
              <input
                value={avaliadorBusca}
                onChange={(event) => setAvaliadorBusca(event.target.value)}
                placeholder="Digite o nome, área ou especialização"
                style={inputStyle}
              />
            </div>

            <div style={{
              display: 'grid',
              gap: '8px',
              maxHeight: '220px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {avaliadoresFiltrados.map(avaliador => {
                const selected = avaliadorSelecionado?.nome === avaliador.nome;

                return (
                  <button
                    key={avaliador.nome}
                    type="button"
                    onClick={() => setAvaliadorSelecionado(avaliador)}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 0.8fr 0.8fr',
                      gap: '14px',
                      alignItems: 'center',
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      border: selected ? '1px solid rgba(0,193,175,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: selected ? 'rgba(0,193,175,0.14)' : 'transparent',
                      color: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={detalheRotuloStyle}>Nome</div>
                      <div style={detalheValorStyle}>{avaliador.nome}</div>
                    </div>
                    <div>
                      <div style={detalheRotuloStyle}>Área</div>
                      <div style={detalheValorStyle}>{avaliador.area}</div>
                    </div>
                    <div>
                      <div style={detalheRotuloStyle}>Especialização</div>
                      <div style={detalheValorStyle}>{avaliador.especializacao}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {avaliadorSelecionado && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr 0.8fr',
                gap: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(0,193,175,0.28)',
                backgroundColor: 'rgba(0,193,175,0.08)',
                padding: '16px',
              }}>
                <div>
                  <div style={detalheRotuloStyle}>Nome</div>
                  <div style={detalheValorStyle}>{avaliadorSelecionado.nome}</div>
                </div>
                <div>
                  <div style={detalheRotuloStyle}>Área</div>
                  <div style={detalheValorStyle}>{avaliadorSelecionado.area}</div>
                </div>
                <div>
                  <div style={detalheRotuloStyle}>Especialização</div>
                  <div style={detalheValorStyle}>{avaliadorSelecionado.especializacao}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '26px' }}>
            <button
              type="button"
              onClick={() => setShowAvaliadorModal(false)}
              style={{
                padding: '11px 22px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(255,255,255,0.18)',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setShowAvaliadorModal(false)}
              style={{
                padding: '11px 24px',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: '#00c1af',
                color: '#171717',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
              }}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRadioOptions = (name: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
      {['Atende', 'Não Atende', 'Revisar'].map(option => (
        <label key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
          <input type="radio" name={name} value={option} style={{ accentColor: '#00c1af' }} />
          {option}
        </label>
      ))}
    </div>
  );

  const renderHabilitacaoSectionTitle = (number: string, title: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>{number}</span>
      </div>
      <h2 style={{ ...sectionTitleStyle, color: '#ffffff', margin: 0 }}>{title}</h2>
    </div>
  );

  const salvarHabilitacao = () => {
    setHabilitacaoSelecionada(null);
    toast.success('Proposta mudou de status com sucesso.', {
      duration: 10000,
      style: {
        backgroundColor: '#16a34a',
        border: '1px solid #15803d',
        color: '#ffffff',
      },
    });
  };

  const renderHabilitacaoPage = () => {
    if (!habilitacaoSelecionada) return null;

    const criteriosElegibilidade = [
      'Ser o primeiro autor responsável pela submissão do artigo',
      'Ser o único dentre os autores do artigo a submeter proposta',
      'Ter cadastro na Plataforma Lattes atualizado há menos de 6 (seis) meses do momento do envio da proposta',
      'Morar no Espírito Santo ou em municípios limítrofes',
      'Estar regularizado junto à Fapes',
    ];
    const documentosProposta = [
      'Formulário de Submissão do Projeto',
      'Formulário de Pontuação',
      'Declaração do proponente',
      'Versão Final do artigo aceito para publicação',
      'Documento oficial emitido pelo periódico, informando o valor da taxa de publicação a ser paga',
      'Comprovante de classificação do periódico no qual o artigo será publicado',
      'Aceite do coordenador do projeto de pesquisa, caso esse não seja um dos autores do artigo',
    ];

    return (
      <div style={{ backgroundColor: '#171717', minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setHabilitacaoSelecionada(null);
                onBack();
              }}
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
              Captação
            </button>
            <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <button
              type="button"
              onClick={() => setHabilitacaoSelecionada(null)}
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
              Detalhes da Captação
            </button>
            <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
              Habilitação
            </span>
            <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }}>
              {habilitacaoSelecionada.titulo}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.12)' }}>
                <ShieldCheck size={20} style={{ color: '#00c1af' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 8px', lineHeight: 1.4 }}>
                  Habilitação
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.62)', margin: 0 }}>
                  {habilitacaoSelecionada.titulo}
                </p>
              </div>
            </div>
            <button
              type="button"
              style={{
                padding: '11px 18px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(0,193,175,0.34)',
                backgroundColor: 'transparent',
                color: '#00c1af',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Abrir Proposta
            </button>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '24px' }} />

          <div style={{ display: 'grid', gap: '24px' }}>
            <section style={cardStyle}>
              {renderHabilitacaoSectionTitle('1', 'Critérios de Elegibilidade')}
              <div style={{ display: 'grid', gap: '16px' }}>
                {criteriosElegibilidade.map((pergunta, index) => (
                  <div key={pergunta} style={{ display: 'grid', gap: '12px', padding: '14px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '18px', alignItems: 'center' }}>
                      <p style={{ margin: 0, color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                        {`1.${index + 1} - ${pergunta}`}
                      </p>
                      {renderRadioOptions(`criterio-${index}`)}
                    </div>
                    <div>
                      <label style={labelStyle}>Observação</label>
                      <input type="text" placeholder="Digite uma observação" style={inputStyle} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle}>
              {renderHabilitacaoSectionTitle('2', 'Documentos para envio da proposta')}
              <div style={{ display: 'grid', gap: '16px' }}>
                {documentosProposta.map((documento, index) => (
                  <div key={documento} style={{ display: 'grid', gap: '12px', padding: '14px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '18px', alignItems: 'center' }}>
                      <p style={{ margin: 0, color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                        {`2.${index + 1} - ${documento}`}
                      </p>
                      {renderRadioOptions(`documento-${index}`)}
                    </div>
                    <div>
                      <label style={labelStyle}>Observação</label>
                      <input type="text" placeholder="Digite uma observação" style={inputStyle} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle}>
              <h2 style={{ ...sectionTitleStyle, color: '#ffffff', marginBottom: '18px' }}>Resultado da Habilitação</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {(['Habilitada', 'Não Habilitada'] as const).map(option => (
                  <label key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="resultado-habilitacao"
                      value={option}
                      checked={resultadoHabilitacao === option}
                      onChange={() => setResultadoHabilitacao(option)}
                      style={{ accentColor: '#00c1af' }}
                    />
                    {option}
                  </label>
                ))}
              </div>

              {resultadoHabilitacao === 'Não Habilitada' && (
                <div style={{ marginTop: '18px' }}>
                  <label style={labelStyle}>Por não cumprimento dos itens:</label>
                  <input type="text" placeholder="Informe os itens não cumpridos" style={inputStyle} />
                </div>
              )}
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={salvarHabilitacao}
                style={{
                  padding: '11px 20px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                }}
              >
                Salvar Rascunho
              </button>
              <button
                type="button"
                onClick={salvarHabilitacao}
                style={{
                  padding: '11px 24px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  backgroundColor: '#00c1af',
                  color: '#171717',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (habilitacaoSelecionada) {
    return renderHabilitacaoPage();
  }

  return (
    <div style={{ backgroundColor: '#171717', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
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
            Captação
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--text-sm)',
            color: '#00c1af',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Detalhes da Captação
          </span>
        </div>

        {/* Header com botão Voltar */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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
                {captacaoAtual.titulo}
              </h1>
              <p style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.55)',
                margin: 0,
              }}>
                Verifique as informações dessa Captação.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
          {[
            { id: 'informacoes', label: 'Informações Gerais' },
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'proposta', label: 'Proposta' },
            { id: 'avaliacao', label: 'Habilitação' },
            { id: 'avaliacaoAdHoc', label: 'Avaliação Ad Hoc' },
            { id: 'recursoParcial', label: 'Resultado Parcial' },
            { id: 'recurso', label: 'Recurso' },
            { id: 'resultadoFinal', label: 'Resultado Final' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #00c1af' : '2px solid transparent',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: activeTab === tab.id ? '#00c1af' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'informacoes' && (
          <>
        {podeEditar && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setShowFormularioEdicao(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.3)',
                borderRadius: 'var(--radius)',
                color: '#00c1af',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
              }}
            >
              Editar captação
            </button>
          </div>
        )}

        {/* SESSÃO 1 — Identificação da Captação */}
        <div style={cardStyle}>
          <NumberedSectionTitle number="1" title="Identificação da Captação" />
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1.6fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Código da Captação</label>
                <input type="text" defaultValue="" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Título da Captação</label>
                <input type="text" defaultValue={captacaoAtual.titulo} readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tipo de Captação</label>
                <input type="text" defaultValue={captacaoAtual.tipo} readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Link do Edital</label>
              <input type="text" defaultValue="https://fapes.es.gov.br/editais/inovacao-tecnologica-2026" readOnly={!editingResumo} style={resumoInputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Descrição da Captação</label>
              <textarea
                defaultValue="Edital voltado para fomentar projetos de inovação tecnológica no Estado do Espírito Santo, com foco em soluções que promovam o desenvolvimento econômico e social sustentável."
                readOnly={!editingResumo}
                rows={3}
                style={{
                  ...resumoInputStyle,
                  resize: 'vertical',
                  lineHeight: '1.6',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Área Técnica Responsável</label>
                <input type="text" defaultValue="GEINOV" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Categorias de Projetos</label>
                <input type="text" defaultValue="Inovação, Pesquisa" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tipos de Projetos Aceitos</label>
                <input type="text" defaultValue="Projeto de inovação, Projeto de pesquisa" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Status da Configuração</label>
                <input type="text" defaultValue={captacaoAtual.status} readOnly={!editingResumo} style={{ ...resumoInputStyle, color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }} />
              </div>
            </div>

            <div style={dividerStyle} />

            <div>
              <h3 style={subSectionTitleStyle}>Aportes Financeiros da Captação</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { origem: 'Programa de Inovação Tecnológica', tipo: 'Programa', valor: 'R$ 3.000.000,00' },
                  { origem: 'Parceria FAPES/Findes', tipo: 'Parceria', valor: 'R$ 2.000.000,00' },
                ].map((aporte, index) => (
                  <div key={aporte.origem} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 140px 170px',
                    gap: '16px',
                  }}>
                    <div>
                      <label style={labelStyle}>Origem {index + 1}</label>
                      <input type="text" defaultValue={aporte.origem} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Tipo</label>
                      <input type="text" defaultValue={aporte.tipo} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Valor aportado</label>
                      <input type="text" defaultValue={aporte.valor} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Total Financeiro</label>
                <input type="text" defaultValue="R$ 5.000.000,00" readOnly={!editingResumo} style={{ ...resumoInputStyle, color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }} />
              </div>
              <div>
                <label style={labelStyle}>Total por Faixas</label>
                <input type="text" defaultValue="R$ 5.000.000,00" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Saldo sem faixa</label>
                <input type="text" defaultValue="R$ 0,00" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>

            <div>
              <h3 style={subSectionTitleStyle}>Faixas de Financiamento</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { nome: 'Faixa 1', duracao: '24 meses', minimo: 'R$ 50.000,00', maximo: 'R$ 200.000,00', aportado: 'R$ 3.000.000,00' },
                  { nome: 'Faixa 2', duracao: '36 meses', minimo: 'R$ 200.001,00', maximo: 'R$ 500.000,00', aportado: 'R$ 2.000.000,00' },
                ].map(faixa => (
                  <div key={faixa.nome} style={{
                    display: 'grid',
                    gap: '12px',
                  }}>
                    <h4 style={{ ...subSectionTitleStyle, marginBottom: '12px' }}>{faixa.nome}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Duração máxima</label>
                        <input type="text" defaultValue={faixa.duracao} readOnly={!editingResumo} style={resumoInputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Valor mínimo</label>
                        <input type="text" defaultValue={faixa.minimo} readOnly={!editingResumo} style={resumoInputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Valor máximo</label>
                        <input type="text" defaultValue={faixa.maximo} readOnly={!editingResumo} style={resumoInputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Valor aportado</label>
                        <input type="text" defaultValue={faixa.aportado} readOnly={!editingResumo} style={resumoInputStyle} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SESSÃO 2 — Cronograma da Captação */}
        <div style={cardStyle}>
          <NumberedSectionTitle number="2" title="Cronograma da Captação" />

          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { etapa: 'Publicação da captação', inicio: '01/02/2026', fim: '01/02/2026' },
              { etapa: 'Recebimento das propostas', inicio: '01/02/2026', fim: '31/03/2026' },
              { etapa: 'Avaliação documental', inicio: '01/04/2026', fim: '15/04/2026' },
              { etapa: 'Avaliação Ad Hoc', inicio: '16/04/2026', fim: '31/05/2026' },
              { etapa: 'Publicação do resultado preliminar', inicio: '05/06/2026', fim: '05/06/2026' },
              { etapa: 'Recebimento de revisão do resultado', inicio: '06/06/2026', fim: '15/06/2026' },
              { etapa: 'Publicação do resultado após revisão', inicio: '20/06/2026', fim: '20/06/2026' },
              { etapa: 'Publicação do resultado final', inicio: '25/06/2026', fim: '25/06/2026' },
            ].map((item, index) => (
              <div key={item.etapa} style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr 160px 160px',
                gap: '16px',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(0,193,175,0.12)',
                  color: '#00c1af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {index + 1}
                </div>
                <div>
                  <label style={labelStyle}>Etapa obrigatória</label>
                  <input type="text" defaultValue={item.etapa} readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Data inicial</label>
                  <input type="text" defaultValue={item.inicio} readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Data final</label>
                  <input type="text" defaultValue={item.fim} readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
              </div>
            ))}

            <div style={dividerStyle} />

            <div>
              <h3 style={subSectionTitleStyle}>Histórico de Adiamentos</h3>
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(251,191,36,0.22)',
                backgroundColor: 'rgba(251,191,36,0.06)',
              }}>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', marginBottom: '4px' }}>
                  Avaliação documental adiada em 5 dia(s)
                </div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#fbbf24', marginBottom: '4px' }}>
                  01/04/2026 → 06/04/2026 · fim: 15/04/2026 → 20/04/2026
                </div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)' }}>
                  Necessidade de tempo adicional para conferência documental.
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            <div>
              <h3 style={subSectionTitleStyle}>Formulários da Captação</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Formulário de Submissão</label>
                  <input type="text" defaultValue="Formulário de Inovação" readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Formulário de Avaliação</label>
                  <input type="text" defaultValue="Avaliação de Inovação" readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Formulário do Recurso</label>
                  <input type="text" defaultValue="Recurso Padrão" readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Formulário de Anexos</label>
                  <input type="text" defaultValue="Anexos institucionais" readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SESSÃO 3 — Parametrizações Gerais */}
        <div style={cardStyle}>
          <NumberedSectionTitle number="3" title="Parametrizações Gerais" />

          <div style={{ display: 'grid', gap: '16px' }}>
            <h3 style={subSectionTitleStyle}>Regras de Submissão</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Permitir múltiplas propostas por proponente</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Coordenador pode ter outro projeto ativo</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Coordenador pode acumular bolsa</label>
                <input type="text" defaultValue="Não" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Apenas proponentes escolhidos</label>
                <input type="text" defaultValue="Não" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* SESSÃO 4 — Requisitos e Restrições */}
        <div style={cardStyle}>
          <NumberedSectionTitle number="4" title="Requisitos e Restrições" />

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Direcionamento da proposta</label>
                <input type="text" defaultValue="Aberta" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Proposta vinculada à instituição</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nível acadêmico mínimo</label>
                <input type="text" defaultValue="Doutorado" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Gestor institucional obrigatório</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Restrição de vínculo empregatício</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Permite parceria entre instituições</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* SESSÃO 5 — Rubricas, Avaliação e Prestações */}
        <div style={cardStyle}>
          <NumberedSectionTitle number="5" title="Rubricas, Avaliação e Prestações" />

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Necessita avaliação ad hoc?</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mínimo de revisores por proposta</label>
                <input type="text" defaultValue="2" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Prestação técnica</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Prestação financeira</label>
                <input type="text" defaultValue="Sim" readOnly={!editingResumo} style={resumoInputStyle} />
              </div>
            </div>

            <div style={dividerStyle} />

            <div>
              <h3 style={subSectionTitleStyle}>Rubricas Permitidas</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Material Permanente', descricao: 'Bens permanentes e equipamentos.' },
                  { label: 'Material de Consumo', descricao: 'Itens consumíveis usados no projeto.' },
                  { label: 'Bolsa', descricao: 'Modalidades e níveis de bolsa permitidos na captação.' },
                ].map(rubrica => (
                  <div key={rubrica.label} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 16px',
                    border: '1px solid rgba(0,193,175,0.24)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'rgba(0,193,175,0.07)',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', marginBottom: '3px' }}>
                        {rubrica.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>
                        {rubrica.descricao}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af' }}>Permitida</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '16px',
              border: '1px solid rgba(0,193,175,0.18)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(0,193,175,0.06)',
            }}>
              <h3 style={subSectionTitleStyle}>Modalidades e Níveis de Bolsa</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { modalidade: 'Iniciação Científica', nivel: 'Nível A', versao: 'Última versão ativa', maximo: '2', cotas: '50', institucional: 'Não' },
                  { modalidade: 'Pesquisa', nivel: 'Nível C', versao: 'Última versão ativa', maximo: '1', cotas: '30', institucional: 'Sim' },
                ].map((bolsa, index) => (
                  <div key={`${bolsa.modalidade}-${bolsa.nivel}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 110px 110px 120px', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Modalidade {index + 1}</label>
                      <input type="text" defaultValue={bolsa.modalidade} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Nível</label>
                      <input type="text" defaultValue={bolsa.nivel} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Versão</label>
                      <input type="text" defaultValue={bolsa.versao} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Máx.</label>
                      <input type="text" defaultValue={bolsa.maximo} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Cotas</label>
                      <input type="text" defaultValue={bolsa.cotas} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Institucional</label>
                      <input type="text" defaultValue={bolsa.institucional} readOnly={!editingResumo} style={resumoInputStyle} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SESSÃO 6 — Documentos Exigidos */}
        <div style={cardStyle}>
          <NumberedSectionTitle number="6" title="Documentos Exigidos do Proponente" />

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.08)', marginBottom: '18px' }}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#fbbf24', margin: '0 0 4px' }}>
              Observação
            </p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.68)', margin: 0, lineHeight: 1.45 }}>
              Quando o proponente for empresa ou instituição, documentos recorrentes devem ser reaproveitados do cadastro corporativo quando estiverem válidos e houver representante legal vinculado.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { label: 'Contrato social ou estatuto', descricao: 'Documento constitutivo da instituição ou empresa proponente.', obrigatorio: 'Obrigatório', formatos: 'PDF' },
              { label: 'Balanço patrimonial', descricao: 'Demonstração contábil usada para comprovar capacidade econômico-financeira.', obrigatorio: 'Opcional', formatos: 'PDF ou XLSX' },
              { label: 'Certidões de regularidade fiscal', descricao: 'Comprovação de regularidade perante órgãos fiscais e trabalhistas.', obrigatorio: 'Opcional', formatos: 'PDF' },
              { label: 'Comprovante do representante legal', descricao: 'Comprova poderes de representação do responsável pela submissão.', obrigatorio: 'Obrigatório', formatos: 'PDF' },
            ].map(documento => (
              <div key={documento.label} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 130px 130px',
                gap: '16px',
                alignItems: 'center',
                padding: '16px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(23, 23, 23,0.35)',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', marginBottom: '4px' }}>
                    {documento.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.45 }}>
                    {documento.descricao}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Obrigatoriedade</label>
                  <input type="text" defaultValue={documento.obrigatorio} readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Formatos</label>
                  <input type="text" defaultValue={documento.formatos} readOnly={!editingResumo} style={resumoInputStyle} />
                </div>
              </div>
            ))}
          </div>
        </div>

          </>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { ...fasesIniciativas[0], Icon: FileText, bg: 'rgba(0,193,175,0.12)' },
                { ...fasesIniciativas[1], Icon: CheckCircle, bg: 'rgba(0,193,175,0.12)' },
                { ...fasesIniciativas[2], Icon: ClipboardCheck, bg: 'rgba(0,193,175,0.12)' },
                { ...fasesIniciativas[3], Icon: ListChecks, bg: 'rgba(0,193,175,0.12)' },
                { ...fasesIniciativas[4], Icon: RotateCcw, bg: 'rgba(0,193,175,0.12)' },
                { ...fasesIniciativas[5], Icon: Trophy, bg: 'rgba(0,193,175,0.12)' },
                { ...fasesIniciativas[6], Icon: X, bg: 'rgba(0,193,175,0.12)' },
              ].map(({ fase, quantidade, Icon, bg }) => (
                <div key={fase} style={metricCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: bg, borderRadius: 'var(--radius)', flexShrink: 0 }}>
                      <Icon size={20} style={{ color: '#00c1af' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      {fase}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: '#ffffff', textAlign: 'center', margin: 0 }}>
                    {quantidade}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Valor Total Disponível', value: formatCurrency(financeiroCaptacaoDetalhe.totalDisponivel), Icon: CheckCircle },
                { label: 'Valor Total Solicitado pelos Projetos', value: formatCurrency(financeiroCaptacaoDetalhe.totalSolicitado), Icon: FileText },
              ].map(({ label, value, Icon }) => (
                <div key={label} style={metricCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(0,193,175,0.12)', borderRadius: 'var(--radius)', flexShrink: 0 }}>
                      <Icon size={20} style={{ color: '#00c1af' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      {label}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: '#ffffff', margin: 0 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
                      Valor total solicitado por rubrica
                    </div>
                    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}>
                      {financeiroCaptacaoDetalhe.rubricas.length} rubrica(s)
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '16px', maxHeight: financeiroCaptacaoDetalhe.rubricas.length > 5 ? '270px' : undefined, overflowY: financeiroCaptacaoDetalhe.rubricas.length > 5 ? 'auto' : undefined, paddingRight: financeiroCaptacaoDetalhe.rubricas.length > 5 ? '6px' : undefined }}>
                    {financeiroCaptacaoDetalhe.rubricas.map(rubrica => {
                      const percentual = Math.round((rubrica.valor / maiorValorRubricaDetalhe) * 100);

                      return (
                        <div key={rubrica.nome}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 110px', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                              {rubrica.nome}
                            </div>
                            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', textAlign: 'right' }}>
                              {formatCurrency(rubrica.valor)}
                            </div>
                            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
                              {rubrica.quantidade} projeto(s)
                            </div>
                          </div>
                          <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>

              <div style={{ ...cardStyle, marginBottom: 0 }}>
                <h2 style={{ ...sectionTitleStyle, color: '#ffffff' }}>Tipos de bolsas solicitadas</h2>
                <div style={{ display: 'grid', gap: '16px', maxHeight: tiposBolsasSolicitadas.length > 5 ? '270px' : undefined, overflowY: tiposBolsasSolicitadas.length > 5 ? 'auto' : undefined, paddingRight: tiposBolsasSolicitadas.length > 5 ? '6px' : undefined }}>
                  {tiposBolsasSolicitadas.map(item => {
                    const percentual = Math.round((item.quantidade / maiorQuantidadeBolsa) * 100);

                    return (
                      <div key={item.tipo}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                            {item.tipo}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', textAlign: 'right' }}>
                            {item.quantidade}
                          </div>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ ...cardStyle, marginBottom: 0 }}>
                <h2 style={{ ...sectionTitleStyle, color: '#ffffff' }}>Propostas por Instituição</h2>
                <div style={{ display: 'grid', gap: '16px', maxHeight: propostasPorInstituicao.length > 5 ? '270px' : undefined, overflowY: propostasPorInstituicao.length > 5 ? 'auto' : undefined, paddingRight: propostasPorInstituicao.length > 5 ? '6px' : undefined }}>
                  {propostasPorInstituicao.map(item => {
                    const percentual = Math.round((item.quantidade / maiorQuantidadeInstituicao) * 100);

                    return (
                      <div key={item.instituicao}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                            {item.instituicao}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', textAlign: 'right' }}>
                            {item.quantidade}
                          </div>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ ...cardStyle, marginBottom: 0 }}>
                <h2 style={{ ...sectionTitleStyle, color: '#ffffff' }}>Proposta por Localização</h2>
                <div style={{ display: 'grid', gap: '16px', maxHeight: propostasPorLocalizacao.length > 5 ? '270px' : undefined, overflowY: propostasPorLocalizacao.length > 5 ? 'auto' : undefined, paddingRight: propostasPorLocalizacao.length > 5 ? '6px' : undefined }}>
                  {propostasPorLocalizacao.map(item => {
                    const percentual = Math.round((item.quantidade / maiorQuantidadeLocalizacao) * 100);

                    return (
                      <div key={item.localizacao}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                            {item.localizacao}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', textAlign: 'right' }}>
                            {item.quantidade}
                          </div>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <h2 style={{ ...sectionTitleStyle, color: '#ffffff', marginBottom: '6px' }}>Revisores Ad Hoc</h2>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                    Revisores selecionados para avaliação dos Projetos desta Captação.
                  </p>
                </div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af', padding: '6px 10px', borderRadius: '999px', border: '1px solid rgba(0,193,175,0.28)', backgroundColor: 'rgba(0,193,175,0.08)', whiteSpace: 'nowrap' }}>
                  {revisoresAdHocDashboard.length} revisor(es)
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {revisoresAdHocDashboard.map(revisor => {
                  const quantidadeAvaliacoes = avaliacoesAdHoc.filter(avaliacao => avaliacao.revisor === revisor.nome).length;

                  return (
                    <div
                      key={revisor.nome}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 0.9fr 1fr 150px',
                        gap: '16px',
                        alignItems: 'start',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(23, 23, 23,0.35)',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Revisor</div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                          {revisor.nome}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Instituição</div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                          {revisor.instituicao}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Área</div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                          {revisor.area}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Especialização</div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                          {revisor.titulacao}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Avaliações Realizadas</div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>
                          {quantidadeAvaliacoes}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </>
        )}

        {activeTab === 'proposta' && (
          <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 250px 180px 220px', gap: '16px', marginBottom: '16px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Busca</label>
                  <input type="text" placeholder="Buscar" style={filtroCampoStyle} />
                </div>
                {renderCustomDropdown({
                  label: 'Ordenar por',
                  value: propostaOrdenacao,
                  options: ordenacaoOptions,
                  open: showOrdenacaoDropdown,
                  setOpen: setShowOrdenacaoDropdown,
                  onSelect: setPropostaOrdenacao,
                })}
                <div>
                  <label style={labelStyle}>Data</label>
                  <input type="text" placeholder="dd/mm/aaaa" style={filtroCampoStyle} />
                </div>
                {renderCustomDropdown({
                  label: 'Fase',
                  value: fasePropostaFiltro,
                  options: fasePropostaOptions.map(fase => ({ value: fase, label: fase })),
                  open: showFaseDropdown,
                  setOpen: setShowFaseDropdown,
                  onSelect: setFasePropostaFiltro,
                })}
              </div>
              {propostasExibidas.map(iniciativa => (
                <div
                  key={iniciativa.codigo}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.5)'; }}
                  style={{
                    ...detalheLinhaStyle,
                    gridTemplateColumns: '1.25fr 1fr 24px 0.9fr 140px 110px 150px',
                  }}
                >
                  <div>
                    <div style={detalheRotuloStyle}>Proposta</div>
                    <div style={{ ...detalheValorStyle, fontWeight: 'var(--font-weight-medium)' }}>
                      {iniciativa.titulo}
                    </div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Instituição</div>
                    <div style={detalheValorStyle}>{iniciativa.proponente}</div>
                  </div>
                  <div aria-hidden="true" />
                  <div>
                    <div style={detalheRotuloStyle}>Proponente</div>
                    <div style={detalheValorStyle}>{iniciativa.ortogado}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Valor solicitado</div>
                    <div style={detalheValorStyle}>{iniciativa.valorSolicitado}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Envio</div>
                    <div style={detalheValorStyle}>{iniciativa.data}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Fase</div>
                    <div style={detalheValorStyle}>{fasePropostaLabel(iniciativa.fase)}</div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'avaliacao' && (
          <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 220px',
                gap: '16px',
                marginBottom: '16px',
                alignItems: 'end',
              }}>
                <div>
                  <label style={labelStyle}>Busca</label>
                  <input type="text" placeholder="Buscar" style={filtroCampoStyle} />
                </div>
                {renderCustomDropdown({
                  label: 'Status',
                  value: statusHabilitacaoFiltro,
                  options: ['Habilitado', 'Não Habilitado', 'Rascunho'].map(status => ({ value: status, label: status })),
                  open: showStatusHabilitacaoDropdown,
                  setOpen: setShowStatusHabilitacaoDropdown,
                  onSelect: setStatusHabilitacaoFiltro,
                })}
              </div>
              {iniciativasEnviadas.map((iniciativa, index) => {
                const habilitado = index % 4 !== 2;
                return (
                <div
                  key={`documentos-${iniciativa.codigo}`}
                  onClick={() => {
                    setHabilitacaoSelecionada(iniciativa);
                    setResultadoHabilitacao('');
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = '#00c1af';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                  style={{
                    ...detalheLinhaStyle,
                    gridTemplateColumns: '1.4fr 1.05fr 24px 1fr 190px',
                  }}
                >
                  <div>
                    <div style={detalheRotuloStyle}>Proposta</div>
                    <div style={{ ...detalheValorStyle, fontWeight: 'var(--font-weight-medium)' }}>
                      {iniciativa.titulo}
                    </div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Instituição</div>
                    <div style={detalheValorStyle}>{iniciativa.proponente}</div>
                  </div>
                  <div aria-hidden="true" />
                  <div>
                    <div style={detalheRotuloStyle}>Proponente</div>
                    <div style={detalheValorStyle}>{iniciativa.ortogado}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Status</div>
                    <span style={{
                      display: 'inline-flex',
                      width: 'fit-content',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      border: habilitado ? '1px solid rgba(34,197,94,0.38)' : '1px solid rgba(239,68,68,0.38)',
                      backgroundColor: habilitado ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: habilitado ? '#22c55e' : '#ef4444',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {habilitado ? 'Habilitado' : 'Não Habilitado'}
                    </span>
                  </div>
                </div>
                );
              })}
          </div>
        )}

        {activeTab === 'avaliacaoAdHoc' && (
          <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 260px',
                gap: '16px',
                marginBottom: '16px',
                alignItems: 'end',
              }}>
                <div>
                  <label style={labelStyle}>Busca</label>
                  <input type="text" placeholder="Buscar" style={filtroCampoStyle} />
                </div>
                {renderCustomDropdown({
                  label: 'Status',
                  value: statusAvaliacaoAdHocFiltro,
                  options: ['Aguardando Avaliador', 'Aguardando Aceite', 'Em Avaliação', 'Concluída', 'Em Revisão'].map(status => ({ value: status, label: status })),
                  open: showStatusAvaliacaoAdHocDropdown,
                  setOpen: setShowStatusAvaliacaoAdHocDropdown,
                  onSelect: setStatusAvaliacaoAdHocFiltro,
                })}
              </div>
              {avaliacoesAdHoc.map(avaliacao => {
                const iniciativaAvaliada = iniciativasEnviadas.find(item => item.codigo === avaliacao.iniciativaCodigo);

                return (
                  <div
                    key={`${avaliacao.iniciativaCodigo}-${avaliacao.revisor}`}
                    onClick={() => abrirModalAvaliador(avaliacao)}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.borderColor = '#00c1af';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                    style={{
                      ...detalheLinhaStyle,
                      gridTemplateColumns: '1.1fr 1.35fr 24px 1.05fr 24px 1fr 130px 70px',
                    }}
                  >
                    <div>
                      <div style={detalheRotuloStyle}>Avaliador</div>
                      <div style={{ ...detalheValorStyle, fontWeight: 'var(--font-weight-medium)' }}>
                        {avaliacao.revisor}
                      </div>
                    </div>
                    <div>
                      <div style={detalheRotuloStyle}>Proposta</div>
                      <div style={detalheValorStyle}>{iniciativaAvaliada?.titulo || avaliacao.iniciativaCodigo}</div>
                    </div>
                    <div aria-hidden="true" />
                    <div>
                      <div style={detalheRotuloStyle}>Instituição</div>
                      <div style={detalheValorStyle}>{iniciativaAvaliada?.proponente || '-'}</div>
                    </div>
                    <div aria-hidden="true" />
                    <div>
                      <div style={detalheRotuloStyle}>Proponente</div>
                      <div style={detalheValorStyle}>{iniciativaAvaliada?.ortogado || '-'}</div>
                    </div>
                    <div>
                      <div style={detalheRotuloStyle}>Status</div>
                      <span style={{
                        display: 'inline-flex',
                        width: 'fit-content',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        border: avaliacao.status === 'Concluída' ? '1px solid rgba(34,197,94,0.38)' : avaliacao.status === 'Em avaliação' ? '1px solid rgba(0,193,175,0.38)' : '1px solid rgba(251,191,36,0.38)',
                        backgroundColor: avaliacao.status === 'Concluída' ? 'rgba(34,197,94,0.12)' : avaliacao.status === 'Em avaliação' ? 'rgba(0,193,175,0.12)' : 'rgba(251,191,36,0.12)',
                        color: avaliacao.status === 'Concluída' ? '#22c55e' : avaliacao.status === 'Em avaliação' ? '#00c1af' : '#fbbf24',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}>
                        {avaliacao.status}
                      </span>
                    </div>
                    <div>
                      <div style={detalheRotuloStyle}>Nota</div>
                      <div style={{ ...detalheValorStyle, color: '#00c1af', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)' }}>{avaliacao.nota}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {activeTab === 'recurso' && (
          <div style={{ display: 'grid', gap: '10px' }}>
              {renderListFilters(['Todos', 'Em análise', 'Aprovado', 'Recusado'])}
              {iniciativasEnviadas.map((iniciativa, index) => {
                const recursoStatus = index % 3 === 0 ? 'Aprovado' : index % 3 === 1 ? 'Em análise' : 'Recusado';
                const recursoColor = recursoStatus === 'Aprovado' ? '#22c55e' : recursoStatus === 'Recusado' ? '#ef4444' : '#00c1af';
                const recursoBg = recursoStatus === 'Aprovado' ? 'rgba(34,197,94,0.12)' : recursoStatus === 'Recusado' ? 'rgba(239,68,68,0.12)' : 'rgba(0,193,175,0.12)';
                const recursoBorder = recursoStatus === 'Aprovado' ? '1px solid rgba(34,197,94,0.38)' : recursoStatus === 'Recusado' ? '1px solid rgba(239,68,68,0.38)' : '1px solid rgba(0,193,175,0.38)';
                return (
                <div
                  key={iniciativa.codigo}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.5)'; }}
                  style={{
                    ...detalheLinhaStyle,
                    gridTemplateColumns: '1.25fr 1fr 1fr 150px 150px',
                  }}
                >
                  <div>
                    <div style={detalheRotuloStyle}>Proposta</div>
                    <div style={{ ...detalheValorStyle, fontWeight: 'var(--font-weight-medium)' }}>
                      {iniciativa.titulo}
                    </div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Instituição</div>
                    <div style={detalheValorStyle}>{iniciativa.proponente}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Proponente</div>
                    <div style={detalheValorStyle}>{iniciativa.ortogado}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Fase</div>
                    <div style={detalheValorStyle}>{index % 2 === 0 ? 'Habilitação' : 'Avaliação Ad Hoc'}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Status</div>
                    <span style={{
                      display: 'inline-flex',
                      width: 'fit-content',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      border: recursoBorder,
                      backgroundColor: recursoBg,
                      color: recursoColor,
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {recursoStatus}
                    </span>
                  </div>
                </div>
                );
              })}
          </div>
        )}

        {activeTab === 'recursoParcial' && (
          <div style={{ display: 'grid', gap: '10px' }}>
              {renderListFilters(['Todos', 'Em análise', 'Aprovado parcialmente', 'Recusado parcialmente'])}
              {iniciativasEnviadas.map((iniciativa, index) => {
                const recursoStatus = index % 3 === 0 ? 'Aprovado parcialmente' : index % 3 === 1 ? 'Em análise' : 'Recusado parcialmente';
                const recursoColor = recursoStatus === 'Aprovado parcialmente' ? '#22c55e' : recursoStatus === 'Recusado parcialmente' ? '#ef4444' : '#00c1af';
                const recursoBg = recursoStatus === 'Aprovado parcialmente' ? 'rgba(34,197,94,0.12)' : recursoStatus === 'Recusado parcialmente' ? 'rgba(239,68,68,0.12)' : 'rgba(0,193,175,0.12)';
                const recursoBorder = recursoStatus === 'Aprovado parcialmente' ? '1px solid rgba(34,197,94,0.38)' : recursoStatus === 'Recusado parcialmente' ? '1px solid rgba(239,68,68,0.38)' : '1px solid rgba(0,193,175,0.38)';
                return (
                <div
                  key={iniciativa.codigo}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = '#00c1af';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                  style={{
                    ...detalheLinhaStyle,
                    gridTemplateColumns: '1.25fr 1fr 1fr 150px 190px',
                  }}
                >
                  <div>
                    <div style={detalheRotuloStyle}>Proposta</div>
                    <div style={{ ...detalheValorStyle, fontWeight: 'var(--font-weight-medium)' }}>
                      {iniciativa.titulo}
                    </div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Instituição</div>
                    <div style={detalheValorStyle}>{iniciativa.proponente}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Proponente</div>
                    <div style={detalheValorStyle}>{iniciativa.ortogado}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Fase</div>
                    <div style={detalheValorStyle}>{index % 2 === 0 ? 'Habilitação' : 'Avaliação Ad Hoc'}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Status</div>
                    <span style={{
                      display: 'inline-flex',
                      width: 'fit-content',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      border: recursoBorder,
                      backgroundColor: recursoBg,
                      color: recursoColor,
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {recursoStatus}
                    </span>
                  </div>
                </div>
                );
              })}
          </div>
        )}

        {activeTab === 'resultadoFinal' && (
          <div style={{ display: 'grid', gap: '10px' }}>
              {renderListFilters(['Todos', 'Aprovado', 'Reprovado'])}
              {iniciativasEnviadas.map((iniciativa, index) => {
                const aprovado = index % 4 !== 2;
                return (
                <div
                  key={iniciativa.codigo}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.5)'; }}
                  style={{
                    ...detalheLinhaStyle,
                    gridTemplateColumns: '1.4fr 1.05fr 1fr 150px',
                  }}
                >
                  <div>
                    <div style={detalheRotuloStyle}>Proposta</div>
                    <div style={{ ...detalheValorStyle, fontWeight: 'var(--font-weight-medium)' }}>
                      {iniciativa.titulo}
                    </div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Instituição</div>
                    <div style={detalheValorStyle}>{iniciativa.proponente}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Proponente</div>
                    <div style={detalheValorStyle}>{iniciativa.ortogado}</div>
                  </div>
                  <div>
                    <div style={detalheRotuloStyle}>Status</div>
                    <span style={{
                      display: 'inline-flex',
                      width: 'fit-content',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      border: aprovado ? '1px solid rgba(34,197,94,0.38)' : '1px solid rgba(239,68,68,0.38)',
                      backgroundColor: aprovado ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: aprovado ? '#22c55e' : '#ef4444',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {aprovado ? 'Aprovado' : 'Reprovado'}
                    </span>
                  </div>
                </div>
                );
              })}
          </div>
        )}

      </div>

      {/* Modal de Avaliadores */}
      {renderModal()}
      {renderAvaliadorModal()}
    </div>
  );
};
