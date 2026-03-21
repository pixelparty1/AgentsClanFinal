/**
 * Quest Validation Workflow
 * 
 * Automatically validates quest submissions:
 * 1. Receive new submission
 * 2. Validate proof (URL checks, screenshot verification)
 * 3. Award XP on approval
 * 4. Update user stats
 * 5. Send notifications
 */

import { defineWorkflow, step, trigger } from '@motia/core';

interface QuestSubmission {
  submissionId: string;
  questId: string;
  walletAddress: string;
  handle: string;
  proofUrl?: string;
  proofText?: string;
  questType: string;
  platform: string;
  xpReward: number;
}

export default defineWorkflow({
  name: 'quest-validation',
  description: 'Validates quest submissions and awards XP',
  
  trigger: trigger.event({
    source: 'appwrite',
    event: 'databases.*.collections.quest_submissions.documents.*.create',
  }),

  steps: [
    // Step 1: Fetch full submission and quest data
    step('fetch-data', {
      handler: async (ctx, event: QuestSubmission) => {
        const appwrite = ctx.getService('appwrite');
        
        const submission = await appwrite.getDocument(
          'quest_submissions',
          event.submissionId
        );
        
        const quest = await appwrite.getDocument('quests', submission.quest_id);

        return {
          submission,
          quest,
          walletAddress: submission.wallet_address,
          xpReward: quest.xp_reward,
        };
      },
    }),

    // Step 2: Validate proof based on quest type
    step('validate-proof', {
      handler: async (ctx, data) => {
        const { submission, quest } = data;
        const validation = { isValid: false, reason: '' };

        // Social quest validation (Twitter, Discord, etc.)
        if (quest.quest_type === 'social') {
          if (!submission.proof_url) {
            validation.reason = 'No proof URL provided';
            return { ...data, validation };
          }

          // Verify URL format matches expected platform
          const urlPatterns: Record<string, RegExp> = {
            twitter: /^https?:\/\/(twitter\.com|x\.com)\//,
            discord: /^https?:\/\/discord\.(com|gg)\//,
            youtube: /^https?:\/\/(www\.)?youtube\.com\//,
            github: /^https?:\/\/github\.com\//,
          };

          const pattern = urlPatterns[quest.platform];
          if (pattern && !pattern.test(submission.proof_url)) {
            validation.reason = `Invalid ${quest.platform} URL`;
            return { ...data, validation };
          }

          // For Twitter: Check if the tweet exists (basic check)
          if (quest.platform === 'twitter') {
            try {
              const twitter = ctx.getService('twitter');
              const tweetExists = await twitter.verifyTweetExists(submission.proof_url);
              
              if (!tweetExists) {
                validation.reason = 'Tweet not found or deleted';
                return { ...data, validation };
              }

              // Optional: Check if tweet mentions required hashtags
              if (quest.required_hashtags) {
                const tweetHasHashtags = await twitter.checkHashtags(
                  submission.proof_url,
                  quest.required_hashtags
                );
                if (!tweetHasHashtags) {
                  validation.reason = 'Tweet missing required hashtags';
                  return { ...data, validation };
                }
              }
            } catch (err) {
              // If Twitter API fails, mark for manual review
              return { ...data, validation: { isValid: false, reason: 'manual_review' } };
            }
          }

          validation.isValid = true;
        }

        // Content quest validation (screenshots, videos)
        if (quest.quest_type === 'content') {
          if (!submission.proof_url) {
            validation.reason = 'No proof file provided';
            return { ...data, validation };
          }

          // Verify file is accessible
          try {
            const response = await fetch(submission.proof_url, { method: 'HEAD' });
            if (!response.ok) {
              validation.reason = 'Proof file not accessible';
              return { ...data, validation };
            }
            validation.isValid = true;
          } catch {
            validation.reason = 'Could not verify proof file';
            return { ...data, validation };
          }
        }

        // Referral quest validation
        if (quest.quest_type === 'referral') {
          const appwrite = ctx.getService('appwrite');
          
          // Check if referred user exists and has completed onboarding
          if (submission.referred_wallet) {
            const referredUser = await appwrite.listDocuments('users', {
              wallet_address: submission.referred_wallet,
            });
            
            if (referredUser.length > 0 && referredUser[0].onboarding_completed) {
              validation.isValid = true;
            } else {
              validation.reason = 'Referred user not found or not onboarded';
            }
          }
        }

        // Community quest validation (attendance, participation)
        if (quest.quest_type === 'community') {
          // These typically need manual review
          validation.reason = 'manual_review';
        }

        return { ...data, validation };
      },
    }),

    // Step 3: Process validation result
    step('process-result', {
      handler: async (ctx, data) => {
        const appwrite = ctx.getService('appwrite');
        const { submission, validation, xpReward, walletAddress } = data;

        if (validation.reason === 'manual_review') {
          // Mark for admin review
          await appwrite.updateDocument('quest_submissions', submission.$id, {
            status: 'pending',
            admin_notes: 'Requires manual review',
          });
          return { ...data, action: 'manual_review' };
        }

        if (validation.isValid) {
          // Approve submission
          await appwrite.updateDocument('quest_submissions', submission.$id, {
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            auto_reviewed: true,
          });

          // Award XP
          const membership = await appwrite.listDocuments('memberships', {
            wallet_address: walletAddress,
            is_active: true,
          });

          if (membership.length > 0) {
            const currentXP = membership[0].xp_balance || 0;
            await appwrite.updateDocument('memberships', membership[0].$id, {
              xp_balance: currentXP + xpReward,
            });
          }

          // Update user stats
          await ctx.emit('user.xp.awarded', {
            walletAddress,
            amount: xpReward,
            source: 'quest',
            questId: submission.quest_id,
          });

          return { ...data, action: 'approved', xpAwarded: xpReward };
        } else {
          // Reject submission
          await appwrite.updateDocument('quest_submissions', submission.$id, {
            status: 'rejected',
            rejection_reason: validation.reason,
            reviewed_at: new Date().toISOString(),
            auto_reviewed: true,
          });

          return { ...data, action: 'rejected', reason: validation.reason };
        }
      },
    }),

    // Step 4: Send notifications
    step('send-notifications', {
      handler: async (ctx, data) => {
        const notifications = ctx.getService('notifications');
        const { submission, quest, action, xpAwarded, reason } = data;

        if (action === 'approved') {
          // Notify user of approval
          await notifications.send({
            type: 'push',
            to: submission.wallet_address,
            template: 'quest-approved',
            data: {
              questTitle: quest.title,
              xpAwarded,
            },
          });
        } else if (action === 'rejected') {
          // Notify user of rejection
          await notifications.send({
            type: 'push',
            to: submission.wallet_address,
            template: 'quest-rejected',
            data: {
              questTitle: quest.title,
              reason,
            },
          });
        } else if (action === 'manual_review') {
          // Notify admins
          await notifications.send({
            type: 'slack',
            channel: 'quest-reviews',
            message: `New quest submission needs review: ${quest.title} by ${submission.handle}`,
          });
        }

        return { completed: true };
      },
    }),
  ],

  onError: async (ctx, error, step) => {
    console.error(`Quest validation error at ${step}:`, error);
    
    // Mark submission for manual review on error
    const appwrite = ctx.getService('appwrite');
    if (ctx.data?.submission?.$id) {
      await appwrite.updateDocument('quest_submissions', ctx.data.submission.$id, {
        status: 'pending',
        admin_notes: `Auto-validation error: ${error.message}`,
      });
    }
  },
});
