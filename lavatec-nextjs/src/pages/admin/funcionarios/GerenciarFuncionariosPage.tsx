import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MdPerson, 
  MdAccessTime, 
  MdAttachMoney, 
  MdAssignment, 
  MdSchool, 
  MdSettings,
  MdGroupWork,
  MdChat,
  MdEvent
} from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const GerenciarFuncionariosPage = () => {
  const modules = [
    {
      id: 'funcionarios',
      title: 'Funcionários',
      description: 'Cadastro e gerenciamento de funcionários',
      icon: <MdPerson className="text-blue-500 text-4xl" />,
      link: '/admin/funcionarios/lista'
    },
    {
      id: 'horarios',
      title: 'Horários',
      description: 'Gestão de horários e escalas de trabalho',
      icon: <MdAccessTime className="text-green-500 text-4xl" />,
      link: '/admin/funcionarios/horarios'
    },
    {
      id: 'folha-pagamento',
      title: 'Folha de Pagamento',
      description: 'Gerenciamento de salários e pagamentos',
      icon: <MdAttachMoney className="text-yellow-500 text-4xl" />,
      link: '/admin/funcionarios/folha-pagamento'
    },
    {
      id: 'beneficios',
      title: 'Benefícios',
      description: 'Gestão de benefícios e vantagens',
      icon: <MdAssignment className="text-purple-500 text-4xl" />,
      link: '/admin/funcionarios/beneficios'
    },
    {
      id: 'treinamento',
      title: 'Treinamento',
      description: 'Programas de desenvolvimento e capacitação',
      icon: <MdSchool className="text-red-500 text-4xl" />,
      link: '/admin/funcionarios/treinamento'
    },
    {
      id: 'departamentos',
      title: 'Departamentos',
      description: 'Gerenciamento de departamentos e equipes',
      icon: <MdGroupWork className="text-indigo-500 text-4xl" />,
      link: '/admin/funcionarios/departamentos'
    },
    {
      id: 'comunicacao',
      title: 'Comunicação',
      description: 'Comunicados e mensagens para funcionários',
      icon: <MdChat className="text-teal-500 text-4xl" />,
      link: '/admin/funcionarios/comunicacao'
    },
    {
      id: 'eventos',
      title: 'Eventos',
      description: 'Calendário de eventos corporativos',
      icon: <MdEvent className="text-orange-500 text-4xl" />,
      link: '/admin/funcionarios/eventos'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configurações gerais do módulo de RH',
      icon: <MdSettings className="text-gray-500 text-4xl" />,
      link: '/admin/funcionarios/configuracoes'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Funcionários</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os aspectos relacionados aos funcionários da empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link 
            key={module.id}
            to={module.link}
            className="bg-white rounded-lg shadow-sm p-6 transition duration-200 hover:shadow-md flex"
          >
            <div className="mr-4 flex-shrink-0 flex items-center justify-center">
              {module.icon}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">{module.title}</h2>
              <p className="text-gray-600 mt-1 text-sm">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GerenciarFuncionariosPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 