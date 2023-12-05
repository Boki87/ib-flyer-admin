import { createClient } from "@supabase/supabase-js";

const supabaseNode = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZW9xbmhsdmJrY2J3bmtmYXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTU1MzQ2NiwiZXhwIjoyMDE3MTI5NDY2fQ.dZ03LBcYZdfFUQd87Cr06Sj7t3ldzLPnWAMtz6lT4Xk"
);

export default supabaseNode;
