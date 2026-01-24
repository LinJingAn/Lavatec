import React, { useEffect, useState } from 'react';
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
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, index }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    
    // Animate numeric values
    if (typeof value === 'number') {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      return () => clearTimeout(timer);
    }
  }, [value, index]);

  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <Card 
      className={`flex-1 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="transition-transform duration-300 hover:scale-110">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-all duration-500">{displayValue}</div>
        <p className={`text-xs font-medium transition-colors duration-300 ${change >= 0 ? 'text-[#2196F3]' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change}% em relação ao período anterior
        </p>
      </CardContent>
    </Card>
  );
};

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
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsChartVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

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
          <MetricCard key={index} {...metric} index={index} />
        ))}
      </div>

      <Card 
        className={`transition-all duration-700 ${
          isChartVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <CardHeader>
          <CardTitle>Desempenho Diário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976D2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1976D2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D47A1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0D47A1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stackId="1" 
                  stroke="#2196F3" 
                  fill="url(#colorOrders)" 
                  name="Pedidos"
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="2" 
                  stroke="#1976D2" 
                  fill="url(#colorRevenue)" 
                  name="Receita"
                  animationDuration={1200}
                />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stackId="3" 
                  stroke="#0D47A1" 
                  fill="url(#colorCustomers)" 
                  name="Clientes"
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 