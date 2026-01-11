import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  MdSearch, 
  MdFilterList, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdShoppingCart,
  MdLaundry,
  MdNotes,
  MdArrowDropDown,
  MdArrowBack,
  MdSave,
  MdClose,
  MdRefresh,
  MdMoreVert,
  MdCheck,
  MdLabel,
  MdOutlineSort,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
  MdOutlineFilterAlt,
  MdDelete as MdDeleteOutline,
  MdMail,
  MdOutlineLocalPrintshop,
  MdOutlineDownload
} from 'react-icons/md';

// Extended mock data for customers with more attributes for filtering
const mockCustomers = [
  {
    id: '1',
    name: 'Hotel Panorama',
    code: 'HP001',
    category: 'Premium',
    categoryId: '1',
    contact: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'contato@hotelpanorama.com',
    address: 'Av. Paulista, 1000, São Paulo, SP',
    lastOrder: '2023-10-15',
    totalOrders: 48,
    totalSpent: 12450.75,
    status: 'active',
    orderFrequency: 'weekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['hotel', 'vip'],
    notes: 'Cliente VIP, necessita de atenção especial',
    createdAt: '2021-03-15'
  },
  {
    id: '2',
    name: 'Restaurante Sabor & Arte',
    code: 'RSA002',
    category: 'Standard',
    categoryId: '2',
    contact: 'Maria Oliveira',
    phone: '(11) 91234-5678',
    email: 'maria@saborearte.com.br',
    address: 'Rua Augusta, 500, São Paulo, SP',
    lastOrder: '2023-10-10',
    totalOrders: 36,
    totalSpent: 8760.50,
    status: 'active',
    orderFrequency: 'biweekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['restaurante', 'toalhas'],
    notes: 'Preferência por detergentes sem perfume',
    createdAt: '2021-05-20'
  },
  {
    id: '3',
    name: 'Hospital Santa Cruz',
    code: 'HSC003',
    category: 'Premium',
    categoryId: '1',
    contact: 'Dr. Roberto Santos',
    phone: '(11) 3456-7890',
    email: 'contato@hospitalsantacruz.org',
    address: 'Av. Rebouças, 3000, São Paulo, SP',
    lastOrder: '2023-10-05',
    totalOrders: 65,
    totalSpent: 15540.00,
    status: 'active',
    orderFrequency: 'daily',
    city: 'São Paulo',
    state: 'SP',
    tags: ['hospital', 'prioritário'],
    notes: 'Requer higienização hospitalar especial',
    createdAt: '2020-11-10'
  },
  {
    id: '4',
    name: 'Lavanderias Express',
    code: 'LE004',
    category: 'Economy',
    categoryId: '3',
    contact: 'Ana Sousa',
    phone: '(11) 97654-3210',
    email: 'ana@lavanderiasexpress.com',
    address: 'Rua Consolação, 250, São Paulo, SP',
    lastOrder: '2023-09-28',
    totalOrders: 24,
    totalSpent: 5800.00,
    status: 'inactive',
    orderFrequency: 'monthly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['lavanderia', 'parceria'],
    notes: 'Parceria para excesso de demanda',
    createdAt: '2022-01-05'
  },
  {
    id: '5',
    name: 'Pousada Mar Azul',
    code: 'PMA005',
    category: 'Standard',
    categoryId: '2',
    contact: 'Carlos Mendes',
    phone: '(13) 98765-4321',
    email: 'reservas@pousadamarazul.com.br',
    address: 'Av. Beira Mar, 500, Santos, SP',
    lastOrder: '2023-09-20',
    totalOrders: 30,
    totalSpent: 9300.00,
    status: 'active',
    orderFrequency: 'biweekly',
    city: 'Santos',
    state: 'SP',
    tags: ['pousada', 'praia'],
    notes: 'Demanda maior nos fins de semana',
    createdAt: '2021-08-12'
  },
  {
    id: '6',
    name: 'Academia FitLife',
    code: 'AFL006',
    category: 'Economy',
    categoryId: '3',
    contact: 'Paulo Ribeiro',
    phone: '(11) 99876-5432',
    email: 'contato@academiafit.com.br',
    address: 'Rua dos Esportes, 150, São Paulo, SP',
    lastOrder: '2023-10-02',
    totalOrders: 18,
    totalSpent: 3600.00,
    status: 'active',
    orderFrequency: 'weekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['academia', 'toalhas'],
    notes: 'Apenas toalhas e uniformes de funcionários',
    createdAt: '2022-03-17'
  },
  {
    id: '7',
    name: 'Escola Nova Geração',
    code: 'ENG007',
    category: 'Standard',
    categoryId: '2',
    contact: 'Juliana Costa',
    phone: '(11) 3567-8901',
    email: 'secretaria@novageracao.edu.br',
    address: 'Av. Educação, 1200, São Paulo, SP',
    lastOrder: '2023-09-15',
    totalOrders: 22,
    totalSpent: 6750.00,
    status: 'active',
    orderFrequency: 'monthly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['escola', 'uniforme'],
    notes: 'Uniformes escolares e toalhas de educação física',
    createdAt: '2022-01-30'
  },
  {
    id: '8',
    name: 'Clínica Bem Estar',
    code: 'CBE008',
    category: 'Premium',
    categoryId: '1',
    contact: 'Dra. Amanda Silva',
    phone: '(11) 98901-2345',
    email: 'contato@clinicabemestar.com.br',
    address: 'Rua da Saúde, 500, São Paulo, SP',
    lastOrder: '2023-10-18',
    totalOrders: 42,
    totalSpent: 10850.00,
    status: 'active',
    orderFrequency: 'weekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['clinica', 'médico', 'prioritário'],
    notes: 'Exige processo de desinfecção especializado',
    createdAt: '2021-02-28'
  },
  {
    id: '9',
    name: 'Restaurante Cantina Italiana',
    code: 'RCI009',
    category: 'Standard',
    categoryId: '2',
    contact: 'Giuseppe Rossi',
    phone: '(11) 3678-9012',
    email: 'cantina@italiana.com.br',
    address: 'Rua Itália, 345, São Paulo, SP',
    lastOrder: '2023-10-05',
    totalOrders: 28,
    totalSpent: 7200.00,
    status: 'active',
    orderFrequency: 'weekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['restaurante', 'toalhas'],
    notes: 'Toalhas de mesa decorativas precisam de cuidado especial',
    createdAt: '2021-09-05'
  },
  {
    id: '10',
    name: 'Hotel Central Plaza',
    code: 'HCP010',
    category: 'Premium',
    categoryId: '1',
    contact: 'Ricardo Almeida',
    phone: '(11) 97890-1234',
    email: 'reservas@centralplaza.com.br',
    address: 'Av. Central, 1000, São Paulo, SP',
    lastOrder: '2023-10-12',
    totalOrders: 54,
    totalSpent: 16500.00,
    status: 'active',
    orderFrequency: 'daily',
    city: 'São Paulo',
    state: 'SP',
    tags: ['hotel', 'vip', 'prioritário'],
    notes: 'Cliente principal, possui contrato de exclusividade',
    createdAt: '2020-06-15'
  },
  {
    id: '11',
    name: 'Escritório Advocacia Silva',
    code: 'EAS011',
    category: 'Economy',
    categoryId: '3',
    contact: 'Dr. Marcos Silva',
    phone: '(11) 3456-7891',
    email: 'contato@advocaciasilva.com.br',
    address: 'Av. Paulista, 1500, São Paulo, SP',
    lastOrder: '2023-09-10',
    totalOrders: 12,
    totalSpent: 2400.00,
    status: 'inactive',
    orderFrequency: 'monthly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['escritório', 'corporativo'],
    notes: 'Apenas toalhas de banheiro e panos de copa',
    createdAt: '2022-05-10'
  },
  {
    id: '12',
    name: 'Padaria Bom Pão',
    code: 'PBP012',
    category: 'Economy',
    categoryId: '3',
    contact: 'Antonio Ferreira',
    phone: '(11) 98765-4322',
    email: 'contato@bompao.com.br',
    address: 'Rua dos Padeiros, 100, São Paulo, SP',
    lastOrder: '2023-10-16',
    totalOrders: 25,
    totalSpent: 4800.00,
    status: 'active',
    orderFrequency: 'weekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['padaria', 'uniformes'],
    notes: 'Uniformes de funcionários e panos de copa',
    createdAt: '2022-02-20'
  },
  {
    id: '13',
    name: 'Salão de Beleza Encanto',
    code: 'SBE013',
    category: 'Standard',
    categoryId: '2',
    contact: 'Beatriz Santos',
    phone: '(11) 97654-3211',
    email: 'contato@salaobeatriz.com.br',
    address: 'Rua da Beleza, 250, São Paulo, SP',
    lastOrder: '2023-09-25',
    totalOrders: 20,
    totalSpent: 4200.00,
    status: 'active',
    orderFrequency: 'weekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['salão', 'toalhas'],
    notes: 'Toalhas precisam de alvejante especial',
    createdAt: '2021-11-15'
  },
  {
    id: '14',
    name: 'Condomínio Jardim das Flores',
    code: 'CJF014',
    category: 'Standard',
    categoryId: '2',
    contact: 'Fernanda Lima',
    phone: '(11) 3678-9013',
    email: 'sindico@jardimdasflores.com.br',
    address: 'Rua das Flores, 500, São Paulo, SP',
    lastOrder: '2023-10-08',
    totalOrders: 15,
    totalSpent: 5100.00,
    status: 'active',
    orderFrequency: 'biweekly',
    city: 'São Paulo',
    state: 'SP',
    tags: ['condomínio', 'uniformes'],
    notes: 'Uniformes dos funcionários e toalhas da área comum',
    createdAt: '2022-04-10'
  },
  {
    id: '15',
    name: 'Pousada Sol Nascente',
    code: 'PSN015',
    category: 'Standard',
    categoryId: '2',
    contact: 'Marina Souza',
    phone: '(13) 98765-4323',
    email: 'reservas@solnascente.com.br',
    address: 'Av. da Praia, 300, Guarujá, SP',
    lastOrder: '2023-10-01',
    totalOrders: 22,
    totalSpent: 6300.00,
    status: 'active',
    orderFrequency: 'biweekly',
    city: 'Guarujá',
    state: 'SP',
    tags: ['pousada', 'praia'],
    notes: 'Alta demanda em feriados e temporada',
    createdAt: '2021-07-05'
  }
];

