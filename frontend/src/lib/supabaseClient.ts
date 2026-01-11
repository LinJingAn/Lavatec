import { createClient } from '@supabase/supabase-js';

// Log raw environment variables for debugging
console.log("Raw VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Raw VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

// Get URL and key from environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make sure URL is a string and trim any whitespace
if (supabaseUrl) {
  supabaseUrl = String(supabaseUrl).trim();
}

// Make sure key is a string and trim any whitespace
if (supabaseAnonKey) {
  supabaseAnonKey = String(supabaseAnonKey).trim();
}

// For development: use a fallback if environment variables aren't loaded
if (!supabaseUrl || supabaseUrl === 'undefined' || supabaseUrl === 'your_supabase_development_url_here') {
  console.warn('Using fallback Supabase URL for development');
  // Hardcode a valid URL here
  supabaseUrl = 'https://indnfwxhfmjvukznxdsi.supabase.co';
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.warn('Using fallback Supabase Anon Key for development');
  // Use the correct key from your .env file (this is just a placeholder)
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZG5md3hoZm1qdnVrem54ZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY0NzU4MDUsImV4cCI6MjAxMjA1MTgwNX0.KzNDfgSZ0OM-jBHlj3RI_jJ3GvIpt9yCiTH0unFjeak';
}

console.log("Final SUPABASE_URL:", supabaseUrl);
console.log("URL starts with https://:", supabaseUrl.startsWith('https://'));

// Check for valid URL
if (!supabaseUrl.startsWith('https://')) {
  console.error("Invalid URL format:", supabaseUrl);
  throw new Error('VITE_SUPABASE_URL must start with https://');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred while communicating with the database');
};

// Helper function to handle Supabase responses
export const handleSupabaseResponse = <T>({ data, error }: { data: T | null; error: any }) => {
  if (error) {
    handleSupabaseError(error);
  }
  return data;
}; 