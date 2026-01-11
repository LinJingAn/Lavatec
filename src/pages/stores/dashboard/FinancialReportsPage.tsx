import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { MdDownload, MdFilterList, MdSort } from 'react-icons/md';

// Dados de exemplo - em uma aplicação real, viriam de uma API
const revenueByServiceData = [
  { service: 'Lavar e Dobrar', revenue: 36000, cost: 12000, margin: 24000 },
  { service: 'Lavagem a Seco', revenue: 32000, cost: 16000, margin: 16000 },
  { service: 'Passar', revenue: 18000, cost: 6000, margin: 12000 },
  { service: 'Cuidados Especiais', revenue: 15000, cost: 7500, margin: 7500 }
];

const revenueByBranchData = [
  { branch: 'Centro', revenue: 45000, orders: 1200 },
  { branch: 'Zona Norte', revenue: 38000, orders: 1000 },
  { branch: 'Zona Leste', revenue: 42000, orders: 1100 },
  { branch: 'Zona Oeste', revenue: 35000, orders: 900 }
];

const paymentMethodData = [
  { method: 'Cartão de Crédito', amount: 65000, percentage: 45 },
  { method: 'Dinheiro', amount: 35000, percentage: 25 },
  { method: 'Pagamento Móvel', amount: 25000, percentage: 18 },
  { method: 'Transferência Bancária', amount: 20000, percentage: 12 }
];

const outstandingBalancesData = [
  { customer: 'João Silva', amount: 1200, daysOverdue: 15 },
  { customer: 'Sara Johnson', amount: 850, daysOverdue: 30 },
  { customer: 'Miguel Prado', amount: 1500, daysOverdue: 45 },
  { customer: 'Emily Santos', amount: 950, daysOverdue: 60 }
];

const discountImpactData = [
  { month: 'Jan', revenue: 100000, discounts: 5000, netRevenue: 95000 },
  { month: 'Fev', revenue: 110000, discounts: 6000, netRevenue: 104000 },
  { month: 'Mar', revenue: 120000, discounts: 7000, netRevenue: 113000 },
  { month: 'Abr', revenue: 130000, discounts: 8000, netRevenue: 122000 }
];

const taxReportData = [
  { month: 'Jan', sales: 100000, tax: 10000, net: 90000 },
  { month: 'Fev', sales: 110000, tax: 11000, net: 99000 },
  { month: 'Mar', sales: 120000, tax: 12000, net: 108000 },
  { month: 'Abr', sales: 130000, tax: 13000, net: 117000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FinancialReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleExport = (data: any[], filename: string) => {
    // Em uma aplicação real, isso geraria e baixaria um arquivo CSV/Excel
    console.log('Exportando dados:', data, 'para arquivo:', filename);
  };

  const handleFilter = () => {
    // Em uma aplicação real, isso filtraria os dados com base nos critérios selecionados
    console.log('Filtrando com:', { dateRange, selectedBranch });
  };

  const handleSort = (field: string) => {
    // Em uma aplicação real, isso ordenaria os dados
    console.log('Ordenando por:', field);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-40"
            />
            <span>até</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-40"
            />
          </div>
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-40"
          >
            <option value="all">Todas as Filiais</option>
            <option value="downtown">Centro</option>
            <option value="uptown">Zona Norte</option>
            <option value="eastside">Zona Leste</option>
            <option value="westside">Zona Oeste</option>
          </Select>
          <Button onClick={handleFilter}>
            <MdFilterList className="mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Receita por Serviço */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Receita por Serviço</CardTitle>
          <Button onClick={() => handleExport(revenueByServiceData, 'receita_por_servico.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Receita" />
                <Bar dataKey="cost" fill="#ff7300" name="Custo" />
                <Bar dataKey="margin" fill="#82ca9d" name="Margem" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Receita por Filial */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Receita por Filial</CardTitle>
          <Button onClick={() => handleExport(revenueByBranchData, 'receita_por_filial.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByBranchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Receita" />
                <Bar dataKey="orders" fill="#82ca9d" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Métodos de Pagamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Análise de Métodos de Pagamento</CardTitle>
          <Button onClick={() => handleExport(paymentMethodData, 'metodos_pagamento.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="method"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Saldos Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saldos Pendentes</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40"
            >
              <option value="amount">Valor</option>
              <option value="daysOverdue">Dias em Atraso</option>
            </Select>
            <Button onClick={() => handleSort(sortBy)}>
              <MdSort className="mr-2" />
              Ordenar
            </Button>
            <Button onClick={() => handleExport(outstandingBalancesData, 'saldos_pendentes.csv')}>
              <MdDownload className="mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outstandingBalancesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customer" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#ff7300" name="Valor" />
                <Bar dataKey="daysOverdue" fill="#8884d8" name="Dias em Atraso" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Impacto de Desconto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Análise de Impacto de Desconto</CardTitle>
          <Button onClick={() => handleExport(discountImpactData, 'impacto_desconto.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={discountImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Receita Bruta" />
                <Area type="monotone" dataKey="discounts" stackId="2" stroke="#ff7300" fill="#ff7300" name="Descontos" />
                <Area type="monotone" dataKey="netRevenue" stackId="3" stroke="#82ca9d" fill="#82ca9d" name="Receita Líquida" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Relatório de Impostos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Relatório de Impostos</CardTitle>
          <Button onClick={() => handleExport(taxReportData, 'relatorio_impostos.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxReportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Vendas" />
                <Bar dataKey="tax" fill="#ff7300" name="Impostos" />
                <Bar dataKey="net" fill="#82ca9d" name="Líquido" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportsPage; 