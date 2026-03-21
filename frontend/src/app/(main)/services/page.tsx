import type { Metadata } from 'next';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = {
  title: 'Services — AgentsClan',
  description: 'Everything AgentsClan offers to help builders grow, ship, and get recognized.',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
