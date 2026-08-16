import { createClient } from '@supabase/supabase-js';

// .env.local file se tumhari URL aur Key le raha hai
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase client create kar raha hai
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 