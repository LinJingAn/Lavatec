import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Delivery, DeliveryStatus } from '../../models/Delivery';
import { DeliveryService } from '../../services/DeliveryService';

interface DeliveryMapProps {
  deliveries: Delivery[];
  onDeliveryUpdate: (deliveryId: string, status: DeliveryStatus) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  deliveries,
  onDeliveryUpdate,
}) => {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const deliveryService = DeliveryService.getInstance();

  useEffect(() => {
    loadDriverLocations();
    const interval = setInterval(loadDriverLocations, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDriverLocations = async () => {
    try {
      const availableDrivers = await deliveryService.getAvailableDrivers();
      setDrivers(availableDrivers);
    } catch (error) {
      console.error('Error loading driver locations:', error);
    }
  };

  const getMarkerIcon = (status: DeliveryStatus) => {
    switch (status) {
      case 'completed':
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'in_progress':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'failed':
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={11}
          >
            {/* Delivery Markers */}
            {deliveries.map((delivery) => (
              <Marker
                key={delivery.id}
                position={{
                  lat: delivery.address.latitude || defaultCenter.lat,
                  lng: delivery.address.longitude || defaultCenter.lng,
                }}
                icon={getMarkerIcon(delivery.status)}
                onClick={() => setSelectedDelivery(delivery)}
              />
            ))}

            {/* Driver Markers */}
            {drivers.map((driver) => (
              driver.currentLocation && (
                <Marker
                  key={driver.id}
                  position={{
                    lat: driver.currentLocation.latitude,
                    lng: driver.currentLocation.longitude,
                  }}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/truck.png',
                    scaledSize: new window.google.maps.Size(32, 32),
                  }}
                />
              )
            ))}

            {/* Info Window */}
            {selectedDelivery && (
              <InfoWindow
                position={{
                  lat: selectedDelivery.address.latitude || defaultCenter.lat,
                  lng: selectedDelivery.address.longitude || defaultCenter.lng,
                }}
                onCloseClick={() => setSelectedDelivery(null)}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Delivery #{selectedDelivery.trackingNumber}
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Status"
                          secondary={
                            <Chip
                              label={selectedDelivery.status}
                              size="small"
                              color={
                                selectedDelivery.status === 'completed'
                                  ? 'success'
                                  : selectedDelivery.status === 'in_progress'
                                  ? 'info'
                                  : 'default'
                              }
                            />
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Scheduled Date"
                          secondary={formatDate(selectedDelivery.scheduledDate)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary={`${selectedDelivery.address.streetAddress}, ${
                            selectedDelivery.address.unit
                              ? `Unit ${selectedDelivery.address.unit}, `
                              : ''
                          }${selectedDelivery.address.city}, ${
                            selectedDelivery.address.state
                          } ${selectedDelivery.address.zipCode}`}
                        />
                      </ListItem>
                      {selectedDelivery.address.instructions && (
                        <ListItem>
                          <ListItemText
                            primary="Delivery Instructions"
                            secondary={selectedDelivery.address.instructions}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </InfoWindow>
            )}
          </GoogleMap>
        </Box>

        <Card sx={{ minWidth: 300, maxWidth: 350 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Drivers
            </Typography>
            <List dense>
              {drivers.map((driver) => (
                <ListItem key={driver.id}>
                  <ListItemText
                    primary={driver.name}
                    secondary={`Vehicle: ${driver.vehicleType} (${driver.vehicleNumber})`}
                  />
                  <Chip
                    label={driver.isAvailable ? 'Available' : 'Busy'}
                    size="small"
                    color={driver.isAvailable ? 'success' : 'default'}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </LoadScript>
  );
}; 