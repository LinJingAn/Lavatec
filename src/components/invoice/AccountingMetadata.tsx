import React from 'react';
import './AccountingMetadata.css';

interface AccountingMetadataProps {
  fiscalPeriod: string;
  journalEntry: string;
  taxSummary: {
    taxableAmount: number;
    taxRate: number;
    taxAmount: number;
  };
  exchangeRate?: {
    from: string;
    to: string;
    rate: number;
  };
  notes?: string;
}

export const AccountingMetadata: React.FC<AccountingMetadataProps> = ({
  fiscalPeriod,
  journalEntry,
  taxSummary,
  exchangeRate,
  notes,
}) => {
  return (
    <div className="accounting-metadata">
      <div className="metadata-section">
        <h4 className="section-title">Fiscal Period</h4>
        <div className="section-content">
          <div className="metadata-item">
            <span className="label">Period</span>
            <span className="value">{fiscalPeriod}</span>
          </div>
        </div>
      </div>

      <div className="metadata-section">
        <h4 className="section-title">Journal Entry</h4>
        <div className="section-content">
          <div className="metadata-item">
            <span className="label">Reference</span>
            <span className="value">{journalEntry}</span>
          </div>
        </div>
      </div>

      <div className="metadata-section">
        <h4 className="section-title">Tax Summary</h4>
        <div className="section-content tax-details-grid">
          <div className="metadata-item">
            <span className="label">Taxable Amount</span>
            <span className="value">${taxSummary.taxableAmount.toFixed(2)}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Tax Rate</span>
            <span className="value">{(taxSummary.taxRate * 100).toFixed(2)}%</span>
          </div>
          <div className="metadata-item">
            <span className="label">Tax Amount</span>
            <span className="value">${taxSummary.taxAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {exchangeRate && (
        <div className="metadata-section">
          <h4 className="section-title">Exchange Rate</h4>
          <div className="section-content">
            <div className="metadata-item">
              <span className="label">Conversion</span>
              <span className="value">
                1 {exchangeRate.from} = {exchangeRate.rate} {exchangeRate.to}
              </span>
            </div>
          </div>
        </div>
      )}

      {notes && (
        <div className="metadata-section">
          <h4 className="section-title">Notes</h4>
          <div className="section-content">
            <p>{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 