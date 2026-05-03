import { CheckCircle, DollarSign, Search, Calendar, ChevronDown, ChevronRight, RotateCcw, Upload } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/app/components/ui/pagination';
import { DatePicker } from '@/app/components/DatePicker';
import { Dropdown } from '@/app/components/Dropdown';

interface PrestacaoContasFinanceiraProps {
  onBack?: () => void;
  onNavigateToDetails?: (payment: any) => void;
}

export function PrestacaoContasFinanceira({ onBack, onNavigateToDetails }: PrestacaoContasFinanceiraProps) {
  const { t } = useLanguage();
  const [showBreakdown, setShowBreakdown] = useState<'consumed' | 'remaining' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [associatedEstornos, setAssociatedEstornos] = useState<Record<string, boolean>>({});
  const [attachedDevolucoes, setAttachedDevolucoes] = useState<Record<string, boolean>>({});
  const [associatedDevolucoes, setAssociatedDevolucoes] = useState<Record<string, boolean>>({});

  const categoriesConsumed = [
    { name: 'Material Permanente', value: 'R$ 200.000,00' },
    { name: 'Material de Consumo', value: 'R$ 31.606,15' },
    { name: 'Passagem', value: 'R$ 31.606,15' },
    { name: 'Diária', value: 'R$ 0,00' },
    { name: 'Pessoal', value: 'R$ 0,00' },
  ];

  const categoriesRemaining = [
    { name: 'Material Permanente', value: 'R$ 80.000,00' },
    { name: 'Material de Consumo', value: 'R$ 12.642,46' },
    { name: 'Passagem', value: 'R$ 12.642,46' },
    { name: 'Diária', value: 'R$ 0,00' },
    { name: 'Pessoal', value: 'R$ 0,00' },
  ];

  const payments = [
    { tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 3.456,70', data: '27/02/2026 - 09:35', cnpj: 'Magazine Luiza', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
    { tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 4.567,90', data: '25/02/2026 - 10:05', cnpj: 'Magazine Luiza', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
    { tipo: 'Crédito de terceiro', operacao: 'CREDITO', classificacao: 'ESTORNO', valor: 'R$ 1.250,00', data: '24/02/2026 - 15:10', cnpj: 'Fornecedor Alfa', status: 'Classificado', origemTerceiro: 'Fornecedor Alfa', debitoEstornado: 'TR-2026-041', creditoEstorno: 'TR-2026-052', prestacaoAssociada: 'PC-2026-013', situacaoPrestacao: 'Finalizada', modoAssociacao: 'Ajuste pós-prestação', situacaoDebito: 'Sem prestação de contas', efeitoLiquido: 'R$ 0,00', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
    { tipo: 'Pix recebido', operacao: 'CREDITO', classificacao: 'DEVOLUCAO', valor: 'R$ 400,00', data: '24/02/2026 - 16:35', cnpj: 'Coordenador do projeto', status: 'Comprovar', debitoOriginal: 'TR-2026-045', valorOriginal: 'R$ 1.250,00', valorDevolvido: 'R$ 400,00', valorResidual: 'R$ 850,00', prestacaoAssociada: 'PC-2026-013', modoAssociacao: 'Ajuste conciliatório', comprovanteObrigatorio: 'Pix de devolução', statusColor: { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.3)' } },
    { tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 789,00', data: '23/02/2026 - 12:50', cnpj: 'Kalunga', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
    { tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.100,00', data: '22/02/2026 - 11:20', cnpj: 'Kalunga', status: 'Revisar', statusColor: { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.3)' } },
    { tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 1.890,50', data: '20/02/2026 - 11:45', cnpj: 'Americanas', status: 'Reprovado', statusColor: { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: 'rgba(239, 68, 68, 0.3)' } },
    { tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.345,60', data: '19/02/2026 - 17:25', cnpj: 'Americanas', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
    { tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 567,80', data: '18/02/2026 - 16:45', cnpj: 'Americanas', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
    { tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.567,30', data: '15/02/2026 - 16:00', cnpj: 'Amazon', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
    { tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 5.234,20', data: '14/02/2026 - 08:40', cnpj: 'Amazon', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
    { tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 3.890,00', data: '12/02/2026 - 09:15', cnpj: 'Amazon', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
  ];

  const estornos = payments.filter((payment) => payment.classificacao === 'ESTORNO');
  const devolucoes = payments.filter((payment) => payment.classificacao === 'DEVOLUCAO');

  return (
    <div 
      className="w-full px-4 md:px-8 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="p-2 transition-colors"
          style={{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
          }}
        >
          <DollarSign size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
          Prestação de Contas Financeira
        </h1>
      </div>

      {/* Subtitle */}
      <p 
        className="mb-6"
        style={{ 
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
        }}
      >
        Comprove os pagamentos realizados na conta bancária do seu projeto. As informações aparecem após 1 dia útil.
      </p>

      {/* Divider */}
      <div 
        className="mb-8"
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
        }}
      />

      {/* Controle de Gastos Section */}
      <section className="mb-8">
        {/* Title */}
        <h1 
          style={{ 
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: '0.5rem',
          }}
        >
          Controle de Gastos
        </h1>

        {/* Subtitle */}
        <p 
          style={{ 
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            marginBottom: '2rem',
          }}
        >
          Acompanhe o valor que já gastou e o valor que ainda possui em Custeio e Capital. Clique no gráfico e veja o valor para cada categoria.
        </p>

        {/* Progress Card */}
        <div 
          className="p-6"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
            borderRadius: 'var(--radius)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
            borderLeft: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
          }}
        >
          {/* Progress Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 
                style={{ 
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: '0.25rem',
                }}
              >
                Progresso do Orçamento
              </h3>
              <p 
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  margin: 0,
                }}
              >
                75% utilizado
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p 
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  marginBottom: '0.25rem',
                }}
              >
                Valor gasto
              </p>
              <p 
                style={{ 
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  margin: 0,
                }}
              >
                R$ 75.000
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            style={{
              width: '100%',
              position: 'relative',
              marginBottom: '0.75rem',
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
            onMouseEnter={() => setShowBreakdown('remaining')}
            onMouseLeave={() => setShowBreakdown(null)}
          >
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                borderRadius: '9999px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div 
                style={{
                  width: '75%',
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease',
                  position: 'relative',
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setShowBreakdown('consumed');
                }}
                onMouseLeave={() => setShowBreakdown('remaining')}
              />
            </div>

            {/* Category Breakdown - Remaining (Light Blue Background) */}
            {showBreakdown === 'remaining' && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 0.75rem)',
                  left: `${tooltipPosition.x}px`,
                  transform: 'translateX(-50%)',
                  width: 'max-content',
                  maxWidth: '400px',
                  backgroundColor: 'var(--background)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                  padding: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                {/* Breakdown Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  />
                  <h4 
                    style={{ 
                      color: 'var(--primary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      margin: 0,
                    }}
                  >
                    Total Restante por Categoria:
                  </h4>
                </div>

                {/* Category List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categoriesRemaining.map((category, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto auto',
                        gap: '1.5rem',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span 
                        style={{ 
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.name}
                      </span>
                      <span 
                        style={{ 
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Breakdown - Consumed (Dark Blue Filled Part) */}
            {showBreakdown === 'consumed' && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 0.75rem)',
                  left: `${tooltipPosition.x}px`,
                  transform: 'translateX(-50%)',
                  width: 'max-content',
                  maxWidth: '400px',
                  backgroundColor: 'var(--background)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                  padding: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                {/* Breakdown Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  />
                  <h4 
                    style={{ 
                      color: 'var(--primary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      margin: 0,
                    }}
                  >
                    Total Consumido por Categoria:
                  </h4>
                </div>

                {/* Category List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categoriesConsumed.map((category, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto auto',
                        gap: '1.5rem',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span 
                        style={{ 
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.name}
                      </span>
                      <span 
                        style={{ 
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Total Value */}
          <div style={{ textAlign: 'right' }}>
            <p 
              style={{ 
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                margin: 0,
              }}
            >
              Total: R$ 100.000
            </p>
          </div>
        </div>
      </section>

      {/* Pagamentos Realizados Section */}
      <section className="mb-8">
        {/* Title */}
        <h1
          style={{
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: '0.5rem',
          }}
        >
          Extrato do Projeto
        </h1>

        {/* Subtitle */}
        <p 
          style={{ 
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            marginBottom: '2rem',
          }}
        >
          Clique na linha e verifique os detalhes do pagamento. Se você deseja fazer uma compra de um item não presente no seu edital, primeiro faça a Solicitação de Remanejamento de Recursos.
        </p>

        {/* Filters */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {/* Search Field */}
          <div style={{ position: 'relative' }}>
            <label 
              style={{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }}
            >
              Pesquisar
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar"
                style={{
                  width: '100%',
                  paddingLeft: '0.75rem',
                  paddingRight: '2.5rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--ring)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-foreground)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Date Picker */}
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
              onChange={setSelectedDate}
              placeholder="Todos"
            />
          </div>

          {/* Status Dropdown */}
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
                { value: '', label: 'Todos' },
                { value: 'aprovado', label: 'Aprovado' },
                { value: 'pendente', label: 'Pendente' },
                { value: 'rejeitado', label: 'Rejeitado' },
              ]}
              placeholder="Todos"
            />
          </div>

          {/* Category Dropdown */}
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
              Categoria
            </label>
            <Dropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: '', label: 'Todos' },
                { value: 'material-permanente', label: 'Material Permanente' },
                { value: 'material-consumo', label: 'Material de Consumo' },
                { value: 'passagem', label: 'Passagem' },
                { value: 'diaria', label: 'Diária' },
                { value: 'pessoal', label: 'Pessoal' },
              ]}
              placeholder="Todos"
            />
          </div>
        </div>
      </section>

      {estornos.length > 0 && (
        <section className="mb-8">
          <div
            className="p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, rgb(34, 197, 94) 8%, transparent)',
              border: '1px solid color-mix(in srgb, rgb(34, 197, 94) 24%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="p-2"
                style={{
                  color: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <RotateCcw size={18} />
              </div>
              <div>
                <h2 style={{ color: 'var(--foreground)', margin: 0, fontSize: 'var(--text-lg)' }}>
                  Estornos identificados
                </h2>
                <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0', fontSize: 'var(--text-sm)' }}>
                  Créditos de terceiros que anulam débitos anteriores de mesmo valor. Podem ser associados a uma prestação já feita como ajuste conciliatório.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {estornos.map((estorno) => {
                const estornoKey = `${estorno.data}-${estorno.valor}`;
                const isAssociated = Boolean(associatedEstornos[estornoKey]);

                return (
                  <div
                    key={estornoKey}
                    className="p-4"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: `1px solid ${isAssociated ? 'rgba(34, 197, 94, 0.45)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                      Terceiro
                    </div>
                    <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.75rem' }}>
                      {estorno.origemTerceiro}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Crédito</div>
                        <div style={{ color: 'rgb(34, 197, 94)', fontWeight: 'var(--font-weight-semibold)' }}>{estorno.valor}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Débito pareado</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{estorno.debitoEstornado}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Classificação</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{estorno.classificacao}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Situação do débito</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{estorno.situacaoDebito}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Prestação</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{estorno.prestacaoAssociada}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Efeito líquido</div>
                        <div style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>{estorno.efeitoLiquido}</div>
                      </div>
                    </div>

                    {isAssociated && (
                      <div
                        className="mt-4 p-3"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: 'var(--radius)',
                          color: 'rgb(34, 197, 94)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Estorno associado à {estorno.prestacaoAssociada} como {estorno.modoAssociacao}.
                      </div>
                    )}

                    <button
                      type="button"
                      className="mt-4 inline-flex items-center justify-center gap-2 px-3 py-2"
                      aria-pressed={isAssociated}
                      onClick={() =>
                        setAssociatedEstornos((current) => ({
                          ...current,
                          [estornoKey]: true,
                        }))
                      }
                      style={{
                        backgroundColor: isAssociated ? 'rgba(34, 197, 94, 0.14)' : 'var(--primary)',
                        color: isAssociated ? 'rgb(34, 197, 94)' : 'var(--primary-foreground)',
                        border: `1px solid ${isAssociated ? 'rgba(34, 197, 94, 0.35)' : 'var(--primary)'}`,
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        width: '100%',
                        cursor: isAssociated ? 'default' : 'pointer',
                      }}
                    >
                      {isAssociated ? <CheckCircle size={16} /> : <RotateCcw size={16} />}
                      {isAssociated ? 'Associado à prestação existente' : 'Associar à prestação existente'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-4 p-4"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card) 75%, transparent)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                    Débito da prestação
                  </div>
                  <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>TR-2026-041 · R$ 1.250,00</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                    Crédito de estorno
                  </div>
                  <div style={{ color: 'rgb(34, 197, 94)', fontWeight: 'var(--font-weight-semibold)' }}>TR-2026-052 · R$ 1.250,00</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                    Efeito na conciliação
                  </div>
                  <div style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>R$ 0,00</div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                    Modo
                  </div>
                  <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>Ajuste pós-prestação</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {devolucoes.length > 0 && (
        <section className="mb-8">
          <div
            className="p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, rgb(234, 179, 8) 8%, transparent)',
              border: '1px solid color-mix(in srgb, rgb(234, 179, 8) 24%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="p-2"
                style={{
                  color: 'rgb(234, 179, 8)',
                  backgroundColor: 'rgba(234, 179, 8, 0.12)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <Upload size={18} />
              </div>
              <div>
                <h2 style={{ color: 'var(--foreground)', margin: 0, fontSize: 'var(--text-lg)' }}>
                  Devoluções do coordenador
                </h2>
                <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0', fontSize: 'var(--text-sm)' }}>
                  Créditos feitos pelo coordenador para devolver valores integrais ou parciais. Exigem comprovante, como Pix, TED ou boleto.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {devolucoes.map((devolucao) => {
                const devolucaoKey = `${devolucao.data}-${devolucao.valor}`;
                const hasAttachment = Boolean(attachedDevolucoes[devolucaoKey]);
                const isAssociated = Boolean(associatedDevolucoes[devolucaoKey]);

                return (
                  <div
                    key={devolucaoKey}
                    className="p-4"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: `1px solid ${isAssociated ? 'rgba(34, 197, 94, 0.45)' : hasAttachment ? 'rgba(234, 179, 8, 0.45)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                      Origem do crédito
                    </div>
                    <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.75rem' }}>
                      {devolucao.cnpj}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Valor devolvido</div>
                        <div style={{ color: 'rgb(34, 197, 94)', fontWeight: 'var(--font-weight-semibold)' }}>{devolucao.valorDevolvido}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Compra original</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{devolucao.debitoOriginal}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Valor original</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{devolucao.valorOriginal}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Saldo residual</div>
                        <div style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>{devolucao.valorResidual}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Prestação</div>
                        <div style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>{devolucao.prestacaoAssociada}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Comprovante</div>
                        <div style={{ color: hasAttachment ? 'rgb(34, 197, 94)' : 'rgb(234, 179, 8)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {hasAttachment ? 'Anexado' : devolucao.comprovanteObrigatorio}
                        </div>
                      </div>
                    </div>

                    {isAssociated && (
                      <div
                        className="mt-4 p-3"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: 'var(--radius)',
                          color: 'rgb(34, 197, 94)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        Devolução associada à {devolucao.prestacaoAssociada}. Saldo residual: {devolucao.valorResidual}.
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2"
                        aria-pressed={hasAttachment}
                        onClick={() =>
                          setAttachedDevolucoes((current) => ({
                            ...current,
                            [devolucaoKey]: true,
                          }))
                        }
                        style={{
                          backgroundColor: hasAttachment ? 'rgba(34, 197, 94, 0.14)' : 'transparent',
                          color: hasAttachment ? 'rgb(34, 197, 94)' : 'var(--foreground)',
                          border: `1px solid ${hasAttachment ? 'rgba(34, 197, 94, 0.35)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          width: '100%',
                        }}
                      >
                        {hasAttachment ? <CheckCircle size={16} /> : <Upload size={16} />}
                        {hasAttachment ? 'Comprovante anexado' : 'Anexar comprovante'}
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2"
                        aria-pressed={isAssociated}
                        disabled={!hasAttachment || isAssociated}
                        onClick={() =>
                          setAssociatedDevolucoes((current) => ({
                            ...current,
                            [devolucaoKey]: true,
                          }))
                        }
                        style={{
                          backgroundColor: isAssociated
                            ? 'rgba(34, 197, 94, 0.14)'
                            : hasAttachment
                              ? 'var(--primary)'
                              : 'transparent',
                          color: isAssociated
                            ? 'rgb(34, 197, 94)'
                            : hasAttachment
                              ? 'var(--primary-foreground)'
                              : 'var(--muted-foreground)',
                          border: `1px solid ${isAssociated ? 'rgba(34, 197, 94, 0.35)' : hasAttachment ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          width: '100%',
                          cursor: !hasAttachment || isAssociated ? 'not-allowed' : 'pointer',
                          opacity: !hasAttachment && !isAssociated ? 0.7 : 1,
                        }}
                      >
                        {isAssociated ? <CheckCircle size={16} /> : <RotateCcw size={16} />}
                        {isAssociated ? 'Devolução associada' : hasAttachment ? 'Associar à prestação' : 'Anexe para associar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Payments List */}
      <div className="space-y-4 mb-8">
        {payments.map((payment, index) => (
          <div 
            key={index}
            className="p-5"
            onClick={() => {
              if (payment.status === 'Pendente' || payment.status === 'Em Validação' || payment.status === 'Reprovado' || payment.status === 'Revisar' || payment.status === 'Validado' || payment.status === 'Classificado') {
                if (onNavigateToDetails) {
                  onNavigateToDetails(payment);
                }
              }
            }}
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: (payment.status === 'Pendente' || payment.status === 'Em Validação' || payment.status === 'Reprovado' || payment.status === 'Revisar' || payment.status === 'Validado' || payment.status === 'Classificado') ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (payment.status === 'Pendente' || payment.status === 'Em Validação' || payment.status === 'Reprovado' || payment.status === 'Revisar' || payment.status === 'Validado' || payment.status === 'Classificado') {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--card)';
            }}
          >
            {/* Desktop Layout */}
            <div className="hidden md:block">
              {/* Grid Layout with 12 columns */}
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Pagamento */}
                <div className="col-span-2">
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Movimento
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }}>
                    {payment.tipo}
                  </div>
                  <div style={{ color: payment.operacao === 'CREDITO' ? 'rgb(34, 197, 94)' : 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem', whiteSpace: 'nowrap' }}>
                    {payment.operacao} · {payment.classificacao}
                  </div>
                </div>

                {/* Valor */}
                <div className="col-span-2" style={{ marginLeft: '3rem' }}>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Valor
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                    {payment.valor}
                  </div>
                </div>

                {/* Data */}
                <div className="col-span-2" style={{ marginLeft: '5rem' }}>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Data
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                    {payment.data}
                  </div>
                </div>

                {/* CNPJ */}
                <div className="col-span-3" style={{ marginLeft: '10rem' }}>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Terceiro
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                    {payment.cnpj}
                  </div>
                  {payment.classificacao === 'ESTORNO' && (
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem', whiteSpace: 'nowrap' }}>
                      Associa {payment.creditoEstorno} ao débito {payment.debitoEstornado} · {payment.modoAssociacao}
                    </div>
                  )}
                  {payment.classificacao === 'DEVOLUCAO' && (
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem', whiteSpace: 'nowrap' }}>
                      Devolve {payment.valorDevolvido} da compra {payment.debitoOriginal} · residual {payment.valorResidual}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2" style={{ marginLeft: '1rem' }}>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Status
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1"
                    style={{
                      backgroundColor: payment.statusColor.bg,
                      color: payment.statusColor.color,
                      border: `1px solid ${payment.statusColor.border}`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {payment.status}
                  </span>
                </div>

                {/* Seta */}
                <div className="col-span-1 flex justify-end">
                  {(payment.status === 'Pendente' || payment.status === 'Em Validação' || payment.status === 'Reprovado' || payment.status === 'Revisar' || payment.status === 'Validado' || payment.status === 'Classificado') && (
                    <ChevronRight size={20} style={{ color: 'var(--muted-foreground)' }} />
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Header com Tipo e Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Movimento
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    {payment.tipo}
                  </div>
                  <div style={{ color: payment.operacao === 'CREDITO' ? 'rgb(34, 197, 94)' : 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem' }}>
                    {payment.operacao} · {payment.classificacao}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center px-2.5 py-1"
                    style={{
                      backgroundColor: payment.statusColor.bg,
                      color: payment.statusColor.color,
                      border: `1px solid ${payment.statusColor.border}`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {payment.status}
                  </span>
                  {(payment.status === 'Pendente' || payment.status === 'Em Validação' || payment.status === 'Reprovado' || payment.status === 'Revisar' || payment.status === 'Validado' || payment.status === 'Classificado') && (
                    <ChevronRight size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  )}
                </div>
              </div>

              {/* Grid de Informações */}
              <div className="grid grid-cols-2 gap-4">
                {/* Valor */}
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Valor
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    {payment.valor}
                  </div>
                </div>

                {/* Data */}
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Data
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    {payment.data}
                  </div>
                </div>
              </div>

              {/* CNPJ - Linha Completa */}
              <div className="mt-4">
                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                  Terceiro
                </div>
                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                  {payment.cnpj}
                </div>
                {payment.classificacao === 'ESTORNO' && (
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem' }}>
                    Associa {payment.creditoEstorno} ao débito {payment.debitoEstornado} · {payment.modoAssociacao}
                  </div>
                )}
                {payment.classificacao === 'DEVOLUCAO' && (
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem' }}>
                    Devolve {payment.valorDevolvido} da compra {payment.debitoOriginal} · residual {payment.valorResidual}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                isActive
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  minWidth: '2.5rem',
                  textDecoration: 'none',
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  minWidth: '2.5rem',
                  textDecoration: 'none',
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
              >
                Próximo
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

    </div>
  );
}
