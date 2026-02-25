
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_KEY;
};

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
