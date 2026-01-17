import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  MdSearch,
  MdQrCodeScanner,
  MdCheck,
  MdClose,
  MdNotifications,
  MdPrint,
  MdLocalShipping,
  MdPerson,
  MdPhotoCamera,
} from 'react-icons/md';
import SignaturePad from 'react-signature-canvas';
import { Delivery, DeliveryStatus } from '../../models/Delivery';
import { DeliveryService } from '../../services/DeliveryService';
import { OrderStaging } from './OrderStaging';
import { PickupNotificationService } from '../../services/PickupNotificationService';
import { useDebounce } from '../../hooks/useDebounce';
import Webcam from 'react-webcam';

interface PickupItem {
  id: string;
  name: string;
  quantity: number;
  isSelected: boolean;
}

interface PickupOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: PickupItem[];
  status: 'pending' | 'ready' | 'partial' | 'completed';
  location: string;
  verificationRequired: boolean;
  customerPhone: string;
  createdAt?: string | Date;
}

interface PickupVerificationDialogProps {
  open: boolean;
  order: PickupOrder | null;
  onClose: () => void;
  onConfirm: () => void;
}

const PickupVerificationDialog: React.FC<PickupVerificationDialogProps> = ({
  open,
  order,
  onClose,
  onConfirm,
}) => {
  const [signature, setSignature] = useState<any>(null);
  const [idVerified, setIdVerified] = useState(false);

  const handleClear = () => {
    signature?.clear();
    setIdVerified(false);
  };

  const handleConfirm = () => {
    if (!signature || !idVerified) return;
    const signatureData = signature.getTrimmedCanvas().toDataURL('image/png');
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Verify Pickup - Order #{order?.orderNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Customer Information
          </Typography>
          <Typography>
            Name: {order?.customerName}
            <br />
            {order?.createdAt && (
              <>
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
                <br />
              </>
            )}
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
            />
          }
          label="ID Verified"
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Customer Signature
        </Typography>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f5f5f5',
          }}
        >
          <SignaturePad
            ref={(ref) => setSignature(ref)}
            canvasProps={{
              width: 500,
              height: 200,
              className: 'signature-canvas',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!idVerified || !signature?.isEmpty()}
        >
          Confirm Pickup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const PickupManagement: React.FC = () => {
  const [orders, setOrders] = useState<PickupOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PickupOrder | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const deliveryService = DeliveryService.getInstance();
  const [isSearching, setIsSearching] = useState(false);
  const [showIDVerification, setShowIDVerification] = useState(false);
  const [idPhotoTaken, setIdPhotoTaken] = useState<string | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [signature, setSignature] = useState<any>(null);
  const [idVerified, setIdVerified] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const pickupNotificationService = PickupNotificationService.getInstance();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      handleQuickSearch();
    }
  }, [debouncedSearch]);

  const loadOrders = async () => {
    try {
      const response = await deliveryService.getPickupOrders();
      setOrders(response);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleQuickSearch = async () => {
    setIsSearching(true);
    try {
      const results = await deliveryService.searchPickupOrders(debouncedSearch);
      setOrders(results);
    } catch (error) {
      console.error('Search failed:', error);
      setNotificationMessage('Search failed. Please try again.');
      setShowNotification(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOrderSelect = (order: PickupOrder) => {
    setSelectedOrder(order);
    if (order.verificationRequired) {
      setShowVerificationDialog(true);
    }
  };

  const handleItemToggle = (itemId: string) => {
    if (!selectedOrder) return;

    setSelectedOrder({
      ...selectedOrder,
      items: selectedOrder.items.map(item =>
        item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
      ),
    });
  };

  const handleCustomerArrival = async (order: PickupOrder) => {
    try {
      await pickupNotificationService.sendCustomerArrivalNotification({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        estimatedPickupTime: new Date().toISOString(),
        status: order.status,
        type: 'arrival'
      });
      
      setSelectedOrder(order);
      setShowVerificationDialog(true);
    } catch (error) {
      console.error('Failed to process customer arrival:', error);
      setNotificationMessage('Failed to process customer arrival');
      setShowNotification(true);
    }
  };

  const captureIDPhoto = () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      setIdPhotoTaken(photo);
    }
  };

  const handleVerification = async () => {
    if (!selectedOrder || !signature || !idVerified || !idPhotoTaken) {
      setNotificationMessage('Please complete all verification steps');
      setShowNotification(true);
      return;
    }

    try {
      const selectedItems = selectedOrder.items.filter(item => item.isSelected);
      const isPartialPickup = selectedItems.length < selectedOrder.items.length;

      await deliveryService.confirmPickup({
        orderId: selectedOrder.id,
        items: selectedItems.map(item => item.id),
        signature: signature.toDataURL(),
        idPhoto: idPhotoTaken,
        isPartialPickup,
        verificationDetails: {
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'current-user-id', // Replace with actual user ID
          idVerified: true,
          photoVerified: true
        }
      });

      // Update order status and send notifications
      const newStatus = isPartialPickup ? 'partial' : 'completed';
      setOrders(orders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      ));

      if (isPartialPickup) {
        const remainingItems = selectedOrder.items.filter(item => !item.isSelected);
        await pickupNotificationService.sendPickupReminderNotification({
          orderId: selectedOrder.id,
          orderNumber: selectedOrder.orderNumber,
          customerName: selectedOrder.customerName,
          customerPhone: selectedOrder.customerPhone,
          estimatedPickupTime: new Date().toISOString(),
          status: 'partial',
          type: 'reminder'
        });
      }

      setShowVerificationDialog(false);
      setSignature(null);
      setIdVerified(false);
      setIdPhotoTaken(null);
      setSelectedOrder(null);

      setNotificationMessage(`Pickup ${isPartialPickup ? 'partially ' : ''}completed successfully`);
      setShowNotification(true);
    } catch (error) {
      console.error('Failed to confirm pickup:', error);
      setNotificationMessage('Failed to process pickup');
      setShowNotification(true);
    }
  };

  const handleLocationUpdate = async (orderId: string, locationId: string) => {
    try {
      await deliveryService.updateOrderLocation(orderId, locationId);
      loadOrders(); // Reload orders to reflect changes
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size="grow">
            <Typography variant="h6">Pickup Management</Typography>
          </Grid>
          <Grid>
            <Autocomplete
              freeSolo
              options={orders}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : `#${option.orderNumber} - ${option.customerName}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Search by order # or customer"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isSearching ? (
                          <CircularProgress size={20} />
                        ) : (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <MdQrCodeScanner />
                            </IconButton>
                          </InputAdornment>
                        )}
                      </>
                    ),
                  }}
                />
              )}
              onChange={(event, value) => {
                if (typeof value !== 'string' && value) {
                  handleCustomerArrival(value);
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <OrderStaging
          onLocationUpdate={handleLocationUpdate}
          onPriorityUpdate={(orderId, priority) => {
            // Handle priority updates
          }}
        />

        <Typography variant="h6" gutterBottom>
          Pickup Orders
        </Typography>
        <List>
          {filteredOrders.map(order => (
            <Paper key={order.id} sx={{ mb: 2, p: 2 }}>
              <ListItem
                secondaryAction={
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'completed' ? 'success' :
                      order.status === 'partial' ? 'warning' :
                      order.status === 'ready' ? 'primary' : 'default'
                    }
                  />
                }
              >
                <ListItemButton onClick={() => handleOrderSelect(order)}>
                  <ListItemText
                    primary={`#${order.orderNumber} - ${order.customerName}`}
                    secondary={`Location: ${order.location} | Items: ${order.items.length}`}
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Box>

      <Dialog
        open={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Verify Pickup - Order #{selectedOrder?.orderNumber}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" gutterBottom>
                Customer Information
              </Typography>
              <Typography>
                Name: {selectedOrder?.customerName}
                <br />
                Order #: {selectedOrder?.orderNumber}
                <br />
                Items: {selectedOrder?.items.length}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ID Verification
                </Typography>
                {!idPhotoTaken ? (
                  <>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 320,
                        height: 240,
                        facingMode: "user"
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<MdPhotoCamera />}
                      onClick={captureIDPhoto}
                      sx={{ mt: 1 }}
                    >
                      Capture ID
                    </Button>
                  </>
                ) : (
                  <Box>
                    <img src={idPhotoTaken} alt="ID" style={{ maxWidth: '100%' }} />
                    <Button
                      variant="outlined"
                      onClick={() => setIdPhotoTaken(null)}
                      sx={{ mt: 1 }}
                    >
                      Retake
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Items for Pickup
              </Typography>
              <List>
                {selectedOrder?.items.map(item => (
                  <ListItem key={item.id}>
                    <Checkbox
                      checked={item.isSelected}
                      onChange={() => handleItemToggle(item.id)}
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Customer Signature
                </Typography>
                <Paper sx={{ border: '1px solid #ccc', p: 2 }}>
                  <SignaturePad
                    canvasProps={{ width: 500, height: 200 }}
                    ref={(ref) => setSignature(ref)}
                  />
                </Paper>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={idVerified}
                      onChange={(e) => setIdVerified(e.target.checked)}
                    />
                  }
                  label="ID Verified"
                  sx={{ mt: 1 }}
                />
                <Button
                  size="small"
                  onClick={() => signature?.clear()}
                  sx={{ mt: 1 }}
                >
                  Clear Signature
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVerificationDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleVerification}
            variant="contained"
            disabled={!idPhotoTaken || !signature || signature.isEmpty()}
          >
            Confirm Pickup
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 