import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Brain,
  AlertCircle,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  Building2,
  Home as HomeIcon,
  Shield,
  CheckCircle,
  Sun,
  Moon,
  Library,
} from 'lucide-react';
import ShieldLogo from './ShieldLogo';
import PwCLogo from './PwCLogo';
import ShieldLockIcon from './ShieldLockIcon';

const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'Compliance Cockpit', href: '/dashboard', icon: LayoutDashboard },
  { name: 'DPIA Manager', href: '/dpia', icon: FileCheck },
  { name: 'AI Governance', href: '/ai-governance', icon: Brain },
  { name: 'AI Security', href: '/ai-security', icon: Shield, isCustom: true },
  { name: 'Incident Centre', href: '/incidents', icon: AlertCircle },
  { name: 'Policy Advisor', href: '/policy-advisor', icon: FileText },
  { name: 'Control Library', href: '/control-library', icon: Library },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const pageNames: { [key: string]: string } = {
  '/home': 'Home',
  '/dashboard': 'Compliance Cockpit',
  '/dpia': 'DPIA Manager',
  '/ai-governance': 'AI Governance',
  '/ai-security': 'AI Security Governance',
  '/incidents': 'Incident Centre',
  '/policy-advisor': 'Policy Advisor',
  '/control-library': 'Unified Control Library',
  '/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'GDPR Deadline Critical',
      body: 'IT Security incident notification due in 11 hours — supervisory authority must be notified.',
      time: '14 min ago',
      icon: AlertCircle,
      iconColor: '#DC2626',
      isRead: false,
      href: '/incidents'
    },
    {
      id: 2,
      title: 'DPIA Awaiting Approval',
      body: 'Biometric Access Control DPIA submitted by Facilities team — DPO sign-off required.',
      time: '2 hours ago',
      icon: Shield,
      iconColor: '#D04A02',
      isRead: false,
      href: '/dpia'
    },
    {
      id: 3,
      title: 'AI System Flagged',
      body: 'HR Recruitment Screener scored 61% on NIST AI RMF — below acceptable threshold.',
      time: 'Yesterday',
      icon: Settings,
      iconColor: '#2563EB',
      isRead: false,
      href: '/ai-governance'
    },
    {
      id: 4,
      title: 'DPIA Approved',
      body: 'Customer Data Analytics DPIA approved by DPO. Processing may commence.',
      time: '2 days ago',
      icon: CheckCircle,
      iconColor: '#059669',
      isRead: true,
      href: '/dpia'
    },
    {
      id: 5,
      title: 'Policy Analysis Complete',
      body: 'AI Ethics Policy gap analysis completed — 3 recommendations generated.',
      time: '3 days ago',
      icon: CheckCircle,
      iconColor: '#059669',
      isRead: true,
      href: '/policy-advisor'
    }
  ]);

  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (href: string) => {
    setNotificationsOpen(false);
    navigate(href);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleMobileSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const isHomePage = location.pathname === '/home';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <div
        className="hidden lg:block"
        onMouseEnter={() => setShowSidebar(true)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '20px',
          height: '100%',
          zIndex: 101,
          background: 'transparent',
        }}
      />

      {showSidebar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 99,
          }}
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        onMouseEnter={() => window.innerWidth >= 1024 && setShowSidebar(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setShowSidebar(false)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width: '280px',
          transform: showSidebar ? 'translateX(0)' : 'translateX(-280px)',
          transition: 'transform 0.25s ease',
          zIndex: 100,
          backgroundColor: 'var(--color-sidebar-bg)',
          borderRight: '1px solid var(--color-card-border)',
          willChange: 'transform',
        }}
        className="flex flex-col"
      >
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-card-border)' }}>
          <div className="flex items-center gap-3">
            <ShieldLogo className="w-8 h-8" />
            <div>
              <span className="text-xl font-display font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Privara
              </span>
              <div className="text-[10px] tracking-[0.5px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                Privacy & AI Governance Suite
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider px-3 py-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Main Menu
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            const isAISecurity = item.href === '/ai-security';
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setShowSidebar(false)}
                style={{
                  backgroundColor: isActive ? (isAISecurity ? 'rgba(124, 58, 237, 0.1)' : 'var(--color-nav-active-bg)') : 'transparent',
                  color: isActive ? (isAISecurity ? '#7C3AED' : '#D04A02') : 'var(--color-text-body)',
                  minHeight: '48px',
                }}
                className={`flex items-center gap-3 px-3 rounded-lg transition-all duration-200 text-[13px] relative ${
                  isActive ? 'font-medium' : ''
                } hover:bg-opacity-50`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r transition-all duration-200" style={{ backgroundColor: isAISecurity ? '#7C3AED' : '#D04A02' }} />
                )}
                <Icon className="w-[18px] h-[18px] transition-colors duration-200" strokeWidth={2} />
                <span className="transition-colors duration-200">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto" style={{ borderTop: '1px solid var(--color-card-border)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ fontSize: '13px', color: '#D04A02', fontWeight: 700 }}>PwC</span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Middle East</span>
          </div>
          <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
            Cybersecurity and Digital Trust
          </div>
        </div>
      </aside>

      <main style={{ width: '100%', marginLeft: 0 }}>
        <header className="h-14 sm:h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6" style={{ backgroundColor: 'var(--color-header-bg)', borderBottom: '1px solid var(--color-header-border)' }}>
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-home-button-bg)',
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="hidden sm:block flex-shrink-0">
              <PwCLogo />
            </div>
            <div className="hidden sm:block flex-shrink-0" style={{ width: '1px', height: '20px', backgroundColor: '#E5E7EB', margin: '0 12px' }} />
            {!isHomePage && (
              <button
                onClick={() => navigate('/home')}
                className="hidden sm:flex items-center justify-center px-3 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: 'var(--color-home-button-bg)',
                  border: '1px solid var(--color-home-button-border)',
                  color: 'var(--color-home-button-text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-home-button-hover-bg)';
                  e.currentTarget.style.color = '#D04A02';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-home-button-bg)';
                  e.currentTarget.style.color = 'var(--color-home-button-text)';
                }}
                title="Home"
              >
                <HomeIcon className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            )}
            <h1 className="text-base sm:text-xl font-display font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {pageNames[location.pathname] || 'Privara'}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-home-button-bg)' }}>
              <Building2 className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
              <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Meridian Group</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-home-button-bg)',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-home-button-hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-home-button-bg)';
              }}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-11 h-11 flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: 'var(--color-home-button-bg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-home-button-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-home-button-bg)';
                }}
              >
                <Bell className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#DC2626' }} />
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-card-border)',
                  }}
                >
                  <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h3>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs transition-colors min-h-[44px] flex items-center"
                      style={{ color: '#D04A02' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#B03D02';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#D04A02';
                      }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.href)}
                          className={`w-full p-4 text-left transition-colors last:border-b-0 min-h-[48px] ${
                            !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                          }`}
                          style={{ borderBottom: '1px solid var(--color-card-border)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-table-row-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${notification.iconColor}15` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: notification.iconColor }} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: '#DC2626' }} />
                                )}
                              </div>
                              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                                {notification.body}
                              </p>
                              <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold cursor-pointer transition-opacity hover:opacity-85 flex-shrink-0"
              style={{ backgroundColor: '#D04A02' }}
              title="Account Settings"
            >
              AG
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 pb-20" style={{ contain: 'layout' }}>
          <Outlet />
        </div>

        <footer className="fixed bottom-0 left-0 right-0 h-9 flex items-center justify-between text-center px-4" style={{ backgroundColor: theme === 'light' ? 'white' : '#1E293B', borderTop: '1px solid #E5E7EB', zIndex: 20 }}>
          <p className="text-[11px]" style={{ color: theme === 'light' ? '#9CA3AF' : '#64748B' }}>
            © 2026 PwC Middle East. All rights reserved. PwC refers to the PwC network and/or one or more of its member firms, each of which is a separate legal entity.
          </p>
          <a
            href="https://www.pwc.com/m1/en.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] hover:underline"
            style={{ color: '#D04A02' }}
          >
            pwc.com/m1/en
          </a>
        </footer>
      </main>
    </div>
  );
}
