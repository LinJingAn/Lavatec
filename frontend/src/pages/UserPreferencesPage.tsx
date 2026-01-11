import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

// User preferences schema
const preferencesSchema = z.object({
  defaultBranchId: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']),
  emailNotifications: z.boolean(),
  language: z.enum(['pt_BR', 'en_US', 'es_ES']),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['12h', '24h']),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const UserPreferencesPage = () => {
  console.log('UserPreferencesPage rendered');
  const { user, dbUser, companyId, refreshUserData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Log user and dbUser for debugging
  useEffect(() => {
    console.log('UserPreferencesPage - Current user:', user);
    console.log('UserPreferencesPage - Current dbUser:', dbUser);
  }, [user, dbUser]);

  // Cleanup on unmount - refresh user data when navigating away
  useEffect(() => {
    return () => {
      console.log('UserPreferencesPage unmounting - refreshing user data');
      refreshUserData();
    };
  }, [refreshUserData]);

  // Preferences form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: 'system',
      emailNotifications: true,
      language: 'pt_BR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
    },
  });

  // Watch form values for live updates
  const currentTheme = watch('theme');
  const currentLanguage = watch('language');
  const currentDateFormat = watch('dateFormat');
  const currentTimeFormat = watch('timeFormat');
  const emailNotifications = watch('emailNotifications');

  // Load user preferences and available branches
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {  // PGRST116 is "no rows found" error
          throw error;
        }

        if (data) {
          setPreferences(data);
          // Set form values from database
          reset({
            defaultBranchId: data.default_branch_id || '',
            theme: data.theme || 'system',
            emailNotifications: data.email_notifications,
            language: data.language || 'pt_BR',
            dateFormat: data.date_format || 'DD/MM/YYYY',
            timeFormat: data.time_format || '24h',
          });
        }

        // If user belongs to a company, fetch available branches
        if (companyId) {
          const { data: branchesData, error: branchesError } = await supabase
            .from('branches')
            .select('id, name')
            .eq('company_id', companyId)
            .eq('is_active', true)
            .order('name');

          if (branchesError) throw branchesError;
          
          setBranches(branchesData);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        setErrorMessage('Não foi possível carregar suas preferências.');
      }
    };

    fetchData();
  }, [user?.id, companyId, reset]);

  // Save user preferences
  const onSubmit = async (data: PreferencesFormValues) => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // Check if preferences already exist
      if (preferences) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({
            default_branch_id: data.defaultBranchId || null,
            theme: data.theme,
            email_notifications: data.emailNotifications,
            language: data.language,
            date_format: data.dateFormat,
            time_format: data.timeFormat,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            default_branch_id: data.defaultBranchId || null,
            theme: data.theme,
            email_notifications: data.emailNotifications,
            language: data.language,
            date_format: data.dateFormat,
            time_format: data.timeFormat,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setSuccessMessage('Suas preferências foram atualizadas com sucesso.');

      // Apply theme immediately (this would work with a theme context in a real app)
      console.log(`Theme changed to: ${data.theme}`);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      setErrorMessage('Ocorreu um erro ao salvar suas preferências.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'pt_BR': return 'Português (Brasil)';
      case 'en_US': return 'English (US)';
      case 'es_ES': return 'Español';
      default: return code;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Preferências do Usuário
      </h1>

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Branch selection (only for users in a company) */}
        {companyId && branches.length > 0 && (
          <div className="p-6 border border-gray-200 rounded-md mb-4">
            <h2 className="text-xl font-semibold mb-4">Filial Padrão</h2>
            <p className="mb-4 text-gray-600">
              Selecione a filial padrão para iniciar o sistema.
            </p>
            <div>
              <select
                {...register('defaultBranchId')}
                className="input max-w-[400px]"
              >
                <option value="">Selecione uma filial</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Interface preferences */}
        <div className="p-6 border border-gray-200 rounded-md mb-4">
          <h2 className="text-xl font-semibold mb-4">Preferências de Interface</h2>
          <div className="space-y-6">
            <div>
              <p className="font-medium mb-2">Tema</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('theme', 'light')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentTheme === 'light'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => setValue('theme', 'dark')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentTheme === 'dark'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Escuro
                </button>
                <button
                  type="button"
                  onClick={() => setValue('theme', 'system')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentTheme === 'system'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Sistema
                </button>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Idioma</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('language', 'pt_BR')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentLanguage === 'pt_BR'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Português (Brasil)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('language', 'en_US')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentLanguage === 'en_US'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  English (US)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('language', 'es_ES')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentLanguage === 'es_ES'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Español
                </button>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Formato de Data</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('dateFormat', 'DD/MM/YYYY')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentDateFormat === 'DD/MM/YYYY'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  DD/MM/YYYY
                </button>
                <button
                  type="button"
                  onClick={() => setValue('dateFormat', 'MM/DD/YYYY')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentDateFormat === 'MM/DD/YYYY'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  MM/DD/YYYY
                </button>
                <button
                  type="button"
                  onClick={() => setValue('dateFormat', 'YYYY-MM-DD')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentDateFormat === 'YYYY-MM-DD'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  YYYY-MM-DD
                </button>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Formato de Hora</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('timeFormat', '12h')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentTimeFormat === '12h'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  12 horas
                </button>
                <button
                  type="button"
                  onClick={() => setValue('timeFormat', '24h')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentTimeFormat === '24h'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  24 horas
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('emailNotifications')}
                    className="form-checkbox h-5 w-5 text-accent-primary rounded border-gray-300"
                  />
                  <span className="text-gray-700">Receber notificações por e-mail</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPreferencesPage; 