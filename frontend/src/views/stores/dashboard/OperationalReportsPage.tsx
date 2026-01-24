import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { MdDownload, MdFilterList, MdSort } from 'react-icons/md';

// Dados de exemplo - em uma aplicação real, viriam de uma API
const orderVolumeData = [
  { service: 'Lavar e Dobrar', volume: 1200, revenue: 36000 },
  { service: 'Lavagem a Seco', volume: 800, revenue: 32000 },
  { service: 'Passar', volume: 600, revenue: 18000 },
  { service: 'Cuidados Especiais', volume: 300, revenue: 15000 }
];

const processingTimeData = [
  { day: 'Seg', avgTime: 45, maxTime: 60, minTime: 30 },
  { day: 'Ter', avgTime: 42, maxTime: 58, minTime: 28 },
  { day: 'Qua', avgTime: 48, maxTime: 65, minTime: 35 },
  { day: 'Qui', avgTime: 40, maxTime: 55, minTime: 25 },
  { day: 'Sex', avgTime: 50, maxTime: 70, minTime: 40 },
  { day: 'Sáb', avgTime: 55, maxTime: 75, minTime: 45 },
  { day: 'Dom', avgTime: 38, maxTime: 52, minTime: 30 }
];

const staffPerformanceData = [
  { name: 'João Silva', efficiency: 95, quality: 4.8, orders: 120 },
  { name: 'Maria Santos', efficiency: 92, quality: 4.7, orders: 110 },
  { name: 'Roberto Ferreira', efficiency: 90, quality: 4.6, orders: 100 },
  { name: 'Ana Oliveira', efficiency: 88, quality: 4.5, orders: 95 }
];

const equipmentUtilizationData = [
  { machine: 'Máquina de Lavar 1', utilization: 85, downtime: 2 },
  { machine: 'Máquina de Lavar 2', utilization: 80, downtime: 3 },
  { machine: 'Secadora 1', utilization: 75, downtime: 4 },
  { machine: 'Secadora 2', utilization: 70, downtime: 5 },
  { machine: 'Estação de Passar 1', utilization: 65, downtime: 6 }
];

const qualityIssuesData = [
  { type: 'Manchas', count: 15, severity: 'Baixa' },
  { type: 'Amassados', count: 10, severity: 'Média' },
  { type: 'Cor Desbotada', count: 5, severity: 'Alta' },
  { type: 'Encolhimento', count: 3, severity: 'Alta' },
  { type: 'Itens Perdidos', count: 2, severity: 'Crítica' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const OperationalReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleExport = (data: any[], filename: string) => {
    // Em uma aplicação real, isso geraria e baixaria um arquivo CSV/Excel
    console.log('Exportando dados:', data, 'para arquivo:', filename);
  };

  const handleFilter = () => {
    // Em uma aplicação real, isso filtraria os dados com base nos critérios selecionados
    console.log('Filtrando com:', { dateRange, selectedService });
  };

  const handleSort = (field: string) => {
    // Em uma aplicação real, isso ordenaria os dados
    console.log('Ordenando por:', field);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios Operacionais</h1>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span>até</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <Select
            value={selectedService}
            onValueChange={(value: string) => setSelectedService(value)}
          >
            <option value="all">Todos os Serviços</option>
            <option value="wash">Lavar e Dobrar</option>
            <option value="dry">Lavagem a Seco</option>
            <option value="iron">Passar</option>
          </Select>
          <Button onClick={handleFilter}>
            <MdFilterList className="mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Relatório de Volume de Pedidos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Volume de Pedidos por Tipo de Serviço</CardTitle>
          <Button onClick={() => handleExport(orderVolumeData, 'volume_pedidos.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#8884d8" name="Volume de Pedidos" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Tempo de Processamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Análise de Tempo de Processamento</CardTitle>
          <Button onClick={() => handleExport(processingTimeData, 'tempo_processamento.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgTime" stroke="#8884d8" name="Tempo Médio" />
                <Line type="monotone" dataKey="maxTime" stroke="#ff7300" name="Tempo Máximo" />
                <Line type="monotone" dataKey="minTime" stroke="#82ca9d" name="Tempo Mínimo" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Desempenho da Equipe */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Métricas de Desempenho da Equipe</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={sortBy}
              onValueChange={(value: string) => setSortBy(value)}
            >
              <option value="efficiency">Eficiência</option>
              <option value="quality">Qualidade</option>
              <option value="orders">Pedidos</option>
            </Select>
            <Button onClick={() => handleSort(sortBy)}>
              <MdSort className="mr-2" />
              Ordenar
            </Button>
            <Button onClick={() => handleExport(staffPerformanceData, 'desempenho_equipe.csv')}>
              <MdDownload className="mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#8884d8" name="Eficiência %" />
                <Bar dataKey="quality" fill="#82ca9d" name="Pontuação de Qualidade" />
                <Bar dataKey="orders" fill="#ffc658" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Utilização de Equipamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Utilização de Equipamentos</CardTitle>
          <Button onClick={() => handleExport(equipmentUtilizationData, 'utilizacao_equipamentos.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipmentUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="machine" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#8884d8" name="Utilização %" />
                <Bar dataKey="downtime" fill="#ff7300" name="Tempo Inativo %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Problemas de Qualidade */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monitoramento de Problemas de Qualidade</CardTitle>
          <Button onClick={() => handleExport(qualityIssuesData, 'problemas_qualidade.csv')}>
            <MdDownload className="mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityIssuesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {qualityIssuesData.map((entry, index) => (
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
    </div>
  );
};

export default OperationalReportsPage; 