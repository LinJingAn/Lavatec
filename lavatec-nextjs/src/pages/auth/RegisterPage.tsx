import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Schema de validação com Zod
const registerSchema = z.object({
  // Informações da empresa
  companyName: z.string().min(2, { message: 'Nome da empresa é obrigatório' }),
  companyAddress: z.string().min(5, { message: 'Endereço é obrigatório' }),
  companyCity: z.string().min(2, { message: 'Cidade é obrigatória' }),
  companyState: z.string().min(2, { message: 'Estado é obrigatório' }),
  companyZip: z.string().min(5, { message: 'CEP é obrigatório' }),
  companyPhone: z.string().min(10, { message: 'Telefone é obrigatório' }),
  
  // Informações do administrador
  adminFirstName: z.string().min(2, { message: 'Nome é obrigatório' }),
  adminLastName: z.string().min(2, { message: 'Sobrenome é obrigatório' }),
  adminEmail: z
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),
  adminPassword: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  adminConfirmPassword: z
    .string()
    .min(1, { message: 'Confirme sua senha' }),
}).refine((data) => data.adminPassword === data.adminConfirmPassword, {
  message: "As senhas não coincidem",
  path: ["adminConfirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Disable static generation - this page uses React Router and Auth context
export const dynamic = 'force-dynamic';

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('Registrando empresa:', {
        companyName: data.companyName,
        adminEmail: data.adminEmail
      });

      // 1. Criar o usuário no Authentication
      const fullName = `${data.adminFirstName} ${data.adminLastName}`;
      const { error: signUpError, user } = await signUp(
        data.adminEmail,
        data.adminPassword,
        fullName,
        'admin'
      );

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!user || !user.id) {
        throw new Error('Falha ao criar usuário. Tente novamente.');
      }

      console.log('Usuário criado com sucesso. ID:', user.id);
      console.log('Criando registro da empresa...');

      setSuccess(true);
      
      // Redirect to wait for verification page
      // The backend sends verification email automatically
      setTimeout(() => {
        navigate('/wait-for-verification');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      if (typeof errorMessage === 'string' && 
          (errorMessage.includes('already exists') || 
           errorMessage.includes('already registered') ||
           errorMessage.includes('already in use'))) {
        setError('Uma conta com este e-mail já existe. Por favor, tente fazer login.');
      } else {
        setError(`Ocorreu um erro durante o registro: ${errorMessage}`);
      }
      
      console.error('Erro no registro:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header Section */}
      <div className="max-w-[800px] w-full px-6 mx-auto pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Lavatec</h1>
        </div>
        
        <div className="w-full text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-center">Registro de Empresa</h2>
          <p className="text-gray-600 text-center">
            Cadastre sua empresa de lavanderia no sistema Lavatec
          </p>
        </div>

        {error && (
          <p className="text-red-500 mb-6 text-center">{error}</p>
        )}

        {success && (
          <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
            <p className="text-green-600 font-medium text-center mb-2">
              Registro realizado com sucesso!
            </p>
            <p className="text-green-700 text-sm text-center mb-3">
              Uma mensagem de verificação foi enviada para seu email. Por favor, verifique sua caixa de entrada e clique no link de verificação para ativar sua conta.
            </p>
            <p className="text-green-600 text-sm text-center">
              Redirecionando para a página de boas-vindas...
            </p>
          </div>
        )}

        <div className="p-8 bg-white shadow-sm rounded-md border border-gray-200 w-full mx-auto mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              {/* Informações da Empresa */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informações da Empresa</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Empresa *
                    </label>
                    <input
                      id="companyName"
                      {...register('companyName')}
                      className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço *
                    </label>
                    <input
                      id="companyAddress"
                      {...register('companyAddress')}
                      className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.companyAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="companyCity" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        id="companyCity"
                        {...register('companyCity')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.companyCity && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyCity.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="companyState" className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <input
                        id="companyState"
                        {...register('companyState')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.companyState && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyState.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="companyZip" className="block text-sm font-medium text-gray-700 mb-1">
                        CEP *
                      </label>
                      <input
                        id="companyZip"
                        {...register('companyZip')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.companyZip && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyZip.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      id="companyPhone"
                      {...register('companyPhone')}
                      className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.companyPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informações do Administrador */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informações do Administrador</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                      </label>
                      <input
                        id="adminFirstName"
                        {...register('adminFirstName')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.adminFirstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.adminFirstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Sobrenome *
                      </label>
                      <input
                        id="adminLastName"
                        {...register('adminLastName')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.adminLastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.adminLastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      id="adminEmail"
                      type="email"
                      {...register('adminEmail')}
                      className="h-[50px] w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {errors.adminEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.adminEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha *
                    </label>
                    <div className="relative">
                      <input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        {...register('adminPassword')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    {errors.adminPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.adminPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <input
                        id="adminConfirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('adminConfirmPassword')}
                        className="h-[50px] w-full border border-gray-300 rounded-md px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    {errors.adminConfirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.adminConfirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[50px] bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                {isSubmitting ? "Processando..." : "Registrar Empresa"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mb-10">
          Já tem uma conta?{' '}
          <RouterLink to="/login" className="text-primary-500 hover:text-primary-600">
            Faça login
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 