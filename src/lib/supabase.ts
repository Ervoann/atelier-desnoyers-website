import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kmgdrhhvorvezzhyattz.supabase.co';
const supabaseAnonKey = 'sb_publishable_L8sOQ5GHSHtyZqwISGKl7A_p8-liqE6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'atelier-desnoyers-auth',
  }
});
