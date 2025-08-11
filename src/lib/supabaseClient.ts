import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://plbuldvrrgkazzyogdac.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYnVsZHZycmdrYXp6eW9nZGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzY1MjIsImV4cCI6MjA3MDQ1MjUyMn0.E5OSpOuUDg2IicnRDY5yY6rDFaexuSU2xpGn_kru6W8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
