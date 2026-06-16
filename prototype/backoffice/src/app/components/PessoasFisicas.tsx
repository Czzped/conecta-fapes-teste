import React, { useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Plus, Search, UserRound } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

type EstadoPessoa = 'Ativa' | 'Suspensa';
type PersonDetailTab = 'cadastro' | 'dashboard' | 'vidaAcademica';

interface PessoaFisicaItem {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  lattes: string;
  estado: EstadoPessoa;
  justificativa?: string;
}

interface ProjetoPessoa {
  pessoaId: number;
  nome: string;
  programa: string;
  papel: string;
  status: string;
  inicio: string;
  fim: string;
}

interface BolsaPessoa {
  pessoaId: number;
  modalidade: string;
  nivel: string;
  projeto: string;
  valorMensal: number;
  inicio: string;
  fim: string;
  status: 'Recebendo' | 'Encerrada';
}

interface VidaAcademicaPessoa {
  pessoaId: number;
  numeroLattes: string;
  ultimaSincronizacao: string;
  curriculoValido: boolean;
  titulacaoMaxima: string;
  areaPrincipal: string;
  formacoes: FormacaoAcademica[];
  artigos: ArtigoAcademico[];
  livros: LivroAcademico[];
  orientacoes: OrientacaoAcademica[];
  projetos: ProjetoAcademico[];
  eventos: EventoAcademico[];
  premios: PremioAcademico[];
  idiomas: IdiomaAcademico[];
}

interface FormacaoAcademica { nivel: string; curso: string; instituicao: string; periodo: string; status: string }
interface ArtigoAcademico { titulo: string; periodico: string; ano: string; autores: string }
interface LivroAcademico { titulo: string; tipo: string; ano: string; papel: string }
interface OrientacaoAcademica { nivel: string; orientando: string; instituicao: string; status: string }
interface ProjetoAcademico { titulo: string; tipo: string; papel: string; periodo: string; status: string }
interface EventoAcademico { nome: string; papel: string; ano: string; local: string }
interface PremioAcademico { nome: string; entidade: string; ano: string }
interface IdiomaAcademico { idioma: string; leitura: string; fala: string; escrita: string }

const buildStyles = (T: ThemeTokens) => ({
  input: {
    width: '100%',
    backgroundColor: T.bgInput,
    border: `1px solid ${T.borderDefault}`,
    borderRadius: '6px',
    padding: '10px 12px',
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    marginBottom: '8px',
  } as React.CSSProperties,
  card: {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '10px',
    padding: '20px',
  } as React.CSSProperties,
  rowCard: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.8fr 0.6fr',
    gap: '14px',
    alignItems: 'start',
    padding: '14px',
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '8px',
    backgroundColor: T.bgSurfaceMuted,
  } as React.CSSProperties,
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: T.accent,
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: T.accentText,
    cursor: 'pointer',
  } as React.CSSProperties,
  secondaryButton: {
    backgroundColor: 'transparent',
    border: `1px solid ${T.borderStrong}`,
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    cursor: 'pointer',
  } as React.CSSProperties,
  dangerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239,68,68,0.35)',
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.danger,
    cursor: 'pointer',
  } as React.CSSProperties,
});

const emptyPessoa: PessoaFisicaItem = {
  id: 0,
  cpf: '',
  nome: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  lattes: '',
  estado: 'Ativa',
  justificativa: '',
};

const initialPessoas: PessoaFisicaItem[] = [
  { id: 1, cpf: '111.222.333-44', nome: 'Maria Souza', email: 'maria.souza@email.com', telefone: '(27) 99999-1000', dataNascimento: '1985-03-14', lattes: 'http://lattes.cnpq.br/1234567890', estado: 'Ativa' },
  { id: 2, cpf: '222.333.444-55', nome: 'João Silva', email: 'joao.silva@email.com', telefone: '(27) 99999-2000', dataNascimento: '1979-09-21', lattes: 'http://lattes.cnpq.br/2345678901', estado: 'Ativa' },
  { id: 3, cpf: '333.444.555-66', nome: 'Ana Ribeiro', email: 'ana.ribeiro@email.com', telefone: '(27) 99999-3000', dataNascimento: '1991-01-10', lattes: '', estado: 'Suspensa', justificativa: 'Pendência cadastral em validação.' },
  { id: 4, cpf: '444.555.666-77', nome: 'Carla Mendes', email: 'carla.mendes@email.com', telefone: '(27) 99999-4000', dataNascimento: '1988-07-18', lattes: 'http://lattes.cnpq.br/3456789012', estado: 'Ativa' },
  { id: 5, cpf: '555.666.777-88', nome: 'Pedro Lima', email: 'pedro.lima@email.com', telefone: '(27) 99999-5000', dataNascimento: '1994-11-05', lattes: '', estado: 'Ativa' },
  { id: 6, cpf: '666.777.888-99', nome: 'Luciana Costa', email: 'luciana.costa@email.com', telefone: '(27) 99999-6000', dataNascimento: '1982-04-22', lattes: 'http://lattes.cnpq.br/4567890123', estado: 'Ativa' },
  { id: 7, cpf: '777.888.999-00', nome: 'Rafael Gomes', email: 'rafael.gomes@email.com', telefone: '(27) 99999-7000', dataNascimento: '1990-12-12', lattes: '', estado: 'Suspensa' },
  { id: 8, cpf: '888.999.000-11', nome: 'Beatriz Rocha', email: 'beatriz.rocha@email.com', telefone: '(27) 99999-8000', dataNascimento: '1996-02-28', lattes: 'http://lattes.cnpq.br/5678901234', estado: 'Ativa' },
  { id: 9, cpf: '999.000.111-22', nome: 'Henrique Alves', email: 'henrique.alves@email.com', telefone: '(27) 99999-9000', dataNascimento: '1987-06-09', lattes: '', estado: 'Ativa' },
  { id: 10, cpf: '000.111.222-33', nome: 'Fernanda Martins', email: 'fernanda.martins@email.com', telefone: '(27) 99999-1010', dataNascimento: '1992-10-30', lattes: 'http://lattes.cnpq.br/6789012345', estado: 'Suspensa' },
];

