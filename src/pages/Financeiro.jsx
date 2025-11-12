import React from 'react';

const Financeiro = () => {
  return (
    <div className="space-y-6" data-testid="financeiro-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-1">Visão geral das finanças — receitas, despesas e fluxo de caixa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-sm text-gray-500">Saldo Atual</h2>
          <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-sm text-gray-500">Receitas (30d)</h2>
          <p className="text-2xl font-bold">R$ 0,00</p>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h2 className="text-sm text-gray-500">Despesas (30d)</h2>
          <p className="text-2xl font-bold text-red-600">R$ 0,00</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white border rounded-lg">
        <p className="text-gray-600">Nenhum dado financeiro disponível. Integre suas entradas ou sincronize com o servidor.</p>
      </div>
    </div>
  );
};

export default Financeiro;
