import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Lightbulb, Box, Users, GraduationCap, HelpCircle, Plus, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DatePicker } from './DatePicker';

interface InscricaoEditalFlowProps {
  edital: {
    id: number;
    numero: string;
    titulo: string;
  };
  onBack: () => void;
}

export function InscricaoEditalFlow({ edital, onBack }: InscricaoEditalFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state for Informações
  const [programaRelacionado, setProgramaRelacionado] = useState('');
  const [eixoEstrategico, setEixoEstrategico] = useState('');
  const [areasTematicas, setAreasTematicas] = useState<string[]>([]);
  const [tipoProjeto, setTipoProjeto] = useState<string[]>([]);
  const [classificacaoInovacao, setClassificacaoInovacao] = useState<string[]>([]);

  // Form state for Informações
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [coordenadorCPF, setCoordenadorCPF] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Form state for Detalhamento
  const [escopoProjeto, setEscopoProjeto] = useState('');
  const [avancoCtei, setAvancoCtei] = useState('');

  // Form state for Resultados
  const [tipoResultado, setTipoResultado] = useState('');
  const [descricaoResultado, setDescricaoResultado] = useState('');

  // Form state for Objetivos
  const [objetivoGeral, setObjetivoGeral] = useState('');
  const [objetivosEspecificos, setObjetivosEspecificos] = useState('');

  // Form state for Riscos
  const [risco, setRisco] = useState('');
  const [classificacaoRisco, setClassificacaoRisco] = useState('');
  const [planoMitigacao, setPlanoMitigacao] = useState('');
  const [restricoes, setRestricoes] = useState('');
  const [viabilidade, setViabilidade] = useState('');

  // Form state for Benefícios
  const [indicador, setIndicador] = useState('');
  const [unidade, setUnidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [fonteVerificacao, setFonteVerificacao] = useState('');

  // Form state for Equipe
  const [equipeMembers, setEquipeMembers] = useState([
    { id: 1, cpf: '', funcao: '', bolsa: '' }
  ]);

  const [capitalItems, setCapitalItems] = useState([
    { id: 1, categoria: '', item: '', quantidade: '', justificativa: '', valorTotal: '' }
  ]);

  const [cronogramaItems, setCronogramaItems] = useState<{ objetivo: string; mesInicio: string; mesFim: string }[]>([]);

  const steps = [
    { number: 1, label: 'Informações' },
    { number: 2, label: 'Resultados' },
    { number: 3, label: 'Objetivos' },
    { number: 4, label: 'Riscos' },
    { number: 5, label: 'Benefícios' },
    { number: 6, label: 'Equipe' },
    { number: 7, label: 'Capital' },
    { number: 8, label: 'Cronograma' },
    { number: 9, label: 'Revisão' },
  ];

  const toggleAreaTematica = (area: string) => {
    if (areasTematicas.includes(area)) {
      setAreasTematicas(areasTematicas.filter((a) => a !== area));
    } else {
      setAreasTematicas([...areasTematicas, area]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Equipe functions
  const addEquipeMember = () => {
    const newId = Math.max(...equipeMembers.map(m => m.id)) + 1;
    setEquipeMembers([...equipeMembers, { id: newId, cpf: '', funcao: '', bolsa: '' }]);
  };

  const removeEquipeMember = (id: number) => {
    if (equipeMembers.length > 1) {
      setEquipeMembers(equipeMembers.filter(m => m.id !== id));
    }
  };

  const updateEquipeMember = (id: number, field: 'cpf' | 'funcao' | 'bolsa', value: string) => {
    setEquipeMembers(equipeMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleBuscarMembro = (id: number) => {
    // Função para buscar membro por CPF
    console.log('Buscar membro:', equipeMembers.find(m => m.id === id)?.cpf);
  };

  // Capital functions
  const addCapitalItem = () => {
    const newId = Math.max(...capitalItems.map(c => c.id)) + 1;
    setCapitalItems([...capitalItems, { id: newId, categoria: '', item: '', quantidade: '', justificativa: '', valorTotal: '' }]);
  };

  const removeCapitalItem = (id: number) => {
    if (capitalItems.length > 1) {
      setCapitalItems(capitalItems.filter(c => c.id !== id));
    }
  };

  const updateCapitalItem = (id: number, field: 'categoria' | 'item' | 'quantidade' | 'justificativa' | 'valorTotal', value: string) => {
    setCapitalItems(capitalItems.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Cronograma functions
  const updateCronogramaItem = (index: number, field: 'mesInicio' | 'mesFim', value: string) => {
    const updated = [...cronogramaItems];
    updated[index] = { ...updated[index], [field]: value };
    setCronogramaItems(updated);
  };

  // Inicializar cronograma quando entrar no step 10
  const initializeCronograma = () => {
    if (cronogramaItems.length === 0 && objetivosEspecificos) {
      // Dividir os objetivos específicos por linha
      const objetivosArray = objetivosEspecificos
        .split('\n')
        .filter(obj => obj.trim() !== '');
      
      if (objetivosArray.length > 0) {
        const items = objetivosArray.map(obj => ({
          objetivo: obj.trim(),
          mesInicio: '',
          mesFim: ''
        }));
        setCronogramaItems(items);
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        programaRelacionado &&
        eixoEstrategico &&
        areasTematicas.length > 0 &&
        tipoProjeto.length > 0 &&
        classificacaoInovacao.length > 0 &&
        nomeProjeto &&
        coordenadorCPF &&
        dataInicio &&
        dataFim &&
        escopoProjeto.length >= 50 &&
        avancoCtei.length >= 30
      );
    }
    if (currentStep === 2) {
      return (
        tipoResultado &&
        descricaoResultado
      );
    }
    if (currentStep === 3) {
      return (
        objetivoGeral &&
        objetivosEspecificos
      );
    }
    if (currentStep === 4) {
      return (
        risco &&
        classificacaoRisco &&
        restricoes &&
        viabilidade
      );
    }
    if (currentStep === 5) {
      return (
        indicador &&
        unidade &&
        quantidade
      );
    }
    if (currentStep === 6) {
      return equipeMembers.every(m => m.cpf && m.funcao && m.bolsa);
    }
    if (currentStep === 7) {
      return capitalItems.every(c => c.categoria && c.justificativa && c.valorTotal);
    }
    if (currentStep === 8) {
      return cronogramaItems.every(c => c.mesInicio && c.mesFim);
    }
    return true;
  };

  // Inicializar cronograma quando entrar no step 8
  useEffect(() => {
    if (currentStep === 8) {
      initializeCronograma();
    }
  }, [currentStep]);

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors"
          style={{
            color: 'var(--primary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {edital.numero}
          </div>
          <div
            style={{
              color: 'var(--primary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              marginTop: '2px',
            }}
          >
            Etapa {currentStep} de {steps.length}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {currentStep === 1 && (
        <div>
          {/* Title */}
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Informações
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Defina a origem da demanda e o alinhamento estratégico do projeto
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Programa Relacionado & Eixo Estratégico - Side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Programa Relacionado */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Programa Relacionado <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={programaRelacionado}
                  onChange={(e) => setProgramaRelacionado(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="Inovação Tecnológica 2024">Inovação Tecnológica 2024</option>
                  <option value="Pesquisa Aplicada 2024">Pesquisa Aplicada 2024</option>
                  <option value="Desenvolvimento Regional 2024">Desenvolvimento Regional 2024</option>
                </select>
              </div>

              {/* Eixo Estratégico */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Eixo Estratégico <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={eixoEstrategico}
                  onChange={(e) => setEixoEstrategico(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="Desenvolvimento de Software">Desenvolvimento de Software</option>
                  <option value="Infraestrutura Tecnológica">Infraestrutura Tecnológica</option>
                  <option value="Ciência de Dados">Ciência de Dados</option>
                  <option value="Inovação Digital">Inovação Digital</option>
                </select>
              </div>
            </div>

            {/* Áreas Temáticas */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Áreas Temáticas <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  {
                    id: 'ia',
                    titulo: 'Inteligência Artificial',
                    descricao: 'Projetos de IA e ML',
                  },
                  {
                    id: 'blockchain',
                    titulo: 'Blockchain',
                    descricao: 'Tecnologias de registro distribuído',
                  },
                  {
                    id: 'iot',
                    titulo: 'Internet das Coisas',
                    descricao: 'Dispositivos conectados e automação',
                  },
                  {
                    id: 'cloud',
                    titulo: 'Computação em Nuvem',
                    descricao: 'Infraestrutura e serviços cloud',
                  },
                ].map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleAreaTematica(area.id)}
                    className="text-left p-4 transition-all"
                    style={{
                      backgroundColor: areasTematicas.includes(area.id)
                        ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                        : 'transparent',
                      border: areasTematicas.includes(area.id)
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={areasTematicas.includes(area.id)}
                        onChange={() => {}}
                        style={{
                          marginTop: '0.25rem',
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: 'var(--primary)',
                        }}
                      />
                      <div>
                        <div
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {area.titulo}
                        </div>
                        <div
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-normal)',
                          }}
                        >
                          {area.descricao}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Projeto */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={18} style={{ color: 'var(--foreground)' }} />
                <label
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  Tipo de Projeto
                </label>
              </div>
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  marginBottom: '1rem',
                }}
              >
                Selecione o tipo do projeto (selecione um ou mais)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 'pesquisa',
                    titulo: 'Pesquisa & Desenvolvimento',
                    descricao: 'Projetos focados em descoberta e criação de novos conhecimentos ou produtos.',
                  },
                  {
                    id: 'difusao',
                    titulo: 'Difusão',
                    descricao: 'Disseminação de conhecimento, tecnologias e práticas inovadoras.',
                  },
                  {
                    id: 'inovacao',
                    titulo: 'Inovação',
                    descricao: 'Implementação de novos produtos, processos ou métodos organizacionais.',
                  },
                  {
                    id: 'extensao',
                    titulo: 'Extensão',
                    descricao: 'Ações que integram o ensino e a pesquisa à comunidade.',
                  },
                  {
                    id: 'formacao',
                    titulo: 'Formação RH',
                    descricao: 'Capacitação e formação de recursos humanos especializados.',
                  },
                ].map((tipo) => (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => {
                      if (tipoProjeto.includes(tipo.id)) {
                        setTipoProjeto(tipoProjeto.filter((tp) => tp !== tipo.id));
                      } else {
                        setTipoProjeto([...tipoProjeto, tipo.id]);
                      }
                    }}
                    className="text-left p-4 transition-all"
                    style={{
                      backgroundColor: tipoProjeto.includes(tipo.id)
                        ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                        : 'transparent',
                      border: tipoProjeto.includes(tipo.id)
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      minHeight: '100px',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={tipoProjeto.includes(tipo.id)}
                        onChange={() => {}}
                        style={{
                          marginTop: '0.25rem',
                          width: '18px',
                          height: '18px',
                          minWidth: '18px',
                          minHeight: '18px',
                          maxWidth: '18px',
                          maxHeight: '18px',
                          cursor: 'pointer',
                          accentColor: 'var(--primary)',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {tipo.titulo}
                        </div>
                        <div
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-normal)',
                            lineHeight: '1.4',
                          }}
                        >
                          {tipo.descricao}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Classificação da Inovação */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Box size={18} style={{ color: 'var(--foreground)' }} />
                <label
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  Classificação da Inovação
                </label>
              </div>
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  marginBottom: '1rem',
                }}
              >
                Selecione a classificação da inovação (selecione um ou mais)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'produto',
                    titulo: 'Produto',
                    descricao: 'Desenvolvimento ou aperfeiçoamento de produtos tangíveis.',
                  },
                  {
                    id: 'servico',
                    titulo: 'Serviço',
                    descricao: 'Criação ou melhoria de serviços oferecidos.',
                  },
                  {
                    id: 'processo',
                    titulo: 'Processo',
                    descricao: 'Inovação em processos organizacionais e operacionais.',
                  },
                ].map((classificacao) => (
                  <button
                    key={classificacao.id}
                    type="button"
                    onClick={() => {
                      if (classificacaoInovacao.includes(classificacao.id)) {
                        setClassificacaoInovacao(classificacaoInovacao.filter((ci) => ci !== classificacao.id));
                      } else {
                        setClassificacaoInovacao([...classificacaoInovacao, classificacao.id]);
                      }
                    }}
                    className="text-left p-4 transition-all"
                    style={{
                      backgroundColor: classificacaoInovacao.includes(classificacao.id)
                        ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                        : 'transparent',
                      border: classificacaoInovacao.includes(classificacao.id)
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={classificacaoInovacao.includes(classificacao.id)}
                        onChange={() => {}}
                        style={{
                          marginTop: '0.25rem',
                          width: '18px',
                          height: '18px',
                          minWidth: '18px',
                          minHeight: '18px',
                          maxWidth: '18px',
                          maxHeight: '18px',
                          cursor: 'pointer',
                          accentColor: 'var(--primary)',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {classificacao.titulo}
                        </div>
                        <div
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-normal)',
                          }}
                        >
                          {classificacao.descricao}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Informações
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Preencha as informações básicas do projeto
            </p>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Nome do Projeto */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Nome do Projeto <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={nomeProjeto}
                onChange={(e) => setNomeProjeto(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>

            {/* Descrição */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o projeto brevemente"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Coordenador */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Coordenador <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={coordenadorCPF}
                  onChange={(e) => setCoordenadorCPF(e.target.value)}
                  placeholder="CPF do coordenador"
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    fontFamily: 'var(--font-family)',
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--muted)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Data de Início e Data de Fim - Side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data de Início */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Data de Início <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <DatePicker
                  value={dataInicio}
                  onChange={setDataInicio}
                  placeholder="dd/mm/yyyy"
                />
              </div>

              {/* Data de Fim */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Data de Fim <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <DatePicker
                  value={dataFim}
                  onChange={setDataFim}
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Detalhamento
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Descreva o escopo e o avanço em CT&I
            </p>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Escopo do Projeto */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Escopo do Projeto <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={escopoProjeto}
                onChange={(e) => setEscopoProjeto(e.target.value)}
                placeholder="Descreva detalhadamente o escopo do projeto, incluindo as atividades a serem realizadas, os métodos a serem empregados e os resultados esperados. Mínimo de 50 caracteres."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                }}
              />
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: 'var(--text-xs)',
                  color: escopoProjeto.length < 50 ? '#ef4444' : 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
              >
                {escopoProjeto.length}/50 caracteres
              </div>
            </div>

            {/* Avanço em CT&I */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Avanço em CT&I <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={avancoCtei}
                onChange={(e) => setAvancoCtei(e.target.value)}
                placeholder="Descreva como o projeto contribuirá para o avanço científico, tecnológico e de inovação. Mínimo de 30 caracteres."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                }}
              />
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: 'var(--text-xs)',
                  color: avancoCtei.length < 30 ? '#ef4444' : 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                }}
              >
                {avancoCtei.length}/30 caracteres
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Resultados
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Liste os produtos, serviços, processos ou entregas que o projeto irá gerar
            </p>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Tipo de Resultado */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Tipo de Resultado <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={tipoResultado}
                onChange={(e) => setTipoResultado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: tipoResultado ? 'var(--foreground)' : 'var(--muted-foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '16px',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="" style={{ backgroundColor: 'var(--popover-background)', color: 'var(--foreground)' }}>Selecione...</option>
                <option value="Produto" style={{ backgroundColor: 'var(--popover-background)', color: 'var(--foreground)' }}>Produto</option>
                <option value="Serviço" style={{ backgroundColor: 'var(--popover-background)', color: 'var(--foreground)' }}>Serviço</option>
                <option value="Processo" style={{ backgroundColor: 'var(--popover-background)', color: 'var(--foreground)' }}>Processo</option>
                <option value="Outros" style={{ backgroundColor: 'var(--popover-background)', color: 'var(--foreground)' }}>Outros</option>
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Descrição <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={descricaoResultado}
                onChange={(e) => setDescricaoResultado(e.target.value)}
                placeholder="Ex: Software de gestão de laboratório"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div>
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Objetivos
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Defina o objetivo geral e os objetivos específicos
            </p>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Objetivo Geral */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Objetivo Geral <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={objetivoGeral}
                onChange={(e) => setObjetivoGeral(e.target.value)}
                placeholder="Ex: Desenvolver um sistema de gestão de laboratório"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>

            {/* Objetivos Específicos */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Objetivos Específicos <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={objetivosEspecificos}
                onChange={(e) => setObjetivosEspecificos(e.target.value)}
                placeholder="Liste os objetivos específicos do projeto"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div>
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Riscos
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Identifique os riscos do projeto, suas restrições e viabilidade
            </p>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Risco e Classificação - Side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risco */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Risco <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={risco}
                  onChange={(e) => setRisco(e.target.value)}
                  placeholder="Ex: Falta de recursos financeiros"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    fontFamily: 'var(--font-family)',
                  }}
                />
              </div>

              {/* Classificação */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Classificação <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={classificacaoRisco}
                    onChange={(e) => setClassificacaoRisco(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      fontSize: 'var(--text-sm)',
                      color: classificacaoRisco ? 'var(--foreground)' : 'var(--muted-foreground)',
                      backgroundColor: 'var(--input-background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      outline: 'none',
                      fontFamily: 'var(--font-family)',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '16px',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Selecione</option>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Plano de Mitigação */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Plano de Mitigação
              </label>
              <textarea
                value={planoMitigacao}
                onChange={(e) => setPlanoMitigacao(e.target.value)}
                placeholder="Descreva as ações planejadas para mitigar este risco"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Restrições */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Restrições <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={restricoes}
                onChange={(e) => setRestricoes(e.target.value)}
                placeholder="Ex: Falta de recursos financeiros"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Viabilidade */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }}
              >
                Viabilidade <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={viabilidade}
                onChange={(e) => setViabilidade(e.target.value)}
                placeholder="Ex: Viável"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 7 && (
        <div>
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Benefícios
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Detalhe os benefícios esperados e os indicadores de sucesso
            </p>
          </div>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '0',
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  zIndex: 1,
                  transition: 'width 0.3s ease',
                }}
              />

              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                  style={{ flex: 1 }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number <= currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? 'none'
                          : '2px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--text-sm)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={20} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div
                    className="mt-2 text-center"
                    style={{
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight:
                        step.number === currentStep
                          ? 'var(--font-weight-semibold)'
                          : 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Indicador, Unidade e Quantidade - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Indicador - 50% */}
                <div className="md:col-span-5">
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Indicador <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={indicador}
                    onChange={(e) => setIndicador(e.target.value)}
                    placeholder="Descrição do indicador"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      backgroundColor: 'var(--input-background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      outline: 'none',
                      fontFamily: 'var(--font-family)',
                    }}
                  />
                </div>

                {/* Unidade - 35% */}
                <div className="md:col-span-5">
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Unidade <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={unidade}
                      onChange={(e) => setUnidade(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        fontSize: 'var(--text-sm)',
                        color: unidade ? 'var(--foreground)' : 'var(--muted-foreground)',
                        backgroundColor: 'var(--input-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        outline: 'none',
                        fontFamily: 'var(--font-family)',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '16px',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Selecione</option>
                      <optgroup label="Unidades" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary)' }}>
                        <option value="Publicações">Publicações</option>
                        <option value="Artigos">Artigos</option>
                        <option value="Patentes">Patentes</option>
                      </optgroup>
                      <optgroup label="Pessoas" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        <option value="Pessoas">Pessoas</option>
                        <option value="Alunos">Alunos</option>
                        <option value="Pesquisadores">Pesquisadores</option>
                        <option value="Bolsistas">Bolsistas</option>
                      </optgroup>
                      <optgroup label="Produtos" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        <option value="Produtos">Produtos</option>
                        <option value="Protótipos">Protótipos</option>
                        <option value="Softwares">Softwares</option>
                        <option value="Processos">Processos</option>
                      </optgroup>
                      <optgroup label="Serviços" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        <option value="Serviços">Serviços</option>
                        <option value="Cursos">Cursos</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Workshops">Workshops</option>
                      </optgroup>
                      <optgroup label="Organizações" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        <option value="Empresas">Empresas</option>
                        <option value="Parcerias">Parcerias</option>
                        <option value="Empregos">Empregos</option>
                      </optgroup>
                      <optgroup label="Documentos" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        <option value="Relatórios">Relatórios</option>
                        <option value="Documentos">Documentos</option>
                        <option value="Teses">Teses</option>
                        <option value="Dissertações">Dissertações</option>
                        <option value="TCCs">TCCs</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Quantidade - 15% */}
                <div className="md:col-span-2">
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Quantidade <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="0"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      backgroundColor: 'var(--input-background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      outline: 'none',
                      fontFamily: 'var(--font-family)',
                      textAlign: 'center',
                    }}
                  />
                </div>
              </div>

              {/* Fonte de Verificação */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Fonte de Verificação
                </label>
                <input
                  type="text"
                  value={fonteVerificacao}
                  onChange={(e) => setFonteVerificacao(e.target.value)}
                  placeholder="Ex: Relatórios técnicos, documentação do projeto"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    fontFamily: 'var(--font-family)',
                  }}
                />
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--border)',
                  margin: '2rem 0',
                }}
              />

              {/* Sugestões de Indicadores */}
              <div>
                <h3
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Sugestões de Indicadores
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Número de publicações científicas */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de publicações científicas
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Artigos em periódicos ou anais de eventos
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: publicações | Verificação: Lattes, Scopus, Web of Science
                    </p>
                  </div>

                  {/* Card 2: Número de patentes depositadas */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de patentes depositadas
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Propriedade intelectual gerada
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: patentes | Verificação: INPI
                    </p>
                  </div>

                  {/* Card 3: Número de pessoas capacitadas */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de pessoas capacitadas
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Formação de recursos humanos
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: pessoas | Verificação: Certificados, Listas de Presença
                    </p>
                  </div>

                  {/* Card 4: Número de protótipos desenvolvidos */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de protótipos desenvolvidos
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Produtos ou processos criados
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: protótipos | Verificação: Relatório Técnico, Documentação de Projeto
                    </p>
                  </div>

                  {/* Card 5: Redução de custos operacionais */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Redução de custos operacionais
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Eficiência econômica
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: % | Verificação: Relatórios Financeiros
                    </p>
                  </div>

                  {/* Card 6: Aumento de produtividade */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Aumento de produtividade
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Melhoria de processos
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: % | Verificação: Indicadores de Produção
                    </p>
                  </div>

                  {/* Card 7: Número de empresas beneficiadas */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de empresas beneficiadas
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Impacto no setor produtivo
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: empresas | Verificação: Termos de Parceria, Relatórios
                    </p>
                  </div>

                  {/* Card 8: Número de empregos gerados */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de empregos gerados
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Impacto socioeconômico
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: empregos | Verificação: RAIS, CAGED
                    </p>
                  </div>

                  {/* Card 9: Área recuperada/conservada */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Área recuperada/conservada
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Impacto ambiental
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: hectares | Verificação: Relatórios de Campo, Mapas
                    </p>
                  </div>

                  {/* Card 10: Número de tecnologias transferidas */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-lg"
                  >
                    <h4
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Número de tecnologias transferidas
                    </h4>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Difusão de conhecimento
                    </p>
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      Unidade: tecnologias | Verificação: Contratos de Licenciamento, Acordos
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Step 8: Equipe */}
      {currentStep === 8 && (
        <div>
          {/* Title */}
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Equipe
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Adicione os membros da equipe que participarão do projeto e as bolsas.
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  right: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 10)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.8)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    style={{
                      marginTop: '0.5rem',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            {equipeMembers.map((member, index) => (
              <div key={member.id} style={{ marginBottom: '2rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Membro (CPF) e Buscar */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Membro <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={member.cpf}
                        onChange={(e) => updateEquipeMember(member.id, 'cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        style={{
                          flex: 1,
                          padding: '0.625rem 0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)',
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          outline: 'none',
                          fontFamily: 'var(--font-family)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleBuscarMembro(member.id)}
                        style={{
                          padding: '0.625rem 1rem',
                          backgroundColor: 'var(--primary)',
                          color: 'var(--background)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'opacity 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        className="hover:opacity-90"
                      >
                        <Search size={16} />
                        Buscar
                      </button>
                    </div>
                  </div>

                  {/* Função */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Função <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={member.funcao}
                        onChange={(e) => updateEquipeMember(member.id, 'funcao', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: member.funcao ? 'var(--foreground)' : 'var(--muted-foreground)',
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          outline: 'none',
                          fontFamily: 'var(--font-family)',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '16px',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="">Selecione</option>
                        <option value="Coordenador">Coordenador</option>
                        <option value="Vice-Coordenador">Vice-Coordenador</option>
                        <option value="Pesquisador">Pesquisador</option>
                        <option value="Pesquisador Colaborador">Pesquisador Colaborador</option>
                        <option value="Bolsista DTI">Bolsista DTI</option>
                        <option value="Bolsista ITI">Bolsista ITI</option>
                        <option value="Bolsista IC">Bolsista IC</option>
                        <option value="Bolsista TT">Bolsista TT</option>
                        <option value="Bolsista AT">Bolsista AT</option>
                        <option value="Estagiário">Estagiário</option>
                        <option value="Voluntário">Voluntário</option>
                      </select>
                    </div>
                  </div>

                  {/* Bolsa e Adicionar */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Bolsa <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="flex gap-2">
                      <div style={{ flex: 1, position: 'relative' }}>
                        <select
                          value={member.bolsa}
                          onChange={(e) => updateEquipeMember(member.id, 'bolsa', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.75rem',
                            fontSize: 'var(--text-sm)',
                            color: member.bolsa ? 'var(--foreground)' : 'var(--muted-foreground)',
                            backgroundColor: 'var(--input-background)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            outline: 'none',
                            fontFamily: 'var(--font-family)',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '16px',
                            paddingRight: '2.5rem',
                          }}
                        >
                          <option value="">Tipo de Bolsa</option>
                          <option value="Iniciação Científica (R$ 700,00/mês)">Iniciação Científica (R$ 700,00/mês)</option>
                          <option value="Mestrado (R$ 1.500,00/mês)">Mestrado (R$ 1.500,00/mês)</option>
                          <option value="Doutorado (R$ 2.200,00/mês)">Doutorado (R$ 2.200,00/mês)</option>
                          <option value="Pós-Doutorado (R$ 4.100,00/mês)">Pós-Doutorado (R$ 4.100,00/mês)</option>
                          <option value="Apoio Técnico (R$ 1.200,00/mês)">Apoio Técnico (R$ 1.200,00/mês)</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addEquipeMember}
                        style={{
                          width: '40px',
                          height: '40px',
                          padding: '0',
                          backgroundColor: 'var(--primary)',
                          color: 'var(--background)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'opacity 0.2s',
                        }}
                        className="hover:opacity-90"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 9: Capital */}
      {currentStep === 9 && (
        <div>
          {/* Title */}
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Capital
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Liste os itens de capital e despesas de custeio
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 12)',
                  right: 'calc(100% / 12)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 12)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.83)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    style={{
                      marginTop: '0.5rem',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            {capitalItems.map((item, index) => (
              <div key={item.id} style={{ marginBottom: '2rem' }}>
                {/* Categoria */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Categoria <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={item.categoria}
                      onChange={(e) => updateCapitalItem(item.id, 'categoria', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        fontSize: 'var(--text-sm)',
                        color: item.categoria ? 'var(--foreground)' : 'var(--muted-foreground)',
                        backgroundColor: 'var(--input-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        outline: 'none',
                        fontFamily: 'var(--font-family)',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '16px',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Selecione</option>
                      <option value="Material Permanente">Material Permanente</option>
                      <option value="Material de Consumo">Material de Consumo</option>
                      <option value="Passagem">Passagem</option>
                      <option value="Diária">Diária</option>
                      <option value="Pessoa Física">Pessoa Física</option>
                      <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                    </select>
                  </div>
                </div>

                {/* Campos condicionais baseados na categoria */}
                {(item.categoria === 'Material Permanente' || item.categoria === 'Material de Consumo') && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ marginBottom: '1.5rem' }}>
                    {/* Item */}
                    <div className="md:col-span-2">
                      <label
                        style={{
                          display: 'block',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Item <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => updateCapitalItem(item.id, 'item', e.target.value)}
                        placeholder="Descrição do item"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)',
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          outline: 'none',
                          fontFamily: 'var(--font-family)',
                        }}
                      />
                    </div>

                    {/* Quantidade */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Quantidade <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => updateCapitalItem(item.id, 'quantidade', e.target.value)}
                        placeholder="0"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)',
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          outline: 'none',
                          fontFamily: 'var(--font-family)',
                        }}
                      />
                    </div>

                    {/* Valor Total */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Valor Total <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={item.valorTotal}
                        onChange={(e) => updateCapitalItem(item.id, 'valorTotal', e.target.value)}
                        placeholder="R$ 0,00"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)',
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          outline: 'none',
                          fontFamily: 'var(--font-family)',
                        }}
                      />
                    </div>
                  </div>
                )}

                {item.categoria && item.categoria !== 'Material Permanente' && item.categoria !== 'Material de Consumo' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '1.5rem' }}>
                    {/* Valor Total */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Valor Total <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={item.valorTotal}
                        onChange={(e) => updateCapitalItem(item.id, 'valorTotal', e.target.value)}
                        placeholder="R$ 0,00"
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--foreground)',
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          outline: 'none',
                          fontFamily: 'var(--font-family)',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Justificativa - sempre exibida quando há categoria */}
                {item.categoria && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Justificativa <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      value={item.justificativa}
                      onChange={(e) => updateCapitalItem(item.id, 'justificativa', e.target.value)}
                      placeholder="Justifique a necessidade deste item"
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--input-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        outline: 'none',
                        fontFamily: 'var(--font-family)',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                )}

                {/* Botão Adicionar - apenas no último item */}
                {index === capitalItems.length - 1 && item.categoria && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addCapitalItem}
                      style={{
                        width: '40px',
                        height: '40px',
                        padding: '0',
                        backgroundColor: 'var(--primary)',
                        color: 'var(--background)',
                        border: 'none',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity 0.2s',
                      }}
                      className="hover:opacity-90"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}

                {/* Divider entre itens */}
                {index < capitalItems.length - 1 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: 'var(--border)',
                      marginTop: '2rem',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 10: Cronograma */}
      {currentStep === 10 && (
        <div>
          {/* Title */}
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Cronograma
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Defina o período de execução para cada objetivo específico
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 12)',
                  right: 'calc(100% / 12)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 12)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.83)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    style={{
                      marginTop: '0.5rem',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {cronogramaItems.map((item, index) => (
              <div key={index}>
                {/* Objetivo */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Objetivo Específico {index + 1}
                  </label>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: 'var(--input-background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    {item.objetivo}
                  </p>
                </div>

                {/* Mês Início e Mês Fim */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mês Início */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Mês de Início <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="month"
                      value={item.mesInicio}
                      onChange={(e) => updateCronogramaItem(index, 'mesInicio', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--input-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        outline: 'none',
                        fontFamily: 'var(--font-family)',
                      }}
                    />
                  </div>

                  {/* Mês Fim */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Mês de Fim <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="month"
                      value={item.mesFim}
                      onChange={(e) => updateCronogramaItem(index, 'mesFim', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--input-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        outline: 'none',
                        fontFamily: 'var(--font-family)',
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                {index < cronogramaItems.length - 1 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: 'var(--border)',
                      marginTop: '1.5rem',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 11: Revisão */}
      {currentStep === 11 && (
        <div>
          {/* Title */}
          <div className="mb-6">
            <h1 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Revisão
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }}
            >
              Revise todas as informações antes de submeter o projeto
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />

          {/* Step Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line - Background */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 12)',
                  right: 'calc(100% / 12)',
                  height: '2px',
                  backgroundColor: 'var(--border)',
                  zIndex: 0,
                }}
              />
              {/* Progress Line - Active */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: 'calc(100% / 12)',
                  height: '2px',
                  backgroundColor: 'var(--primary)',
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.83)`,
                  transition: 'width 0.3s ease',
                  zIndex: 1,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.number < currentStep
                          ? 'var(--primary)'
                          : step.number === currentStep
                          ? 'var(--primary)'
                          : 'var(--background)',
                      border:
                        step.number <= currentStep
                          ? '2px solid var(--primary)'
                          : '2px solid var(--border)',
                      color:
                        step.number <= currentStep
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {step.number < currentStep ? (
                      <Check size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    style={{
                      marginTop: '0.5rem',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color:
                        step.number === currentStep
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revisão Content */}
          <div className="space-y-8">
            {/* Informações */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                1. Informações
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Programa Relacionado:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{programaRelacionado || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Eixo Estratégico:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{eixoEstrategico || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Áreas Temáticas:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{areasTematicas.join(', ') || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Tipo de Projeto:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{tipoProjeto.join(', ') || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Classificação de Inovação:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{classificacaoInovacao.join(', ') || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Informações */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                2. Informações
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Título do Projeto:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{tituloProjeto || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Justificativa:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{justificativa || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Detalhamento */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                3. Detalhamento
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Descrição do Projeto:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{descricaoProjeto || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Resultados */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                4. Resultados
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Tipo de Resultado:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{tipoResultado || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Descrição do Resultado:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{descricaoResultado || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Objetivos */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                5. Objetivos
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Objetivo Geral:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{objetivoGeral || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Objetivos Específicos:</span>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    {objetivosEspecificos ? (
                      objetivosEspecificos.split('\n').filter(obj => obj.trim() !== '').map((obj, idx) => (
                        <li key={idx} style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem' }}>
                          {obj.trim()}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>-</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Riscos */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                6. Riscos
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Descrição do Risco:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{descricaoRisco || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Benefícios */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                7. Benefícios
              </h2>
              <div className="space-y-4">
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Indicador:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{indicador || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Unidade:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{unidade || '-'}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Quantidade:</span>
                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{quantidade || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Equipe */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                8. Equipe
              </h2>
              <div className="space-y-3">
                {equipeMembers.map((member, idx) => (
                  <div key={member.id} style={{ padding: '0.75rem', backgroundColor: 'var(--input-background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>CPF:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{member.cpf}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Função:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{member.funcao}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Bolsa:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{member.bolsa}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Capital */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                9. Capital
              </h2>
              <div className="space-y-3">
                {capitalItems.map((item, idx) => (
                  <div key={item.id} style={{ padding: '0.75rem', backgroundColor: 'var(--input-background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div className="space-y-2">
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Categoria:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.categoria}</p>
                      </div>
                      {item.item && (
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Item:</span>
                          <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.item}</p>
                        </div>
                      )}
                      {item.quantidade && (
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Quantidade:</span>
                          <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.quantidade}</p>
                        </div>
                      )}
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Valor Total:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.valorTotal}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Justificativa:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem', whiteSpace: 'pre-wrap' }}>{item.justificativa}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Cronograma */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                10. Cronograma
              </h2>
              <div className="space-y-3">
                {cronogramaItems.map((item, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--input-background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div className="space-y-2">
                      <div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Objetivo:</span>
                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.objetivo}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Mês Início:</span>
                          <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.mesInicio}</p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Mês Fim:</span>
                          <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{item.mesFim}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            {/* Resumo Financeiro */}
            <div>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: '1rem',
                }}
              >
                Resumo Financeiro
              </h2>
              <div style={{ padding: '1rem', backgroundColor: 'var(--input-background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Total de Bolsas:</span>
                    <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      R$ {equipeMembers.reduce((total, member) => {
                        const match = member.bolsa.match(/R\$ ([\d.,]+)/);
                        if (match) {
                          const valor = parseFloat(match[1].replace('.', '').replace(',', '.'));
                          return total + valor;
                        }
                        return total;
                      }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Total de Capital:</span>
                    <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                      R$ {capitalItems.reduce((total, item) => {
                        const valor = item.valorTotal.replace(/[^\d,]/g, '').replace(',', '.');
                        return total + (parseFloat(valor) || 0);
                      }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.5rem 0' }} />
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>Total Geral:</span>
                    <span style={{ color: 'var(--primary)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                      R$ {(
                        equipeMembers.reduce((total, member) => {
                          const match = member.bolsa.match(/R\$ ([\d.,]+)/);
                          if (match) {
                            const valor = parseFloat(match[1].replace('.', '').replace(',', '.'));
                            return total + valor;
                          }
                          return total;
                        }, 0) +
                        capitalItems.reduce((total, item) => {
                          const valor = item.valorTotal.replace(/[^\d,]/g, '').replace(',', '.');
                          return total + (parseFloat(valor) || 0);
                        }, 0)
                      ).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div
        className="flex items-center justify-between mt-12 pt-8"
        style={{
          borderTop: '1px solid var(--border)',
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2.5 transition-all flex items-center gap-2"
          style={{
            backgroundColor: 'transparent',
            color: currentStep === 1 ? 'var(--muted-foreground)' : 'var(--primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={18} />
          Anterior
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2.5 transition-all flex items-center gap-2"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {currentStep === 11 ? 'Submeter Projeto' : 'Próximo'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}