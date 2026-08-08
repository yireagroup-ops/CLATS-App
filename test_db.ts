import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkIsColumnTimestamp(tableName: string, columnName: string) {
  try {
    const { data, error } = await sb
      .from(tableName)
      .select(columnName)
      .gt(columnName, "2026-06-21T00:00:00.000Z")
      .limit(0);
    console.log(`[${tableName}.${columnName}] error:`, error?.message || error, "data:", data);
  } catch (e) {
    console.log("Exception:", e);
  }
}

async function run() {
  await checkIsColumnTimestamp("clats_parents", "created_at");
  await checkIsColumnTimestamp("clats_parents", "last_login_at");
  await checkIsColumnTimestamp("clats_children", "created_at");
}

run();
