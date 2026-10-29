import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, X, User, LogOut, Bell, ChevronDown, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = ({ onMenuClick, isSidebarOpen = false }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality preserved — connect to existing search endpoint
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role) => {
    if (role === 'farmer') return t('Farmer');
    if (role === 'labour') return t('Labourer');
    return role;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="h-14 px-4 flex items-center justify-between gap-4">

        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onMenuClick && onMenuClick()}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg
                       text-muted-foreground hover:text-foreground hover:bg-muted
                       transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <span className={cn(
              'block h-0.5 w-5 bg-current rounded transition-all duration-300',
              isSidebarOpen ? 'rotate-45 translate-y-2' : ''
            )} />
            <span className={cn(
              'block h-0.5 w-5 bg-current rounded transition-all duration-300',
              isSidebarOpen ? 'opacity-0' : ''
            )} />
            <span className={cn(
              'block h-0.5 w-5 bg-current rounded transition-all duration-300',
              isSidebarOpen ? '-rotate-45 -translate-y-2' : ''
            )} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-base font-bold text-foreground tracking-tight">
              KrishiMent
            </span>
          </Link>
        </div>

        {/* Center — search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden sm:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('Search jobs, workers, schemes...')}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background text-sm
                         placeholder:text-muted-foreground text-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                         transition-all duration-200"
              aria-label={t('Search')}
            />
          </div>
        </form>

        {/* Right — actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notifications bell */}
          <Link
            to="/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-lg
                       text-muted-foreground hover:text-foreground hover:bg-muted
                       transition-colors duration-150 relative"
            aria-label={t('Notifications')}
          >
            <Bell className="w-4.5 h-4.5" />
          </Link>

          {/* User dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 h-9 px-2 rounded-lg
                           hover:bg-muted transition-colors duration-150
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
              >
                {/* Avatar initials */}
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground
                                flex items-center justify-center text-xs font-semibold">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-foreground leading-none">{user.name}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-0.5">{getRoleLabel(user.role)}</div>
                </div>
                <ChevronDown className={cn(
                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 hidden md:block',
                  isUserMenuOpen ? 'rotate-180' : ''
                )} />
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border
                                rounded-xl shadow-lg py-1 animate-slide-down z-50">
                  <div className="px-3 py-2.5 border-b border-border">
                    <div className="text-sm font-semibold text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-0.5">{getRoleLabel(user.role)}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive
                               hover:bg-destructive/10 transition-colors duration-150 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('Logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm px-3 py-1.5 h-9">
                {t('Login')}
              </Link>
              <Link to="/signup" className="btn-primary text-sm px-3 py-1.5 h-9">
                {t('Sign Up')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
