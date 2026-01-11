import { jsPDF } from 'jspdf';
import { Invoice, InvoiceTemplate, InvoiceStatus, LaundryOrder, AccountingMetadata } from '../models';
import { supabase } from '../lib/supabaseClient';

export class InvoiceService {
  private static instance: InvoiceService;
  
  private constructor() {}
  
  static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  private validateAccountingRequirements(invoice: Invoice): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!invoice.companyDetails?.taxId) {
      errors.push('Company Tax ID is required');
    }
    if (!invoice.currency) {
      errors.push('Currency must be specified');
    }
    if (!invoice.accountingMetadata?.fiscalYear) {
      errors.push('Fiscal year must be specified');
    }
    if (!invoice.accountingMetadata?.accountingPeriod) {
      errors.push('Accounting period must be specified');
    }

    // Numerical validations
    if (invoice.total !== invoice.subtotal + invoice.tax - (invoice.discount || 0)) {
      errors.push('Total amount does not match calculation');
    }
    
    // Items validation
    invoice.items.forEach((item, index) => {
      if (item.total !== item.quantity * item.unitPrice * (1 + item.tax)) {
        errors.push(`Item ${index + 1}: Total amount does not match calculation`);
      }
      if (!item.accountCode) {
        errors.push(`Item ${index + 1}: Account code is required`);
      }
    });

    // Foreign currency validation
    if (invoice.currency !== 'USD' && !invoice.exchangeRate) {
      errors.push('Exchange rate is required for foreign currency invoices');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private getCurrentAccountingPeriod(): AccountingMetadata {
    const now = new Date();
    const fiscalYear = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    return {
      fiscalYear,
      accountingPeriod: `${fiscalYear}-${month}`,
      taxCategory: 'standard',
      reconciliationStatus: 'pending'
    };
  }

  async generateInvoiceFromOrder(
    order: LaundryOrder,
    templateId?: string,
    companyDetails: Invoice['companyDetails']
  ): Promise<Invoice> {
    try {
      // Get default template if templateId not provided
      if (!templateId) {
        const { data: template } = await supabase
          .from('invoice_templates')
          .select('*')
          .eq('isDefault', true)
          .single();
        templateId = template.id;
      }

      // Create invoice items from order items
      const items = order.items.map(item => ({
        id: crypto.randomUUID(),
        description: `${item.serviceName} - ${item.garmentType}`,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        tax: item.subtotal * 0.1, // 10% tax example
        total: item.subtotal * 1.1,
        orderId: order.id,
        orderItemId: item.id,
        accountCode: '4000', // Revenue account
        taxCode: 'T1',      // Standard tax rate
        costCenter: 'SALES' // Sales department
      }));

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = items.reduce((sum, item) => sum + item.tax, 0);
      const total = subtotal + tax;

      // Create invoice with accounting metadata
      const invoice: Omit<Invoice, 'id'> = {
        invoiceNumber: `INV-${Date.now()}`,
        orderId: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        status: 'draft',
        items,
        subtotal,
        tax,
        total,
        paidAmount: 0,
        balance: total,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        templateId,
        payments: [],
        emailHistory: [],
        viewHistory: [],
        currency: 'USD',
        accountingMetadata: this.getCurrentAccountingPeriod(),
        companyDetails,
        isProforma: false,
        isRecurring: false,
        termsAndConditions: 'Standard payment terms apply. Late payments subject to interest charges.',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Validate accounting requirements
      const validation = this.validateAccountingRequirements(invoice as Invoice);
      if (!validation.isValid) {
        throw new Error(`Invalid invoice: ${validation.errors.join(', ')}`);
      }

      // Save to database
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoice])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  async generatePDF(invoice: Invoice, template: InvoiceTemplate): Promise<Blob> {
    try {
      // Create PDF document
      const doc = new jsPDF();
      
      // Apply template styles and content
      const html = this.applyTemplate(invoice, template);
      
      // Convert HTML to PDF
      doc.html(html, {
        callback: function (doc) {
          // Add header
          doc.setFontSize(20);
          doc.text('INVOICE', 105, 20, { align: 'center' });
          
          // Add invoice details
          doc.setFontSize(12);
          doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
          doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 50);
          doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 60);
          
          // Add customer details
          doc.text('Bill To:', 20, 80);
          doc.text(invoice.customerName, 20, 90);
          if (invoice.customerAddress) {
            doc.text(invoice.customerAddress, 20, 100);
          }
          
          // Add items table
          let y = 120;
          doc.text('Description', 20, y);
          doc.text('Qty', 100, y);
          doc.text('Price', 130, y);
          doc.text('Total', 160, y);
          
          y += 10;
          invoice.items.forEach(item => {
            doc.text(item.description, 20, y);
            doc.text(item.quantity.toString(), 100, y);
            doc.text(`$${item.unitPrice.toFixed(2)}`, 130, y);
            doc.text(`$${item.total.toFixed(2)}`, 160, y);
            y += 10;
          });
          
          // Add totals
          y += 10;
          doc.text('Subtotal:', 130, y);
          doc.text(`$${invoice.subtotal.toFixed(2)}`, 160, y);
          y += 10;
          doc.text('Tax:', 130, y);
          doc.text(`$${invoice.tax.toFixed(2)}`, 160, y);
          y += 10;
          doc.text('Total:', 130, y);
          doc.text(`$${invoice.total.toFixed(2)}`, 160, y);
        }
      });

      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  private applyTemplate(invoice: Invoice, template: InvoiceTemplate): string {
    // Replace template variables with actual values
    let html = template.content;
    
    // Add company details section
    const companySection = `
      <div class="company-details">
        <h2>${invoice.companyDetails.name}</h2>
        <p>${invoice.companyDetails.address}</p>
        <p>Tax ID: ${invoice.companyDetails.taxId}</p>
        ${invoice.companyDetails.registrationNumber ? 
          `<p>Reg. No: ${invoice.companyDetails.registrationNumber}</p>` : ''}
      </div>
    `;
    
    html = html.replace('{{companyDetails}}', companySection);
    
    // Add accounting metadata
    const accountingSection = `
      <div class="accounting-metadata">
        <p>Fiscal Year: ${invoice.accountingMetadata.fiscalYear}</p>
        <p>Period: ${invoice.accountingMetadata.accountingPeriod}</p>
        ${invoice.accountingMetadata.journalEntryReference ? 
          `<p>Journal Ref: ${invoice.accountingMetadata.journalEntryReference}</p>` : ''}
      </div>
    `;
    
    html = html.replace('{{accountingMetadata}}', accountingSection);
    
    // Replace basic fields
    html = html.replace(/{{invoiceNumber}}/g, invoice.invoiceNumber)
               .replace(/{{customerName}}/g, invoice.customerName)
               .replace(/{{customerEmail}}/g, invoice.customerEmail)
               .replace(/{{customerTaxId}}/g, invoice.customerTaxId || '')
               .replace(/{{date}}/g, new Date(invoice.createdAt).toLocaleDateString())
               .replace(/{{dueDate}}/g, new Date(invoice.dueDate).toLocaleDateString())
               .replace(/{{subtotal}}/g, invoice.subtotal.toFixed(2))
               .replace(/{{tax}}/g, invoice.tax.toFixed(2))
               .replace(/{{total}}/g, invoice.total.toFixed(2))
               .replace(/{{currency}}/g, invoice.currency);
    
    // Replace items table with accounting codes
    const itemsHtml = invoice.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${item.accountCode}</td>
        <td>${item.taxCode}</td>
        <td>$${item.unitPrice.toFixed(2)}</td>
        <td>$${item.total.toFixed(2)}</td>
      </tr>
    `).join('');
    
    html = html.replace('{{items}}', itemsHtml);
    
    // Add terms and conditions
    if (invoice.termsAndConditions) {
      html = html.replace('{{termsAndConditions}}', `
        <div class="terms">
          <h3>Terms and Conditions</h3>
          <p>${invoice.termsAndConditions}</p>
        </div>
      `);
    }
    
    return html;
  }

  async sendInvoiceEmail(invoice: Invoice): Promise<void> {
    try {
      // Generate PDF
      const template = await this.getTemplate(invoice.templateId);
      const pdf = await this.generatePDF(invoice, template);
      
      // Create email content
      const emailContent = `
        Dear ${invoice.customerName},
        
        Please find attached your invoice #${invoice.invoiceNumber}.
        
        Total Amount: $${invoice.total.toFixed(2)}
        Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
        
        Thank you for your business!
      `;
      
      // Send email with PDF attachment
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          to: invoice.customerEmail,
          subject: `Invoice #${invoice.invoiceNumber}`,
          content: emailContent,
          attachmentData: await this.blobToBase64(pdf),
          attachmentName: `invoice-${invoice.invoiceNumber}.pdf`
        }
      });

      if (error) throw error;

      // Update email history
      await this.updateEmailHistory(invoice.id, {
        sentAt: new Date(),
        to: invoice.customerEmail,
        status: 'sent'
      });

      // Update invoice status
      await this.updateInvoiceStatus(invoice.id, 'sent');
    } catch (error) {
      console.error('Error sending invoice email:', error);
      await this.updateEmailHistory(invoice.id, {
        sentAt: new Date(),
        to: invoice.customerEmail,
        status: 'failed',
        error: error.message
      });
      throw error;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private async getTemplate(templateId: string): Promise<InvoiceTemplate> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (error) throw error;
    return data;
  }

  private async updateEmailHistory(
    invoiceId: string,
    history: {
      sentAt: Date;
      to: string;
      status: 'sent' | 'delivered' | 'failed';
      error?: string;
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .update({
        emailHistory: supabase.sql`array_append(email_history, ${history}::jsonb)`
      })
      .eq('id', invoiceId);
    
    if (error) throw error;
  }

  private async updateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatus
  ): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .update({ status, updatedAt: new Date() })
      .eq('id', invoiceId);
    
    if (error) throw error;
  }
} 