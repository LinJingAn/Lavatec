import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdTimeline,
  MdPerson,
} from 'react-icons/md';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { DeliveryRoute, DeliveryDriver, Delivery } from '../../models/Delivery';
import { RouteOptimizationService } from '../../services/RouteOptimizationService';
import { DeliveryService } from '../../services/DeliveryService';

interface RouteOptimizationPanelProps {
  onRouteUpdate: (routeId: string, deliveryIds: string[]) => void;
}

export const RouteOptimizationPanel: React.FC<RouteOptimizationPanelProps> = ({ onRouteUpdate }) => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = useState<Delivery[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<DeliveryRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const routeService = RouteOptimizationService.getInstance();
  const deliveryService = DeliveryService.getInstance();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [activeRoutes, availableDrivers, pendingDeliveries] = await Promise.all([
        deliveryService.getActiveRoutes(),
        deliveryService.getAvailableDrivers(),
        deliveryService.getDeliveriesByStatus('pending')
      ]);

      setRoutes(activeRoutes);
      setDrivers(availableDrivers);
      setUnassignedDeliveries(pendingDeliveries);

      // Set map center to first delivery location or default location
      if (pendingDeliveries.length > 0) {
        setMapCenter({
          lat: pendingDeliveries[0].address.latitude || 0,
          lng: pendingDeliveries[0].address.longitude || 0
        });
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true);
    try {
      const optimizedRoutes = await routeService.optimizeRoutes(
        unassignedDeliveries,
        drivers,
        {
          maxRouteDistance: 200,
          maxStopsPerRoute: 20,
          preferredTimeWindows: [{ start: '09:00', end: '17:00' }]
        }
      );

      setRoutes(optimizedRoutes);
      
      // Update each route
      optimizedRoutes.forEach(route => {
        onRouteUpdate(route.id, route.deliveryIds);
      });

      // Update directions for selected route
      if (selectedRoute) {
        const updatedRoute = optimizedRoutes.find(r => r.id === selectedRoute.id);
        if (updatedRoute) {
          await calculateAndDisplayRoute(updatedRoute);
        }
      }
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const calculateAndDisplayRoute = async (route: DeliveryRoute) => {
    if (!window.google) return;

    const directionsService = new google.maps.DirectionsService();
    const waypoints = route.stops.map(stop => ({
      location: new google.maps.LatLng(stop.latitude, stop.longitude),
      stopover: true
    }));

    const request = {
      origin: waypoints[0].location,
      destination: waypoints[waypoints.length - 1].location,
      waypoints: waypoints.slice(1, -1),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      }
    });
  };

  const handleRouteSelect = async (route: DeliveryRoute) => {
    setSelectedRoute(route);
    await calculateAndDisplayRoute(route);
  };

  const handleDriverAssignment = async (routeId: string, driverId: string) => {
    try {
      await deliveryService.assignDriverToRoute(routeId, driverId);
      await loadInitialData();
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h6">Route Planning & Optimization</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<MdTimeline />}
              onClick={handleOptimizeRoutes}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} sx={{ flexGrow: 1, p: 2 }}>
        <Grid item xs={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <List>
              {routes.map((route) => (
                <ListItem
                  key={route.id}
                  button
                  selected={selectedRoute?.id === route.id}
                  onClick={() => handleRouteSelect(route)}
                >
                  <ListItemText
                    primary={`Route #${route.id}`}
                    secondary={`${route.stops.length} stops • ${route.totalDistance.toFixed(1)} km`}
                  />
                  <Chip
                    label={route.status}
                    size="small"
                    color={route.status === 'completed' ? 'success' : 'primary'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={8}>
          <Paper sx={{ height: '100%' }}>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={12}
              >
                {directions && <DirectionsRenderer directions={directions} />}
                {selectedRoute?.stops.map((stop, index) => (
                  <Marker
                    key={stop.deliveryId}
                    position={{ lat: stop.latitude, lng: stop.longitude }}
                    label={`${index + 1}`}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </Paper>
        </Grid>
      </Grid>

      {selectedRoute && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Route Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Driver</InputLabel>
                <Select
                  value={selectedRoute.driverId || ''}
                  onChange={(e) => handleDriverAssignment(selectedRoute.id, e.target.value as string)}
                >
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name} - {driver.vehicleType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Time Window</InputLabel>
                <Select
                  value={selectedTimeWindow}
                  onChange={(e) => setSelectedTimeWindow(e.target.value)}
                >
                  <MenuItem value="morning">Morning (9:00 - 12:00)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12:00 - 17:00)</MenuItem>
                  <MenuItem value="evening">Evening (17:00 - 20:00)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}; 