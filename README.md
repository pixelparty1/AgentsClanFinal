# AgentsClan Platform

A Web3 community platform with NFT memberships, events, quests, and a merchandise store.

## Project Structure

This is a **pnpm monorepo** with the following packages:

```
AgentsClan-website-new/
├── frontend/          # Next.js 16 + React 19 web application
├── backend/           # Hono API server
├── packages/
│   └── shared/        # Shared types and utilities
├── earth/             # 3D Earth visualization (standalone)
├── pnpm-workspace.yaml
└── package.json       # Root workspace scripts
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9.15+
- Appwrite account
- Stripe account
- Polygon Amoy testnet wallet (for NFT minting)

### Installation

```bash
# Install all dependencies
pnpm install

# Build shared package first
pnpm --filter @agentsclan/shared build
```

### Environment Setup

1. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

2. Fill in your credentials in both `.env` files.

### Development

```bash
# Run everything in parallel
pnpm dev

# Or run individually:
pnpm dev:backend   # Backend on http://localhost:3001
pnpm dev:frontend  # Frontend on http://localhost:3000
```

### Production Build

```bash
# Build all packages
pnpm build

# Start production servers
pnpm start
```

## Packages

### Frontend (`/frontend`)

Next.js 16 application with:
- **wagmi/viem**: Wallet connection and blockchain interactions
- **TailwindCSS**: Styling
- **Framer Motion**: Animations
- **React Three Fiber**: 3D Earth globe
- **Zustand**: State management

Key features:
- NFT membership minting
- Event calendar
- Quest system
- Merchandise store with Stripe checkout
- Admin dashboard

### Backend (`/backend`)

Hono-based API server with:
- **Appwrite**: Database and storage
- **Stripe**: Payment processing
- **viem**: Blockchain interactions (gasless minting)

API Routes:
- `/api/checkout` - Stripe checkout sessions
- `/api/webhook/stripe` - Stripe webhooks
- `/api/mint` - NFT minting (gasless + direct)
- `/api/users` - User management
- `/api/products` - Product catalog
- `/api/orders` - Order management
- `/api/memberships` - Membership queries
- `/api/quests` - Quest CRUD + submissions
- `/api/events` - Event management
- `/api/posts` - Blog posts
- `/api/analytics` - Dashboard statistics
- `/api/admin` - Admin operations

### Shared (`/packages/shared`)

Shared TypeScript types and utilities:
- All entity types (User, Product, Order, Event, etc.)
- API request/response types
- Utility functions (formatters, validators)

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Appwrite   │
│  (Next.js)  │     │   (Hono)    │     │ (Database)  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │
      │                   ▼
      │             ┌─────────────┐
      │             │   Stripe    │
      │             │ (Payments)  │
      │             └─────────────┘
      │                   
      ▼                   
┌─────────────┐     ┌─────────────┐
│   wagmi/    │────▶│  Polygon    │
│   viem      │     │  Amoy RPC   │
└─────────────┘     └─────────────┘
```

### Key Design Decisions

1. **Separated Backend**: API routes moved from Next.js to dedicated Hono server for:
   - Better separation of concerns
   - Independent scaling
   - Cleaner codebase

2. **Shared Types Package**: Ensures type safety across frontend and backend

3. **Gasless Minting**: Backend relayer pays gas fees for user convenience

4. **Appwrite over Supabase**: Server-side SDK with API key for better security

## Deployment

### Backend (Recommended: Fly.io, Railway, or Render)

```bash
cd backend
pnpm build
pnpm start
```

### Frontend (Recommended: Vercel)

```bash
cd frontend
pnpm build
pnpm start
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.

## Development Tips

### Adding New API Routes

1. Create route file in `backend/src/routes/`
2. Add route types to `packages/shared/src/types/`
3. Mount route in `backend/src/app.ts`
4. Add API client function in `frontend/src/lib/api.ts`

### Type Changes

After modifying shared types:
```bash
pnpm --filter @agentsclan/shared build
```

### Database Schema

Appwrite collections are defined in `backend/src/lib/appwrite.ts` as `COLLECTIONS`.

## License

MIT