const projetosPorPessoa: ProjetoPessoa[] = [
  { pessoaId: 1, nome: 'Projeto Pesquisa Aplicada em Saúde', programa: 'Programa de Pesquisa Aplicada', papel: 'Coordenadora', status: 'Em execução', inicio: '2025-02-01', fim: '2027-01-31' },
  { pessoaId: 1, nome: 'Plataforma de Dados para Políticas Públicas', programa: 'Programa Governo Digital', papel: 'Pesquisadora', status: 'Em execução', inicio: '2024-08-01', fim: '2026-07-31' },
  { pessoaId: 2, nome: 'Rede Capixaba de Inovação Industrial', programa: 'Programa de Inovação', papel: 'Pesquisador', status: 'Em execução', inicio: '2025-01-15', fim: '2026-12-15' },
  { pessoaId: 3, nome: 'Observatório de Indicadores Educacionais', programa: 'Programa de Educação Científica', papel: 'Consultora', status: 'Suspenso', inicio: '2024-03-01', fim: '2025-12-31' },
  { pessoaId: 4, nome: 'Laboratório de Materiais Sustentáveis', programa: 'Programa de Pesquisa Aplicada', papel: 'Pesquisadora', status: 'Em execução', inicio: '2025-05-01', fim: '2027-04-30' },
  { pessoaId: 6, nome: 'Monitoramento Ambiental Integrado', programa: 'Programa Clima e Sustentabilidade', papel: 'Coordenadora', status: 'Em execução', inicio: '2025-08-01', fim: '2027-07-31' },
  { pessoaId: 8, nome: 'Tecnologias Educacionais Inclusivas', programa: 'Programa Educação Científica', papel: 'Bolsista', status: 'Em execução', inicio: '2026-01-01', fim: '2026-12-31' },
];

const bolsasPorPessoa: BolsaPessoa[] = [
  { pessoaId: 1, modalidade: 'Mestrado', nivel: 'MS-1', projeto: 'Projeto Pesquisa Aplicada em Saúde', valorMensal: 2100, inicio: '2025-03-01', fim: '2027-02-28', status: 'Recebendo' },
  { pessoaId: 1, modalidade: 'Pesquisa', nivel: 'DTI-B', projeto: 'Plataforma de Dados para Políticas Públicas', valorMensal: 3200, inicio: '2024-09-01', fim: '2025-08-31', status: 'Encerrada' },
  { pessoaId: 2, modalidade: 'Doutorado', nivel: 'DR-1', projeto: 'Rede Capixaba de Inovação Industrial', valorMensal: 3100, inicio: '2025-02-01', fim: '2028-01-31', status: 'Recebendo' },
  { pessoaId: 4, modalidade: 'Iniciação Científica', nivel: 'IC', projeto: 'Laboratório de Materiais Sustentáveis', valorMensal: 700, inicio: '2025-06-01', fim: '2026-05-31', status: 'Recebendo' },
  { pessoaId: 6, modalidade: 'Pesquisa', nivel: 'DTI-A', projeto: 'Monitoramento Ambiental Integrado', valorMensal: 4200, inicio: '2025-09-01', fim: '2027-08-31', status: 'Recebendo' },
  { pessoaId: 8, modalidade: 'Mestrado', nivel: 'MS-1', projeto: 'Tecnologias Educacionais Inclusivas', valorMensal: 2100, inicio: '2026-02-01', fim: '2028-01-31', status: 'Recebendo' },
];

const expandArtigos = (base: ArtigoAcademico[], total: number) => Array.from({ length: total }, (_, index) => {
  const item = base[index % base.length];
  const ano = String(2026 - (index % 12));
  return {
    ...item,
    titulo: `${item.titulo} ${index + 1}`,
    ano,
  };
});

const expandOrientacoes = (base: OrientacaoAcademica[], total: number) => Array.from({ length: total }, (_, index) => {
  const item = base[index % base.length];
  return {
    ...item,
    orientando: `${item.orientando} ${index + 1}`,
    status: index % 4 === 0 ? 'Em andamento' : 'Concluida',
  };
});

const expandProjetos = (base: ProjetoAcademico[], total: number) => Array.from({ length: total }, (_, index) => {
  const item = base[index % base.length];
  const inicio = 2014 + (index % 10);
  return {
    ...item,
    titulo: `${item.titulo} ${index + 1}`,
    periodo: `${inicio}-${inicio + 2}`,
    papel: index % 3 === 0 ? 'Coordenadora' : item.papel,
    status: index % 5 === 0 ? 'Em andamento' : 'Concluido',
  };
});

