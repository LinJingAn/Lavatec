import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAutorenew,
  MdCampaign,
  MdEmail,
  MdSms,
  MdNotifications,
  MdHistory,
  MdRateReview,
  MdArticle
} from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const marketingModules = [
  {
    id: 'automated-flows',
    title: 'Fluxos Automatizados',
    description: 'Crie fluxos de marketing automatizados baseados no comportamento do cliente',
    icon: <MdAutorenew className="text-blue-500 text-4xl" />,
    link: '/stores/marketing/automated-flows'
  },
  {
    id: 'automated-campaigns',
    title: 'Campanhas Automatizadas',
    description: 'Configure campanhas de marketing que rodam em um cronograma',
    icon: <MdCampaign className="text-green-500 text-4xl" />,
    link: '/stores/marketing/automated-campaigns'
  },
  {
    id: 'email',
    title: 'E-mail',
    description: 'Crie e envie campanhas de e-mail para seus clientes',
    icon: <MdEmail className="text-red-500 text-4xl" />,
    link: '/stores/marketing/email'
  },
  {
    id: 'sms',
    title: 'SMS',
    description: 'Envie mensagens SMS para seus clientes',
    icon: <MdSms className="text-purple-500 text-4xl" />,
    link: '/stores/marketing/sms'
  },
  {
    id: 'push',
    title: 'Notificações Push',
    description: 'Envie notificações push para seus clientes',
    icon: <MdNotifications className="text-orange-500 text-4xl" />,
    link: '/stores/marketing/push'
  },
  {
    id: 'history',
    title: 'Histórico',
    description: 'Visualize o histórico de todas as comunicações de marketing',
    icon: <MdHistory className="text-indigo-500 text-4xl" />,
    link: '/stores/marketing/history'
  },
  {
    id: 'reviews',
    title: 'Avaliações',
    description: 'Gerencie e responda às avaliações dos clientes',
    icon: <MdRateReview className="text-yellow-500 text-4xl" />,
    link: '/stores/marketing/reviews'
  },
  {
    id: 'email-templates',
    title: 'Templates de E-mail',
    description: 'Gerencie seus templates de e-mail',
    icon: <MdArticle className="text-gray-500 text-4xl" />,
    link: '/stores/marketing/email-templates'
  }
];

const MarketingPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Marketing</h1>
        <p className="text-gray-600 mt-1">
          Gerencie todas as suas campanhas e comunicações de marketing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketingModules.map((module) => (
          <Link 
            key={module.id}
            to={module.link}
            className="bg-white rounded-lg shadow-sm p-6 transition duration-200 hover:shadow-md flex"
          >
            <div className="mr-4 flex-shrink-0 flex items-center justify-center">
              {module.icon}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {module.title}
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                {module.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MarketingPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 