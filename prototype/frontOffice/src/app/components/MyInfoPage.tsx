import { useState } from 'react';
import { Save, User, ChevronDown, FileText, Upload, Trash2, Paperclip, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageScenarios } from '@/mocks/ScenarioContext';
import { toast } from 'sonner';
import { Dropdown } from '@/app/components/Dropdown';
import exampleImage from 'figma:asset/5fdde35260b51e236743e92a6751fa016c01ebe7.png';
import nivelSuperiorImage from 'figma:asset/877199cc9131136997bf49056564eb43fea94ad3.png';
import rgImage from 'figma:asset/78c784113bce75ce1ab693340249109e2f5fb269.png';
import cpfImage from 'figma:asset/57c9773a72172ebc07e4fda2b27c1429c95a7dd1.png';
import residenceImage from 'figma:asset/c83f7c794e0b9fe9d1247bddd583de060c80188a.png';
import lattesImage from 'figma:asset/f6ace900bd97839b19869c3a3cac12c8c84d6d90.png';
import municipalImage from 'figma:asset/b92a98978851a34cb567d36aa94aae85b6405547.png';
import estadualImage from 'figma:asset/c6cf15a88796c5f73d9d38d77c03c8e946e774a8.png';
import federalImage from 'figma:asset/4c48273581334f5616044a8ed4013108fd43d5af.png';
import trabalhistaImage from 'figma:asset/ff01cb82b8890a2c720470add8dfcb9eaf6a815c.png';
import nivelAcademicoImage from 'figma:asset/9899e2aa625401c6221283ac00623d7c404af36f.png';
import planoTrabalhoImage from 'figma:asset/c65ef3a04b82446f751ebaf23c3c12fd9502734a.png';
import cnisImage from 'figma:asset/4628ff5a559edb90905eee97345e3c4770ab2125.png';
import termoPg1Image from 'figma:asset/999eb1b233dcaf2ae510ea93f318f45af8862d36.png';
import termoPg2Image from 'figma:asset/963c600cd797ac50aeadf77e4cd0d47a2df288d6.png';

type TabType = 'dados' | 'documentos';

