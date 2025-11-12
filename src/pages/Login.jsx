import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
// Tabs replaced with simple local view state to control login/register views
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Tractor, Sprout } from 'lucide-react';

const Login = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    nome_completo: '',
    role: 'funcionario'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.username, loginData.password);
      toast.success('Ентрей суссессифул!');
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerData);
      toast.success('Cadastro realizado com sucesso!');
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const [view, setView] = useState('login');

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', padding: 32 }}>
  <Card data-testid="login-card" style={{ width: 1600, maxWidth: '95%', boxSizing: 'border-box' }}>
        <CardHeader style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', padding: '28px', borderRadius: '24px', boxShadow: '0 8px 28px rgba(0,0,0,0.14)' }}>
              <Tractor style={{ width: 72, height: 72, color: '#fff' }} />
            </div>
          </div>
          <CardTitle style={{ fontSize: 64, fontWeight: 800, marginTop: 24 }}>
            AgroGestão
          </CardTitle>
          <CardDescription style={{ fontSize: 20, color: '#000', marginTop: 8 }}>
            Sistema de Gestão Rural Completo
          </CardDescription>
        </CardHeader>
        <CardContent style={{ padding: '40px 64px' }}>
          <div style={{ width: '100%', marginTop: view === 'register' ? -24 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              {view === 'login' ? (
                <button type="button" onClick={() => setView('register')} style={{ padding: '10px 20px', borderRadius: 10, background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 18 }} data-testid="register-tab">Cadastrar</button>
              ) : null}
            </div>

            {view === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Usuário</Label>
                  <Input
                    id="login-username"
                    data-testid="login-username-input"
                    placeholder="Seu username"
                    style={{ width: '100%', padding: '16px', fontSize: 20, border: '1px solid #ccc', borderRadius: 10 }}
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    data-testid="login-password-input"
                    type="password"
                    placeholder="Sua senha"
                    style={{ width: '100%', padding: '16px', fontSize: 20, border: '1px solid #ccc', borderRadius: 10 }}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  style={{ width: '100%', padding: '16px', fontSize: 20, background: 'linear-gradient(90deg,#10b981,#06b6d4)', color: '#fff', border: 'none', borderRadius: 10 }}
                  disabled={loading}
                  data-testid="login-submit-button"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6" style={{ marginTop: -8 }}>
                <div className="space-y-2">
                  <Label htmlFor="register-nome">Nome Completo</Label>
                  <Input
                    id="register-nome"
                    data-testid="register-nome-input"
                    placeholder="Seu nome completo"
                    style={{ width: '100%', padding: '14px', fontSize: 18, border: '1px solid #ccc', borderRadius: 8 }}
                    value={registerData.nome_completo}
                    onChange={(e) => setRegisterData({ ...registerData, nome_completo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username">Usuário</Label>
                  <Input
                    id="register-username"
                    data-testid="register-username-input"
                    placeholder="Escolha um username"
                    style={{ width: '100%', padding: '14px', fontSize: 18, border: '1px solid #ccc', borderRadius: 8 }}
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    data-testid="register-email-input"
                    type="email"
                    placeholder="seu@email.com"
                    style={{ width: '100%', padding: '14px', fontSize: 18, border: '1px solid #ccc', borderRadius: 8 }}
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Cargo</Label>
                  <Select
                    value={registerData.role}
                    onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                  >
                    <SelectTrigger data-testid="register-role-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chefe">Chefe/Produtor</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="funcionario">Funcionário</SelectItem>
                      <SelectItem value="agronomo">Agrônomo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    data-testid="register-password-input"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    style={{ width: '100%', padding: '14px', fontSize: 18, border: '1px solid #ccc', borderRadius: 8 }}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    style={{ width: 220, padding: '10px', fontSize: 16, background: 'linear-gradient(90deg,#10b981,#06b6d4)', color: '#fff', border: 'none', borderRadius: 8 }}
                    disabled={loading}
                    data-testid="register-submit-button"
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                  <div
                    onClick={() => setView('login')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setView('login'); }}
                    style={{ textDecoration: 'underline', cursor: 'pointer', color: '#0369a1', fontSize: 16 }}
                  >
                    Já tem conta? Entrar
                  </div>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
