import { UserPlus, Search, ChevronRight, X, AlertCircle, Calendar, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface CadastrarBolsistaProps {
  onBack: (tab?: 'bolsistas' | 'informacoes' | 'pagamentos') => void;
}

export function CadastrarBolsista({ onBack }: CadastrarBolsistaProps) {
  const { t } = useLanguage();
  const [cpf, setCpf] = useState('');
  const [bolsistaName, setBolsistaName] = useState('');
  const [orientador, setOrientador] = useState('');
  const [orientadorIsCoordinator, setOrientadorIsCoordinator] = useState(false);
  const [modalidade, setModalidade] = useState('BPIG-X');
  const [isModalidadeOpen, setIsModalidadeOpen] = useState(false);
  const [tipoBolsa, setTipoBolsa] = useState('Iniciação Científica');
  const [quantidadeCotas, setQuantidadeCotas] = useState('1');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [nomeAtividade, setNomeAtividade] = useState('');
  const [planoTrabalho, setPlanoTrabalho] = useState('');
  const [objetivos, setObjetivos] = useState('');
  const [areaConhecimentoSearch, setAreaConhecimentoSearch] = useState('');
  const [selectedAreaConhecimento, setSelectedAreaConhecimento] = useState<{
    nivel1: string;
    nivel2: string;
    nivel3: string;
  } | null>(null);
  const [isAreaConhecimentoOpen, setIsAreaConhecimentoOpen] = useState(false);
  const [isTipoBolsaOpen, setIsTipoBolsaOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const modalidades = [
    'BPIG-I', 'BPIG-II', 'BPIG-III', 'BPIG-IV', 'BPIG-V',
    'BPIG-VI', 'BPIG-VII', 'BPIG-VIII', 'BPIG-IX', 'BPIG-X',
  ];

  const tiposBolsa = [
    'Iniciação Científica',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado',
  ];

  const coordenadorProjeto = 'Paulo Sergio dos Santos Junior';
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const mesesCurtos = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const areasConhecimentoCnpq = [
    { nivel1: 'Ciências Exatas e da Terra', nivel2: 'Ciência da Computação', nivel3: 'Sistemas de Computação' },
    { nivel1: 'Ciências Exatas e da Terra', nivel2: 'Ciência da Computação', nivel3: 'Engenharia de Software' },
    { nivel1: 'Ciências Exatas e da Terra', nivel2: 'Matemática', nivel3: 'Matemática Aplicada' },
    { nivel1: 'Engenharias', nivel2: 'Engenharia Elétrica', nivel3: 'Telecomunicações' },
    { nivel1: 'Engenharias', nivel2: 'Engenharia de Produção', nivel3: 'Pesquisa Operacional' },
    { nivel1: 'Ciências Humanas', nivel2: 'Educação', nivel3: 'Ensino-Aprendizagem' },
    { nivel1: 'Ciências Sociais Aplicadas', nivel2: 'Administração', nivel3: 'Administração Pública' },
    { nivel1: 'Ciências da Saúde', nivel2: 'Saúde Coletiva', nivel3: 'Epidemiologia' },
  ];
  const filteredAreasConhecimento = areasConhecimentoCnpq.filter((area) =>
    `${area.nivel1} ${area.nivel2} ${area.nivel3}`.toLowerCase().includes(areaConhecimentoSearch.toLowerCase()),
  );

  const handleBuscarCPF = () => {
    // Mock: populate bolsista name from CPF search
    if (cpf.length >= 3) {
      setBolsistaName('Marcela Starling');
    }
  };

  const handleCadastrar = () => {
    if (cpf && !isValidCPF(cpf)) {
      toast.error('CPF inválido. Verifique os dígitos informados.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSalvar = () => {
    setIsConfirmModalOpen(false);
    onBack('bolsistas');
    toast.success('Solicitação de bolsa enviada com sucesso!');
  };

  const handleCancel = () => {
    onBack();
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const isValidCPF = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
    const calc = (mod: number) => {
      const sum = digits.slice(0, mod - 1).split('').reduce((acc, d, i) => acc + Number(d) * (mod - i), 0);
      const rem = (sum * 10) % 11;
      return rem === 10 || rem === 11 ? 0 : rem;
    };
    return calc(10) === Number(digits[9]) && calc(11) === Number(digits[10]);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const formatMonthYear = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    if (!year || !month) return '';

    return `${meses[month - 1]} de ${year}`;
  };

  const addMonths = (value: string, monthsToAdd: number) => {
    const [year, month] = value.split('-').map(Number);
    if (!year || !month || monthsToAdd < 0) return '';

    const date = new Date(year, month - 1 + monthsToAdd, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const updateFimAtividades = (inicio = dataInicio, cotas = quantidadeCotas) => {
    const quantidade = Number(cotas);
    if (!inicio || !Number.isFinite(quantidade) || quantidade <= 0) return;

    setDataTermino(addMonths(inicio, quantidade - 1));
  };

  const handleQuantidadeCotasChange = (value: string) => {
    setQuantidadeCotas(value);
    updateFimAtividades(dataInicio, value);
  };

  const handleInicioAtividadesChange = (value: string) => {
    setDataInicio(value);
    updateFimAtividades(value, quantidadeCotas);
  };

  const Required = () => <span style={{ color: 'var(--destructive-foreground)' }}>*</span>;

  const SectionHeader = ({ number, title }: { number: number; title: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="flex items-center justify-center"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '9999px',
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          flexShrink: 0,
          fontFamily: 'var(--font-family)',
        }}
      >
        {number}
      </span>
      <h2
        style={{
          color: 'var(--foreground)',
          fontSize: '16px',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: 1.2,
          margin: 0,
          fontFamily: 'var(--font-family)',
        }}
      >
        {title}
      </h2>
    </div>
  );

  const formSectionStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
  };
  const formFieldBackground = '#262626';

  const MonthPicker = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayYear, setDisplayYear] = useState(() => {
      const year = Number(value.split('-')[0]);
      return Number.isFinite(year) && year > 0 ? year : 2026;
    });

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between"
          style={{ padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: value ? 'var(--foreground)' : 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-family)' }}
        >
          <span>{value ? formatMonthYear(value) : placeholder}</span>
          <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
        </button>

        {isOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsOpen(false)} />
            <div
              className="p-5"
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.75rem)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(100vw - 2rem, 520px)',
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--elevation-sm)',
                zIndex: 50,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setDisplayYear((current) => current - 1)}
                  className="p-2"
                  style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                  aria-label="Ano anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {displayYear}
                </strong>
                <button
                  type="button"
                  onClick={() => setDisplayYear((current) => current + 1)}
                  className="p-2"
                  style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                  aria-label="Próximo ano"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {mesesCurtos.map((mes, index) => {
                  const monthValue = `${displayYear}-${String(index + 1).padStart(2, '0')}`;
                  const isSelected = value === monthValue;

                  return (
                    <button
                      key={mes}
                      type="button"
                      onClick={() => {
                        onChange(monthValue);
                        setIsOpen(false);
                      }}
                      className="px-4 py-3"
                      style={{
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        cursor: 'pointer',
                      }}
                    >
                      {mes}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
      <div className="w-full px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => onBack()}
          style={{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.2s',
            fontFamily: 'var(--font-family)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
        >
          Minha Equipe
        </button>
        <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
        <span
          style={{
            color: 'var(--foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'var(--font-family)',
          }}
        >
          Solicitar Bolsa
        </span>
      </div>

      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-2">
        <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <UserPlus size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }}>
          Solicitar Bolsa
        </h1>
      </div>

      {/* Subtitle */}
      <p
        style={{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-family)',
        }}
      >
        Incluir nova pessoa para atuar no projeto ou atualizar bolsa de pessoa que já atua no projeto
      </p>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '2rem' }} />

      {/* Form */}
      <div className="space-y-6">
        <section style={formSectionStyle}>
          <SectionHeader number={1} title="Informações da Bolsa" />

        {/* Projeto Vinculado */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Projeto Vinculado <Required />
          </label>
          <input
            type="text"
            value="ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação"
            readOnly
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', cursor: 'not-allowed', fontFamily: 'var(--font-family)' }}
          />
        </div>

        {/* CPF do Bolsista */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            CPF do Bolsista <Required />
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              style={{ flex: 1, padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleBuscarCPF}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
          {bolsistaName && (
            <div
              className="flex items-center gap-2 mt-2 px-3 py-2"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
                {bolsistaName}
              </span>
              <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>
                encontrado
              </span>
            </div>
          )}
        </div>

        {/* Orientador */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Orientador <Required />
          </label>
          <input
            type="text"
            value={orientador}
            onChange={(e) => {
              setOrientador(e.target.value);
              if (orientadorIsCoordinator && e.target.value !== coordenadorProjeto) {
                setOrientadorIsCoordinator(false);
              }
            }}
            placeholder="Nome do orientador responsável"
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <label className="flex items-center gap-2 mt-3" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
            <input
              type="checkbox"
              checked={orientadorIsCoordinator}
              onChange={(event) => {
                setOrientadorIsCoordinator(event.target.checked);
                setOrientador(event.target.checked ? coordenadorProjeto : '');
              }}
              style={{ accentColor: 'var(--primary)' }}
            />
            Orientador é o coordenador do projeto.
          </label>
        </div>

        {/* Modalidade and Tipo de Bolsa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Modalidade */}
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Modalidade <Required />
            </label>
            <div className="relative">
              <button
                onClick={() => setIsModalidadeOpen(!isModalidadeOpen)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-family)' }}
              >
                {modalidade}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isModalidadeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isModalidadeOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsModalidadeOpen(false)} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, overflow: 'hidden', maxHeight: '200px', overflowY: 'auto' }}>
                    {modalidades.map((mod) => (
                      <button
                        key={mod}
                        onClick={() => { setModalidade(mod); setIsModalidadeOpen(false); }}
                        style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: modalidade === mod ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent', color: modalidade === mod ? 'var(--primary)' : 'var(--foreground)', border: 'none', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.15s', fontFamily: 'var(--font-family)' }}
                        onMouseEnter={(e) => { if (modalidade !== mod) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                        onMouseLeave={(e) => { if (modalidade !== mod) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tipo de Bolsa */}
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Tipo de Bolsa <Required />
            </label>
            <div className="relative">
              <button
                onClick={() => setIsTipoBolsaOpen(!isTipoBolsaOpen)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-family)' }}
              >
                {tipoBolsa}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isTipoBolsaOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isTipoBolsaOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsTipoBolsaOpen(false)} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, overflow: 'hidden' }}>
                    {tiposBolsa.map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => { setTipoBolsa(tipo); setIsTipoBolsaOpen(false); }}
                        style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: tipoBolsa === tipo ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent', color: tipoBolsa === tipo ? 'var(--primary)' : 'var(--foreground)', border: 'none', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.15s', fontFamily: 'var(--font-family)' }}
                        onMouseEnter={(e) => { if (tipoBolsa !== tipo) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                        onMouseLeave={(e) => { if (tipoBolsa !== tipo) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quantidade de Cotas, Início das Atividades, and Fim das Atividades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Quantidade de Cotas <Required />
            </label>
            <input
              type="number"
              min="1"
              value={quantidadeCotas}
              onChange={(e) => handleQuantidadeCotasChange(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Início das Atividades <Required />
            </label>
            <MonthPicker value={dataInicio} onChange={handleInicioAtividadesChange} placeholder="Selecione o mês de início" />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Fim das Atividades <Required />
            </label>
            <MonthPicker value={dataTermino} onChange={setDataTermino} placeholder="Selecione o mês de fim" />
          </div>
        </div>
        </section>

        <section style={formSectionStyle}>
          <SectionHeader number={2} title="Informações Gerais" />

        {/* Plano de Trabalho */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Plano de Trabalho <Required />
          </label>
          <textarea
            value={planoTrabalho}
            onChange={(e) => setPlanoTrabalho(e.target.value)}
            placeholder="Descreva o plano de trabalho do bolsista, incluindo atividades previstas e metodologia..."
            rows={4}
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Nome da Atividade <Required />
          </label>
          <input
            type="text"
            value={nomeAtividade}
            onChange={(e) => setNomeAtividade(e.target.value)}
            placeholder="Nome da função que será realizada pelo bolsista"
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Objetivos */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Objetivos <Required />
          </label>
          <textarea
            value={objetivos}
            onChange={(e) => setObjetivos(e.target.value)}
            placeholder="Liste os objetivos do bolsista (um por linha) 1. Objetivo 1 2. Objetivo 2 3. Objetivo 3"
            rows={4}
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        <div className="mb-8">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Área do Conhecimento <Required />
          </label>
          <div className="relative">
            <input
              type="text"
              value={areaConhecimentoSearch}
              onFocus={() => setIsAreaConhecimentoOpen(true)}
              onBlur={() => window.setTimeout(() => setIsAreaConhecimentoOpen(false), 120)}
              onChange={(e) => {
                setAreaConhecimentoSearch(e.target.value);
                setSelectedAreaConhecimento(null);
                setIsAreaConhecimentoOpen(true);
              }}
              placeholder="Digite ou selecione uma área CNPq"
              style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
            />
            {isAreaConhecimentoOpen && filteredAreasConhecimento.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, maxHeight: '220px', overflowY: 'auto' }}>
                {filteredAreasConhecimento.map((area) => (
                  <button
                    key={`${area.nivel1}-${area.nivel2}-${area.nivel3}`}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSelectedAreaConhecimento(area);
                      setAreaConhecimentoSearch(area.nivel3);
                      setIsAreaConhecimentoOpen(false);
                    }}
                    style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {area.nivel3}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedAreaConhecimento && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div style={{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)', borderRadius: 'var(--radius)' }}>
                <span style={{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>Nível 1 CNPq</span>
                <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{selectedAreaConhecimento.nivel1}</strong>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)', borderRadius: 'var(--radius)' }}>
                <span style={{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>Nível 2 CNPq</span>
                <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{selectedAreaConhecimento.nivel2}</strong>
              </div>
            </div>
          )}
        </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Cancelar
          </button>
          <button
            onClick={handleCadastrar}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Solicitar Bolsa
          </button>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {isConfirmModalOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
            onClick={() => setIsConfirmModalOpen(false)}
          />

          {/* Modal panel */}
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
              maxWidth: '480px',
              zIndex: 1000,
              boxShadow: 'var(--elevation-sm)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              {/* Header row */}
              <div className="flex items-start justify-between" style={{ marginBottom: '1.25rem' }}>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <AlertCircle size={18} />
                  </div>
                  <h2
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '18px',
                      fontWeight: 'var(--font-weight-normal)',
                      margin: 0,
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    Solicitar Bolsa
                  </h2>
                </div>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', flexShrink: 0, transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Confirmation message */}
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  lineHeight: '1.6',
                  margin: '0 0 1.25rem 0',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Tem certeza que deseja solicitar a bolsa de{' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {bolsistaName || 'bolsista'}
                </strong>{' '}
                na modalidade{' '}
                <strong style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {modalidade}
                </strong>{' '}
                ?
              </p>

              {/* Summary card */}
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                  borderRadius: 'var(--radius)',
                  padding: '0.875rem 1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                {[
                  { label: 'Bolsista', value: bolsistaName || '—', highlight: false },
                  { label: 'Modalidade', value: modalidade, highlight: true },
                  { label: 'Tipo de Bolsa', value: tipoBolsa, highlight: false },
                  { label: 'Data de vigência', value: `${dataInicio ? formatMonthYear(dataInicio) : '—'} até ${dataTermino ? formatMonthYear(dataTermino) : '—'}`, highlight: false },
                ].map((row, idx, arr) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>
                        {row.label}
                      </span>
                      <span
                        style={{
                          color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          fontFamily: 'var(--font-family)',
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ height: '1px', backgroundColor: 'color-mix(in srgb, var(--border) 60%, transparent)', marginTop: '0.625rem' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSalvar}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
