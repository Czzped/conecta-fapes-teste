import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2, DollarSign, FolderOpen, Handshake } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';
import { BackofficeDatePicker } from './BackofficeDatePicker';

interface Props {
  onBack: () => void;
  programaNome?: string;
}

interface Membro {
  id: number;
  nome: string;
}

interface AportePrograma {
  id: number;
  parceria: string;
  valor: string;
  dataAporte: string;
  estado: string;
  valorAlocado: number;
}

interface AditivoTempo {
  id: number;
  dataInicioAnterior: string;
  dataFimAnterior: string;
  novaDataInicio: string;
  novaDataFim: string;
  justificativa: string;
  solicitante: string;
  registradoEm: string;
}

interface RetiradaAporte {
  id: number;
  parceria: string;
  valor: string;
  valorAlocado: number;
  justificativa: string;
  solicitante: string;
  registradoEm: string;
  situacao: 'Retirado' | 'Bloqueado';
  impacto: string;
}

type ActiveTab = 'cadastro' | 'dashboard';

interface IniciativaAportada {
  codigo: string;
  nome: string;
  instituicaoExecutora: string;
  rubrica: string;
  valorAlocado: number;
  valorAportado: number;
  valorConsumido: number;
  situacao: string;
}

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '6px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '24px',
};

const dashboardCardStyle = (): React.CSSProperties => ({
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '20px',
});

const dashboardSectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: '#ffffff',
  fontWeight: 'var(--font-weight-medium)',
  margin: '0 0 6px',
};

const dashboardSectionSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.55)',
  margin: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: '#00c1af',
  margin: '0 0 20px',
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.5)',
  margin: '-12px 0 20px',
};

const dividerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  margin: '20px 0',
};

const addBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'transparent',
  border: '1px solid rgba(0,193,175,0.4)',
  borderRadius: 'var(--radius)',
  padding: '8px 14px',
  color: '#00c1af',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  cursor: 'pointer',
  transition: 'background-color 0.2s, border-color 0.2s',
};

const dangerIconButtonStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: 'var(--radius)',
  background: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
};

const maskCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const numberValue = Number(digits) / 100;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrency = (value: string) => Number(value.replace(/\./g, '').replace(',', '.')) || 0;

const formatCurrency = (value: number) => (
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
);

const formatPercent = (value: number) => `${value.toFixed(2).replace('.', ',')}%`;

