import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Financeiro from './pages/Financeiro';
import Chat from './pages/Chat';
import { Button } from './components/ui/button';
import { syncData, startAutoSync, stopAutoSync } from './utils/syncManager';
import { initDB, isOnline } from './utils/offline';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Tractor,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Carregando...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [online, setOnline] = useState(isOnline());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    initDB();
    startAutoSync();

    const handleOnline = () => {
      setOnline(true);
      toast.success('Conexão restaurada!');
      handleSync();
    };

    const handleOffline = () => {
      setOnline(false);
      toast.warning('Modo offline - Suas alterações serão sincronizadas depois');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      stopAutoSync();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    const result = await syncData();
    if (result.success) {
      toast.success('Dados sincronizados!');
    }
    setSyncing(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/estoque', label: 'Estoque', icon: Package },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
    { path: '/chat', label: 'Chat', icon: MessageSquare }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
                  <Tractor className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  RuralGest
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Online/Offline */}
              <div className="flex items-center gap-2" data-testid="status-indicator">
                {online ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-600" />
                    <span className="hidden sm:inline text-sm text-green-600 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-orange-600" />
                    <span className="hidden sm:inline text-sm text-orange-600 font-medium">Offline</span>
                  </>
                )}
              </div>

              {/* Sync Button */}
              {online && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSync}
                  disabled={syncing}
                  data-testid="btn-sync"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                </Button>
              )}

              {/* User Info */}
              <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-gray-100 rounded-full">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.nome_completo?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{user?.nome_completo}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                data-testid="btn-logout"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg" data-testid="mobile-nav">
          <nav className="px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  data-testid={`mobile-nav-${item.path}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Desktop Navigation + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          {location.pathname !== '/dashboard' && (
            <aside className="hidden md:block w-64 space-y-2" data-testid="desktop-nav">
              <nav className="sticky top-24">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      data-testid={`nav-${item.path}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/estoque"
        element={
          <PrivateRoute>
            <Layout>
              <Estoque />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/financeiro"
        element={
          <PrivateRoute>
            <Layout>
              <Financeiro />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Layout>
              <Chat />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
