import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOrderNumber } from '../../models/LaundryOrder';
import { 
  MdArrowBack, 
  MdAdd, 
  MdDelete, 
  MdOutlineCalendarToday, 
  MdAccessTime, 
  MdPerson, 
  MdPhotoCamera, 
  MdQrCode, 
  MdAttachMoney, 
  MdEdit, 
  MdNotes,
  MdLocalShipping,
  MdLocationOn,
  MdNotifications
} from 'react-icons/md';

const AddOrderPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ 
      name: '', 
      category: 'dry-cleaning', 
      quantity: 1, 
      price: 0,
      specialInstructions: '',
      barcode: '',
      photos: [] as string[],
      defectPhotos: [] as string[],
      priceAdjustment: {
        amount: 0,
        reason: '',
        isDiscount: true
      }
    }],
    notes: '',
    internalNotes: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'card',
    tipPercentage: 15,
    tracking: {
      enableTracking: true,
      sendNotifications: true,
      notificationChannel: 'sms',
      estimatedHours: 24
    }
  });

  // Refs for file inputs
  const photoInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const defectPhotoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle item changes
  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Handle nested object changes (for price adjustment)
  const handleNestedItemChange = (index: number, nestedObject: string, field: string, value: string | boolean | number) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[nestedObject] = {
      ...(newItems[index] as any)[nestedObject],
      [field]: value
    };
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Handle file uploads for photos
  const handlePhotoUpload = (index: number, type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newItems = [...formData.items];
      if (type === 'photo') {
        newItems[index].photos = [...(newItems[index].photos || []), e.target?.result as string ?? ''];
      } else if (type === 'defect') {
        newItems[index].defectPhotos = [...(newItems[index].defectPhotos || []), e.target?.result as string ?? ''];
      }
      setFormData({
        ...formData,
        items: newItems
      });
    };
    reader.readAsDataURL(file);
  };

  // Generate barcode for an item
  const generateBarcode = (index: number) => {
    // Simple mock barcode generation - in real app would be more sophisticated
    const barcode = `LDY-${Date.now()}-${index}`;
    const newItems = [...formData.items];
    newItems[index].barcode = barcode;
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Remove a photo
  const removePhoto = (itemIndex: number, photoIndex: number, type: string) => {
    const newItems = [...formData.items];
    if (type === 'photo') {
      newItems[itemIndex].photos = newItems[itemIndex].photos.filter((_, idx) => idx !== photoIndex);
    } else if (type === 'defect') {
      newItems[itemIndex].defectPhotos = newItems[itemIndex].defectPhotos.filter((_, idx) => idx !== photoIndex);
    }
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Add new item
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { 
        name: '', 
        category: 'dry-cleaning', 
        quantity: 1, 
        price: 0,
        specialInstructions: '',
        barcode: '',
        photos: [] as string[],
        defectPhotos: [] as string[],
        priceAdjustment: {
          amount: 0,
          reason: '',
          isDiscount: true
        }
      }]
    });
  };

  // Remove item
  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  // Calculate subtotal with adjustments
  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      // Apply price adjustment if exists
      if (item.priceAdjustment?.amount) {
        itemTotal = item.priceAdjustment.isDiscount 
          ? itemTotal - item.priceAdjustment.amount 
          : itemTotal + item.priceAdjustment.amount;
      }
      return total + itemTotal;
    }, 0);
  };

  // Calculate tip
  const calculateTip = () => {
    return (calculateSubtotal() * formData.tipPercentage) / 100;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTip();
  };

  // Add tracking change handler
  const handleTrackingChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      tracking: {
        ...formData.tracking,
        [field]: value
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate tracking code if tracking is enabled
    let trackingData = {};
    if (formData.tracking.enableTracking) {
      const trackingCode = `TRK-${Date.now().toString().slice(-6)}`;
      trackingData = {
        ...formData.tracking,
        trackingCode,
        statusHistory: [
          {
            status: 'new',
            timestamp: new Date(),
            note: 'Pedido criado'
          }
        ]
      };
    }
    
    // Build order object with all the enhanced fields
    const orderData = {
      ...formData,
      tracking: trackingData,
      orderNumber: generateOrderNumber(),
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add API call to create order here
    console.log('Form submitted:', orderData);
    
    // Navigate back to orders page
    navigate('/stores/orders');
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/stores/orders')}
          className="mr-4 flex items-center text-gray-500 hover:text-gray-700"
        >
          <MdArrowBack size={20} className="mr-1" />
          <span>Voltar para Pedidos</span>
        </button>
        <h1 className="text-2xl font-semibold">Criar Novo Pedido</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Customer info and items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Informações do Cliente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineCalendarToday className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de Entrega
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdAccessTime className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="card">Cartão</option>
                    <option value="cash">Dinheiro</option>
                    <option value="transfer">Transferência</option>
                    <option value="app">App de Pagamento</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Itens do Pedido</h2>
                <button 
                  type="button" 
                  onClick={addItem}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <MdAdd size={20} className="mr-1" />
                  <span>Adicionar Item</span>
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium">Item #{index + 1}</h3>
                    {formData.items.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Item
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ex: Camisa, Calça, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <select
                        value={item.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleItemChange(index, 'category', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="dry-cleaning">Lavagem a Seco</option>
                        <option value="wash-and-fold">Lavar e Dobrar</option>
                        <option value="ironing">Passar</option>
                        <option value="alteration">Reparos</option>
                        <option value="special">Especial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, 'quantity', String(parseInt(e.target.value) || 1))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Unitário (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, 'price', String(parseFloat(e.target.value) || 0))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Instruções Especiais
                      </label>
                      <span className="text-xs text-gray-500">Opcional</span>
                    </div>
                    <textarea
                      value={item.specialInstructions}
                      onChange={(e) => handleItemChange(index, 'specialInstructions', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Instruções de processamento especiais para este item"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Fotos do Item
                        </label>
                        <span className="text-xs text-gray-500">Opcional</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.photos && item.photos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="relative">
                            <img src={photo} alt={`Item ${index} photo ${photoIndex}`} className="h-16 w-16 object-cover rounded border border-gray-300" />
                            <button 
                              type="button"
                              onClick={() => removePhoto(index, photoIndex, 'photo')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                            >
                              <MdDelete size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => photoInputRefs.current[index]?.click()}
                          className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400"
                        >
                          <MdPhotoCamera size={24} />
                          <input
                            type="file"
                            ref={el => { photoInputRefs.current[index] = el; }}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(index, 'photo', e)}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Fotos de Defeitos
                        </label>
                        <span className="text-xs text-gray-500">Opcional</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.defectPhotos && item.defectPhotos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="relative">
                            <img src={photo} alt={`Item ${index} defect ${photoIndex}`} className="h-16 w-16 object-cover rounded border border-gray-300" />
                            <button 
                              type="button"
                              onClick={() => removePhoto(index, photoIndex, 'defect')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                            >
                              <MdDelete size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => defectPhotoInputRefs.current[index]?.click()}
                          className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400"
                        >
                          <MdPhotoCamera size={24} />
                          <input
                            type="file"
                            ref={el => { defectPhotoInputRefs.current[index] = el; }}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(index, 'defect', e)}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Código de Barras
                      </label>
                      <button 
                        type="button"
                        onClick={() => generateBarcode(index)}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Gerar
                      </button>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 text-gray-400">
                        <MdQrCode size={20} />
                      </div>
                      <input
                        type="text"
                        value={item.barcode}
                        onChange={(e) => handleItemChange(index, 'barcode', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Código de barras do item"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Ajuste de Preço
                      </label>
                      <span className="text-xs text-gray-500">Opcional</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <select
                          value={item.priceAdjustment.isDiscount.toString()}
                          onChange={(e) => handleNestedItemChange(
                            index, 
                            'priceAdjustment', 
                            'isDiscount', 
                            e.target.value === 'true' ? 'true' : 'false' as 'true' | 'false'
                          )}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="true">Desconto</option>
                          <option value="false">Acréscimo</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.priceAdjustment.amount}
                          onChange={(e) => handleNestedItemChange(
                            index, 
                            'priceAdjustment', 
                            'amount', 
                            String(parseFloat(e.target.value) || 0)
                          )}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Valor"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={item.priceAdjustment.reason}
                          onChange={(e) => handleNestedItemChange(
                            index, 
                            'priceAdjustment', 
                            'reason', 
                            e.target.value
                          )}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Motivo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Notas</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Públicas (Visíveis para o cliente)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Notas visíveis para o cliente"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Internas (Apenas para uso da equipe)
                </label>
                <textarea
                  name="internalNotes"
                  value={formData.internalNotes}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Notas internas - não visíveis para o cliente"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Right column - Summary and options */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>R$ {calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gorjeta:</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="tipPercentage"
                      value={formData.tipPercentage}
                      onChange={handleInputChange}
                      className="w-16 p-1 border border-gray-300 rounded-md mr-2 text-right"
                    />
                    <span className="mr-2">%</span>
                    <span>R$ {calculateTip().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Opções de Rastreamento</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="enableTracking"
                    checked={formData.tracking.enableTracking}
                    onChange={(e) => handleTrackingChange('enableTracking', e.target.checked.toString())}
                    className="mr-2"
                  />
                  <label htmlFor="enableTracking" className="text-sm">
                    Habilitar Rastreamento de Pedido
                  </label>
                </div>
                
                {formData.tracking.enableTracking && (
                  <>
                    <div className="pl-6 space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="sendNotifications"
                          checked={formData.tracking.sendNotifications}
                          onChange={(e) => handleTrackingChange('sendNotifications', e.target.checked.toString())}
                          className="mr-2"
                        />
                        <label htmlFor="sendNotifications" className="text-sm">
                          Enviar Notificações de Status
                        </label>
                      </div>
                      
                      {formData.tracking.sendNotifications && (
                        <div className="pl-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Canal de Notificação
                          </label>
                          <select
                            value={formData.tracking.notificationChannel}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTrackingChange('notificationChannel', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="sms">SMS</option>
                            <option value="email">Email</option>
                            <option value="both">Ambos (SMS e Email)</option>
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tempo Estimado de Processamento (horas)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.tracking.estimatedHours}
                          onChange={(e) => handleTrackingChange('estimatedHours', String(parseInt(e.target.value) || 24))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => navigate('/stores/orders')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Salvar Pedido
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrderPage; 