// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { Box, DollarSign, AlertTriangle, MessageCircle, Truck } from 'lucide-react';

// Keys used by mock storage
const PRODUCTS_KEY = 'agro_products';
const ACTIVITIES_KEY = 'agro_activities';
const MESSAGES_KEY = 'agro_messages';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Load from localStorage or set sample data
    const sampleProducts = [
      { id: 1, name: 'Glifosato', type: 'insumo', qty: 150, unit: 'litro', min: 200 }
    ];
    const sampleActivities = [
      { id: 1, type: 'consumo', product: 'Glifosato', user: 'Guillerme de Carvalho', date: '05/11/2025, 12:57:03', amount: '50 un' },
      { id: 2, type: 'compra', product: 'Glifosato', user: 'Guillerme de Carvalho', date: '05/11/2025, 12:56:34', amount: '200 un', price: 'R$ 1000.00' }
    ];

    const p = readJson(PRODUCTS_KEY, sampleProducts);
    const a = readJson(ACTIVITIES_KEY, sampleActivities);
    const m = readJson(MESSAGES_KEY, []);

    setProducts(p);
    setActivities(a);
    setMessages(m);
  }, []);

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.qty < (p.min || 0)).length;
  const saldo = 'R$ -1000.00'; // placeholder, replace when finance exists

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
  <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #eef2f6', padding: 20, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#34d399,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>RG</div>
          <div>
            <div style={{ fontWeight: 700 }}>RuralGest</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>AgroGestão</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { path: '/dashboard', label: 'Dashboard', Icon: Box },
            { path: '/estoque', label: 'Estoque', Icon: Truck },
            { path: '/financeiro', label: 'Financeiro', Icon: DollarSign },
            { path: '/chat', label: 'Chat', Icon: MessageCircle }
          ].map((it) => {
            const active = location.pathname === it.path;
            return (
              <Link
                key={it.path}
                to={it.path}
                className={`dashboard-nav-link ${active ? 'active' : ''}`}
              >
                <it.Icon size={16} />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: 28 }}>
        <div style={{ width: '100%', maxWidth: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>Dashboard</h1>
            <div style={{ color: '#6b7280', marginTop: 6 }}>Visão geral da sua fazenda</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ecfdf5', padding: '6px 10px', borderRadius: 999 }}>
              <div style={{ width: 10, height: 10, background: '#10b981', borderRadius: 10 }} />
              <div style={{ fontSize: 13, color: '#065f46' }}>Online</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>Guillerme de Carvalho</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Chefe</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: '#0ea5a9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.03)' }}>
            <div style={{ color: '#6b7280', fontSize: 13 }}>Total de Produtos</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{totalProducts}</div>
          </div>
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.03)' }}>
            <div style={{ color: '#6b7280', fontSize: 13 }}>Saldo</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{saldo}</div>
          </div>
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.03)' }}>
            <div style={{ color: '#6b7280', fontSize: 13 }}>Alertas de Estoque</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{lowStockCount}</div>
          </div>
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.03)' }}>
            <div style={{ color: '#6b7280', fontSize: 13 }}>Mensagens</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{messages.length}</div>
          </div>
        </div>

        {/* Low stock alert full width */}
        <div style={{ background: '#fff', padding: 18, borderRadius: 10, marginBottom: 20, boxShadow: '0 6px 18px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <AlertTriangle color='#f97316' />
            <div style={{ fontWeight: 700 }}>Produtos com Estoque Baixo</div>
          </div>
          {products.filter((p) => p.qty < (p.min || 0)).map((p) => (
            <div key={p.id} style={{ background: '#fff7ed', borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{p.type}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ea580c', fontWeight: 700 }}>{`${p.qty} ${p.unit || ''}`}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Mínimo: {p.min} {p.unit || ''}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activities */}
        <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.03)' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Últimas Atividades</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activities.map((a) => (
              <div key={a.id} style={{ background: '#f8fafc', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{a.type}</div>
                  <div style={{ color: '#6b7280' }}>{a.product}</div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>{a.user} • {a.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{a.amount}</div>
                  {a.price ? <div style={{ color: '#10b981', marginTop: 6 }}>{a.price}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}

export default Dashboard;
