import { config } from '../config/env.js';

// SMS Service Interface
export interface SMSOptions {
  to: string;
  message: string;
  from?: string;
}

// SMS Provider Interface (can be implemented by Twilio, AWS SNS, etc.)
interface SMSProvider {
  sendSMS(options: SMSOptions): Promise<void>;
}

// Mock SMS Provider for development/testing
class MockSMSProvider implements SMSProvider {
  async sendSMS(options: SMSOptions): Promise<void> {
    console.log('📱 SMS would be sent:', {
      to: options.to,
      from: options.from || 'Lavatec',
      message: options.message,
    });
  }
}

// Twilio SMS Provider
class TwilioSMSProvider implements SMSProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendSMS(options: SMSOptions): Promise<void> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    try {
      // Dynamic import to avoid requiring twilio in package.json if not used
      const twilio = await import('twilio');
      const client = twilio.default(this.accountSid, this.authToken);

      await client.messages.create({
        body: options.message,
        from: this.fromNumber,
        to: options.to,
      });

      console.log(`✅ SMS sent to ${options.to}`);
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('Twilio package not installed. Run: npm install twilio');
      }
      throw error;
    }
  }
}

// AWS SNS Provider
class AWSSNSProvider implements SMSProvider {
  private region: string;
  private accessKeyId?: string;
  private secretAccessKey?: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  }

  async sendSMS(options: SMSOptions): Promise<void> {
    if (!this.accessKeyId || !this.secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    try {
      // Dynamic import to avoid requiring aws-sdk in package.json if not used
      const { SNSClient, PublishCommand } = await import('@aws-sdk/client-sns');
      const snsClient = new SNSClient({
        region: this.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });

      const command = new PublishCommand({
        PhoneNumber: options.to,
        Message: options.message,
      });

      await snsClient.send(command);
      console.log(`✅ SMS sent to ${options.to} via AWS SNS`);
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('AWS SDK package not installed. Run: npm install @aws-sdk/client-sns');
      }
      throw error;
    }
  }
}

// Initialize SMS provider based on environment
const getSMSProvider = (): SMSProvider => {
  const provider = process.env.SMS_PROVIDER || 'mock';

  switch (provider.toLowerCase()) {
    case 'twilio':
      return new TwilioSMSProvider();
    case 'aws':
    case 'aws-sns':
      return new AWSSNSProvider();
    case 'mock':
    default:
      return new MockSMSProvider();
  }
};

const smsProvider = getSMSProvider();

export const smsService = {
  /**
   * Send an SMS message
   */
  async sendSMS(options: SMSOptions): Promise<void> {
    try {
      // Validate phone number format (basic validation)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(options.to)) {
        throw new Error(`Invalid phone number format: ${options.to}`);
      }

      await smsProvider.sendSMS({
        to: options.to,
        message: options.message,
        from: options.from || 'Lavatec',
      });
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  },

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmationSMS(
    phone: string,
    orderNumber: string,
    customerName: string,
    promisedDate: string
  ): Promise<void> {
    const message = `Olá ${customerName}! Seu pedido ${orderNumber} foi criado com sucesso. Data prometida: ${promisedDate}. Obrigado por escolher Lavatec!`;
    
    await this.sendSMS({
      to: phone,
      message,
    });
  },

  /**
   * Send order status update SMS
   */
  async sendOrderStatusUpdateSMS(
    phone: string,
    orderNumber: string,
    status: string,
    customerName: string
  ): Promise<void> {
    const statusMessages: Record<string, string> = {
      'in_progress': 'em andamento',
      'washing': 'sendo lavado',
      'drying': 'sendo secado',
      'ironing': 'sendo passado',
      'ready': 'pronto para retirada',
      'completed': 'concluído',
      'delivered': 'entregue',
    };

    const statusText = statusMessages[status.toLowerCase()] || status;
    const message = `Olá ${customerName}! Seu pedido ${orderNumber} está ${statusText}. Acompanhe seu pedido em nosso sistema.`;

    await this.sendSMS({
      to: phone,
      message,
    });
  },

  /**
   * Send order ready for pickup SMS
   */
  async sendOrderReadySMS(
    phone: string,
    orderNumber: string,
    customerName: string,
    branchName?: string
  ): Promise<void> {
    const branchInfo = branchName ? ` na unidade ${branchName}` : '';
    const message = `Olá ${customerName}! Seu pedido ${orderNumber} está pronto para retirada${branchInfo}. Obrigado por escolher Lavatec!`;

    await this.sendSMS({
      to: phone,
      message,
    });
  },

  /**
   * Send delivery notification SMS
   */
  async sendDeliveryNotificationSMS(
    phone: string,
    orderNumber: string,
    customerName: string,
    trackingNumber: string,
    estimatedTime?: string
  ): Promise<void> {
    const timeInfo = estimatedTime ? ` às ${estimatedTime}` : '';
    const message = `Olá ${customerName}! Seu pedido ${orderNumber} está a caminho. Código de rastreamento: ${trackingNumber}${timeInfo}.`;

    await this.sendSMS({
      to: phone,
      message,
    });
  },

  /**
   * Send password reset SMS (if phone verification is enabled)
   */
  async sendPasswordResetSMS(
    phone: string,
    resetCode: string,
    customerName: string
  ): Promise<void> {
    const message = `Olá ${customerName}! Seu código de redefinição de senha é: ${resetCode}. Este código expira em 10 minutos.`;

    await this.sendSMS({
      to: phone,
      message,
    });
  },

  /**
   * Send promotional SMS
   */
  async sendPromotionalSMS(
    phone: string,
    message: string,
    customerName?: string
  ): Promise<void> {
    const personalizedMessage = customerName
      ? `Olá ${customerName}! ${message}`
      : message;

    await this.sendSMS({
      to: phone,
      message: personalizedMessage,
    });
  },
};

export default smsService;
