import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Promotion, PromotionAnalytics as PromotionAnalyticsType } from '../../models/Promotion';
import { PromotionService } from '../../services/PromotionService';

interface PromotionAnalyticsProps {
  promotions: Promotion[];
}

export const PromotionAnalytics: React.FC<PromotionAnalyticsProps> = ({ promotions }) => {
  const [selectedPromotion, setSelectedPromotion] = useState<string>('');
  const [analytics, setAnalytics] = useState<PromotionAnalyticsType | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const promotionService = PromotionService.getInstance();

  useEffect(() => {
    if (selectedPromotion) {
      loadAnalytics();
    }
  }, [selectedPromotion, timeframe]);

  const loadAnalytics = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (timeframe) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const data = await promotionService.getPromotionAnalytics(
        selectedPromotion,
        startDate,
        endDate
      );
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handlePromotionChange = (event: SelectChangeEvent) => {
    setSelectedPromotion(event.target.value);
  };

  const handleTimeframeChange = (event: SelectChangeEvent) => {
    setTimeframe(event.target.value as 'week' | 'month' | 'year');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getChartData = () => {
    if (!analytics) return [];

    return [
      {
        name: 'Usage',
        value: analytics.totalUsage,
      },
      {
        name: 'Discount Amount',
        value: analytics.totalDiscountAmount,
      },
      {
        name: 'Revenue Impact',
        value: Math.abs(analytics.revenueImpact),
      },
    ];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Promotion</InputLabel>
            <Select
              value={selectedPromotion}
              onChange={handlePromotionChange}
              label="Select Promotion"
            >
              {promotions.map((promotion) => (
                <MenuItem key={promotion.id} value={promotion.id}>
                  {promotion.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Timeframe</InputLabel>
            <Select value={timeframe} onChange={handleTimeframeChange} label="Timeframe">
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {analytics && (
          <>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Usage
                  </Typography>
                  <Typography variant="h4">{analytics.totalUsage}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Discount Amount
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(analytics.totalDiscountAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4">
                    {formatPercentage(analytics.customerConversionRate)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) =>
                            typeof value === 'number' ? formatCurrency(value) : value
                          }
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}; 