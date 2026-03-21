import type { Metadata } from 'next';
import BookACallContent from './BookACallContent';

export const metadata: Metadata = {
  title: 'Book a Call — AgentsClan',
  description: 'Book a free 30-minute call with the AgentsClan team.',
};

export default function BookACallPage() {
  return <BookACallContent />;
}
