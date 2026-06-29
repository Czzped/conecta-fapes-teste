import { Sun, Moon, Monitor, X, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AccessibilityPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

type ThemeMode = 'light' | 'dark' | 'auto';
type ContrastMode = 'normal' | 'high' | 'maximum';
type FontSize = 'small' | 'normal' | 'large' | 'xlarge';

export function AccessibilityPopover({ isOpen, onClose, anchorEl }: AccessibilityPopoverProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [contrast, setContrast] = useState<ContrastMode>('normal');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    // TODO: Implement 'auto' mode based on system preference
  };

  const handleRestoreDefaults = () => {
    setTheme('light');
    setContrast('normal');
    setFontSize('normal');
    setReduceMotion(false);
    setFocusIndicators(false);
    setScreenReader(false);
    document.documentElement.classList.remove('dark');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-2"
      style={{
        width: '280px',
        backgroundColor: 'var(--popover)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-sm)',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          Acessibilidade
        </h3>
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
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* TEMA */}
        <div>
          <label
            className="block mb-3"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--muted-foreground)',
            }}
          >
            TEMA
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light' as ThemeMode, label: 'Claro', icon: Sun },
              { id: 'dark' as ThemeMode, label: 'Escuro', icon: Moon },
              { id: 'auto' as ThemeMode, label: 'Auto', icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleThemeChange(item.id)}
                  className="flex flex-col items-center gap-2 py-3 px-2 transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: isActive ? 'var(--primary)' : 'var(--foreground)',
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTRASTE */}
        <div>
          <label
            className="block mb-3"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--muted-foreground)',
            }}
          >
            CONTRASTE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal' as ContrastMode, label: 'Normal' },
              { id: 'high' as ContrastMode, label: 'Alto' },
              { id: 'maximum' as ContrastMode, label: 'Máximo' },
            ].map((item) => {
              const isActive = contrast === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setContrast(item.id)}
                  className="py-2 px-2 transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: isActive ? 'var(--primary)' : 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAMANHO DA FONTE */}
        <div>
          <label
            className="block mb-3"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--muted-foreground)',
            }}
          >
            TAMANHO DA FONTE
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'small' as FontSize, label: 'A', size: '12px' },
              { id: 'normal' as FontSize, label: 'A', size: '14px' },
              { id: 'large' as FontSize, label: 'A', size: '16px' },
              { id: 'xlarge' as FontSize, label: 'A', size: '18px' },
            ].map((item) => {
              const isActive = fontSize === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFontSize(item.id)}
                  className="py-2 px-2 transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: isActive ? 'var(--primary)' : 'var(--foreground)',
                    fontSize: item.size,
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* OPÇÕES ADICIONAIS */}
        <div>
          <label
            className="block mb-3"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--muted-foreground)',
            }}
          >
            OPÇÕES ADICIONAIS
          </label>
          <div className="space-y-3">
            {[
              {
                id: 'reduceMotion',
                checked: reduceMotion,
                onChange: setReduceMotion,
                label: 'Reduzir Movimento',
                description: 'Minimiza animações e transições',
              },
              {
                id: 'focusIndicators',
                checked: focusIndicators,
                onChange: setFocusIndicators,
                label: 'Indicadores de Foco',
                description: 'Destaca elementos focados',
              },
              {
                id: 'screenReader',
                checked: screenReader,
                onChange: setScreenReader,
                label: 'Otimizar para Leitor de Tela',
                description: 'Melhora compatibilidade com leitores de tela',
              },
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-start gap-3 cursor-pointer"
              >
                <div className="relative flex items-center" style={{ marginTop: '2px' }}>
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(e) => option.onChange(e.target.checked)}
                    className="peer"
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                    }}
                  />
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                      border: option.checked ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: option.checked ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      pointerEvents: 'none',
                    }}
                  >
                    {option.checked && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-normal)',
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      marginTop: '2px',
                    }}
                  >
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Restaurar Padrões */}
        <button
          onClick={handleRestoreDefaults}
          className="w-full flex items-center justify-center gap-2 py-2 transition-colors"
          style={{
            color: 'var(--primary)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.05)';
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
  );
}
