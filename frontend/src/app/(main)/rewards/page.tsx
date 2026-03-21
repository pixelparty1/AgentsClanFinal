import type { Metadata } from 'next';
import RewardsContent from './RewardsContent';

export const metadata: Metadata = {
  title: "Rewards — AgentsClan",
  description: "Quests, leaderboard, and store rewards for the AgentsClan community.",
};

export default function RewardsPage() {
  return <RewardsContent />;
}
