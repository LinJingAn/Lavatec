import React, { createContext, useContext, useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface LocationContextType {
  selectedLocation: Location | null;
  locations: Location[];
  setSelectedLocation: (location: Location | null) => void;
  setLocations: (locations: Location[]) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([
    // Temporary mock data - replace this with actual API call
    {
      id: 'all',
      name: 'Todas as Unidades',
      address: '',
      city: '',
      state: ''
    },
    {
      id: '1',
      name: 'Unidade Centro',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP'
    },
    {
      id: '2',
      name: 'Unidade Jardins',
      address: 'Av. Jardins, 456',
      city: 'São Paulo',
      state: 'SP'
    },
    {
      id: '3',
      name: 'Unidade Morumbi',
      address: 'Av. Morumbi, 789',
      city: 'São Paulo',
      state: 'SP'
    }
  ]);

  // Initialize with "All Locations"
  useEffect(() => {
    setSelectedLocation(locations[0]);
  }, []);

  return (
    <LocationContext.Provider 
      value={{ 
        selectedLocation, 
        setSelectedLocation, 
        locations,
        setLocations 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 