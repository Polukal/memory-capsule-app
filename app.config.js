export default {
  expo: {
    name: "memory-capsule-app",
    slug: "memory-capsule-app",

    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnon: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },

    plugins: [],
  },
};
