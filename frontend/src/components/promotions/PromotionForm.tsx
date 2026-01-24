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
import { DiscountType, PromotionTrigger, PromotionStatus } from '../../models/Promotion';
import { PromotionService } from '../../services/PromotionService';
import type { Promotion } from '../../services/promotionApiService';

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
  // Internal form data structure (using camelCase for form fields)
  const [formData, setFormData] = useState<{
    name?: string;
    description?: string;
    discountType?: string;
    discountValue?: number;
    trigger?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    applicableCustomerTypes?: string[];
    stackable?: boolean;
    coupon_code?: string;
    max_usage_count?: number;
    max_usage_per_customer?: number;
  }>({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    trigger: 'coupon_code',
    startDate: new Date(),
    status: 'scheduled',
    applicableCustomerTypes: [],
    stackable: false,
    coupon_code: '',
    max_usage_count: 0,
    max_usage_per_customer: 0,
  });

  const [generateCoupon, setGenerateCoupon] = useState(false);
  const promotionService = PromotionService.getInstance();

  useEffect(() => {
    if (promotion) {
      // Convert API promotion (snake_case) to form data (camelCase)
      setFormData({
        name: promotion.name,
        description: promotion.description || '',
        discountType: promotion.discount_type,
        discountValue: promotion.discount_value,
        trigger: promotion.trigger,
        startDate: new Date(promotion.start_date),
        endDate: promotion.end_date ? new Date(promotion.end_date) : undefined,
        status: promotion.status,
        applicableCustomerTypes: promotion.applicable_customer_types || [],
        stackable: promotion.stackable,
        coupon_code: promotion.coupon_code || '',
        max_usage_count: promotion.max_usage_count || 0,
        max_usage_per_customer: promotion.max_usage_per_customer || 0,
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
      coupon_code: '',
      max_usage_count: 0,
      max_usage_per_customer: 0,
    });
    setGenerateCoupon(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateCouponChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenerateCoupon(event.target.checked);
    if (event.target.checked) {
      const code = await promotionService.generateCouponCode();
      handleInputChange('coupon_code', code);
    } else {
      handleInputChange('coupon_code', undefined);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Convert form data (camelCase) to API format (snake_case)
    const apiData: Partial<Promotion> = {
      name: formData.name,
      description: formData.description,
      discount_type: formData.discountType as 'percentage' | 'fixed',
      discount_value: formData.discountValue,
      trigger: formData.trigger,
      start_date: formData.startDate?.toISOString().split('T')[0],
      end_date: formData.endDate?.toISOString().split('T')[0],
      status: formData.status as 'active' | 'inactive' | 'expired',
      applicable_customer_types: formData.applicableCustomerTypes,
      stackable: formData.stackable,
    };
    onSubmit(apiData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {promotion ? 'Edit Promotion' : 'Create New Promotion'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Promotion Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12, md: 6 }}>
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
                      value={formData.coupon_code}
                      disabled
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  ) : (
                    <TextField
                      label="Coupon Code"
                      value={formData.coupon_code}
                      onChange={(e) => handleInputChange('coupon_code', e.target.value)}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  )}
                </FormControl>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="End Date (Optional)"
                value={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Usage Count"
                value={formData.max_usage_count}
                onChange={(e) => handleInputChange('max_usage_count', parseInt(e.target.value))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Usage Per Customer"
                value={formData.max_usage_per_customer}
                onChange={(e) => handleInputChange('max_usage_per_customer', parseInt(e.target.value))}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
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