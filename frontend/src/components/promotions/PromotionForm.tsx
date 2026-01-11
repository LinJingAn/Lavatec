import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Promotion, DiscountType, PromotionTrigger, PromotionStatus } from '../../models/Promotion';
import { PromotionService } from '../../services/PromotionService';

interface PromotionFormProps {
  open: boolean;
  promotion: Promotion | null;
  onClose: () => void;
  onSubmit: (promotion: Partial<Promotion>) => void;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({
  open,
  promotion,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    trigger: 'coupon_code',
    startDate: new Date(),
    status: 'scheduled',
    applicableCustomerTypes: [],
    stackable: false,
  });

  const [generateCoupon, setGenerateCoupon] = useState(false);
  const promotionService = PromotionService.getInstance();

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        startDate: new Date(promotion.startDate),
        endDate: promotion.endDate ? new Date(promotion.endDate) : undefined,
      });
    } else {
      resetForm();
    }
  }, [promotion]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      trigger: 'coupon_code',
      startDate: new Date(),
      status: 'scheduled',
      applicableCustomerTypes: [],
      stackable: false,
    });
    setGenerateCoupon(false);
  };

  const handleInputChange = (field: keyof Promotion, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateCouponChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenerateCoupon(event.target.checked);
    if (event.target.checked) {
      const code = await promotionService.generateCouponCode();
      handleInputChange('couponCode', code);
    } else {
      handleInputChange('couponCode', undefined);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {promotion ? 'Edit Promotion' : 'Create New Promotion'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Promotion Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.discountType}
                  onChange={(e) => handleInputChange('discountType', e.target.value)}
                  label="Discount Type"
                  required
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed_amount">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={formData.discountType === 'percentage' ? 'Percentage' : 'Amount'}
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: formData.discountType === 'fixed_amount' ? '$' : '',
                  endAdornment: formData.discountType === 'percentage' ? '%' : '',
                }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Trigger Type</InputLabel>
                <Select
                  value={formData.trigger}
                  onChange={(e) => handleInputChange('trigger', e.target.value)}
                  label="Trigger Type"
                  required
                >
                  <MenuItem value="coupon_code">Coupon Code</MenuItem>
                  <MenuItem value="order_value">Order Value</MenuItem>
                  <MenuItem value="order_frequency">Order Frequency</MenuItem>
                  <MenuItem value="first_order">First Order</MenuItem>
                  <MenuItem value="seasonal">Seasonal</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              {formData.trigger === 'coupon_code' && (
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generateCoupon}
                        onChange={handleGenerateCouponChange}
                      />
                    }
                    label="Generate Coupon Code"
                  />
                  {generateCoupon ? (
                    <TextField
                      value={formData.couponCode}
                      disabled
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  ) : (
                    <TextField
                      label="Coupon Code"
                      value={formData.couponCode}
                      onChange={(e) => handleInputChange('couponCode', e.target.value)}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  )}
                </FormControl>
              )}
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="End Date (Optional)"
                value={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Usage Count"
                value={formData.maxUsageCount}
                onChange={(e) => handleInputChange('maxUsageCount', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Usage Per Customer"
                value={formData.maxUsagePerCustomer}
                onChange={(e) => handleInputChange('maxUsagePerCustomer', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.stackable}
                    onChange={(e) => handleInputChange('stackable', e.target.checked)}
                  />
                }
                label="Allow stacking with other promotions"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {promotion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 