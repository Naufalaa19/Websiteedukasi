import { createClient } from '@supabase/supabase-js';

// Proyek Supabase milik peneliti
export const SUPABASE_URL = 'https://pwozdanmbcfslefkdlpa.supabase.co';

// Kunci ANON (publik, aman untuk browser). Jangan pernah memasukkan kunci secret/service_role di sini.
export const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3b3pkYW5tYmNmc2xlZmtkbHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMTU3NjksImV4cCI6MjEwOTc5MTc2OX0.ErxZgjYnSgxlTj1lM3jIerH09a5qN1Nq6CBdlRqCqX0';

export const isConfigured = !SUPABASE_PUBLISHABLE_KEY.startsWith('ISI_');

export const supabase = createClient(SUPABASE_URL, isConfigured ? SUPABASE_PUBLISHABLE_KEY : 'placeholder', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
