export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

// Leaderboard Types
export interface LeaderboardMetrics {
  callsMade: number;
  dealsTotal: number;
  dealsClosedWon: number;
  upsells: number;
  avgCallScore: number;
  totalCallScore: number;
  dealValue: number;
  totalScore: number;
  rank: 'challenger' | 'gold' | 'silver' | 'bronze';
}

export interface LeaderboardUser {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  position: number;
  metrics: LeaderboardMetrics;
}

export interface LeaderboardResponse {
  status: boolean;
  message: string;
  data: {
    leaderboard: LeaderboardUser[];
    period: string;
    category: string;
    totalUsers: number;
    generatedAt: string;
  };
}

export interface TopPerformer {
  name: string;
  userId: string;
  position: number;
  badge: 'challenger' | 'gold' | 'silver' | 'bronze';
  trophy: 'gold' | 'silver' | 'bronze';
  calls: string;
  deals: string;
  upsells: string;
  feedback: string;
  totalScore: number;
  rank: 'challenger' | 'gold' | 'silver' | 'bronze';
  profilePicture?: string;
}

export interface TopPerformersResponse {
  status: boolean;
  message: string;
  data: {
    topPerformers: TopPerformer[];
    period: string;
    generatedAt: string;
  };
}

export interface UserPositionResponse {
  status: boolean;
  message: string;
  data: {
    position: number | string;
    totalUsers: number;
    userMetrics: {
      userId: string;
      totalScore: number;
      callsMade: number;
      dealsClosedWon: number;
      upsells: number;
    };
    period: string;
    category: string;
  };
}
