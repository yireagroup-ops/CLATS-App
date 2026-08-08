import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function check() {
  const parentPayload = {
    email: "test_trigger2@test.com",
    password: "test",
    name: "test",
    created_at: Date.now(),
    last_login_at: Date.now()
  };
  const { error } = await sb.from("clats_parents").insert([parentPayload]);
  console.log("Insert result with last_login_at = Date.now():", error?.message || error);
}
check();
