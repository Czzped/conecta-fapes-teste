import { RefreshCw, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dropdown } from '@/app/components/Dropdown';
import { BolsaCard } from '@/app/components/BolsaCard';
import { Save } from 'lucide-react';

export function RemanejamentoPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'interno' | 'fapes' | 'bolsa'>('interno');
  const [fromCategory, setFromCategory] = useState('');
  const [toCategory, setToCategory] = useState('');
  const [toItem, setToItem] = useState('');
  const [transferValue, setTransferValue] = useState('');
  const [justification, setJustification] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  // Fapes states
  const [fapesType, setFapesType] = useState<'category' | 'item'>('item');
  const [newCategoryType, setNewCategoryType] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [fapesFromCategory, setFapesFromCategory] = useState('');
  const [fapesValue, setFapesValue] = useState('');
  const [fapesJustification, setFapesJustification] = useState('');

  // Bolsa states - cotas desejadas
  const [quotasBpigX, setQuotasBpigX] = useState(0);
  const [quotasBpigIX, setQuotasBpigIX] = useState(0);
  const [quotasBpigVIII, setQuotasBpigVIII] = useState(0);
  const [quotasBpigVII, setQuotasBpigVII] = useState(0);
  const [quotasBpigVI, setQuotasBpigVI] = useState(0);
  const [quotasBpigV, setQuotasBpigV] = useState(0);
  const [quotasBpigIV, setQuotasBpigIV] = useState(0);
  const [quotasBpigIII, setQuotasBpigIII] = useState(0);
  const [quotasBpigII, setQuotasBpigII] = useState(0);
  const [quotasBpigI, setQuotasBpigI] = useState(0);

  // Available categories for dropdowns
  const availableCategories = [
    { value: 'material-permanente', label: 'Material Permanente' },
    { value: 'material-consumo', label: 'Material de Consumo' },
    { value: 'passagem', label: 'Passagem' },
    { value: 'diaria', label: 'Diária' },
    { value: 'pessoa-fisica', label: 'Pessoa Física' },
    { value: 'pessoa-juridica', label: 'Pessoa Jurídica' },
  ];

  // Mapping between dropdown values and category data
  const categoryMapping: { [key: string]: string } = {
    'material-permanente': 'Material Permanente',
    'material-consumo': 'Material de Consumo',
    'passagem': 'Passagem',
    'diaria': 'Diária',
    'pessoa-fisica': 'Pessoa Física',
    'pessoa-juridica': 'Pessoa Jurídica',
    'servicos-terceiros': 'Serviços de Terceiros',
    'equipamentos': 'Equipamentos',
    'bolsas': 'Bolsas',
  };

  // Helper function to get category data by value
  const getCategoryData = (categoryValue: string) => {
    const categoryName = categoryMapping[categoryValue];
    return categories.find(cat => cat.name === categoryName);
  };

  // Helper function to get dropdown options with available values
  const getCategoryOptions = (excludeCategory?: string) => {
    return availableCategories
      .filter(cat => cat.value !== excludeCategory)
      .map(cat => {
        const categoryData = getCategoryData(cat.value);
        return {
          value: cat.value,
          label: cat.label,
          info: categoryData ? `Disponível: ${categoryData.available}` : undefined,
        };
      });
  };



  // Helper function to parse currency string to number
  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    // Remove R$, spaces, and dots (thousands separator), then replace comma with dot
    const cleaned = value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // Helper function to format number to currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const categories = [
    {
      id: 1,
      name: 'Material Permanente',
      approved: 'R$ 486.500,00',
      used: 'R$ 315.085,17',
      available: 'R$ 171.434,83',
      progress: 64.8,
      history: [
        {
          date: '08/01/2026',
          title: 'Transferência de R$ 50.000,00 para Material de Consumo',
          description: 'Remanejamento aprovado para compra de insumos laboratoriais',
        },
        {
          date: '15/12/2025',
          title: 'Transferência de R$ 25.000,00 para Passagem',
          description: 'Remanejamento aprovado para participação em congresso internacional',
        },
      ],
    },
    {
      id: 2,
      name: 'Material de Consumo',
      approved: 'R$ 260.740,00',
      used: 'R$ 2.630,72',
      available: 'R$ 258.109,28',
      progress: 10,
      history: [
        {
          date: '08/01/2026',
          title: 'Recebimento de R$ 50.000,00 de Material Permanente',
          description: 'Remanejamento aprovado para compra de insumos laboratoriais',
        },
      ],
    },
    {
      id: 3,
      name: 'Passagem',
      approved: 'R$ 73.200,00',
      used: 'R$ 695,74',
      available: 'R$ 72.504,26',
      progress: 1.0,
      history: [
        {
          date: '15/12/2025',
          title: 'Recebimento de R$ 25.000,00 de Material Permanente',
          description: 'Remanejamento aprovado para participação em congresso internacional',
        },
      ],
    },
    {
      id: 4,
      name: 'Diária',
      approved: 'R$ 56.640,00',
      used: 'R$ 0,00',
      available: 'R$ 56.640,00',
      progress: 0.0,
      history: [],
    },
    {
      id: 5,
      name: 'Pessoa Jurídica',
      approved: 'R$ 1.736.100,00',
      used: 'R$ 83.392,17',
      available: 'R$ 1.652.707,83',
      progress: 4.8,
      history: [],
    },
    {
      id: 6,
      name: 'Pessoa Física',
      approved: 'R$ 0,00',
      used: 'R$ 0,00',
      available: 'R$ 0,00',
      progress: 0.0,
      history: [],
    },
  ];

  const handleClear = () => {
    setFromCategory('');
    setToCategory('');
    setToItem('');
    setTransferValue('');
    setJustification('');
  };

  const handleConfirm = () => {
    // Get category names for the toast message
    const fromCategoryName = categoryMapping[fromCategory];
    const toCategoryName = categoryMapping[toCategory];
    
    // Show success toast with transfer details
    toast.success(`Transferência de ${transferValue} de ${fromCategoryName} para ${toCategoryName} realizada com sucesso!`);
    
    // Clear all fields after successful transfer
    handleClear();
  };

  // Check if all required fields are filled for Interno tab
  const isInternoFormValid = Boolean(
    fromCategory && 
    toCategory && 
    toItem && 
    transferValue && 
    justification
  );

  const handleFapesClear = () => {
    setNewCategoryType('');
    setNewItemType('');
    setNewItemName('');
    setFapesFromCategory('');
    setFapesValue('');
    setFapesJustification('');
  };

  const handleFapesSubmit = () => {
    // Logic to submit Fapes request
    console.log('Fapes request submitted');
    toast.success('Solicitação enviada com sucesso!');
  };

  // Check if any quota has changed
  const hasQuotasChanged = () => {
    return quotasBpigX > 0 || quotasBpigIX > 0 || quotasBpigVIII > 0 || 
           quotasBpigVII > 0 || quotasBpigVI > 0 || quotasBpigV > 0 || 
           quotasBpigIV > 0 || quotasBpigIII > 0 || quotasBpigII > 0 || quotasBpigI > 0;
  };

  const handleSaveRemanejamento = () => {
    console.log('Remanejamento saved:', {
      'BPIG-X': quotasBpigX,
      'BPIG-IX': quotasBpigIX,
      'BPIG-VIII': quotasBpigVIII,
      'BPIG-VII': quotasBpigVII,
      'BPIG-VI': quotasBpigVI,
      'BPIG-V': quotasBpigV,
      'BPIG-IV': quotasBpigIV,
      'BPIG-III': quotasBpigIII,
      'BPIG-II': quotasBpigII,
      'BPIG-I': quotasBpigI,
    });
    toast.success('Remanejamento salvo com sucesso!');
  };

  return (
    <div className="w-full max-w-full px-4 md:px-8 py-8" style={{ overflowX: 'hidden' }}>
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
          <RefreshCw size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0, wordBreak: 'break-word' }}>
          Remanejamento de Recursos
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
          wordBreak: 'break-word',
        }}
      >
        Se você possui a categoria, o valor e o item aprovados, pode fazer o Remanejamento Interno de valores entre categorias sem solicitar a Fapes. Se deseja criar uma nova categoria ou item, faça a Solicitar Aprovação de Novo Item ou Nova Categoria.
      </p>

      {/* Tab Bar - Horizontal for Desktop, Vertical for Mobile */}
      
      {/* Desktop Tab Bar - Horizontal */}
      <div 
        className="hidden md:flex gap-6 mb-8 overflow-x-auto"
        style={{
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => setActiveTab('interno')}
          className="pb-3 transition-all"
          style={{
            color: activeTab === 'interno' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            marginBottom: '-1px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'interno' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Remanejamento Interno
        </button>
        <button
          onClick={() => setActiveTab('fapes')}
          className="pb-3 transition-all"
          style={{
            color: activeTab === 'fapes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            marginBottom: '-1px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'fapes' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Remanejamento Fapes
        </button>
        <button
          onClick={() => setActiveTab('bolsa')}
          className="pb-3 transition-all"
          style={{
            color: activeTab === 'bolsa' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            marginBottom: '-1px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bolsa' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Remanejamento de Bolsa
        </button>
      </div>

      {/* Mobile Tab Bar - Vertical */}
      <div 
        className="flex md:hidden flex-col mb-8"
        style={{
          borderLeft: '2px solid var(--border)',
        }}
      >
        <button
          onClick={() => setActiveTab('interno')}
          className="py-3 pl-4 transition-all text-left"
          style={{
            color: activeTab === 'interno' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            borderLeft: activeTab === 'interno' ? '2px solid var(--primary)' : '2px solid transparent',
            marginLeft: '-2px',
            cursor: 'pointer',
          }}
        >
          Remanejamento Interno
        </button>
        <button
          onClick={() => setActiveTab('fapes')}
          className="py-3 pl-4 transition-all text-left"
          style={{
            color: activeTab === 'fapes' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            borderLeft: activeTab === 'fapes' ? '2px solid var(--primary)' : '2px solid transparent',
            marginLeft: '-2px',
            cursor: 'pointer',
          }}
        >
          Remanejamento Fapes
        </button>
        <button
          onClick={() => setActiveTab('bolsa')}
          className="py-3 pl-4 transition-all text-left"
          style={{
            color: activeTab === 'bolsa' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            borderLeft: activeTab === 'bolsa' ? '2px solid var(--primary)' : '2px solid transparent',
            marginLeft: '-2px',
            cursor: 'pointer',
          }}
        >
          Remanejamento de Bolsa
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'interno' ? (
        <>
          <div
            className="p-4 md:p-6 lg:p-8 w-full max-w-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderRadius: 'var(--radius)',
              border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            }}
          >
            <h1
              className="mb-6"
              style={{
                color: 'var(--foreground)',
                margin: '0 0 1.5rem 0',
                wordBreak: 'break-word',
              }}
            >
              Transferir Valores Entre Categorias
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* De (Origem) */}
              <div>
                <label 
                  className="block mb-4"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  De (Origem)
                </label>
                
                <div className="mb-4">
                  <Dropdown
                    value={fromCategory}
                    onChange={setFromCategory}
                    options={getCategoryOptions(toCategory)}
                    placeholder="Selecione uma categoria"
                  />
                </div>

                <label 
                  className="block mb-2"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Valor a Transferir
                </label>
                <input
                  type="text"
                  value={transferValue}
                  onChange={(e) => setTransferValue(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full px-3 py-2.5"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Para (Destino) */}
              <div>
                <label 
                  className="block mb-4"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Para (Destino)
                </label>
                
                <div className="mb-4">
                  <Dropdown
                    value={toCategory}
                    onChange={setToCategory}
                    options={getCategoryOptions(fromCategory)}
                    placeholder="Selecione uma categoria"
                  />
                </div>

                <label 
                  className="block mb-2"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Informe para qual item irá o valor
                </label>
                <Dropdown
                  value={toItem}
                  onChange={setToItem}
                  options={[
                    { value: 'item1', label: 'Item 1' },
                    { value: 'item2', label: 'Item 2' },
                    { value: 'item3', label: 'Item 3' },
                  ]}
                  placeholder="Selecione um item"
                />
              </div>
            </div>

            {/* Resumo da Transferência */}
            {fromCategory && toCategory && transferValue && (
              <div className="mb-6">
                <label 
                  className="block mb-4"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Simulação
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From Category Summary */}
                  {(() => {
                    const fromCategoryData = getCategoryData(fromCategory);
                    if (!fromCategoryData) return null;

                    const currentAvailable = parseCurrency(fromCategoryData.available);
                    const transferAmount = parseCurrency(transferValue);
                    const afterTransfer = currentAvailable - transferAmount;

                    return (
                      <div 
                        className="p-4"
                        style={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                        }}
                      >
                        <div 
                          style={{ 
                            color: 'var(--foreground)', 
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            marginBottom: '0.75rem',
                          }}
                        >
                          {fromCategoryData.name}
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                            Disponível atual:
                          </span>
                          <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {fromCategoryData.available}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                            Após transferência:
                          </span>
                          <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {formatCurrency(afterTransfer)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* To Category Summary */}
                  {(() => {
                    const toCategoryData = getCategoryData(toCategory);
                    if (!toCategoryData) return null;

                    const currentAvailable = parseCurrency(toCategoryData.available);
                    const transferAmount = parseCurrency(transferValue);
                    const afterTransfer = currentAvailable + transferAmount;

                    return (
                      <div 
                        className="p-4"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--primary) 8%, var(--card))',
                          border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                          borderRadius: 'var(--radius)',
                        }}
                      >
                        <div 
                          style={{ 
                            color: 'var(--foreground)', 
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            marginBottom: '0.75rem',
                          }}
                        >
                          {toCategoryData.name}
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                            Disponível atual:
                          </span>
                          <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {toCategoryData.available}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                            Após transferência:
                          </span>
                          <span style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                            {formatCurrency(afterTransfer)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Justification */}
            <div className="mb-6">
              <label 
                className="block mb-2"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Justifique a transferência de valor:
              </label>
              <input
                type="text"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Exemplo: adequação às necessidades do projeto"
                className="w-full px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 transition-colors"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                }}
              >
                Limpar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 transition-colors"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  backgroundColor: isInternoFormValid 
                    ? 'var(--primary)' 
                    : 'var(--muted)',
                  color: isInternoFormValid ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  cursor: isInternoFormValid ? 'pointer' : 'not-allowed',
                  opacity: isInternoFormValid ? 1 : 0.5,
                }}
                disabled={!isInternoFormValid}
              >
                Confirmar Transferência
              </button>
            </div>
          </div>

          {/* Valores por Categoria Section - FORA DO CARD */}
          <div className="mt-12 w-full max-w-full">
            <h1
              style={{
                color: 'var(--foreground)',
                margin: '0 0 0.5rem 0',
                wordBreak: 'break-word',
              }}
            >
              Valores por Categoria
            </h1>
            <p 
              style={{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                margin: '0 0 1.5rem 0',
                wordBreak: 'break-word',
              }}
            >
              Visualize o orçamento aprovado, valores já gastos e saldo disponível em cada categoria.
            </p>

            {/* Category Cards */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-full">
              {categories.map((category) => {
                const isExpanded = expandedCategory === category.id;
                
                return (
                  <div 
                    key={category.id}
                    className="overflow-hidden w-full max-w-full"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div 
                      className="p-4 md:p-5 w-full max-w-full"
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      style={{ 
                        cursor: 'pointer',
                      }}
                    >
                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        {/* Ícone */}
                        <div className="col-span-1 flex items-center">
                          <ChevronDown 
                            size={16} 
                            style={{ 
                              color: 'var(--muted-foreground)',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                            }} 
                          />
                        </div>

                        {/* Categoria */}
                        <div className="col-span-2" style={{ marginLeft: '-1rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Categoria
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {category.name}
                          </div>
                        </div>

                        {/* Aprovado */}
                        <div className="col-span-2">
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Aprovado
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {category.approved}
                          </div>
                        </div>

                        {/* Utilizado */}
                        <div className="col-span-2">
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Utilizado
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {category.used}
                          </div>
                        </div>

                        {/* Disponível */}
                        <div className="col-span-2">
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Disponível
                          </div>
                          <div style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)' }}>
                            {category.available}
                          </div>
                        </div>

                        {/* Progresso */}
                        <div className="col-span-3">
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Progresso
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              style={{ 
                                flex: 1,
                                height: '6px',
                                backgroundColor: 'var(--border)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                              }}
                            >
                              <div 
                                style={{ 
                                  width: `${category.progress}%`, 
                                  height: '100%', 
                                  backgroundColor: 'var(--primary)', 
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                            <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', minWidth: '45px' }}>
                              {category.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden w-full max-w-full">
                        {/* Header com Categoria e Ícone */}
                        <div className="flex items-center justify-between mb-4 w-full max-w-full">
                          <div className="flex-1 min-w-0 pr-2">
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                              Categoria
                            </div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', wordBreak: 'break-word' }}>
                              {category.name}
                            </div>
                          </div>
                          <ChevronDown 
                            size={16} 
                            style={{ 
                              color: 'var(--muted-foreground)',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              flexShrink: 0,
                            }} 
                          />
                        </div>

                        {/* Grid de Valores */}
                        <div className="grid grid-cols-3 gap-3 mb-4 w-full max-w-full">
                          {/* Aprovado */}
                          <div className="min-w-0">
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                              Aprovado
                            </div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                              {category.approved}
                            </div>
                          </div>

                          {/* Utilizado */}
                          <div className="min-w-0">
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                              Utilizado
                            </div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                              {category.used}
                            </div>
                          </div>

                          {/* Disponível */}
                          <div className="min-w-0">
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                              Disponível
                            </div>
                            <div style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                              {category.available}
                            </div>
                          </div>
                        </div>

                        {/* Progresso */}
                        <div>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Progresso
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              style={{ 
                                flex: 1,
                                height: '6px',
                                backgroundColor: 'var(--border)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                              }}
                            >
                              <div 
                                style={{ 
                                  width: `${category.progress}%`, 
                                  height: '100%', 
                                  backgroundColor: 'var(--primary)', 
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                            <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', minWidth: '45px' }}>
                              {category.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* History Section */}
                    {isExpanded && category.history.length > 0 && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5 w-full max-w-full" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', paddingLeft: 'calc(8.33% + 1rem)' }}>
                        <h2
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            marginBottom: '1rem',
                            wordBreak: 'break-word',
                          }}
                        >
                          Histórico de Remanejamentos
                        </h2>
                        <div className="relative w-full max-w-full">
                          {category.history.map((entry, index) => {
                            const isLast = index === category.history.length - 1;
                            
                            return (
                              <div key={index} className="flex gap-4 pb-8 relative">
                                {/* Timeline Line */}
                                {!isLast && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: '14px',
                                      top: '28px',
                                      height: 'calc(100% - 28px)',
                                      width: '2px',
                                      backgroundColor: 'var(--primary)',
                                    }}
                                  />
                                )}
                                
                                {/* Timeline Icon Circle */}
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                  <div
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      backgroundColor: isLast ? 'var(--muted)' : 'var(--primary)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <RefreshCw 
                                      size={14} 
                                      style={{ 
                                        color: isLast ? 'var(--muted-foreground)' : 'var(--background)',
                                      }} 
                                    />
                                  </div>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, paddingTop: '2px', minWidth: 0 }}>
                                  <div
                                    style={{
                                      color: 'var(--muted-foreground)',
                                      fontSize: 'var(--text-sm)',
                                      marginBottom: '0.25rem',
                                    }}
                                  >
                                    {entry.date}
                                  </div>
                                  <div
                                    style={{
                                      color: 'var(--foreground)',
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-weight-semibold)',
                                      marginBottom: '0.25rem',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {entry.title}
                                  </div>
                                  <div
                                    style={{
                                      color: 'var(--muted-foreground)',
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-weight-normal)',
                                      lineHeight: '1.5',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {entry.description}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Empty State when no history */}
                    {isExpanded && category.history.length === 0 && (
                      <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', paddingLeft: 'calc(8.33% + 1rem)' }}>
                        <h2
                          style={{
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Histórico de Alterações
                        </h2>
                        <p
                          style={{
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-normal)',
                            lineHeight: '1.5',
                          }}
                        >
                          Não foram feitas transferências De (Origem) ou para (Destino) essa categoria.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : activeTab === 'fapes' ? (
        <div
          className="p-4 md:p-6 lg:p-8 w-full max-w-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderRadius: 'var(--radius)',
            border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <h1
            className="mb-6"
            style={{
              color: 'var(--foreground)',
              margin: '0 0 1.5rem 0',
              wordBreak: 'break-word',
            }}
          >
            Solicitar Aprovação de Novo Item ou Nova Categoria
          </h1>

          {/* Tipo de Remanejamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Tipo de Remanejamento
              </label>
              
              <div style={{ position: 'relative' }}>
                <select
                  value={fapesType}
                  onChange={(e) => setFapesType(e.target.value as 'category' | 'item')}
                  className="w-full px-3 py-2.5"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: fapesType ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    cursor: 'pointer',
                    outline: 'none',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                  }}
                >
                  <option value="item">Solicitar Criar Novo Item</option>
                  <option value="category">Solicitar Criar Nova Categoria</option>
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Novo Tipo de Categoria */}
            {fapesType === 'category' && (
              <div>
                <label 
                  className="block mb-2"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Novo Tipo de Categoria
                </label>
                
                <div style={{ position: 'relative' }}>
                  <select
                    value={newCategoryType}
                    onChange={(e) => setNewCategoryType(e.target.value)}
                    className="w-full px-3 py-2.5"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: newCategoryType ? 'var(--foreground)' : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                      cursor: 'pointer',
                      outline: 'none',
                      paddingRight: '2.5rem',
                      appearance: 'none',
                    }}
                  >
                    <option value="">Selecione um tipo de categoria</option>
                    <option value="material-permanente">Material Permanente</option>
                    <option value="material-consumo">Material de Consumo</option>
                    <option value="passagem">Passagem</option>
                    <option value="diaria">Diária</option>
                    <option value="pessoa-fisica">Pessoa Física</option>
                    <option value="pessoa-juridica">Pessoa Jurídica</option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            )}

            {/* Novo Tipo de Item */}
            {fapesType === 'item' && (
              <div>
                <label 
                  style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Categoria que o item pertence
                </label>
                
                <div style={{ position: 'relative' }}>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    className="w-full px-3 py-2.5"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: newItemType ? 'var(--foreground)' : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                      cursor: 'pointer',
                      outline: 'none',
                      paddingRight: '2.5rem',
                      appearance: 'none',
                    }}
                  >
                    <option value="">Selecione a categoria</option>
                    <option value="material-permanente">Material Permanente</option>
                    <option value="material-consumo">Material de Consumo</option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nome do Novo Item - Linha inteira */}
          {fapesType === 'item' && (
            <div className="mb-6">
              <label 
                className="block mb-2"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Nome do Novo Item (Usar o nome que estará na Nota Fiscal)
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Exemplo: Equipamento de Laboratório"
                className="w-full px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* De (Origem) e Valor a Transferir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                De (Origem)
              </label>
              
              <div style={{ position: 'relative' }}>
                <select
                  value={fapesFromCategory}
                  onChange={(e) => setFapesFromCategory(e.target.value)}
                  className="w-full px-3 py-2.5"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: fapesFromCategory ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    cursor: 'pointer',
                    outline: 'none',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                  }}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="material-permanente">Material Permanente</option>
                  <option value="material-consumo">Material de Consumo</option>
                  <option value="passagem">Passagem</option>
                  <option value="diaria">Diária</option>
                  <option value="pessoa-fisica">Pessoa Física</option>
                  <option value="pessoa-juridica">Pessoa Jurídica</option>
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Valor a Transferir
              </label>
              <input
                type="text"
                value={fapesValue}
                onChange={(e) => setFapesValue(e.target.value)}
                placeholder="R$ 0,00"
                className="w-full px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Justification */}
          <div className="mb-6">
            <label 
              className="block mb-2"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
              }}
            >
              Justifique a transferência de valor:
            </label>
            <textarea
              value={fapesJustification}
              onChange={(e) => setFapesJustification(e.target.value)}
              placeholder="Exemplo: adequação às necessidades do projeto"
              rows={4}
              className="w-full px-3 py-2.5"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleFapesClear}
              className="px-4 py-2 transition-colors"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor: 'transparent',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
              }}
            >
              Limpar
            </button>
            <button
              onClick={handleFapesSubmit}
              className="px-4 py-2 transition-colors"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
              }}
            >
              Enviar Solicitação
            </button>
          </div>
        </div>
      ) : activeTab === 'bolsa' ? (
        <div className="w-full max-w-full">
          {/* Progress Card */}
          <div
            className="p-4 md:p-6 w-full max-w-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            {/* Valores Grid */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-0 mb-1 w-full max-w-full">
              {/* Orçamento Total */}
              <div className="min-w-0">
                <div 
                  style={{ 
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--text-sm)',
                    marginBottom: '0.125rem',
                    wordBreak: 'break-word',
                  }}
                >
                  Orçamento total para bolsas
                </div>
                <div 
                  style={{ 
                    color: 'var(--muted-foreground)', 
                    fontSize: 'var(--text-sm)',
                    wordBreak: 'break-word',
                  }}
                >
                  Disponibilizado: R$ 300.000
                </div>
              </div>

              {/* Saldo Disponível */}
              <div className="min-w-0 w-full md:w-auto" style={{ textAlign: 'left' }}>
                <div 
                  style={{ 
                    color: 'var(--muted-foreground)', 
                    fontSize: 'var(--text-sm)',
                    marginBottom: '0.125rem',
                  }}
                >
                  Saldo disponível
                </div>
                <div 
                  style={{ 
                    color: 'var(--foreground)', 
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  R$ 125.000,00
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '1.5rem' }}>
              {/* Progress Bar */}
              <div className="mb-2">
                <div 
                  style={{ 
                    height: '8px',
                    backgroundColor: 'var(--border)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div 
                    style={{ 
                      width: '58.33%', 
                      height: '100%', 
                      backgroundColor: '#60a5fa', 
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Utilizado - Bottom Left */}
              <div>
                <div 
                  style={{ 
                    color: 'var(--muted-foreground)', 
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  Utilizado: R$ 175.000
                </div>
              </div>
            </div>
          </div>

          {/* Gerenciar Cotas de Bolsas - FORA do Card */}
          <div className="w-full max-w-full" style={{ marginTop: '2rem' }}>
            <h3 
              style={{ 
                color: 'var(--foreground)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)',
                marginBottom: '1rem',
                wordBreak: 'break-word',
              }}
            >
              Gerenciar Cotas de Bolsas
            </h3>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-full">
              <BolsaCard modalidade="BPIG-X" valor={300} cotasDisponiveis={4} cotasDesejadas={quotasBpigX} onCotasChange={setQuotasBpigX} />
              <BolsaCard modalidade="BPIG-IX" valor={450} cotasDisponiveis={3} cotasDesejadas={quotasBpigIX} onCotasChange={setQuotasBpigIX} />
              <BolsaCard modalidade="BPIG-VIII" valor={700} cotasDisponiveis={2} cotasDesejadas={quotasBpigVIII} onCotasChange={setQuotasBpigVIII} />
              <BolsaCard modalidade="BPIG-VII" valor={1200} cotasDisponiveis={1} cotasDesejadas={quotasBpigVII} onCotasChange={setQuotasBpigVII} />
              <BolsaCard modalidade="BPIG-VI" valor={1800} cotasDisponiveis={3} cotasDesejadas={quotasBpigVI} onCotasChange={setQuotasBpigVI} />
              <BolsaCard modalidade="BPIG-V" valor={2700} cotasDisponiveis={2} cotasDesejadas={quotasBpigV} onCotasChange={setQuotasBpigV} />
              <BolsaCard modalidade="BPIG-IV" valor={3500} cotasDisponiveis={5} cotasDesejadas={quotasBpigIV} onCotasChange={setQuotasBpigIV} />
              <BolsaCard modalidade="BPIG-III" valor={5500} cotasDisponiveis={4} cotasDesejadas={quotasBpigIII} onCotasChange={setQuotasBpigIII} />
              <BolsaCard modalidade="BPIG-II" valor={7500} cotasDisponiveis={3} cotasDesejadas={quotasBpigII} onCotasChange={setQuotasBpigII} />
              <BolsaCard modalidade="BPIG-I" valor={10000} cotasDisponiveis={2} cotasDesejadas={quotasBpigI} onCotasChange={setQuotasBpigI} />
            </div>

            {/* Save Button - Show only if quotas changed */}
            {hasQuotasChanged() && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveRemanejamento}
                  className="flex items-center gap-2 px-4 py-2 transition-colors"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                  }}
                >
                  <Save size={16} />
                  Salvar Remanejamento
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}