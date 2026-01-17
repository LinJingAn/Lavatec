import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { useNotification } from '../contexts/NotificationContext';

// Disable static generation - this page uses React Router and Auth context
export const dynamic = 'force-dynamic';

const WaitForVerificationPage = () => {
  const navigate = useNavigate();
  const { user, emailVerified, refreshUserData } = useAuth();
  const { success } = useNotification();
  const [isChecking, setIsChecking] = useState(false);
  const checkCountRef = useRef(0);
  const maxChecks = 60; // Check for up to 5 minutes (60 * 5 seconds)
  const hasRedirectedRef = useRef(false);

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // If already verified, redirect immediately
  useEffect(() => {
    if (emailVerified && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      success('Email já verificado! Redirecionando para o dashboard...', 2000);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [emailVerified, navigate, success]);

  // Poll for email verification status
  useEffect(() => {
    if (!user || emailVerified || hasRedirectedRef.current) {
      return;
    }

    let pollInterval: NodeJS.Timeout | null = null;
    let initialTimeout: NodeJS.Timeout | null = null;

    const checkVerificationStatus = async () => {
      if (hasRedirectedRef.current) return;
      
      setIsChecking(true);
      
      try {
        // Check if verified by calling profile endpoint directly
        const response = await api.get('/auth/profile');
        const isVerified = response.data?.user?.email_verified;
        
        if (isVerified) {
          // Email verified! Show notification and redirect
          hasRedirectedRef.current = true;
          await refreshUserData(); // Refresh to update context
          
          success('Email verificado com sucesso! Redirecionando para o dashboard...', 3000);
          
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // Not verified yet, continue polling
          checkCountRef.current += 1;
          
          if (checkCountRef.current >= maxChecks) {
            // Stop polling after max attempts
            if (pollInterval) {
              clearInterval(pollInterval);
            }
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        // Continue polling even on error
        checkCountRef.current += 1;
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check after 2 seconds
    initialTimeout = setTimeout(() => {
      checkVerificationStatus();
    }, 2000);

    // Poll every 5 seconds if not verified and haven't exceeded max checks
    pollInterval = setInterval(() => {
      if (checkCountRef.current < maxChecks && !emailVerified && !hasRedirectedRef.current) {
        checkVerificationStatus();
      } else if (checkCountRef.current >= maxChecks) {
        // Stop polling after max attempts
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      }
    }, 5000);

    return () => {
      if (initialTimeout) clearTimeout(initialTimeout);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [user, emailVerified, maxChecks, navigate, refreshUserData, success]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="max-w-[550px] w-full px-6 mx-auto pt-10">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-2xl font-bold">Lavatec</h1>
        </div>

        {/* Main Content */}
        <div className="w-full text-center">
          {/* Animated Email Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center relative">
              <svg
                className="w-12 h-12 text-blue-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              
              {/* Spinning indicator */}
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>

          <h2 className="text-3xl mb-3 text-gray-800">Aguardando Verificação de Email</h2>
          
          <p className="text-gray-600 mb-6">
            Enviamos um email de verificação para <strong>{user?.email}</strong>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <p className="text-blue-800 font-medium mb-2">Próximos passos:</p>
                <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Verifique sua caixa de entrada</li>
                  <li>Clique no link de verificação no email</li>
                  <li>Você será redirecionado automaticamente</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="mb-6">
            {isChecking ? (
              <p className="text-gray-500 text-sm">
                Verificando status de verificação...
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Verificando automaticamente a cada 5 segundos
              </p>
            )}
          </div>

          {/* Resend verification option */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm mb-4">
              Não recebeu o email?
            </p>
            <a
              href="/resend-verification"
              onClick={(e) => {
                e.preventDefault();
                navigate('/resend-verification');
              }}
              className="inline-block text-accent-primary hover:text-accent-primary-hover text-sm font-medium cursor-pointer"
            >
              Reenviar email de verificação
            </a>
          </div>

          {/* Manual refresh button */}
          <div className="mt-6">
            <button
              onClick={async () => {
                setIsChecking(true);
                await refreshUserData();
                setIsChecking(false);
              }}
              disabled={isChecking}
              className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              {isChecking ? 'Verificando...' : 'Verificar agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitForVerificationPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
}
