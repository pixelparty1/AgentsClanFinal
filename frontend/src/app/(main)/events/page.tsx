import type { Metadata } from 'next';
import EventsContent from './EventsContent';

export const metadata: Metadata = {
  title: 'Events — AgentsClan',
  description: 'Hackathons, workshops, networking events, and more curated for serious builders.',
};

export default function EventsPage() {
  return <EventsContent />;
}
