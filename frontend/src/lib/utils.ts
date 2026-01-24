import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple class names with Tailwind's utility classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as BRL currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a date to display in Brazilian Portuguese format
 */
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
}

/**
 * Format a phone number to Brazilian format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a mobile or landline
  if (cleaned.length === 11) {
    // Mobile: (XX) XXXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Return original if format doesn't match
  return phone;
}

/**
 * Format a CPF number (Brazilian tax ID for individuals)
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove non-numeric characters
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return cpf;
  
  // Format: XXX.XXX.XXX-XX
  return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9, 11)}`;
}

/**
 * Format a CNPJ number (Brazilian tax ID for companies)
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove non-numeric characters
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return cnpj;
  
  // Format: XX.XXX.XXX/XXXX-XX
  return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12, 14)}`;
}

/**
 * Truncate a string to a specified length and add ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  
  if (str.length <= maxLength) return str;
  
  return str.substring(0, maxLength) + '...';
}

/**
 * Create initials from a name (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
} 