const vidaAcademicaPorPessoa: VidaAcademicaPessoa[] = [
  {
    pessoaId: 1,
    numeroLattes: '1234567890123456',
    ultimaSincronizacao: '2026-05-11 14:32',
    curriculoValido: true,
    titulacaoMaxima: 'Doutorado',
    areaPrincipal: 'Saude Coletiva',
    formacoes: [
      { nivel: 'Doutorado', curso: 'Saude Coletiva', instituicao: 'UFES', periodo: '2017-2021', status: 'Concluida' },
      { nivel: 'Mestrado', curso: 'Epidemiologia', instituicao: 'Fiocruz', periodo: '2014-2016', status: 'Concluida' },
    ],
    artigos: expandArtigos([
      { titulo: 'Modelos preditivos para atencao primaria', periodico: 'Revista Brasileira de Saude Publica', ano: '2025', autores: 'Maria Souza, Joao Silva, Carla Mendes' },
      { titulo: 'Dados integrados para vigilancia epidemiologica', periodico: 'Cadernos de Ciencia de Dados', ano: '2024', autores: 'Maria Souza, Ana Ribeiro' },
    ], 186),
    livros: [
      { titulo: 'Analise de Dados em Politicas Publicas', tipo: 'Capitulo', ano: '2024', papel: 'Autora' },
    ],
    orientacoes: expandOrientacoes([
      { nivel: 'Mestrado', orientando: 'Lucas Almeida', instituicao: 'UFES', status: 'Em andamento' },
      { nivel: 'Iniciacao Cientifica', orientando: 'Beatriz Rocha', instituicao: 'FAPES/UFES', status: 'Concluida' },
    ], 74),
    projetos: expandProjetos([
      { titulo: 'Plataforma de Dados para Politicas Publicas', tipo: 'Pesquisa', papel: 'Coordenadora', periodo: '2024-2026', status: 'Em andamento' },
      { titulo: 'Rede de Vigilancia Territorial', tipo: 'Desenvolvimento', papel: 'Membro', periodo: '2023-2025', status: 'Concluido' },
    ], 42),
    eventos: [
      { nome: 'Congresso Brasileiro de Saude Coletiva', papel: 'Apresentadora', ano: '2025', local: 'Vitoria/ES' },
    ],
    premios: [
      { nome: 'Prêmio Inovação em Saúde Digital', entidade: 'FAPES', ano: '2025' },
    ],
    idiomas: [
      { idioma: 'Ingles', leitura: 'Fluente', fala: 'Bom', escrita: 'Bom' },
      { idioma: 'Espanhol', leitura: 'Bom', fala: 'Razoavel', escrita: 'Razoavel' },
    ],
  },
  {
    pessoaId: 2,
    numeroLattes: '2345678901234567',
    ultimaSincronizacao: '2026-04-28 09:10',
    curriculoValido: true,
    titulacaoMaxima: 'PosDoutorado',
    areaPrincipal: 'Engenharia de Producao',
    formacoes: [
      { nivel: 'PosDoutorado', curso: 'Sistemas de Inovacao', instituicao: 'USP', periodo: '2020-2021', status: 'Concluida' },
      { nivel: 'Doutorado', curso: 'Engenharia de Producao', instituicao: 'UFSC', periodo: '2012-2016', status: 'Concluida' },
    ],
    artigos: expandArtigos([
      { titulo: 'Maturidade digital em pequenas industrias', periodico: 'Journal of Industrial Innovation', ano: '2025', autores: 'Joao Silva, Maria Souza' },
      { titulo: 'Redes colaborativas de inovacao regional', periodico: 'Revista Tecnologia e Sociedade', ano: '2024', autores: 'Joao Silva, Pedro Lima' },
    ], 132),
    livros: [
      { titulo: 'Inovacao Industrial Aplicada', tipo: 'Livro', ano: '2023', papel: 'Organizador' },
    ],
    orientacoes: expandOrientacoes([
      { nivel: 'Doutorado', orientando: 'Carolina Neves', instituicao: 'UFES', status: 'Em andamento' },
    ], 36),
    projetos: expandProjetos([
      { titulo: 'Rede Capixaba de Inovacao Industrial', tipo: 'Pesquisa', papel: 'Coordenador', periodo: '2025-2026', status: 'Em andamento' },
    ], 24),
    eventos: [
      { nome: 'Seminario Nacional de Inovacao Industrial', papel: 'Convidado', ano: '2025', local: 'Sao Paulo/SP' },
    ],
    premios: [],
    idiomas: [
      { idioma: 'Ingles', leitura: 'Fluente', fala: 'Fluente', escrita: 'Bom' },
    ],
  },
];

const maskCpf = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

