
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  "";
const SUPABASE_KEY = (typeof process !== 'undefined' && process.env?.SUPABASE_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "";

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_KEY;
};

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
