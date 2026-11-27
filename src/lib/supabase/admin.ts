import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

// только для server-side: байпасит RLS
export function createAdminClient() {
  return createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
