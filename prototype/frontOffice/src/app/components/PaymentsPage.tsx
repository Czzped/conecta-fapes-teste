import { Check, ChevronDown, CreditCard } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface FilterMultiSelectProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  options: MultiSelectOption[];
  summaryLabel?: string;
}

interface PaymentsPageProps {
  scope?: 'personal' | 'project';
}

function FilterMultiSelect({ selectedValues, onChange, options, summaryLabel = 'itens' }: FilterMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
  const displayText = selectedOptions.length === 0
    ? 'Todos'
    : selectedOptions.length <= 2
      ? selectedOptions.map((option) => option.label).join(', ')
      : `${selectedOptions.length} ${summaryLabel}`;

  const toggleValue = (value: string) => {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    onChange(nextValues);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 pr-10 text-left transition-colors"
        style={{
          backgroundColor: 'var(--input-background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          cursor: 'pointer',
        }}
      >
        {displayText}
      </button>

      <ChevronDown
        size={16}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
          color: 'var(--muted-foreground)',
          pointerEvents: 'none',
          transition: 'transform 0.2s',
        }}
      />

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 overflow-hidden"
          style={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--elevation-sm)',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => onChange([])}
            className="w-full px-3 py-2.5 text-left transition-colors"
            style={{
              backgroundColor: selectedValues.length === 0 ? 'var(--primary)' : 'transparent',
              color: selectedValues.length === 0 ? 'var(--background)' : 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Todos
          </button>

          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleValue(option.value)}
                className="w-full px-3 py-2.5 text-left transition-colors flex items-center gap-2"
                style={{
                  backgroundColor: isSelected ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: 'var(--background)',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={12} />}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PaymentsPage({ scope = 'personal' }: PaymentsPageProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const personalPayments = [
    {
      reference: 'IC-2026-002',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/02/2026',
      status: 'Pendente',
    },
    {
      reference: 'IC-2026-001',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/01/2026',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-008',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/01/2026',
      status: 'Bônus',
    },
    {
      reference: 'IC-2025-007',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/12/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-006',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/11/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-005',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/10/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-004',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/09/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-003',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/08/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-002',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/07/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-001',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/06/2025',
      status: 'Pago',
    },
  ];

  const projectPayments = [
    {
      reference: 'IC-2026-014',
      project: 'Conecta Fapes',
      beneficiary: 'Ana Souza',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/02/2026',
      status: 'Pendente',
    },
    {
      reference: 'IC-2026-013',
      project: 'Conecta Fapes',
      beneficiary: 'Bruno Lima',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/02/2026',
      status: 'Pago',
    },
    {
      reference: 'IC-2026-012',
      project: 'Conecta Fapes',
      beneficiary: 'Carolina Martins',
      scholarship: 'Mestrado',
      value: 'R$ 2.100,00',
      paymentDate: '05/01/2026',
      status: 'Pago',
    },
    {
      reference: 'IC-2026-011',
      project: 'Conecta Fapes',
      beneficiary: 'Diego Almeida',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/01/2026',
      status: 'Bônus',
    },
    {
      reference: 'IC-2025-021',
      project: 'Conecta Fapes',
      beneficiary: 'Fernanda Rocha',
      scholarship: 'Doutorado',
      value: 'R$ 3.100,00',
      paymentDate: '05/12/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-020',
      project: 'Conecta Fapes',
      beneficiary: 'Gabriel Costa',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/11/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-019',
      project: 'Conecta Fapes',
      beneficiary: 'Helena Dias',
      scholarship: 'Apoio Técnico',
      value: 'R$ 1.200,00',
      paymentDate: '05/10/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-018',
      project: 'Conecta Fapes',
      beneficiary: 'Igor Nascimento',
      scholarship: 'Mestrado',
      value: 'R$ 2.100,00',
      paymentDate: '05/09/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-017',
      project: 'Conecta Fapes',
      beneficiary: 'Juliana Freitas',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/08/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-016',
      project: 'Conecta Fapes',
      beneficiary: 'Paulo Sérgio Junior',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/07/2025',
      status: 'Pago',
    },
  ];

  const payments = scope === 'project' ? projectPayments : personalPayments;
  const pageTitle = scope === 'project' ? 'Pagamentos' : 'Meus Pagamentos';
  const pageSubtitle = scope === 'project'
    ? 'Acompanhe todos os pagamentos do projeto.'
    : 'Acompanhe o histórico dos seus pagamentos de bolsa.';
  const shouldShowBeneficiary = scope === 'project';
  const shouldShowProjectFilter = scope !== 'project';
  const bankAccountsByBeneficiary: Record<string, { agency: string; account: string }> = {
    'Ana Souza': { agency: '0912', account: '12345-6' },
    'Bruno Lima': { agency: '0874', account: '98765-1' },
    'Carolina Martins': { agency: '1120', account: '45678-9' },
    'Diego Almeida': { agency: '0715', account: '74125-0' },
    'Fernanda Rocha': { agency: '1044', account: '85236-7' },
    'Gabriel Costa': { agency: '0631', account: '96325-4' },
    'Helena Dias': { agency: '0988', account: '15973-2' },
    'Igor Nascimento': { agency: '0750', account: '35791-8' },
    'Juliana Freitas': { agency: '0816', account: '24680-3' },
    'Paulo Sérgio Junior': { agency: '0921', account: '123456-7' },
  };

  const getBankAccount = (beneficiary: string) => bankAccountsByBeneficiary[beneficiary] ?? {
    agency: 'Não informada',
    account: 'Não informada',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.2)' };
      case 'Pendente':
        return { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.2)' };
      case 'Bônus':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.2)' };
      default:
        return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' };
    }
  };

  const getPaymentYear = (date: string) => date.split('/')[2];

  const projectOptions = Array.from(new Set(payments.map((payment) => payment.project)))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((project) => ({ value: project, label: project }));

  const beneficiaryOptions = Array.from(new Set(payments.map((payment) => payment.beneficiary)))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((beneficiary) => ({ value: beneficiary, label: beneficiary }));

  const yearOptions = Array.from(new Set(payments.map((payment) => getPaymentYear(payment.paymentDate))))
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ value: year, label: year }));

  const modalityOptions = Array.from(new Set(payments.map((payment) => payment.scholarship)))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((modality) => ({ value: modality, label: modality }));

  const statusOptions = Array.from(new Set(payments.map((payment) => payment.status)))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((status) => ({ value: status, label: status }));

  const filteredPayments = payments.filter((payment) => {
    const projectMatches = selectedProjects.length === 0 || selectedProjects.includes(payment.project);
    const beneficiaryMatches = selectedBeneficiaries.length === 0 || selectedBeneficiaries.includes(payment.beneficiary);
    const yearMatches = selectedYears.length === 0 || selectedYears.includes(getPaymentYear(payment.paymentDate));
    const modalityMatches = selectedModalities.length === 0 || selectedModalities.includes(payment.scholarship);
    const statusMatches = selectedStatuses.length === 0 || selectedStatuses.includes(payment.status);

    return projectMatches && beneficiaryMatches && yearMatches && modalityMatches && statusMatches;
  });

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="p-2 transition-colors"
          style={{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <CreditCard size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
          {pageTitle}
        </h1>
      </div>

      {/* Subtitle */}
      <p style={{
        color: 'var(--muted-foreground)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-normal)',
        marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
        marginBottom: '1.5rem',
      }}>
        {pageSubtitle}
      </p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          marginBottom: '2rem',
        }}
      />

      {/* Section */}
      <section className="mb-8 mt-6">
        {/* Filters Section */}
        <div className="mb-6">
          <div className={`grid grid-cols-1 ${shouldShowProjectFilter ? 'md:grid-cols-4' : 'md:grid-cols-4'} gap-4`}>
            {shouldShowProjectFilter && (
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
                  Projeto
                </label>
                <FilterMultiSelect
                  selectedValues={selectedProjects}
                  onChange={setSelectedProjects}
                  options={projectOptions}
                  summaryLabel="projetos"
                />
              </div>
            )}

            {shouldShowBeneficiary && (
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
                  Bolsista
                </label>
                <FilterMultiSelect
                  selectedValues={selectedBeneficiaries}
                  onChange={setSelectedBeneficiaries}
                  options={beneficiaryOptions}
                  summaryLabel="bolsistas"
                />
              </div>
            )}

            {/* Filter by Year */}
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
                Ano
              </label>
              <FilterMultiSelect
                selectedValues={selectedYears}
                onChange={setSelectedYears}
                options={yearOptions}
                summaryLabel="anos"
              />
            </div>

            {/* Filter by Modality */}
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
                Modalidade
              </label>
              <FilterMultiSelect
                selectedValues={selectedModalities}
                onChange={setSelectedModalities}
                options={modalityOptions}
                summaryLabel="modalidades"
              />
            </div>

            {/* Filter by Status */}
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
                Status
              </label>
              <FilterMultiSelect
                selectedValues={selectedStatuses}
                onChange={setSelectedStatuses}
                options={statusOptions}
                summaryLabel="status"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Cards */}
          <div className="hidden md:grid md:grid-cols-1 gap-4">
            {filteredPayments.map((payment, index) => {
              const statusColors = getStatusColor(payment.status);
              const bankAccount = getBankAccount(payment.beneficiary);
              
              return (
                <div 
                  key={index}
                  className="p-5"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: shouldShowBeneficiary
                        ? '1.15fr 1.2fr 1fr 1.15fr 1.35fr 0.8fr 0.8fr'
                        : '1.25fr 1fr 1.15fr 1.65fr 0.8fr 0.8fr',
                      alignItems: 'start',
                    }}
                  >
                    {/* Projeto */}
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Projeto
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        {payment.project}
                      </div>
                    </div>

                    {shouldShowBeneficiary && (
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                          Bolsista
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                          {payment.beneficiary}
                        </div>
                      </div>
                    )}

                    {/* Data do Pagamento */}
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Data do Pagamento
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        {payment.paymentDate}
                      </div>
                    </div>

                    {/* Modalidade da Bolsa */}
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Modalidade da Bolsa
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        {payment.scholarship}
                      </div>
                    </div>

                    {/* Dados bancários */}
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Dados bancários
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        Agência {bankAccount.agency}
                      </div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.25rem', wordBreak: 'break-word' }}>
                        Conta {bankAccount.account}
                      </div>
                    </div>

                    {/* Valor */}
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Valor
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', wordBreak: 'break-word' }}>
                        {payment.value}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Status
                      </div>
                      <span
                        className="inline-flex items-center px-2.5 py-1"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          border: `1px solid ${statusColors.border}`,
                          borderRadius: '9999px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Cards - Hidden on desktop */}
          <div className="md:hidden space-y-4">
            {filteredPayments.map((payment, index) => {
              const statusColors = getStatusColor(payment.status);
              const bankAccount = getBankAccount(payment.beneficiary);
              
              return (
                <div 
                  key={index}
                  className="p-4"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      {/* Projeto */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Projeto
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {payment.project}
                        </div>
                      </div>

                      {shouldShowBeneficiary && (
                        <div>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                            Bolsista
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {payment.beneficiary}
                          </div>
                        </div>
                      )}

                      {/* Data do Pagamento */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Data do Pagamento
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {payment.paymentDate}
                        </div>
                      </div>

                      {/* Dados bancários */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Dados bancários
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          Agência {bankAccount.agency}
                        </div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>
                          Conta {bankAccount.account}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      {/* Modalidade da Bolsa */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Modalidade da Bolsa
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {payment.scholarship}
                        </div>
                      </div>

                      {/* Valor */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Valor
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {payment.value}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Status
                        </div>
                        <span
                          className="inline-flex items-center px-2 py-0.5"
                          style={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`,
                            borderRadius: '9999px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPayments.length === 0 && (
            <div
              className="p-5 text-center"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Nenhum pagamento encontrado para os filtros selecionados.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
