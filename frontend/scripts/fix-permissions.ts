#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════════
   Fix Appwrite Collection Permissions
   Run with: npx ts-node scripts/fix-permissions.ts
   ══════════════════════════════════════════════════════════════════════════════ */

import { Client, Databases, Permission, Role } from 'node-appwrite';

// Configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '69a7f212001b0a737d22';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = 'agentsclan_db';

if (!APPWRITE_API_KEY) {
  console.error('❌ APPWRITE_API_KEY environment variable is not set');
  process.exit(1);
}

// Initialize admin client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function fixPermissions() {
  const collectionIds = ['quests'];

  console.log('\n🔐 Fixing Appwrite collection permissions...\n');

  for (const collId of collectionIds) {
    try {
      console.log(`Updating "${collId}"...`);
      
      const result = await databases.updateCollection(
        DATABASE_ID,
        collId,
        collId,
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ]
      );
      
      console.log(`✅ Fixed permissions for "${collId}"`);
      console.log(`   Permissions: ${JSON.stringify(result.permissions)}\n`);
    } catch (e: any) {
      console.error(`❌ Error updating "${collId}":`, e.message);
      if (e.code) console.error(`   Code: ${e.code}`);
    }
  }

  console.log('✨ Done!\n');
}

fixPermissions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
