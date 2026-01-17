import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
// Supabase removed - using backend API

// User profile validation schema
const profileSchema = z.object({
  first_name: z.string().min(2, { message: 'Nome é obrigatório (mínimo 2 caracteres)' }),
  last_name: z.string().min(2, { message: 'Sobrenome é obrigatório (mínimo 2 caracteres)' }),
  email: z.string().email({ message: 'E-mail inválido' }).optional(),
  phone_number: z.string().optional(),
});

// Password change validation schema
const passwordSchema = z.object({
  current_password: z.string().min(6, { message: 'Senha atual é obrigatória' }),
  new_password: z.string().min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres' }),
  confirm_password: z.string().min(6, { message: 'Confirme sua nova senha' }),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const UserProfilePage = () => {
  const { user, dbUser, updateUserData, updatePassword, refreshUserData } = useAuth();
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Simplified profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: dbUser?.name?.split(' ')[0] || '',
      last_name: dbUser?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone_number: (dbUser as any)?.phone_number || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Update form when dbUser changes
  useEffect(() => {
    if (dbUser) {
      resetProfile({
        first_name: dbUser.name?.split(' ')[0] || '',
        last_name: dbUser.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone_number: (dbUser as any).phone_number || '',
      });
      setIsPageLoading(false);
    }
  }, [dbUser, user, resetProfile]);

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setIsProfileSubmitting(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      
      // Use the updateUserData function from the auth context
      const { error } = await updateUserData({
        name: `${data.first_name} ${data.last_name}`.trim(),
        ...(data.phone_number && { phone_number: data.phone_number } as any)
      });
      
      if (error) {
        console.error('Error saving profile:', error);
        setErrorMessage('Ocorreu um erro ao salvar o perfil. Por favor, tente novamente.');
      } else {
        // No need to await refreshUserData since we're already optimistically updating the UI
        setSuccessMessage('Perfil atualizado com sucesso!');
      }
    } catch (err) {
      console.error('Exception saving profile:', err);
      setErrorMessage('Ocorreu um erro ao salvar o perfil. Por favor, tente novamente.');
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setIsPasswordSubmitting(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      
      const { error } = await updatePassword(data.new_password);

      if (error) {
        throw error;
      }

      setSuccessMessage('Senha atualizada com sucesso!');
      resetPassword();
    } catch (error) {
      console.error('Password update error:', error);
      setErrorMessage('Ocorreu um erro ao atualizar sua senha. Por favor, tente novamente.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Perfil e Configurações
      </h1>

      {/* Custom Tabs */}
      <div className="flex mb-8">
        <button 
          className={`mr-4 px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === 'profile'
              ? 'bg-accent-primary text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Perfil
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === 'password'
              ? 'bg-accent-primary text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('password')}
        >
          Alterar Senha
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {isPageLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 text-center">
                <div className="mb-4">
                  <div 
                    className="w-[150px] h-[150px] rounded-full bg-gray-300 flex items-center justify-center mb-4 mx-auto"
                  >
                    <span className="text-4xl text-white">
                      {dbUser?.name?.split(' ')[0]?.[0] || ''}
                      {dbUser?.name?.split(' ').slice(1).join(' ')?.[0] || ''}
                    </span>
                  </div>
                  <p>{user?.email}</p>
                  <p className="text-gray-600 text-sm">
                    {dbUser?.role === 'admin' 
                      ? 'Administrador' 
                      : dbUser?.role === 'manager' 
                        ? 'Gerente' 
                        : dbUser?.role === 'staff' 
                          ? 'Funcionário' 
                          : 'Cliente'}
                  </p>
                  
                  {/* Notice for temporary situation */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      As alterações de perfil são salvas no banco de dados PostgreSQL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                      <input
                        id="first_name"
                        type="text"
                        {...registerProfile('first_name')}
                        className={`input ${profileErrors.first_name ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      {profileErrors.first_name && (
                        <p className="text-red-500 text-sm">
                          {profileErrors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">Sobrenome</label>
                      <input
                        id="last_name"
                        type="text"
                        {...registerProfile('last_name')}
                        className={`input ${profileErrors.last_name ? 'border-red-300' : 'border-gray-300'}`}
                      />
                      {profileErrors.last_name && (
                        <p className="text-red-500 text-sm">
                          {profileErrors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      {...registerProfile('email')}
                      className={`input ${profileErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                      disabled
                    />
                    {profileErrors.email && (
                      <p className="text-red-500 text-sm">
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      id="phone_number"
                      type="tel"
                      {...registerProfile('phone_number')}
                      className={`input ${profileErrors.phone_number ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {profileErrors.phone_number && (
                      <p className="text-red-500 text-sm">
                        {profileErrors.phone_number.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isProfileSubmitting}
                    >
                      {isProfileSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                  <input
                    id="current_password"
                    type="password"
                    {...registerPassword('current_password')}
                    className={`input ${passwordErrors.current_password ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {passwordErrors.current_password && (
                    <p className="text-red-500 text-sm">
                      {passwordErrors.current_password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <input
                    id="new_password"
                    type="password"
                    {...registerPassword('new_password')}
                    className={`input ${passwordErrors.new_password ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {passwordErrors.new_password && (
                    <p className="text-red-500 text-sm">
                      {passwordErrors.new_password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                  <input
                    id="confirm_password"
                    type="password"
                    {...registerPassword('confirm_password')}
                    className={`input ${passwordErrors.confirm_password ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {passwordErrors.confirm_password && (
                    <p className="text-red-500 text-sm">
                      {passwordErrors.confirm_password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isPasswordSubmitting}
                  >
                    {isPasswordSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfilePage; 