export function MyInfoPage() {
  usePageScenarios([
    'doc-upload-ok',
    'doc-upload-formato-invalido',
    'doc-upload-tamanho-excedido',
    'doc-upload-sistema-indisponivel',
  ]);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('documentos');
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);
  const [uploadErros, setUploadErros] = useState<Record<number, string>>({});
  const [expandedDocId, setExpandedDocId] = useState<number | null>(null);
  const [expandedCanceledScholarship, setExpandedCanceledScholarship] = useState(false);
  const [dragActive, setDragActive] = useState<number | null>(null);
  const [deletedDocuments, setDeletedDocuments] = useState<number[]>([]);
  const [termoQ1, setTermoQ1] = useState<'sim' | 'nao' | null>(null);
  const [termoQ2, setTermoQ2] = useState<'sim' | 'nao' | null>(null);
  const [termoQ3, setTermoQ3] = useState<'sim' | 'nao' | null>(null);
  const [termoSigned, setTermoSigned] = useState(false);
  const [termoStatus, setTermoStatus] = useState<string>('Pendente');
  const [selectedEthnicity, setSelectedEthnicity] = useState('Parda');
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState('Ensino superior');

  const academicLevels = [
    'Selecione',
    'Não informado',
    'Ensino fundamental',
    'Ensino médio',
    'Ensino superior',
    'Especialização',
    'Mestrado',
    'Doutorado',
    'Pós-doutorado',
  ];

  const ethnicities = [
    'Amarela',
    'Branca',
    'Indígena',
    'Parda',
    'Preta',
  ];

  // Documentos gerais (não específicos de bolsa)
  const generalDocuments = [
    { id: 1, requisito: 'Nível Médio', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 2, requisito: 'Nível Superior', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 3, requisito: 'RG', documento: 'Imagem Frente e Verso do RG', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 4, requisito: 'CPF', documento: 'CPF ou Comprovante de Situação Cadastral', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 6, requisito: 'Lattes', documento: 'PDF gerado pela plataforma', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 7, requisito: 'Certidão Negativa de Débito - Municipal', documento: 'Certidão de Regularidade Fiscal Municipal', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 8, requisito: 'Certidão Negativa de Débito - Estadual', documento: 'Certidão de Regularidade Fiscal Estadual', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 9, requisito: 'Certidão Negativa de Débito - Federal', documento: 'Certidão de Regularidade Fiscal Federal', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 10, requisito: 'Certidão Negativa de Débito - Trabalhista', documento: 'Extrato CAGED', dataEnvio: '20/02/2026', status: 'Validado' },
    { id: 12, requisito: 'Plano de Trabalho', documento: 'Formulário de Atividades Bolsista', dataEnvio: '20/02/2026', status: 'Validado' },
  ];

  // Documentos BPIG-II (bolsa mais atual)
  const bpigIIDocuments = [
    { id: 204, requisito: 'Termo de Responsabilidade', documento: 'Assinatura Digital', dataEnvio: '25/02/2026', status: termoStatus, bolsa: 'BPIG-II' },
    { id: 201, requisito: 'Titulação mínima ou comprovação de experiência profissional', documento: 'Diploma de maior titulação', dataEnvio: '-', status: 'Pendente', bolsa: 'BPIG-II' },
    { id: 202, requisito: 'Comprovante de Residência', documento: 'Dentre os últimos 6 meses', dataEnvio: '25/02/2026', status: 'Em Validação', bolsa: 'BPIG-II' },
    { id: 203, requisito: 'Não ter vínculo empregatício', documento: 'CNIS', dataEnvio: '25/02/2026', status: 'Reprovado', bolsa: 'BPIG-II' },
  ];

  const documents = [...bpigIIDocuments, ...generalDocuments];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validado':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.2)' };
      case 'Pendente':
        return { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.2)' };
      case 'Em Validação':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.2)' };
      case 'Reprovado':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: 'rgba(239, 68, 68, 0.2)' };
      default:
        return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' };
    }
  };

  const handleDragEnter = (e: React.DragEvent, docId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(docId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const uploadFile = async (file: File, docId: number) => {
    setUploadingDocId(docId);
    setUploadErros(prev => { const n = { ...prev }; delete n[docId]; return n; });
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('docId', String(docId));
      const res = await fetch('/api/documentos/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setUploadErros(prev => ({ ...prev, [docId]: body.erro ?? 'Erro ao enviar documento.' }));
        return;
      }
      const data = await res.json();
      toast.success(data.mensagem ?? 'Documento enviado com sucesso!');
    } catch {
      setUploadErros(prev => ({ ...prev, [docId]: 'Não foi possível conectar ao servidor de armazenamento. Tente novamente.' }));
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, docId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) uploadFile(files[0], docId);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docId: number) => {
    const files = e.target.files;
    if (files && files.length > 0) uploadFile(files[0], docId);
  };

  const handleDeleteDocument = (docId: number) => {
    setDeletedDocuments(prev => [...prev, docId]);
    console.log(`Documento ${docId} excluído. Permitindo novo upload.`);
  };

  const toggleExpand = (docId: number, status: string) => {
    // Allow expansion for Pendente, Em Validação, RG (id: 3), CPF (id: 4), Residência (id: 5), Lattes (id: 6), Municipal (id: 7), Estadual (id: 8), Federal (id: 9), Trabalhista (id: 10), Nível Acadêmico (id: 11), Plano de Trabalho (id: 12), and CNIS (id: 13)
    if (status === 'Pendente' || status === 'Em Validação' || docId === 3 || docId === 4 || docId === 5 || docId === 6 || docId === 7 || docId === 8 || docId === 9 || docId === 10 || docId === 11 || docId === 12 || docId === 13) {
      setExpandedDocId(expandedDocId === docId ? null : docId);
    }
  };

  // Component to display document image with delete button
  const DocumentImageWithDelete = ({ imageSrc, alt, docId }: { imageSrc: string; alt: string; docId: number }) => (
    <div>
      {/* Texto explicativo e botão de excluir - texto ocupa todo espaço horizontal no mobile, botão alinhado à direita logo abaixo */}
      <div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4"
        style={{ marginBottom: '1.5rem' }}
      >
        <p 
          style={{ 
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            margin: 0,
          }}
          className="flex-1"
        >
          Se você precisa atualizar seu documento, primeiro exclua o anterior e depois envie o novo.
        </p>
        
        <button
          onClick={() => handleDeleteDocument(docId)}
          className="flex items-center gap-2 px-4 py-2 transition-all self-end md:self-auto"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--foreground)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--destructive)';
            e.currentTarget.style.color = 'var(--destructive)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--foreground)';
          }}
        >
          <Trash2 size={16} />
          Excluir Documento
        </button>
      </div>
      
      {/* Imagem do documento */}
      <div
        className="flex justify-center"
        style={{
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          marginTop: '2rem',
        }}
      >
        <img 
          src={imageSrc} 
          alt={alt} 
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );

  // Component to display drag and drop area
  const DragDropArea = ({ docId }: { docId: number }) => (
    <div
      onDragEnter={(e) => handleDragEnter(e, docId)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, docId)}
      className="flex flex-col items-center justify-center py-8 px-4 transition-all"
      style={{
        border: '2px dashed',
        borderColor: dragActive === docId ? 'var(--primary)' : 'var(--border)',
        borderRadius: 'var(--radius)',
        backgroundColor: dragActive === docId ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
        cursor: 'pointer',
        minHeight: '200px',
      }}
    >
      <p 
        style={{ 
          color: 'var(--foreground)', 
          fontSize: 'var(--text-sm)', 
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}
      >
        Arraste e solte o arquivo aqui
      </p>
      <p 
        style={{ 
          color: 'var(--muted-foreground)', 
          fontSize: 'var(--text-xs)', 
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        ou
      </p>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
        }}
      >
        <Upload size={16} />
        Selecionar arquivo
        <input
          type="file"
          onChange={(e) => handleFileSelect(e, docId)}
          style={{ display: 'none' }}
          accept="image/*,.pdf"
        />
      </label>
    </div>
  );

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
      <h3
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
      </h3>
    </div>
  );

  const dataSectionStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
  };
  const dataFieldBackground = '#262626';
  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block mb-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
      {children}
      <span style={{ color: 'var(--destructive-foreground)', marginLeft: '4px' }}>*</span>
    </label>
  );

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
          }}
        >
          <User size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)' }}>
          Minhas Informações
        </h1>
      </div>

      {/* Desktop Tab Bar - Horizontal */}
      <div 
        className="hidden md:flex gap-6 mb-8"
        style={{
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => setActiveTab('documentos')}
          className="pb-3 transition-all"
          style={{
            color: activeTab === 'documentos' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            marginBottom: '-1px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'documentos' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Meus Documentos
        </button>
        <button
          onClick={() => setActiveTab('dados')}
          className="pb-3 transition-all"
          style={{
            color: activeTab === 'dados' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            marginBottom: '-1px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'dados' ? '2px solid var(--primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Meus Dados
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
          onClick={() => setActiveTab('documentos')}
          className="py-3 pl-4 transition-all text-left"
          style={{
            color: activeTab === 'documentos' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            borderLeft: activeTab === 'documentos' ? '2px solid var(--primary)' : '2px solid transparent',
            marginLeft: '-2px',
            cursor: 'pointer',
          }}
        >
          Meus Documentos
        </button>
        <button
          onClick={() => setActiveTab('dados')}
          className="py-3 pl-4 transition-all text-left"
          style={{
            color: activeTab === 'dados' ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            borderLeft: activeTab === 'dados' ? '2px solid var(--primary)' : '2px solid transparent',
            marginLeft: '-2px',
            cursor: 'pointer',
          }}
        >
          Meus Dados
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dados' && (
        <div className="space-y-6">
          {/* Dados Pessoais Section */}
          <section style={dataSectionStyle}>
            <SectionHeader number={1} title="Dados Pessoais" />

            <div className="space-y-6">
              {/* Row 1: Nome Completo | Nome Social */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RequiredLabel>Nome Completo</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Paulo Sérgio Junior"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    Nome Social
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: CPF | Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RequiredLabel>CPF</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="123.456.789-00"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Data de Nascimento</RequiredLabel>
                  <input
                    type="date"
                    defaultValue="1995-03-15"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Row 3: E-mail | Celular */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RequiredLabel>E-mail</RequiredLabel>
                  <input
                    type="email"
                    defaultValue="paulo.souza@example.com"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Celular</RequiredLabel>
                  <input
                    type="tel"
                    defaultValue="(27) 99999-9999"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Row 4: Gênero | Etnia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RequiredLabel>Gênero</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Masculino"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Etnia</RequiredLabel>
                  <Dropdown
                    value={selectedEthnicity}
                    onChange={setSelectedEthnicity}
                    options={ethnicities.map(ethnicity => ({ value: ethnicity, label: ethnicity }))}
                    backgroundColor={dataFieldBackground}
                  />
                </div>
              </div>

              {/* Row 5: Lattes | Nível Acadêmico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RequiredLabel>Lattes</RequiredLabel>
                  <input
                    type="url"
                    defaultValue="http://lattes.cnpq.br/1234567890"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--primary)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      textDecoration: 'underline',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Nível Acadêmico</RequiredLabel>
                  <Dropdown
                    value={selectedAcademicLevel}
                    onChange={setSelectedAcademicLevel}
                    options={academicLevels.map(level => ({ value: level, label: level }))}
                    backgroundColor={dataFieldBackground}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Endereço Residencial Section */}
          <section style={dataSectionStyle}>
            <SectionHeader number={2} title="Endereço Residencial" />

            <div className="space-y-6">
              {/* Row 1: Rua | Número | Complemento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <RequiredLabel>Rua</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Rua das Flores"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Número</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="123"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
                    Complemento
                  </label>
                  <input
                    type="text"
                    defaultValue="Apto 101"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: CEP | Bairro | Município */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <RequiredLabel>CEP</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="29000-000"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Bairro</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Centro"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>Município</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Vitória"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Estado | País */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RequiredLabel>Estado</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Espírito Santo"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <div>
                  <RequiredLabel>País</RequiredLabel>
                  <input
                    type="text"
                    defaultValue="Brasil"
                    className="w-full px-4 py-2 border transition-colors"
                    style={{
                      backgroundColor: dataFieldBackground,
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Dados Bancários Section */}
          <section style={dataSectionStyle}>
            <SectionHeader number={3} title="Dados Bancários" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <RequiredLabel>Banco</RequiredLabel>
                <input
                  type="text"
                  value="Banestes"
                  readOnly
                  className="w-full px-4 py-2 border transition-colors"
                  style={{
                    backgroundColor: dataFieldBackground,
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    cursor: 'not-allowed',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
              <div>
                <RequiredLabel>Agência</RequiredLabel>
                <input
                  type="text"
                  defaultValue="0001"
                  className="w-full px-4 py-2 border transition-colors"
                  style={{
                    backgroundColor: dataFieldBackground,
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
              <div>
                <RequiredLabel>Conta</RequiredLabel>
                <input
                  type="text"
                  defaultValue="12345678-9"
                  className="w-full px-4 py-2 border transition-colors"
                  style={{
                    backgroundColor: dataFieldBackground,
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
            </div>
          </section>

          {/* Update Button */}
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-3 transition-colors"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderRadius: 'var(--radius)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Save size={16} />
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {activeTab === 'documentos' && (
        <div>
          <section>
            <div className="flex items-center gap-3 mb-2">
              <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'rgba(8, 145, 178, 0.1)',
                }}
              >
                <FileText size={20} />
              </div>
              <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
                Documentos Solicitados
              </h3>
            </div>

            <p 
              className="mb-8" 
              style={{ 
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
              }}
            >
              Clique na linha para mais detalhes. O Comprovante de Residência é válido por 3 meses.
            </p>

            <div 
              className="mb-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
                  Bolsa: BPIG-II
                </h3>
                <span
                  className="inline-flex items-center px-2.5 py-1"
                  style={{
                    borderRadius: '9999px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: 'rgb(34, 197, 94)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  Em Andamento
                </span>
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
              </p>
            </div>

            {/* Desktop Cards */}
            <div className="hidden md:grid md:grid-cols-1 gap-4">
              {/* All Documents */}
              {documents.map((doc, index) => {
                const statusColors = getStatusColor(doc.status);
                const isExpanded = expandedDocId === doc.id;
                const isPending = doc.status === 'Pendente';
                const isInValidation = doc.status === 'Em Validação';
                const isValidated = doc.status === 'Validado';
                const isReprovado = doc.status === 'Reprovado';

                if (index >= 4 && !expandedCanceledScholarship) {
                  if (index !== 4) return null;

                  return (
                    <button
                      key="bpig-i-collapsed"
                      type="button"
                      onClick={() => setExpandedCanceledScholarship(true)}
                      className="w-full p-5 text-left"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        marginTop: '1.5rem',
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 style={{ color: 'var(--foreground)', margin: 0 }}>Bolsa: BPIG-I</h3>
                            <span className="inline-flex items-center px-2.5 py-1" style={{ borderRadius: '9999px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                              Cancelada
                            </span>
                          </div>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                          </p>
                        </div>
                        <ChevronDown size={18} style={{ color: 'var(--muted-foreground)' }} />
                      </div>
                    </button>
                  );
                }
                
                return (
                  <div key={doc.id}>
                    {index === 4 && (
                      <>
                        <div
                          style={{
                            height: '1px',
                            backgroundColor: 'var(--border)',
                            margin: '1.5rem 0',
                          }}
                        />
                        <div className="flex flex-col gap-3 mb-4">
                          <button
                            type="button"
                            onClick={() => setExpandedCanceledScholarship(false)}
                            className="flex items-center justify-between gap-3 w-full text-left"
                            style={{ backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-family)' }}
                          >
                          <div className="flex items-center gap-2">
                            <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
                              Bolsa: BPIG-I
                            </h3>
                            <span
                              className="inline-flex items-center px-2.5 py-1"
                              style={{
                                borderRadius: '9999px',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-medium)',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: 'rgb(239, 68, 68)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                              }}
                            >
                              Cancelada
                            </span>
                          </div>
                          <ChevronDown size={18} style={{ color: 'var(--muted-foreground)', transform: 'rotate(180deg)' }} />
                          </button>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                          </p>
                        </div>
                      </>
                    )}
                    <div 
                      className="overflow-hidden"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                    {/* Card Header - Clicável apenas se Pendente */}
                    <div 
                      className="p-5"
                      onClick={() => toggleExpand(doc.id, doc.status)}
                      style={{
                        cursor: (isPending || isInValidation || isReprovado || doc.id === 3 || doc.id === 4 || doc.id === 6 || doc.id === 7 || doc.id === 8 || doc.id === 9 || doc.id === 10 || doc.id === 12 || doc.id === 201 || doc.id === 202 || doc.id === 203) ? 'pointer' : 'default',
                      }}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
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

                        {/* Requisito */}
                        <div className="col-span-3" style={{ marginLeft: '-1rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Requisito
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                            {doc.requisito}
                          </div>
                        </div>

                        {/* Documento */}
                        <div className="col-span-4" style={{ marginLeft: '2.5rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Documento
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                            {doc.documento}
                          </div>
                        </div>

                        {/* Data de Envio */}
                        <div className="col-span-2" style={{ marginLeft: '2.5rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Data de Envio
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                            {doc.dataEnvio}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2" style={{ marginLeft: '2.5rem' }}>
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
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Área Expansível - Drag and Drop */}
                    {isExpanded && (isPending || isInValidation || isReprovado || doc.id === 2 || doc.id === 3 || doc.id === 4 || doc.id === 6 || doc.id === 7 || doc.id === 8 || doc.id === 9 || doc.id === 10 || doc.id === 12 || doc.id === 201 || doc.id === 202 || doc.id === 203) && (
                      <div 
                        className="px-5 pb-5"
                        style={{
                          borderTop: '1px solid var(--border)',
                          paddingTop: '1.25rem',
                        }}
                      >
                        {/* Termo de Responsabilidade - formulário especial */}
                        {isPending && doc.id === 204 && (
                          <div>
                            {/* Instrução */}
                            {!termoSigned && (
                              <p style={{
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                                margin: '0 0 1.5rem 0',
                              }}>
                                Para dar continuidade ao processo de solicitação de bolsa, preencha os campos abaixo para aceitar o Termo de Responsabilidade:
                              </p>
                            )}

                            {/* Perguntas */}
                            {!termoSigned && (
                              <div style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                {/* Pergunta 1 */}
                                <div style={{ padding: '1rem' }}>
                                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }}>
                                    Recebe outra bolsa?
                                  </p>
                                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {(['sim', 'nao'] as const).map((val) => (
                                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                          type="radio"
                                          name="termo-q1"
                                          value={val}
                                          checked={termoQ1 === val}
                                          onChange={() => setTermoQ1(val)}
                                          style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                                        />
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                          {val === 'sim' ? 'Sim' : 'Não'}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

                                {/* Pergunta 2 */}
                                <div style={{ padding: '1rem' }}>
                                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }}>
                                    Possui vínculo de parentesco, consanguinidade ou afim, em linha reta ou colateral, até terceiro grau com o coordenador do projeto e com o orientador ou supervisor?
                                  </p>
                                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {(['sim', 'nao'] as const).map((val) => (
                                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                          type="radio"
                                          name="termo-q2"
                                          value={val}
                                          checked={termoQ2 === val}
                                          onChange={() => setTermoQ2(val)}
                                          style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                                        />
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                          {val === 'sim' ? 'Sim' : 'Não'}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

                                {/* Pergunta 3 */}
                                <div style={{ padding: '1rem' }}>
                                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }}>
                                    Exerce atividade remunerada de qualquer natureza, laboral ou não, em caráter eventual ou não?
                                  </p>
                                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {(['sim', 'nao'] as const).map((val) => (
                                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                          type="radio"
                                          name="termo-q3"
                                          value={val}
                                          checked={termoQ3 === val}
                                          onChange={() => setTermoQ3(val)}
                                          style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                                        />
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                          {val === 'sim' ? 'Sim' : 'Não'}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Documento + botão Assinar — aparece após responder todas as perguntas */}
                            {(termoQ1 && termoQ2 && termoQ3) && !termoSigned && (
                              <div>
                                <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 0 1.5rem 0' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                  <img src={termoPg1Image} alt="Termo de Responsabilidade - Página 1" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                  <img src={termoPg2Image} alt="Termo de Responsabilidade - Página 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => { setTermoSigned(true); setTermoStatus('Em Validação'); }}
                                    className="inline-flex items-center gap-2 px-5 py-2"
                                    style={{
                                      backgroundColor: 'var(--primary)',
                                      color: 'var(--primary-foreground)',
                                      border: 'none',
                                      borderRadius: 'var(--radius)',
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      cursor: 'pointer',
                                      transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  >
                                    Assinar
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Estado após assinatura */}
                            {termoSigned && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div
                                  className="flex items-center gap-3 p-4"
                                  style={{
                                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                                    border: '1px solid rgba(34, 197, 94, 0.25)',
                                    borderRadius: 'var(--radius)',
                                  }}
                                >
                                  <div style={{ color: 'rgb(34, 197, 94)', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(34,197,94,0.15)"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="rgb(34,197,94)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </div>
                                  <p style={{ color: 'rgb(34, 197, 94)', fontSize: 'var(--text-sm)', margin: 0 }}>
                                    Termo de Responsabilidade assinado com sucesso. Aguardando validação da equipe.
                                  </p>
                                </div>
                                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                                    <Paperclip size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Documento assinado</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    <img src={termoPg1Image} alt="Termo de Responsabilidade - Página 1" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                    <img src={termoPg2Image} alt="Termo de Responsabilidade - Página 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Upload padrão para demais documentos pendentes */}
                        {isPending && doc.id !== 204 && (
                          // Drag and Drop Area
                          <div
                            onDragEnter={(e) => handleDragEnter(e, doc.id)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, doc.id)}
                            className="flex flex-col items-center justify-center py-8 px-4 transition-all"
                            style={{
                              border: '2px dashed',
                              borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                              borderRadius: 'var(--radius)',
                              backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                              cursor: 'pointer',
                              minHeight: '200px',
                            }}
                            onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                          >
                            {/* Upload Icon */}
                            <div
                              className="mb-4"
                              style={{
                                color: 'var(--muted-foreground)',
                              }}
                            >
                              <Upload size={32} />
                            </div>

                            {/* Upload Text */}
                            <p 
                              className="mb-4"
                              style={{ 
                                color: 'var(--muted-foreground)', 
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-normal)',
                                margin: 0,
                                marginBottom: '1.5rem',
                              }}
                            >
                              Arraste e solte o arquivo aqui ou
                            </p>

                            {/* Upload Button */}
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 px-4 py-2"
                              style={{
                                backgroundColor: 'transparent',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById(`file-upload-${doc.id}`)?.click();
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--muted)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Paperclip size={16} />
                              Anexar Arquivo
                            </button>

                            {/* Hidden File Input */}
                            <input
                              id={`file-upload-${doc.id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileSelect(e, doc.id)}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                          </div>
                        )}

                        {/* Documento visualizado - Em Validação ou Validado */}
                        {(isInValidation || isValidated || doc.id === 2 || doc.id === 3 || doc.id === 4 || doc.id === 6 || doc.id === 7 || doc.id === 8 || doc.id === 9 || doc.id === 10 || doc.id === 12 || doc.id === 201 || doc.id === 202 || doc.id === 203) && !isPending && !isReprovado && doc.id !== 204 && (
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            {/* Preview da imagem */}
                            <div style={{ flex: '0 0 200px' }}>
                              <img 
                                src={
                                  doc.id === 2 ? nivelSuperiorImage :
                                  doc.id === 3 ? rgImage :
                                  doc.id === 4 ? cpfImage :
                                  doc.id === 5 ? residenceImage :
                                  doc.id === 6 ? lattesImage :
                                  doc.id === 7 ? municipalImage :
                                  doc.id === 8 ? estadualImage :
                                  doc.id === 9 ? federalImage :
                                  doc.id === 10 ? trabalhistaImage :
                                  doc.id === 12 ? planoTrabalhoImage :
                                  doc.id === 202 ? residenceImage :
                                  doc.id === 203 ? cnisImage :
                                  exampleImage
                                }
                                alt={doc.requisito}
                                style={{ 
                                  width: '200px', 
                                  height: 'auto',
                                  borderRadius: 'var(--radius)',
                                  border: '1px solid var(--border)',
                                }}
                              />
                            </div>

                            {/* Detalhes do documento */}
                            <div style={{ flex: 1 }}>
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                  Nome do arquivo
                                </div>
                                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                  {doc.documento}.pdf
                                </div>
                              </div>

                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                  Data de envio
                                </div>
                                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                  {doc.dataEnvio}
                                </div>
                              </div>

                              {isInValidation && (
                                <div 
                                  className="flex items-center gap-2 px-3 py-2"
                                  style={{
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderRadius: 'var(--radius)',
                                    marginTop: '1rem',
                                  }}
                                >
                                  <div style={{ color: 'rgb(59, 130, 246)', fontSize: 'var(--text-sm)' }}>
                                    Documento em validação pela equipe
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {isReprovado && (
                          <>
                            <div 
                              className="mb-5 p-4"
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius)',
                              }}
                            >
                              <p style={{ color: '#ef4444', fontSize: 'var(--text-sm)', margin: 0 }}>
                                O documento enviado não foi aprovado. Por favor, verifique e envie um novo documento válido.
                              </p>
                            </div>
                            <div
                              onDragEnter={(e) => handleDragEnter(e, doc.id)}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, doc.id)}
                              className="flex flex-col items-center justify-center py-8 px-4 transition-all mb-5"
                              style={{
                                border: '2px dashed',
                                borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                                borderRadius: 'var(--radius)',
                                backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                                cursor: 'pointer',
                                minHeight: '200px',
                              }}
                              onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                            >
                              <div className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                                <Upload size={32} />
                              </div>
                              <p className="mb-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0, marginBottom: '1.5rem' }}>
                                Arraste e solte o arquivo aqui ou
                              </p>
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 px-4 py-2"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: 'var(--foreground)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  cursor: 'pointer',
                                }}
                              >
                                <Paperclip size={16} />
                                Anexar Arquivo
                              </button>
                              <input
                                id={`file-upload-${doc.id}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, doc.id)}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </div>
                            {!deletedDocuments.includes(doc.id) && (
                              <>
                                <div className="mb-5" style={{ height: '1px', backgroundColor: 'var(--border)' }} />
                                <div>
                                  <div className="flex justify-center" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                    <img 
                                      src={cnisImage} 
                                      alt="CNIS" 
                                      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="flex items-center gap-2 mt-4 px-4 py-2"
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid var(--border)',
                                      borderRadius: 'var(--radius)',
                                      color: 'var(--destructive)',
                                      fontSize: 'var(--text-sm)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Trash2 size={16} />
                                    Excluir documento reprovado
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    </div>
                  </div>
                );
              })}

              {false && (
                <div 
                  className="mt-8 mb-4"
                  style={{
                    borderTop: '2px solid var(--border)',
                    paddingTop: '1.5rem',
                  }}
                >
                <div className="mb-4">
                  <h4 
                    style={{ 
                      color: 'var(--foreground)', 
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Bolsa: BPIG-I
                  </h4>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      margin: 0,
                    }}
                  >
                    Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                  </p>
                </div>
                <div className="space-y-4">
                {bpigIIDocuments.map((doc) => {
                const statusColors = getStatusColor(doc.status);
                const isExpanded = expandedDocId === doc.id;
                const isPending = doc.status === 'Pendente';
                const isInValidation = doc.status === 'Em Validação';
                const isValidated = doc.status === 'Validado';
                
                return (
                  <div 
                    key={doc.id}
                    className="overflow-hidden"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    {/* Card Header - Clicável apenas se Pendente */}
                    <div 
                      className="p-5"
                      onClick={() => toggleExpand(doc.id, doc.status)}
                      style={{
                        cursor: (isPending || isInValidation || doc.id === 3 || doc.id === 4 || doc.id === 5 || doc.id === 6 || doc.id === 7 || doc.id === 8 || doc.id === 9 || doc.id === 10 || doc.id === 11 || doc.id === 12 || doc.id === 13) ? 'pointer' : 'default',
                      }}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
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

                        {/* Requisito */}
                        <div className="col-span-3" style={{ marginLeft: '-1rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Requisito
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                            {doc.requisito}
                          </div>
                        </div>

                        {/* Documento */}
                        <div className="col-span-4" style={{ marginLeft: '2.5rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Documento
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                            {doc.documento}
                          </div>
                        </div>

                        {/* Data de Envio */}
                        <div className="col-span-2" style={{ marginLeft: '2.5rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Data de Envio
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }}>
                            {doc.dataEnvio}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2" style={{ marginLeft: '2.5rem' }}>
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
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Área Expansível - Drag and Drop */}
                    {isExpanded && (isPending || isInValidation || doc.id === 2 || doc.id === 3 || doc.id === 4 || doc.id === 5 || doc.id === 6 || doc.id === 7 || doc.id === 8 || doc.id === 9 || doc.id === 10 || doc.id === 11 || doc.id === 12 || doc.id === 13) && (
                      <div 
                        className="px-5 pb-5"
                        style={{
                          borderTop: '1px solid var(--border)',
                          paddingTop: '1.25rem',
                        }}
                      >
                        {isPending && (
                          // Drag and Drop Area
                          <div
                            onDragEnter={(e) => handleDragEnter(e, doc.id)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, doc.id)}
                            className="flex flex-col items-center justify-center py-8 px-4 transition-all"
                            style={{
                              border: '2px dashed',
                              borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                              borderRadius: 'var(--radius)',
                              backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                              cursor: 'pointer',
                              minHeight: '200px',
                            }}
                            onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                          >
                            {/* Upload Icon */}
                            <div
                              className="mb-4"
                              style={{
                                color: 'var(--muted-foreground)',
                              }}
                            >
                              <Upload size={32} />
                            </div>

                            {/* Upload Text */}
                            <p 
                              className="mb-4"
                              style={{ 
                                color: 'var(--muted-foreground)', 
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-normal)',
                                margin: 0,
                                marginBottom: '1.5rem',
                              }}
                            >
                              Arraste e solte o arquivo aqui ou
                            </p>

                            {/* Upload Button */}
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 px-4 py-2"
                              style={{
                                backgroundColor: 'transparent',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById(`file-upload-${doc.id}`)?.click();
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--muted)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Paperclip size={16} />
                              Anexar Arquivo
                            </button>

                            {/* Hidden File Input */}
                            <input
                              id={`file-upload-${doc.id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileSelect(e, doc.id)}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                          </div>
                        )}
                        
                        {isInValidation && doc.id !== 2 && (
                          // Image Display Area for "Em Validação"
                          <div
                            className="flex justify-center"
                            style={{
                              borderRadius: 'var(--radius)',
                              overflow: 'hidden',
                            }}
                          >
                            <img 
                              src={exampleImage} 
                              alt="Documento em validação" 
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                              }}
                            />
                          </div>
                        )}
                        
                        {doc.id === 2 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Nível Superior
                          <DocumentImageWithDelete imageSrc={nivelSuperiorImage} alt="Diploma de Nível Superior" docId={doc.id} />
                        )}
                        
                        {doc.id === 2 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 3 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for RG
                          <DocumentImageWithDelete imageSrc={rgImage} alt="Documento RG" docId={doc.id} />
                        )}
                        
                        {doc.id === 3 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 4 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for CPF
                          <DocumentImageWithDelete imageSrc={cpfImage} alt="Documento CPF" docId={doc.id} />
                        )}
                        
                        {doc.id === 4 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 5 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Residência
                          <DocumentImageWithDelete imageSrc={residenceImage} alt="Comprovante de Residência" docId={doc.id} />
                        )}
                        
                        {doc.id === 5 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 6 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Lattes
                          <DocumentImageWithDelete imageSrc={lattesImage} alt="Currículo Lattes" docId={doc.id} />
                        )}
                        
                        {doc.id === 6 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 7 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Municipal
                          <DocumentImageWithDelete imageSrc={municipalImage} alt="Certidão Negativa de Débito - Municipal" docId={doc.id} />
                        )}
                        
                        {doc.id === 7 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 8 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Estadual
                          <DocumentImageWithDelete imageSrc={estadualImage} alt="Certidão Negativa de Débito - Estadual" docId={doc.id} />
                        )}
                        
                        {doc.id === 8 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 9 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Federal
                          <DocumentImageWithDelete imageSrc={federalImage} alt="Certid��o Negativa de Débito - Federal" docId={doc.id} />
                        )}
                        
                        {doc.id === 9 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 10 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Trabalhista
                          <DocumentImageWithDelete imageSrc={trabalhistaImage} alt="Certidão Negativa de Débito - Trabalhista" docId={doc.id} />
                        )}
                        
                        {doc.id === 10 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 11 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Nível Acadêmico
                          <DocumentImageWithDelete imageSrc={nivelAcademicoImage} alt="Diploma de Nível Acadêmico" docId={doc.id} />
                        )}
                        
                        {doc.id === 11 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 12 && !deletedDocuments.includes(doc.id) && (
                          // Image Display Area for Plano de Trabalho
                          <DocumentImageWithDelete imageSrc={planoTrabalhoImage} alt="Plano de Trabalho - Formulário de Atividades Bolsista" docId={doc.id} />
                        )}
                        
                        {doc.id === 12 && deletedDocuments.includes(doc.id) && (
                          // Drag and Drop Area after deletion
                          <DragDropArea docId={doc.id} />
                        )}
                        
                        {doc.id === 13 && !isInValidation && !isPending && (
                          // Error message, Drag and Drop, Divider, and Image Display Area for CNIS
                          <>
                            {/* Error Message */}
                            <div 
                              className="mb-5 p-4"
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius)',
                              }}
                            >
                              <p style={{ 
                                color: '#ef4444',
                                fontSize: 'var(--text-sm)',
                                margin: 0,
                              }}>
                                O documento enviado não foi aprovado. Por favor, verifique e envie um novo documento válido.
                              </p>
                            </div>

                            {/* Drag and Drop Area */}
                            <div
                              onDragEnter={(e) => handleDragEnter(e, doc.id)}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, doc.id)}
                              className="flex flex-col items-center justify-center py-8 px-4 transition-all mb-5"
                              style={{
                                border: '2px dashed',
                                borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                                borderRadius: 'var(--radius)',
                                backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                                cursor: 'pointer',
                                minHeight: '200px',
                              }}
                              onClick={() => document.getElementById(`file-upload-reprovado-${doc.id}`)?.click()}
                            >
                              {/* Upload Icon */}
                              <div
                                className="mb-4"
                                style={{
                                  color: 'var(--muted-foreground)',
                                }}
                              >
                                <Upload size={32} />
                              </div>

                              {/* Upload Text */}
                              <p 
                                className="mb-4"
                                style={{ 
                                  color: 'var(--muted-foreground)', 
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-normal)',
                                  margin: 0,
                                  marginBottom: '1.5rem',
                                }}
                              >
                                Arraste e solte o arquivo aqui ou
                              </p>

                              {/* Upload Button */}
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 px-4 py-2"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: 'var(--foreground)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document.getElementById(`file-upload-reprovado-${doc.id}`)?.click();
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Paperclip size={16} />
                                Anexar Arquivo
                              </button>

                              {/* Hidden File Input */}
                              <input
                                id={`file-upload-reprovado-${doc.id}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, doc.id)}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </div>

                            {!deletedDocuments.includes(doc.id) && (
                              <>
                                {/* Divider */}
                                <div 
                                  className="mb-5"
                                  style={{
                                    height: '1px',
                                    backgroundColor: 'var(--border)',
                                  }}
                                />

                                {/* Image Display Area */}
                                <div>
                                  <div
                                    className="flex justify-center"
                                    style={{
                                      borderRadius: 'var(--radius)',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <img 
                                      src={cnisImage} 
                                      alt="CNIS - Documento de Comprovação de Ausência de Vínculo Trabalhista" 
                                      style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: 'block',
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="flex items-center gap-2 mt-4 px-4 py-2 transition-all"
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid var(--border)',
                                      borderRadius: 'var(--radius)',
                                      color: 'var(--destructive)',
                                      fontSize: 'var(--text-sm)',
                                      cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <Trash2 size={16} />
                                    Excluir documento reprovado
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
                </div>
              </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {/* Mobile BPIG-II Header */}
              <div className="flex flex-col gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
                    Bolsa: BPIG-II
                  </h3>
                  <span
                    className="inline-flex items-center px-2.5 py-1"
                    style={{
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: 'rgb(34, 197, 94)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                    }}
                  >
                    Em Andamento
                  </span>
                </div>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                </p>
              </div>
              {/* All Documents */}
              {documents.map((doc, index) => {
                const statusColors = getStatusColor(doc.status);
                const isExpanded = expandedDocId === doc.id;
                const isPending = doc.status === 'Pendente';
                const isInValidation = doc.status === 'Em Validação';
                const isValidated = doc.status === 'Validado';
                const isReprovado = doc.status === 'Reprovado';

                if (index >= 4 && !expandedCanceledScholarship) {
                  if (index !== 4) return null;

                  return (
                    <button
                      key="bpig-i-mobile-collapsed"
                      type="button"
                      onClick={() => setExpandedCanceledScholarship(true)}
                      className="w-full p-4 text-left"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        marginTop: '2rem',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 style={{ color: 'var(--foreground)', margin: 0 }}>Bolsa: BPIG-I</h3>
                            <span className="inline-flex items-center px-2.5 py-1" style={{ borderRadius: '9999px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                              Cancelada
                            </span>
                          </div>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                            Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                          </p>
                        </div>
                        <ChevronDown size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                      </div>
                    </button>
                  );
                }
                
                return (
                  <div 
                    key={doc.id}
                    className="overflow-hidden"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      marginTop: index === 4 ? '2rem' : '0',
                    }}
                  >
                    {index === 4 && (
                      <div style={{
                        height: '1px',
                        backgroundColor: 'var(--border)',
                        margin: '1rem 0 1.5rem',
                      }} />
                    )}
                    {index === 4 && (
                      <div className="flex flex-col gap-3 mb-2 p-4">
                        <button
                          type="button"
                          onClick={() => setExpandedCanceledScholarship(false)}
                          className="flex items-center justify-between gap-3 w-full text-left"
                          style={{ backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-family)' }}
                        >
                        <div className="flex items-center gap-2">
                          <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
                            Bolsa: BPIG-I
                          </h3>
                          <span
                            className="inline-flex items-center px-2.5 py-1"
                            style={{
                              borderRadius: '9999px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: 'rgb(239, 68, 68)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                            }}
                          >
                            Cancelada
                          </span>
                        </div>
                        <ChevronDown size={18} style={{ color: 'var(--muted-foreground)', transform: 'rotate(180deg)' }} />
                        </button>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                          Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                        </p>
                      </div>
                    )}
                    {/* Card Header - Clicável apenas se Pendente */}
                    <div 
                      className="p-4"
                      onClick={() => toggleExpand(doc.id, doc.status)}
                      style={{
                        cursor: (isPending || isInValidation || isReprovado || doc.id === 3 || doc.id === 4 || doc.id === 5 || doc.id === 6 || doc.id === 7 || doc.id === 8 || doc.id === 9 || doc.id === 10 || doc.id === 11 || doc.id === 12 || doc.id === 201 || doc.id === 202 || doc.id === 203) ? 'pointer' : 'default',
                      }}
                    >
                      {/* Header: Requisito and Status */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            <ChevronDown 
                              size={16} 
                              style={{ 
                                color: 'var(--muted-foreground)',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                              }} 
                            />
                          </div>
                          <div>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                              Requisito
                            </div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                              {doc.requisito}
                            </div>
                          </div>
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
                          {doc.status}
                        </span>
                      </div>

                      {/* Documento */}
                      <div className="mb-3 ml-6">
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Documento
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {doc.documento}
                        </div>
                      </div>

                      {/* Data de Envio */}
                      <div className="ml-6">
                        <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
                          Data de Envio
                        </div>
                        <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {doc.dataEnvio}
                        </div>
                      </div>
                    </div>

                    {/* Área Expansível */}
                    {isExpanded && (
                      <div 
                        className="px-5 pb-5"
                        style={{
                          borderTop: '1px solid var(--border)',
                          paddingTop: '1.25rem',
                        }}
                      >
                        {/* Termo de Responsabilidade - formulário especial (mobile) */}
                        {isPending && doc.id === 204 && (
                          <div>
                            {!termoSigned && (
                              <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 1.25rem 0' }}>
                                Para dar continuidade ao processo de solicitação de bolsa, preencha os campos abaixo para aceitar o Termo de Responsabilidade:
                              </p>
                            )}
                            {!termoSigned && (
                              <div style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '1.25rem', overflow: 'hidden' }}>
                                {/* Pergunta 1 */}
                                <div style={{ padding: '1rem' }}>
                                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }}>
                                    Recebe outra bolsa?
                                  </p>
                                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {(['sim', 'nao'] as const).map((val) => (
                                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="radio" name="termo-q1-m" value={val} checked={termoQ1 === val} onChange={() => setTermoQ1(val)} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }} />
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{val === 'sim' ? 'Sim' : 'Não'}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

                                {/* Pergunta 2 */}
                                <div style={{ padding: '1rem' }}>
                                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }}>
                                    Possui vínculo de parentesco, consanguinidade ou afim, em linha reta ou colateral, até terceiro grau com o coordenador do projeto e com o orientador ou supervisor?
                                  </p>
                                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {(['sim', 'nao'] as const).map((val) => (
                                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="radio" name="termo-q2-m" value={val} checked={termoQ2 === val} onChange={() => setTermoQ2(val)} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }} />
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{val === 'sim' ? 'Sim' : 'Não'}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

                                {/* Pergunta 3 */}
                                <div style={{ padding: '1rem' }}>
                                  <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }}>
                                    Exerce atividade remunerada de qualquer natureza, laboral ou não, em caráter eventual ou não?
                                  </p>
                                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {(['sim', 'nao'] as const).map((val) => (
                                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="radio" name="termo-q3-m" value={val} checked={termoQ3 === val} onChange={() => setTermoQ3(val)} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }} />
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{val === 'sim' ? 'Sim' : 'Não'}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            {(termoQ1 && termoQ2 && termoQ3) && !termoSigned && (
                              <div>
                                <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 0 1.25rem 0' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                  <img src={termoPg1Image} alt="Termo de Responsabilidade - Página 1" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                  <img src={termoPg2Image} alt="Termo de Responsabilidade - Página 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => { setTermoSigned(true); setTermoStatus('Em Validação'); }}
                                    className="inline-flex items-center gap-2 px-5 py-2"
                                    style={{
                                      backgroundColor: 'var(--primary)',
                                      color: 'var(--primary-foreground)',
                                      border: 'none',
                                      borderRadius: 'var(--radius)',
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: 'var(--font-weight-medium)',
                                      cursor: 'pointer',
                                      transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  >
                                    Assinar
                                  </button>
                                </div>
                              </div>
                            )}
                            {termoSigned && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="flex items-center gap-3 p-4" style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: 'var(--radius)' }}>
                                  <div style={{ color: 'rgb(34, 197, 94)', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(34,197,94,0.15)"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="rgb(34,197,94)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </div>
                                  <p style={{ color: 'rgb(34, 197, 94)', fontSize: 'var(--text-sm)', margin: 0 }}>
                                    Termo de Responsabilidade assinado com sucesso. Aguardando validação da equipe.
                                  </p>
                                </div>
                                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                                    <Paperclip size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Documento assinado</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    <img src={termoPg1Image} alt="Termo de Responsabilidade - Página 1" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                    <img src={termoPg2Image} alt="Termo de Responsabilidade - Página 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Upload padrão para demais documentos pendentes (mobile) */}
                        {isPending && doc.id !== 204 && (
                          // Drag and Drop Area
                          <div
                            onDragEnter={(e) => handleDragEnter(e, doc.id)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, doc.id)}
                            className="flex flex-col items-center justify-center py-8 px-4 transition-all"
                            style={{
                              border: '2px dashed',
                              borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                              borderRadius: 'var(--radius)',
                              backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                              cursor: 'pointer',
                              minHeight: '200px',
                            }}
                            onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                          >
                            <div className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                              <Upload size={32} />
                            </div>
                            <p className="mb-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0, marginBottom: '1.5rem' }}>
                              Arraste e solte o arquivo aqui ou
                            </p>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 px-4 py-2"
                              style={{
                                backgroundColor: 'transparent',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                cursor: 'pointer',
                              }}
                            >
                              <Paperclip size={16} />
                              Anexar Arquivo
                            </button>
                            <input
                              id={`file-upload-${doc.id}`}
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileSelect(e, doc.id)}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                          </div>
                        )}

                        {isInValidation && doc.id !== 204 && (
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: '0 0 200px' }}>
                              <img 
                                src={residenceImage}
                                alt={doc.requisito}
                                style={{ 
                                  width: '200px', 
                                  height: 'auto',
                                  borderRadius: 'var(--radius)',
                                  border: '1px solid var(--border)',
                                }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                  Nome do arquivo
                                </div>
                                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                  {doc.documento}.pdf
                                </div>
                              </div>
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                  Data de envio
                                </div>
                                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                  {doc.dataEnvio}
                                </div>
                              </div>
                              <div 
                                className="flex items-center gap-2 px-3 py-2"
                                style={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                  border: '1px solid rgba(59, 130, 246, 0.2)',
                                  borderRadius: 'var(--radius)',
                                  marginTop: '1rem',
                                }}
                              >
                                <div style={{ color: 'rgb(59, 130, 246)', fontSize: 'var(--text-sm)' }}>
                                  Documento em validação pela equipe
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {isValidated && (
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: '0 0 200px' }}>
                              <img 
                                src={doc.id === 101 ? nivelAcademicoImage : doc.id === 102 ? residenceImage : cnisImage}
                                alt={doc.requisito}
                                style={{ 
                                  width: '200px', 
                                  height: 'auto',
                                  borderRadius: 'var(--radius)',
                                  border: '1px solid var(--border)',
                                }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                  Nome do arquivo
                                </div>
                                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                  {doc.documento}.pdf
                                </div>
                              </div>
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                                  Data de envio
                                </div>
                                <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                                  {doc.dataEnvio}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {isReprovado && (
                          <>
                            <div 
                              className="mb-5 p-4"
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius)',
                              }}
                            >
                              <p style={{ color: '#ef4444', fontSize: 'var(--text-sm)', margin: 0 }}>
                                O documento enviado não foi aprovado. Por favor, verifique e envie um novo documento válido.
                              </p>
                            </div>
                            <div
                              onDragEnter={(e) => handleDragEnter(e, doc.id)}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, doc.id)}
                              className="flex flex-col items-center justify-center py-8 px-4 transition-all mb-5"
                              style={{
                                border: '2px dashed',
                                borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                                borderRadius: 'var(--radius)',
                                backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                                cursor: 'pointer',
                                minHeight: '200px',
                              }}
                              onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                            >
                              <div className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                                <Upload size={32} />
                              </div>
                              <p className="mb-4" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0, marginBottom: '1.5rem' }}>
                                Arraste e solte o arquivo aqui ou
                              </p>
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 px-4 py-2"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: 'var(--foreground)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius)',
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  cursor: 'pointer',
                                }}
                              >
                                <Paperclip size={16} />
                                Anexar Arquivo
                              </button>
                              <input
                                id={`file-upload-${doc.id}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, doc.id)}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </div>
                            {!deletedDocuments.includes(doc.id) && (
                              <>
                                <div className="mb-5" style={{ height: '1px', backgroundColor: 'var(--border)' }} />
                                <div>
                                  <div className="flex justify-center" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                    <img 
                                      src={cnisImage} 
                                      alt="CNIS" 
                                      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="flex items-center gap-2 mt-4 px-4 py-2"
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid var(--border)',
                                      borderRadius: 'var(--radius)',
                                      color: 'var(--destructive)',
                                      fontSize: 'var(--text-sm)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Trash2 size={16} />
                                    Excluir documento reprovado
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default MyInfoPage;
