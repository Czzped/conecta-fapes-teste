import React, { useState } from 'react';
import {
  Home, ChevronRight, FileText, Plus, Trash2, ChevronDown, Edit, X,
} from 'lucide-react';

// ─── Shared styles ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '6px',
  padding: '10px 12px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical' as const,
  minHeight: '86px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255, 255, 255, 0.65)',
  display: 'block',
  marginBottom: '6px',
};

const editableLabelStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundColor: 'rgba(0,193,175,0.08)',
  border: '1px solid rgba(0,193,175,0.3)',
  marginBottom: '6px',
  padding: '6px 10px',
  fontSize: 'var(--text-sm)',
};

// ─── Section card ──────────────────────────────────────────────────────────

interface SectionCardProps {
  number?: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onAddField?: () => void;
  isEditMode?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ number, title, subtitle, children, onAddField, isEditMode }) => (
  <div style={{
    backgroundColor: 'rgba(38, 38, 38, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '28px',
    marginBottom: '20px',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        {number && (
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#00c1af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: '11px',
              fontWeight: 'var(--font-weight-medium)',
              color: '#171717',
            }}>
              {number}
            </span>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px 0' }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            {subtitle}
          </p>
        </div>
      </div>
      {isEditMode && onAddField && (
        <button
          type="button"
          onClick={onAddField}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            padding: '8px 16px',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--text-sm)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          <Plus size={16} />
          Adicionar Campo
        </button>
      )}
    </div>
    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />
    {children}
  </div>
);

// ─── Editable Field Wrapper ─────────────────────────────────────────────────

interface EditableFieldProps {
  label: string;
  isEditMode: boolean;
  onLabelChange: (newLabel: string) => void;
  onDelete: () => void;
  children: React.ReactNode;
  hideDelete?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, isEditMode, onLabelChange, onDelete, children, hideDelete }) => {
  const [localLabel, setLocalLabel] = useState(label);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {isEditMode ? (
            <input
              style={editableLabelStyle}
              value={localLabel}
              onChange={e => { setLocalLabel(e.target.value); onLabelChange(e.target.value); }}
              placeholder="Nome do campo"
            />
          ) : (
            <label style={labelStyle}>{label}</label>
          )}
          {children}
        </div>
        {isEditMode && !hideDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              background: 'none',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '10px',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              flexShrink: 0,
              height: '40px',
              width: '40px',
              marginTop: isEditMode ? '26px' : '0',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Add Field Modal ─────────────────────────────────────────────────────────

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (field: { label: string; type: string; options?: string[] }) => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('short');
  const [options, setOptions] = useState(['Opção 1']);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  if (!isOpen) return null;

  const typeOptions = [
    { value: 'short', label: 'Resposta Curta' },
    { value: 'long', label: 'Resposta Longa' },
    { value: 'dropdown', label: 'Lista Suspensa' },
    { value: 'radio', label: 'Múltipla Escolha' },
    { value: 'checkbox', label: 'Caixas de Seleção' },
  ];

  const needsOptions = ['dropdown', 'radio', 'checkbox'].includes(fieldType);

  const handleAdd = () => {
    if (!fieldLabel.trim()) return;
    onAdd({
      label: fieldLabel,
      type: fieldType,
      options: needsOptions ? options.filter(o => o.trim()) : undefined,
    });
    setFieldLabel('');
    setFieldType('short');
    setOptions(['Opção 1']);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '28px',
          width: '90%',
          maxWidth: '500px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: 0 }}>
            Adicionar Novo Campo
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Nome do Campo</label>
          <input
            style={inputStyle}
            value={fieldLabel}
            onChange={e => setFieldLabel(e.target.value)}
            placeholder="Ex: Área de pesquisa"
            autoFocus
          />
        </div>

        <div style={{ marginBottom: '20px' }} onClick={e => e.stopPropagation()}>
          <label style={labelStyle}>Tipo de Resposta</label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              style={{
                ...inputStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: showTypeDropdown ? '1px solid rgba(0,193,175,0.5)' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span>{typeOptions.find(t => t.value === fieldType)?.label || 'Selecione…'}</span>
              <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {showTypeDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                overflow: 'hidden',
                zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                {typeOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFieldType(opt.value);
                      setShowTypeDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      backgroundColor: fieldType === opt.value ? 'rgba(0,193,175,0.12)' : 'transparent',
                      color: fieldType === opt.value ? '#00c1af' : '#ffffff',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (fieldType !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (fieldType !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {needsOptions && (
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Opções</label>
            {options.map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={opt}
                  onChange={e => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                  placeholder={`Opção ${i + 1}`}
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOptions([...options, `Opção ${options.length + 1}`])}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.4)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-xs)',
                color: '#00c1af',
                cursor: 'pointer',
              }}
            >
              <Plus size={12} />
              Adicionar Opção
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={!fieldLabel.trim()}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: 'var(--radius)',
              backgroundColor: fieldLabel.trim() ? '#00c1af' : 'rgba(0,193,175,0.3)',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: fieldLabel.trim() ? '#171717' : 'rgba(23, 23, 23,0.5)',
              cursor: fieldLabel.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Custom Field Renderer ──────────────────────────────────────────────────

interface CustomFieldProps {
  field: any;
  isEditMode: boolean;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

const CustomFieldRenderer: React.FC<CustomFieldProps> = ({ field, isEditMode, onLabelChange, onDelete, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || (field.type === 'checkbox' ? [] : ''));

  const handleChange = (newValue: string | string[]) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  let fieldComponent;

  switch (field.type) {
    case 'short':
      fieldComponent = (
        <input
          style={inputStyle}
          placeholder="Digite aqui"
          value={localValue as string}
          onChange={e => handleChange(e.target.value)}
        />
      );
      break;
    case 'long':
      fieldComponent = (
        <textarea
          style={textareaStyle}
          placeholder="Digite aqui"
          value={localValue as string}
          onChange={e => handleChange(e.target.value)}
        />
      );
      break;
    case 'dropdown':
      fieldComponent = (
        <select
          style={inputStyle}
          value={localValue as string}
          onChange={e => handleChange(e.target.value)}
        >
          <option value="">Selecione...</option>
          {field.options?.map((opt: string, i: number) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );
      break;
    case 'radio':
      fieldComponent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {field.options?.map((opt: string, i: number) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', cursor: 'pointer' }}>
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={localValue === opt}
                onChange={() => handleChange(opt)}
                style={{ cursor: 'pointer' }}
              />
              {opt}
            </label>
          ))}
        </div>
      );
      break;
    case 'checkbox':
      fieldComponent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {field.options?.map((opt: string, i: number) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', cursor: 'pointer' }}>
              <input
                type="checkbox"
                value={opt}
                checked={(localValue as string[]).includes(opt)}
                onChange={e => {
                  const arr = localValue as string[];
                  if (e.target.checked) {
                    handleChange([...arr, opt]);
                  } else {
                    handleChange(arr.filter(v => v !== opt));
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
              {opt}
            </label>
          ))}
        </div>
      );
      break;
  }

  return (
    <EditableField
      label={field.label}
      isEditMode={isEditMode}
      onLabelChange={onLabelChange}
      onDelete={onDelete}
    >
      {fieldComponent}
    </EditableField>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  onBackToEditais: () => void;
  isTemplate?: boolean;
}

export const FormularioInscricaoGeral: React.FC<Props> = ({ onBack, onBackToEditais, isTemplate = false }) => {

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<number | null>(null);
  
  // Form metadata (for template editing)
  const [formTitle, setFormTitle] = useState('Formulário de Submissão Geral');
  const [formDescription, setFormDescription] = useState('');
  
  // Custom sections (user-created sections starting from 6)
  const [customSections, setCustomSections] = useState<Array<{ id: number; title: string; subtitle: string }>>([]);
  const [nextSectionId, setNextSectionId] = useState(6);
  
  // Dynamic fields per section
  const [customFields, setCustomFields] = useState<{[key: number]: any[]}>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  // Field labels (editable in edit mode)
  const [fieldLabels, setFieldLabels] = useState({
    tituloPromjeto: 'Título do Projeto',
    objetivoGeral: 'Objetivo Geral',
    objetivoEspecifico: 'Objetivo Específico',
    resultados: 'Resultados',
  });

  // Section 1
  const [dadosGerais, setDadosGerais] = useState({ titulo: '', objetivoGeral: '' });
  const [objetivosEspecificos, setObjetivosEspecificos] = useState<string[]>([]);
  const [objetivoEspecificoTemp, setObjetivoEspecificoTemp] = useState('');
  const [resultados, setResultados] = useState<string[]>([]);
  const [resultadoTemp, setResultadoTemp] = useState('');

  // Add custom field handler
  const handleAddField = (sectionNum: number) => {
    setCurrentSection(sectionNum);
    setShowAddFieldModal(true);
  };

  const handleAddFieldConfirm = (field: any) => {
    if (currentSection === null) return;
    setCustomFields(prev => ({
      ...prev,
      [currentSection]: [...prev[currentSection], { ...field, id: `field-${Date.now()}` }],
    }));
  };

  const handleDeleteCustomField = (sectionNum: number, fieldId: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionNum]: prev[sectionNum].filter(f => f.id !== fieldId),
    }));
  };

  const handleUpdateCustomFieldLabel = (sectionNum: number, fieldId: string, newLabel: string) => {
    setCustomFields(prev => ({
      ...prev,
      [sectionNum]: prev[sectionNum].map(f => f.id === fieldId ? { ...f, label: newLabel } : f),
    }));
  };

  // Objetivo Específico e Resultados helpers
  const addObjetivoEspecifico = () => {
    if (objetivoEspecificoTemp.trim()) {
      setObjetivosEspecificos(prev => [...prev, objetivoEspecificoTemp.trim()]);
      setObjetivoEspecificoTemp('');
    }
  };
  const removeObjetivoEspecifico = (i: number) => setObjetivosEspecificos(prev => prev.filter((_, idx) => idx !== i));

  const addResultado = () => {
    if (resultadoTemp.trim()) {
      setResultados(prev => [...prev, resultadoTemp.trim()]);
      setResultadoTemp('');
    }
  };
  const removeResultado = (i: number) => setResultados(prev => prev.filter((_, idx) => idx !== i));

  const addBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(0,193,175,0.1)',
    border: '1px solid rgba(0,193,175,0.4)',
    borderRadius: '6px', padding: '8px 16px',
    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
    color: '#00c1af', cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const deleteBtnStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '6px',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  return (
    <div
      className="flex-1"
      style={{ backgroundColor: '#171717', minHeight: '100vh' }}
    >
      <div className="pt-8 px-8 pb-16">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button onClick={isTemplate ? onBack : onBackToEditais} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
            {isTemplate ? 'Formulário' : 'Captação'}
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }}>
            {isTemplate ? 'Template' : 'Submissão de Proposta'}
          </span>
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
            <FileText size={18} style={{ color: '#00c1af' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>
              {isTemplate ? 'Template - Formulário de Submissão' : 'Submissão de Proposta'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                {isTemplate ? (isEditMode ? 'Modo de edição ativado — edite labels, exclua campos ou adicione novos.' : 'Para personalizar, exclua ou adicione novos campos.') : 'Preencha todos os campos para submeter sua proposta.'}
              </p>
              {isTemplate && (
                <button
                  type="button"
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(0,193,175,0.1)',
                    border: '1px solid rgba(0,193,175,0.4)',
                    borderRadius: 'var(--radius)',
                    color: '#00c1af',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; }}
                >
                  <Edit size={14} />
                  {isEditMode ? 'Concluir Edição' : 'Editar'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '28px' }} />

        {/* ── Form Metadata Card (only in edit mode) ── */}
        {isTemplate && isEditMode && (
          <div style={{
            backgroundColor: 'rgba(38, 38, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '28px',
            marginBottom: '20px',
          }}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 20px' }}>
              Informações do Formulário
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Título do Novo Formulário</label>
              <input
                style={inputStyle}
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="Ex: Formulário de Submissão - Edital 2026"
              />
            </div>
            <div>
              <label style={labelStyle}>Descrição</label>
              <textarea
                style={textareaStyle}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Descreva o propósito deste formulário..."
              />
            </div>
          </div>
        )}

        {/* ── Section 1: Dados Gerais ── */}
        <SectionCard
          number={1}
          title="Dados Gerais"
          subtitle="Preencha os dados básicos do projeto."
          isEditMode={isEditMode}
          onAddField={() => handleAddField(1)}
        >
          <EditableField
            label={fieldLabels.tituloPromjeto}
            isEditMode={isEditMode}
            onLabelChange={(label) => setFieldLabels(prev => ({ ...prev, tituloPromjeto: label }))}
            onDelete={() => {}}
          >
            <input style={inputStyle} placeholder="Digite o título do projeto" value={dadosGerais.titulo} onChange={e => setDadosGerais(p => ({ ...p, titulo: e.target.value }))} />
          </EditableField>

          <EditableField
            label={fieldLabels.objetivoGeral}
            isEditMode={isEditMode}
            onLabelChange={(label) => setFieldLabels(prev => ({ ...prev, objetivoGeral: label }))}
            onDelete={() => {}}
          >
            <textarea style={textareaStyle} placeholder="Descreva o objetivo geral" value={dadosGerais.objetivoGeral} onChange={e => setDadosGerais(p => ({ ...p, objetivoGeral: e.target.value }))} />
          </EditableField>

          <EditableField
            label={fieldLabels.objetivoEspecifico}
            isEditMode={isEditMode}
            onLabelChange={(label) => setFieldLabels(prev => ({ ...prev, objetivoEspecifico: label }))}
            onDelete={() => {}}
          >
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  style={inputStyle} 
                  placeholder="Descreva um objetivo específico (máx. 100 caracteres)" 
                  value={objetivoEspecificoTemp} 
                  maxLength={100}
                  onChange={e => setObjetivoEspecificoTemp(e.target.value)}
                  onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); addObjetivoEspecifico(); } }}
                />
                <button
                  type="button"
                  onClick={addObjetivoEspecifico}
                  style={{ ...addBtnStyle, marginTop: 0, flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                {objetivoEspecificoTemp.length}/100
              </div>
              {objetivosEspecificos.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', backgroundColor: 'rgba(23, 23, 23,0.5)', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ flex: 1, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>• {obj}</span>
                  <button type="button" onClick={() => removeObjetivoEspecifico(i)} style={deleteBtnStyle}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          </EditableField>

          <EditableField
            label={fieldLabels.resultados}
            isEditMode={isEditMode}
            onLabelChange={(label) => setFieldLabels(prev => ({ ...prev, resultados: label }))}
            onDelete={() => {}}
          >
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  style={inputStyle} 
                  placeholder="Descreva um resultado esperado (máx. 100 caracteres)" 
                  value={resultadoTemp} 
                  maxLength={100}
                  onChange={e => setResultadoTemp(e.target.value)}
                  onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); addResultado(); } }}
                />
                <button
                  type="button"
                  onClick={addResultado}
                  style={{ ...addBtnStyle, marginTop: 0, flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                {resultadoTemp.length}/100
              </div>
              {resultados.map((res, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', backgroundColor: 'rgba(23, 23, 23,0.5)', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ flex: 1, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff' }}>• {res}</span>
                  <button type="button" onClick={() => removeResultado(i)} style={deleteBtnStyle}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          </EditableField>

          {/* Custom fields for section 1 */}
          {customFields[1].map(field => (
            <CustomFieldRenderer
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              onLabelChange={(label) => handleUpdateCustomFieldLabel(1, field.id, label)}
              onDelete={() => handleDeleteCustomField(1, field.id)}
            />
          ))}
        </SectionCard>

        {/* ── Section 2: Coordenador ── */}
        <SectionCard
          number={2}
          title="Coordenador"
          subtitle="Dados do coordenador do projeto."
          isEditMode={isEditMode}
          onAddField={() => handleAddField(2)}
        >
          <EditableField
            label="Nome Completo"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} placeholder="Digite o nome completo" />
          </EditableField>

          <EditableField
            label="CPF"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} placeholder="000.000.000-00" />
          </EditableField>

          <EditableField
            label="E-mail"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} type="email" placeholder="email@exemplo.com" />
          </EditableField>

          {/* Custom fields for section 2 */}
          {customFields[2].map(field => (
            <CustomFieldRenderer
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              onLabelChange={(label) => handleUpdateCustomFieldLabel(2, field.id, label)}
              onDelete={() => handleDeleteCustomField(2, field.id)}
            />
          ))}
        </SectionCard>

        {/* ── Section 3: Equipe ── */}
        <SectionCard
          number={3}
          title="Equipe"
          subtitle="Membros da equipe do projeto."
          isEditMode={isEditMode}
          onAddField={() => handleAddField(3)}
        >
          <EditableField
            label="Número de Integrantes"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} type="number" placeholder="Ex: 5" />
          </EditableField>

          <EditableField
            label="Descrição da Equipe"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <textarea style={textareaStyle} placeholder="Descreva a equipe e as competências dos membros" />
          </EditableField>

          {/* Custom fields for section 3 */}
          {customFields[3].map(field => (
            <CustomFieldRenderer
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              onLabelChange={(label) => handleUpdateCustomFieldLabel(3, field.id, label)}
              onDelete={() => handleDeleteCustomField(3, field.id)}
            />
          ))}
        </SectionCard>

        {/* ── Section 4: Cronograma ── */}
        <SectionCard
          number={4}
          title="Cronograma"
          subtitle="Planejamento temporal do projeto."
          isEditMode={isEditMode}
          onAddField={() => handleAddField(4)}
        >
          <EditableField
            label="Data de Início"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} type="date" />
          </EditableField>

          <EditableField
            label="Data de Término"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} type="date" />
          </EditableField>

          <EditableField
            label="Atividades Principais"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <textarea style={textareaStyle} placeholder="Liste as principais atividades e seus prazos" />
          </EditableField>

          {/* Custom fields for section 4 */}
          {customFields[4].map(field => (
            <CustomFieldRenderer
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              onLabelChange={(label) => handleUpdateCustomFieldLabel(4, field.id, label)}
              onDelete={() => handleDeleteCustomField(4, field.id)}
            />
          ))}
        </SectionCard>

        {/* ── Section 5: Orçamento ── */}
        <SectionCard
          number={5}
          title="Orçamento"
          subtitle="Planejamento financeiro do projeto."
          isEditMode={isEditMode}
          onAddField={() => handleAddField(5)}
        >
          <EditableField
            label="Valor Total Solicitado"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} placeholder="R$ 0,00" />
          </EditableField>

          <EditableField
            label="Contrapartida"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <input style={inputStyle} placeholder="R$ 0,00" />
          </EditableField>

          <EditableField
            label="Justificativa do Orçamento"
            isEditMode={isEditMode}
            onLabelChange={() => {}}
            onDelete={() => {}}
          >
            <textarea style={textareaStyle} placeholder="Justifique os valores solicitados" />
          </EditableField>

          {/* Custom fields for section 5 */}
          {customFields[5].map(field => (
            <CustomFieldRenderer
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              onLabelChange={(label) => handleUpdateCustomFieldLabel(5, field.id, label)}
              onDelete={() => handleDeleteCustomField(5, field.id)}
            />
          ))}
        </SectionCard>

        {/* ── Custom Sections (user-created) ── */}
        {customSections.map(sec => (
          <div key={sec.id} style={{
            backgroundColor: 'rgba(38, 38, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '28px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#00c1af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: '#171717',
                  }}>
                    {sec.id}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  {isEditMode ? (
                    <>
                      <input
                        style={{
                          ...editableLabelStyle,
                          marginBottom: '6px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                        value={sec.title}
                        onChange={e => {
                          setCustomSections(prev => prev.map(s => s.id === sec.id ? { ...s, title: e.target.value } : s));
                        }}
                        placeholder="Título da seção"
                      />
                      <input
                        style={editableLabelStyle}
                        value={sec.subtitle}
                        onChange={e => {
                          setCustomSections(prev => prev.map(s => s.id === sec.id ? { ...s, subtitle: e.target.value } : s));
                        }}
                        placeholder="Subtítulo da seção"
                      />
                    </>
                  ) : (
                    <>
                      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px 0' }}>
                        {sec.title || 'Nova Seção'}
                      </h2>
                      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        {sec.subtitle || 'Descrição da seção'}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {isEditMode && (
                <>
                  <button
                    type="button"
                    onClick={() => handleAddField(sec.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { 
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                    }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                  >
                    <Plus size={16} />
                    Adicionar Campo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSections(prev => prev.filter(s => s.id !== sec.id));
                      setCustomFields(prev => {
                        const newFields = { ...prev };
                        delete newFields[sec.id];
                        return newFields;
                      });
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '10px',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      flexShrink: 0,
                      height: '40px',
                      width: '40px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />
            
            {/* Custom fields for this section */}
            {customFields[sec.id]?.map(field => (
              <CustomFieldRenderer
                key={field.id}
                field={field}
                isEditMode={isEditMode}
                onLabelChange={(label) => handleUpdateCustomFieldLabel(sec.id, field.id, label)}
                onDelete={() => handleDeleteCustomField(sec.id, field.id)}
              />
            ))}
          </div>
        ))}

        {/* ── Add Section Button (only in edit mode) ── */}
        {isTemplate && isEditMode && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => {
                const newSection = { id: nextSectionId, title: '', subtitle: '' };
                setCustomSections(prev => [...prev, newSection]);
                setCustomFields(prev => ({ ...prev, [nextSectionId]: [] }));
                setNextSectionId(nextSectionId + 1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.4)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#00c1af',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; }}
            >
              <Plus size={18} />
              Adicionar Sessão
            </button>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '10px 20px', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius)', backgroundColor: 'transparent',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            {isTemplate ? 'Salvar Rascunho' : 'Cancelar'}
          </button>
          <button
            type="button"
            style={{
              padding: '10px 24px', border: 'none',
              borderRadius: 'var(--radius)', backgroundColor: '#00c1af',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)', color: '#171717',
              cursor: 'pointer', transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
          >
            {isTemplate ? 'Salvar Formulário' : 'Submeter Proposta'}
          </button>
        </div>

      </div>

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        onAdd={handleAddFieldConfirm}
      />
    </div>
  );
};
