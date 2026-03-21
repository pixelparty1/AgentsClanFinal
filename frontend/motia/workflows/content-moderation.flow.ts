/**
 * Content Moderation Workflow
 * 
 * AI-powered spam and content moderation:
 * 1. Receive new content (posts, comments)
 * 2. Run through spam detection
 * 3. Check for prohibited content
 * 4. Flag or auto-hide problematic content
 * 5. Notify admins of flagged content
 */

import { defineWorkflow, step, trigger } from '@motia/core';

interface ContentEvent {
  documentId: string;
  collection: 'posts' | 'announcements';
  content: string;
  title?: string;
  authorWallet: string;
  authorHandle?: string;
}

// Spam patterns and keywords
const SPAM_PATTERNS = [
  /\b(buy now|limited offer|act fast|urgent|winner|claim your prize)\b/i,
  /\b(crypto giveaway|free tokens|airdrop.*dm)\b/i,
  /https?:\/\/[^\s]+\.(xyz|tk|ml|ga|cf|gq)\b/i, // Suspicious TLDs
  /(.)\1{5,}/i, // Repeated characters
  /\b(dm me|send dm|message me)\b.*\b(offer|deal|investment)\b/i,
];

const PROHIBITED_PATTERNS = [
  /\b(scam alert|ponzi|pyramid scheme)\b/i,
  /private.*key|seed.*phrase|wallet.*connect/i,
];

