import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

// Disable static generation - this page uses React Router and query params
export const dynamic = 'force-dynamic';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success } = useNotification();
  const { refreshUserData } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
  const [message, setMessage] = useState<string>('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificação não encontrado. Por favor, use o link do email.');
        return;
      }

      try {
        const response = await api.get('/auth/verify-email', {
          params: { token },
        });

        if (response.data.verified) {
          // Refresh user data to update verification status
          await refreshUserData();
          
          if (response.data.message.includes('already verified')) {
            setStatus('already-verified');
            setMessage('Seu email já foi verificado anteriormente.');
            // Still show notification and redirect
            success('Email já verificado! Redirecionando para o dashboard...', 2000);
            setTimeout(() => {
              navigate('/');
            }, 1500);
          } else {
            setStatus('success');
            setMessage('Email verificado com sucesso! Redirecionando para o dashboard...');
            // Show success notification and redirect to dashboard
            success('Email verificado com sucesso! Redirecionando para o dashboard...', 3000);
            setTimeout(() => {
              navigate('/');
            }, 1500);
          }
        }
      } catch (error: any) {
        console.error('Email verification error:', error);
        
        const errorMessage = error.response?.data?.error || error.message || 'Erro ao verificar email';
        
        if (errorMessage.includes('expired')) {
          setMessage('O link de verificação expirou. Por favor, solicite um novo link de verificação.');
        } else if (errorMessage.includes('Invalid') || errorMessage.includes('invalid')) {
          setMessage('Link de verificação inválido ou já utilizado.');
        } else {
          setMessage(errorMessage);
        }
        
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="max-w-[550px] w-full px-6 mx-auto pt-10">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-2xl font-bold">Lavatec</h1>
        </div>

        {/* Main Content */}
        <div className="w-full text-center">
          {status === 'loading' && (
            <>
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-primary mx-auto"></div>
              </div>
              <h2 className="text-3xl mb-3">Verificando Email...</h2>
              <p className="text-gray-600">
                Por favor, aguarde enquanto verificamos seu email.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl mb-3 text-green-600">Email Verificado!</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <p className="text-sm text-gray-500 mb-4">
                Você será redirecionado automaticamente...
              </p>
              <Link
                to="/"
                className="inline-block w-full h-[50px] btn-primary uppercase text-center leading-[50px]"
              >
                Ir para Dashboard
              </Link>
            </>
          )}

          {status === 'already-verified' && (
            <>
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl mb-3 text-blue-600">Email Já Verificado</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <p className="text-sm text-gray-500 mb-4">
                Você será redirecionado automaticamente...
              </p>
              <Link
                to="/"
                className="inline-block w-full h-[50px] btn-primary uppercase text-center leading-[50px]"
              >
                Ir para Dashboard
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl mb-3 text-red-600">Erro na Verificação</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/resend-verification"
                  className="inline-block w-full h-[50px] btn-primary uppercase text-center leading-[50px]"
                >
                  Solicitar Novo Link
                </Link>
                <Link
                  to="/login"
                  className="inline-block w-full text-accent-primary hover:text-accent-primary-hover"
                >
                  Voltar para o Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
}
