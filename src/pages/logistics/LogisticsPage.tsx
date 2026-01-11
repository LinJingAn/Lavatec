import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  useTheme,
} from '@mui/material';
import { RouteOptimizationPanel } from '../../components/logistics/RouteOptimizationPanel';
import { PickupManagement } from '../../components/logistics/PickupManagement';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';

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
      id={`logistics-tabpanel-${index}`}
      aria-labelledby={`logistics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const LogisticsPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRouteUpdate = async (routeId: string, deliveryIds: string[]) => {
    try {
      // Handle route updates if needed
      console.log('Route updated:', routeId, deliveryIds);
    } catch (err) {
      setError('Failed to update route');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Logistics & Delivery Management
        </Typography>
      </Box>

      {error && <ErrorAlert message={error} />}

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Route Planning" />
          <Tab label="Pickup Management" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <RouteOptimizationPanel onRouteUpdate={handleRouteUpdate} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PickupManagement />
        </TabPanel>
      </Paper>
    </Container>
  );
}; 