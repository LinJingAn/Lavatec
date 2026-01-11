import React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Delivery, DeliveryStatus } from '../../models/Delivery';

interface DeliveryListProps {
  deliveries: Delivery[];
  selectedStatus: DeliveryStatus;
  onStatusChange: (status: DeliveryStatus) => void;
  onDeliveryUpdate: (deliveryId: string, status: DeliveryStatus) => void;
  onRefresh: () => void;
}

export const DeliveryList: React.FC<DeliveryListProps> = ({
  deliveries,
  selectedStatus,
  onStatusChange,
  onDeliveryUpdate,
  onRefresh,
}) => {
  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'error';
      case 'assigned':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusActions = (delivery: Delivery) => {
    switch (delivery.status) {
      case 'pending':
        return (
          <>
            <Tooltip title="Schedule">
              <IconButton
                size="small"
                onClick={() => onDeliveryUpdate(delivery.id, 'scheduled')}
              >
                <ScheduleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={() => onDeliveryUpdate(delivery.id, 'cancelled')}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'scheduled':
        return (
          <Tooltip title="Start Delivery">
            <IconButton
              size="small"
              onClick={() => onDeliveryUpdate(delivery.id, 'in_progress')}
            >
              <LocalShippingIcon />
            </IconButton>
          </Tooltip>
        );
      case 'in_progress':
        return (
          <Tooltip title="Complete">
            <IconButton
              size="small"
              onClick={() => onDeliveryUpdate(delivery.id, 'completed')}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as DeliveryStatus)}
            label="Status Filter"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tracking #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {delivery.trackingNumber}
                  </Typography>
                </TableCell>
                <TableCell>{delivery.customerId}</TableCell>
                <TableCell>
                  <Chip
                    label={delivery.method}
                    size="small"
                    color={delivery.method === 'delivery' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {delivery.address.streetAddress}
                    {delivery.address.unit && `, Unit ${delivery.address.unit}`}
                    <br />
                    {delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  {formatDate(delivery.scheduledDate)}
                  <Typography variant="caption" display="block">
                    {delivery.timeSlot.startTime} - {delivery.timeSlot.endTime}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={delivery.status}
                    size="small"
                    color={getStatusColor(delivery.status)}
                  />
                </TableCell>
                <TableCell>
                  {delivery.driverId || '-'}
                </TableCell>
                <TableCell align="right">
                  {getStatusActions(delivery)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 