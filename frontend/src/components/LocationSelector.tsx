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
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors duration-200 focus:outline-none ${
          isOpen 
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <MdOutlineLocationOn className={`w-5 h-5 ${isOpen ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="text-sm font-medium">
          {selectedLocation?.name || 'Todas as Unidades'}
        </span>
        <MdOutlineKeyboardArrowDown className={`w-5 h-5 transition-transform ${
          isOpen 
            ? 'rotate-180 text-emerald-500 dark:text-emerald-400' 
            : 'text-slate-400 dark:text-slate-500'
        }`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 transition-colors duration-300">
          {/* Search input */}
          <div className="px-3 pb-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar unidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Location list */}
          <div className="max-h-64 overflow-y-auto scrollbar-hide overflow-x-hidden">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
                  selectedLocation?.id === location.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-medium">{location.name}</div>
                {location.id !== 'all' && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">{location.address}, {location.city}</div>
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