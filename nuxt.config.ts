// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/login", "/signup", "/debug"],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: "lax",
      secure: false, // Set to true in production
    },
  },

  app: {
    head: {
      title: "Clear Lakes Dental - Data Management",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  compatibilityDate: "2024-11-17",
});
