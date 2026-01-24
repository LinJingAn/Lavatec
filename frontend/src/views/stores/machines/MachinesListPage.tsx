import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MdAdd, MdSearch, MdFilterList } from 'react-icons/md';

interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  cycles: number;
}

const MachinesListPage = () => {
  // Example data - in a real app, this would come from an API
  const machines: Machine[] = [
    {
      id: '1',
      name: 'Lavadora Industrial 01',
      type: 'Lavadora',
      status: 'active',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-02-01',
      cycles: 1250
    },
    {
      id: '2',
      name: 'Secadora Industrial 01',
      type: 'Secadora',
      status: 'maintenance',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-15',
      cycles: 980
    },
    {
      id: '3',
      name: 'Passadeira Industrial 01',
      type: 'Passadeira',
      status: 'active',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      cycles: 750
    }
  ];

  const getStatusColor = (status: Machine['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'maintenance':
        return 'text-orange-600';
      case 'inactive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: Machine['status']) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'maintenance':
        return 'Em Manutenção';
      case 'inactive':
        return 'Inativa';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lista de Máquinas</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <MdAdd className="w-5 h-5" />
          Nova Máquina
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Máquinas</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar máquina..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MdSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MdFilterList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Última Manutenção</th>
                  <th className="text-left py-3 px-4">Próxima Manutenção</th>
                  <th className="text-left py-3 px-4">Ciclos</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{machine.name}</td>
                    <td className="py-3 px-4">{machine.type}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getStatusColor(machine.status)}`}>
                        {getStatusText(machine.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{machine.lastMaintenance}</td>
                    <td className="py-3 px-4">{machine.nextMaintenance}</td>
                    <td className="py-3 px-4">{machine.cycles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachinesListPage; 