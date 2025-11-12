import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Package, Plus, ShoppingCart, TrendingDown, History } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCompraOpen, setDialogCompraOpen] = useState(false);
  const [dialogConsumoOpen, setDialogConsumoOpen] = useState(false);

  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: 'insumo',
    unidade: 'kg',
    estoque_minimo: 0
  });

  const [novaCompra, setNovaCompra] = useState({
    produto_id: '',
    quantidade: 0,
    preco_unitario: 0,
    fornecedor: '',
    nota_fiscal: '',
    observacoes: ''
  });

  const [novoConsumo, setNovoConsumo] = useState({
    produto_id: '',
    quantidade: 0,
    tipo_atividade: 'abastecimento',
    descricao: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [produtosRes, comprasRes, consumosRes] = await Promise.all([
        axios.get(`${API}/produtos`),
        axios.get(`${API}/compras`),
        axios.get(`${API}/consumo`)
      ]);
      setProdutos(produtosRes.data);
      setCompras(comprasRes.data);
      setConsumos(consumosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCriarProduto = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/produtos`, novoProduto);
      toast.success('Produto criado com sucesso!');
      setDialogOpen(false);
      setNovoProduto({ nome: '', categoria: 'insumo', unidade: 'kg', estoque_minimo: 0 });
      loadData();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error(error.response?.data?.detail || 'Erro ao criar produto');
    }
  };

  const handleRegistrarCompra = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/compras`, novaCompra);
      toast.success('Compra registrada com sucesso!');
      setDialogCompraOpen(false);
      setNovaCompra({
        produto_id: '',
        quantidade: 0,
        preco_unitario: 0,
        fornecedor: '',
        nota_fiscal: '',
        observacoes: ''
      });
      loadData();
    } catch (error) {
      console.error('Erro ao registrar compra:', error);
      toast.error(error.response?.data?.detail || 'Erro ao registrar compra');
    }
  };

  const handleRegistrarConsumo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/consumo`, novoConsumo);
      toast.success('Consumo registrado com sucesso!');
      setDialogConsumoOpen(false);
      setNovoConsumo({ produto_id: '', quantidade: 0, tipo_atividade: 'abastecimento', descricao: '' });
      loadData();
    } catch (error) {
      console.error('Erro ao registrar consumo:', error);
      toast.error(error.response?.data?.detail || 'Erro ao registrar consumo');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-lg text-gray-500">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6" data-testid="estoque-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600 mt-1">Gerencie produtos e movimentações</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" data-testid="btn-novo-produto">
                <Plus className="w-4 h-4 mr-2" /> Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-novo-produto">
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCriarProduto} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input id="nome" data-testid="input-produto-nome" value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={novoProduto.categoria} onValueChange={(value) => setNovoProduto({ ...novoProduto, categoria: value })}>
                    <SelectTrigger data-testid="select-categoria"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="combustivel">Combustível</SelectItem>
                      <SelectItem value="insumo">Insumo</SelectItem>
                      <SelectItem value="peca">Peça</SelectItem>
                      <SelectItem value="semente">Semente</SelectItem>
                      <SelectItem value="fertilizante">Fertilizante</SelectItem>
                      <SelectItem value="defensivo">Defensivo</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={novoProduto.unidade} onValueChange={(value) => setNovoProduto({ ...novoProduto, unidade: value })}>
                    <SelectTrigger data-testid="select-unidade"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="litro">Litro</SelectItem>
                      <SelectItem value="unidade">Unidade</SelectItem>
                      <SelectItem value="saca">Saca</SelectItem>
                      <SelectItem value="ton">Tonelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                  <Input id="estoque_minimo" data-testid="input-estoque-minimo" type="number" value={novoProduto.estoque_minimo} onChange={(e) => setNovoProduto({ ...novoProduto, estoque_minimo: parseFloat(e.target.value) })} required />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" data-testid="btn-salvar-produto">Criar Produto</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogCompraOpen} onOpenChange={setDialogCompraOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="btn-registrar-compra">
                <ShoppingCart className="w-4 h-4 mr-2" /> Registrar Compra
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-compra">
              <DialogHeader>
                <DialogTitle>Registrar Compra</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRegistrarCompra} className="space-y-4">
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Select value={novaCompra.produto_id} onValueChange={(value) => setNovaCompra({ ...novaCompra, produto_id: value })}>
                    <SelectTrigger data-testid="select-produto-compra"><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                    <SelectContent>
                      {produtos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input data-testid="input-compra-quantidade" type="number" step="0.01" value={novaCompra.quantidade} onChange={(e) => setNovaCompra({ ...novaCompra, quantidade: parseFloat(e.target.value) })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço Unitário</Label>
                    <Input data-testid="input-compra-preco" type="number" step="0.01" value={novaCompra.preco_unitario} onChange={(e) => setNovaCompra({ ...novaCompra, preco_unitario: parseFloat(e.target.value) })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input data-testid="input-compra-fornecedor" value={novaCompra.fornecedor} onChange={(e) => setNovaCompra({ ...novaCompra, fornecedor: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Nota Fiscal (opcional)</Label>
                  <Input data-testid="input-compra-nf" value={novaCompra.nota_fiscal} onChange={(e) => setNovaCompra({ ...novaCompra, nota_fiscal: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input data-testid="input-compra-obs" value={novaCompra.observacoes} onChange={(e) => setNovaCompra({ ...novaCompra, observacoes: e.target.value })} />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" data-testid="btn-salvar-compra">Registrar Compra</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogConsumoOpen} onOpenChange={setDialogConsumoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="btn-registrar-consumo">
                <TrendingDown className="w-4 h-4 mr-2" /> Registrar Consumo
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-consumo">
              <DialogHeader>
                <DialogTitle>Registrar Consumo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRegistrarConsumo} className="space-y-4">
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Select value={novoConsumo.produto_id} onValueChange={(value) => setNovoConsumo({ ...novoConsumo, produto_id: value })}>
                    <SelectTrigger data-testid="select-produto-consumo"><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                    <SelectContent>
                      {produtos.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nome} ({p.estoque_atual} {p.unidade})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input data-testid="input-consumo-quantidade" type="number" step="0.01" value={novoConsumo.quantidade} onChange={(e) => setNovoConsumo({ ...novoConsumo, quantidade: parseFloat(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Atividade</Label>
                  <Select value={novoConsumo.tipo_atividade} onValueChange={(value) => setNovoConsumo({ ...novoConsumo, tipo_atividade: value })}>
                    <SelectTrigger data-testid="select-tipo-atividade"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abastecimento">Abastecimento</SelectItem>
                      <SelectItem value="aplicacao">Aplicação</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="colheita">Colheita</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input data-testid="input-consumo-descricao" value={novoConsumo.descricao} onChange={(e) => setNovoConsumo({ ...novoConsumo, descricao: e.target.value })} />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" data-testid="btn-salvar-consumo">Registrar Consumo</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="produtos" data-testid="tab-produtos">Produtos</TabsTrigger>
          <TabsTrigger value="compras" data-testid="tab-compras">Compras</TabsTrigger>
          <TabsTrigger value="consumo" data-testid="tab-consumo">Consumo</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map((produto) => (
              <Card key={produto.id} data-testid={`produto-card-${produto.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{produto.nome}</span>
                    <Package className="w-5 h-5 text-green-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-semibold">{produto.categoria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estoque:</span>
                      <span className="font-bold text-lg">{produto.estoque_atual} {produto.unidade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mínimo:</span>
                      <span>{produto.estoque_minimo} {produto.unidade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço Médio:</span>
                      <span>R$ {produto.preco_medio.toFixed(2)}</span>
                    </div>
                    {produto.estoque_atual <= produto.estoque_minimo && (
                      <div className="mt-2 p-2 bg-orange-100 text-orange-800 rounded text-xs font-semibold text-center">
                        ESTOQUE BAIXO!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compras" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {compras.length > 0 ? compras.map((compra) => (
                  <div key={compra.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg" data-testid={`compra-${compra.id}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{compra.produto_nome}</p>
                      <p className="text-sm text-gray-600">Fornecedor: {compra.fornecedor}</p>
                      <p className="text-xs text-gray-500 mt-1">{compra.usuario_nome} • {new Date(compra.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">+{compra.quantidade}</p>
                      <p className="text-sm text-gray-700">R$ {compra.preco_total.toFixed(2)}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">Nenhuma compra registrada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumo" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {consumos.length > 0 ? consumos.map((consumo) => (
                  <div key={consumo.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg" data-testid={`consumo-${consumo.id}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{consumo.produto_nome}</p>
                      <p className="text-sm text-gray-600">Atividade: {consumo.tipo_atividade}</p>
                      {consumo.descricao && <p className="text-sm text-gray-500">{consumo.descricao}</p>}
                      <p className="text-xs text-gray-500 mt-1">{consumo.usuario_nome} • {new Date(consumo.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-700">-{consumo.quantidade}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">Nenhum consumo registrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estoque;
