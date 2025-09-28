import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, X, User, Shield, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b border-border shadow-sm">
      {/* Top bar with emergency info */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <span>🔔 Emergency Helpline: 1800-xxx-xxxx</span>
            <div className="flex items-center space-x-4">
              <span>Last Updated: 22 Sep 2024</span>
              <Button
                variant="link"
                size="sm"
                className="text-primary-foreground hover:text-primary-light"
              >
                <Bell className="w-4 h-4 mr-1" />
                Updates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Smart Agriculture
              </h1>
              <p className="text-sm text-muted-foreground">
                Citizen Services Hub
              </p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="/services" className="text-foreground hover:text-primary transition-colors font-medium">
              Services
            </a>
            <a href="/schemes" className="text-foreground hover:text-primary transition-colors font-medium">
              Gov Schemes
            </a>
            <a href="/resources" className="text-foreground hover:text-primary transition-colors font-medium">
              Resources
            </a>
            <a href="/support" className="text-foreground hover:text-primary transition-colors font-medium">
              Support
            </a>
          </nav>

          {/* Search and user actions */}
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:flex relative">
              <Input
                type="search"
                placeholder="Search schemes..."
                className="w-64 pr-10"
                aria-label="Search government schemes"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Authenticated user */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  Citizen Login
                </Button>
                <Button variant="secondary" size="sm" className="hidden sm:flex">
                  Admin Login
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search schemes..."
              className="w-full pr-10"
              aria-label="Search government schemes"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Home
              </a>
              <a href="/services" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Services
              </a>
              <a href="/schemes" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Gov Schemes
              </a>
              <a href="/resources" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Resources
              </a>
              <a href="/support" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Support
              </a>

              {/* Auth section in mobile menu */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user ? (
                  <button
                    onClick={logout}
                    className="flex items-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Citizen Login
                    </Button>
                    <Button variant="secondary" size="sm" className="justify-start">
                      Admin Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
