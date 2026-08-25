import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = 
  url && 
  key && 
  !url.includes("YOUR_PROJECT") && 
  !key.includes("YOUR_SUPABASE_ANON_KEY");

export const supabase = isConfigured ? createClient(url, key) : null;

