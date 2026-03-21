/* ══════════════════════════════════════════════════════════════════════════════
   Shared Types for AgentsClan Platform
   Used by both frontend and backend
   ══════════════════════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════════════════════════════
// BASE TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface BaseDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// USER TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type UserRole = 'member' | 'admin' | 'moderator';

export interface User extends BaseDocument {
  wallet_address: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  total_points: number;
  streak_days: number;
  last_activity_at: string | null;
}

export interface CreateUserInput {
  wallet_address: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  role?: UserRole;
}

// ══════════════════════════════════════════════════════════════════════════════
// POST TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface Post extends BaseDocument {
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  category: string;
  tags: string[];
  is_published: boolean;
  is_pinned: boolean;
  view_count: number;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  author_id?: string;
  category: string;
  tags?: string[];
  is_published?: boolean;
  is_pinned?: boolean;
}

// ══════════════════════════════════════════════════════════════════════════════
// EVENT TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type LocationType = 'online' | 'offline' | 'hybrid';
export type EventType = 'meetup' | 'workshop' | 'hackathon' | 'ama' | 'webinar' | 'conference';

export interface Event extends BaseDocument {
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  location_type: LocationType;
  event_type: EventType;
  cover_image_url: string | null;
  meeting_link: string | null;
  max_attendees: number | null;
  current_attendees: number;
  is_featured: boolean;
  is_published: boolean;
  created_by: string | null;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  location?: string;
  location_type: LocationType;
  event_type: EventType;
  cover_image_url?: string;
  meeting_link?: string;
  max_attendees?: number;
  is_featured?: boolean;
  is_published?: boolean;
  created_by?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface Product extends BaseDocument {
  name: string;
  handle: string;
  description: string | null;
  details: string[];
  price: number;
  compare_price: number | null;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
  is_active: boolean;
  badge: string | null;
  rating: number;
  review_count: number;
}

export interface CreateProductInput {
  name: string;
  handle: string;
  description?: string;
  details?: string[];
  price: number;
  compare_price?: number;
  category: string;
  images?: string[];
  sizes?: string[];
  stock?: number;
  is_active?: boolean;
  badge?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDER TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export interface Order extends BaseDocument {
  order_number: string;
  user_wallet: string;
  user_id: string | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total_price: number;
  currency: string;
  status: OrderStatus;
  payment_method: string | null;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  shipping_name: string | null;
  shipping_email: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  tracking_number: string | null;
  notes: string | null;
}

export interface OrderItem extends BaseDocument {
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  size: string | null;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// MEMBERSHIP TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type MembershipTier = 'free' | 'bronze' | 'silver' | 'gold' | 'platinum';
export type MembershipStatus = 'pending' | 'paid' | 'minting' | 'minted' | 'failed';

export interface Membership extends BaseDocument {
  wallet_address: string;
  user_id: string | null;
  tier: MembershipTier;
  price_paid: number | null;
  currency: string;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  mint_tx_hash: string | null;
  token_id: string | null;
  nft_metadata: string | null;
  status: MembershipStatus;
  expires_at: string | null;
  xp_total: number;
}

export interface MembershipTierConfig {
  name: string;
  price: number;
  currency: string;
  xpMultiplier: number;
  benefits: string[];
}

export const MEMBERSHIP_TIERS: Record<Exclude<MembershipTier, 'free'>, MembershipTierConfig> = {
  bronze: {
    name: 'Bronze',
    price: 99900, // ₹999 in paisa
    currency: 'inr',
    xpMultiplier: 1.5,
    benefits: ['Priority support', 'Exclusive content', 'Bronze NFT badge'],
  },
  silver: {
    name: 'Silver',
    price: 199900, // ₹1,999 in paisa
    currency: 'inr',
    xpMultiplier: 2,
    benefits: ['All Bronze benefits', 'Early access', 'Silver NFT badge', 'Community calls'],
  },
  gold: {
    name: 'Gold',
    price: 499900, // ₹4,999 in paisa
    currency: 'inr',
    xpMultiplier: 3,
    benefits: ['All Silver benefits', '1-on-1 mentoring', 'Gold NFT badge', 'Exclusive events'],
  },
  platinum: {
    name: 'Platinum',
    price: 999900, // ₹9,999 in paisa
    currency: 'inr',
    xpMultiplier: 5,
    benefits: ['All Gold benefits', 'VIP support', 'Platinum NFT badge', 'Founding member perks'],
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// QUEST TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type QuestType = 'social' | 'content' | 'referral' | 'community' | 'special';
export type QuestStatus = 'active' | 'completed' | 'paused' | 'expired';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Quest extends BaseDocument {
  title: string;
  description: string;
  instructions: string | null;
  quest_type: QuestType;
  xp_reward: number;
  token_reward: number | null;
  max_completions: number | null;
  current_completions: number;
  start_date: string | null;
  end_date: string | null;
  status: QuestStatus;
  required_tier: MembershipTier | null;
  verification_method: 'manual' | 'automatic' | 'proof';
  external_link: string | null;
}

export interface QuestSubmission extends BaseDocument {
  quest_id: string;
  user_wallet: string;
  user_id: string | null;
  proof_url: string | null;
  proof_text: string | null;
  status: SubmissionStatus;
  reviewer_id: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  xp_awarded: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// JOB APPLICATION TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type ApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'shortlisted' 
  | 'interview' 
  | 'hired' 
  | 'rejected';

export interface JobApplication extends BaseDocument {
  job_title: string;
  job_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  resume_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cover_letter: string | null;
  experience_years: number | null;
  expected_salary: string | null;
  availability: string | null;
  status: ApplicationStatus;
  notes: string | null;
  reviewer_id: string | null;
}

// ══════════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENT TYPES
// ══════════════════════════════════════════════════════════════════════════════

export type AnnouncementType = 'info' | 'warning' | 'success' | 'alert';
export type TargetAudience = 'all' | 'members' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Announcement extends BaseDocument {
  title: string;
  content: string;
  type: AnnouncementType;
  is_active: boolean;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  target_audience: TargetAudience;
}

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface DailyAnalytics extends BaseDocument {
  date: string;
  new_users: number;
  active_users: number;
  orders_count: number;
  revenue: number;
  quests_completed: number;
  new_memberships: number;
  page_views: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalPosts: number;
  pendingSubmissions: number;
  activeQuests: number;
  upcomingEvents: number;
  pendingApplications: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// NFT TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface NFTTransaction extends BaseDocument {
  wallet_address: string;
  tier: MembershipTier;
  tx_hash: string | null;
  token_id: string | null;
  status: 'pending' | 'minting' | 'minted' | 'failed';
  gas_paid_by: 'user' | 'relayer';
  error_message: string | null;
}

// ══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Checkout types
export interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface CheckoutRequest {
  type: 'membership' | 'store';
  walletAddress: string;
  tier?: MembershipTier;
  items?: CheckoutItem[];
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

// Mint types
export interface GaslessMintRequest {
  walletAddress: string;
  tier: MembershipTier;
  signature: string;
  stripeSessionId?: string;
}

export interface GaslessMintResponse {
  success: boolean;
  txHash?: string;
  tokenId?: string;
  error?: string;
}
