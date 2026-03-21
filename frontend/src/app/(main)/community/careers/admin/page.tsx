import type { Metadata } from 'next';
import AdminContent from './AdminContent';

export const metadata: Metadata = {
  title: 'Careers Admin — AgentsClan',
  description: 'Review and manage job applications.',
};

export default function AdminPage() {
  return <AdminContent />;
}
