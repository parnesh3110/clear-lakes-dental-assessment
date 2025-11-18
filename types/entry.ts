export interface Entry {
  id: string;
  user_id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface CreateEntryRequest {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email?: string;
}
