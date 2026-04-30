import { CreditCard, Filter, ChevronDown, FileText } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatePicker } from '@/app/components/DatePicker';
import { Dropdown } from '@/app/components/Dropdown';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function PaymentsPage() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedModality, setSelectedModality] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const payments = [
    {
      reference: 'IC-2026-002',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/02/2026',
      status: 'Pendente',
    },
    {
      reference: 'IC-2026-001',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/01/2026',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-008',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/01/2026',
      status: 'Bônus',
    },
    {
      reference: 'IC-2025-007',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/12/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-006',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/11/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-005',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/10/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-004',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/09/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-003',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/08/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-002',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/07/2025',
      status: 'Pago',
    },
    {
      reference: 'IC-2025-001',
      project: 'Conecta Fapes',
      scholarship: 'Iniciação Científica',
      value: 'R$ 700,00',
      paymentDate: '05/06/2025',
      status: 'Pago',
    },
  ];

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
          Pagamentos
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
        Acompanhe o histórico dos pagamentos da sua bolsa.
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
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Filter by Project */}
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
              <Dropdown
                value={selectedProject}
                onChange={setSelectedProject}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'conecta', label: 'Conecta' },
                ]}
              />
            </div>

            {/* Filter by Date */}
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
                Data
              </label>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholder="Todos"
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
              <Dropdown
                value={selectedModality}
                onChange={setSelectedModality}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'iniciacao', label: 'Iniciação Científica' },
                ]}
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
              <Dropdown
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'pago', label: 'Pago' },
                  { value: 'pendente', label: 'Pendente' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Cards */}
          <div className="hidden md:grid md:grid-cols-1 gap-4">
            {payments.map((payment, index) => {
              const statusColors = getStatusColor(payment.status);
              
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
                  <div className="grid grid-cols-12 gap-4">
                    {/* Referência */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Referência
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', wordBreak: 'break-word' }}>
                        {payment.reference}
                      </div>
                    </div>

                    {/* Projeto */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Projeto
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        {payment.project}
                      </div>
                    </div>

                    {/* Data do Pagamento */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Data do Pagamento
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        {payment.paymentDate}
                      </div>
                    </div>

                    {/* Modalidade da Bolsa */}
                    <div className="col-span-3" style={{ marginLeft: '2rem' }}>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Modalidade da Bolsa
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                        {payment.scholarship}
                      </div>
                    </div>

                    {/* Valor */}
                    <div className="col-span-2">
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                        Valor
                      </div>
                      <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', wordBreak: 'break-word' }}>
                        {payment.value}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
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
            {payments.map((payment, index) => {
              const statusColors = getStatusColor(payment.status);
              
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
                      {/* Referência */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Referência
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {payment.reference}
                        </div>
                      </div>

                      {/* Projeto */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Projeto
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {payment.project}
                        </div>
                      </div>

                      {/* Data do Pagamento */}
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Data do Pagamento
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {payment.paymentDate}
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
        </div>
      </section>
    </div>
  );
}