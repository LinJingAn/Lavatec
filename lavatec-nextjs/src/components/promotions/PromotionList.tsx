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
import { PromotionStatus } from '../../models/Promotion';
import { PromotionService } from '../../services/PromotionService';
import type { Promotion } from '../../services/promotionApiService';

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

  const getStatusColor = (status: 'active' | 'inactive' | 'expired') => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date | string) => {
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
                  {promotion.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </TableCell>
                <TableCell>
                  {promotion.discount_type === 'percentage'
                    ? `${promotion.discount_value}%`
                    : `$${promotion.discount_value.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  <Box>
                    <div>From: {formatDate(promotion.start_date)}</div>
                    {promotion.end_date && <div>To: {formatDate(promotion.end_date)}</div>}
                  </Box>
                </TableCell>
                <TableCell>
                  {promotion.usage_count || 0}
                  {promotion.max_usage_count && ` / ${promotion.max_usage_count}`}
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