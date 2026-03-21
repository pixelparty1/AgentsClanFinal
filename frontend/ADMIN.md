# AgentsClan Admin Dashboard

Complete owner-only admin dashboard for managing the AgentsClan Web3 community platform.

## Features

- 🔐 **Wallet-Based Access Control** - Only the owner wallet can access the dashboard
- 📊 **Real-time Analytics** - Track revenue, users, orders, and quest completions
- 🛍️ **Store Management** - Products, orders, inventory tracking
- 🎯 **Quest System** - Create quests and review submissions
- 💳 **Stripe Payments** - Membership tiers and store checkout
- 🎫 **NFT Memberships** - Zero-gas minting on Polygon Amoy
- 📢 **Announcements** - Targeted announcements to users
- 🔔 **Real-time Notifications** - Live updates via Appwrite subscriptions

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TailwindCSS
- **Database**: Appwrite Cloud
- **Payments**: Stripe
- **Blockchain**: Polygon Amoy (testnet) / Polygon PoS (mainnet)
- **Wallet**: wagmi + viem + WalletConnect
- **Workflows**: Motia.dev

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Appwrite project ID
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_OWNER_WALLET_ADDRESS` - Admin wallet address
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` - Deployed NFT contract
- `RELAYER_PRIVATE_KEY` - For gasless minting

### 2. Appwrite Setup

Run the setup script to create all database collections:

```bash
npx tsx scripts/setup-appwrite.ts
```

This creates:
- 13 database collections (users, posts, events, products, orders, etc.)
- 4 storage buckets (images, proofs, resumes, avatars)
- Sample quest data

### 3. Deploy NFT Contract

Deploy `contracts/AgentsClanMembership.sol` to Polygon Amoy:

```bash
# Using Hardhat
npx hardhat run scripts/deploy.js --network amoy

# Or using Foundry
forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY contracts/AgentsClanMembership.sol:AgentsClanMembership
```

### 4. Configure Stripe Webhooks

Create a webhook in Stripe Dashboard pointing to:
```
https://your-domain.com/api/webhook/stripe
```

Events to listen for:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### 5. Start Development

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000/admin` and connect your owner wallet.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (admin)/                 # Admin route group
│   │   │   ├── layout.tsx           # Admin layout with providers
│   │   │   ├── AdminShell.tsx       # Sidebar + top bar + auth
│   │   │   └── admin/
│   │   │       ├── page.tsx         # Dashboard overview
│   │   │       ├── products/        # Product management
│   │   │       ├── orders/          # Order management
│   │   │       ├── quests/          # Quest & submissions
│   │   │       ├── memberships/     # NFT memberships
│   │   │       ├── events/          # Event management
│   │   │       ├── posts/           # Blog posts
│   │   │       ├── applications/    # Job applications
│   │   │       ├── announcements/   # Announcements
│   │   │       └── analytics/       # Analytics dashboard
│   │   └── api/
│   │       ├── checkout/            # Stripe checkout
│   │       ├── mint/gasless/        # Gasless NFT minting
│   │       └── webhook/stripe/      # Stripe webhooks
│   ├── components/
│   │   └── admin/
│   │       └── RealtimeNotifications.tsx
│   ├── context/
│   │   └── AdminContext.tsx         # Admin auth context
│   ├── hooks/
│   │   ├── useMembershipMint.ts     # NFT minting hooks
│   │   └── useRealtimeSubscription.ts # Appwrite realtime
│   └── lib/
│       ├── appwrite.ts              # Appwrite client
│       ├── admin.ts                 # Admin CRUD operations
│       └── stripe.ts                # Stripe utilities
├── contracts/
│   └── AgentsClanMembership.sol     # ERC-721 NFT contract
├── motia/
│   └── workflows/
│       ├── payment-completion.flow.ts
│       ├── quest-validation.flow.ts
│       └── content-moderation.flow.ts
└── scripts/
    └── setup-appwrite.ts            # Database setup script
```

## Database Schema

### Collections

| Collection | Description |
|-----------|-------------|
| `users` | User profiles with wallet addresses |
| `posts` | Blog posts with markdown content |
| `events` | Community events (online/in-person) |
| `products` | Store products |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `memberships` | NFT membership records |
| `quests` | Quests/tasks for users |
| `quest_submissions` | User quest submissions |
| `job_applications` | Career applications |
| `announcements` | System announcements |
| `analytics_daily` | Daily aggregated metrics |
| `nft_transactions` | NFT minting transactions |

## Membership Tiers

| Tier | Price (INR) | XP Bonus |
|------|-------------|----------|
| Free | ₹0 | Base |
| Bronze | ₹999 | 1.5x |
| Silver | ₹1,999 | 2x |
| Gold | ₹4,999 | 3x |
| Platinum | ₹9,999 | 5x |

## Real-time Features

The dashboard uses Appwrite subscriptions for live updates:

- **Orders** - New order notifications
- **Quest Submissions** - Pending review alerts
- **Memberships** - New member notifications
- **Inventory** - Low stock alerts
- **Admin Stats** - Live counters

## Motia Workflows

Three workflow templates are included:

1. **Payment Completion** - Handles successful payments, creates records, triggers NFT minting
2. **Quest Validation** - Auto-validates quest submissions, awards XP
3. **Content Moderation** - Spam detection, content filtering, admin alerts

## Security

- Admin access is restricted by wallet address (`NEXT_PUBLIC_OWNER_WALLET_ADDRESS`)
- All database operations are authenticated via Appwrite
- Stripe webhooks are verified using `STRIPE_WEBHOOK_SECRET`
- NFT minting uses EIP-712 signatures for meta-transactions

## Production Checklist

- [ ] Switch Stripe keys from test to live
- [ ] Deploy NFT contract to Polygon mainnet
- [ ] Update RPC URL to Polygon mainnet
- [ ] Create new relayer wallet with mainnet MATIC
- [ ] Set up Stripe webhook for production domain
- [ ] Enable Appwrite database security rules
- [ ] Configure CORS in Appwrite for your domain
- [ ] Set up monitoring (Sentry, PostHog)

## License

MIT
