import { supabase } from "./supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * Verifies the authorization header and returns a Supabase client bound to the authenticated user.
 * If authentication fails or Supabase is not configured, returns null.
 */
export async function getAuthenticatedClient(request: Request) {
  if (!supabase) return null;

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error("Auth getUser error:", error);
      return null;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Create a new client authenticated with the user's token to satisfy RLS policies
    return createClient(url, key, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (err) {
    console.error("Auth verification failed:", err);
    return null;
  }
}
