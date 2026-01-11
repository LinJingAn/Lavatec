import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, DollarSign, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
  <Card className="flex-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs font-medium ${change >= 0 ? 'text-[#2196F3]' : 'text-red-500'}`}>
        {change >= 0 ? '+' : ''}{change}% em relação ao período anterior
      </p>
    </CardContent>
  </Card>
);

interface DashboardMetricsProps {
  data: {
    orders: number;
    revenue: number;
    customers: number;
    dailyData: Array<{
      date: string;
      orders: number;
      revenue: number;
      customers: number;
    }>;
  };
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Total de Pedidos',
      value: data.orders,
      change: 12,
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Receita',
      value: formatCurrency(data.revenue),
      change: 8,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Clientes',
      value: data.customers,
      change: 15,
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho Diário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="orders" stackId="1" stroke="#2196F3" fill="#2196F3" name="Pedidos" />
                <Area type="monotone" dataKey="revenue" stackId="2" stroke="#1976D2" fill="#1976D2" name="Receita" />
                <Area type="monotone" dataKey="customers" stackId="3" stroke="#0D47A1" fill="#0D47A1" name="Clientes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 