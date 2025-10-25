import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://ufnzvrvuttvfbwnhofnh.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbnp2cnZ1dHR2ZmJ3bmhvZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTMxMjMsImV4cCI6MjA3MzUyOTEyM30.CiTTACPz0A6q6uW4fwGQwZYTMliki_Xrb_dScu_k5Hc";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() || FALLBACK_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || FALLBACK_SUPABASE_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.info(
    "Usando credenciais padrão do Supabase. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ambiente próprio.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;