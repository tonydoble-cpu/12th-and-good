"use client";

import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Browser Supabase client. Returns null when credentials aren't configured
 * yet — callers must check isSupabaseConfigured (or a null return) and fall
 * back to demo behavior. This keeps the POC runnable before real infra
 * exists.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
