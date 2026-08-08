import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data, error } = await sb.from("clats_parents").select("*").limit(1);
  console.log("data:", data);
  console.log("error:", error);
}
check();
