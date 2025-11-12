import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '';

// Helpers for local (mock) auth when no backend is configured
const USERS_KEY = 'agro_users';
const TOKEN_KEY = 'token';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw || raw === 'null') {
      // if no users stored and we're in mock mode, create a default admin account
      if (!BACKEND_URL) {
        const admin = {
          id: Date.now(),
          username: 'admin',
          email: 'admin@local',
          nome_completo: 'Administrador',
          role: 'admin',
          password: 'admin',
          _token: generateToken()
        };
        const arr = [admin];
        saveStoredUsers(arr);
        // also persist token so the admin stays logged in after first use
        localStorage.setItem(TOKEN_KEY, admin._token);
        return arr;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateToken() {
  return btoa(Date.now().toString() + Math.random().toString()).replace(/=/g, '');
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        if (!BACKEND_URL) {
          // local/mock mode
          const users = getStoredUsers();
          const t = localStorage.getItem(TOKEN_KEY);
          const found = users.find((u) => u._token === t);
          if (mounted) setUser(found || null);
        } else {
          const response = await axios.get(`${API}/auth/me`);
          if (mounted) setUser(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        // inline logout behavior to avoid referencing functions in deps
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (token) {
      if (BACKEND_URL) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (username, password) => {
    if (!BACKEND_URL) {
      // local/mock login
      const users = getStoredUsers();
      const found = users.find((u) => u.username === username && u.password === password);
      if (!found) {
        const err = new Error('Usuário ou senha incorretos');
        err.response = { data: { detail: 'Usuário ou senha incorretos' } };
        throw err;
      }
      const tok = found._token || generateToken();
      found._token = tok;
      saveStoredUsers(users);
      setToken(tok);
      setUser({ ...found, password: undefined });
      localStorage.setItem(TOKEN_KEY, tok);
      return { ...found, password: undefined };
    }

    const response = await axios.post(`${API}/auth/login`, { username, password });
    const { access_token, user: userData } = response.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return userData;
  };

  const register = async (userData) => {
    if (!BACKEND_URL) {
      // local/mock register
      const users = getStoredUsers();
      if (users.find((u) => u.username === userData.username)) {
        const err = new Error('Usuário já existe');
        err.response = { data: { detail: 'Usuário já existe' } };
        throw err;
      }
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        nome_completo: userData.nome_completo,
        role: userData.role,
        password: userData.password
      };
      const tok = generateToken();
      newUser._token = tok;
      users.push(newUser);
      saveStoredUsers(users);
      setToken(tok);
      setUser({ ...newUser, password: undefined });
      localStorage.setItem(TOKEN_KEY, tok);
      return { ...newUser, password: undefined };
    }

    const response = await axios.post(`${API}/auth/register`, userData);
    const { access_token, user: newUser } = response.data;
    setToken(access_token);
    setUser(newUser);
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
