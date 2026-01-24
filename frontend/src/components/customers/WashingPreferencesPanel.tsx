import React, { useState } from 'react';
import { MdLocalLaundryService, MdEdit, MdSave, MdClose, MdWaterDrop, MdOutlineScience, MdInfo } from 'react-icons/md';
import { WashingPreferences, FabricPreference, DetergentPreference, FABRIC_TYPES, DETERGENT_TYPES } from '../../models/CustomerPreferences';

interface WashingPreferencesPanelProps {
  preferences: WashingPreferences;
  onSave?: (preferences: WashingPreferences) => void;
  isReadOnly?: boolean;
}

const WashingPreferencesPanel: React.FC<WashingPreferencesPanelProps> = ({ 
  preferences, 
  onSave, 
  isReadOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState<WashingPreferences>(preferences);
  
  const temperatureOptions = [
    { value: 'cold', label: 'Fria' },
    { value: 'warm', label: 'Morna' },
    { value: 'hot', label: 'Quente' }
  ];
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedPreferences(preferences);
    }
    setIsEditing(!isEditing);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        ...editedPreferences,
        lastUpdated: new Date().toISOString()
      });
    }
    setIsEditing(false);
  };
  
  const handleFabricToggle = (fabric: FabricPreference, list: 'preferred' | 'avoided') => {
    const targetList = list === 'preferred' ? 'preferredFabrics' : 'avoidedFabrics';
    const otherList = list === 'preferred' ? 'avoidedFabrics' : 'preferredFabrics';
    
    const isAlreadyInList = editedPreferences[targetList].some(f => f.id === fabric.id);
    
    if (isAlreadyInList) {
      // Remove from list
      setEditedPreferences({
        ...editedPreferences,
        [targetList]: editedPreferences[targetList].filter(f => f.id !== fabric.id)
      });
    } else {
      // Add to list (and remove from other list if present)
      setEditedPreferences({
        ...editedPreferences,
        [targetList]: [...editedPreferences[targetList], fabric],
        [otherList]: editedPreferences[otherList].filter(f => f.id !== fabric.id)
      });
    }
  };
  
  const handleDetergentToggle = (detergent: DetergentPreference, list: 'preferred' | 'avoided') => {
    const targetList = list === 'preferred' ? 'preferredDetergents' : 'avoidedDetergents';
    const otherList = list === 'preferred' ? 'avoidedDetergents' : 'preferredDetergents';
    
    const isAlreadyInList = editedPreferences[targetList].some(d => d.id === detergent.id);
    
    if (isAlreadyInList) {
      // Remove from list
      setEditedPreferences({
        ...editedPreferences,
        [targetList]: editedPreferences[targetList].filter(d => d.id !== detergent.id)
      });
    } else {
      // Add to list (and remove from other list if present)
      setEditedPreferences({
        ...editedPreferences,
        [targetList]: [...editedPreferences[targetList], detergent],
        [otherList]: editedPreferences[otherList].filter(d => d.id !== detergent.id)
      });
    }
  };
  
  const handleCheckboxChange = (name: 'usesSoftener' | 'usesStarchOnShirts') => {
    setEditedPreferences({
      ...editedPreferences,
      [name]: !editedPreferences[name]
    });
  };
  
  const handleAdditionalInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPreferences({
      ...editedPreferences,
      additionalInstructions: e.target.value
    });
  };
  
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedPreferences({
      ...editedPreferences,
      temperaturePreference: e.target.value as 'cold' | 'warm' | 'hot'
    });
  };
  
  const getTemperatureLabel = (temp: string) => {
    return temperatureOptions.find(option => option.value === temp)?.label || temp;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <MdLocalLaundryService className="mr-2 text-blue-600" /> 
          Preferências de Lavagem
        </h3>
        
        {!isReadOnly && (
          <button 
            onClick={handleEditToggle}
            className={`p-2 rounded-full ${isEditing ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
          >
            {isEditing ? <MdClose /> : <MdEdit />}
          </button>
        )}
      </div>
      
      <div className="p-4">
        {isEditing ? (
          // Editing mode
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <MdWaterDrop className="mr-1" /> Temperatura da Água
              </h4>
              <select
                value={editedPreferences.temperaturePreference}
                onChange={handleTemperatureChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {temperatureOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tecidos Preferidos</h4>
              <div className="flex flex-wrap gap-2">
                {FABRIC_TYPES.map(fabric => (
                  <button
                    key={fabric.id}
                    onClick={() => handleFabricToggle(fabric, 'preferred')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      editedPreferences.preferredFabrics.some(f => f.id === fabric.id)
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    title={fabric.washingInstructions}
                  >
                    {fabric.name} {fabric.isDelicate && "⚠️"}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tecidos a Evitar</h4>
              <div className="flex flex-wrap gap-2">
                {FABRIC_TYPES.map(fabric => (
                  <button
                    key={fabric.id}
                    onClick={() => handleFabricToggle(fabric, 'avoided')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      editedPreferences.avoidedFabrics.some(f => f.id === fabric.id)
                        ? 'bg-red-100 text-red-800 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    title={fabric.washingInstructions}
                  >
                    {fabric.name} {fabric.isDelicate && "⚠️"}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <MdOutlineScience className="mr-1" /> Detergentes Preferidos
              </h4>
              <div className="flex flex-wrap gap-2">
                {DETERGENT_TYPES.map(detergent => (
                  <button
                    key={detergent.id}
                    onClick={() => handleDetergentToggle(detergent, 'preferred')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      editedPreferences.preferredDetergents.some(d => d.id === detergent.id)
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {detergent.name}
                    {detergent.isHypoallergenic && " 🛡️"}
                    {detergent.isEcoFriendly && " ♻️"}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Detergentes a Evitar</h4>
              <div className="flex flex-wrap gap-2">
                {DETERGENT_TYPES.map(detergent => (
                  <button
                    key={detergent.id}
                    onClick={() => handleDetergentToggle(detergent, 'avoided')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      editedPreferences.avoidedDetergents.some(d => d.id === detergent.id)
                        ? 'bg-red-100 text-red-800 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {detergent.name}
                    {detergent.isHypoallergenic && " 🛡️"}
                    {detergent.isEcoFriendly && " ♻️"}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="usesSoftener"
                  checked={editedPreferences.usesSoftener}
                  onChange={() => handleCheckboxChange('usesSoftener')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="usesSoftener" className="ml-2 text-sm text-gray-700">
                  Usar amaciante
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="usesStarchOnShirts"
                  checked={editedPreferences.usesStarchOnShirts}
                  onChange={() => handleCheckboxChange('usesStarchOnShirts')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="usesStarchOnShirts" className="ml-2 text-sm text-gray-700">
                  Usar goma nas camisas
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Instruções Adicionais</h4>
              <textarea
                value={editedPreferences.additionalInstructions}
                onChange={handleAdditionalInstructionsChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Instruções especiais para a lavagem..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <MdSave className="mr-1" /> Salvar
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <div className="space-y-4">
            {(!preferences.preferredFabrics.length && 
              !preferences.avoidedFabrics.length && 
              !preferences.preferredDetergents.length && 
              !preferences.additionalInstructions) ? (
              <div className="flex items-center justify-center py-4 px-6 bg-blue-50 rounded-lg">
                <MdInfo className="text-blue-500 mr-2 text-xl" />
                <p className="text-blue-700">
                  Nenhuma preferência de lavagem especificada para este cliente.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="font-medium mb-1 flex items-center">
                    <MdWaterDrop className="mr-1 text-blue-500" /> Temperatura da Água
                  </h4>
                  <p className="text-gray-700">
                    {getTemperatureLabel(preferences.temperaturePreference)}
                  </p>
                </div>
                
                {preferences.preferredFabrics.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Tecidos Preferidos</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.preferredFabrics.map(fabric => (
                        <span 
                          key={fabric.id} 
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                          title={fabric.washingInstructions}
                        >
                          {fabric.name} {fabric.isDelicate && "⚠️"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {preferences.avoidedFabrics.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Tecidos a Evitar</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.avoidedFabrics.map(fabric => (
                        <span 
                          key={fabric.id} 
                          className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                          title={fabric.washingInstructions}
                        >
                          {fabric.name} {fabric.isDelicate && "⚠️"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {preferences.preferredDetergents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1 flex items-center">
                      <MdOutlineScience className="mr-1 text-blue-500" /> Detergentes Preferidos
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.preferredDetergents.map(detergent => (
                        <span 
                          key={detergent.id} 
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {detergent.name}
                          {detergent.isHypoallergenic && " 🛡️"}
                          {detergent.isEcoFriendly && " ♻️"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {preferences.avoidedDetergents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Detergentes a Evitar</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.avoidedDetergents.map(detergent => (
                        <span 
                          key={detergent.id} 
                          className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                        >
                          {detergent.name}
                          {detergent.isHypoallergenic && " 🛡️"}
                          {detergent.isEcoFriendly && " ♻️"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center">
                    <span className={`h-4 w-4 ${preferences.usesSoftener ? 'bg-blue-500' : 'bg-gray-300'} rounded mr-2`}></span>
                    <span className="text-sm text-gray-700">Usa amaciante</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`h-4 w-4 ${preferences.usesStarchOnShirts ? 'bg-blue-500' : 'bg-gray-300'} rounded mr-2`}></span>
                    <span className="text-sm text-gray-700">Usa goma nas camisas</span>
                  </div>
                </div>
                
                {preferences.additionalInstructions && (
                  <div>
                    <h4 className="font-medium mb-1">Instruções Adicionais</h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {preferences.additionalInstructions}
                    </p>
                  </div>
                )}
                
                {preferences.lastUpdated && (
                  <div className="text-xs text-gray-500 mt-4 italic text-right">
                    Última atualização: {new Date(preferences.lastUpdated).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WashingPreferencesPanel; 