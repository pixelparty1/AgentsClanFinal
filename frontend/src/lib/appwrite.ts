/* ══════════════════════════════════════════════════════════════════════════════
   Appwrite Client Configuration
   ══════════════════════════════════════════════════════════════════════════════ */

import { Client, Account, Databases, Storage, Functions, Avatars } from 'appwrite';

// Environment variables
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69a7f212001b0a737d22';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const avatars = new Avatars(client);

// Export client for realtime
export { client };

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'agentsclan_db';

export const COLLECTIONS = {
  USERS: 'auth',
  USERS_TABLE: 'users',
  ADMIN: 'admin',
  POSTS: 'posts',
  EVENTS: 'events',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  MEMBERSHIPS: 'memberships',
  QUESTS: 'quests',
  QUEST_SUBMISSIONS: 'quest_submissions',
  QUESTS_SUBMISSIONS: 'quests_submissions',
  JOB_APPLICATIONS: 'job_applications',
  ANNOUNCEMENTS: 'announcements',
  ANALYTICS: 'analytics_daily',
  NFT_TRANSACTIONS: 'nft_transactions',
} as const;

// Storage Bucket IDs
export const BUCKETS = {
  PRODUCT_IMAGES: 'product_images',
  QUEST_PROOFS: 'quest_proofs',
  RESUMES: 'resumes',
  AVATARS: 'avatars',
} as const;

// Function IDs
export const FUNCTIONS_IDS = {
  MINT_NFT: 'mint_nft',
  PROCESS_PAYMENT: 'process_payment',
  VERIFY_WEBHOOK: 'verify_webhook',
} as const;
