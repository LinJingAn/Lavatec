import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineLocationOn, MdOutlineKeyboardArrowDown, MdSearch } from 'react-icons/md';
import { useLocation } from '../contexts/LocationContext';

const LocationSelector: React.FC = () => {
  const { selectedLocation, setSelectedLocation, locations } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: typeof locations[0]) => {
    setSelectedLocation(location);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors duration-200 focus:outline-none ${
          isOpen 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <MdOutlineLocationOn className={`w-5 h-5 ${isOpen ? 'text-blue-500' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">
          {selectedLocation?.name || 'Todas as Unidades'}
        </span>
        <MdOutlineKeyboardArrowDown className={`w-5 h-5 transition-transform ${
          isOpen 
            ? 'rotate-180 text-blue-500' 
            : 'text-gray-400'
        }`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Search input */}
          <div className="px-3 pb-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar unidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  selectedLocation?.id === location.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="font-medium">{location.name}</div>
                {location.id !== 'all' && (
                  <div className="text-xs text-gray-500">{location.address}, {location.city}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 