/* ══════════════════════════════════════════════════════════════════════════════
   Admin Types & Appwrite Database Helpers
   ══════════════════════════════════════════════════════════════════════════════ */

import { databases, DATABASE_ID, COLLECTIONS, client } from './appwrite';
import { eventsApi, productsApi } from './api';
import { Query, ID, Models } from 'appwrite';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

// Helper type to exclude Appwrite document fields when creating/updating
type DocumentFields = '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions';
type CreateData<T> = Omit<Partial<T>, DocumentFields>;

export interface User extends Models.Document {
  wallet_address: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin' | 'moderator';
  total_points: number;
  streak_days: number;
  last_activity_at: string | null;
}

export interface Post extends Models.Document {
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

export interface Event extends Models.Document {
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  location_type: 'online' | 'offline' | 'hybrid';
  event_type: 'meetup' | 'workshop' | 'hackathon' | 'ama' | 'webinar' | 'conference';
  cover_image_url: string | null;
  meeting_link: string | null;
  max_attendees: number | null;
  current_attendees: number;
  is_featured: boolean;
  is_published: boolean;
  created_by: string | null;
}

export interface Product extends Models.Document {
  name: string;
  handle: string;
  description: string | null;
  price: number;
  category: string;
  sizes: string[];
  stock: boolean;
  active: boolean;
}

export interface Order extends Models.Document {
  order_number: string;
  user_wallet: string;
  user_id: string | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
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

export interface OrderItem extends Models.Document {
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  size: string | null;
  unit_price: number;
  total_price: number;
}

export interface Membership extends Models.Document {
  wallet_address: string;
  user_id: string | null;
  tier: 'creator' | 'legend';
  price_paid: number | null;
  currency: string;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  mint_tx_hash: string | null;
  token_id: string | null;
  nft_metadata: string | null;
  status: 'pending' | 'paid' | 'minting' | 'minted' | 'failed';
  expires_at: string | null;
}

export interface Quest extends Models.Document {
  title: string;
  description: string | null;
  points: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: string | null;
  is_active: boolean;
  is_daily: boolean;
  max_submissions: number | null;
  start_date: string | null;
  end_date: string | null;
}

export interface QuestSubmission extends Models.Document {
  user_wallet: string;
  quest_id: string;
  proof_link: string | null;
  description: string | null;
  file_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  points_awarded: number;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
}

export interface JobApplication extends Models.Document {
  user_wallet: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  motivation_text: string | null;
  recent_build: string | null;
  status: 'pending' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface Announcement extends Models.Document {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_by: string | null;
}

export interface AnalyticsDaily extends Models.Document {
  date: string;
  total_users: number;
  new_users: number;
  active_users: number;
  total_members: number;
  total_nft_holders: number;
  quests_completed: number;
  store_revenue: number;
  orders_count: number;
  page_views: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalMembers: number;
  totalNftHolders: number;
  totalQuestsCompleted: number;
  storeRevenue: number;
  activeUsers: number;
  pendingSubmissions: number;
  pendingApplications: number;
  recentOrders: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN AUTHORIZATION
// ══════════════════════════════════════════════════════════════════════════════

const OWNER_WALLET_ADDRESS = process.env.NEXT_PUBLIC_OWNER_WALLET_ADDRESS?.toLowerCase();

export function isOwnerWallet(walletAddress: string | undefined): boolean {
  if (!walletAddress || !OWNER_WALLET_ADDRESS) return false;
  return walletAddress.toLowerCase() === OWNER_WALLET_ADDRESS;
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ══════════════════════════════════════════════════════════════════════════════

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      usersResult,
      membersResult,
      nftHoldersResult,
      questsCompletedResult,
      ordersResult,
      pendingSubmissionsResult,
      pendingApplicationsResult,
      recentOrdersResult,
    ] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, [Query.equal('status', 'minted'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.NFT_TRANSACTIONS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, [Query.equal('status', 'approved'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [Query.equal('status', 'paid')]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, [Query.equal('status', 'pending'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.JOB_APPLICATIONS, [Query.equal('status', 'pending'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
        Query.greaterThan('$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        Query.limit(1)
      ]),
    ]);

    const storeRevenue = ordersResult.documents.reduce((sum, o) => sum + ((o as unknown as Order).total_price || 0), 0);

    return {
      totalUsers: usersResult.total,
      totalMembers: membersResult.total,
      totalNftHolders: nftHoldersResult.total,
      totalQuestsCompleted: questsCompletedResult.total,
      storeRevenue,
      activeUsers: 0,
      pendingSubmissions: pendingSubmissionsResult.total,
      pendingApplications: pendingApplicationsResult.total,
      recentOrders: recentOrdersResult.total,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
      totalUsers: 0,
      totalMembers: 0,
      totalNftHolders: 0,
      totalQuestsCompleted: 0,
      storeRevenue: 0,
      activeUsers: 0,
      pendingSubmissions: 0,
      pendingApplications: 0,
      recentOrders: 0,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// CRUD OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

// --- Posts ---
export async function getPosts(limit = 50): Promise<Post[]> {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, [
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
  ]);
  return result.documents as unknown as Post[];
}

export async function createPost(data: CreateData<Post>): Promise<Post> {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.POSTS, ID.unique(), data as Record<string, unknown>);
  return doc as unknown as Post;
}

export async function updatePost(id: string, data: CreateData<Post>): Promise<Post> {
  const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.POSTS, id, data as Record<string, unknown>);
  return doc as unknown as Post;
}

export async function deletePost(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.POSTS, id);
}

// --- Events ---
export async function getEvents(limit = 50): Promise<Event[]> {
  const response = await eventsApi.list({ limit });
  if (!response.success) {
    throw new Error(response.error as string);
  }
  return response.data.items as Event[];
}

export async function createEvent(data: CreateData<Event>): Promise<Event> {
  const response = await eventsApi.create(data as Partial<Event>);
  if (!response.success) {
    throw new Error(response.error as string);
  }
  return response.data as Event;
}

export async function updateEvent(id: string, data: CreateData<Event>): Promise<Event> {
  const response = await eventsApi.update(id, data as Partial<Event>);
  if (!response.success) {
    throw new Error(response.error as string);
  }
  return response.data as Event;
}

export async function deleteEvent(id: string): Promise<void> {
  const response = await eventsApi.delete(id);
  if (!response.success) {
    throw new Error(response.error as string);
  }
}

// --- Products ---
export async function getProducts(limit = 100): Promise<Product[]> {
  const response = await productsApi.list({ limit }) as any;
  return response.data.items as Product[];
}

export async function createProduct(data: CreateData<Product>): Promise<Product> {
  const response = await productsApi.create(data as Partial<Product>);
  return response.data as Product;
}

export async function updateProduct(id: string, data: CreateData<Product>): Promise<Product> {
  const response = await productsApi.update(id, data as Partial<Product>);
  return response.data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  await productsApi.delete(id);
}

// --- Orders ---
export async function getOrders(limit = 100): Promise<Order[]> {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
  ]);
  return result.documents as unknown as Order[];
}

export async function updateOrderStatus(id: string, status: Order['status'], trackingNumber?: string): Promise<Order> {
  const data: Record<string, unknown> = { status };
  if (trackingNumber) data.tracking_number = trackingNumber;
  const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.ORDERS, id, data);
  return doc as unknown as Order;
}

// --- Memberships ---
export async function getMemberships(limit = 100): Promise<Membership[]> {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, [
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
  ]);
  return result.documents as unknown as Membership[];
}

// --- Quests ---
export async function getQuests(): Promise<Quest[]> {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTS, [
    Query.orderDesc('$createdAt'),
  ]);
  return result.documents as unknown as Quest[];
}

export async function createQuest(data: CreateData<Quest>): Promise<Quest> {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.QUESTS, ID.unique(), data as Record<string, unknown>);
  return doc as unknown as Quest;
}

