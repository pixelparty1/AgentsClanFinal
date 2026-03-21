import type { Metadata } from 'next';
import DailyQuestsContent from './DailyQuestsContent';

export const metadata: Metadata = {
  title: "Daily Quests — AgentsClan Rewards",
  description: "Daily quests for AgentsClan members to earn rewards and level up.",
};

export default function DailyQuestsPage() {
  return <DailyQuestsContent />;
}
