// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Post types
export interface Post {
  id: string;
  title: string;
  tagLine: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  likes?: Like[];
}

export interface CreatePostData {
  title: string;
  tagLine: string;
  body: string;
}

export interface UpdatePostData {
  title?: string;
  tagLine?: string;
  body?: string;
}

// Like types
export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface LikeStatus {
  isLiked: boolean;
  count: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Change password types
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Reset password types
export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordData {
  newPassword: string;
}