export async function updateQuest(id: string, data: CreateData<Quest>): Promise<Quest> {
  const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUESTS, id, data as Record<string, unknown>);
  return doc as unknown as Quest;
}

export async function deleteQuest(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.QUESTS, id);
}

// --- Quest Submissions ---
export async function getQuestSubmissions(status?: QuestSubmission['status']): Promise<QuestSubmission[]> {
  const queries = [Query.orderDesc('$createdAt')];
  if (status) queries.push(Query.equal('status', status));
  
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, queries);
  return result.documents as unknown as QuestSubmission[];
}

export async function reviewQuestSubmission(
  id: string,
  status: 'approved' | 'rejected',
  pointsAwarded: number,
  adminNotes?: string
): Promise<QuestSubmission> {
  const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, id, {
    status,
    points_awarded: status === 'approved' ? pointsAwarded : 0,
    admin_notes: adminNotes,
    reviewed_at: new Date().toISOString(),
  });
  return doc as unknown as QuestSubmission;
}

// --- Job Applications ---
export async function getJobApplications(status?: JobApplication['status']): Promise<JobApplication[]> {
  const queries = [Query.orderDesc('$createdAt')];
  if (status) queries.push(Query.equal('status', status));
  
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.JOB_APPLICATIONS, queries);
  return result.documents as unknown as JobApplication[];
}

export async function updateApplicationStatus(
  id: string,
  status: JobApplication['status'],
  adminNotes?: string
): Promise<JobApplication> {
  const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.JOB_APPLICATIONS, id, {
    status,
    admin_notes: adminNotes,
    reviewed_at: new Date().toISOString(),
  });
  return doc as unknown as JobApplication;
}

// --- Announcements ---
export async function getAnnouncements(): Promise<Announcement[]> {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, [
    Query.orderDesc('$createdAt'),
  ]);
  return result.documents as unknown as Announcement[];
}

export async function createAnnouncement(data: CreateData<Announcement>): Promise<Announcement> {
  const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, ID.unique(), data as Record<string, unknown>);
  return doc as unknown as Announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, id);
}

// --- Analytics ---
export async function getAnalytics(days = 30): Promise<AnalyticsDaily[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ANALYTICS, [
    Query.greaterThan('date', startDate.toISOString().split('T')[0]),
    Query.orderAsc('date'),
  ]);
  return result.documents as unknown as AnalyticsDaily[];
}

// ══════════════════════════════════════════════════════════════════════════════
// REALTIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════════════════════

export function subscribeToCollection(
  collectionId: string,
  callback: (payload: { events: string[]; payload: Models.Document }) => void
) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${collectionId}.documents`,
    callback
  );
}

export function subscribeToQuestSubmissions(callback: (payload: { events: string[]; payload: Models.Document }) => void) {
  return subscribeToCollection(COLLECTIONS.QUEST_SUBMISSIONS, callback);
}

export function subscribeToOrders(callback: (payload: { events: string[]; payload: Models.Document }) => void) {
  return subscribeToCollection(COLLECTIONS.ORDERS, callback);
}

export function subscribeToAnnouncements(callback: (payload: { events: string[]; payload: Models.Document }) => void) {
  return subscribeToCollection(COLLECTIONS.ANNOUNCEMENTS, callback);
}
