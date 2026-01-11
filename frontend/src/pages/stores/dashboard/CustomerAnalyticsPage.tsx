import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { MdDownload, MdFilterList, MdSort } from 'react-icons/md';

// Dados de exemplo - em uma aplicação real, viriam de uma API
const customerSegmentationData = [
  { segment: 'Alto Valor', count: 150, revenue: 45000, avgOrderValue: 300 },
  { segment: 'Regular', count: 300, revenue: 60000, avgOrderValue: 200 },
  { segment: 'Ocasional', count: 200, revenue: 20000, avgOrderValue: 100 },
  { segment: 'Novo', count: 100, revenue: 5000, avgOrderValue: 50 }
];

const orderFrequencyData = [
  { month: 'Jan', weekly: 120, biweekly: 80, monthly: 50, quarterly: 30 },
  { month: 'Fev', weekly: 130, biweekly: 85, monthly: 55, quarterly: 32 },
  { month: 'Mar', weekly: 140, biweekly: 90, monthly: 60, quarterly: 35 },
  { month: 'Abr', weekly: 150, biweekly: 95, monthly: 65, quarterly: 38 }
];

const customerLTVData = [
  { customer: 'João Silva', ltv: 5000, orders: 50, avgOrderValue: 100, tenure: 24 },
  { customer: 'Sara Johnson', ltv: 4500, orders: 45, avgOrderValue: 100, tenure: 20 },
  { customer: 'Miguel Prado', ltv: 3000, orders: 30, avgOrderValue: 100, tenure: 15 },
  { customer: 'Emily Santos', ltv: 2500, orders: 25, avgOrderValue: 100, tenure: 12 }
];

const customerTrendsData = [
  { month: 'Jan', new: 50, returning: 200, total: 250 },
  { month: 'Fev', new: 55, returning: 210, total: 265 },
  { month: 'Mar', new: 60, returning: 220, total: 280 },
  { month: 'Abr', new: 65, returning: 230, total: 295 }
];

const servicePreferenceData = [
  { service: 'Lavar e Dobrar', regular: 200, occasional: 100, new: 50 },
  { service: 'Lavagem a Seco', regular: 150, occasional: 80, new: 40 },
  { service: 'Passar', regular: 100, occasional: 60, new: 30 },
  { service: 'Cuidados Especiais', regular: 50, occasional: 30, new: 20 }
];

const churnPredictionData = [
  { customer: 'João Silva', riskScore: 0.2, lastOrder: 7, avgOrderValue: 100, frequency: 'semanal' },
  { customer: 'Sara Johnson', riskScore: 0.4, lastOrder: 14, avgOrderValue: 100, frequency: 'quinzenal' },
  { customer: 'Miguel Prado', riskScore: 0.6, lastOrder: 21, avgOrderValue: 100, frequency: 'mensal' },
  { customer: 'Emily Santos', riskScore: 0.8, lastOrder: 30, avgOrderValue: 100, frequency: 'mensal' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomerAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [sortBy, setSortBy] = useState('ltv');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleExport = (data: any[], filename: string) => {
    // Em uma aplicação real, isso geraria e baixaria um arquivo CSV/Excel
    console.log('Exportando dados:', data, 'para arquivo:', filename);
  };

  const handleFilter = () => {
    // Em uma aplicação real, isso filtraria os dados com base nos critérios selecionados
    console.log('Filtrando com:', { dateRange, selectedSegment });
  };

  const handleSort = (field: string) => {
    // Em uma aplicação real, isso ordenaria os dados
    console.log('Ordenando por:', field);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Análise de Clientes</h1>
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
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="w-40"
          >
            <option value="all">Todos os Segmentos</option>
            <option value="high">Alto Valor</option>
            <option value="regular">Regular</option>
            <option value="occasional">Ocasional</option>
            <option value="new">Novo</option>
          </Select>
          <Button onClick={handleFilter}>
            <MdFilterList className="mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Segmentação de Clientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Análise de Segmentação de Clientes</CardTitle>
          <Button onClick={() => handleExport(customerSegmentationData, 'segmentacao_clientes.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegmentationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Quantidade de Clientes" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Receita" />
                <Bar dataKey="avgOrderValue" fill="#ffc658" name="Valor Médio do Pedido" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Padrões de Frequência de Pedidos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Padrões de Frequência de Pedidos</CardTitle>
          <Button onClick={() => handleExport(orderFrequencyData, 'frequencia_pedidos.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="weekly" stackId="1" stroke="#8884d8" fill="#8884d8" name="Semanal" />
                <Area type="monotone" dataKey="biweekly" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Quinzenal" />
                <Area type="monotone" dataKey="monthly" stackId="1" stroke="#ffc658" fill="#ffc658" name="Mensal" />
                <Area type="monotone" dataKey="quarterly" stackId="1" stroke="#ff7300" fill="#ff7300" name="Trimestral" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Valor Vitalício do Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Valor Vitalício do Cliente (LTV)</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40"
            >
              <option value="ltv">LTV</option>
              <option value="orders">Pedidos</option>
              <option value="avgOrderValue">Valor Médio do Pedido</option>
              <option value="tenure">Tempo de Relacionamento</option>
            </Select>
            <Button onClick={() => handleSort(sortBy)}>
              <MdSort className="mr-2" />
              Ordenar
            </Button>
            <Button onClick={() => handleExport(customerLTVData, 'ltv_clientes.csv')}>
              <MdDownload className="mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="orders" name="Pedidos" />
                <YAxis type="number" dataKey="ltv" name="LTV" />
                <ZAxis type="number" dataKey="avgOrderValue" name="Valor Médio do Pedido" />
                <Tooltip />
                <Legend />
                <Scatter name="Clientes" data={customerLTVData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tendências de Clientes Novos vs. Recorrentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tendências de Clientes Novos vs. Recorrentes</CardTitle>
          <Button onClick={() => handleExport(customerTrendsData, 'tendencias_clientes.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="new" stroke="#8884d8" name="Novos Clientes" />
                <Line type="monotone" dataKey="returning" stroke="#82ca9d" name="Clientes Recorrentes" />
                <Line type="monotone" dataKey="total" stroke="#ff7300" name="Total de Clientes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Preferência de Serviço */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Análise de Preferência de Serviço</CardTitle>
          <Button onClick={() => handleExport(servicePreferenceData, 'preferencias_servico.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicePreferenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="regular" fill="#8884d8" name="Clientes Regulares" />
                <Bar dataKey="occasional" fill="#82ca9d" name="Clientes Ocasionais" />
                <Bar dataKey="new" fill="#ffc658" name="Novos Clientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Previsão de Abandono */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Previsão de Abandono de Clientes</CardTitle>
          <Button onClick={() => handleExport(churnPredictionData, 'previsao_abandono.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={churnPredictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customer" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="riskScore" fill="#ff7300" name="Pontuação de Risco" />
                <Bar dataKey="lastOrder" fill="#8884d8" name="Dias Desde Último Pedido" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAnalyticsPage; 