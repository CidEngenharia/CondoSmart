
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://wjuxgffoloapqomajuoh.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdXhnZmZvbG9hcHFvbWFqdW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzE0NzMsImV4cCI6MjA4NTkwNzQ3M30.84uJ2-ibU7mPc9hZ8n3Hp_iFcfF9h-lK4UlB1HmZjKo";

export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== "https://sua-url-aqui.supabase.co" && SUPABASE_KEY !== "sua-chave-anon-aqui";
};

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