const formatDate = (value: string) => {
  if (!value) return '-';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

export const DetalhesPrograma: React.FC<Props> = ({ onBack, programaNome }) => {
  const { T } = useThemeTokens();
  const [nome, setNome] = useState(programaNome || 'Programa de Pesquisa em Energia Renovável');
  const [instituicaoDemandante, setInstituicaoDemandante] = useState('FAPES - Fundação de Amparo à Pesquisa e Inovação do Espírito Santo');
  const [dataInicio, setDataInicio] = useState('2026-01-01');
  const [dataFim, setDataFim] = useState('2028-12-31');
  const [resumo, setResumo] = useState('Programa voltado ao fomento de projetos estratégicos de pesquisa, inovação e desenvolvimento tecnológico alinhados às prioridades institucionais da FAPES.');
  const [planejamento, setPlanejamento] = useState('Planejamento Estratégico 2026-2029');
  const [eixos, setEixos] = useState(['Ciência e Tecnologia', 'Inovação e Desenvolvimento']);
  const [membros, setMembros] = useState<Membro[]>([
    { id: 1, nome: 'Prof. Dr. Marcos Andrade' },
    { id: 2, nome: 'Dra. Fernanda Rocha' },
  ]);
  const [aportes, setAportes] = useState<AportePrograma[]>([
    { id: 1, parceria: 'Parceria Internacional - Universidade de Lisboa', valor: '2.400.000,00', dataAporte: '2026-02-15', estado: 'Em Execução', valorAlocado: 1400000 },
    { id: 2, parceria: 'Parceria FAPES-CAPES', valor: '1.250.000,00', dataAporte: '2026-03-10', estado: 'Em Execução', valorAlocado: 820000 },
  ]);
  const [showAditivoTempo, setShowAditivoTempo] = useState(false);
  const [novaDataInicio, setNovaDataInicio] = useState(dataInicio);
  const [novaDataFim, setNovaDataFim] = useState(dataFim);
  const [justificativaAditivo, setJustificativaAditivo] = useState('');
  const [erroAditivoTempo, setErroAditivoTempo] = useState('');
  const [aditivosTempo, setAditivosTempo] = useState<AditivoTempo[]>([]);
  const [aporteParaRetirada, setAporteParaRetirada] = useState<AportePrograma | null>(null);
  const [justificativaRetirada, setJustificativaRetirada] = useState('');
  const [erroRetirada, setErroRetirada] = useState('');
  const [retiradasAporte, setRetiradasAporte] = useState<RetiradaAporte[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('cadastro');

  const instituicoesOptions = [
    'FAPES - Fundação de Amparo à Pesquisa e Inovação do Espírito Santo',
    'UFES - Universidade Federal do Espírito Santo',
    'IFES - Instituto Federal do Espírito Santo',
    'SECTI - Secretaria de Ciência, Tecnologia, Inovação e Educação Profissional',
    'Fucape Business School',
  ];

  const planejamentoOptions = [
    'Planejamento Estratégico 2026-2029',
    'Planejamento Estratégico 2024-2027',
  ];

  const eixosOptions = [
    'Ciência e Tecnologia',
    'Inovação e Desenvolvimento',
    'Formação de Recursos Humanos',
    'Infraestrutura de Pesquisa',
  ];

  const parceriasOptions = [
    'Parceria FAPES-CAPES',
    'Parceria FAPES-CNPq',
    'Parceria Fapes-Ifes para Inovação',
    'Parceria Internacional - Universidade de Lisboa',
    'Parceria Internacional MIT',
  ];

  const pessoasOptions = [
    'Prof. Dr. Marcos Andrade',
    'Dra. Fernanda Rocha',
    'Prof. Eduardo Martins',
    'Dra. Carla Vasconcelos',
    'Prof. Dr. Ricardo Fontes',
    'Dra. Patrícia Lemos',
  ];

  const iniciativasAportadas: IniciativaAportada[] = [
    {
      codigo: 'INI-2026-001',
      nome: 'Pesquisa Aplicada em Saúde Digital',
      instituicaoExecutora: 'UFES',
      rubrica: 'Bolsas',
      valorAlocado: 480000,
      valorAportado: 420000,
      valorConsumido: 180000,
      situacao: 'Em execução',
    },
    {
      codigo: 'INI-2026-014',
      nome: 'Laboratório de Prototipagem para Inovação',
      instituicaoExecutora: 'IFES',
      rubrica: 'Capital',
      valorAlocado: 720000,
      valorAportado: 680000,
      valorConsumido: 320000,
      situacao: 'Em execução',
    },
    {
      codigo: 'INI-2026-022',
      nome: 'Rede de Formação em Inteligência Artificial',
      instituicaoExecutora: 'FAPES',
      rubrica: 'Bolsas',
      valorAlocado: 420000,
      valorAportado: 350000,
      valorConsumido: 95000,
      situacao: 'Planejada',
    },
    {
      codigo: 'INI-2026-031',
      nome: 'Plataforma de Dados para Políticas Públicas',
      instituicaoExecutora: 'SECTI',
      rubrica: 'Custeio',
      valorAlocado: 600000,
      valorAportado: 510000,
      valorConsumido: 410000,
      situacao: 'Em execução',
    },
  ];

  const toggleEixo = (eixo: string) => {
    setEixos(prev => prev.includes(eixo) ? prev.filter(item => item !== eixo) : [...prev, eixo]);
  };

  const addMembro = () => setMembros(prev => [...prev, { id: Date.now(), nome: '' }]);
  const removeMembro = (id: number) => setMembros(prev => prev.filter(membro => membro.id !== id));
  const updateMembro = (id: number, nomePessoa: string) => {
    setMembros(prev => prev.map(membro => membro.id === id ? { ...membro, nome: nomePessoa } : membro));
  };

  const addAporte = () => setAportes(prev => [...prev, { id: Date.now(), parceria: '', valor: '', dataAporte: '', estado: 'Em Execução', valorAlocado: 0 }]);
  const removeAporte = (id: number) => setAportes(prev => prev.filter(aporte => aporte.id !== id));
  const updateAporte = (id: number, field: keyof Omit<AportePrograma, 'id'>, value: string) => {
    setAportes(prev => prev.map(aporte => aporte.id === id ? { ...aporte, [field]: value } : aporte));
  };

  const totalAportado = aportes.reduce((total, aporte) => total + parseCurrency(aporte.valor), 0);
  const totalInvestidoPrograma = totalAportado;
  const totalAlocadoIniciativas = iniciativasAportadas.reduce((total, iniciativa) => total + iniciativa.valorAlocado, 0);
  const totalAportadoIniciativas = iniciativasAportadas.reduce((total, iniciativa) => total + iniciativa.valorAportado, 0);
  const totalConsumidoIniciativas = iniciativasAportadas.reduce((total, iniciativa) => total + iniciativa.valorConsumido, 0);
  const saldoDisponivelPrograma = totalInvestidoPrograma - totalAlocadoIniciativas;
  const percentualAlocadoPrograma = totalInvestidoPrograma > 0 ? (totalAlocadoIniciativas / totalInvestidoPrograma) * 100 : 0;
  const percentualAportadoPrograma = totalAlocadoIniciativas > 0 ? (totalAportadoIniciativas / totalAlocadoIniciativas) * 100 : 0;
  const percentualConsumidoPrograma = totalAportadoIniciativas > 0 ? (totalConsumidoIniciativas / totalAportadoIniciativas) * 100 : 0;
  const rubricasDashboard = iniciativasAportadas.reduce<Record<string, { alocado: number; aportado: number; consumido: number }>>((acc, iniciativa) => {
    if (!acc[iniciativa.rubrica]) acc[iniciativa.rubrica] = { alocado: 0, aportado: 0, consumido: 0 };
    acc[iniciativa.rubrica].alocado += iniciativa.valorAlocado;
    acc[iniciativa.rubrica].aportado += iniciativa.valorAportado;
    acc[iniciativa.rubrica].consumido += iniciativa.valorConsumido;
    return acc;
  }, {});
  const parceriasDashboard = aportes.map(aporte => {
    const investido = parseCurrency(aporte.valor);
    const alocado = aporte.valorAlocado;
    const proporcaoAlocada = totalAlocadoIniciativas > 0 ? alocado / totalAlocadoIniciativas : 0;
    const aportado = totalAportadoIniciativas * proporcaoAlocada;
    const consumido = totalConsumidoIniciativas * proporcaoAlocada;
    const saldo = Math.max(investido - alocado, 0);
    return {
      parceria: aporte.parceria || 'Parceria não informada',
      investido,
      alocado,
      aportado,
      consumido,
      saldo,
      percentualAlocado: investido > 0 ? (alocado / investido) * 100 : 0,
      percentualAportado: alocado > 0 ? (aportado / alocado) * 100 : 0,
      percentualConsumido: aportado > 0 ? (consumido / aportado) * 100 : 0,
    };
  });
  const vigenciaMaximaParcerias = '2028-12-31';

  const abrirAditivoTempo = () => {
    setNovaDataInicio(dataInicio);
    setNovaDataFim(dataFim);
    setJustificativaAditivo('');
    setErroAditivoTempo('');
    setShowAditivoTempo(true);
  };

  const registrarAditivoTempo = () => {
    if (!justificativaAditivo.trim()) {
      setErroAditivoTempo('Informe a justificativa do aditivo de tempo.');
      return;
    }

    if (!novaDataInicio || !novaDataFim) {
      setErroAditivoTempo('Informe a nova data de início e a nova data de fim.');
      return;
    }

    if (novaDataFim > vigenciaMaximaParcerias) {
      setErroAditivoTempo('A nova data de fim extrapola a vigência das parcerias aportantes.');
      return;
    }

    setAditivosTempo(prev => [
      ...prev,
      {
        id: Date.now(),
        dataInicioAnterior: dataInicio,
        dataFimAnterior: dataFim,
        novaDataInicio,
        novaDataFim,
        justificativa: justificativaAditivo,
        solicitante: instituicaoDemandante,
        registradoEm: new Date().toLocaleDateString('pt-BR'),
      },
    ]);
    setDataInicio(novaDataInicio);
    setDataFim(novaDataFim);
    setShowAditivoTempo(false);
    setErroAditivoTempo('');
  };

  const abrirRetiradaAporte = (aporte: AportePrograma) => {
    setAporteParaRetirada(aporte);
    setJustificativaRetirada('');
    setErroRetirada('');
  };

  const cancelarRetiradaAporte = () => {
    setAporteParaRetirada(null);
    setJustificativaRetirada('');
    setErroRetirada('');
  };

  const confirmarRetiradaAporte = () => {
    if (!aporteParaRetirada) return;

    if (!justificativaRetirada.trim()) {
      setErroRetirada('Informe a justificativa da retirada do aporte.');
      return;
    }

    if (aporteParaRetirada.valorAlocado > 0) {
      setRetiradasAporte(prev => [
        ...prev,
        {
          id: Date.now(),
          parceria: aporteParaRetirada.parceria,
          valor: aporteParaRetirada.valor,
          valorAlocado: aporteParaRetirada.valorAlocado,
          justificativa: justificativaRetirada,
          solicitante: instituicaoDemandante,
          registradoEm: new Date().toLocaleDateString('pt-BR'),
          situacao: 'Bloqueado',
          impacto: 'Existem projetos ou execuções vinculadas ao aporte. Cancele, reduza ou realoque os projetos afetados antes de retirar o recurso.',
        },
      ]);
      setErroRetirada('Retirada bloqueada: o aporte já possui valor alocado em projetos.');
      return;
    }

    setAportes(prev => prev.filter(aporte => aporte.id !== aporteParaRetirada.id));
    setRetiradasAporte(prev => [
      ...prev,
      {
        id: Date.now(),
        parceria: aporteParaRetirada.parceria,
        valor: aporteParaRetirada.valor,
        valorAlocado: 0,
        justificativa: justificativaRetirada,
        solicitante: instituicaoDemandante,
        registradoEm: new Date().toLocaleDateString('pt-BR'),
        situacao: 'Retirado',
        impacto: 'Aporte retirado do Programa e saldo devolvido para a Parceria aportante.',
      },
    ]);
    cancelarRetiradaAporte();
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
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
            Programa
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
            Detalhes
          </span>
        </div>

        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                flexShrink: 0,
                backgroundColor: T.accentSoft,
                borderRadius: 'var(--radius)',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.25)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = T.accentSoft}
            >
              <FolderOpen size={18} style={{ color: T.accent }} />
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
                {nome}
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                Edite as informações do programa e mantenha a rastreabilidade dos aportes e da governança.
              </p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '24px',
        }}>
          {[
            { id: 'cadastro' as ActiveTab, label: 'Informações Gerais' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #00c1af' : '2px solid transparent',
                color: activeTab === tab.id ? '#00c1af' : 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '0 4px 12px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'cadastro' && (
          <>
        <div style={cardStyle}>
          <SectionTitle number="1" title="Identificação do Programa" />
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Nome" value={nome} onChange={setNome} placeholder="Nome do programa" />
              <Select label="Instituição Demandante" value={instituicaoDemandante} onChange={setInstituicaoDemandante} options={instituicoesOptions} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <DateField label="Data de Início" value={dataInicio} onChange={setDataInicio} />
              <DateField label="Data de Fim" value={dataFim} onChange={setDataFim} />
            </div>

            <TextArea label="Resumo" value={resumo} onChange={setResumo} rows={4} />

            <Select label="Planejamento Estratégico" value={planejamento} onChange={setPlanejamento} options={planejamentoOptions} />

            <div style={dividerStyle} />

            <div>
              <label style={labelStyle}>Eixos Estratégicos</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {eixosOptions.map(eixo => (
                  <button
                    key={eixo}
                    type="button"
                    onClick={() => toggleEixo(eixo)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: eixos.includes(eixo) ? 'rgba(0,193,175,0.08)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      flexShrink: 0,
                      border: eixos.includes(eixo) ? '2px solid #00c1af' : '2px solid rgba(255,255,255,0.25)',
                      backgroundColor: eixos.includes(eixo) ? '#00c1af' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {eixos.includes(eixo) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: eixos.includes(eixo) ? '#00c1af' : 'rgba(255,255,255,0.8)' }}>
                      {eixo}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {aporteParaRetirada && (
          <div style={{ ...cardStyle, borderColor: aporteParaRetirada.valorAlocado > 0 ? 'rgba(239,68,68,0.35)' : 'rgba(0,193,175,0.28)' }}>
            <h2 style={sectionTitleStyle}>Retirar Aporte de Parceria do Programa</h2>
            <p style={sectionSubtitleStyle}>
              A retirada direta só é permitida quando o valor ainda não foi alocado em projetos ou execuções vinculadas.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.7fr 0.7fr 0.7fr', gap: '16px', marginBottom: '16px' }}>
              <ReadOnlyInfo label="Parceria aportante" value={aporteParaRetirada.parceria} />
              <ReadOnlyInfo label="Valor do aporte" value={formatCurrency(parseCurrency(aporteParaRetirada.valor))} />
              <ReadOnlyInfo label="Valor já alocado" value={formatCurrency(aporteParaRetirada.valorAlocado)} />
              <ReadOnlyInfo label="Situação" value={aporteParaRetirada.valorAlocado > 0 ? 'Retirada bloqueada' : 'Retirada permitida'} />
            </div>

            {aporteParaRetirada.valorAlocado > 0 && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(239,68,68,0.08)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: '#fca5a5',
                lineHeight: 1.5,
              }}>
                Este aporte já possui valor alocado. Para concluir a retirada, os projetos afetados devem ser cancelados, reduzidos ou realocados antes da confirmação.
              </div>
            )}

            <TextArea
              label="Justificativa"
              value={justificativaRetirada}
              onChange={setJustificativaRetirada}
              rows={4}
            />

            {erroRetirada && (
              <div style={{
                marginTop: '14px',
                padding: '10px 12px',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(239,68,68,0.08)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: '#fca5a5',
              }}>
                {erroRetirada}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={cancelarRetiradaAporte}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 16px',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.75)',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarRetiradaAporte}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: aporteParaRetirada.valorAlocado > 0 ? '#f97316' : '#ef4444',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '10px 16px',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#171717',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={15} />
                {aporteParaRetirada.valorAlocado > 0 ? 'Registrar Bloqueio' : 'Confirmar Retirada'}
              </button>
            </div>
          </div>
        )}

        {retiradasAporte.length > 0 && (
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Histórico de Retiradas de Aporte</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {retiradasAporte.map(retirada => (
                <div key={retirada.id} style={{
                  backgroundColor: 'rgba(23, 23, 23,0.5)',
                  border: retirada.situacao === 'Bloqueado' ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.7fr 0.7fr 0.7fr', gap: '16px', marginBottom: '12px' }}>
                    <ReadOnlyInfo label="Parceria aportante" value={retirada.parceria} />
                    <ReadOnlyInfo label="Valor" value={formatCurrency(parseCurrency(retirada.valor))} />
                    <ReadOnlyInfo label="Valor alocado" value={formatCurrency(retirada.valorAlocado)} />
                    <ReadOnlyInfo label="Situação" value={retirada.situacao} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                    <ReadOnlyInfo label="Solicitante" value={retirada.solicitante} />
                    <ReadOnlyInfo label="Registrado em" value={retirada.registradoEm} />
                  </div>
                  <ReadOnlyInfo label="Impacto" value={retirada.impacto} />
                  <div style={{ marginTop: '12px' }}>
                    <ReadOnlyInfo label="Justificativa" value={retirada.justificativa} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <SectionTitle number="2" title="Aporte Financeiro" />
          <p style={sectionSubtitleStyle}>Ajuste os aportes vinculados ao programa por parceria.</p>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
            {aportes.map((aporte, idx) => (
              <div key={aporte.id}>
                {idx > 0 && <div style={dividerStyle} />}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1.3fr) minmax(140px, 0.6fr) minmax(130px, 0.55fr) minmax(130px, 0.55fr) minmax(110px, 0.45fr) auto', gap: '12px', alignItems: 'end' }}>
                  <Select label="Parceria aportante" value={aporte.parceria} onChange={value => updateAporte(aporte.id, 'parceria', value)} options={parceriasOptions} />
                  <Field
                    label="Valor aportado (R$)"
                    value={aporte.valor}
                    onChange={value => updateAporte(aporte.id, 'valor', maskCurrency(value))}
                    placeholder="0,00"
                  />
                  <DateField label="Data do aporte" value={aporte.dataAporte} onChange={value => updateAporte(aporte.id, 'dataAporte', value)} />
                  <ReadOnlyField label="Alocado em Projetos" value={formatCurrency(aporte.valorAlocado)} />
                  <Select label="Status" value={aporte.estado} onChange={value => updateAporte(aporte.id, 'estado', value)} options={['Em Execução', 'Suspenso', 'Encerrado']} />
                  {aportes.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeAporte(aporte.id)}
                      style={dangerIconButtonStyle}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
                    </button>
                  ) : (
                    <div style={{ width: '36px' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
                Total aportado no programa
              </span>
              <span style={{ display: 'block', marginTop: '4px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
                {formatCurrency(totalAportado)}
              </span>
            </div>
            <button
              type="button"
              onClick={addAporte}
              style={addBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
            >
              <Plus size={14} />
              Adicionar Parceria
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <SectionTitle number="3" title="Comitê de Governança" />
          <p style={sectionSubtitleStyle}>Informe as pessoas que compõem o comitê do programa.</p>
          <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
            {membros.map(membro => (
              <div key={membro.id} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                <Select label="Pessoa do Comitê" value={membro.nome} onChange={value => updateMembro(membro.id, value)} options={pessoasOptions} />
                {membros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMembro(membro.id)}
                    style={dangerIconButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addMembro}
              style={addBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
            >
              <Plus size={14} />
              Adicionar Pessoa
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            style={{
              backgroundColor: '#00c1af',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '11px 20px',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: '#171717',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a99a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
          >
            Salvar Alterações
          </button>
        </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <Metric label="Total Investido" value={formatCurrency(totalInvestidoPrograma)} detail="Recursos das parcerias" Icon={DollarSign} />
              <Metric label="Total Aportado" value={formatCurrency(totalAportadoIniciativas)} detail={`${formatPercent(percentualAportadoPrograma)} do alocado`} Icon={Handshake} />
              <Metric label="Total Alocado" value={formatCurrency(totalAlocadoIniciativas)} detail={`${formatPercent(percentualAlocadoPrograma)} do investido`} Icon={FolderOpen} />
              <Metric label="Total Consumido" value={formatCurrency(totalConsumidoIniciativas)} detail={`${formatPercent(percentualConsumidoPrograma)} do aportado`} Icon={DollarSign} />
              <Metric label="Saldo disponível" value={formatCurrency(saldoDisponivelPrograma)} detail={`${formatPercent(totalInvestidoPrograma > 0 ? (saldoDisponivelPrograma / totalInvestidoPrograma) * 100 : 0)} do investido`} Icon={DollarSign} />
            </div>

            <div style={dashboardCardStyle()}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={dashboardSectionTitleStyle}>Consumo por parceria aportante</h2>
                  <p style={dashboardSectionSubtitleStyle}>
                    Como o investimento recebido de cada parceria está sendo alocado, aportado, consumido e ainda possui disponível.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {parceriasDashboard.map(parceria => (
                  <div key={parceria.parceria} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.35)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                      <ListCell label="Parceria" value={parceria.parceria} strong />
                      <ListCell label="Aportado" value={formatCurrency(parceria.aportado)} strong detail={`${formatPercent(parceria.percentualAportado)} do alocado`} />
                      <ListCell label="Alocado" value={formatCurrency(parceria.alocado)} strong detail={`${formatPercent(parceria.percentualAlocado)} do investido`} />
                      <ListCell label="Consumido" value={formatCurrency(parceria.consumido)} strong detail={`${formatPercent(parceria.percentualConsumido)} do aportado`} />
                      <ListCell label="Disponível" value={formatCurrency(parceria.saldo)} strong detail={`${formatPercent(parceria.investido > 0 ? (parceria.saldo / parceria.investido) * 100 : 0)} do investido`} />
                    </div>
                    <div style={{ height: '6px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(parceria.percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...dashboardCardStyle(), marginTop: '24px' }}>
              <h2 style={dashboardSectionTitleStyle}>Consumo por rubrica</h2>
              <p style={{ ...dashboardSectionSubtitleStyle, margin: '0 0 20px' }}>
                Somatória das rubricas dos projetos aportados pelo programa.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(rubricasDashboard).map(([rubrica, valores]) => {
                  const percentualAlocado = totalAlocadoIniciativas > 0 ? (valores.alocado / totalAlocadoIniciativas) * 100 : 0;
                  const percentualAportado = valores.alocado > 0 ? (valores.aportado / valores.alocado) * 100 : 0;
                  const percentualConsumido = valores.aportado > 0 ? (valores.consumido / valores.aportado) * 100 : 0;
                  return (
                    <div key={rubrica} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.35)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                        <ListCell label="Rubrica" value={rubrica} strong />
                        <ListCell label="Aportado" value={formatCurrency(valores.aportado)} strong detail={`${formatPercent(percentualAportado)} do alocado`} />
                        <ListCell label="Alocado" value={formatCurrency(valores.alocado)} strong detail={`${formatPercent(percentualAlocado)} do total`} />
                        <ListCell label="Consumido" value={formatCurrency(valores.consumido)} strong detail={`${formatPercent(percentualConsumido)} da rubrica`} />
                        <ListCell label="Disponível" value={formatCurrency(valores.alocado - valores.aportado)} strong detail={`${formatPercent(valores.alocado > 0 ? ((valores.alocado - valores.aportado) / valores.alocado) * 100 : 0)} da rubrica`} />
                      </div>
                      <div style={{ height: '6px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ ...dashboardCardStyle(), marginTop: '24px' }}>
              <h2 style={dashboardSectionTitleStyle}>Projetos aportados</h2>
              <p style={{ ...dashboardSectionSubtitleStyle, margin: '0 0 20px' }}>
                Projetos que receberam recursos deste programa, com visão de consumo e saldo.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {iniciativasAportadas.map(iniciativa => {
                  const saldo = iniciativa.valorAportado - iniciativa.valorConsumido;
                  const percentualConsumido = iniciativa.valorAportado > 0
                    ? (iniciativa.valorConsumido / iniciativa.valorAportado) * 100
                    : 0;

                  return (
                    <div key={iniciativa.codigo} style={{ padding: '16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(23, 23, 23,0.35)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '16px', alignItems: 'start', marginBottom: '14px' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                            {iniciativa.codigo}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', lineHeight: 1.4 }}>
                            {iniciativa.nome}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
                            {iniciativa.situacao}
                          </div>
                        </div>
                        <ListCell label="Instituição" value={iniciativa.instituicaoExecutora} />
                        <ListCell label="Aportado" value={formatCurrency(iniciativa.valorAportado)} strong />
                        <ListCell label="Consumido" value={formatCurrency(iniciativa.valorConsumido)} strong detail={`${formatPercent(percentualConsumido)} do projeto`} />
                        <ListCell label="Disponível" value={formatCurrency(saldo)} strong detail={`${formatPercent(iniciativa.valorAportado > 0 ? (saldo / iniciativa.valorAportado) * 100 : 0)} do projeto`} />
                      </div>
                      <div style={{ height: '6px', width: '100%', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(percentualConsumido, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={event => onChange(event.target.value)}
      style={inputStyle}
      onFocus={event => event.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
      onBlur={event => event.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
    />
  </div>
);

const ReadOnlyField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div
      style={{
        ...inputStyle,
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        lineHeight: '1.5',
        pointerEvents: 'none',
      }}
    >
      {value || '-'}
    </div>
  </div>
);

const DateField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <BackofficeDatePicker
      value={value}
      onChange={onChange}
      style={inputStyle}
      onFocus={event => event.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
      onBlur={event => event.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
    />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[] }> = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        style={{
          ...inputStyle,
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span>{value || 'Selecione...'}</span>
        <ChevronRight size={15} style={{ color: 'rgba(255,255,255,0.45)', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', zIndex: 40, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', backgroundColor: '#262626', boxShadow: '0 16px 32px rgba(0,0,0,0.36)' }}>
          {options.map(option => (
            <button
              key={option}
              type="button"
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '11px 14px',
                border: 'none',
                backgroundColor: value === option ? 'rgba(0,193,175,0.12)' : 'transparent',
                color: value === option ? '#00c1af' : '#ffffff',
                textAlign: 'left',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TextArea: React.FC<{ label: string; value: string; onChange: (value: string) => void; rows?: number }> = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      value={value}
      rows={rows}
      onChange={event => onChange(event.target.value)}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
      onFocus={event => event.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
      onBlur={event => event.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
    />
  </div>
);

const ReadOnlyInfo: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span style={{ ...labelStyle, fontSize: 'var(--text-xs)', marginBottom: '4px' }}>{label}</span>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', margin: 0, lineHeight: 1.5 }}>
      {value || '-'}
    </p>
  </div>
);

const Metric: React.FC<{
  label: string;
  value: string;
  detail?: string;
  Icon?: React.ElementType;
  color?: string;
  bg?: string;
}> = ({ label, value, detail, Icon }) => (
  <div style={dashboardCardStyle()}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      {Icon && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(0,193,175,0.12)', borderRadius: 'var(--radius)', flexShrink: 0 }}>
          <Icon size={20} style={{ color: '#00c1af' }} />
        </div>
      )}
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
        {label}
      </p>
    </div>
    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: '#ffffff', textAlign: 'center', margin: 0 }}>
      {value}
    </span>
    {detail && (
      <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: '6px 0 0' }}>
        {detail}
      </span>
    )}
  </div>
);

const SectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>{number}</span>
    </div>
    <p style={{ ...sectionTitleStyle, margin: 0 }}>{title}</p>
  </div>
);

const ListCell: React.FC<{ label: string; value: string; detail?: string; strong?: boolean; highlight?: boolean }> = ({ label, value, detail, strong, highlight }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{label}</div>
    <div style={{
      fontFamily: 'var(--font-family)',
      fontSize: 'var(--text-sm)',
      color: highlight ? '#22c55e' : strong ? '#ffffff' : 'rgba(255,255,255,0.75)',
      fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
      lineHeight: 1.4,
    }}>
      {value || '-'}
    </div>
    {detail && (
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
        {detail}
      </div>
    )}
  </div>
);

const ProgressRow: React.FC<{ label: string; value: number; detail: string }> = ({ label, value, detail }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
      <div>
        <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', marginBottom: '2px' }}>
          {label}
        </span>
        <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}>
          {detail}
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', whiteSpace: 'nowrap' }}>
        {value.toFixed(2).replace('.', ',')}%
      </span>
    </div>
    <div style={{ width: '100%', height: '9px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', borderRadius: '999px', backgroundColor: '#00c1af' }} />
    </div>
  </div>
);
