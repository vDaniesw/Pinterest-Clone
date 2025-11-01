import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkjytjldtuvbmzyonozb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpranl0amxkdHV2Ym16eW9ub3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDM1MTksImV4cCI6MjA3NzU3OTUxOX0.NgZWxyocUhH4_NrFJD854p_MmkSAg4WhN31NkC8n2Dw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
