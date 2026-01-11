import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdWarning,
  MdShoppingCart,
  MdHistory,
} from 'react-icons/md';
import { SupplyItem, Vendor, PurchaseOrder, StockAlert, SupplyCategory } from '../../models/Supply';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`supply-tabpanel-${index}`}
      aria-labelledby={`supply-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const SupplyInventoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<SupplyItem | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const [suppliesData, vendorsData, alertsData] = await Promise.all([
        // supplyService.getSupplies(),
        // supplyService.getVendors(),
        // supplyService.getAlerts(),
        [], [], []
      ]);

      setSupplies(suppliesData);
      setVendors(vendorsData);
      setAlerts(alertsData);
    } catch (err) {
      setError('Failed to load supply inventory data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'success';
      case 'low_stock':
        return 'warning';
      case 'out_of_stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleAddSupply = () => {
    setSelectedSupply(null);
    setShowAddDialog(true);
  };

  const handleEditSupply = (supply: SupplyItem) => {
    setSelectedSupply(supply);
    setShowAddDialog(true);
  };

  const handleDeleteSupply = async (supplyId: string) => {
    try {
      // await supplyService.deleteSupply(supplyId);
      setSupplies(supplies.filter(s => s.id !== supplyId));
      setNotificationMessage('Supply item deleted successfully');
      setShowNotification(true);
    } catch (err) {
      setError('Failed to delete supply item');
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Supply Inventory Management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Alerts Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3, bgcolor: alerts.length > 0 ? '#fff3e0' : 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MdWarning size={24} color="#ed6c02" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Alerts ({alerts.length})
              </Typography>
            </Box>
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={alert.priority === 'high' ? 'error' : alert.priority === 'medium' ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                {alert.message}
              </Alert>
            ))}
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Inventory" />
                <Tab label="Vendors" />
                <Tab label="Purchase Orders" />
                <Tab label="Usage History" />
              </Tabs>
            </Box>

            {/* Inventory Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  startIcon={<MdAdd />}
                  onClick={handleAddSupply}
                >
                  Add Supply Item
                </Button>
                <Button
                  startIcon={<MdRefresh />}
                  onClick={loadInitialData}
                >
                  Refresh
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Current Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplies.map((supply) => (
                      <TableRow key={supply.id}>
                        <TableCell>{supply.name}</TableCell>
                        <TableCell>{supply.sku}</TableCell>
                        <TableCell>{supply.category}</TableCell>
                        <TableCell align="right">
                          {supply.currentStock} {supply.unit}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={supply.status}
                            color={getStatusColor(supply.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{supply.vendor.name}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSupply(supply)}
                          >
                            <MdEdit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSupply(supply.id)}
                          >
                            <MdDelete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Vendors Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6">Vendor Management</Typography>
              {/* TODO: Implement vendor management UI */}
            </TabPanel>

            {/* Purchase Orders Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6">Purchase Orders</Typography>
              {/* TODO: Implement purchase orders UI */}
            </TabPanel>

            {/* Usage History Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6">Usage History</Typography>
              {/* TODO: Implement usage history UI */}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Supply Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSupply ? 'Edit Supply Item' : 'Add New Supply Item'}
        </DialogTitle>
        <DialogContent>
          {/* TODO: Implement supply item form */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 