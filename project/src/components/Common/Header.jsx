import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, X, User, Shield, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuClick) onMenuClick();
  };

  return (
    <div className="bg-background border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="h-16 px-4">
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Logo and menu button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleMenuClick}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">
                  Smart Agriculture
                </h1>
              </div>
            </div>
          </div>

          {/* Search and user actions */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search schemes, services, or resources..."
                className="w-full pl-10 pr-4 py-2"
                aria-label="Search government schemes and services"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
              size="icon"
              className="lg:hidden"
              onClick={handleMenuClick}
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
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4 bg-background">
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
    </div>
  );
};

export default Header;
