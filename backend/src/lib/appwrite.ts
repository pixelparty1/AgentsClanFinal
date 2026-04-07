/* ══════════════════════════════════════════════════════════════════════════════
   Appwrite Server Configuration
   Uses API key for server-side operations
   ══════════════════════════════════════════════════════════════════════════════ */

import { Client, Databases, Storage, Users } from 'node-appwrite';

// Initialize Appwrite client with API key (server-side)
const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '69a7f212001b0a737d22')
  .setKey(process.env.APPWRITE_API_KEY || '');

// Export services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const users = new Users(client);

// Database ID
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'agentsclan_db';

// Collection IDs
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
  PRODUCT_IMAGES: '69ac2f1900366fd84f06',
  QUEST_PROOFS: 'quest_proofs',
  RESUMES: 'resumes',
  AVATARS: 'avatars',
} as const;

export { client };
