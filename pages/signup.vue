<script setup lang="ts">
const client = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);

const signup = async () => {
  try {
    error.value = "";

    if (password.value !== confirmPassword.value) {
      error.value = "Passwords do not match";
      return;
    }

    if (password.value.length < 6) {
      error.value = "Password must be at least 6 characters";
      return;
    }

    loading.value = true;

    const { error: authError } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (authError) {
      error.value = authError.message;
      return;
    }

    router.push("/");
  } catch (e) {
    error.value = "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
      <p class="text-gray-600 mb-8">Sign up to get started</p>

      <form @submit.prevent="signup" class="space-y-6">
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ error }}
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? "Creating account..." : "Sign Up" }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
