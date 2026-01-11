import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MdEdit,
  MdLocalShipping,
  MdAssignment,
  MdLocationOn,
  MdWarning,
} from 'react-icons/md';

interface StagingLocation {
  id: string;
  name: string;
  capacity: number;
  currentCount: number;
}

interface StagedOrder {
  id: string;
  orderNumber: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  readyTime: string;
  customerName: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    isReady: boolean;
  }>;
}

interface OrderStagingProps {
  onLocationUpdate: (orderId: string, locationId: string) => void;
  onPriorityUpdate: (orderId: string, priority: string) => void;
}

export const OrderStaging: React.FC<OrderStagingProps> = ({
  onLocationUpdate,
  onPriorityUpdate,
}) => {
  const [stagingLocations, setStagingLocations] = useState<StagingLocation[]>([
    { id: 'A1', name: 'Front Counter', capacity: 20, currentCount: 12 },
    { id: 'B1', name: 'Back Room', capacity: 50, currentCount: 28 },
    { id: 'C1', name: 'Express Pickup', capacity: 10, currentCount: 4 },
  ]);

  const [stagedOrders, setStagedOrders] = useState<StagedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StagedOrder | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditOrder = (order: StagedOrder) => {
    setSelectedOrder(order);
    setShowEditDialog(true);
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<StagedOrder>) => {
    setStagedOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Staging
      </Typography>

      {/* Location Overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stagingLocations.map(location => (
          <Grid item xs={12} sm={6} md={4} key={location.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">{location.name}</Typography>
                <Chip
                  label={`${location.currentCount}/${location.capacity}`}
                  color={location.currentCount >= location.capacity ? 'error' : 'primary'}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MdLocationOn />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Zone {location.id}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Staged Orders */}
      <Typography variant="subtitle1" gutterBottom>
        Staged Orders
      </Typography>
      <Grid container spacing={2}>
        {stagedOrders.map(order => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">#{order.orderNumber}</Typography>
                <IconButton size="small" onClick={() => handleEditOrder(order)}>
                  <MdEdit />
                </IconButton>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {order.customerName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <MdLocationOn size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {order.location}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Chip
                  label={`Priority: ${order.priority}`}
                  color={getPriorityColor(order.priority)}
                  size="small"
                />
                <Typography variant="body2">
                  Ready: {order.readyTime}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Items: {order.items.filter(item => item.isReady).length}/{order.items.length} ready
                </Typography>
                {order.items.some(item => !item.isReady) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <MdWarning color="warning" size="small" />
                    <Typography variant="body2" color="warning.main" sx={{ ml: 1 }}>
                      Some items pending
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
        <DialogTitle>Edit Order Location</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={selectedOrder?.location || ''}
                onChange={(e) => {
                  if (selectedOrder) {
                    handleUpdateOrder(selectedOrder.id, { location: e.target.value as string });
                    onLocationUpdate(selectedOrder.id, e.target.value as string);
                  }
                }}
              >
                {stagingLocations.map(location => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name} ({location.currentCount}/{location.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={selectedOrder?.priority || ''}
                onChange={(e) => {
                  if (selectedOrder) {
                    handleUpdateOrder(selectedOrder.id, { priority: e.target.value as 'high' | 'medium' | 'low' });
                    onPriorityUpdate(selectedOrder.id, e.target.value);
                  }
                }}
              >
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowEditDialog(false)} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 