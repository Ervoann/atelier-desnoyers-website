import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhkcjytfmwpgetdmzxut.supabase.co';
const supabaseAnonKey = 'sb_publishable_0lJIgSC6cM78OZHu2JuPvw_CqfMkVxL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
