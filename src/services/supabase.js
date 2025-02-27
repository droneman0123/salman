import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add listeners for realtime events
supabase
  .channel('custom-all-channel')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe((status) => {
    console.log('Supabase realtime status:', status);
  }); 