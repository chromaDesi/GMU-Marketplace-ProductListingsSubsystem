// API Client for GMU Marketplace Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic API request handler
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available (using JWT Bearer token)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! status: ${response.status}`
    }));
    throw new Error(errorData.detail || errorData.message || 'API request failed');
  }

  return response.json();
}

// Product API
export const productAPI = {
  // Get all products with optional filters
  getProducts: (params?: {
    category?: string;
    condition?: string;
    status?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiRequest(`/products/${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single product by ID
  getProduct: (id: number) => {
    return apiRequest(`/products/${id}/`);
  },

  // Get products owned by the authenticated user
  getMyProducts: () => {
    return apiRequest('/products/my_products/');
  },

  // Create a new product
  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    status?: string;
  }) => {
    return apiRequest('/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing product
  updateProduct: (id: number, data: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    status: string;
  }>) => {
    return apiRequest(`/products/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a product
  deleteProduct: (id: number) => {
    return apiRequest(`/products/${id}/`, {
      method: 'DELETE',
    });
  },

  // Increment product views
  incrementViews: (id: number) => {
    return apiRequest(`/products/${id}/increment_views/`, {
      method: 'POST',
    });
  },
};

// User API
export const userAPI = {
  // Register a new user
  register: (data: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }) => {
    return apiRequest('/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login
  login: (credentials: { username: string; password: string }) => {
    return apiRequest('/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }).then(data => {
      // Store JWT tokens
      if (data.access && typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
      }
      return data;
    });
  },

  // Logout
  logout: () => {
    // Clear JWT tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    return Promise.resolve({ detail: 'Logged out successfully' });
  },

  // Get current user profile
  getProfile: () => {
    return apiRequest('/users/profile/');
  },

  // Update user profile
  updateProfile: (data: Partial<{
    full_name: string;
    email: string;
    bio: string;
    location: string;
    phone: string;
  }>) => {
    return apiRequest('/users/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Get user by ID
  getUser: (id: number) => {
    return apiRequest(`/users/${id}/`);
  },
};

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

// Helper function to get current auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Helper function to clear authentication
export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
