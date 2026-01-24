import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'Endereço de e-mail inválido' }),
});

type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

const ResendVerificationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResendVerificationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post('/auth/resend-verification', {
        email: data.email,
      });

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Resend verification error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao enviar email de verificação';
      setError(errorMessage);
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
          <h2 className="text-3xl mb-3">Reenviar Email de Verificação</h2>
          <p className="text-gray-600 mb-10">
            Digite seu email para receber um novo link de verificação
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 font-medium">
                Email de verificação enviado com sucesso!
              </p>
              <p className="text-green-600 text-sm mt-2">
                Verifique sua caixa de entrada e siga as instruções. Você será redirecionado para o login em alguns segundos.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <p className="font-normal mb-2 text-left">E-mail</p>
              <input
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                className="input"
                disabled={isSubmitting || success}
              />
              {errors.email && (
                <p className="text-red-500 text-sm text-left mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-[50px] btn-primary uppercase"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? 'ENVIANDO...' : 'ENVIAR LINK DE VERIFICAÇÃO'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-8">
            <Link
              to="/login"
              className="text-accent-primary cursor-pointer hover:text-accent-primary-hover"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
}
