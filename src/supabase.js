import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vkzvhyazpkbxujrqsdpe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrenZoeWF6cGtieHVqcnFzZHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4ODEzNzIsImV4cCI6MjA5NjQ1NzM3Mn0.nhCgDnwchfhLlOX9XoYwTP2rAPo9XQkb6hClZ7Rc4pQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
