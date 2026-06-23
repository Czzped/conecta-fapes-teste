import React from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';

interface ConfiguracoesPageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onBack: () => void;
  action?: React.ReactNode;
}

export const ConfiguracoesPageHeader: React.FC<ConfiguracoesPageHeaderProps> = ({ title, subtitle, icon: Icon, onBack, action }) => {
  const { T } = useThemeTokens();

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', marginBottom: '18px' }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, color: T.textSecondary, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
            Configurações
          </button>
          <ChevronRight size={14} />
          <span style={{ color: T.textPrimary, fontWeight: 'var(--font-weight-medium)' }}>{title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ flex: 1, marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} style={{ color: T.accent }} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, margin: 0, lineHeight: '1.5' }}>
                {title}
              </h1>
            </div>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 0 48px', lineHeight: '1.5' }}>
              {subtitle}
            </p>
          </div>
          {action}
        </div>
      </div>

      <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, margin: '20px 0 28px' }} />
    </>
  );
};
