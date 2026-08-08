import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function check() {
  // Can't directly query pg_trigger from REST, but let's try a raw SQL via RPC if we have one, 
  // or we can just try to insert a dummy record and catch the EXACT error!
  const parentPayload = {
    email: "test_trigger@test.com",
    password: "test",
    name: "test",
    created_at: Date.now(),
    last_login_at: new Date().toISOString()
  };
  const { error } = await sb.from("clats_parents").insert([parentPayload]);
  console.log("Insert result:", error);
  if (!error) {
    await sb.from("clats_parents").delete().eq("email", "test_trigger@test.com");
  }
}
check();
