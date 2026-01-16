import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MdLocalLaundryService, MdBuild, MdSchedule, MdWarning } from 'react-icons/md';

const MachinesOverviewPage = () => {
  // Example data - in a real app, this would come from an API
  const machineStats = {
    total: 12,
    active: 8,
    maintenance: 2,
    alerts: 1
  };

  const stats = [
    {
      title: 'Total de Máquinas',
      value: machineStats.total,
      icon: <MdLocalLaundryService className="w-5 h-5 text-blue-600" />,
      description: 'Máquinas registradas'
    },
    {
      title: 'Em Operação',
      value: machineStats.active,
      icon: <MdSchedule className="w-5 h-5 text-green-600" />,
      description: 'Máquinas ativas'
    },
    {
      title: 'Em Manutenção',
      value: machineStats.maintenance,
      icon: <MdBuild className="w-5 h-5 text-orange-600" />,
      description: 'Em reparo ou manutenção'
    },
    {
      title: 'Alertas',
      value: machineStats.alerts,
      icon: <MdWarning className="w-5 h-5 text-red-600" />,
      description: 'Requerem atenção'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Visão Geral das Máquinas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Máquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Gráfico de status das máquinas será exibido aqui
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manutenções Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Lista de próximas manutenções será exibida aqui
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MachinesOverviewPage; 