import type { Metadata } from 'next';
import MembershipContent from './MembershipContent';

export const metadata: Metadata = {
  title: 'Membership — AgentsClan',
  description: 'Join the AgentsClan. Choose a plan that fits your builder journey.',
};

export default function MembershipPage() {
  return <MembershipContent />;
}
