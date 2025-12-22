import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabaseAnon =
  Constants.expoConfig?.extra?.supabaseAnon ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl!,
  supabaseAnon!,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
