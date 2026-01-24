import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ReferenceLine
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface PerformanceTrendsProps {
  data: {
    monthlyData: Array<{
      month: string;
      actual: number;
      target: number;
      growth: number;
    }>;
    goals: {
      revenue: number;
      orders: number;
      customers: number;
    };
  };
}

export const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Desempenho Mensal vs Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Real" />
                <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Meta" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progresso das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.goals).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {key === 'revenue' ? 'Receita' : 
                     key === 'orders' ? 'Pedidos' : 
                     key === 'customers' ? 'Clientes' : key}
                  </span>
                  <span>{formatCurrency(value)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-full rounded-full bg-primary" 
                    style={{ width: `${Math.min(100, (value / 1000000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tendências de Crescimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="growth" fill="#8884d8" name="Crescimento %" />
                <ReferenceLine y={0} stroke="#000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 