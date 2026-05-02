import { Sun, Moon, Bell, User, Menu, LogOut, Globe, Check, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { AccessibilityModal } from '@/app/components/AccessibilityModal';
import { NotificationsSidebar } from '@/app/components/NotificationsSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Languages } from '@/locales/translations';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
  accessType?: 'cidadao' | 'voluntario' | 'bolsista' | 'coordenador' | 'diretor' | 'reitor';
}

export function Header({ onToggleSidebar, onToggleMobileMenu, isMobileMenuOpen, onLogout, onNavigate, accessType }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode como padrão
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const projectButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log('🎯 Header language changed to:', language);
  }, [language]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDarkMode = !isDarkMode;
    
    if (newIsDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    setIsDarkMode(newIsDarkMode);
  };

  const toggleAccessibility = () => {
    setShowAccessibility(!showAccessibility);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  const toggleProjectMenu = () => {
    setShowProjectMenu(!showProjectMenu);
  };

  const handleLanguageSelect = (lang: Languages) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const getLanguageLabel = (lang: Languages) => {
    switch (lang) {
      case 'pt':
        return 'Português';
      case 'en':
        return 'Inglês';
      case 'es':
        return 'Espanhol';
      default:
        return 'Português';
    }
  };

  const handleLogout = () => {
    // Implementar lógica de logout aqui
    console.log('Logout clicked');
    setShowProfileMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileButtonRef.current && !profileButtonRef.current.contains(event.target as Node)) {
        const profileMenu = document.querySelector('[data-profile-menu]');
        if (profileMenu && !profileMenu.contains(event.target as Node)) {
          setShowProfileMenu(false);
        }
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageButtonRef.current && !languageButtonRef.current.contains(event.target as Node)) {
        const languageMenu = document.querySelector('[data-language-menu]');
        if (languageMenu && !languageMenu.contains(event.target as Node)) {
          setShowLanguageMenu(false);
        }
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);

  // Close project menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectButtonRef.current && !projectButtonRef.current.contains(event.target as Node)) {
        const projectMenu = document.querySelector('[data-project-menu]');
        if (projectMenu && !projectMenu.contains(event.target as Node)) {
          setShowProjectMenu(false);
        }
      }
    };

    if (showProjectMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProjectMenu]);

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Initial check
    updateTheme();
    
    // Watch for changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header 
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'rgba(var(--card-rgb), 0.8)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          {/* Left side - Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 transition-colors"
              style={{
                color: 'var(--foreground)',
                borderRadius: 'var(--radius)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden md:block flex-1" />

          {/* Right side - Theme, Notifications, Profile */}
          <div className="flex items-center gap-2">
            {/* Project Menu */}
            {accessType === 'coordenador' && (
              <div className="relative">
                <button
                  ref={projectButtonRef}
                  onClick={toggleProjectMenu}
                  className="p-2 transition-colors"
                  style={{
                    color: 'var(--foreground)',
                    borderRadius: 'var(--radius)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  aria-label="Select project"
                >
                  <FileText size={20} />
                </button>

                {/* Project Menu */}
                <div
                  data-project-menu
                  className="absolute right-0 mt-2 transition-all duration-200"
                  style={{
                    top: '100%',
                    display: showProjectMenu ? 'block' : 'none',
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    minWidth: '240px',
                    zIndex: 50,
                  }}
                >
                  <div className="py-1">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 transition-colors text-left"
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Conecta Fapes
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 transition-colors text-left"
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Outro Exemplo de Projeto
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 transition-colors text-left"
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Mais um Exemplo de Projeto
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Theme toggle - Icon Button */}
            <button
              onClick={toggleAccessibility}
              className="p-2 transition-colors"
              style={{
                color: 'var(--foreground)',
                borderRadius: 'var(--radius)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Accessibility settings"
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 transition-colors relative"
                style={{
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {/* Notification badge */}
                <span 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--destructive-foreground)',
                  }}
                />
              </button>
            </div>

            {/* Language Selector - Desktop only */}
            <div className="hidden md:block relative">
              <button
                ref={languageButtonRef}
                onClick={toggleLanguageMenu}
                className="p-2 transition-colors"
                style={{
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Select language"
              >
                <Globe size={20} />
              </button>

              {/* Language Menu */}
              <div
                data-language-menu
                className="absolute right-0 mt-2 transition-all duration-200"
                style={{
                  top: '100%',
                  display: showLanguageMenu ? 'block' : 'none',
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  minWidth: '160px',
                  zIndex: 50,
                }}
              >
                <div className="py-1">
                  {['pt', 'en', 'es'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang as Languages)}
                      className="w-full flex items-center justify-between px-4 py-2 transition-colors"
                      style={{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{getLanguageLabel(lang as Languages)}</span>
                      {language === lang && (
                        <Check 
                          size={16} 
                          style={{ 
                            color: 'var(--primary)',
                          }} 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileMenu}
                className="p-2 transition-colors"
                style={{
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Profile"
              >
                <User size={20} />
              </button>
              
              {/* Profile Menu */}
              <div
                data-profile-menu
                className="absolute right-0 mt-2 transition-all duration-200"
                style={{
                  top: '100%',
                  display: showProfileMenu ? 'block' : 'none',
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  minWidth: '160px',
                  zIndex: 50,
                }}
              >
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 transition-colors"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--muted)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={16} />
                    {t('header.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Sidebar */}
      <NotificationsSidebar 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNavigate={onNavigate}
      />

      {/* Accessibility Modal */}
      <AccessibilityModal 
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </>
  );
}