const estadoColor = (estado: EstadoPessoa) => estado === 'Ativa' ? '#22c55e' : '#f59e0b';

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const PessoasFisicas: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [detailTab, setDetailTab] = useState<PersonDetailTab>('cadastro');
  const [academicSearchTerm, setAcademicSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bolsistaFilter, setBolsistaFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [pessoas, setPessoas] = useState<PessoaFisicaItem[]>(initialPessoas);
  const [selected, setSelected] = useState<PessoaFisicaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<PessoaFisicaItem>(emptyPessoa);

  const filtered = pessoas.filter(item => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = item.nome.toLowerCase().includes(query) || item.cpf.toLowerCase().includes(query) || item.email.toLowerCase().includes(query);
    const isBolsista = bolsasPorPessoa.some(bolsa => bolsa.pessoaId === item.id);
    const matchesBolsista = bolsistaFilter === 'Todos' || (bolsistaFilter === 'Sim' ? isBolsista : !isBolsista);
    const matchesStatus = statusFilter === 'Todos' || item.estado === statusFilter;
    return matchesSearch && matchesBolsista && matchesStatus;
  });

  const metrics = useMemo(() => ({
    total: pessoas.length,
    ativas: pessoas.filter(item => item.estado === 'Ativa').length,
    suspensas: pessoas.filter(item => item.estado === 'Suspensa').length,
    comLattes: pessoas.filter(item => item.lattes).length,
  }), [pessoas]);

  const openNew = () => {
    setDraft({ ...emptyPessoa, id: Date.now() });
    setSelected(null);
    setDetailTab('cadastro');
    setShowForm(true);
  };

  const openDetails = (item: PessoaFisicaItem) => {
    setDraft({ ...item });
    setSelected(item);
    setDetailTab('dashboard');
    setAcademicSearchTerm('');
    setShowForm(false);
  };

  const updateDraft = (field: keyof PessoaFisicaItem, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = () => {
    setPessoas(prev => {
      const exists = prev.some(item => item.id === draft.id);
      return exists ? prev.map(item => item.id === draft.id ? draft : item) : [...prev, draft];
    });
    setSelected(draft);
    setShowForm(false);
  };

  if (showForm || selected) {
    const projetos = selected ? projetosPorPessoa.filter(item => item.pessoaId === selected.id) : [];
    const bolsas = selected ? bolsasPorPessoa.filter(item => item.pessoaId === selected.id) : [];
    const vidaAcademica = selected ? vidaAcademicaPorPessoa.find(item => item.pessoaId === selected.id) : undefined;
    const eventosPremios = vidaAcademica ? [
      ...vidaAcademica.eventos.map(item => ({ ...item, tipoRegistro: 'Evento' })),
      ...vidaAcademica.premios.map(item => ({ ...item, tipoRegistro: 'Prêmio' })),
    ] : [];
    const totalProducoes = vidaAcademica
      ? vidaAcademica.artigos.length + vidaAcademica.livros.length + vidaAcademica.orientacoes.length + vidaAcademica.projetos.length + vidaAcademica.eventos.length + vidaAcademica.premios.length
      : 0;
    const curriculumSections = vidaAcademica ? [
      { id: 'artigos', label: 'Artigos', count: vidaAcademica.artigos.length },
      { id: 'orientacoes', label: 'Orientações', count: vidaAcademica.orientacoes.length },
      { id: 'projetos', label: 'Projetos', count: vidaAcademica.projetos.length },
      { id: 'formacao', label: 'Formação', count: vidaAcademica.formacoes.length },
      { id: 'livros', label: 'Livros', count: vidaAcademica.livros.length },
      { id: 'eventos-premios', label: 'Eventos e Prêmios', count: eventosPremios.length },
      { id: 'idiomas', label: 'Idiomas', count: vidaAcademica.idiomas.length },
    ] : [];
    const bolsasAtivas = bolsas.filter(item => item.status === 'Recebendo');
    const valorMensalAtivo = bolsasAtivas.reduce((total, item) => total + item.valorMensal, 0);

    return (
      <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">
          <Header
            title={showForm ? 'Criar Pessoa Física' : draft.nome}
            subtitle={showForm ? 'Cadastre pessoas físicas com CPF único, dados de contato e situação cadastral.' : 'Verifique as informações dessa Pessoa Física.'}
            onBack={() => { setShowForm(false); setSelected(null); }}
            breadcrumb={showForm ? ['Pessoa Física', 'Criar Pessoa'] : selected ? ['Pessoas Físicas', 'Detalhes'] : undefined}
          />

          {showForm && <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, margin: '-8px 0 28px' }} />}

          {selected && (
            <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.borderSubtle}`, marginBottom: '28px' }}>
              {[
                ['dashboard', 'Dashboard'],
                ['vidaAcademica', 'Lattes'],
                ['cadastro', 'Cadastro'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setDetailTab(id as PersonDetailTab)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: detailTab === id ? `2px solid ${T.accent}` : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: detailTab === id ? T.accent : T.textSecondary, cursor: 'pointer', marginBottom: '-1px' }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {selected && detailTab === 'dashboard' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <Metric label="Projetos vinculados" value={String(projetos.length)} color={T.accent} bg={T.accentSoft} />
                <Metric label="Bolsas recebidas" value={String(bolsas.length)} color={T.accent} bg={T.accentSoft} />
                <Metric label="Bolsas em andamento" value={String(bolsasAtivas.length)} color={T.accent} bg={T.accentSoft} />
                <Metric label="Valor mensal ativo" value={formatCurrency(valorMensalAtivo)} color={T.accent} bg={T.accentSoft} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <InfoCard title="Projetos em que a pessoa está presente" subtitle="Vínculos da pessoa com projetos captados.">
                  {projetos.length === 0 ? (
                    <EmptyState text="Nenhum projeto vinculado." />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {projetos.map((item, index) => (
                        <div key={`${item.nome}-${index}`} style={S.rowCard}>
                          <ListCell label="Projeto" value={item.nome} detail={item.programa} strong />
                          <ListCell label="Papel" value={item.papel} detail={`${item.inicio} a ${item.fim}`} />
                          <StatusBadge label="Status" value={item.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </InfoCard>

                <InfoCard title="Bolsas recebidas ou em recebimento" subtitle="Histórico e bolsas ativas associadas à pessoa.">
                  {bolsas.length === 0 ? (
                    <EmptyState text="Nenhuma bolsa registrada." />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {bolsas.map((item, index) => (
                        <div key={`${item.projeto}-${index}`} style={S.rowCard}>
                          <ListCell label="Bolsa" value={`${item.modalidade} · ${item.nivel}`} detail={item.projeto} strong />
                          <ListCell label="Valor mensal" value={formatCurrency(item.valorMensal)} detail={`${item.inicio} a ${item.fim}`} />
                          <StatusBadge label="Status" value={item.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </InfoCard>
              </div>
            </>
          )}

          {selected && detailTab === 'vidaAcademica' && (
            vidaAcademica ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <CurriculumHero pessoa={selected} curriculum={vidaAcademica} totalProducoes={totalProducoes} />

                <div style={{ ...S.card, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input type="text" placeholder="Buscar no Lattes por título, ano, participante ou instituição" value={academicSearchTerm} onChange={event => setAcademicSearchTerm(event.target.value)} style={{ ...S.input, paddingLeft: '38px' }} />
                      <Search size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                    {curriculumSections.map(item => (
                      <CurriculumAnchor key={item.id} href={`#curriculum-${item.id}`} label={item.label} count={item.count} />
                    ))}
                  </div>
                </div>

                <CurriculumDataSection id="artigos" title="Artigos" subtitle="Produções compartilhadas entre currículos de autores." items={vidaAcademica.artigos} searchTerm={academicSearchTerm} emptyText="Nenhum artigo encontrado." columns={['Título', 'Periódico', 'Ano']} gridTemplateColumns="minmax(320px, 1.5fr) minmax(220px, 1fr) 90px" getSearchText={item => `${item.titulo} ${item.periodico} ${item.ano} ${item.autores}`} renderRow={item => (
                  <>
                    <AcademicCell value={item.titulo} detail={item.autores} strong />
                    <AcademicCell value={item.periodico} />
                    <AcademicCell value={item.ano} />
                  </>
                )} />

                <CurriculumDataSection id="orientacoes" title="Orientações" subtitle="Orientações concluídas ou em andamento." items={vidaAcademica.orientacoes} searchTerm={academicSearchTerm} emptyText="Nenhuma orientação encontrada." columns={['Nível', 'Orientando', 'Instituição']} gridTemplateColumns="minmax(180px, 1fr) minmax(240px, 1fr) minmax(180px, 1fr)" getSearchText={item => `${item.nivel} ${item.orientando} ${item.instituicao} ${item.status}`} renderRow={item => (
                  <>
                    <AcademicCell value={item.nivel} detail={item.status} strong />
                    <AcademicCell value={item.orientando} />
                    <AcademicCell value={item.instituicao} />
                  </>
                )} />

                <CurriculumDataSection id="projetos" title="Projetos Acadêmicos" subtitle="Participações em projetos do currículo Lattes." items={vidaAcademica.projetos} searchTerm={academicSearchTerm} emptyText="Nenhum projeto acadêmico encontrado." columns={['Projeto', 'Papel', 'Status']} gridTemplateColumns="minmax(320px, 1.5fr) minmax(180px, 0.8fr) 130px" getSearchText={item => `${item.titulo} ${item.tipo} ${item.papel} ${item.periodo} ${item.status}`} renderRow={item => (
                  <>
                    <AcademicCell value={item.titulo} detail={item.tipo} strong />
                    <AcademicCell value={item.papel} detail={item.periodo} />
                    <AcademicCell value={item.status} />
                  </>
                )} />

                <CurriculumDataSection id="formacao" title="Formação Acadêmica" subtitle="Títulos importados do currículo." items={vidaAcademica.formacoes} searchTerm={academicSearchTerm} emptyText="Nenhuma formação encontrada." columns={['Nível', 'Curso', 'Período']} gridTemplateColumns="minmax(180px, 1fr) minmax(260px, 1fr) minmax(140px, 1fr)" getSearchText={item => `${item.nivel} ${item.curso} ${item.instituicao} ${item.periodo} ${item.status}`} renderRow={item => (
                  <>
                    <AcademicCell value={item.nivel} detail={item.status} strong />
                    <AcademicCell value={item.curso} detail={item.instituicao} />
                    <AcademicCell value={item.periodo} />
                  </>
                )} />

                <CurriculumDataSection id="livros" title="Livros e capítulos" subtitle="Produções bibliográficas em livros." items={vidaAcademica.livros} searchTerm={academicSearchTerm} emptyText="Nenhum livro encontrado." columns={['Título', 'Papel', 'Ano']} gridTemplateColumns="minmax(320px, 1.5fr) minmax(160px, 0.8fr) 90px" getSearchText={item => `${item.titulo} ${item.tipo} ${item.papel} ${item.ano}`} renderRow={item => (
                  <>
                    <AcademicCell value={item.titulo} detail={item.tipo} strong />
                    <AcademicCell value={item.papel} />
                    <AcademicCell value={item.ano} />
                  </>
                )} />

                <CurriculumDataSection id="eventos-premios" title="Eventos e Prêmios" subtitle="Participações, prêmios e reconhecimentos." items={eventosPremios} searchTerm={academicSearchTerm} emptyText="Nenhum evento ou prêmio encontrado." columns={['Registro', 'Detalhe', 'Ano']} gridTemplateColumns="minmax(300px, 1.3fr) minmax(220px, 1fr) 90px" getSearchText={item => `${item.tipoRegistro} ${item.nome} ${'local' in item ? item.local : item.entidade} ${item.ano}`} renderRow={item => {
                  if ('local' in item) {
                    return (
                      <>
                        <AcademicCell value={item.nome} detail="Evento" strong />
                        <AcademicCell value={item.papel} detail={item.local} />
                        <AcademicCell value={item.ano} />
                      </>
                    );
                  }
                  return (
                    <>
                        <AcademicCell value={item.nome} detail="Prêmio" strong />
                      <AcademicCell value={item.entidade} />
                      <AcademicCell value={item.ano} />
                    </>
                  );
                }} />

                <CurriculumDataSection id="idiomas" title="Idiomas" subtitle="Proficiência declarada no Lattes." items={vidaAcademica.idiomas} searchTerm={academicSearchTerm} emptyText="Nenhum idioma encontrado." columns={['Idioma', 'Leitura', 'Fala', 'Escrita']} gridTemplateColumns="minmax(180px, 1fr) repeat(3, minmax(120px, 0.7fr))" getSearchText={item => `${item.idioma} ${item.leitura} ${item.fala} ${item.escrita}`} renderRow={item => (
                  <>
                    <AcademicCell value={item.idioma} strong />
                    <AcademicCell value={item.leitura} />
                    <AcademicCell value={item.fala} />
                    <AcademicCell value={item.escrita} />
                  </>
                )} />
              </div>
            ) : (
              <InfoCard title="Lattes" subtitle="Dados importados do M024 a partir do currículo Lattes.">
                <EmptyState text="Nenhum currículo Lattes sincronizado para esta pessoa." />
              </InfoCard>
            )
          )}

          {(!selected || detailTab === 'cadastro') && (
            <>
              <FormSection number="1" title="Identificação" subtitle="Dados obrigatórios para identificar unicamente a pessoa.">
                <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '16px', marginBottom: '16px' }}>
                  <Field label="CPF" value={draft.cpf} onChange={value => updateDraft('cpf', maskCpf(value))} placeholder="000.000.000-00" />
                  <Field label="Nome completo" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Nome da pessoa" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr 0.6fr 0.5fr', gap: '16px' }}>
                  <Field label="Email" value={draft.email} onChange={value => updateDraft('email', value)} placeholder="email@dominio.com" />
                  <Field label="Telefone" value={draft.telefone} onChange={value => updateDraft('telefone', value)} placeholder="(00) 00000-0000" />
                  <Field label="Data de nascimento" value={draft.dataNascimento} onChange={value => updateDraft('dataNascimento', value)} placeholder="AAAA-MM-DD" />
                  <Select label="Status" value={draft.estado} onChange={value => updateDraft('estado', value)} options={['Ativa', 'Suspensa']} />
                </div>
              </FormSection>

              <FormSection number="2" title="Dados Acadêmicos" subtitle="Informações complementares">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <Field label="Currículo Lattes" value={draft.lattes} onChange={value => updateDraft('lattes', value)} placeholder="URL do currículo Lattes" />
                </div>
              </FormSection>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => { setShowForm(false); setSelected(null); }} style={S.secondaryButton}>Salvar Rascunho</button>
                  <button type="button" onClick={saveDraft} style={S.primaryButton}>
                    Ativar Pessoa
                  </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <PageHeader title="Pessoas Físicas" subtitle="Gerencie cadastros de pessoas, CPF único, situação e dados complementares." onBack={onBack} onAdd={openNew} addLabel="Criar Pessoa" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <Metric label="Total de pessoas" value={String(metrics.total)} color={T.accent} bg={T.accentSoft} />
            <Metric label="Ativas" value={String(metrics.ativas)} color={T.accent} bg={T.accentSoft} />
            <Metric label="Suspensas" value={String(metrics.suspensas)} color={T.accent} bg={T.accentSoft} />
            <Metric label="Com Lattes" value={String(metrics.comLattes)} color={T.accent} bg={T.accentSoft} />
        </div>

        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 180px 180px', gap: '16px', marginBottom: '24px', alignItems: 'end' }}>
              <div style={{ position: 'relative' }}>
                <label style={S.label}>Pesquisar</label>
                <input type="text" placeholder="Buscar" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} style={{ ...S.input, paddingRight: '36px' }} />
                <Search size={16} style={{ position: 'absolute', right: '12px', bottom: '12px', color: T.iconSubdued }} />
              </div>
              <Select label="Bolsista" value={bolsistaFilter} onChange={setBolsistaFilter} options={['Todos', 'Sim', 'Não']} />
              <Select label="Status" value={statusFilter} onChange={setStatusFilter} options={['Todos', 'Ativa', 'Suspensa']} />
            </div>

            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 12px' }}>
              Exibindo {filtered.length} resultados de {pessoas.length}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(item => (
                <button key={item.id} onClick={() => openDetails(item)} onMouseEnter={event => { event.currentTarget.style.backgroundColor = T.bgHover; }} onMouseLeave={event => { event.currentTarget.style.backgroundColor = T.bgCard; }} style={{ textAlign: 'left', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '18px 20px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.6fr 0.7fr 24px', gap: '18px', alignItems: 'center' }}>
                    <ListCell label="Pessoa" value={item.nome} strong />
                    <ListCell label="CPF" value={item.cpf} />
                    <ListCell label="Bolsista" value={bolsasPorPessoa.some(bolsa => bolsa.pessoaId === item.id) ? 'Sim' : 'Não'} />
                    <StatusPill estado={item.estado} />
                    <ChevronRight size={18} style={{ color: T.iconSubdued, justifySelf: 'end' }} />
                  </div>
                </button>
              ))}
            </div>
          </>
      </div>
    </div>
  );
};

