import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
	// Helpful runtime warning for developers — ensures Vite env vars are set.
	// Do NOT commit service_role keys to the client; always use the anon key.
	// If these are missing, realtime (WebSocket) connections will fail early.
	// Keep the message concise for developer debugging.
	// eslint-disable-next-line no-console
	console.error(
		"Missing Supabase config: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env"
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
