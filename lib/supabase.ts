import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kzqfkgnqkgoubngxwlky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cWZrZ25xa2dvdWJuZ3h3bGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzE2MTEsImV4cCI6MjA5MzYwNzYxMX0.YnHN0Y0knRzfDO3KtA9DiWcM5NBZ2KqkbFg9NcIf8Mg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
