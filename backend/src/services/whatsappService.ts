import { config } from '../config/env.js';

// WhatsApp Message Options
export interface WhatsAppMessageOptions {
  to: string;
  message: string;
  mediaUrl?: string;
}

// WhatsApp Template Message Options (for Business API)
export interface WhatsAppTemplateOptions {
  to: string;
  templateName: string;
  templateParams?: string[];
  language?: string;
}

// WhatsApp Provider Interface
interface WhatsAppProvider {
  sendMessage(options: WhatsAppMessageOptions): Promise<void>;
  sendTemplateMessage?(options: WhatsAppTemplateOptions): Promise<void>;
}

// Mock WhatsApp Provider for development/testing
class MockWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(options: WhatsAppMessageOptions): Promise<void> {
    console.log('📱 WhatsApp message would be sent:', {
      to: options.to,
      message: options.message,
      mediaUrl: options.mediaUrl,
    });
  }

  async sendTemplateMessage(options: WhatsAppTemplateOptions): Promise<void> {
    console.log('📱 WhatsApp template message would be sent:', {
      to: options.to,
      template: options.templateName,
      params: options.templateParams,
    });
  }
}

// Twilio WhatsApp Provider
class TwilioWhatsAppProvider implements WhatsAppProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = config.whatsapp.twilio.accountSid;
    this.authToken = config.whatsapp.twilio.authToken;
    this.fromNumber = config.whatsapp.twilio.phoneNumber;
  }

  async sendMessage(options: WhatsAppMessageOptions): Promise<void> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Twilio WhatsApp credentials not configured');
    }

    try {
      // Dynamic import to avoid requiring twilio in package.json if not used
      const twilio = await import('twilio');
      const client = twilio.default(this.accountSid, this.authToken);

      const messageOptions: any = {
        body: options.message,
        from: `whatsapp:${this.fromNumber}`,
        to: `whatsapp:${options.to}`,
      };

      // Add media URL if provided
      if (options.mediaUrl) {
        messageOptions.mediaUrl = [options.mediaUrl];
      }

      await client.messages.create(messageOptions);
      console.log(`✅ WhatsApp message sent to ${options.to}`);
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('Twilio package not installed. Run: npm install twilio');
      }
      console.error('Twilio WhatsApp error:', error);
      throw error;
    }
  }

  async sendTemplateMessage(options: WhatsAppTemplateOptions): Promise<void> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Twilio WhatsApp credentials not configured');
    }

    try {
      const twilio = await import('twilio');
      const client = twilio.default(this.accountSid, this.authToken);

      // Twilio uses content templates for WhatsApp Business
      // The contentSid is the template identifier
      const messageOptions: any = {
        from: `whatsapp:${this.fromNumber}`,
        to: `whatsapp:${options.to}`,
        contentSid: options.templateName, // Template SID from Twilio
      };

      if (options.templateParams && options.templateParams.length > 0) {
        messageOptions.contentVariables = JSON.stringify(
          options.templateParams.reduce((acc, param, index) => {
            acc[(index + 1).toString()] = param;
            return acc;
          }, {} as Record<string, string>)
        );
      }

      await client.messages.create(messageOptions);
      console.log(`✅ WhatsApp template message sent to ${options.to}`);
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('Twilio package not installed. Run: npm install twilio');
      }
      console.error('Twilio WhatsApp template error:', error);
      throw error;
    }
  }
}

// Format phone number to WhatsApp format (E.164)
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // If it starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // If it doesn't start with country code, add Brazil's (+55)
  if (!cleaned.startsWith('55') && cleaned.length <= 11) {
    cleaned = '55' + cleaned;
  }

  // Add + prefix if not present
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
};

// Initialize WhatsApp provider based on environment
const getWhatsAppProvider = (): WhatsAppProvider => {
  const provider = config.whatsapp.provider;

  switch (provider.toLowerCase()) {
    case 'twilio':
      return new TwilioWhatsAppProvider();
    case 'mock':
    default:
      return new MockWhatsAppProvider();
  }
};

