import { ClipboardList, ChevronDown, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dropdown } from '@/app/components/Dropdown';

export function CertificatesPage() {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'declaracao' | 'informe' | 'termo' | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024');

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
          <ClipboardList size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
          Solicitações
        </h1>
      </div>

      {/* Subtitle */}
      <p 
        className="mb-8"
        style={{ 
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
        }}
      >
        Selecione uma opção e emita comprovantes de forma automática.
      </p>

      {/* Divider */}
      <div 
        className="my-8"
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
        }}
      />

      {/* Cards Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Termo de Compromisso */}
        <div 
          onClick={() => setSelectedOption(selectedOption === 'termo' ? null : 'termo')}
          className="p-5 transition-all cursor-pointer flex flex-col h-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: selectedOption === 'termo' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: selectedOption === 'termo' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: selectedOption === 'termo' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: selectedOption === 'termo' ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '180px',
          }}
        >
          <h3 
            style={{ 
              color: 'var(--foreground)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--text-sm)',
              margin: '0 0 1rem 0',
            }}
          >
            Termo de Compromisso
          </h3>
          <p 
            style={{ 
              color: 'var(--muted-foreground)',
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              lineHeight: '1.7',
              margin: 0,
            }}
          >
            O Coordenador e o Bolsista devem aceitar o documento antes do início das atividades.
          </p>
        </div>

        {/* Card 2: Declaração de Participação no Projeto */}
        <div 
          onClick={() => setSelectedOption(selectedOption === 'declaracao' ? null : 'declaracao')}
          className="p-5 transition-all cursor-pointer flex flex-col h-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: selectedOption === 'declaracao' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: selectedOption === 'declaracao' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: selectedOption === 'declaracao' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: selectedOption === 'declaracao' ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '180px',
          }}
        >
          <h3 
            style={{ 
              color: 'var(--foreground)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--text-sm)',
              margin: '0 0 1rem 0',
            }}
          >
            Declaração de Participação no Projeto
          </h3>
          <p 
            style={{ 
              color: 'var(--muted-foreground)',
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              lineHeight: '1.7',
              margin: 0,
            }}
          >
            Este documento comprova sua participação no projeto de pesquisa como bolsista. Inclui informações sobre o projeto, período de vigência e suas atividades desenvolvidas.
          </p>
        </div>

        {/* Card 3: Informe de Rendimentos */}
        <div 
          onClick={() => setSelectedOption(selectedOption === 'informe' ? null : 'informe')}
          className="p-5 transition-all cursor-pointer flex flex-col h-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: selectedOption === 'informe' ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '180px',
          }}
        >
          <h3 
            style={{ 
              color: 'var(--foreground)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--text-sm)',
              margin: '0 0 1rem 0',
            }}
          >
            Informe de Rendimentos
          </h3>
          <p 
            style={{ 
              color: 'var(--muted-foreground)',
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              lineHeight: '1.7',
              margin: '0 0 1rem 0',
            }}
          >
            Gere seu IR para a declaração do Imposto de Renda da Pessoa Física (DIRPF).
          </p>
          <label 
            style={{ 
              color: 'var(--muted-foreground)',
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Selecione o ano:
          </label>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="w-full md:w-[200px]">
              <Dropdown
                value={selectedYear}
                onChange={setSelectedYear}
                options={[
                  { value: '2024', label: '2024' },
                  { value: '2023', label: '2023' },
                  { value: '2022', label: '2022' },
                  { value: '2021', label: '2021' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Generate Document Button - Appears when a card is selected */}
      {selectedOption && (
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 transition-colors flex items-center gap-2"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <FileText size={16} />
            <span>Gerar Documento</span>
          </button>
        </div>
      )}
    </div>
  );
}