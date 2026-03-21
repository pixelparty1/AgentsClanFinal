/* ══════════════════════════════════════════════════════════════════════════════
   Appwrite Permissions Utility
   Automatically fixes collection permissions if needed
   ══════════════════════════════════════════════════════════════════════════════ */

import { Databases, Permission, Role } from 'node-appwrite';

export async function ensureCollectionPermissions(
  databases: Databases,
  databaseId: string,
  collectionId: string
): Promise<void> {
  try {
    // Try to update collection permissions to allow API key access
    await databases.updateCollection(
      databaseId,
      collectionId,
      collectionId,
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
      undefined,
      true // Enable collection
    );
    
    console.log(`✅ Ensured permissions for collection: ${collectionId}`);
  } catch (error: any) {
    // Silently fail - permissions might already be correct
    if (!error.message?.includes('already')) {
      console.warn(`⚠️  Permission check for ${collectionId}:`, error.message);
    }
  }
}
