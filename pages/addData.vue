<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const client = useSupabaseClient();

const name = ref("");
const email = ref("");
const message = ref("");
const error = ref("");
const success = ref(false);
const loading = ref(false);

const user = useSupabaseUser();

const logout = async () => {
  await client.auth.signOut();
  router.push("/login");
};

const submitForm = async () => {
  try {
    error.value = "";
    success.value = false;
    loading.value = true;

    const response = await $fetch("/api/entries/create", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        message: message.value,
      },
    });

    if (!response.success) {
      error.value = response.error || "Failed to create entry";
      return;
    }

    success.value = true;
    name.value = "";
    email.value = "";
    message.value = "";

    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (e: any) {
    error.value = e.data?.error || "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-900">Clear Lakes Dental</h1>
            <div class="flex space-x-4">
              <NuxtLink
                to="/"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Entries
              </NuxtLink>
              <NuxtLink
                to="/addData"
                class="text-blue-600 font-medium px-3 py-2 rounded-lg bg-blue-50"
              >
                Add Entry
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ user?.email }}</span>
            <button
              @click="logout"
              class="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Add New Entry</h2>
        <p class="text-gray-600 mb-8">
          Fill out the form to create a new entry
        </p>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {{ error }}
          </div>

          <div
            v-if="success"
            class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
          >
            Entry created successfully!
          </div>

          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              minlength="2"
              maxlength="100"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
            <p class="mt-1 text-sm text-gray-500">2-100 characters</p>
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              for="message"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Message <span class="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              v-model="message"
              required
              minlength="10"
              maxlength="1000"
              rows="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your message here..."
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">
              {{ message.length }}/1000 characters (minimum 10)
            </p>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? "Submitting..." : "Submit Entry" }}
            </button>
            <button
              type="button"
              @click="router.push('/')"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
