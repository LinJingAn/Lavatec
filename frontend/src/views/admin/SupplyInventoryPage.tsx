import React, { useState, useEffect, useCallback } from 'react';
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
  MdWarning,
  MdShoppingCart,
  MdHistory,
} from 'react-icons/md';
import { InventoryService, InventoryItem, Supplier, PurchaseOrder, StockMovement } from '../../services';
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

const SupplyInventoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [supplies, setSupplies] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Supplier[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<InventoryItem | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'error'>('success');

  // Form state for new item
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    sku: '',
    unit: 'un',
    quantity: 0,
    min_quantity: 0,
    unit_cost: 0,
    supplier_id: '',
    location: '',
  });

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [itemsResult, suppliersResult, movementsResult, ordersResult, lowStockResult] = await Promise.all([
        InventoryService.getItems().catch(() => ({ items: [], total: 0 })),
        InventoryService.getSuppliers().catch(() => ({ suppliers: [] })),
        InventoryService.getStockMovements().catch(() => ({ movements: [] })),
        InventoryService.getPurchaseOrders().catch(() => ({ orders: [] })),
        InventoryService.getLowStockItems().catch(() => ({ items: [] })),
      ]);

      setSupplies(itemsResult.items || []);
      setVendors(suppliersResult.suppliers || []);
      setMovements(movementsResult.movements || []);
      setPurchaseOrders(ordersResult.orders || []);
      setLowStockItems(lowStockResult.items || []);
    } catch (err) {
      setError('Failed to load supply inventory data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'low_stock':
        return 'warning';
      case 'out_of_stock':
        return 'error';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Em Estoque';
      case 'low_stock':
        return 'Baixo Estoque';
      case 'out_of_stock':
        return 'Sem Estoque';
      case 'expired':
        return 'Expirado';
      default:
        return status;
    }
  };

  const handleAddSupply = () => {
    setSelectedSupply(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      sku: '',
      unit: 'un',
      quantity: 0,
      min_quantity: 0,
      unit_cost: 0,
      supplier_id: '',
      location: '',
    });
    setShowAddDialog(true);
  };

  const handleEditSupply = (supply: InventoryItem) => {
    setSelectedSupply(supply);
    setFormData({
      name: supply.name,
      description: supply.description || '',
      category: supply.category,
      sku: supply.sku || '',
      unit: supply.unit,
      quantity: supply.quantity,
      min_quantity: supply.min_quantity,
      unit_cost: supply.unit_cost,
      supplier_id: supply.supplier_id || '',
      location: supply.location || '',
    });
    setShowAddDialog(true);
  };

  const handleDeleteSupply = async (supplyId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      await InventoryService.deleteItem(supplyId);
      setSupplies(supplies.filter(s => s.id !== supplyId));
      setNotificationMessage('Item excluído com sucesso');
      setNotificationSeverity('success');
      setShowNotification(true);
    } catch (err) {
      setNotificationMessage('Erro ao excluir item');
      setNotificationSeverity('error');
      setShowNotification(true);
      console.error(err);
    }
  };

  const handleSaveSupply = async () => {
    try {
      if (selectedSupply) {
        // Update existing item
        await InventoryService.updateItem(selectedSupply.id, formData);
        setNotificationMessage('Item atualizado com sucesso');
      } else {
        // Create new item
        await InventoryService.createItem(formData);
        setNotificationMessage('Item criado com sucesso');
      }
      
      setNotificationSeverity('success');
      setShowNotification(true);
      setShowAddDialog(false);
      loadInitialData();
    } catch (err) {
      setNotificationMessage('Erro ao salvar item');
      setNotificationSeverity('error');
      setShowNotification(true);
      console.error(err);
    }
  };

  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom className="text-gray-900 dark:text-white">
          Gerenciamento de Estoque
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Alerts Section */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, mb: 3 }} className="bg-white dark:bg-slate-800">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MdWarning size={24} className="text-amber-500" />
              <Typography variant="h6" sx={{ ml: 1 }} className="text-gray-900 dark:text-white">
                Alertas ({lowStockItems.length})
              </Typography>
            </Box>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <Alert
                  key={item.id}
                  severity="warning"
                  sx={{ mb: 1 }}
                >
                  {item.name} - Estoque baixo: {item.quantity} {item.unit} (Mínimo: {item.min_quantity})
                </Alert>
              ))
            ) : (
              <Typography className="text-gray-600 dark:text-gray-400">
                Nenhum alerta de estoque no momento.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ width: '100%' }} className="bg-white dark:bg-slate-800">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'inherit',
                    '&.Mui-selected': {
                      color: '#10b981',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#10b981',
                  },
                }}
              >
                <Tab label="Inventário" className="text-gray-700 dark:text-gray-300" />
                <Tab label="Fornecedores" className="text-gray-700 dark:text-gray-300" />
                <Tab label="Pedidos de Compra" className="text-gray-700 dark:text-gray-300" />
                <Tab label="Histórico de Movimentação" className="text-gray-700 dark:text-gray-300" />
              </Tabs>
            </Box>

            {/* Inventory Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  startIcon={<MdAdd />}
                  onClick={handleAddSupply}
                  sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Adicionar Item
                </Button>
                <Button
                  startIcon={<MdRefresh />}
                  onClick={loadInitialData}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Atualizar
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-gray-700 dark:text-gray-300">Nome</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">SKU</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Categoria</TableCell>
                      <TableCell align="right" className="text-gray-700 dark:text-gray-300">Estoque Atual</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Status</TableCell>
                      <TableCell align="right" className="text-gray-700 dark:text-gray-300">Custo Unit.</TableCell>
                      <TableCell align="right" className="text-gray-700 dark:text-gray-300">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplies.length > 0 ? (
                      supplies.map((supply) => (
                        <TableRow key={supply.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <TableCell className="text-gray-900 dark:text-white">{supply.name}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{supply.sku || 'N/A'}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{supply.category}</TableCell>
                          <TableCell align="right" className="text-gray-900 dark:text-white">
                            {supply.quantity} {supply.unit}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(supply.status)}
                              color={getStatusColor(supply.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" className="text-gray-900 dark:text-white">
                            R$ {supply.unit_cost.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSupply(supply)}
                              className="text-gray-600 dark:text-gray-400"
                            >
                              <MdEdit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteSupply(supply.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <MdDelete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" className="text-gray-500 dark:text-gray-400">
                          Nenhum item no inventário
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Vendors Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                Fornecedores
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-gray-700 dark:text-gray-300">Nome</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Contato</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Email</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Telefone</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <TableRow key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <TableCell className="text-gray-900 dark:text-white">{vendor.name}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{vendor.contact_name || 'N/A'}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{vendor.email || 'N/A'}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{vendor.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={vendor.is_active !== false ? 'Ativo' : 'Inativo'}
                              color={vendor.is_active !== false ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" className="text-gray-500 dark:text-gray-400">
                          Nenhum fornecedor cadastrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Purchase Orders Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                Pedidos de Compra
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-gray-700 dark:text-gray-300">ID</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Fornecedor</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Status</TableCell>
                      <TableCell align="right" className="text-gray-700 dark:text-gray-300">Total</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Data Esperada</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrders.length > 0 ? (
                      purchaseOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <TableCell className="text-gray-900 dark:text-white">{order.id}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{order.supplier_name || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={order.status === 'received' ? 'success' : order.status === 'pending' ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" className="text-gray-900 dark:text-white">
                            R$ {order.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {order.expected_date ? new Date(order.expected_date).toLocaleDateString('pt-BR') : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" className="text-gray-500 dark:text-gray-400">
                          Nenhum pedido de compra
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Usage History Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                Histórico de Movimentação
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-gray-700 dark:text-gray-300">Data</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Item</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Tipo</TableCell>
                      <TableCell align="right" className="text-gray-700 dark:text-gray-300">Quantidade</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">Motivo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movements.length > 0 ? (
                      movements.map((movement) => (
                        <TableRow key={movement.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {new Date(movement.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">{movement.item_name || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={movement.type === 'in' ? 'Entrada' : movement.type === 'out' ? 'Saída' : movement.type}
                              color={movement.type === 'in' ? 'success' : movement.type === 'out' ? 'error' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right" className="text-gray-900 dark:text-white">
                            {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{movement.reason || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" className="text-gray-500 dark:text-gray-400">
                          Nenhuma movimentação registrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
        PaperProps={{
          className: 'bg-white dark:bg-slate-800'
        }}
      >
        <DialogTitle className="text-gray-900 dark:text-white">
          {selectedSupply ? 'Editar Item' : 'Adicionar Novo Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => handleFormChange('sku', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Categoria"
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Unidade</InputLabel>
                <Select
                  value={formData.unit}
                  label="Unidade"
                  onChange={(e) => handleFormChange('unit', e.target.value)}
                >
                  <MenuItem value="un">Unidade</MenuItem>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="L">Litro</MenuItem>
                  <MenuItem value="m">Metro</MenuItem>
                  <MenuItem value="cx">Caixa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', Number(e.target.value))}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Quantidade Mínima"
                type="number"
                value={formData.min_quantity}
                onChange={(e) => handleFormChange('min_quantity', Number(e.target.value))}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Custo Unitário (R$)"
                type="number"
                value={formData.unit_cost}
                onChange={(e) => handleFormChange('unit_cost', Number(e.target.value))}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Fornecedor</InputLabel>
                <Select
                  value={formData.supplier_id}
                  label="Fornecedor"
                  onChange={(e) => handleFormChange('supplier_id', e.target.value)}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {vendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Localização"
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)} className="text-gray-600 dark:text-gray-400">
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveSupply}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
          >
            Salvar
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
          severity={notificationSeverity}
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupplyInventoryPage;
export { SupplyInventoryPage };
