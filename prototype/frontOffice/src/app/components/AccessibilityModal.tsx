import { Sun, Moon, Monitor, X, RotateCcw, Type, Minus, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [contrast, setContrast] = useState<'normal' | 'high' | 'maximum'>('normal');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);

  useEffect(() => {
    // Carrega as preferências salvas
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'dark';
    const savedContrast = localStorage.getItem('contrast') as 'normal' | 'high' | 'maximum' || 'normal';
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | 'xlarge' || 'medium';
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
    const savedFocusIndicators = localStorage.getItem('focusIndicators') === 'true';
    const savedScreenReader = localStorage.getItem('screenReaderOptimized') === 'true';

    setTheme(savedTheme);
    setContrast(savedContrast);
    setFontSize(savedFontSize);
    setReduceMotion(savedReduceMotion);
    setFocusIndicators(savedFocusIndicators);
    setScreenReaderOptimized(savedScreenReader);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const handleContrastChange = (newContrast: 'normal' | 'high' | 'maximum') => {
    setContrast(newContrast);
    localStorage.setItem('contrast', newContrast);
    // Implementar lógica de contraste aqui
  };

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large' | 'xlarge') => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    
    // Aplicar tamanho da fonte
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = sizeMap[newSize];
  };

  const handleReduceMotionToggle = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    localStorage.setItem('reduceMotion', String(newValue));
    
    if (newValue) {
      document.documentElement.style.setProperty('--transition-duration', '0ms');
    } else {
      document.documentElement.style.removeProperty('--transition-duration');
    }
  };

  const handleFocusIndicatorsToggle = () => {
    const newValue = !focusIndicators;
    setFocusIndicators(newValue);
    localStorage.setItem('focusIndicators', String(newValue));
  };

  const handleScreenReaderToggle = () => {
    const newValue = !screenReaderOptimized;
    setScreenReaderOptimized(newValue);
    localStorage.setItem('screenReaderOptimized', String(newValue));
  };

  const handleResetDefaults = () => {
    setTheme('dark');
    setContrast('normal');
    setFontSize('medium');
    setReduceMotion(false);
    setFocusIndicators(false);
    setScreenReaderOptimized(false);
    
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('contrast', 'normal');
    localStorage.setItem('fontSize', 'medium');
    localStorage.setItem('reduceMotion', 'false');
    localStorage.setItem('focusIndicators', 'false');
    localStorage.setItem('screenReaderOptimized', 'false');
    
    document.documentElement.classList.add('dark');
    document.documentElement.style.fontSize = '16px';
    document.documentElement.style.removeProperty('--transition-duration');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className="fixed right-4 top-20 z-50 w-[280px] overflow-hidden"
        style={{
          backgroundColor: 'var(--popover)',
          borderColor: 'var(--border)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxHeight: 'calc(100vh - 6rem)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3"
        >
          <h2 
            style={{ 
              fontSize: '16px',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              margin: 0,
            }}
          >
            Acessibilidade
          </h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors"
            style={{
              color: 'var(--muted-foreground)',
              borderRadius: 'var(--radius)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-4"
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          {/* TEMA */}
          <div className="mb-6">
            <h3 
              className="mb-3"
              style={{ 
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              TEMA
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className="flex flex-col items-center justify-center gap-2 p-3 transition-colors"
                style={{
                  backgroundColor: theme === 'light' ? 'var(--primary)' : 'transparent',
                  color: theme === 'light' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: theme === 'light' ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <Sun size={20} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                  Claro
                </span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className="flex flex-col items-center justify-center gap-2 p-3 transition-colors"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--primary)' : 'transparent',
                  color: theme === 'dark' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: theme === 'dark' ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <Moon size={20} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                  Escuro
                </span>
              </button>
              <button
                onClick={() => handleThemeChange('auto')}
                className="flex flex-col items-center justify-center gap-2 p-3 transition-colors"
                style={{
                  backgroundColor: theme === 'auto' ? 'var(--primary)' : 'transparent',
                  color: theme === 'auto' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: theme === 'auto' ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <Monitor size={20} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                  Auto
                </span>
              </button>
            </div>
          </div>

          {/* CONTRASTE */}
          <div className="mb-6">
            <h3 
              className="mb-3"
              style={{ 
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              CONTRASTE
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleContrastChange('normal')}
                className="flex flex-col items-center justify-center p-3 transition-colors"
                style={{
                  backgroundColor: contrast === 'normal' ? 'var(--primary)' : 'transparent',
                  color: contrast === 'normal' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: contrast === 'normal' ? 'var(--primary)' : 'var(--border)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Normal
              </button>
              <button
                onClick={() => handleContrastChange('high')}
                className="flex flex-col items-center justify-center p-3 transition-colors"
                style={{
                  backgroundColor: contrast === 'high' ? 'var(--primary)' : 'transparent',
                  color: contrast === 'high' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: contrast === 'high' ? 'var(--primary)' : 'var(--border)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Alto
              </button>
              <button
                onClick={() => handleContrastChange('maximum')}
                className="flex flex-col items-center justify-center p-3 transition-colors"
                style={{
                  backgroundColor: contrast === 'maximum' ? 'var(--primary)' : 'transparent',
                  color: contrast === 'maximum' ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: contrast === 'maximum' ? 'var(--primary)' : 'var(--border)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Máximo
              </button>
            </div>
          </div>

          {/* TAMANHO DA FONTE */}
          <div className="mb-6">
            <h3 
              className="mb-3"
              style={{ 
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              TAMANHO DA FONTE
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'small', label: 'A', size: 12 },
                { value: 'medium', label: 'A', size: 16 },
                { value: 'large', label: 'A', size: 20 },
                { value: 'xlarge', label: 'A', size: 24 }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleFontSizeChange(item.value as any)}
                  className="flex flex-col items-center justify-center p-3 transition-colors"
                  style={{
                    backgroundColor: fontSize === item.value ? 'var(--primary)' : 'transparent',
                    color: fontSize === item.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                    borderRadius: 'var(--radius)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: fontSize === item.value ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  <span style={{ fontSize: `${item.size}px`, fontWeight: 'var(--font-weight-semibold)' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* OPÇÕES ADICIONAIS */}
          <div className="mb-4">
            <h3 
              className="mb-3"
              style={{ 
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              OPÇÕES ADICIONAIS
            </h3>
            
            {/* Reduzir Movimento */}
            <label 
              className="flex items-start gap-3 mb-4 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={handleReduceMotionToggle}
                className="mt-1"
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--primary)',
                }}
              />
              <div className="flex-1">
                <div 
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    marginBottom: '2px',
                  }}
                >
                  Reduzir Movimento
                </div>
                <div 
                  style={{ 
                    fontSize: 'var(--text-xs)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Minimiza animações e transições
                </div>
              </div>
            </label>

            {/* Indicadores de Foco */}
            <label 
              className="flex items-start gap-3 mb-4 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={focusIndicators}
                onChange={handleFocusIndicatorsToggle}
                className="mt-1"
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--primary)',
                }}
              />
              <div className="flex-1">
                <div 
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    marginBottom: '2px',
                  }}
                >
                  Indicadores de Foco
                </div>
                <div 
                  style={{ 
                    fontSize: 'var(--text-xs)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Destaca elementos focados
                </div>
              </div>
            </label>

            {/* Otimizar para Leitor de Tela */}
            <label 
              className="flex items-start gap-3 mb-4 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={screenReaderOptimized}
                onChange={handleScreenReaderToggle}
                className="mt-1"
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--primary)',
                }}
              />
              <div className="flex-1">
                <div 
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    marginBottom: '2px',
                  }}
                >
                  Otimizar para Leitor de Tela
                </div>
                <div 
                  style={{ 
                    fontSize: 'var(--text-xs)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Melhora compatibilidade com leitores de tela
                </div>
              </div>
            </label>
          </div>

          {/* Restaurar Padrões */}
          <button
            onClick={handleResetDefaults}
            className="w-full flex items-center justify-center gap-2 py-3 transition-colors"
            style={{
              color: 'var(--primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              borderRadius: 'var(--radius)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <RotateCcw size={16} />
            Restaurar Padrões
          </button>
        </div>
      </div>
    </>
  );
}
