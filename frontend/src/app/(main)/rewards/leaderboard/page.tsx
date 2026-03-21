import type { Metadata } from 'next';
import LeaderboardContent from './LeaderboardContent';

export const metadata: Metadata = {
  title: "Leaderboard — AgentsClan Rewards",
  description: "Top builders ranked by quests, events, and shipped projects.",
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
