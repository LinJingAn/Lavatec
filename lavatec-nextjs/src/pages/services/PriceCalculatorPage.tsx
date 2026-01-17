import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MdArrowBack,
  MdCalculate,
  MdAddShoppingCart,
  MdInfo,
  MdCheckCircle,
  MdShoppingCart,
  MdWarning,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import { ServiceType, mockServiceTypes, getCategoryName } from '../../models/ServiceTypes';
import {
  GarmentType,
  PriceMatrixEntry,
  PricingRule,
  PriceCalculatorInput,
  PriceCalculatorResult,
  mockGarmentTypes,
  mockPriceMatrix,
  mockPricingRules,
  calculatePrice,
  AppliedRule
} from '../../models/PricingTable';
import { formatCurrency } from '../../lib/utils';

const PriceCalculatorPage: React.FC = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isExpress, setIsExpress] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<PriceCalculatorResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      const serviceData = mockServiceTypes;
      const garmentData = mockGarmentTypes;
      const priceMatrixData = mockPriceMatrix;
      const rulesData = mockPricingRules;
      
      setServices(serviceData);
      setGarmentTypes(garmentData);
      setPriceMatrix(priceMatrixData);
      setPricingRules(rulesData);
      
      if (serviceData.length > 0) {
        setSelectedServiceId(serviceData[0].id);
      }
      
      if (garmentData.length > 0) {
        setSelectedGarmentId(garmentData[0].id);
      }
      
      setIsLoading(false);
    }, 800);
  }, []);

  // Calculate price
  const handleCalculate = () => {
    if (!selectedServiceId || !selectedGarmentId || quantity <= 0) return;
    
    const service = services.find(s => s.id === selectedServiceId);
    const garment = garmentTypes.find(g => g.id === selectedGarmentId);
    
    if (!service || !garment) return;
    
    const input: PriceCalculatorInput = {
      serviceTypeId: selectedServiceId,
      garmentTypeId: selectedGarmentId,
      quantity,
      isExpress,
      priceMatrix,
      pricingRules,
      serviceTypes: services,
      garmentTypes
    };
    
    const result = calculatePrice(input);
    setCalculationResult(result);
    setShowBreakdown(true);
    setAddedToCart(false);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!calculationResult) return;
    
    // Simulate adding to cart
    console.log('Adding to cart:', {
      serviceTypeId: selectedServiceId,
      garmentTypeId: selectedGarmentId,
      quantity,
      isExpress,
      price: calculationResult.totalPrice
    });
    
    setAddedToCart(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  // Helper to get base price from matrix
  const getBasePrice = (serviceId: string, garmentId: string): number | null => {
    const entry = priceMatrix.find(
      e => e.serviceTypeId === serviceId && e.garmentTypeId === garmentId
    );
    return entry ? entry.basePrice : null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/services/pricing" className="mr-4 text-gray-600 hover:text-gray-800">
          <MdArrowBack className="text-2xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdCalculate className="mr-2 text-blue-600" />
            Calculadora de Preços
          </h1>
          <p className="text-gray-600">
            Simule o valor de serviços com base no tipo, quantidade e opções
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Input panel */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Detalhes do Serviço</h2>
          
          <div className="space-y-4">
            {/* Service selection */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Serviço
              </label>
              <select
                id="service"
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setCalculationResult(null); // Reset result on change
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {getCategoryName(service.categoryId)}
                  </option>
                ))}
              </select>
              
              {selectedServiceId && (
                <p className="mt-1 text-sm text-gray-500">
                  {services.find(s => s.id === selectedServiceId)?.description || ''}
                </p>
              )}
            </div>
            
            {/* Garment selection */}
            <div>
              <label htmlFor="garment" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Peça
              </label>
              <select
                id="garment"
                value={selectedGarmentId}
                onChange={(e) => {
                  setSelectedGarmentId(e.target.value);
                  setCalculationResult(null); // Reset result on change
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                {garmentTypes.map((garment) => (
                  <option key={garment.id} value={garment.id}>
                    {garment.name}
                  </option>
                ))}
              </select>
              
              {selectedGarmentId && (
                <p className="mt-1 text-sm text-gray-500">
                  {garmentTypes.find(g => g.id === selectedGarmentId)?.description || ''}
                </p>
              )}
            </div>
            
            {/* Quantity input */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                  setCalculationResult(null); // Reset result on change
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Express option */}
            <div className="flex items-center">
              <input
                id="express"
                type="checkbox"
                checked={isExpress}
                onChange={(e) => {
                  setIsExpress(e.target.checked);
                  setCalculationResult(null); // Reset result on change
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="express" className="ml-2 block text-sm text-gray-700">
                Serviço Expresso (entrega rápida)
              </label>
            </div>
            
            {/* Base price info */}
            {selectedServiceId && selectedGarmentId && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Preço base por unidade:</span>
                  <span className="font-medium">
                    {getBasePrice(selectedServiceId, selectedGarmentId) 
                      ? formatCurrency(getBasePrice(selectedServiceId, selectedGarmentId)!) 
                      : 'Não disponível'}
                  </span>
                </div>
                
                {services.find(s => s.id === selectedServiceId)?.hasExpressOption && isExpress && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Taxa para serviço expresso:</span>
                    <span className="font-medium text-amber-600">+50%</span>
                  </div>
                )}
                
                {quantity >= 10 && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Desconto por volume (10+ peças):</span>
                    <span className="font-medium text-green-600">-10%</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Calculate button */}
            <button
              onClick={handleCalculate}
              disabled={!selectedServiceId || !selectedGarmentId || quantity <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md 
                         flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <MdCalculate className="mr-2" />
              Calcular Preço
            </button>
          </div>
        </div>
        
        {/* Results panel */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Resultados do Cálculo</h2>
          
          {!calculationResult ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MdInfo className="text-gray-300 text-6xl mb-2" />
              <p className="text-lg font-medium text-gray-500">Escolha as opções e calcule o preço</p>
              <p className="text-sm text-gray-500 mt-1">
                O resultado aparecerá aqui após o cálculo
              </p>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Resumo</h3>
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showBreakdown ? <MdExpandLess className="mr-2" /> : <MdExpandMore className="mr-2" />}
                  </button>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">
                    {services.find(s => s.id === selectedServiceId)?.name}
                  </span>
                  <span>{formatCurrency(calculationResult.basePrice)} × {quantity}</span>
                </div>
                
                {showBreakdown && (
                  <div className="border-t border-gray-200 pt-2 mt-2 text-sm">
                    {calculationResult.appliedRules.map((rule: AppliedRule, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-gray-600">{rule.description}</span>
                        <span className={rule.impact < 0 ? 'text-green-600' : 'text-amber-600'}>
                          {rule.impact > 0 ? '+' : ''}{rule.impact}%
                        </span>
                      </div>
                    ))}
                    
                    {isExpress && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Serviço Expresso</span>
                        <span className="text-amber-600">+50%</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Preço Unitário Ajustado</span>
                    <span className="font-medium">{formatCurrency(calculationResult.adjustedPrice)}</span>
                  </div>
                  
                  {quantity > 1 && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">Subtotal ({quantity} {quantity === 1 ? 'item' : 'itens'})</span>
                      <span className="font-medium">{formatCurrency(calculationResult.subtotal)}</span>
                    </div>
                  )}
                  
                  {calculationResult.volumeDiscount > 0 && (
                    <div className="flex justify-between items-center mt-1 text-green-600">
                      <span>Desconto por volume</span>
                      <span>-{formatCurrency(calculationResult.volumeDiscount)}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Preço Total</span>
                    <span>{formatCurrency(calculationResult.totalPrice)}</span>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-500">
                    {services.find(s => s.id === selectedServiceId)?.processingTimeHours && (
                      <div className="flex items-center">
                        <MdInfo className="mr-1" />
                        Tempo estimado de processamento: {
                          isExpress 
                            ? `${Math.ceil(services.find(s => s.id === selectedServiceId)!.processingTimeHours / 2)} horas (expresso)` 
                            : `${services.find(s => s.id === selectedServiceId)!.processingTimeHours} horas`
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`flex-1 ${
                    addedToCart 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white py-2.5 px-4 rounded-md 
                  flex items-center justify-center disabled:cursor-default`}
                >
                  {addedToCart ? (
                    <>
                      <MdCheckCircle className="mr-2" />
                      Adicionado ao Carrinho
                    </>
                  ) : (
                    <>
                      <MdAddShoppingCart className="mr-2" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    // Go to cart page - would normally link to cart
                    console.log('Go to cart');
                  }}
                  className="flex-1 md:flex-none border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
                           py-2.5 px-4 rounded-md flex items-center justify-center"
                >
                  <MdShoppingCart className="mr-2" />
                  Ver Carrinho
                </button>
              </div>
            </div>
          )}
          
          {/* Special notes */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-start text-sm text-gray-600">
              <MdWarning className="flex-shrink-0 mt-0.5 mr-2 text-amber-500" />
              <p>
                Este é apenas um cálculo estimado para fins de simulação. O preço final pode variar 
                de acordo com condições especiais, promoções ativas ou outras características específicas 
                das peças após avaliação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculatorPage; 