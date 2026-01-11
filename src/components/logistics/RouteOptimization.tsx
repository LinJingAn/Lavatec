import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
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
  Grid,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { DeliveryService } from '../../services/DeliveryService';
import { Delivery, DeliveryRoute, DeliveryDriver } from '../../models/Delivery';

interface RouteOptimizationProps {
  deliveries: Delivery[];
  onRouteUpdate: (routeId: string, deliveryIds: string[]) => void;
}

export const RouteOptimization: React.FC<RouteOptimizationProps> = ({
  deliveries,
  onRouteUpdate,
}) => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<DeliveryRoute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const deliveryService = DeliveryService.getInstance();

  useEffect(() => {
    loadRoutes();
    loadDrivers();
  }, []);

  const loadRoutes = async () => {
    try {
      // In a real implementation, this would fetch routes from the backend
      const activeRoutes = await deliveryService.getActiveRoutes();
      setRoutes(activeRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const loadDrivers = async () => {
    try {
      const availableDrivers = await deliveryService.getAvailableDrivers();
      setDrivers(availableDrivers);
    } catch (error) {
      console.error('Error loading drivers:', error);
    }
  };

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true);
    try {
      // In a real implementation, this would call a route optimization service
      const optimizedRoutes = await deliveryService.optimizeRoutes(
        deliveries,
        drivers
      );
      setRoutes(optimizedRoutes);
      
      // Update each route
      optimizedRoutes.forEach(route => {
        onRouteUpdate(route.id, route.deliveryIds);
      });
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleEditRoute = (route: DeliveryRoute) => {
    setSelectedRoute(route);
    setIsDialogOpen(true);
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await deliveryService.deleteRoute(routeId);
      setRoutes(routes.filter(r => r.id !== routeId));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const handleSaveRoute = async (route: DeliveryRoute) => {
    try {
      if (selectedRoute) {
        // Update existing route
        const updatedRoute = await deliveryService.updateRoute(route);
        setRoutes(routes.map(r => r.id === updatedRoute.id ? updatedRoute : r));
      } else {
        // Create new route
        const newRoute = await deliveryService.createRoute(route);
        setRoutes([...routes, newRoute]);
      }
      setIsDialogOpen(false);
      setSelectedRoute(null);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Route Optimization</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOptimizeRoutes}
            disabled={isOptimizing}
            startIcon={<RouteIcon />}
            sx={{ mr: 1 }}
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedRoute(null);
              setIsDialogOpen(true);
            }}
            startIcon={<AddIcon />}
          >
            New Route
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {routes.map((route) => (
          <Grid item xs={12} md={6} key={route.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Route #{route.id}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditRoute(route)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRoute(route.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Driver: {route.driverName}
                </Typography>

                <List dense>
                  {route.stops.map((stop, index) => (
                    <ListItem key={stop.deliveryId}>
                      <ListItemText
                        primary={`Stop #${index + 1}: ${stop.address}`}
                        secondary={`Estimated arrival: ${new Date(stop.estimatedArrival).toLocaleTimeString()}`}
                      />
                      <Chip
                        size="small"
                        label={stop.status}
                        color={
                          stop.status === 'completed'
                            ? 'success'
                            : stop.status === 'in_progress'
                            ? 'primary'
                            : 'default'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedRoute ? 'Edit Route' : 'New Route'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Driver</InputLabel>
              <Select
                value={selectedRoute?.driverId || ''}
                onChange={(e) => {
                  if (selectedRoute) {
                    setSelectedRoute({
                      ...selectedRoute,
                      driverId: e.target.value as string,
                    });
                  }
                }}
              >
                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name} - {driver.vehicleType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Deliveries
            </Typography>
            <List dense>
              {deliveries
                .filter((d) => !d.routeId || d.routeId === selectedRoute?.id)
                .map((delivery) => (
                  <ListItem key={delivery.id}>
                    <ListItemText
                      primary={`#${delivery.trackingNumber}`}
                      secondary={delivery.address.streetAddress}
                    />
                    <Chip
                      label={delivery.status}
                      size="small"
                      color={
                        delivery.status === 'completed'
                          ? 'success'
                          : delivery.status === 'in_progress'
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedRoute && handleSaveRoute(selectedRoute)}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 