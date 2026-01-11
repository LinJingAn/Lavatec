import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Promotion, PromotionStatus } from '../../models/Promotion';
import { PromotionService } from '../../services/PromotionService';

interface PromotionListProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onRefresh: () => void;
}

export const PromotionList: React.FC<PromotionListProps> = ({
  promotions,
  onEdit,
  onRefresh,
}) => {
  const promotionService = PromotionService.getInstance();

  const getStatusColor = (status: PromotionStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'expired':
        return 'error';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      const newStatus: PromotionStatus = promotion.status === 'active' ? 'paused' : 'active';
      await promotionService.updatePromotionStatus(promotion.id, newStatus);
      onRefresh();
    } catch (error) {
      console.error('Error updating promotion status:', error);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>
                  <Box>
                    <strong>{promotion.name}</strong>
                    <br />
                    <small>{promotion.description}</small>
                  </Box>
                </TableCell>
                <TableCell>
                  {promotion.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </TableCell>
                <TableCell>
                  {promotion.discountType === 'percentage'
                    ? `${promotion.discountValue}%`
                    : `$${promotion.discountValue.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  <Box>
                    <div>From: {formatDate(promotion.startDate)}</div>
                    {promotion.endDate && <div>To: {formatDate(promotion.endDate)}</div>}
                  </Box>
                </TableCell>
                <TableCell>
                  {promotion.currentUsageCount}
                  {promotion.maxUsageCount && ` / ${promotion.maxUsageCount}`}
                </TableCell>
                <TableCell>
                  <Chip
                    label={promotion.status}
                    color={getStatusColor(promotion.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(promotion)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={promotion.status === 'active' ? 'Pause' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleStatus(promotion)}
                    >
                      {promotion.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 