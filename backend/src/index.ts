import 'dotenv/config';
import { serve } from '@hono/node-server';
import { app } from './app';

const port = parseInt(process.env.PORT || '3001', 10);

console.log(`🚀 Starting AgentsClan API server...`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`✅ Server running at http://localhost:${info.port}`);
    console.log(`📚 API docs: http://localhost:${info.port}/docs`);
    console.log(`🏥 Health check: http://localhost:${info.port}/health`);
  }
);
