import type { Metadata } from 'next';
import CommunityContent from './CommunityContent';

export const metadata: Metadata = {
  title: "Community — AgentsClan",
  description: "Explore the AgentsClan community, careers, and member stories.",
};

export default function CommunityPage() {
  return <CommunityContent />;
}
