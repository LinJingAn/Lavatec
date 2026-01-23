import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Define validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'Endereço de e-mail inválido' }),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

// TypeScript type for the form values
type LoginFormValues = z.infer<typeof loginSchema>;

// Disable static generation - this page uses React Router and Auth context
export const dynamic = 'force-dynamic';

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, setDevUser, emailVerified, resendVerificationEmail } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn(data.email, data.password);
      
      if (signInError) {
        // Handle specific error cases
        if (signInError.message.includes('email') && 
            (signInError.message.includes('verification') || 
             signInError.message.includes('confirm') || 
             signInError.message.includes('verified'))) {
          setError('Por favor, verifique seu e-mail antes de fazer login. Verifique sua caixa de entrada para um link de verificação.');
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('E-mail ou senha inválidos. Por favor, tente novamente.');
        } else {
          setError(signInError.message);
        }
      } else {
        // Success - show success message and redirect
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dev mode login function
  const handleDevLogin = async () => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    console.log('🔧 DEV MODE - Bypassing authentication...');
    
    // Set a mock user in the auth context
    setDevUser();
    
    // Show success and navigate
    setSuccess(true);
    
    setTimeout(() => {
      console.log('🚀 Dev mode bypass complete - navigating to dashboard');
      navigate('/');
    }, 500);
    
    setIsSubmitting(false);
  };

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Add custom styles for this page */}
      <style>{`
        .login-input {
          background-color: white !important;
          background: white !important;
        }
        .dark .login-input {
          background-color: #1e293b !important;
          background: #1e293b !important;
          color: #f1f5f9 !important;
          border-color: #475569 !important;
        }
        .login-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #000 !important;
          background-color: white !important;
          background: white !important;
        }
        .dark .login-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #1e293b inset !important;
          -webkit-text-fill-color: #f1f5f9 !important;
          background-color: #1e293b !important;
          background: #1e293b !important;
        }
        .login-input:-webkit-autofill:hover {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #000 !important;
          background-color: white !important;
        }
        .dark .login-input:-webkit-autofill:hover {
          -webkit-box-shadow: 0 0 0 1000px #1e293b inset !important;
          -webkit-text-fill-color: #f1f5f9 !important;
        }
        .login-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #000 !important;
          background-color: white !important;
        }
        .dark .login-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #1e293b inset !important;
          -webkit-text-fill-color: #f1f5f9 !important;
        }
        .login-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #000 !important;
          background-color: white !important;
        }
        .dark .login-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #1e293b inset !important;
          -webkit-text-fill-color: #f1f5f9 !important;
        }
      `}</style>
      
      <div className="max-w-[550px] w-full px-6 mx-auto pt-10">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lavatec</h1>
        </div>

        {/* Main Login Form */}
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold mb-3 text-center text-gray-900 dark:text-white">Entrar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-center">
            Insira seu email abaixo para entrar na sua conta
          </p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {needsVerification && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                Seu email ainda não foi verificado.
              </p>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-3">
                Por favor, verifique sua caixa de entrada e clique no link de verificação. Se você não recebeu o email, clique no botão abaixo para reenviar.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const email = (document.getElementById('email') as HTMLInputElement)?.value;
                  if (email) {
                    await resendVerificationEmail(email);
                    setNeedsVerification(false);
                    setSuccess(true);
                    setTimeout(() => {
                      navigate('/');
                    }, 2000);
                  }
                }}
                className="text-sm text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Reenviar email de verificação
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <p className="font-normal mb-2 text-left text-gray-900 dark:text-gray-200">Email</p>
              <input
                id="email"
                type="email"
                placeholder="meuemail@exemplo.com"
                {...register('email')}
                className="login-input h-[50px] w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-sm text-left">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="font-normal text-left text-gray-900 dark:text-gray-200">Senha</p>
                <RouterLink
                  to="/forgot-password"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Esqueceu sua senha?
                </RouterLink>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  className="login-input h-[50px] w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 pr-12 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                />
                <button
                  type="button"
                  className="absolute right-[2px] top-[5px] h-10 w-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-600 dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm text-left">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] bg-blue-600 dark:bg-blue-500 text-white rounded-md uppercase font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "ENTRANDO..." : "ENTRAR"}
            </button>

            {/* Dev Mode Login Button */}
            {isDevelopment && (
              <button
                type="button"
                onClick={handleDevLogin}
                disabled={isSubmitting}
                className="w-full h-[50px] mt-3 bg-orange-500 dark:bg-orange-600 text-white rounded-md uppercase font-medium hover:bg-orange-600 dark:hover:bg-orange-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-orange-600 dark:border-orange-500"
                title="Development Mode - Quick Login"
              >
                {isSubmitting ? "DEV LOGIN..." : "🔧 DEV LOGIN"}
              </button>
            )}

            {/* Dev Mode Info */}
            {isDevelopment && (
              <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded text-xs text-orange-700 dark:text-orange-300">
                <strong>🔧 Modo Desenvolvimento:</strong> Clique no botão laranja para login rápido
              </div>
            )}
          </form>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
            Não tem uma conta?{' '}
            <RouterLink to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Criar conta
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 