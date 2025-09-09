import axios, { AxiosInstance } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      withCredentials: true, // Include cookies for refresh tokens
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            const refreshResponse = await this.api.post('/auth/refresh');
            const newToken = refreshResponse.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            
            // Retry the original request
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return this.api.request(error.config);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async signup(userData: any) {
    const response = await this.api.post('/auth/signup', userData);
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const response = await this.api.post('/auth/refresh');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Post endpoints
  async getPosts() {
    const response = await this.api.get('/post');
    return response.data;
  }

  async getPost(id: string) {
    const response = await this.api.get(`/post/${id}`);
    return response.data;
  }

  async createPost(postData: any) {
    const response = await this.api.post('/post', postData);
    return response.data;
  }

  async updatePost(id: string, postData: any) {
    const response = await this.api.patch(`/post/${id}`, postData);
    return response.data;
  }

  async deletePost(id: string) {
    const response = await this.api.delete(`/post/${id}`);
    return response.data;
  }

  // Like endpoints
  async toggleLike(postId: string) {
    const response = await this.api.post(`/like/${postId}/post/toggle`);
    return response.data;
  }

  async getLikeCount(postId: string) {
    const response = await this.api.get(`/like/${postId}/post/count`);
    return response.data;
  }

  async getLikeStatus(postId: string) {
    const response = await this.api.get(`/like/${postId}/post/status`);
    return response.data;
  }

  // User endpoints
  async changePassword(passwordData: any) {
    const response = await this.api.post('/user/change-password', passwordData);
    return response.data;
  }

  async requestResetPassword(email: string) {
    const response = await this.api.post('/user/request-reset-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await this.api.post(`/user/reset-password?token=${token}`, { newPassword });
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;