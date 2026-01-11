/**
 * Database types for the Lavatec application
 * This file contains TypeScript interfaces for all database tables
 */

import { PostgrestError } from '@supabase/supabase-js';

// Types for API responses
export type DbResult<T> = T[] | null;
export type DbResultError = PostgrestError | null;
export type DbApiResult<T> = Promise<{ data: DbResult<T>; error: DbResultError }>;
export type DbApiSingleResult<T> = Promise<{ data: T | null; error: DbResultError }>;

// System Users (linked to Supabase auth.users)
export interface User {
  id: string; // UUID from auth.users
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  avatar_url?: string;
  company_id?: string; // Foreign key to companies
  branch_id?: string; // Foreign key to branches
  phone_number?: string;
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Companies (laundry businesses using the system)
export interface Company {
  id: string; // UUID
  name: string;
  logo_url?: string;
  address: string;
  city: string;
  state?: string;
  zip_code: string;
  country: string;
  phone_number: string;
  email: string;
  website?: string;
  tax_id?: string;
  is_active: boolean;
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'trial';
  trial_ends_at?: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Branches (individual locations of companies)
export interface Branch {
  id: string; // UUID
  company_id: string; // Foreign key to companies
  name: string;
  address: string;
  city: string;
  state?: string;
  zip_code: string;
  country: string;
  phone_number: string;
  email?: string;
  manager_id?: string; // Foreign key to users
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Customers (end customers of the laundry businesses)
export interface Customer {
  id: string; // UUID
  company_id: string; // Foreign key to companies
  branch_id?: string; // Foreign key to branches
  first_name: string;
  last_name: string;
  email?: string;
  phone_number: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  is_active: boolean;
  loyalty_points?: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Products (laundry service types)
export interface Product {
  id: string; // UUID
  company_id: string; // Foreign key to companies
  name: string;
  description?: string;
  category: 'wash' | 'dry_clean' | 'iron' | 'fold' | 'repair' | 'other';
  default_price: number;
  unit_type: 'piece' | 'kg' | 'lb' | 'hour';
  estimated_time_minutes: number; // Time to complete service
  is_active: boolean;
  image_url?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Pricing (pricing tables for products by company/branch)
export interface Pricing {
  id: string; // UUID
  company_id: string; // Foreign key to companies
  branch_id?: string; // Foreign key to branches (null means company-wide)
  product_id: string; // Foreign key to products
  price: number;
  min_quantity?: number;
  max_quantity?: number;
  effective_from: string; // ISO date string
  effective_to?: string; // ISO date string (null means indefinite)
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Customer Orders
export interface Order {
  id: string; // UUID
  company_id: string; // Foreign key to companies
  branch_id: string; // Foreign key to branches
  customer_id: string; // Foreign key to customers
  order_number: string; // Human-readable order identifier
  status: 'new' | 'processing' | 'ready' | 'completed' | 'cancelled' | 'on_hold';
  created_by: string; // Foreign key to users
  received_by?: string; // Foreign key to users
  promised_date: string; // ISO date string
  completed_date?: string; // ISO date string
  picked_up_date?: string; // ISO date string
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'mobile_payment' | 'other';
  notes?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Order Items (individual items in an order)
export interface OrderItem {
  id: string; // UUID
  order_id: string; // Foreign key to orders
  product_id: string; // Foreign key to products
  quantity: number;
  unit_price: number;
  subtotal: number;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  notes?: string;
  additional_services?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Full database schema type
export interface Database {
  users: User;
  companies: Company;
  branches: Branch;
  customers: Customer;
  products: Product;
  pricing: Pricing;
  orders: Order;
  order_items: OrderItem;
} 