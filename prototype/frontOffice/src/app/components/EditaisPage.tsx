import { FileText, ChevronRight, Clock, Calendar, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '@/app/components/DatePicker';
import { EditalDetalhePage } from '@/app/components/EditalDetalhePage';

export function EditaisPage() {
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Abertos');
  const [selectedDate, setSelectedDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedEdital, setSelectedEdital] = useState<number | null>(null);

  const tipoOptions = [
    'Todos',
    'Carreira Científica',
    'Pesquisa',
    'Difusão do Conhecimento',
    'Extensão',
    'Inovação',
    'Chamadas Internacionais',
  ];

  const statusOptions = ['Abertos', 'Em Análise', 'Encerrados'];

  const editais = [
    {
      id: 1,
      numero: 'Edital Fapes Nº 27/2025',
      titulo: 'Apoio à Editoração e Publicação de Periódicos Científicos',
      descricao: 'Apoio financeiro para publicação de periódicos científicos de instituições do Espírito Santo.',
      prazo: '01/06/2026',
      status: 'Aberto',
      modalidade: 'Periódicos Científicos',
      inscritos: 42,
    },
    {
      id: 2,
      numero: 'Edital Fapes Nº 26/2025',
      titulo: 'Programa de Bolsas de Iniciação Científica - BPIG-IX',
      descricao: 'Concessão de bolsas de iniciação científica para estudantes de graduação.',
      prazo: '15/05/2026',
      status: 'Aberto',
      modalidade: 'Iniciação Científica',
      inscritos: 156,
    },
    {
      id: 3,
      numero: 'Edital Fapes Nº 25/2025',
      titulo: 'Apoio a Projetos de Pesquisa Aplicada em Inovação Tecnológica',
      descricao: 'Financiamento de projetos de pesquisa aplicada voltados para inovação tecnológica.',
      prazo: '30/04/2026',
      status: 'Aberto',
      modalidade: 'Pesquisa Aplicada',
      inscritos: 78,
    },
    {
      id: 4,
      numero: 'Edital Fapes Nº 24/2025',
      titulo: 'Programa de Apoio ao Desenvolvimento Científico Regional',
      descricao: 'Apoio a projetos de desenvolvimento científico em municípios do interior do estado.',
      prazo: '20/04/2026',
      status: 'Em análise',
      modalidade: 'Desenvolvimento Regional',
      inscritos: 34,
    },
    {
      id: 5,
      numero: 'Edital Fapes Nº 23/2025',
      titulo: 'Bolsas de Mestrado e Doutorado - PPG-ES',
      descricao: 'Concessão de bolsas para programas de pós-graduação stricto sensu.',
      prazo: '10/03/2026',
      status: 'Encerrado',
      modalidade: 'Pós-Graduação',
      inscritos: 203,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Em análise':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Encerrado':
        return { bg: 'rgba(115, 115, 115, 0.1)', color: '#737373', border: 'rgba(115, 115, 115, 0.3)' };
      default:
        return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' };
    }
  };

  // If an edital is selected, show the detail page
  if (selectedEdital !== null) {
    const edital = editais.find((e) => e.id === selectedEdital);
    if (edital) {
      return (
        <EditalDetalhePage
          edital={edital}
          onBack={() => setSelectedEdital(null)}
        />
      );
    }
  }

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div 
                style={{ 
                  padding: '0.5rem',
                  backgroundColor: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={20} style={{ color: 'var(--background)' }} />
              </div>
              <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
                Editais
              </h1>
            </div>
            <p 
              style={{ 
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                margin: 0,
                marginLeft: '48px',
              }}
            >
              Acompanhe as chamadas e se inscreva.
            </p>
          </div>
          
          {/* Botão Demanda Induzida */}
          <button
            className="px-6 py-2.5 transition-all"
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
            Demanda Induzida
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          marginBottom: '2rem',
        }}
      />

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar editais..."
            className="w-full px-4 py-2 border transition-colors"
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
            }}
          />
        </div>

        {/* Status Buttons */}
        <div className="relative" style={{ minWidth: '200px' }}>
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
          <button
            className="w-full px-4 py-2 transition-colors flex items-center justify-between"
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <span>{selectedStatus}</span>
            <ChevronDown size={16} style={{ flexShrink: 0 }} />
          </button>
          {isStatusDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 overflow-hidden"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                zIndex: 50,
              }}
            >
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className="w-full px-4 py-2 text-left transition-colors"
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    cursor: 'pointer',
                    backgroundColor: selectedStatus === status ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedStatus !== status) {
                      e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 5%, transparent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedStatus !== status) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    } else {
                      e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)';
                    }
                  }}
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tipo Dropdown */}
        <div className="relative" style={{ minWidth: '200px' }}>
          <label
            style={{
              display: 'block',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: '0.5rem',
            }}
          >
            Tipo
          </label>
          <button
            className="w-full px-4 py-2 transition-colors flex items-center justify-between"
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedTipo}</span>
            <ChevronDown size={16} style={{ flexShrink: 0 }} />
          </button>
          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 overflow-hidden"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                zIndex: 50,
              }}
            >
              {tipoOptions.map((tipo) => (
                <button
                  key={tipo}
                  className="w-full px-4 py-2 text-left transition-colors"
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    cursor: 'pointer',
                    backgroundColor: selectedTipo === tipo ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTipo !== tipo) {
                      e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 5%, transparent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTipo !== tipo) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    } else {
                      e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)';
                    }
                  }}
                  onClick={() => {
                    setSelectedTipo(tipo);
                    setIsDropdownOpen(false);
                  }}
                >
                  {tipo}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Picker */}
        <div className="relative" style={{ minWidth: '200px' }}>
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
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Todos"
            className="w-full px-4 py-2 transition-colors flex items-center justify-between"
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          />
        </div>
      </div>

      {/* Editais List */}
      <div className="space-y-4">
        {editais.map((edital) => {
          const statusColors = getStatusColor(edital.status);
          
          return (
            <a
              key={edital.id}
              href="#"
              className="group block"
              style={{
                textDecoration: 'none',
              }}
              onClick={() => setSelectedEdital(edital.id)}
            >
              <div
                className="p-5 transition-all"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, transparent)';
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary) 25%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 3%, transparent)';
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary) 12%, transparent)';
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    {/* Número e Status */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        style={{
                          color: 'var(--primary)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                        }}
                      >
                        {edital.numero}
                      </span>
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
                        {edital.status}
                      </span>
                    </div>

                    {/* Título */}
                    <h1
                      style={{
                        color: 'var(--foreground)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {edital.titulo}
                    </h1>

                    {/* Descrição */}
                    <p
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                        marginBottom: '1rem',
                      }}
                    >
                      {edital.descricao}
                    </p>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} style={{ color: 'var(--muted-foreground)' }} />
                        <span
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-normal)',
                          }}
                        >
                          Inscrições até {edital.prazo}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} style={{ color: 'var(--muted-foreground)' }} />
                        <span
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-normal)',
                          }}
                        >
                          {edital.inscritos} inscritos
                        </span>
                      </div>
                      <span
                        className="inline-flex items-center px-2.5 py-1"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                          color: 'var(--primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {edital.modalidade}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div
                    className="transition-transform self-end md:self-auto"
                    style={{
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Empty State Message - Hidden when there are results */}
      {editais.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
          }}
        >
          <FileText size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }} />
          <p
            style={{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-normal)',
              textAlign: 'center',
            }}
          >
            Nenhum edital encontrado
          </p>
        </div>
      )}
    </div>
  );
}