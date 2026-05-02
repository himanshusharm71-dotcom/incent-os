import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🛑 CRITICAL ERROR: Supabase credentials not found in environment variables.");
  console.warn("💡 TO FIX THIS: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Project Settings.");
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (callback) => {
          // Real Supabase calls this immediately
          callback('INITIAL_SESSION', null);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithPassword: async () => ({ data: {}, error: new Error("Supabase not configured") }),
        signUp: async () => ({ data: {}, error: new Error("Supabase not configured") }),
        signOut: async () => ({ error: null }),
      },
      from: () => {
        const chain = {
          select: (...args) => ({
            ...chain,
            eq: () => ({ ...chain, single: () => Promise.resolve({ data: null, error: null }) }),
            order: () => ({ ...chain, limit: () => Promise.resolve({ data: [], error: null }) }),
            then: (resolve) => resolve({ data: [], count: 0, error: null })
          }),
          insert: () => Promise.resolve({ error: new Error("Supabase not configured") }),
          update: () => ({ ...chain, eq: () => ({ ...chain, select: () => ({ ...chain, single: () => Promise.resolve({ data: null, error: null }) }) }) }),
          delete: () => ({ ...chain, eq: () => Promise.resolve({ error: null }) }),
          upsert: () => Promise.resolve({ error: null }),
          then: (resolve) => resolve({ data: [], error: null })
        };
        return chain;
      }
    };
