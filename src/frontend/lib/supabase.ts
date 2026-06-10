import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 브라우저/서버 공용 — RLS 적용됨 (publishable key)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// 서버 전용 — RLS 우회 (service_role). API Routes에서만 import할 것
export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
