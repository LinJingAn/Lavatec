import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PromotionStatus } from '../../models/Promotion';
import { PromotionService } from '../../services/PromotionService';
import type { Promotion } from '../../services/promotionApiService';
import { PromotionList } from '../../components/promotions/PromotionList';
import { PromotionForm } from '../../components/promotions/PromotionForm';
import { PromotionAnalytics } from '../../components/promotions/PromotionAnalytics';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

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
      id={`promotion-tabpanel-${index}`}
      aria-labelledby={`promotion-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PromotionsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const promotionService = PromotionService.getInstance();

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionService.getActivePromotions();
      setPromotions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load promotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreatePromotion = () => {
    setSelectedPromotion(null);
    setIsFormOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPromotion(null);
  };

  const handleFormSubmit = async (promotionData: Partial<Promotion>) => {
    try {
      setLoading(true);
      if (selectedPromotion) {
        // Update existing promotion
        // Map API status to model PromotionStatus for updatePromotionStatus
        const status = promotionData.status;
        if (status) {
          // Map 'inactive' to 'paused' for the model type
          const modelStatus: PromotionStatus = status === 'inactive' ? 'paused' : (status as PromotionStatus);
          await promotionService.updatePromotionStatus(selectedPromotion.id, modelStatus);
        }
      } else {
        // Create new promotion - promotionData is already in API format from PromotionForm
        await promotionService.createPromotion(promotionData as Omit<
          Promotion,
          'id' | 'created_at' | 'updated_at'
        >);
      }
      await loadPromotions();
      handleFormClose();
    } catch (err) {
      setError('Failed to save promotion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Promoções</h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie suas promoções e campanhas
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Promoção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Promoção</Label>
                <Input id="name" placeholder="Digite o nome da promoção" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Promoção</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Desconto</SelectItem>
                    <SelectItem value="bogo">Compre 1 Leve 2</SelectItem>
                    <SelectItem value="free">Produto Grátis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="value">Valor do Desconto</Label>
                <Input id="value" type="number" placeholder="Digite o valor" />
              </div>

              <Button>Criar Promoção</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promoções Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Nenhuma promoção ativa no momento.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Active Promotions" />
          <Tab label="Analytics" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <PromotionList
            promotions={promotions}
            onEdit={handleEditPromotion}
            onRefresh={loadPromotions}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <PromotionAnalytics promotions={promotions} />
        </TabPanel>
      </Card>

      <PromotionForm
        open={isFormOpen}
        promotion={selectedPromotion}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default PromotionsPage; 