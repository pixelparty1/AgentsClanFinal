import type { Metadata } from 'next';
import CareersContent from './CareersContent';

export const metadata: Metadata = {
  title: "Careers — AgentsClan Community",
  description: "Roles and opportunities shared with the AgentsClan community.",
};

export default function CareersPage() {
  return <CareersContent />;
}
