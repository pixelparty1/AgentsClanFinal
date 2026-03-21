#!/usr/bin/env node
/**
 * Fix Appwrite Quests Collection Permissions
 * Run: npx ts-node scripts/fix-quest-permissions.ts
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '69a7f212001b0a737d22';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = 'agentsclan_db';
const COLLECTION_ID = 'quests';

if (!API_KEY) {
  console.error('\n❌ APPWRITE_API_KEY environment variable is not set\n');
  console.error('Please run:');
  console.error('  set APPWRITE_API_KEY=your_api_key');
  console.error('  npx ts-node scripts/fix-quest-permissions.ts\n');
  process.exit(1);
}

async function fixPermissions() {
  try {
    console.log('\n🔧 Fixing Appwrite permissions...\n');

    const client = new Client()
      .setEndpoint(ENDPOINT)
      .setProject(PROJECT_ID)
      .setKey(API_KEY);

    const databases = new Databases(client);

    // Update collection permissions
    await databases.updateCollection(
      DATABASE_ID,
      COLLECTION_ID,
      COLLECTION_ID,
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );

    console.log('✅ Permissions fixed successfully!\n');
    console.log(`Database: ${DATABASE_ID}`);
    console.log(`Collection: ${COLLECTION_ID}`);
    console.log('Permissions set to:');
    console.log('  • Read: any');
    console.log('  • Create: any');
    console.log('  • Update: any');
    console.log('  • Delete: any\n');
    console.log('You can now create quests! 🎉\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message, '\n');
    if (error.message.includes('Invalid ID')) {
      console.error('Possible causes:');
      console.error('  1. Collection ID is wrong (should be "quests")');
      console.error('  2. Database ID is wrong (should be "agentsclan_db")');
      console.error('  3. Project ID is wrong\n');
    }
    process.exit(1);
  }
}

fixPermissions();

