import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add API key for premium features
        const apiKey = localStorage.getItem('api_key');
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        const data = error.response?.data as any;
        
        switch (status) {
          case 401:
            toast.error('Please log in to continue');
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            break;
            
          case 403:
            toast.error('Access denied. Please check your subscription.');
            break;
            
          case 429:
            toast.error('Rate limit exceeded. Please try again later.');
            break;
            
          case 500:
            toast.error('Server error. Please try again later.');
            break;
            
          default:
            if (data?.detail) {
              toast.error(data.detail);
            } else {
              toast.error('An error occurred. Please try again.');
            }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // File upload helper
  async upload<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();