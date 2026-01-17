import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  MenuItem, 
  Button, 
  Typography, 
  Box, 
  Divider, 
  Grid, 
  FormControlLabel, 
  Switch, 
  Chip
} from '@mui/material';
import { LocalLaundryService, Speed, Receipt } from '@mui/icons-material';
import usePricing, { PriceCalculationParams } from '../../hooks/usePricing';
import { formatCurrency } from '../../utils/formatters';
import { PriceCalculatorResult, AppliedRule } from '../../models/PricingTable';

const PriceCalculator: React.FC = () => {
  const { 
    serviceTypes, 
    garmentTypes, 
    isLoading, 
    error, 
    calculatePrice
  } = usePricing();

  const [calculationParams, setCalculationParams] = useState<PriceCalculationParams>({
    serviceTypeId: '',
    garmentTypeId: '',
    quantity: 1,
    isExpress: false,
    customerType: 'standard'
  });

  const [priceResult, setPriceResult] = useState<any>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    if (serviceTypes.length > 0 && !calculationParams.serviceTypeId) {
      setCalculationParams(prev => ({
        ...prev,
        serviceTypeId: serviceTypes[0].id
      }));
    }
  }, [serviceTypes]);

  useEffect(() => {
    if (garmentTypes.length > 0 && !calculationParams.garmentTypeId) {
      setCalculationParams(prev => ({
        ...prev,
        garmentTypeId: garmentTypes[0].id
      }));
    }
  }, [garmentTypes]);

  const handleParamChange = (field: keyof PriceCalculationParams) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : field === 'quantity' 
        ? parseInt(event.target.value) || 1
        : event.target.value;
    
    setCalculationParams(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (hasCalculated) {
      setHasCalculated(false);
      setPriceResult(null);
    }
  };

  const handleCalculatePrice = () => {
    const result = calculatePrice(calculationParams);
    setPriceResult(result);
    setHasCalculated(true);
  };

  if (isLoading) return <Typography>Loading pricing data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Receipt sx={{ mr: 1 }} />
          Calculadora de Preços
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                select
                fullWidth
                label="Tipo de Serviço"
                value={calculationParams.serviceTypeId}
                onChange={handleParamChange('serviceTypeId')}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: <LocalLaundryService color="primary" sx={{ mr: 1 }} />
                }}
              >
                {serviceTypes.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                fullWidth
                label="Tipo de Peça"
                value={calculationParams.garmentTypeId}
                onChange={handleParamChange('garmentTypeId')}
                variant="outlined"
                margin="normal"
              >
                {garmentTypes.map((garment) => (
                  <MenuItem key={garment.id} value={garment.id}>
                    {garment.name}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={calculationParams.quantity}
                onChange={handleParamChange('quantity')}
                variant="outlined"
                margin="normal"
                inputProps={{ min: 1 }}
              />
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={calculationParams.isExpress}
                      onChange={handleParamChange('isExpress')}
                      color="primary"
                      icon={<Speed />}
                      checkedIcon={<Speed />}
                    />
                  }
                  label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Speed sx={{ mr: 1, color: calculationParams.isExpress ? 'primary.main' : 'text.disabled' }} />
                    Serviço Expresso
                  </Box>}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={handleCalculatePrice}
                  disabled={!calculationParams.serviceTypeId || !calculationParams.garmentTypeId}
                  sx={{ py: 1.5 }}
                >
                  Calcular Preço
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            {hasCalculated && (
              <>
                {priceResult ? (
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Detalhes do Preço
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        {priceResult.quantity}x {priceResult.garmentName} • {priceResult.serviceName}
                      </Typography>
                      {calculationParams.isExpress && (
                        <Chip 
                          size="small" 
                          color="secondary" 
                          icon={<Speed />} 
                          label="Expresso" 
                          sx={{ mt: 0.5 }} 
                        />
                      )}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Preço base:</Typography>
                      <Typography variant="body2">{formatCurrency(priceResult.basePrice)}</Typography>
                    </Box>
                    
                    {priceResult.expressUpcharge > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Taxa expressa ({(priceResult.expressMultiplier - 1) * 100}%):</Typography>
                        <Typography variant="body2">{formatCurrency(priceResult.expressUpcharge)}</Typography>
                      </Box>
                    )}
                    
                    {priceResult.discountAmount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Desconto ({priceResult.discount * 100}%):</Typography>
                        <Typography variant="body2" color="error">- {formatCurrency(priceResult.discountAmount)}</Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                      <Typography variant="h6" color="primary.main">{formatCurrency(priceResult.totalPrice)}</Typography>
                    </Box>
                    
                    <Box sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', p: 1.5, borderRadius: 1 }}>
                      <Typography variant="body2">
                        Tempo de processamento: {priceResult.processingTimeHours} horas
                      </Typography>
                      <Typography variant="body2">
                        Entrega estimada: {priceResult.deliveryDate.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    {priceResult.appliedRules.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Regras aplicadas:</Typography>
                        {priceResult.appliedRules.map((rule: AppliedRule) => (
                          <Chip
                            key={rule.ruleId}
                            label={rule.description}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mt: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography color="error">
                      Não foi possível calcular o preço com os parâmetros selecionados.
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {!hasCalculated && (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Typography variant="subtitle1" color="text.secondary" align="center">
                  Selecione os serviços e clique em "Calcular Preço" para ver os detalhes
                </Typography>
                <Receipt sx={{ fontSize: 80, color: 'text.disabled', my: 2 }} />
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator; 