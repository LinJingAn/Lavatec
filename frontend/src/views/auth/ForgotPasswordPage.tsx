import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Define validation schema with Zod
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'Endereço de e-mail inválido' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Disable static generation - this page uses React Router and Auth context
export const dynamic = 'force-dynamic';

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } = await resetPassword(data.email);

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="max-w-[550px] w-full px-6 mx-auto pt-10">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-2xl font-bold">Lavatec</h1>
        </div>

        {/* Main Form */}
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold mb-3 text-center">Esqueceu sua senha?</h2>
          <p className="text-gray-600 mb-10 text-center">
            Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha
          </p>
          
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          
          {success && (
            <div className="bg-green-50 p-4 rounded-md mb-6">
              <p className="text-green-600 font-medium">
                Link de redefinição enviado!
              </p>
              <p className="text-green-600 text-sm">
                Verifique seu e-mail para obter um link para redefinir sua senha. Se não aparecer em alguns minutos, verifique sua pasta de spam.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <p className="font-normal mb-2 text-left">Email</p>
              <input
                id="email"
                type="email"
                placeholder="meuemail@exemplo.com"
                {...register('email')}
                className="h-[50px] w-full border border-gray-300 rounded-md px-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm text-left">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] border border-black text-black bg-white rounded-md uppercase font-medium hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "ENVIANDO..." : "ENVIAR LINK"}
            </button>
          </form>
          
          <div className="text-center text-sm text-gray-600 mt-8">
            <span 
              className="text-primary-500 cursor-pointer hover:text-primary-600"
              onClick={() => navigate('/login')}
            >
              Voltar para o login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 