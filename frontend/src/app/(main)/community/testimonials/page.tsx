import type { Metadata } from 'next';
import TestimonialsContent from './TestimonialsContent';

export const metadata: Metadata = {
  title: "Testimonials — AgentsClan Community",
  description: "Stories from builders inside the AgentsClan community.",
};

export default function TestimonialsPage() {
  return <TestimonialsContent />;
}
