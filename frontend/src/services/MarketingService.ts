import { api } from '../utils/api';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'push' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  target_segment?: string;
  target_count?: number;
  sent_count?: number;
  open_rate?: number;
  click_rate?: number;
  template_id?: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'promotional' | 'transactional' | 'notification';
  variables?: string[];
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  type: 'promotional' | 'transactional' | 'notification';
  variables?: string[];
  character_count?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  criteria: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
    value: any;
  }[];
  customer_count?: number;
  is_dynamic?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  points_per_currency: number; // Points earned per R$1 spent
  redemption_rate: number; // R$ value per point
  tiers: LoyaltyTier[];
  is_active?: boolean;
  created_at: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  min_points: number;
  max_points?: number;
  benefits: string[];
  discount_percentage?: number;
}

export interface CommunicationLog {
  id: string;
  customer_id: string;
  customer_name?: string;
  type: 'email' | 'sms' | 'push' | 'whatsapp';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  campaign_id?: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
}

class MarketingServiceClass {
  private static instance: MarketingServiceClass;

  private constructor() {}

  static getInstance(): MarketingServiceClass {
    if (!MarketingServiceClass.instance) {
      MarketingServiceClass.instance = new MarketingServiceClass();
    }
    return MarketingServiceClass.instance;
  }

  // Campaigns
  async getCampaigns(filters: { status?: string; type?: string } = {}): Promise<{ campaigns: Campaign[] }> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);

      const queryString = params.toString();
      const url = queryString ? `/marketing/campaigns?${queryString}` : '/marketing/campaigns';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  async getCampaignById(id: string): Promise<Campaign> {
    try {
      const response = await api.get(`/marketing/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<{ campaign: Campaign }> {
    try {
      const response = await api.post('/marketing/campaigns', campaign);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<{ campaign: Campaign }> {
    try {
      const response = await api.put(`/marketing/campaigns/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    try {
      await api.delete(`/marketing/campaigns/${id}`);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  // Email Templates
  async getEmailTemplates(): Promise<{ templates: EmailTemplate[] }> {
    try {
      const response = await api.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<{ template: EmailTemplate }> {
    try {
      const response = await api.post('/marketing/email-templates', template);
      return response.data;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<{ template: EmailTemplate }> {
    try {
      const response = await api.put(`/marketing/email-templates/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw error;
    }
  }

  async deleteEmailTemplate(id: string): Promise<void> {
    try {
      await api.delete(`/marketing/email-templates/${id}`);
    } catch (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  }

  // SMS Templates
  async getSMSTemplates(): Promise<{ templates: SMSTemplate[] }> {
    try {
      const response = await api.get('/marketing/sms-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS templates:', error);
      throw error;
    }
  }

  async createSMSTemplate(template: Omit<SMSTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<{ template: SMSTemplate }> {
    try {
      const response = await api.post('/marketing/sms-templates', template);
      return response.data;
    } catch (error) {
      console.error('Error creating SMS template:', error);
      throw error;
    }
  }

  async updateSMSTemplate(id: string, updates: Partial<SMSTemplate>): Promise<{ template: SMSTemplate }> {
    try {
      const response = await api.put(`/marketing/sms-templates/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating SMS template:', error);
      throw error;
    }
  }

  // Customer Segments
  async getSegments(): Promise<{ segments: CustomerSegment[] }> {
    try {
      const response = await api.get('/marketing/segments');
      return response.data;
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }
  }

  async createSegment(segment: Omit<CustomerSegment, 'id' | 'created_at' | 'updated_at'>): Promise<{ segment: CustomerSegment }> {
    try {
      const response = await api.post('/marketing/segments', segment);
      return response.data;
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    }
  }

  // Loyalty Program
  async getLoyaltyProgram(): Promise<LoyaltyProgram | null> {
    try {
      const response = await api.get('/marketing/loyalty');
      return response.data.program;
    } catch (error) {
      console.error('Error fetching loyalty program:', error);
      return null;
    }
  }

  async updateLoyaltyProgram(program: Partial<LoyaltyProgram>): Promise<{ program: LoyaltyProgram }> {
    try {
      const response = await api.put('/marketing/loyalty', program);
      return response.data;
    } catch (error) {
      console.error('Error updating loyalty program:', error);
      throw error;
    }
  }

  // Communication History
  async getCommunicationHistory(customerId?: string): Promise<{ logs: CommunicationLog[] }> {
    try {
      const url = customerId 
        ? `/marketing/communications?customer_id=${customerId}` 
        : '/marketing/communications';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching communication history:', error);
      throw error;
    }
  }

  // Send Communications
  async sendEmail(to: string, templateId: string, variables?: Record<string, string>): Promise<void> {
    try {
      await api.post('/marketing/send/email', { to, templateId, variables });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendSMS(to: string, templateId: string, variables?: Record<string, string>): Promise<void> {
    try {
      await api.post('/sms/send', { to, templateId, variables });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async sendWhatsApp(to: string, message: string): Promise<void> {
    try {
      await api.post('/whatsapp/send', { to, message });
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      throw error;
    }
  }
}

export const MarketingService = MarketingServiceClass.getInstance();
export default MarketingService;
