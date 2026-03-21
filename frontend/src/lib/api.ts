/**
 * Frontend API Client
 * Communicates with the Hono backend at /api/*
 */

import type {
  User,
  Product,
  Order,
  Event,
  Post,
  Quest,
  QuestSubmission,
  Membership,
  Announcement,
  JobApplication,
  DashboardStats,
  DailyAnalytics,
  CheckoutRequest,
  CheckoutResponse,
  GaslessMintRequest,
  GaslessMintResponse,
  ApiResponse,
  PaginatedResponse,
} from '@agentsclan/shared';

// Local types for mint status (not exported from shared package)
interface MintStatusResponse {
  status: 'pending' | 'minting' | 'minted' | 'failed';
  txHash?: string;
  tokenId?: string;
  error?: string;
}

interface NFTCheckResponse {
  hasMembership: boolean;
  tier?: string;
  tokenId?: string;
}

// API base URL - configurable via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Get wallet address from storage or wagmi context
function getWalletAddress(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('walletAddress');
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const walletAddress = getWalletAddress();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (walletAddress) {
    (headers as Record<string, string>)['X-Wallet-Address'] = walletAddress;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// CHECKOUT API
// ============================================================================

export const checkoutApi = {
  createSession: (data: CheckoutRequest): Promise<CheckoutResponse> =>
    apiFetch('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSession: (sessionId: string): Promise<{ session: { status: string; payment_status: string } }> =>
    apiFetch(`/checkout/${sessionId}`),
};

// ============================================================================
// MINT API
// ============================================================================

export const mintApi = {
  gaslessMint: (data: GaslessMintRequest): Promise<GaslessMintResponse> =>
    apiFetch('/mint/gasless', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (txHash: string): Promise<MintStatusResponse> =>
    apiFetch(`/mint/status/${txHash}`),

  checkWallet: (wallet: string): Promise<NFTCheckResponse> =>
    apiFetch(`/mint/check/${wallet}`),
};

// ============================================================================
// USERS API
// ============================================================================

export const usersApi = {
  list: (params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<User>> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/users${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<ApiResponse<User>> =>
    apiFetch(`/users/${id}`),

  getByWallet: (address: string): Promise<ApiResponse<User>> =>
    apiFetch(`/users/wallet/${address}`),

  create: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<User>): Promise<ApiResponse<User>> =>
    apiFetch(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// PRODUCTS API
// ============================================================================

export const productsApi = {
  list: (params?: { 
    category?: string; 
    featured?: boolean; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/products${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<ApiResponse<Product>> =>
    apiFetch(`/products/${id}`),

  create: (data: Partial<Product>): Promise<ApiResponse<Product>> =>
    apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> =>
    apiFetch(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch(`/products/${id}`, {
      method: 'DELETE',
    }),

  updateStock: (id: string, stock: number): Promise<ApiResponse<Product>> =>
    apiFetch(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    }),
};

// ============================================================================
// ORDERS API
// ============================================================================

export const ordersApi = {
  list: (params?: { 
    status?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Order>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/orders${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<ApiResponse<Order>> =>
    apiFetch(`/orders/${id}`),

  updateStatus: (id: string, status: string): Promise<ApiResponse<Order>> =>
    apiFetch(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getStats: (): Promise<{ stats: { total: number; pending: number; completed: number; revenue: number } }> =>
    apiFetch('/orders/admin/stats'),
};

// ============================================================================
// MEMBERSHIPS API
// ============================================================================

export const membershipsApi = {
  list: (params?: { 
    tier?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Membership>> => {
    const searchParams = new URLSearchParams();
    if (params?.tier) searchParams.set('tier', params.tier);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/memberships${query ? `?${query}` : ''}`);
  },

  getByWallet: (address: string): Promise<ApiResponse<Membership>> =>
    apiFetch(`/memberships/wallet/${address}`),

  getStats: (): Promise<{ stats: Record<string, number> & { total: number } }> =>
    apiFetch('/memberships/admin/stats'),
};

// ============================================================================
// QUESTS API
// ============================================================================

export const questsApi = {
  list: (params?: { 
    status?: string; 
    type?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Quest>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/quests${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<ApiResponse<Quest>> =>
    apiFetch(`/quests/${id}`),

  create: (data: Partial<Quest>): Promise<ApiResponse<Quest>> =>
    apiFetch('/quests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Quest>): Promise<ApiResponse<Quest>> =>
    apiFetch(`/quests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  submit: (
    questId: string, 
    data: { proofUrl: string; notes?: string }
  ): Promise<ApiResponse<QuestSubmission>> =>
    apiFetch(`/quests/${questId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSubmissions: (params?: { 
    status?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<QuestSubmission>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/quests/admin/submissions${query ? `?${query}` : ''}`);
  },

  reviewSubmission: (
    submissionId: string, 
    data: { status: 'approved' | 'rejected'; feedback?: string }
  ): Promise<ApiResponse<QuestSubmission>> =>
    apiFetch(`/quests/submissions/${submissionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// EVENTS API
// ============================================================================

export const eventsApi = {
  list: (params?: { 
    type?: string; 
    upcoming?: boolean; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Event>> => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.upcoming !== undefined) searchParams.set('upcoming', params.upcoming.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/events${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<ApiResponse<Event>> =>
    apiFetch(`/events/${id}`),

  create: (data: Partial<Event>): Promise<ApiResponse<Event>> =>
    apiFetch('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Event>): Promise<ApiResponse<Event>> =>
    apiFetch(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// POSTS API
// ============================================================================

export const postsApi = {
  list: (params?: { 
    category?: string; 
    published?: boolean; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Post>> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.published !== undefined) searchParams.set('published', params.published.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/posts${query ? `?${query}` : ''}`);
  },

  get: (id: string): Promise<ApiResponse<Post>> =>
    apiFetch(`/posts/${id}`),

  create: (data: Partial<Post>): Promise<ApiResponse<Post>> =>
    apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Post>): Promise<ApiResponse<Post>> =>
    apiFetch(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch(`/posts/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// ANALYTICS API
// ============================================================================

export const analyticsApi = {
  getDashboard: (): Promise<{ stats: DashboardStats }> =>
    apiFetch('/analytics/dashboard'),

  getDaily: (params?: { days?: number }): Promise<{ analytics: DailyAnalytics[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.days) searchParams.set('days', params.days.toString());
    const query = searchParams.toString();
    return apiFetch(`/analytics/daily${query ? `?${query}` : ''}`);
  },

  getRevenue: (params?: { period?: string }): Promise<{ 
    revenue: { 
      total: number; 
      byPeriod: Record<string, number> 
    } 
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    const query = searchParams.toString();
    return apiFetch(`/analytics/revenue${query ? `?${query}` : ''}`);
  },
};

// ============================================================================
// ADMIN API
// ============================================================================

export const adminApi = {
  // Announcements
  getAnnouncements: (params?: { 
    active?: boolean; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<Announcement>> => {
    const searchParams = new URLSearchParams();
    if (params?.active !== undefined) searchParams.set('active', params.active.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/admin/announcements${query ? `?${query}` : ''}`);
  },

  createAnnouncement: (data: Partial<Announcement>): Promise<ApiResponse<Announcement>> =>
    apiFetch('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAnnouncement: (id: string, data: Partial<Announcement>): Promise<ApiResponse<Announcement>> =>
    apiFetch(`/admin/announcements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteAnnouncement: (id: string): Promise<ApiResponse<void>> =>
    apiFetch(`/admin/announcements/${id}`, {
      method: 'DELETE',
    }),

  // Job Applications
  getJobApplications: (params?: { 
    status?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<PaginatedResponse<JobApplication>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiFetch(`/admin/job-applications${query ? `?${query}` : ''}`);
  },

  updateJobApplication: (
    id: string, 
    data: { status: string; notes?: string }
  ): Promise<ApiResponse<JobApplication>> =>
    apiFetch(`/admin/job-applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// Combined API object for convenience
// ============================================================================

export const api = {
  checkout: checkoutApi,
  mint: mintApi,
  users: usersApi,
  products: productsApi,
  orders: ordersApi,
  memberships: membershipsApi,
  quests: questsApi,
  events: eventsApi,
  posts: postsApi,
  analytics: analyticsApi,
  admin: adminApi,
};

export default api;
