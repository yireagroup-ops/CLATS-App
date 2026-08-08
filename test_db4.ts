import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data, error } = await sb.rpc('get_schema_info', { table_name: 'clats_parents' });
  if (error) {
    console.log("RPC error:", error.message);
    // fallback, let's just use raw query if possible or REST API.
    // Wait, Supabase js doesn't have raw query unless via RPC.
    // Let's try to fetch it via the `/rest/v1/?apikey=...` to get OpenAPI spec?
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`
      }
    });
    const swagger = await res.json();
    console.log("clats_parents:", swagger.definitions?.clats_parents?.properties);
  } else {
    console.log(data);
  }
}
check();