const Header: React.FC<{ title: string; subtitle: string; onBack: () => void; breadcrumb?: [string, string] }> = ({ title, subtitle, onBack, breadcrumb }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ marginBottom: '28px' }}>
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', marginBottom: '0.75rem' }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, color: T.textSecondary, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
            {breadcrumb[0]}
          </button>
          <span style={{ color: T.textMuted }}>&gt;</span>
          <span style={{ color: T.textPrimary }}>{breadcrumb[1]}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} style={{ color: T.accent }} />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 8px' }}>{title}</h1>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const PageHeader: React.FC<{ title: string; subtitle: string; onBack: () => void; onAdd: () => void; addLabel: string }> = ({ title, subtitle, onBack, onAdd, addLabel }) => {
  const { T } = useThemeTokens();
  return (
    <>
      <div className="mb-6">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
              <UserRound size={18} style={{ color: T.accent }} />
            </div>
            <div style={{ flex: 1, marginTop: '6px' }}>
              <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, lineHeight: '1.5' }}>{title}</h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: '1.5' }}>{subtitle}</p>
            </div>
          </div>
          <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: T.accent, border: 'none', borderRadius: 'var(--radius)', padding: '10px 18px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: T.accentText, cursor: 'pointer', flexShrink: 0 }}>
            <Plus size={16} />
            {addLabel}
          </button>
        </div>
      </div>
    </>
  );
};

