import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://indnfwxhfmjvukznxdsi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZG5md3hoZm1qdnVrem54ZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDU2MTYsImV4cCI6MjA2MDU4MTYxNn0.DR708xmTeYBwwXYE_oTADLbiXaP_-xJLChsOASN5FtM';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 