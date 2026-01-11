export interface TaxDetail {
  code: string;
  rate: number;
  baseAmount: number;
  taxAmount: number;
  description?: string;
}

export interface AccountingMetadata {
  fiscalYear: number;
  accountingPeriod: string;
  journalEntryNumber: string;
  postingDate: string;
  costCenter: string;
  taxDetails?: TaxDetail[];
  exchangeRate?: number;
  baseCurrency?: string;
  foreignCurrency?: string;
  notes?: string;
  accountingDate?: string;
  documentType?: string;
  documentNumber?: string;
  referenceNumber?: string;
} 