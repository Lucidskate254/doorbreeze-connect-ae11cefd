
import { createClient } from '@supabase/supabase-js';

// Use the values directly from the supabase integration file
// instead of process.env which isn't available in the browser
const supabaseUrl = 'https://jlehibsrdvnssnmfdogp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZWhpYnNyZHZuc3NubWZkb2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MDQ5NTksImV4cCI6MjA1ODI4MDk1OX0.X3c2c0D-9y95251gX7r0gzVRRt9bqkjOIvvySGNvQY8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
