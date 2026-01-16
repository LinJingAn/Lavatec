import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
// Supabase removed - using backend API
import { Company, Branch } from '../types/database.types';

// Company information validation schema
const companySchema = z.object({
  name: z.string().min(2, { message: 'Nome da empresa é obrigatório' }),
  address: z.string().min(5, { message: 'Endereço é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().optional(),
  zip_code: z.string().min(5, { message: 'CEP é obrigatório' }),
  country: z.string().min(2, { message: 'País é obrigatório' }),
  phone_number: z.string().min(8, { message: 'Telefone é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  website: z.string().url({ message: 'Website inválido' }).optional().or(z.literal('')),
  tax_id: z.string().optional(),
});

// Branch validation schema
const branchSchema = z.object({
  name: z.string().min(2, { message: 'Nome da filial é obrigatório' }),
  address: z.string().min(5, { message: 'Endereço é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().optional(),
  zip_code: z.string().min(5, { message: 'CEP é obrigatório' }),
  country: z.string().min(2, { message: 'País é obrigatório' }),
  phone_number: z.string().min(8, { message: 'Telefone é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }).optional().or(z.literal('')),
  manager_id: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;
type BranchFormValues = z.infer<typeof branchSchema>;

const CompanySettingsPage = () => {
  const { user, dbUser, companyId } = useAuth();
  const [isCompanySubmitting, setIsCompanySubmitting] = useState(false);
  const [isBranchSubmitting, setIsBranchSubmitting] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'branches'>('company');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Company form
  const {
    register: registerCompany,
    handleSubmit: handleCompanySubmit,
    formState: { errors: companyErrors },
    reset: resetCompany,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
  });

  // Branch form
  const {
    register: registerBranch,
    handleSubmit: handleBranchSubmit,
    formState: { errors: branchErrors },
    reset: resetBranch,
    setValue: setBranchValue,
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
  });

  // Load company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;

      try {
        // TODO: Implement company/branch endpoints in backend
        // For now, show a message that this feature is not yet available
        console.warn('Company settings not yet implemented in backend');
        setErrorMessage('Configurações de empresa ainda não estão disponíveis. Esta funcionalidade será implementada em breve.');
      } catch (error) {
        console.error('Error fetching company data:', error);
        setErrorMessage('Não foi possível carregar os dados da empresa.');
      }
    };

    fetchCompanyData();
  }, [companyId, resetCompany]);

  // Handle company update
  const onCompanySubmit = async (data: CompanyFormValues) => {
    if (!companyId) return;
    
    setIsCompanySubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // TODO: Implement company update endpoint in backend
      console.warn('Company update not yet implemented in backend');
      setErrorMessage('Atualização de empresa ainda não está disponível. Esta funcionalidade será implementada em breve.');

    } catch (error) {
      console.error('Company update error:', error);
      setErrorMessage('Ocorreu um erro ao atualizar as informações da empresa.');
    } finally {
      setIsCompanySubmitting(false);
    }
  };

  // Open branch modal
  const openBranchModal = (branch: Branch | null = null) => {
    setCurrentBranch(branch);
    
    if (branch) {
      // Edit mode - set form values
      Object.keys(branchSchema.shape).forEach((key) => {
        setBranchValue(key as keyof BranchFormValues, branch[key as keyof Branch] || '');
      });
    } else {
      // Create mode - reset form
      resetBranch({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'Brasil',
        phone_number: '',
        email: '',
        manager_id: '',
      });
    }
    
    openModal();
  };

  // Handle branch create/update
  const onBranchSubmit = async (data: BranchFormValues) => {
    if (!companyId) return;
    
    setIsBranchSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // TODO: Implement branch create/update endpoints in backend
      console.warn('Branch create/update not yet implemented in backend');
      setErrorMessage('Gerenciamento de filiais ainda não está disponível. Esta funcionalidade será implementada em breve.');

    } catch (error) {
      console.error('Branch save error:', error);
      setErrorMessage('Ocorreu um erro ao salvar as informações da filial.');
    } finally {
      setIsBranchSubmitting(false);
    }
  };

  // Toggle branch active status
  const toggleBranchStatus = async (branch: Branch) => {
    try {
      setSuccessMessage(null);
      setErrorMessage(null);
      
      // TODO: Implement branch status toggle endpoint in backend
      console.warn('Branch status toggle not yet implemented in backend');
      setErrorMessage('Alteração de status de filial ainda não está disponível.');
    } catch (error) {
      console.error('Error toggling branch status:', error);
      setErrorMessage('Não foi possível atualizar o status da filial.');
    }
  };

  // Check if user is allowed to manage company settings
  if (dbUser?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Acesso Restrito</h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'company'
                  ? 'bg-accent-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Informações da Empresa
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'branches'
                  ? 'bg-accent-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Gerenciar Filiais
            </button>
          </div>
        </div>

        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Você não tem permissão para acessar as configurações da empresa.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'company'
                ? 'bg-accent-primary text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Company Info
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'branches'
                ? 'bg-accent-primary text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Branches
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {activeTab === 'company' ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleCompanySubmit(onCompanySubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  {...registerCompany('name')}
                  className="input"
                  placeholder="Enter company name"
                />
                {companyErrors.name && (
                  <p className="text-sm text-red-600">{companyErrors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  {...registerCompany('address')}
                  className="input"
                  placeholder="Enter address"
                />
                {companyErrors.address && (
                  <p className="text-sm text-red-600">{companyErrors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...registerCompany('city')}
                  className="input"
                  placeholder="Enter city"
                />
                {companyErrors.city && (
                  <p className="text-sm text-red-600">{companyErrors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  {...registerCompany('state')}
                  className="input"
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  {...registerCompany('zip_code')}
                  className="input"
                  placeholder="Enter ZIP code"
                />
                {companyErrors.zip_code && (
                  <p className="text-sm text-red-600">{companyErrors.zip_code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  {...registerCompany('country')}
                  className="input"
                  placeholder="Enter country"
                />
                {companyErrors.country && (
                  <p className="text-sm text-red-600">{companyErrors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  {...registerCompany('phone_number')}
                  className="input"
                  placeholder="Enter phone number"
                />
                {companyErrors.phone_number && (
                  <p className="text-sm text-red-600">{companyErrors.phone_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...registerCompany('email')}
                  className="input"
                  placeholder="Enter email"
                />
                {companyErrors.email && (
                  <p className="text-sm text-red-600">{companyErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  {...registerCompany('website')}
                  className="input"
                  placeholder="Enter website"
                />
                {companyErrors.website && (
                  <p className="text-sm text-red-600">{companyErrors.website.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tax ID
                </label>
                <input
                  {...registerCompany('tax_id')}
                  className="input"
                  placeholder="Enter tax ID"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCompanySubmitting}
                className="btn-primary"
              >
                {isCompanySubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => openBranchModal()}
              className="btn-primary"
            >
              Add Branch
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {branch.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {branch.city}, {branch.state}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {managers.find(m => m.id === branch.manager_id)?.name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => openBranchModal(branch)}
                        className="text-accent-primary hover:text-accent-primary-hover"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div 
            className="bg-white p-6 rounded-md max-w-800px w-90% max-h-90vh overflow-y-auto"
          >
            <div className="flex justify-end mb-6">
              <button
                onClick={closeModal}
                className="btn-ghost"
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleBranchSubmit(onBranchSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Branch Name
                </label>
                <input
                  {...registerBranch('name')}
                  className="input"
                  placeholder="Enter branch name"
                />
                {branchErrors.name && (
                  <p className="text-sm text-red-600">{branchErrors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  {...registerBranch('address')}
                  className="input"
                  placeholder="Enter address"
                />
                {branchErrors.address && (
                  <p className="text-sm text-red-600">{branchErrors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...registerBranch('city')}
                  className="input"
                  placeholder="Enter city"
                />
                {branchErrors.city && (
                  <p className="text-sm text-red-600">{branchErrors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  {...registerBranch('state')}
                  className="input"
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  {...registerBranch('zip_code')}
                  className="input"
                  placeholder="Enter ZIP code"
                />
                {branchErrors.zip_code && (
                  <p className="text-sm text-red-600">{branchErrors.zip_code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  {...registerBranch('country')}
                  className="input"
                  placeholder="Enter country"
                />
                {branchErrors.country && (
                  <p className="text-sm text-red-600">{branchErrors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  {...registerBranch('phone_number')}
                  className="input"
                  placeholder="Enter phone number"
                />
                {branchErrors.phone_number && (
                  <p className="text-sm text-red-600">{branchErrors.phone_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...registerBranch('email')}
                  className="input"
                  placeholder="Enter email"
                />
                {branchErrors.email && (
                  <p className="text-sm text-red-600">{branchErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Manager
                </label>
                <select
                  {...registerBranch('manager_id')}
                  className="input"
                >
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={closeModal}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isBranchSubmitting}
              >
                {isBranchSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySettingsPage; 