// Customer type based on mock data
type Customer = typeof mockCustomers[0];

// Category translation and styling
const getCategoryBadge = (category: string) => {
  switch(category) {
    case 'regular':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Regular</span>;
    case 'heavy':
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Frequente</span>;
    case 'occasional':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Ocasional</span>;
    case 'rare':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Raro</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{category}</span>;
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const CustomersPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  
  // Basic search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    state: '',
    orderFrequency: '',
    tags: [] as string[],
    minOrders: '',
    maxOrders: '',
    minSpent: '',
    maxSpent: '',
    dateFrom: '',
    dateTo: '',
  });
  
  // Saved filters
  const [savedFilters, setSavedFilters] = useState<{name: string, filters: any}[]>([
    { name: "Clientes Premium", filters: { category: "Premium" } },
    { name: "Grandes Compradores", filters: { minOrders: "30" } },
    { name: "São Paulo", filters: { city: "São Paulo" } }
  ]);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  
  // Bulk actions
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Filter options from data (for dropdowns)
  const categoryOptions = Array.from(new Set(mockCustomers.map(c => c.category)));
  const cityOptions = Array.from(new Set(mockCustomers.map(c => c.city)));
  const stateOptions = Array.from(new Set(mockCustomers.map(c => c.state)));
  const frequencyOptions = Array.from(new Set(mockCustomers.map(c => c.orderFrequency)));
  
  // Collect all tags from customers
  const allTags = Array.from(
    new Set(
      mockCustomers.flatMap(customer => customer.tags || [])
    )
  ).sort();
  
  // Effect to sync URL params with filters
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    if (category) setFilters(prev => ({ ...prev, category }));
    if (status !== 'all') setFilterStatus(status);
    if (search) setSearchTerm(search);
    if (page > 1) setCurrentPage(page);
  }, [searchParams]);
  
  // Filter customers based on category
  useEffect(() => {
    if (categoryId) {
      setFilteredCustomers(customers.filter(customer => customer.categoryId === categoryId));
    } else {
      setFilteredCustomers(customers);
    }
  }, [categoryId, customers]);
  
  // Apply search and filters
  useEffect(() => {
    let result = customers;
    
    // Filter by category if present in URL
    if (categoryId) {
      result = result.filter(customer => customer.categoryId === categoryId);
    }
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.notes && customer.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(customer => customer.status === filterStatus);
    }
    
    // Apply advanced filters
    if (filters.category) {
      result = result.filter(customer => customer.category === filters.category);
    }
    
    if (filters.city) {
      result = result.filter(customer => customer.city === filters.city);
    }
    
    if (filters.state) {
      result = result.filter(customer => customer.state === filters.state);
    }
    
    if (filters.orderFrequency) {
      result = result.filter(customer => customer.orderFrequency === filters.orderFrequency);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(customer => 
        filters.tags.some(tag => customer.tags && customer.tags.includes(tag))
      );
    }
    
    if (filters.minOrders) {
      const min = parseInt(filters.minOrders);
      result = result.filter(customer => customer.totalOrders >= min);
    }
    
    if (filters.maxOrders) {
      const max = parseInt(filters.maxOrders);
      result = result.filter(customer => customer.totalOrders <= max);
    }
    
    if (filters.minSpent) {
      const min = parseFloat(filters.minSpent);
      result = result.filter(customer => customer.totalSpent >= min);
    }
    
    if (filters.maxSpent) {
      const max = parseFloat(filters.maxSpent);
      result = result.filter(customer => customer.totalSpent <= max);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(customer => new Date(customer.lastOrder) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(customer => new Date(customer.lastOrder) <= toDate);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'lastOrder') {
        return sortOrder === 'asc'
          ? new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime()
          : new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
      } else if (sortBy === 'totalOrders') {
        return sortOrder === 'asc'
          ? a.totalOrders - b.totalOrders
          : b.totalOrders - a.totalOrders;
      } else if (sortBy === 'totalSpent') {
        return sortOrder === 'asc'
          ? a.totalSpent - b.totalSpent
          : b.totalSpent - a.totalSpent;
      }
      return 0;
    });
    
    setFilteredCustomers(result);
    
    // Reset to first page when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    
  }, [categoryId, customers, searchTerm, filterStatus, sortBy, sortOrder, filters, currentPage]);
  
  // Update URL with filters
  const updateUrlWithFilters = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (filters.category) params.set('category', filters.category);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  };
  
  // Call updateUrlWithFilters when filters change
  useEffect(() => {
    updateUrlWithFilters();
  }, [searchTerm, filterStatus, filters.category, currentPage]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagToggle = (tag) => {
    setFilters(prev => {
      const currentTags = [...prev.tags];
      const tagIndex = currentTags.indexOf(tag);
      
      if (tagIndex >= 0) {
        currentTags.splice(tagIndex, 1);
      } else {
        currentTags.push(tag);
      }
      
      return { ...prev, tags: currentTags };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      state: '',
      orderFrequency: '',
      tags: [],
      minOrders: '',
      maxOrders: '',
      minSpent: '',
      maxSpent: '',
      dateFrom: '',
      dateTo: '',
    });
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };
  
  const saveCurrentFilters = () => {
    if (!newFilterName.trim()) return;
    
    const newSavedFilter = {
      name: newFilterName,
      filters: {
        ...filters,
        searchTerm,
        filterStatus,
        sortBy,
        sortOrder
      }
    };
    
    setSavedFilters([...savedFilters, newSavedFilter]);
    setNewFilterName('');
    setShowSaveFilterModal(false);
  };
  
  const loadSavedFilter = (savedFilter) => {
    setFilters({
      ...filters,
      ...savedFilter.filters
    });
    
    if (savedFilter.filters.searchTerm) {
      setSearchTerm(savedFilter.filters.searchTerm);
    }
    
    if (savedFilter.filters.filterStatus) {
      setFilterStatus(savedFilter.filters.filterStatus);
    }
    
    if (savedFilter.filters.sortBy) {
      setSortBy(savedFilter.filters.sortBy);
    }
    
    if (savedFilter.filters.sortOrder) {
      setSortOrder(savedFilter.filters.sortOrder);
    }
  };
  
  const deleteSavedFilter = (index) => {
    const newSavedFilters = [...savedFilters];
    newSavedFilters.splice(index, 1);
    setSavedFilters(newSavedFilters);
  };
  
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);
  
  // Bulk actions
  const toggleSelectCustomer = (id) => {
    setSelectedCustomers(prev => {
      if (prev.includes(id)) {
        return prev.filter(customerId => customerId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const toggleSelectAll = () => {
    if (selectedCustomers.length === currentItems.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentItems.map(customer => customer.id));
    }
  };
  
  const handleBulkDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedCustomers.length} clientes selecionados?`)) {
      setCustomers(prev => prev.filter(customer => !selectedCustomers.includes(customer.id)));
      setSelectedCustomers([]);
    }
  };
  
  const handleBulkStatusChange = (status) => {
    setCustomers(prev => 
      prev.map(customer => 
        selectedCustomers.includes(customer.id) 
          ? { ...customer, status } 
          : customer
      )
    );
    setSelectedCustomers([]);
  };
  
  const handleBulkExport = () => {
    // Mock export - in a real app, this would generate a CSV/Excel file
    const selectedData = customers.filter(customer => selectedCustomers.includes(customer.id));
    console.log('Exporting data:', selectedData);
    alert(`Exportando ${selectedData.length} clientes`);
    setSelectedCustomers([]);
  };
  
  const handleBulkEmail = () => {
    // Mock email functionality
    alert(`Preparando email para ${selectedCustomers.length} clientes`);
    setSelectedCustomers([]);
  };
  
  const handleAddCustomer = () => {
    navigate('/stores/customers/add');
  };
  
  const handleViewCustomer = (id) => {
    navigate(`/stores/customers/view/${id}`);
  };
  
  const handleEditCustomer = (id, e) => {
    e.stopPropagation();
    navigate(`/stores/customers/edit/${id}`);
  };
  
  const handleDeleteCustomer = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer.id !== id)
      );
    }
  };
  
  const handleManageCategories = () => {
    navigate('/stores/customers/categories');
  };
  
  const handleBackToAllCustomers = () => {
    navigate('/stores/customers');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        {categoryId ? (
          <button 
            onClick={handleBackToAllCustomers}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <MdArrowBack className="mr-1" /> Voltar para todos os clientes
          </button>
        ) : (
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Clientes</h1>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={handleManageCategories}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
          >
            Gerenciar Categorias
          </button>
          <button
            onClick={handleAddCustomer}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <MdAdd className="mr-1" /> Adicionar Cliente
          </button>
        </div>
      </div>
      
      {/* Bulk Actions Bar - Shows when customers are selected */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium mr-2">{selectedCustomers.length} clientes selecionados</span>
            <button 
              onClick={() => setSelectedCustomers([])}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Limpar seleção
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleBulkExport}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition duration-200 flex items-center"
            >
              <MdOutlineDownload className="mr-1" /> Exportar
            </button>
            <button
              onClick={handleBulkEmail}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition duration-200 flex items-center"
            >
              <MdMail className="mr-1" /> Email
            </button>
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition duration-200"
            >
              Ativar
            </button>
            <button
              onClick={() => handleBulkStatusChange('inactive')}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition duration-200"
            >
              Inativar
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition duration-200 flex items-center"
            >
              <MdDeleteOutline className="mr-1" /> Excluir
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="flex flex-grow max-w-xl mb-4 md:mb-0">
            <div className="relative flex-grow mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar clientes por nome, código, contato ou email..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 text-sm rounded-md flex items-center ${showAdvancedFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              <MdOutlineFilterAlt className="mr-1" /> Filtros
            </button>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <button 
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
                onClick={() => setFilterStatus(filterStatus === 'all' ? 'active' : 'all')}
              >
                {filterStatus === 'all' ? 'Todos os Status' : filterStatus === 'active' ? 'Ativos' : 'Inativos'}
                <MdArrowDropDown className="ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Advanced filters panel */}
        {showAdvancedFilters && (
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Filtros Avançados</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <button 
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md flex items-center"
                    onClick={() => setShowSaveFilterModal(true)}
                  >
                    <MdSave className="mr-1" /> Salvar Filtro
                  </button>
                  
                  {/* Saved filters dropdown */}
                  {savedFilters.length > 0 && (
                    <div className="relative ml-2 inline-block">
                      <select
                        className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            loadSavedFilter(savedFilters[parseInt(e.target.value)]);
                          }
                        }}
                        value=""
                      >
                        <option value="" disabled>Filtros salvos</option>
                        {savedFilters.map((filter, index) => (
                          <option key={index} value={index}>{filter.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <MdArrowDropDown />
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas as Categorias</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* City filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas as Cidades</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              {/* State filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os Estados</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              {/* Order Frequency filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência de Pedidos
                </label>
                <select
                  value={filters.orderFrequency}
                  onChange={(e) => handleFilterChange('orderFrequency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas as Frequências</option>
                  {frequencyOptions.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency === 'daily' ? 'Diária' : 
                       frequency === 'weekly' ? 'Semanal' : 
                       frequency === 'biweekly' ? 'Quinzenal' : 
                       frequency === 'monthly' ? 'Mensal' : frequency}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Total Orders Range */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pedidos Mín
                  </label>
                  <input
                    type="number"
                    value={filters.minOrders}
                    onChange={(e) => handleFilterChange('minOrders', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pedidos Máx
                  </label>
                  <input
                    type="number"
                    value={filters.maxOrders}
                    onChange={(e) => handleFilterChange('maxOrders', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              {/* Total Spent Range */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gasto Mín
                  </label>
                  <input
                    type="number"
                    value={filters.minSpent}
                    onChange={(e) => handleFilterChange('minSpent', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="R$ Min"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gasto Máx
                  </label>
                  <input
                    type="number"
                    value={filters.maxSpent}
                    onChange={(e) => handleFilterChange('maxSpent', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="R$ Max"
                  />
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Último Pedido (De)
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Último Pedido (Até)
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Results summary */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Mostrando {currentItems.length} de {filteredCustomers.length} clientes
            {(searchTerm || Object.values(filters).some(v => v && (typeof v === 'string' ? v !== '' : v.length > 0))) && 
              ' com os filtros aplicados'}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Ordenar por:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md p-1"
            >
              <option value="name">Nome</option>
              <option value="lastOrder">Último Pedido</option>
              <option value="totalOrders">Total de Pedidos</option>
              <option value="totalSpent">Valor Total</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              {sortOrder === 'asc' ? <MdArrowDropDown size={20} /> : <MdArrowDropDown style={{ transform: 'rotate(180deg)' }} size={20} />}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Nome/Código
                  {sortBy === 'name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastOrder')}
                >
                  Último Pedido
                  {sortBy === 'lastOrder' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalOrders')}
                >
                  Total Pedidos
                  {sortBy === 'totalOrders' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewCustomer(customer.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${customer.category === 'Premium' ? 'bg-purple-100 text-purple-800' : 
                        customer.category === 'Standard' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {customer.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.contact}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => handleEditCustomer(customer.id, e)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCustomer(customer.id, e)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage; 