const FormSection: React.FC<{ number: string; title: string; subtitle: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={{ ...S.card, marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: T.accentSoft, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{number}</div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>{title}</h2>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const InfoCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={S.card}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>{title}</h2>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 18px' }}>{subtitle}</p>
      {children}
    </div>
  );
};

const CurriculumHero: React.FC<{ pessoa: PessoaFisicaItem; curriculum: VidaAcademicaPessoa; totalProducoes: number }> = ({ pessoa, curriculum, totalProducoes }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <section style={{ ...S.card, padding: '28px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <span style={{ border: `1px solid ${T.borderSubtle}`, backgroundColor: T.bgChip, borderRadius: '999px', padding: '5px 10px', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>Pesquisador</span>
          <span style={{ border: `1px solid ${curriculum.curriculoValido ? 'rgba(34,197,94,0.45)' : 'rgba(245,158,11,0.45)'}`, backgroundColor: curriculum.curriculoValido ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', borderRadius: '999px', padding: '5px 10px', color: curriculum.curriculoValido ? '#16a34a' : '#d97706', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
            {curriculum.curriculoValido ? 'Currículo válido' : 'Currículo desatualizado'}
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', lineHeight: 1.4, color: T.textPrimary, margin: '0 0 10px', fontWeight: 'var(--font-weight-medium)' }}>{pessoa.nome}</h2>
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, lineHeight: 1.6, margin: '0 0 18px' }}>
          {curriculum.titulacaoMaxima} em {curriculum.areaPrincipal}. Lattes sincronizado pelo M024, com produções, orientações, projetos e demais registros estruturados para consulta administrativa.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <HeroFact label="Link" value={curriculum.numeroLattes} />
          <HeroFact label="Última Sincronização" value={curriculum.ultimaSincronizacao} />
          <HeroFact label="Área Principal" value={curriculum.areaPrincipal} />
          <HeroFact label="Produções" value={String(totalProducoes)} />
        </div>
      </div>
    </section>
  );
};

const HeroFact: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted, padding: '12px' }}>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', lineHeight: 1.35, overflowWrap: 'anywhere' }}>{value}</div>
    </div>
  );
};

