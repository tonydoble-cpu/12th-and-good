export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True once real Supabase credentials are in the environment.
 * Until then, pages fall back to lib/mock-data.ts so the POC is
 * fully browsable with zero infra configured.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
