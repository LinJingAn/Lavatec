export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  content: string;
  styles: string;
  variables: {
    companyDetails: boolean;
    accountingMetadata: boolean;
    customerTaxId: boolean;
    currency: boolean;
    termsAndConditions: boolean;
    items: {
      showAccountingCodes: boolean;
      showTaxCodes: boolean;
      showCostCenters: boolean;
    };
  };
  accountingLayout: {
    showJournalEntry: boolean;
    showFiscalPeriod: boolean;
    showTaxSummary: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_TEMPLATE_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <style>
    {{styles}}
  </style>
</head>
<body>
  <div class="invoice">
    {{companyDetails}}
    
    <div class="invoice-header">
      <h1>INVOICE</h1>
      <div class="invoice-info">
        <p><strong>Invoice #:</strong> {{invoiceNumber}}</p>
        <p><strong>Date:</strong> {{date}}</p>
        <p><strong>Due Date:</strong> {{dueDate}}</p>
      </div>
    </div>

    {{accountingMetadata}}
    
    <div class="customer-info">
      <h3>Bill To:</h3>
      <p>{{customerName}}</p>
      <p>Tax ID: {{customerTaxId}}</p>
      <p>{{customerEmail}}</p>
    </div>
    
    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Account Code</th>
          <th>Tax Code</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{items}}
      </tbody>
    </table>
    
    <div class="totals">
      <p><strong>Subtotal:</strong> {{currency}} {{subtotal}}</p>
      <p><strong>Tax:</strong> {{currency}} {{tax}}</p>
      <p><strong>Total:</strong> {{currency}} {{total}}</p>
    </div>

    {{termsAndConditions}}
  </div>
</body>
</html>
`;

export const DEFAULT_TEMPLATE_STYLES = `
.invoice {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.company-details {
  margin-bottom: 30px;
}

.company-details h2 {
  color: #333;
  margin-bottom: 10px;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.invoice-header h1 {
  color: #2c3e50;
  font-size: 32px;
  margin: 0;
}

.invoice-info {
  text-align: right;
}

.accounting-metadata {
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.customer-info {
  margin-bottom: 30px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.items-table th,
.items-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.items-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.totals {
  text-align: right;
  margin-top: 20px;
}

.totals p {
  margin: 5px 0;
}

.terms {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.terms h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}
`; 