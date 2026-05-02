import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Missing Supabase credentials! The OS will not function. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel settings.");
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { auth: {}, from: () => ({ select: () => ({ eq: () => ({ single: () => ({}) }) }) }) }; // Safe mock to prevent crash