const whatsappProvider = getWhatsAppProvider();

export const whatsappService = {
  /**
   * Send a WhatsApp message
   */
  async sendMessage(options: WhatsAppMessageOptions): Promise<void> {
    try {
      const formattedPhone = formatPhoneNumber(options.to);
      
      await whatsappProvider.sendMessage({
        ...options,
        to: formattedPhone,
      });
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error);
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  },

  /**
   * Send a template message (for WhatsApp Business API)
   */
  async sendTemplateMessage(options: WhatsAppTemplateOptions): Promise<void> {
    try {
      const formattedPhone = formatPhoneNumber(options.to);

      if (whatsappProvider.sendTemplateMessage) {
        await whatsappProvider.sendTemplateMessage({
          ...options,
          to: formattedPhone,
        });
      } else {
        throw new Error('Template messages not supported by current provider');
      }
    } catch (error: any) {
      console.error('Error sending WhatsApp template message:', error);
      throw new Error(`Failed to send WhatsApp template: ${error.message}`);
    }
  },

  /**
   * Send order confirmation WhatsApp message
   */
  async sendOrderConfirmation(
    phone: string,
    orderNumber: string,
    customerName: string,
    promisedDate: string,
    total: string
  ): Promise<void> {
    const message = `🧺 *Lavatec - Pedido Confirmado*

Olá ${customerName}!

Seu pedido *#${orderNumber}* foi recebido com sucesso!

📅 *Data prometida:* ${promisedDate}
💰 *Total:* R$ ${total}

Acompanhe o status do seu pedido pelo nosso sistema.

Obrigado por escolher a Lavatec! 💙`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send order status update WhatsApp message
   */
  async sendOrderStatusUpdate(
    phone: string,
    orderNumber: string,
    status: string,
    customerName: string
  ): Promise<void> {
    const statusMessages: Record<string, { emoji: string; text: string }> = {
      'received': { emoji: '📥', text: 'recebido na loja' },
      'in_progress': { emoji: '🔄', text: 'em processamento' },
      'washing': { emoji: '🫧', text: 'sendo lavado' },
      'drying': { emoji: '💨', text: 'sendo secado' },
      'ironing': { emoji: '👔', text: 'sendo passado' },
      'quality_check': { emoji: '✅', text: 'em controle de qualidade' },
      'ready': { emoji: '🎉', text: 'pronto para retirada' },
      'out_for_delivery': { emoji: '🚚', text: 'saiu para entrega' },
      'delivered': { emoji: '📦', text: 'entregue' },
      'completed': { emoji: '✨', text: 'concluído' },
    };

    const statusInfo = statusMessages[status.toLowerCase()] || { emoji: '📋', text: status };

    const message = `${statusInfo.emoji} *Lavatec - Atualização do Pedido*

Olá ${customerName}!

Seu pedido *#${orderNumber}* está *${statusInfo.text}*.

Acompanhe em tempo real pelo nosso sistema.

Lavatec 💙`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send order ready for pickup WhatsApp message
   */
  async sendOrderReady(
    phone: string,
    orderNumber: string,
    customerName: string,
    branchName?: string,
    branchAddress?: string
  ): Promise<void> {
    const branchInfo = branchName ? `\n📍 *Local:* ${branchName}` : '';
    const addressInfo = branchAddress ? `\n${branchAddress}` : '';

    const message = `🎉 *Lavatec - Pedido Pronto!*

Olá ${customerName}!

Ótimas notícias! Seu pedido *#${orderNumber}* está *pronto para retirada*!
${branchInfo}${addressInfo}

⏰ Horário de funcionamento: Seg-Sáb 8h às 20h

Estamos te esperando! 💙

Lavatec`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send delivery notification WhatsApp message
   */
  async sendDeliveryNotification(
    phone: string,
    orderNumber: string,
    customerName: string,
    driverName: string,
    estimatedTime?: string
  ): Promise<void> {
    const timeInfo = estimatedTime ? `\n⏰ *Previsão:* ${estimatedTime}` : '';

    const message = `🚚 *Lavatec - Seu Pedido Está a Caminho!*

Olá ${customerName}!

Seu pedido *#${orderNumber}* saiu para entrega!

👤 *Entregador:* ${driverName}${timeInfo}

Aguarde em breve! 💙

Lavatec`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send delivery completed WhatsApp message
   */
  async sendDeliveryCompleted(
    phone: string,
    orderNumber: string,
    customerName: string
  ): Promise<void> {
    const message = `✅ *Lavatec - Entrega Realizada!*

Olá ${customerName}!

Seu pedido *#${orderNumber}* foi entregue com sucesso!

⭐ Gostou do nosso serviço? Avalie sua experiência!

Obrigado por escolher a Lavatec! 💙
Esperamos vê-lo(a) novamente em breve!`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send promotional WhatsApp message
   */
  async sendPromotion(
    phone: string,
    customerName: string,
    promotionTitle: string,
    promotionDescription: string,
    couponCode?: string,
    expiryDate?: string
  ): Promise<void> {
    const couponInfo = couponCode ? `\n🎫 *Cupom:* ${couponCode}` : '';
    const expiryInfo = expiryDate ? `\n⏳ *Válido até:* ${expiryDate}` : '';

    const message = `🎁 *Lavatec - Oferta Especial!*

Olá ${customerName}!

${promotionTitle}

${promotionDescription}
${couponInfo}${expiryInfo}

Aproveite agora! 💙

Lavatec - Cuidando das suas roupas`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send customer reactivation WhatsApp message
   */
  async sendReactivation(
    phone: string,
    customerName: string,
    lastVisitDays: number,
    specialOffer?: string
  ): Promise<void> {
    const offerInfo = specialOffer ? `\n\n🎁 *Oferta especial para você:*\n${specialOffer}` : '';

    const message = `💙 *Lavatec - Sentimos Sua Falta!*

Olá ${customerName}!

Faz ${lastVisitDays} dias que não nos vemos! 😢

Estamos com saudades! Que tal fazer uma visita?
${offerInfo}

Esperamos te ver em breve! ✨

Lavatec - Cuidando das suas roupas`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send invoice/payment reminder WhatsApp message
   */
  async sendPaymentReminder(
    phone: string,
    customerName: string,
    invoiceNumber: string,
    amount: string,
    dueDate: string,
    paymentLink?: string
  ): Promise<void> {
    const linkInfo = paymentLink ? `\n\n💳 *Pague online:*\n${paymentLink}` : '';

    const message = `💰 *Lavatec - Lembrete de Pagamento*

Olá ${customerName}!

Você tem uma fatura em aberto:

📄 *Fatura:* #${invoiceNumber}
💵 *Valor:* R$ ${amount}
📅 *Vencimento:* ${dueDate}
${linkInfo}

Em caso de dúvidas, entre em contato!

Lavatec 💙`;

    await this.sendMessage({ to: phone, message });
  },

  /**
   * Send welcome message to new customer
   */
  async sendWelcome(
    phone: string,
    customerName: string
  ): Promise<void> {
    const message = `🎉 *Bem-vindo(a) à Lavatec!*

Olá ${customerName}!

É um prazer ter você conosco! 💙

Na Lavatec, cuidamos das suas roupas com carinho e qualidade.

🧺 *Nossos serviços:*
• Lavagem e secagem
• Passadoria
• Lavagem a seco
• Delivery

📱 Acompanhe seus pedidos pelo WhatsApp!

Qualquer dúvida, estamos aqui!

Lavatec - Cuidando das suas roupas`;

    await this.sendMessage({ to: phone, message });
  },
};

export default whatsappService;
