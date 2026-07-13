import { HeartHandshake, Search, X, AlertCircle, Calendar, ChevronLeft, ChevronRight, Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePageScenarios } from '@/mocks/ScenarioContext';

interface AdicionarVoluntarioProps {
  onClose: () => void;
  onAdd: (voluntario: { name: string; cpf: string; email: string; dataInicio: string }) => void;
}

export function AdicionarVoluntario({ onClose, onAdd }: AdicionarVoluntarioProps) {
  // Reutiliza os mesmos cenários MSW da busca por CPF do cadastro de bolsista.
  usePageScenarios([
    'bolsista-encontrado',
    'bolsista-nao-cadastrado',
    'bolsista-sistema-indisponivel',
    'bolsista-cpf-invalido-backend',
  ]);

  const [cpf, setCpf] = useState('');
  const [voluntarioName, setVoluntarioName] = useState('');
  const [voluntarioInfo, setVoluntarioInfo] = useState<{ email: string; instituicao: string; titulacao: string } | null>(null);
  const [cpfBuscando, setCpfBuscando] = useState(false);
  const [cpfErro, setCpfErro] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState('');

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const mesesCurtos = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const handleBuscarCPF = async () => {
    if (!cpf || cpf.replace(/\D/g, '').length < 11) return;
    setCpfBuscando(true);
    setCpfErro(null);
    setVoluntarioName('');
    setVoluntarioInfo(null);
    try {
      const res = await fetch(`/api/bolsistas/cpf/${cpf.replace(/\D/g, '')}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setCpfErro(body.erro ?? 'Erro ao buscar pessoa. Tente novamente.');
        return;
      }
      const data = await res.json();
      setVoluntarioName(data.nome);
      setVoluntarioInfo({ email: data.email, instituicao: data.instituicao, titulacao: data.titulacao });
    } catch {
      setCpfErro('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
    } finally {
      setCpfBuscando(false);
    }
  };

  const handleAdicionar = () => {
    if (cpf && !isValidCPF(cpf)) {
      toast.error('CPF inválido. Verifique os dígitos informados.');
      return;
    }
    if (!voluntarioName) {
      toast.error('Busque a pessoa pelo CPF antes de adicionar.');
      return;
    }
    if (!dataInicio) {
      toast.error('Informe a data de início da participação.');
      return;
    }
    onAdd({ name: voluntarioName, cpf, email: voluntarioInfo?.email ?? '', dataInicio });
    toast.success('Voluntário adicionado com sucesso!');
    onClose();
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
    setCpf(formatCPF(e.target.value));
  };

  const formatMonthYear = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    if (!year || !month) return '';
    return `${meses[month - 1]} de ${year}`;
  };

  const Required = () => <span style={{ color: 'var(--destructive-foreground)' }}>*</span>;

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
              className="p-3"
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                width: '100%',
                backgroundColor: '#262626',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--elevation-sm)',
                zIndex: 50,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setDisplayYear((current) => current - 1)}
                  className="flex items-center justify-center"
                  style={{ width: '28px', height: '28px', backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                  aria-label="Ano anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {displayYear}
                </strong>
                <button
                  type="button"
                  onClick={() => setDisplayYear((current) => current + 1)}
                  className="flex items-center justify-center"
                  style={{ width: '28px', height: '28px', backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                  aria-label="Próximo ano"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
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
                      style={{
                        minWidth: 0,
                        height: '32px',
                        padding: '0 0.375rem',
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
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
        onClick={onClose}
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
          maxWidth: '520px',
          zIndex: 1000,
          boxShadow: 'var(--elevation-sm)',
          fontFamily: 'var(--font-family)',
        }}
      >
        <div style={{ padding: '1.5rem' }}>
          {/* Header row */}
          <div className="flex items-start justify-between" style={{ marginBottom: '0.75rem' }}>
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
                <HeartHandshake size={18} />
              </div>
              <div>
                <h2 style={{ color: 'var(--foreground)', fontSize: '18px', fontWeight: 'var(--font-weight-normal)', margin: 0, fontFamily: 'var(--font-family)' }}>
                  Adicionar Voluntário
                </h2>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: '0.15rem 0 0 0', fontFamily: 'var(--font-family)' }}>
                  Sem vínculo de bolsa
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', flexShrink: 0, transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '1.25rem' }} />

          {/* CPF do Voluntário */}
          <div className="mb-5">
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              CPF do Voluntário <Required />
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                maxLength={14}
                style={{ flex: 1, minWidth: 0, padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button
                onClick={handleBuscarCPF}
                disabled={cpfBuscando}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: cpfBuscando ? 'not-allowed' : 'pointer', opacity: cpfBuscando ? 0.6 : 1, transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)' }}
                onMouseEnter={(e) => { if (!cpfBuscando) { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground)'; }}
              >
                {cpfBuscando ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {cpfBuscando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Mensagem de erro */}
            {cpfErro && (
              <div
                className="flex items-start gap-2 mt-2 px-3 py-2"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: '#ef4444', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
                  {cpfErro}
                </span>
              </div>
            )}

            {/* Card de sucesso com a pessoa encontrada */}
            {voluntarioName && voluntarioInfo && (
              <div
                className="mt-2 px-3 py-3"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-family)' }}>
                    {voluntarioName}
                  </span>
                  <span style={{ color: 'var(--primary)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>
                    encontrado
                  </span>
                </div>
                <div style={{ paddingLeft: 15, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Instituição', value: voluntarioInfo.instituicao },
                    { label: 'E-mail', value: voluntarioInfo.email },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)', minWidth: 70 }}>{label}:</span>
                      <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Data de início da participação */}
          <div className="mb-5" style={{ maxWidth: '320px' }}>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Data de início da participação <Required />
            </label>
            <MonthPicker value={dataInicio} onChange={setDataInicio} placeholder="Selecione o mês de início" />
          </div>

          {/* Nota informativa */}
          <div
            className="flex items-start gap-2 px-3 py-2"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            <Info size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
              O membro voluntário não possui vínculo financeiro com o projeto e não exige documentação de bolsa.
            </span>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3" style={{ marginTop: '1.5rem' }}>
            <button
              onClick={onClose}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Cancelar
            </button>
            <button
              onClick={handleAdicionar}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Adicionar voluntário
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
