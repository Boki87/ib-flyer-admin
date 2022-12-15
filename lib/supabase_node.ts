import { createClient } from "@supabase/supabase-js";

const supabaseNode = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdW93cW13aXFpbGVreXJiaXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2ODQ2MTk2OSwiZXhwIjoxOTg0MDM3OTY5fQ.VdQfa4PsfwCtVSxsS5in27xA5WvAy6_tBUV6kUKtSCY'
);

export default supabaseNode