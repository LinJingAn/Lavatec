import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdBarChart, MdPieChart, MdTimeline, MdInsertChart } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useSidebar } from '@/contexts/SidebarContext';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const RelatoriosPage = () => {
  const navigate = useNavigate();
  const { closeSecondarySidebar } = useSidebar();

  const handleBackToFinanceiro = () => {
    closeSecondarySidebar();
    navigate('/admin/financeiro');
  };

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
            <h1 className="text-2xl font-semibold">Relatórios Financeiros</h1>
            <p className="text-sm text-gray-600 mt-1">
              Analise e exporte relatórios financeiros da empresa
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Select defaultValue="thismonth">
            <option value="thismonth">Este mês</option>
            <option value="lastmonth">Mês passado</option>
            <option value="thisquarter">Este trimestre</option>
            <option value="lastquarter">Último trimestre</option>
            <option value="thisyear">Este ano</option>
            <option value="lastyear">Ano passado</option>
          </Select>
          <Button>
            Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MdBarChart className="mr-2 text-blue-600" size={20} />
              Receita e Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <p className="text-gray-500">Gráfico de Receita e Despesas</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Receita Total</h3>
                <p className="text-lg font-semibold text-green-600">R$ 452.350,00</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Despesas Totais</h3>
                <p className="text-lg font-semibold text-red-600">R$ 298.720,00</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
                <p className="text-lg font-semibold text-blue-600">R$ 153.630,00</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Margem de Lucro</h3>
                <p className="text-lg font-semibold text-purple-600">33.96%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MdPieChart className="mr-2 text-purple-600" size={20} />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <p className="text-gray-500">Gráfico de Distribuição de Despesas</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salários e Benefícios</span>
                <span className="font-medium">R$ 134.424,00 (45%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Insumos</span>
                <span className="font-medium">R$ 74.680,00 (25%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Infraestrutura</span>
                <span className="font-medium">R$ 44.808,00 (15%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Marketing</span>
                <span className="font-medium">R$ 29.872,00 (10%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Outros</span>
                <span className="font-medium">R$ 14.936,00 (5%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MdTimeline className="mr-2 text-green-600" size={20} />
              Fluxo de Caixa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <p className="text-gray-500">Gráfico de Fluxo de Caixa</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Saldo Inicial</span>
                <span className="font-medium">R$ 258.640,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Entradas</span>
                <span className="font-medium text-green-600">+ R$ 452.350,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Saídas</span>
                <span className="font-medium text-red-600">- R$ 298.720,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Saldo Final</span>
                <span className="font-semibold">R$ 412.270,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MdInsertChart className="mr-2 text-amber-600" size={20} />
              Análise de Lucratividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <p className="text-gray-500">Gráfico de Lucratividade por Serviço</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lavagem Simples</span>
                <span className="font-medium">42% de margem</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lavagem a Seco</span>
                <span className="font-medium">38% de margem</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Passar</span>
                <span className="font-medium">45% de margem</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tingimento</span>
                <span className="font-medium">28% de margem</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Média Geral</span>
                <span className="font-semibold">33.96% de margem</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelatoriosPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 