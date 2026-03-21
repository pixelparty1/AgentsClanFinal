# Motia.dev Workflow Configuration for AgentsClan

This directory contains workflow definitions for Motia.dev orchestration.

## Setup

1. Install Motia CLI:
```bash
npm install -g @motia/cli
```

2. Initialize project:
```bash
motia init
```

3. Configure environment variables in `.env.local`:
```
MOTIA_API_KEY=your-api-key
APPWRITE_ENDPOINT=your-appwrite-endpoint
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
STRIPE_SECRET_KEY=your-stripe-key
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

4. Deploy workflows:
```bash
motia deploy --env production
```

## Workflows

### 1. Payment Completion Flow (`payment-completion.flow.ts`)
Triggered when Stripe payment completes:
- Verifies payment status
- Creates order record
- Triggers NFT minting for memberships
- Sends confirmation notifications

### 2. Quest Validation Flow (`quest-validation.flow.ts`)
Auto-validates quest submissions:
- Checks proof authenticity
- Awards XP on approval
- Sends notifications

### 3. Content Moderation Flow (`content-moderation.flow.ts`)
AI-powered spam detection:
- Scans new posts/comments
- Flags suspicious content
- Auto-hides spam
- Notifies admins

### 4. Membership Upgrade Flow (`membership-upgrade.flow.ts`)
Handles tier upgrades:
- Processes payment
- Updates NFT metadata
- Awards bonus XP
