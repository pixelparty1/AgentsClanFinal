#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════════
   Appwrite Database Schema Setup Script
   Run with: npx ts-node scripts/setup-appwrite.ts
   ══════════════════════════════════════════════════════════════════════════════ */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';

// Configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = 'agentsclan_db';

// Initialize admin client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function createDatabase() {
  try {
    await databases.create(DATABASE_ID, 'AgentsClan Database');
    console.log('✅ Database created');
  } catch (e: any) {
    if (e.code === 409) console.log('⏭️  Database already exists');
    else throw e;
  }
}

async function createCollections() {
  const collections = [
    // ═══════════════════════════════════════════════════════════════════
    // USERS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'users',
      name: 'Users',
      attributes: [
        { type: 'string', key: 'wallet_address', size: 64, required: true },
        { type: 'email', key: 'email', required: false },
        { type: 'string', key: 'username', size: 64, required: false },
        { type: 'string', key: 'avatar_url', size: 512, required: false },
        { type: 'enum', key: 'role', elements: ['member', 'admin', 'moderator'], required: true, default: 'member' },
        { type: 'integer', key: 'total_points', required: false, default: 0 },
        { type: 'integer', key: 'streak_days', required: false, default: 0 },
        { type: 'datetime', key: 'last_activity_at', required: false },
      ],
      indexes: [
        { key: 'wallet_address_idx', type: 'unique', attributes: ['wallet_address'] },
        { key: 'role_idx', type: 'key', attributes: ['role'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // POSTS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'posts',
      name: 'Posts',
      attributes: [
        { type: 'string', key: 'title', size: 256, required: true },
        { type: 'string', key: 'content', size: 65535, required: true },
        { type: 'string', key: 'excerpt', size: 512, required: false },
        { type: 'string', key: 'cover_image_url', size: 512, required: false },
        { type: 'string', key: 'author_id', size: 36, required: false },
        { type: 'string', key: 'category', size: 64, required: false, default: 'general' },
        { type: 'string', key: 'tags', size: 1024, required: false, array: true },
        { type: 'boolean', key: 'is_published', required: false, default: false },
        { type: 'boolean', key: 'is_pinned', required: false, default: false },
        { type: 'integer', key: 'view_count', required: false, default: 0 },
      ],
      indexes: [
        { key: 'author_idx', type: 'key', attributes: ['author_id'] },
        { key: 'published_idx', type: 'key', attributes: ['is_published'] },
        { key: 'category_idx', type: 'key', attributes: ['category'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // EVENTS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'events',
      name: 'Events',
      attributes: [
        { type: 'string', key: 'title', size: 256, required: true },
        { type: 'string', key: 'description', size: 4096, required: false },
        { type: 'datetime', key: 'event_date', required: true },
        { type: 'datetime', key: 'end_date', required: false },
        { type: 'string', key: 'location', size: 256, required: false },
        { type: 'enum', key: 'location_type', elements: ['online', 'offline', 'hybrid'], required: false, default: 'online' },
        { type: 'enum', key: 'event_type', elements: ['meetup', 'workshop', 'hackathon', 'ama', 'webinar', 'conference'], required: false, default: 'meetup' },
        { type: 'string', key: 'cover_image_url', size: 512, required: false },
        { type: 'string', key: 'meeting_link', size: 512, required: false },
        { type: 'integer', key: 'max_attendees', required: false },
        { type: 'integer', key: 'current_attendees', required: false, default: 0 },
        { type: 'boolean', key: 'is_featured', required: false, default: false },
        { type: 'boolean', key: 'is_published', required: false, default: true },
        { type: 'string', key: 'created_by', size: 36, required: false },
      ],
      indexes: [
        { key: 'event_date_idx', type: 'key', attributes: ['event_date'] },
        { key: 'event_type_idx', type: 'key', attributes: ['event_type'] },
        { key: 'published_idx', type: 'key', attributes: ['is_published'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // PRODUCTS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'products',
      name: 'Products',
      attributes: [
        { type: 'string', key: 'name', size: 256, required: true },
        { type: 'string', key: 'handle', size: 128, required: true },
        { type: 'string', key: 'description', size: 4096, required: false },
        { type: 'string', key: 'details', size: 1024, required: false, array: true },
        { type: 'integer', key: 'price', required: true }, // Price in smallest unit (cents/paisa)
        { type: 'integer', key: 'compare_price', required: false },
        { type: 'string', key: 'category', size: 64, required: false, default: 'general' },
        { type: 'string', key: 'images', size: 512, required: false, array: true },
        { type: 'string', key: 'sizes', size: 32, required: false, array: true },
        { type: 'integer', key: 'stock', required: false, default: 0 },
        { type: 'boolean', key: 'is_active', required: false, default: true },
        { type: 'string', key: 'badge', size: 32, required: false },
        { type: 'float', key: 'rating', required: false, default: 0 },
        { type: 'integer', key: 'review_count', required: false, default: 0 },
      ],
      indexes: [
        { key: 'handle_idx', type: 'unique', attributes: ['handle'] },
        { key: 'category_idx', type: 'key', attributes: ['category'] },
        { key: 'active_idx', type: 'key', attributes: ['is_active'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // ORDERS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'orders',
      name: 'Orders',
      attributes: [
        { type: 'string', key: 'order_number', size: 32, required: true },
        { type: 'string', key: 'user_wallet', size: 64, required: true },
        { type: 'string', key: 'user_id', size: 36, required: false },
        { type: 'integer', key: 'subtotal', required: true },
        { type: 'integer', key: 'shipping_cost', required: false, default: 0 },
        { type: 'integer', key: 'tax', required: false, default: 0 },
        { type: 'integer', key: 'total_price', required: true },
        { type: 'string', key: 'currency', size: 8, required: false, default: 'INR' },
        { type: 'enum', key: 'status', elements: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], required: false, default: 'pending' },
        { type: 'string', key: 'payment_method', size: 32, required: false },
        { type: 'string', key: 'stripe_payment_id', size: 128, required: false },
        { type: 'string', key: 'stripe_session_id', size: 128, required: false },
        { type: 'string', key: 'shipping_name', size: 128, required: false },
        { type: 'string', key: 'shipping_email', size: 256, required: false },
        { type: 'string', key: 'shipping_phone', size: 32, required: false },
        { type: 'string', key: 'shipping_address', size: 512, required: false },
        { type: 'string', key: 'shipping_city', size: 64, required: false },
        { type: 'string', key: 'shipping_state', size: 64, required: false },
        { type: 'string', key: 'shipping_pincode', size: 16, required: false },
        { type: 'string', key: 'tracking_number', size: 64, required: false },
        { type: 'string', key: 'notes', size: 1024, required: false },
      ],
      indexes: [
        { key: 'order_number_idx', type: 'unique', attributes: ['order_number'] },
        { key: 'wallet_idx', type: 'key', attributes: ['user_wallet'] },
        { key: 'status_idx', type: 'key', attributes: ['status'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // ORDER ITEMS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'order_items',
      name: 'Order Items',
      attributes: [
        { type: 'string', key: 'order_id', size: 36, required: true },
        { type: 'string', key: 'product_id', size: 36, required: false },
        { type: 'string', key: 'product_name', size: 256, required: true },
        { type: 'string', key: 'product_image', size: 512, required: false },
        { type: 'integer', key: 'quantity', required: true, default: 1 },
        { type: 'string', key: 'size', size: 16, required: false },
        { type: 'integer', key: 'unit_price', required: true },
        { type: 'integer', key: 'total_price', required: true },
      ],
      indexes: [
        { key: 'order_idx', type: 'key', attributes: ['order_id'] },
        { key: 'product_idx', type: 'key', attributes: ['product_id'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // MEMBERSHIPS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'memberships',
      name: 'Memberships',
      attributes: [
        { type: 'string', key: 'wallet_address', size: 64, required: true },
        { type: 'string', key: 'user_id', size: 36, required: false },
        { type: 'enum', key: 'tier', elements: ['creator', 'legend'], required: true },
        { type: 'integer', key: 'price_paid', required: false },
        { type: 'string', key: 'currency', size: 8, required: false, default: 'INR' },
        { type: 'string', key: 'stripe_payment_id', size: 128, required: false },
        { type: 'string', key: 'stripe_session_id', size: 128, required: false },
        { type: 'string', key: 'mint_tx_hash', size: 128, required: false },
        { type: 'string', key: 'token_id', size: 32, required: false },
        { type: 'string', key: 'nft_metadata', size: 4096, required: false }, // JSON string
        { type: 'enum', key: 'status', elements: ['pending', 'paid', 'minting', 'minted', 'failed'], required: false, default: 'pending' },
        { type: 'datetime', key: 'expires_at', required: false },
      ],
      indexes: [
        { key: 'wallet_idx', type: 'key', attributes: ['wallet_address'] },
        { key: 'tier_idx', type: 'key', attributes: ['tier'] },
        { key: 'status_idx', type: 'key', attributes: ['status'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // QUESTS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'quests',
      name: 'Quests',
      attributes: [
        { type: 'string', key: 'title', size: 256, required: true },
        { type: 'string', key: 'description', size: 2048, required: false },
        { type: 'integer', key: 'points', required: true, default: 10 },
        { type: 'string', key: 'category', size: 64, required: true },
        { type: 'enum', key: 'difficulty', elements: ['easy', 'medium', 'hard'], required: false, default: 'easy' },
        { type: 'string', key: 'estimated_time', size: 32, required: false },
        { type: 'boolean', key: 'is_active', required: false, default: true },
        { type: 'boolean', key: 'is_daily', required: false, default: false },
        { type: 'integer', key: 'max_submissions', required: false },
        { type: 'datetime', key: 'start_date', required: false },
        { type: 'datetime', key: 'end_date', required: false },
      ],
      indexes: [
        { key: 'category_idx', type: 'key', attributes: ['category'] },
        { key: 'active_idx', type: 'key', attributes: ['is_active'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // QUEST SUBMISSIONS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'quest_submissions',
      name: 'Quest Submissions',
      attributes: [
        { type: 'string', key: 'user_wallet', size: 64, required: true },
        { type: 'string', key: 'quest_id', size: 36, required: true },
        { type: 'string', key: 'proof_link', size: 512, required: false },
        { type: 'string', key: 'description', size: 2048, required: false },
        { type: 'string', key: 'file_url', size: 512, required: false },
        { type: 'enum', key: 'status', elements: ['pending', 'approved', 'rejected'], required: false, default: 'pending' },
        { type: 'integer', key: 'points_awarded', required: false, default: 0 },
        { type: 'string', key: 'reviewed_by', size: 36, required: false },
        { type: 'datetime', key: 'reviewed_at', required: false },
        { type: 'string', key: 'admin_notes', size: 1024, required: false },
      ],
      indexes: [
        { key: 'wallet_idx', type: 'key', attributes: ['user_wallet'] },
        { key: 'quest_idx', type: 'key', attributes: ['quest_id'] },
        { key: 'status_idx', type: 'key', attributes: ['status'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // JOB APPLICATIONS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'job_applications',
      name: 'Job Applications',
      attributes: [
        { type: 'string', key: 'user_wallet', size: 64, required: true },
        { type: 'string', key: 'job_id', size: 64, required: true },
        { type: 'string', key: 'full_name', size: 128, required: true },
        { type: 'email', key: 'email', required: true },
        { type: 'string', key: 'phone', size: 32, required: false },
        { type: 'string', key: 'portfolio_url', size: 512, required: false },
        { type: 'string', key: 'github_url', size: 512, required: false },
        { type: 'string', key: 'linkedin_url', size: 512, required: false },
        { type: 'string', key: 'resume_url', size: 512, required: false },
        { type: 'string', key: 'cover_letter', size: 4096, required: false },
        { type: 'string', key: 'motivation_text', size: 2048, required: false },
        { type: 'string', key: 'recent_build', size: 1024, required: false },
        { type: 'enum', key: 'status', elements: ['pending', 'shortlisted', 'interview', 'rejected', 'hired'], required: false, default: 'pending' },
        { type: 'string', key: 'admin_notes', size: 2048, required: false },
        { type: 'string', key: 'reviewed_by', size: 36, required: false },
        { type: 'datetime', key: 'reviewed_at', required: false },
      ],
      indexes: [
        { key: 'wallet_idx', type: 'key', attributes: ['user_wallet'] },
        { key: 'job_idx', type: 'key', attributes: ['job_id'] },
        { key: 'status_idx', type: 'key', attributes: ['status'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // ANNOUNCEMENTS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'announcements',
      name: 'Announcements',
      attributes: [
        { type: 'string', key: 'title', size: 256, required: true },
        { type: 'string', key: 'content', size: 4096, required: true },
        { type: 'enum', key: 'type', elements: ['info', 'warning', 'success', 'urgent'], required: false, default: 'info' },
        { type: 'boolean', key: 'is_active', required: false, default: true },
        { type: 'datetime', key: 'starts_at', required: false },
        { type: 'datetime', key: 'ends_at', required: false },
        { type: 'string', key: 'created_by', size: 36, required: false },
      ],
      indexes: [
        { key: 'active_idx', type: 'key', attributes: ['is_active'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // ANALYTICS DAILY COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'analytics_daily',
      name: 'Analytics Daily',
      attributes: [
        { type: 'string', key: 'date', size: 16, required: true }, // YYYY-MM-DD
        { type: 'integer', key: 'total_users', required: false, default: 0 },
        { type: 'integer', key: 'new_users', required: false, default: 0 },
        { type: 'integer', key: 'active_users', required: false, default: 0 },
        { type: 'integer', key: 'total_members', required: false, default: 0 },
        { type: 'integer', key: 'total_nft_holders', required: false, default: 0 },
        { type: 'integer', key: 'quests_completed', required: false, default: 0 },
        { type: 'integer', key: 'store_revenue', required: false, default: 0 },
        { type: 'integer', key: 'orders_count', required: false, default: 0 },
        { type: 'integer', key: 'page_views', required: false, default: 0 },
      ],
      indexes: [
        { key: 'date_idx', type: 'unique', attributes: ['date'] },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // NFT TRANSACTIONS COLLECTION
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'nft_transactions',
      name: 'NFT Transactions',
      attributes: [
        { type: 'string', key: 'wallet_address', size: 64, required: true },
        { type: 'string', key: 'tier', size: 32, required: true },
        { type: 'string', key: 'tx_hash', size: 128, required: true },
        { type: 'string', key: 'token_id', size: 32, required: false },
        { type: 'string', key: 'gas_used', size: 32, required: false },
        { type: 'string', key: 'gas_price', size: 32, required: false },
        { type: 'integer', key: 'block_number', required: false },
        { type: 'string', key: 'metadata_uri', size: 512, required: false },
        { type: 'enum', key: 'status', elements: ['pending', 'confirmed', 'failed'], required: false, default: 'confirmed' },
      ],
      indexes: [
        { key: 'wallet_idx', type: 'key', attributes: ['wallet_address'] },
        { key: 'tx_hash_idx', type: 'unique', attributes: ['tx_hash'] },
      ],
    },
  ];

  for (const col of collections) {
    try {
      // Create collection
      await databases.createCollection(
        DATABASE_ID,
        col.id,
        col.name,
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log(`✅ Collection "${col.name}" created`);

      // Create attributes
      for (const attr of col.attributes) {
        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.size || 256,
              attr.required || false,
              attr.default,
              attr.array || false
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required || false,
              undefined,
              undefined,
              attr.default
            );
          } else if (attr.type === 'float') {
            await databases.createFloatAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required || false,
              undefined,
              undefined,
              attr.default
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required || false,
              attr.default
            );
          } else if (attr.type === 'datetime') {
            await databases.createDatetimeAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required || false
            );
          } else if (attr.type === 'email') {
            await databases.createEmailAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required || false
            );
          } else if (attr.type === 'enum') {
            await databases.createEnumAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.elements || [],
              attr.required || false,
              attr.default
            );
          }
          console.log(`  📝 Attribute "${attr.key}" created`);
        } catch (e: any) {
          if (e.code === 409) console.log(`  ⏭️  Attribute "${attr.key}" exists`);
          else console.error(`  ❌ Attribute "${attr.key}" failed:`, e.message);
        }
      }

      // Wait for attributes to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create indexes
      for (const idx of col.indexes || []) {
        try {
          await databases.createIndex(
            DATABASE_ID,
            col.id,
            idx.key,
            idx.type,
            idx.attributes
          );
          console.log(`  🔍 Index "${idx.key}" created`);
        } catch (e: any) {
          if (e.code === 409) console.log(`  ⏭️  Index "${idx.key}" exists`);
          else console.error(`  ❌ Index "${idx.key}" failed:`, e.message);
        }
      }
    } catch (e: any) {
      if (e.code === 409) console.log(`⏭️  Collection "${col.name}" exists`);
      else console.error(`❌ Collection "${col.name}" failed:`, e.message);
    }
  }
}

async function createStorageBuckets() {
  const buckets = [
    { id: 'product_images', name: 'Product Images', maxFileSize: 5 * 1024 * 1024 },
    { id: 'quest_proofs', name: 'Quest Proofs', maxFileSize: 10 * 1024 * 1024 },
    { id: 'resumes', name: 'Resumes', maxFileSize: 5 * 1024 * 1024 },
    { id: 'avatars', name: 'Avatars', maxFileSize: 2 * 1024 * 1024 },
  ];

  for (const bucket of buckets) {
    try {
      await storage.createBucket(
        bucket.id,
        bucket.name,
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false, // fileSecurity
        true, // enabled
        bucket.maxFileSize
      );
      console.log(`✅ Bucket "${bucket.name}" created`);
    } catch (e: any) {
      if (e.code === 409) console.log(`⏭️  Bucket "${bucket.name}" exists`);
      else console.error(`❌ Bucket "${bucket.name}" failed:`, e.message);
    }
  }
}

async function seedQuests() {
  const quests = [
    { title: 'Ship One Small Feature', description: 'Commit and push at least one meaningful change to a personal or community project.', points: 25, category: 'Builder', difficulty: 'medium', estimated_time: '~45 min', is_active: true, is_daily: true },
    { title: 'Help Another Builder', description: 'Answer a question, review code, or give feedback to someone in the community.', points: 15, category: 'Community', difficulty: 'easy', estimated_time: '~20 min', is_active: true, is_daily: true },
    { title: 'Study for 30 Minutes', description: 'Read docs, watch a talk, or learn something new and share a short summary.', points: 10, category: 'Learning', difficulty: 'easy', estimated_time: '30 min', is_active: true, is_daily: true },
    { title: 'Attend an Event or Session', description: 'Join an AgentsClan event, AMA, or workshop live.', points: 20, category: 'Show Up', difficulty: 'easy', estimated_time: 'Variable', is_active: true, is_daily: false },
    { title: 'Share Your Build Progress', description: 'Post an honest progress update in the community or on socials.', points: 10, category: 'Social', difficulty: 'easy', estimated_time: '~10 min', is_active: true, is_daily: true },
    { title: 'Make One Contribution', description: 'Open a pull request or file a helpful issue in an open-source project.', points: 35, category: 'Open Source', difficulty: 'hard', estimated_time: '~60+ min', is_active: true, is_daily: false },
  ];

  for (const quest of quests) {
    try {
      await databases.createDocument(DATABASE_ID, 'quests', ID.unique(), quest);
      console.log(`✅ Quest "${quest.title}" seeded`);
    } catch (e: any) {
      console.error(`❌ Quest "${quest.title}" failed:`, e.message);
    }
  }
}

async function main() {
  console.log('\n🚀 Setting up Appwrite Database for AgentsClan\n');
  
  await createDatabase();
  console.log('');
  await createCollections();
  console.log('');
  await createStorageBuckets();
  console.log('');
  await seedQuests();
  
  console.log('\n✨ Setup complete!\n');
}

main().catch(console.error);
