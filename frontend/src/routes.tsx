import UserAccessControlPage from '@/pages/admin/configuracoes/UserAccessControlPage';

// Inside the admin routes configuration
{
  path: '/admin/configuracoes',
  element: <AdminLayout />,
  children: [
    {
      path: 'sistema',
      element: <SystemConfigPage />
    },
    {
      path: 'acesso',
      element: <UserAccessControlPage />
    }
  ]
} 