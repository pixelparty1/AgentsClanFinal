import type { Metadata } from 'next';
import AchievementsContent from './AchievementsContent';

export const metadata: Metadata = {
  title: 'Achievements — AgentsClan',
  description: 'Community milestones, top builders, award recipients, and shipped projects.',
};

export default function AchievementsPage() {
  return <AchievementsContent />;
}
