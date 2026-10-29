import React from 'react';
import {
  Home,
  FileText,
  ShoppingCart,
  Users,
  BarChart2,
  Bell,
  Clock,
  ChevronRight,
  ChevronDown,
  Briefcase,
  LogOut,
  BookOpen,
  Star,
  DollarSign,
  Leaf,
  X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = React.useState(null);
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // ─── Farmer menu ───────────────────────────────────────
  const farmerMenu = [
    { title: t('Dashboard'),             icon: Home,          path: '/farmer-dashboard', submenu: [] },
    {
      title: t('Worker Management'),     icon: Users,         path: '/workers',
      submenu: [
        { title: t('Worker Applications'), path: '/worker-applications' },
        { title: t('Post a Job'),          path: '/upload-jobs' },
      ]
    },
    {
      title: t('Equipment Marketplace'), icon: ShoppingCart,  path: '/equipment',
      submenu: [
        { title: t('Buy Equipment'),  path: '/equipment/buy' },
        { title: t('Sell Equipment'), path: '/equipment/sell' },
      ]
    },
    { title: t('Government Schemes'),    icon: FileText,      path: '/schemes',        submenu: [] },
    { title: t('Market Prices'),         icon: BarChart2,     path: '/market-prices',  submenu: [] },
    { title: t('Notifications'),         icon: Bell,          path: '/notifications',  submenu: [] },
    { title: t('History'),               icon: Clock,         path: '/history',        submenu: [] },
  ];

  // ─── Labour menu ───────────────────────────────────────
  const labourMenu = [
    { title: t('Dashboard'),             icon: Home,          path: '/labour-dashboard', submenu: [] },
    { title: t('Find Jobs'),             icon: Briefcase,     path: '/jobs',           submenu: [] },
    { title: t('My Applications'),       icon: BookOpen,      path: '/my-applications',submenu: [] },
    { title: t('My Skills'),             icon: Star,          path: '/skills',         submenu: [] },
    { title: t('My Earnings'),           icon: DollarSign,    path: '/earnings',       submenu: [] },
    {
      title: t('Equipment Marketplace'), icon: ShoppingCart,  path: '/equipment',
      submenu: [
        { title: t('Buy Equipment'),  path: '/equipment/buy' },
        { title: t('Sell Equipment'), path: '/equipment/sell' },
      ]
    },
    { title: t('Government Schemes'),    icon: FileText,      path: '/schemes',        submenu: [] },
    { title: t('Market Prices'),         icon: BarChart2,     path: '/market-prices',  submenu: [] },
    { title: t('Notifications'),         icon: Bell,          path: '/notifications',  submenu: [] },
  ];

  const menuItems = user?.role === 'labour' ? labourMenu : farmerMenu;

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const isActive = (path) => {
    const exactPaths = ['/farmer-dashboard', '/labour-dashboard', '/dashboard'];
    if (exactPaths.includes(path)) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleNav = () => {
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-sidebar flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Navigation sidebar"
      >
        {/* Brand header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sand flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sidebar-foreground font-bold text-base tracking-tight">KrishiMent</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent
                       transition-colors duration-150 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User chip */}
        {user && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-sidebar-accent/60 border border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sand text-primary flex items-center justify-center
                              text-xs font-bold flex-shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-sidebar-foreground font-medium text-sm truncate">{user.name}</div>
                <div className="text-sidebar-foreground/60 text-xs capitalize">
                  {user.role === 'labour' ? t('Labourer') : t('Farmer')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (item.submenu.length > 0) {
              const isExpanded = openSubmenu === index;
              const hasActiveSub = item.submenu.some(s => isActive(s.path));
              return (
                <div key={item.path}>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                      'transition-all duration-150',
                      (active || hasActiveSub)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown className={cn(
                      'w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200',
                      isExpanded ? 'rotate-180' : ''
                    )} />
                  </button>

                  {isExpanded && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={handleNav}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-xs font-medium',
                            'transition-colors duration-150',
                            isActive(sub.path)
                              ? 'bg-sidebar-primary/80 text-sidebar-primary-foreground font-semibold'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                          )}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNav}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-150',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.title}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — logout */}
        <div className="flex-shrink-0 p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-sidebar-foreground/70 hover:bg-red-500/15 hover:text-red-400
                       transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>{t('Logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