const CurriculumAnchor: React.FC<{ href: string; label: string; count: number }> = ({ href, label, count }) => {
  const { T } = useThemeTokens();
  return (
    <a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${T.accent}`, borderRadius: '999px', backgroundColor: T.accent, color: T.accentText, padding: '8px 11px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
      <span>{label}</span>
      <span style={{ minWidth: '28px', borderRadius: '999px', backgroundColor: T.accentText, color: T.accent, padding: '2px 7px', fontSize: 'var(--text-xs)', textAlign: 'center' }}>{count}</span>
    </a>
  );
};

const CurriculumDataSection = <TItem,>(props: {
  id: string;
  title: string;
  subtitle: string;
  emptyText: string;
  items: TItem[];
  searchTerm: string;
  columns: string[];
  gridTemplateColumns: string;
  getSearchText: (item: TItem) => string;
  renderRow: (item: TItem, index: number) => React.ReactNode;
}) => (
  <section id={`curriculum-${props.id}`} style={{ scrollMarginTop: '96px' }}>
    <AcademicDataPanel {...props} />
  </section>
);

const AcademicDataPanel = <TItem,>({
  title,
  subtitle,
  emptyText,
  items,
  searchTerm,
  columns,
  gridTemplateColumns,
  getSearchText,
  renderRow,
}: {
  title: string;
  subtitle: string;
  emptyText: string;
  items: TItem[];
  searchTerm: string;
  columns: string[];
  gridTemplateColumns: string;
  getSearchText: (item: TItem) => string;
  renderRow: (item: TItem, index: number) => React.ReactNode;
}) => {
  const { T } = useThemeTokens();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleItems = normalizedSearch
    ? items.filter(item => getSearchText(item).toLowerCase().includes(normalizedSearch))
    : items;

  return (
    <InfoCard title={title} subtitle={`${subtitle} ${visibleItems.length} de ${items.length} registros exibidos.`}>
      {visibleItems.length === 0 ? (
        <EmptyState text={emptyText} />
      ) : (
        <div style={{ border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: T.bgSurfaceMuted }}>
          <div style={{ display: 'grid', gridTemplateColumns, gap: '12px', padding: '10px 14px', borderBottom: `1px solid ${T.borderSubtle}`, backgroundColor: T.bgCard, position: 'sticky', top: 0, zIndex: 1 }}>
            {columns.map(column => (
              <div key={column} style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{column}</div>
            ))}
          </div>
          <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
            {visibleItems.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns, gap: '12px', padding: '12px 14px', borderBottom: index === visibleItems.length - 1 ? 'none' : `1px solid ${T.borderSubtle}`, alignItems: 'start' }}>
                {renderRow(item, index)}
              </div>
            ))}
          </div>
        </div>
      )}
    </InfoCard>
  );
};

const AcademicCell: React.FC<{ value: string; detail?: string; strong?: boolean }> = ({ value, detail, strong }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', lineHeight: 1.4, overflowWrap: 'anywhere' }}>{value || '-'}</div>
      {detail && <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginTop: '4px', lineHeight: 1.4, overflowWrap: 'anywhere' }}>{detail}</div>}
    </div>
  );
};

const EmptyState: React.FC<{ text: string }> = ({ text }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ border: `1px dashed ${T.borderDefault}`, borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textMuted }}>
      {text}
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div>
      <label style={S.label}>{label}</label>
      <input type="text" value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} style={S.input} />
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[] }> = ({ label, value, onChange, options }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        style={{
          ...S.input,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span>{value || 'Selecione'}</span>
        <ChevronDown size={16} style={{ color: T.iconSubdued, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100, boxShadow: T.shadowMd }}>
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: value === option ? T.accentSoft : 'transparent', color: value === option ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
              onMouseEnter={(event) => { if (value !== option) event.currentTarget.style.backgroundColor = T.bgHover; }}
              onMouseLeave={(event) => { if (value !== option) event.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; color: string; bg: string }> = ({ label, value, color, bg }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={S.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: bg, borderRadius: 'var(--radius)', flexShrink: 0 }}>
          <UserRound size={20} style={{ color }} />
        </div>
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>{label}</p>
      </div>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: T.textPrimary, textAlign: 'center', margin: 0 }}>{value}</p>
    </div>
  );
};

const ListCell: React.FC<{ label: string; value: string; detail?: string; strong?: boolean }> = ({ label, value, detail, strong }) => {
  const { T } = useThemeTokens();
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', lineHeight: 1.4 }}>{value || '-'}</div>
      {detail && <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginTop: '4px' }}>{detail}</div>}
    </div>
  );
};

const statusBadgeColor = (value: string) => {
  if (value === 'Recebendo' || value.toLowerCase() === 'em execução') return '#22c55e';
  if (value === 'Encerrada') return '#64748b';
  if (value === 'Suspenso') return '#f59e0b';
  return '#38bdf8';
};

const statusBadgeLabel = (value: string) => value.toLowerCase() === 'em execução' ? 'Em Execução' : value;

const StatusBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { T } = useThemeTokens();
  const color = statusBadgeColor(value);
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>{label}</div>
      <span style={{ display: 'inline-block', backgroundColor: `${color}20`, border: `1px solid ${color}`, borderRadius: '999px', padding: '3px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color }}>
        {statusBadgeLabel(value)}
      </span>
    </div>
  );
};

const StatusPill: React.FC<{ estado: EstadoPessoa }> = ({ estado }) => {
  const { T } = useThemeTokens();
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Status</div>
      <span style={{ display: 'inline-block', backgroundColor: `${estadoColor(estado)}20`, border: `1px solid ${estadoColor(estado)}`, borderRadius: '999px', padding: '3px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: estadoColor(estado) }}>
        {estado}
      </span>
    </div>
  );
};
