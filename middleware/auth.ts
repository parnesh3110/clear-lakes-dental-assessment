// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/debug"];

  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }

  // Redirect to home if already logged in and trying to access auth pages
  if (user.value && (to.path === "/login" || to.path === "/signup")) {
    return navigateTo("/");
  }
});
