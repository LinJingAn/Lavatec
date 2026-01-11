import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheckCircle, MdWarning, MdSync, MdSearch } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/SidebarContext';

const ConciliacaoPage = () => {
  const navigate = useNavigate();
  const { closeSecondarySidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState('bancaria');

  const handleBackToFinanceiro = () => {
    closeSecondarySidebar();
    navigate('/admin/financeiro');
  };

  // Simulated data for bank reconciliation
  const bankTransactions = [
    { id: 1, date: '10/06/2023', description: 'Pagamento Cliente #1234', valor: 450.00, status: 'conciliado' },
    { id: 2, date: '12/06/2023', description: 'Pagamento Cliente #2345', valor: 320.50, status: 'pendente' },
    { id: 3, date: '14/06/2023', description: 'Pagamento Fornecedor ABC', valor: -1250.00, status: 'pendente' },
    { id: 4, date: '15/06/2023', description: 'Taxa Bancária', valor: -29.90, status: 'conciliado' },
    { id: 5, date: '18/06/2023', description: 'Pagamento Cliente #3456', valor: 780.00, status: 'divergente' },
  ];

  // Simulated data for supplier reconciliation
  const supplierInvoices = [
    { id: 1, supplier: 'Fornecedor ABC', invoice: 'NF-12345', date: '05/06/2023', valor: 1250.00, status: 'pendente' },
    { id: 2, supplier: 'Fornecedor XYZ', invoice: 'NF-54321', date: '08/06/2023', valor: 875.50, status: 'conciliado' },
    { id: 3, supplier: 'Fornecedor 123', invoice: 'NF-98765', date: '12/06/2023', valor: 490.00, status: 'conciliado' },
    { id: 4, supplier: 'Fornecedor DEF', invoice: 'NF-45678', date: '20/06/2023', valor: 1820.00, status: 'divergente' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToFinanceiro}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Conciliação Financeira</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie a conciliação financeira entre sistemas
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Select defaultValue="current-month">
            <option value="current-month">Mês Atual</option>
            <option value="last-month">Mês Anterior</option>
            <option value="custom">Período Personalizado</option>
          </Select>
          <Button>
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bancaria" className="w-full mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="bancaria" onClick={() => setActiveTab('bancaria')}>Conciliação Bancária</TabsTrigger>
          <TabsTrigger value="fornecedores" onClick={() => setActiveTab('fornecedores')}>Conciliação de Fornecedores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bancaria">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Conciliação Bancária</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <MdCheckCircle className="text-green-500 mr-2" size={20} />
                    <h3 className="text-sm font-medium">Conciliados</h3>
                  </div>
                  <p className="text-xl font-semibold">2</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <MdWarning className="text-yellow-500 mr-2" size={20} />
                    <h3 className="text-sm font-medium">Pendentes</h3>
                  </div>
                  <p className="text-xl font-semibold">2</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <MdSync className="text-red-500 mr-2" size={20} />
                    <h3 className="text-sm font-medium">Divergentes</h3>
                  </div>
                  <p className="text-xl font-semibold">1</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm font-medium">Saldo Conciliado</h3>
                  </div>
                  <p className="text-xl font-semibold">R$ 420,10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Transações Bancárias</CardTitle>
                <div className="flex w-1/3">
                  <Input 
                    placeholder="Buscar transação..." 
                    className="mr-2"
                    prefix={<MdSearch />}
                  />
                  <Select defaultValue="all">
                    <option value="all">Todos</option>
                    <option value="conciliado">Conciliados</option>
                    <option value="pendente">Pendentes</option>
                    <option value="divergente">Divergentes</option>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Data</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Descrição</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500 text-right">Valor</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Status</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankTransactions.map(transaction => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{transaction.date}</td>
                        <td className="p-3 text-sm">{transaction.description}</td>
                        <td className={`p-3 text-sm text-right ${transaction.valor < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          R$ {Math.abs(transaction.valor).toFixed(2)}
                        </td>
                        <td className="p-3 text-sm">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                            ${transaction.status === 'conciliado' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {transaction.status === 'conciliado' ? 'Conciliado' : 
                            transaction.status === 'pendente' ? 'Pendente' : 'Divergente'}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <Button size="sm" variant="outline" className="mr-2">Conciliar</Button>
                          <Button size="sm" variant="ghost">Detalhes</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fornecedores">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Conciliação de Fornecedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <MdCheckCircle className="text-green-500 mr-2" size={20} />
                    <h3 className="text-sm font-medium">Conciliados</h3>
                  </div>
                  <p className="text-xl font-semibold">2</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <MdWarning className="text-yellow-500 mr-2" size={20} />
                    <h3 className="text-sm font-medium">Pendentes</h3>
                  </div>
                  <p className="text-xl font-semibold">1</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <MdSync className="text-red-500 mr-2" size={20} />
                    <h3 className="text-sm font-medium">Divergentes</h3>
                  </div>
                  <p className="text-xl font-semibold">1</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm font-medium">Total Conciliado</h3>
                  </div>
                  <p className="text-xl font-semibold">R$ 1.365,50</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Notas Fiscais de Fornecedores</CardTitle>
                <div className="flex w-1/3">
                  <Input 
                    placeholder="Buscar nota fiscal..." 
                    className="mr-2"
                    prefix={<MdSearch />}
                  />
                  <Select defaultValue="all">
                    <option value="all">Todos</option>
                    <option value="conciliado">Conciliados</option>
                    <option value="pendente">Pendentes</option>
                    <option value="divergente">Divergentes</option>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Fornecedor</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Nota Fiscal</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Data</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500 text-right">Valor</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Status</th>
                      <th className="p-3 border-b text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierInvoices.map(invoice => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{invoice.supplier}</td>
                        <td className="p-3 text-sm">{invoice.invoice}</td>
                        <td className="p-3 text-sm">{invoice.date}</td>
                        <td className="p-3 text-sm text-right">R$ {invoice.valor.toFixed(2)}</td>
                        <td className="p-3 text-sm">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                            ${invoice.status === 'conciliado' ? 'bg-green-100 text-green-800' : 
                            invoice.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {invoice.status === 'conciliado' ? 'Conciliado' : 
                            invoice.status === 'pendente' ? 'Pendente' : 'Divergente'}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          <Button size="sm" variant="outline" className="mr-2">Conciliar</Button>
                          <Button size="sm" variant="ghost">Detalhes</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConciliacaoPage; 