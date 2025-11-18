<script setup lang="ts">
import type { Entry, ApiResponse } from "~/types/entry";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const client = useSupabaseClient();

const entries = ref<Entry[]>([]);
const loading = ref(true);
const error = ref("");

const user = useSupabaseUser();

const loadEntries = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = await $fetch<ApiResponse<Entry[]>>("/api/entries/list");

    if (!response.success) {
      error.value = response.error || "Failed to load entries";
      return;
    }

    entries.value = response.data || [];
  } catch (e: any) {
    error.value = e.data?.error || "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};

const logout = async () => {
  await client.auth.signOut();
  router.push("/login");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  loadEntries();

  // Auto-refresh every 5 seconds to show new entries
  const interval = setInterval(loadEntries, 5000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
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
                class="text-blue-600 font-medium px-3 py-2 rounded-lg bg-blue-50"
              >
                View Entries
              </NuxtLink>
              <NuxtLink
                to="/addData"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
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
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">All Entries</h2>
          <p class="text-gray-600 mt-2">
            {{ loading ? "Loading..." : `${entries.length} total entries` }}
          </p>
        </div>
        <button
          @click="loadEntries"
          :disabled="loading"
          class="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg shadow-sm border border-gray-200 transition-colors disabled:opacity-50"
        >
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>

      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
      >
        {{ error }}
      </div>

      <!-- Loading State -->
      <div
        v-if="loading && entries.length === 0"
        class="bg-white rounded-xl shadow-sm p-12 text-center"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-gray-600 mt-4">Loading entries...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="entries.length === 0"
        class="bg-white rounded-xl shadow-sm p-12 text-center"
      >
        <div class="text-gray-400 mb-4">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No entries yet</h3>
        <p class="text-gray-600 mb-6">
          Get started by creating your first entry
        </p>
        <button
          @click="router.push('/addData')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-block"
        >
          Create Entry
        </button>
      </div>

      <!-- Entries Grid -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ entry.name }}
              </h3>
              <p class="text-sm text-gray-600">{{ entry.email }}</p>
            </div>
          </div>

          <p class="text-gray-700 mb-4 line-clamp-3">{{ entry.message }}</p>

          <div class="border-t border-gray-100 pt-4">
            <p class="text-xs text-gray-500">
              {{ formatDate(entry.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
