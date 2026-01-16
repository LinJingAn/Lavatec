import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocalLaundryService, MdDry, MdTimer } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

const SelfServicePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    selectedServices: [] as ('washing' | 'drying')[],
    selectedMachines: [] as {
      id: string;
      type: string;
      serviceType: 'washing' | 'drying';
      duration: number;
    }[],
    paymentMethod: 'credit_card'
  });

  const washingMachines = [
    { id: 'w1', name: 'Máquina de Lavar 1', type: 'small', capacity: '5kg', status: 'available', price: 15 },
    { id: 'w2', name: 'Máquina de Lavar 2', type: 'medium', capacity: '8kg', status: 'available', price: 20 },
    { id: 'w3', name: 'Máquina de Lavar 3', type: 'large', capacity: '12kg', status: 'available', price: 25 },
  ];

  const dryingMachines = [
    { id: 'd1', name: 'Secadora 1', type: 'small', capacity: '5kg', status: 'available', price: 12 },
    { id: 'd2', name: 'Secadora 2', type: 'medium', capacity: '8kg', status: 'available', price: 15 },
    { id: 'd3', name: 'Secadora 3', type: 'large', capacity: '12kg', status: 'available', price: 20 },
  ];

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/stores');
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSubmit = () => {
    // TODO: Implement order submission
    console.log('Submitting order:', formData);
  };

  const handleServiceSelect = (service: 'washing' | 'drying') => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.includes(service);
      return {
        ...prev,
        selectedServices: isSelected
          ? prev.selectedServices.filter(s => s !== service)
          : [...prev.selectedServices, service]
      };
    });
  };

  const handleMachineSelect = (machine: any, serviceType: 'washing' | 'drying') => {
    setFormData(prev => {
      const isSelected = prev.selectedMachines.some(m => m.id === machine.id);
      
      if (isSelected) {
        // Remove machine if already selected
        return {
          ...prev,
          selectedMachines: prev.selectedMachines.filter(m => m.id !== machine.id)
        };
      } else {
        // Add machine with default duration
        return {
          ...prev,
          selectedMachines: [...prev.selectedMachines, {
            id: machine.id,
            type: machine.type,
            serviceType,
            duration: 30
          }]
        };
      }
    });
  };

  const handleDurationChange = (machineId: string, duration: number) => {
    setFormData(prev => ({
      ...prev,
      selectedMachines: prev.selectedMachines.map(machine =>
        machine.id === machineId ? { ...machine, duration } : machine
      )
    }));
  };

  const calculateTotalPrice = () => {
    return formData.selectedMachines.reduce((total, machine) => {
      const machineData = machine.serviceType === 'washing'
        ? washingMachines.find(m => m.id === machine.id)
        : dryingMachines.find(m => m.id === machine.id);
      
      return total + ((machineData?.price || 0) * (machine.duration / 30));
    }, 0);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button
              className="w-full h-[50px] bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              onClick={handleNext}
            >
              Entrar
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Tipo de Serviço</Label>
              <div className="grid gap-3">
                <button
                  onClick={() => handleServiceSelect('washing')}
                  className={`p-4 border rounded-lg text-left transition-colors duration-200 hover:border-blue-500 ${
                    formData.selectedServices.includes('washing') ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Lavagem</h3>
                      <p className="text-sm text-gray-600">Máquinas disponíveis: 3</p>
                    </div>
                    <MdLocalLaundryService className={`w-6 h-6 ${
                      formData.selectedServices.includes('washing') ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                </button>

                <button
                  onClick={() => handleServiceSelect('drying')}
                  className={`p-4 border rounded-lg text-left transition-colors duration-200 hover:border-blue-500 ${
                    formData.selectedServices.includes('drying') ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Secagem</h3>
                      <p className="text-sm text-gray-600">Máquinas disponíveis: 3</p>
                    </div>
                    <MdDry className={`w-6 h-6 ${
                      formData.selectedServices.includes('drying') ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 h-[50px] bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                onClick={() => setStep(step - 1)}
              >
                Voltar
              </button>
              <button
                className="flex-1 h-[50px] bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                onClick={handleNext}
                disabled={formData.selectedServices.length === 0}
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {formData.selectedServices.includes('washing') && (
              <div>
                <Label className="text-lg font-medium mb-3 block">Máquinas de Lavar</Label>
                <div className="grid gap-3">
                  {washingMachines.map((machine) => {
                    const isSelected = formData.selectedMachines.some(m => m.id === machine.id);
                    return (
                      <div key={machine.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleMachineSelect(machine, 'washing')}
                          className={`w-full p-4 text-left transition-colors duration-200 ${
                            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">{machine.name}</h3>
                              <p className="text-sm text-gray-600">Capacidade: {machine.capacity}</p>
                              <p className="text-sm text-blue-600">Valor: R$ {machine.price}/30min</p>
                            </div>
                            <div className="h-4 w-4 rounded-full bg-green-500" title="Disponível" />
                          </div>
                        </button>
                        {isSelected && (
                          <div className="bg-gray-50 p-4 border-t">
                            <Label className="text-sm text-gray-700">Duração (minutos)</Label>
                            <Input
                              type="number"
                              value={formData.selectedMachines.find(m => m.id === machine.id)?.duration || 30}
                              onChange={(e) => handleDurationChange(machine.id, parseInt(e.target.value))}
                              min="15"
                              max="120"
                              step="15"
                              className="h-[40px] mt-1"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.selectedServices.includes('drying') && (
              <div>
                <Label className="text-lg font-medium mb-3 block">Secadoras</Label>
                <div className="grid gap-3">
                  {dryingMachines.map((machine) => {
                    const isSelected = formData.selectedMachines.some(m => m.id === machine.id);
                    return (
                      <div key={machine.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleMachineSelect(machine, 'drying')}
                          className={`w-full p-4 text-left transition-colors duration-200 ${
                            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">{machine.name}</h3>
                              <p className="text-sm text-gray-600">Capacidade: {machine.capacity}</p>
                              <p className="text-sm text-blue-600">Valor: R$ {machine.price}/30min</p>
                            </div>
                            <div className="h-4 w-4 rounded-full bg-green-500" title="Disponível" />
                          </div>
                        </button>
                        {isSelected && (
                          <div className="bg-gray-50 p-4 border-t">
                            <Label className="text-sm text-gray-700">Duração (minutos)</Label>
                            <Input
                              type="number"
                              value={formData.selectedMachines.find(m => m.id === machine.id)?.duration || 30}
                              onChange={(e) => handleDurationChange(machine.id, parseInt(e.target.value))}
                              min="15"
                              max="120"
                              step="15"
                              className="h-[40px] mt-1"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.selectedMachines.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium mb-3">Máquinas Selecionadas</h3>
                <div className="space-y-2">
                  {formData.selectedMachines.map((selected) => {
                    const machine = selected.serviceType === 'washing'
                      ? washingMachines.find(m => m.id === selected.id)
                      : dryingMachines.find(m => m.id === selected.id);
                    const price = (machine?.price || 0) * (selected.duration / 30);
                    return (
                      <div key={selected.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{machine?.name}</p>
                          <p className="text-sm text-gray-600">{selected.duration} minutos</p>
                        </div>
                        <p className="font-medium text-blue-600">R$ {price.toFixed(2)}</p>
                      </div>
                    );
                  })}
                  <div className="pt-2 flex justify-between items-center">
                    <p className="font-medium text-gray-900">Total</p>
                    <p className="font-medium text-blue-600">R$ {calculateTotalPrice().toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                className="flex-1 h-[50px] bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                onClick={() => setStep(step - 1)}
              >
                Voltar
              </button>
              <button
                className="flex-1 h-[50px] bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                onClick={handleNext}
                disabled={formData.selectedMachines.length === 0}
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card">Cartão de Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debit_card" id="debit_card" />
                  <Label htmlFor="debit_card">Cartão de Débito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix">PIX</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Dinheiro</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Resumo do Pedido</h3>
              <div className="space-y-1 text-sm">
                {formData.selectedMachines.map((selected) => {
                  const machine = selected.serviceType === 'washing'
                    ? washingMachines.find(m => m.id === selected.id)
                    : dryingMachines.find(m => m.id === selected.id);
                  const price = (machine?.price || 0) * (selected.duration / 30);
                  return (
                    <div key={selected.id} className="py-1 border-b border-gray-200 last:border-0">
                      <p><span className="font-medium">{machine?.name}</span></p>
                      <p className="text-gray-600">Duração: {selected.duration} minutos</p>
                      <p className="text-gray-600">Subtotal: R$ {price.toFixed(2)}</p>
                    </div>
                  );
                })}
                <p className="pt-2 font-medium">Total: R$ {calculateTotalPrice().toFixed(2)}</p>
                <p className="font-medium">Pagamento: {
                  formData.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                  formData.paymentMethod === 'debit_card' ? 'Cartão de Débito' :
                  formData.paymentMethod === 'pix' ? 'PIX' : 'Dinheiro'
                }</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 h-[50px] bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                onClick={() => setStep(step - 1)}
              >
                Voltar
              </button>
              <button
                className="flex-1 h-[50px] bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                onClick={handleSubmit}
              >
                Finalizar R$ {calculateTotalPrice().toFixed(2)}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition duration-200 text-blue-600"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Self Service</h1>
          <p className="text-sm text-gray-600 mt-1">
            {step === 1 ? 'Faça login para continuar' :
             step === 2 ? 'Escolha o tipo de serviço' :
             step === 3 ? 'Selecione a máquina e duração' :
             'Confirme o pagamento'}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 ? <MdLocalLaundryService size={24} /> :
               step === 2 ? <MdLocalLaundryService size={24} /> :
               step === 3 ? <MdDry size={24} /> :
               <MdTimer size={24} />}
              {step === 1 ? 'Login' :
               step === 2 ? 'Tipo de Serviço' :
               step === 3 ? 'Máquina e Duração' :
               'Pagamento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfServicePage; 