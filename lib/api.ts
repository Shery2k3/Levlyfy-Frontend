// lib/api.ts
import axios, { AxiosInstance } from "axios";
import { 
  LeaderboardResponse, 
  TopPerformersResponse, 
  UserPositionResponse 
} from "@/types/api";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Leaderboard API functions
export const leaderboardAPI = {
  // Get full leaderboard
  getLeaderboard: async (
    period: 'weekly' | 'monthly' | 'all-time' = 'weekly',
    category: 'calls-made' | 'deals-closed' | 'upsells' | 'total_score' = 'total_score',
    limit: number = 50
  ): Promise<LeaderboardResponse> => {
    const response = await api.get('/performance/leaderboard', {
      params: { period, category, limit }
    });
    return response.data;
  },

  // Get top performers for cards
  getTopPerformers: async (
    period: 'weekly' | 'monthly' | 'all-time' = 'weekly',
    limit: number = 3
  ): Promise<TopPerformersResponse> => {
    const response = await api.get('/performance/top-performers', {
      params: { period, limit }
    });
    return response.data;
  },

  // Get user position
  getUserPosition: async (
    userId: string,
    period: 'weekly' | 'monthly' | 'all-time' = 'weekly',
    category: 'calls-made' | 'deals-closed' | 'upsells' | 'total_score' = 'total_score'
  ): Promise<UserPositionResponse> => {
    const response = await api.get(`/performance/user-position/${userId}`, {
      params: { period, category }
    });
    return response.data;
  }
};

export default api;
