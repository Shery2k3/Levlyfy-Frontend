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
