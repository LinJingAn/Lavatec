import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdSave, 
  MdEdit, 
  MdClose, 
  MdSearch, 
  MdFilterList,
  MdAddCircleOutline, 
  MdHistory, 
  MdOutlineDryCleaning, 
  MdCalculate,
  MdUpload
} from 'react-icons/md';
import { 
  ServiceType, 
  ServiceCategory,
  mockServiceTypes,
  getCategoryName
} from '../../models/ServiceTypes';
import {
  GarmentType,
  PriceMatrixEntry,
  mockGarmentTypes,
  mockPriceMatrix
} from '../../models/PricingTable';
import { formatCurrency } from '../../lib/utils';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const PricingMatrixPage: React.FC = () => {
  console.log('PricingMatrixPage rendering');
  
  const [services, setServices] = useState<ServiceType[]>([]);
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>([]);
  const [filteredGarmentTypes, setFilteredGarmentTypes] = useState<GarmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | ''>('');
  const [garmentCategoryFilter, setGarmentCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Fetch data
  useEffect(() => {
    console.log('PricingMatrixPage useEffect running');
    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      console.log('Loading mock data');
      const serviceData = mockServiceTypes;
      const garmentData = mockGarmentTypes;
      const priceData = mockPriceMatrix;
      
      setServices(serviceData);
      setFilteredServices(serviceData);
      setGarmentTypes(garmentData);
      setFilteredGarmentTypes(garmentData);
      setPriceMatrix(priceData);
      setIsLoading(false);
      console.log('Data loaded successfully');
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filteredServs = [...services];
    let filteredGarments = [...garmentTypes];
    
    // Service search and category filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredServs = filteredServs.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
      
      filteredGarments = filteredGarments.filter(garment =>
        garment.name.toLowerCase().includes(query) ||
        (garment.description && garment.description.toLowerCase().includes(query))
      );
    }
    
    if (categoryFilter) {
      filteredServs = filteredServs.filter(service => service.categoryId === categoryFilter);
    }
    
    if (garmentCategoryFilter) {
      filteredGarments = filteredGarments.filter(garment => garment.category === garmentCategoryFilter);
    }
    
    setFilteredServices(filteredServs);
    setFilteredGarmentTypes(filteredGarments);
  }, [services, garmentTypes, searchQuery, categoryFilter, garmentCategoryFilter]);

  // Get price for a specific service/garment combination
  const getPrice = (serviceId: string, garmentId: string): number => {
    const editKey = `${serviceId}-${garmentId}`;
    
    // If we're in edit mode and this price has been edited, return the edited value
    if (editMode && editedPrices[editKey] !== undefined) {
      return editedPrices[editKey];
    }
    
    // Otherwise look it up in the price matrix
    const entry = priceMatrix.find(
      entry => entry.serviceTypeId === serviceId && entry.garmentTypeId === garmentId && entry.isActive
    );
    
    return entry ? entry.basePrice : 0;
  };

  // Handle price edit
  const handlePriceChange = (serviceId: string, garmentId: string, value: string) => {
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setEditedPrices(prev => ({
        ...prev,
        [`${serviceId}-${garmentId}`]: numValue
      }));
    }
  };

  // Save edited prices
  const handleSaveChanges = () => {
    // In a real app, this would send updates to the API
    
    // Update the price matrix with edited values
    const updatedMatrix = [...priceMatrix];
    
    Object.entries(editedPrices).forEach(([key, price]) => {
      const [serviceId, garmentId] = key.split('-');
      
      // Find existing entry or create a new one
      const existingEntryIndex = updatedMatrix.findIndex(
        entry => entry.serviceTypeId === serviceId && entry.garmentTypeId === garmentId
      );
      
      if (existingEntryIndex >= 0) {
        // Update existing entry
        updatedMatrix[existingEntryIndex] = {
          ...updatedMatrix[existingEntryIndex],
          basePrice: price,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Create new entry
        updatedMatrix.push({
          id: `${serviceId}-${garmentId}`,
          serviceTypeId: serviceId,
          garmentTypeId: garmentId,
          basePrice: price,
          expressMultiplier: 1.5,
          processingTimeHours: 24,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });
    
    setPriceMatrix(updatedMatrix);
    setEditedPrices({});
    setEditMode(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedPrices({});
    setEditMode(false);
  };

  // Handle checkbox changes
  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value as ServiceCategory | '');
  };

  const handleGarmentCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGarmentCategoryFilter(e.target.value);
  };

  // Get unique garment categories
  const getGarmentCategories = (): string[] => {
    const categories = garmentTypes.map(garment => garment.category);
    return [...new Set(categories)];
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setGarmentCategoryFilter('');
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-blue-600" />
            Tabela de Preços
          </h1>
          <p className="text-gray-600">Gerencie os preços dos serviços por tipo de peça</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <MdCalculate className="mr-1" /> Calculadora
          </button>
          
          <Link
            to="/services/pricing/history"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <MdHistory className="mr-1" /> Histórico
          </Link>
          
          <Link
            to="/services/pricing/bulk-update"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <MdUpload className="mr-1" /> Atualização em Massa
          </Link>
          
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MdEdit className="mr-1" /> Editar Preços
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <MdClose className="mr-1" /> Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <MdSave className="mr-1" /> Salvar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar serviços ou tipos de peças..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <MdFilterList className="mr-1" /> Filtros
            </button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4">
                <h3 className="font-medium text-gray-700 mb-2">Filtrar por</h3>
                
                {/* Category filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria de Serviço
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as categorias</option>
                    <option value="laundry">Lavanderia</option>
                    <option value="drycleaning">Lavagem a Seco</option>
                    <option value="ironing">Passadoria</option>
                    <option value="special">Tratamentos Especiais</option>
                    <option value="household">Itens Domésticos</option>
                  </select>
                </div>
                
                {/* Garment Category filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria de Peça
                  </label>
                  <select
                    value={garmentCategoryFilter}
                    onChange={handleGarmentCategoryFilterChange}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as categorias</option>
                    {getGarmentCategories().map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Active filters */}
        {(searchQuery || categoryFilter || garmentCategoryFilter) && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="text-gray-500">Filtros ativos:</span>
            
            {searchQuery && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Busca: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {categoryFilter && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Categoria: {getCategoryName(categoryFilter as ServiceCategory)}
                <button 
                  onClick={() => setCategoryFilter('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {garmentCategoryFilter && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Tipo de Peça: {garmentCategoryFilter}
                <button 
                  onClick={() => setGarmentCategoryFilter('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price Calculator Section - conditional rendering */}
      {showCalculator && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Calculadora de Preços</h2>
          <PriceCalculator services={services} garmentTypes={garmentTypes} getPrice={getPrice} />
        </div>
      )}

      {/* Price Matrix */}
      <div className="bg-white rounded-lg shadow-md overflow-auto mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Matriz de Preços</h2>
          <p className="text-sm text-gray-500">Preços para cada combinação de serviço e tipo de peça</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                  Serviço / Peça
                </th>
                {filteredGarmentTypes.map((garment) => (
                  <th 
                    key={garment.id} 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                  >
                    <div className="flex flex-col">
                      <span>{garment.name}</span>
                      <span className="text-gray-400 normal-case">{garment.category}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap sticky left-0 bg-white border-r z-10">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-xs text-gray-500">{getCategoryName(service.categoryId)}</div>
                  </td>
                  {filteredGarmentTypes.map((garment) => {
                    const price = getPrice(service.id, garment.id);
                    const editKey = `${service.id}-${garment.id}`;
                    
                    return (
                      <td key={garment.id} className="px-4 py-4 whitespace-nowrap">
                        {editMode ? (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editedPrices[editKey] !== undefined ? editedPrices[editKey] : price}
                            onChange={(e) => handlePriceChange(service.id, garment.id, e.target.value)}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                          />
                        ) : (
                          <div className="text-sm text-right">
                            {price > 0 ? formatCurrency(price) : '-'}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Price Calculator Component
interface PriceCalculatorProps {
  services: ServiceType[];
  garmentTypes: GarmentType[];
  getPrice: (serviceId: string, garmentId: string) => number;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ services, garmentTypes, getPrice }) => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedGarment, setSelectedGarment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isRush, setIsRush] = useState(false);
  const [rushHours, setRushHours] = useState<6 | 12>(12);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [adjustments, setAdjustments] = useState<{name: string; amount: number}[]>([]);

  const handleCalculate = () => {
    if (!selectedService || !selectedGarment) return;
    
    // Get base price
    const unitPrice = getPrice(selectedService, selectedGarment);
    const total = unitPrice * quantity;
    setBasePrice(total);
    
    // Apply rush fee if applicable
    let rushFee = 0;
    if (isRush) {
      if (rushHours === 6) {
        rushFee = total * 1.0; // 100% rush fee for 6-hour service
      } else {
        rushFee = total * 0.5; // 50% rush fee for 12-hour service
      }
    }
    
    // Apply bulk discount if applicable
    let bulkDiscount = 0;
    if (quantity >= 30) {
      bulkDiscount = total * 0.2; // 20% discount for 30+ items
    } else if (quantity >= 10) {
      bulkDiscount = total * 0.1; // 10% discount for 10+ items
    }
    
    // Set adjustments
    const newAdjustments = [];
    if (rushFee > 0) {
      newAdjustments.push({
        name: `Taxa de Urgência (${rushHours}h)`,
        amount: rushFee
      });
    }
    if (bulkDiscount > 0) {
      newAdjustments.push({
        name: 'Desconto por Volume',
        amount: -bulkDiscount
      });
    }
    setAdjustments(newAdjustments);
    
    // Calculate final price
    const final = total + rushFee - bulkDiscount;
    setCalculatedPrice(final);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serviço
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({getCategoryName(service.categoryId)})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Peça
          </label>
          <select
            value={selectedGarment}
            onChange={(e) => setSelectedGarment(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um tipo de peça</option>
            {garmentTypes.map((garment) => (
              <option key={garment.id} value={garment.id}>
                {garment.name} ({garment.category})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rushService"
              checked={isRush}
              onChange={(e) => setIsRush(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rushService" className="ml-2 block text-sm text-gray-700">
              Serviço Expresso
            </label>
          </div>
          
          {isRush && (
            <div className="mt-2 pl-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rush12"
                    name="rushHours"
                    checked={rushHours === 12}
                    onChange={() => setRushHours(12)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="rush12" className="ml-2 block text-sm text-gray-700">
                    12 horas (+50%)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rush6"
                    name="rushHours"
                    checked={rushHours === 6}
                    onChange={() => setRushHours(6)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="rush6" className="ml-2 block text-sm text-gray-700">
                    6 horas (+100%)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={handleCalculate}
          disabled={!selectedService || !selectedGarment}
          className={`w-full px-4 py-2 ${
            !selectedService || !selectedGarment
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-md flex items-center justify-center`}
        >
          <MdCalculate className="mr-1" /> Calcular Preço
        </button>
      </div>
      
      <div className={`bg-gray-50 rounded-md p-6 ${calculatedPrice === null ? 'flex items-center justify-center' : ''}`}>
        {calculatedPrice === null ? (
          <div className="text-center text-gray-500">
            <MdCalculate className="text-5xl mx-auto mb-2" />
            <p>Selecione os parâmetros e clique em Calcular Preço para ver o resultado</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium mb-4">Resultado do Cálculo</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Preço Base:</span>
                <span>{formatCurrency(basePrice || 0)}</span>
              </div>
              
              {adjustments.map((adj, index) => (
                <div key={index} className="flex justify-between border-t pt-1">
                  <span>{adj.name}:</span>
                  <span className={adj.amount < 0 ? 'text-green-600' : 'text-red-600'}>
                    {adj.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(adj.amount))}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold">
                <span>Preço Final:</span>
                <span>{formatCurrency(calculatedPrice)}</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                * Preços sujeitos a alterações. Descontos adicionais podem ser aplicados para clientes cadastrados.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Make sure we're exporting the component properly
console.log('PricingMatrixPage is being exported');
export default PricingMatrixPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 