export default defineWorkflow({
  name: 'content-moderation',
  description: 'AI-powered spam detection and content moderation',
  
  trigger: trigger.event({
    source: 'appwrite',
    events: [
      'databases.*.collections.posts.documents.*.create',
      'databases.*.collections.posts.documents.*.update',
      'databases.*.collections.announcements.documents.*.create',
    ],
  }),

  steps: [
    // Step 1: Fetch content and author data
    step('fetch-content', {
      handler: async (ctx, event: ContentEvent) => {
        const appwrite = ctx.getService('appwrite');
        
        const document = await appwrite.getDocument(event.collection, event.documentId);
        
        // Get author reputation
        let authorReputation = 100; // Default reputation
        const author = await appwrite.listDocuments('users', {
          wallet_address: document.author_wallet || event.authorWallet,
        });
        
        if (author.length > 0) {
          authorReputation = author[0].reputation_score || 100;
        }

        // Get author's previous moderation history
        const previousFlags = await appwrite.listDocuments('moderation_logs', {
          wallet_address: document.author_wallet || event.authorWallet,
          action: 'flagged',
        });

        return {
          document,
          collection: event.collection,
          content: document.content || '',
          title: document.title || '',
          authorWallet: document.author_wallet || event.authorWallet,
          authorReputation,
          previousFlagCount: previousFlags.length,
        };
      },
    }),

    // Step 2: Run spam detection
    step('detect-spam', {
      handler: async (ctx, data) => {
        const { content, title } = data;
        const fullText = `${title} ${content}`.toLowerCase();
        
        const spamSignals: string[] = [];
        let spamScore = 0;

        // Check against spam patterns
        for (const pattern of SPAM_PATTERNS) {
          if (pattern.test(fullText)) {
            spamSignals.push(`Pattern match: ${pattern.source.slice(0, 30)}...`);
            spamScore += 20;
          }
        }

        // Check for excessive links
        const linkCount = (fullText.match(/https?:\/\//g) || []).length;
        if (linkCount > 3) {
          spamSignals.push(`Excessive links: ${linkCount}`);
          spamScore += linkCount * 5;
        }

        // Check for excessive caps
        const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
        if (capsRatio > 0.5 && content.length > 20) {
          spamSignals.push('Excessive caps');
          spamScore += 15;
        }

        // Check for repeated phrases
        const words = fullText.split(/\s+/);
        const wordFreq: Record<string, number> = {};
        words.forEach(w => {
          wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
        const repeatedWords = Object.entries(wordFreq)
          .filter(([word, count]) => count > 5 && word.length > 3);
        if (repeatedWords.length > 0) {
          spamSignals.push('Repeated phrases detected');
          spamScore += 10;
        }

        // Adjust based on author reputation
        if (data.authorReputation < 50) {
          spamScore *= 1.5;
          spamSignals.push('Low author reputation');
        }

        // Adjust based on previous flags
        if (data.previousFlagCount > 0) {
          spamScore += data.previousFlagCount * 10;
          spamSignals.push(`Previous flags: ${data.previousFlagCount}`);
        }

        return {
          ...data,
          spamScore: Math.min(spamScore, 100),
          spamSignals,
          isSpam: spamScore >= 50,
        };
      },
    }),

    // Step 3: Check for prohibited content
    step('check-prohibited', {
      handler: async (ctx, data) => {
        const { content, title } = data;
        const fullText = `${title} ${content}`;
        
        const prohibitedSignals: string[] = [];
        let isProhibited = false;

        for (const pattern of PROHIBITED_PATTERNS) {
          if (pattern.test(fullText)) {
            prohibitedSignals.push(`Prohibited pattern: ${pattern.source.slice(0, 30)}...`);
            isProhibited = true;
          }
        }

        // Optional: Use AI service for content analysis
        try {
          const ai = ctx.getService('ai');
          const analysis = await ai.analyze({
            text: fullText,
            checks: ['toxicity', 'spam', 'scam'],
          });

          if (analysis.toxicity > 0.7) {
            prohibitedSignals.push('High toxicity detected');
            isProhibited = true;
          }

          if (analysis.scam > 0.8) {
            prohibitedSignals.push('Potential scam detected');
            isProhibited = true;
          }
        } catch (err) {
          // AI service unavailable, continue with pattern-based detection
          console.log('AI analysis unavailable:', err);
        }

        return {
          ...data,
          prohibitedSignals,
          isProhibited,
        };
      },
    }),

    // Step 4: Take action based on analysis
    step('take-action', {
      handler: async (ctx, data) => {
        const appwrite = ctx.getService('appwrite');
        const {
          document,
          collection,
          isSpam,
          isProhibited,
          spamScore,
          spamSignals,
          prohibitedSignals,
          authorWallet,
        } = data;

        let action: 'approved' | 'flagged' | 'hidden' | 'removed' = 'approved';
        let adminReviewRequired = false;

        if (isProhibited) {
          // Immediately hide prohibited content
          action = 'hidden';
          await appwrite.updateDocument(collection, document.$id, {
            is_visible: false,
            moderation_status: 'hidden',
            moderation_reason: 'Prohibited content detected',
          });
        } else if (isSpam && spamScore >= 80) {
          // High confidence spam - auto-hide
          action = 'hidden';
          await appwrite.updateDocument(collection, document.$id, {
            is_visible: false,
            moderation_status: 'spam',
            moderation_reason: 'Auto-detected as spam',
          });
        } else if (isSpam || spamScore >= 40) {
          // Medium confidence - flag for review
          action = 'flagged';
          adminReviewRequired = true;
          await appwrite.updateDocument(collection, document.$id, {
            moderation_status: 'pending_review',
            moderation_reason: 'Flagged for review',
          });
        }

        // Log moderation action
        await appwrite.createDocument('moderation_logs', {
          document_id: document.$id,
          collection,
          wallet_address: authorWallet,
          action,
          spam_score: spamScore,
          signals: JSON.stringify([...spamSignals, ...prohibitedSignals]),
          reviewed_at: new Date().toISOString(),
          auto_moderated: true,
        });

        // Update author reputation if content was flagged/hidden
        if (action !== 'approved') {
          const user = await appwrite.listDocuments('users', {
            wallet_address: authorWallet,
          });
          
          if (user.length > 0) {
            const newReputation = Math.max(0, (user[0].reputation_score || 100) - 10);
            await appwrite.updateDocument('users', user[0].$id, {
              reputation_score: newReputation,
            });
          }
        }

        return {
          ...data,
          action,
          adminReviewRequired,
        };
      },
    }),

    // Step 5: Notify admins if needed
    step('notify-admins', {
      condition: (data) => data.adminReviewRequired || data.action === 'hidden',
      handler: async (ctx, data) => {
        const notifications = ctx.getService('notifications');
        const {
          document,
          collection,
          action,
          spamScore,
          spamSignals,
          prohibitedSignals,
          authorWallet,
        } = data;

        const severity = action === 'hidden' ? 'high' : 'medium';
        
        await notifications.send({
          type: 'slack',
          channel: 'content-moderation',
          message: {
            text: `Content ${action}: ${collection}/${document.$id}`,
            blocks: [
              {
                type: 'header',
                text: `🚨 Content ${action.toUpperCase()}`,
              },
              {
                type: 'section',
                fields: [
                  { title: 'Collection', value: collection },
                  { title: 'Document ID', value: document.$id },
                  { title: 'Author', value: authorWallet },
                  { title: 'Spam Score', value: `${spamScore}/100` },
                  { title: 'Severity', value: severity },
                ],
              },
              {
                type: 'section',
                text: `Signals: ${[...spamSignals, ...prohibitedSignals].join(', ')}`,
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: 'Review in Admin',
                    url: `${process.env.APP_URL}/admin/moderation/${document.$id}`,
                  },
                  {
                    type: 'button',
                    text: 'Restore Content',
                    action_id: 'restore_content',
                    value: `${collection}:${document.$id}`,
                  },
                ],
              },
            ],
          },
        });

        return { notified: true };
      },
    }),
  ],

  onError: async (ctx, error, step) => {
    console.error(`Content moderation error at ${step}:`, error);
    
    // Don't block content on moderation errors
    // Just log and allow manual review
    const notifications = ctx.getService('notifications');
    await notifications.send({
      type: 'slack',
      channel: 'alerts',
      message: `Content moderation workflow error: ${error.message}`,
    });
  },
});
