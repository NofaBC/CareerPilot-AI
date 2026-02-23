# Stripe Integration - Quick Start Guide

**Date:** February 22, 2026  
**Session Goal:** Complete credit system + Stripe integration (100% MVP)

---

## ✅ Pre-Work Complete

- [x] Final pricing decided: Free (40), Starter ($39/500), Pro ($99/1200)
- [x] Credit costs defined: Search (8), Cover (15), Interview (25)
- [x] Top-ups priced: Small ($15/200), Medium ($40/600), Large ($90/1500)
- [x] `lib/credits.ts` created with all configuration
- [x] Implementation plan updated (Plan ID: 9a8634f2-eadc-4f6f-8f7b-743e8be6f900)
- [x] Margins protected (39-52% on all tiers)

---

## 🎯 Today's Implementation Order

### Phase 1: Stripe Setup (30 min)
1. Create Stripe account (if not exists)
2. Get API keys (test mode)
3. Create 5 products in Stripe dashboard:
   - **Starter Subscription** - $39/month recurring
   - **Pro Subscription** - $99/month recurring  
   - **Small Credit Pack** - $15 one-time
   - **Medium Credit Pack** - $40 one-time
   - **Large Credit Pack** - $90 one-time
4. Copy Price IDs and update `lib/credits.ts`
5. Install Stripe SDK: `npm install stripe @stripe/stripe-js`
6. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Phase 2: Firestore Schema Updates (15 min)
Update user document schema:
```typescript
users/{userId}
  - credits: number (40 for new users)
  - subscription: 'free' | 'starter' | 'pro'
  - creditsRefillDate: timestamp
  - lifetimeCredits: number (from top-ups)
  - stripeCustomerId: string
  - stripeSubscriptionId: string
```

### Phase 3: Credit Management API (45 min)
**Create:** `app/api/credits/route.ts`
- GET: Fetch user credits
- POST: Deduct credits (validate first)
- PUT: Add credits (from purchases)

### Phase 4: Update Existing APIs (30 min)
Add credit checks to:
- `app/api/search-jobs/route.ts`
- `app/api/generate-cover-letter/route.ts`
- `app/api/interview-coach/route.ts`

Pattern:
```typescript
// 1. Check credits
const hasCredits = await checkAndDeductCredits(userId, 'jobSearch');
if (!hasCredits) {
  return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
}

// 2. Process request
const result = await processRequest();

// 3. Credits already deducted in step 1
return NextResponse.json({ result });
```

### Phase 5: Stripe Endpoints (1 hour)
**Create:**
- `app/api/stripe/create-checkout-session/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/stripe/customer-portal/route.ts`

### Phase 6: UI Components (1 hour)
**Create:**
- `app/components/CreditsDisplay.tsx` (header badge)
- `app/components/UpgradeModal.tsx` (insufficient credits)
- `app/pricing/page.tsx` (pricing page)

**Update:**
- `app/dashboard/page.tsx` (add credits display)
- `app/profile/setup/page.tsx` (grant 40 credits on signup)

### Phase 7: Settings Page (30 min)
**Create:** `app/settings/page.tsx`
- View current plan
- Manage subscription (Stripe portal link)
- Purchase credits
- Usage history

### Phase 8: Testing (30 min)
- Test signup → 40 credits granted
- Test job search → deducts 8 credits
- Test cover letter → deducts 15 credits
- Test interview → deducts 25 credits
- Test upgrade flow (Stripe test mode)
- Test top-up purchase
- Test webhook handling

---

## 📋 Stripe Products Setup Details

### Product 1: Starter Subscription
- **Name:** CareerPilot AI - Starter
- **Description:** 500 credits per month for active job seekers
- **Type:** Recurring
- **Price:** $39 USD
- **Billing Period:** Monthly
- **Metadata:** `tier: starter`, `credits: 500`

### Product 2: Pro Subscription
- **Name:** CareerPilot AI - Pro
- **Description:** 1,200 credits per month for power users
- **Type:** Recurring
- **Price:** $99 USD
- **Billing Period:** Monthly
- **Metadata:** `tier: pro`, `credits: 1200`

### Product 3: Small Credit Pack
- **Name:** Credit Top-Up - Small
- **Description:** 200 credits (never expire)
- **Type:** One-time
- **Price:** $15 USD
- **Metadata:** `topup: small`, `credits: 200`

### Product 4: Medium Credit Pack
- **Name:** Credit Top-Up - Medium
- **Description:** 600 credits (never expire)
- **Type:** One-time
- **Price:** $40 USD
- **Metadata:** `topup: medium`, `credits: 600`

### Product 5: Large Credit Pack
- **Name:** Credit Top-Up - Large
- **Description:** 1,500 credits (never expire)
- **Type:** One-time
- **Price:** $90 USD
- **Metadata:** `topup: large`, `credits: 1500`

---

## 🔐 Security Checklist

- [ ] Stripe keys stored in environment variables (never committed)
- [ ] Webhook signature verification enabled
- [ ] User can only access their own credits
- [ ] Credit deductions are atomic (no race conditions)
- [ ] Insufficient credits block actions (402 status)
- [ ] Stripe test mode used for development

---

## 🧪 Test Scenarios

### Scenario 1: New User Flow
1. Sign up
2. Complete profile
3. **Verify:** User has 40 credits
4. Search jobs (costs 8)
5. **Verify:** User has 32 credits
6. Try to generate 5 cover letters (5 × 15 = 75 credits needed)
7. **Verify:** Blocked after 2nd cover letter (32 - 15 - 15 = 2 credits left)
8. **Verify:** "Upgrade" modal appears

### Scenario 2: Subscription Purchase
1. Click "Upgrade to Starter"
2. Complete Stripe checkout (test card: 4242 4242 4242 4242)
3. **Verify:** Redirected to dashboard
4. **Verify:** Credits = 500
5. **Verify:** Subscription badge shows "Starter"

### Scenario 3: Credit Top-Up
1. User with 10 credits
2. Purchase Large Pack ($90)
3. **Verify:** Credits = 10 + 1500 = 1510
4. **Verify:** lifetimeCredits = 1500
5. Next month refill
6. **Verify:** Credits = 1510 (lifetime credits preserved)

### Scenario 4: Monthly Refill
1. User on Starter (500 credits/month)
2. Used 450 credits
3. Has 50 credits + 100 lifetime credits = 150 total
4. Month ends, refill triggered
5. **Verify:** Credits = 500 (monthly) + 100 (lifetime) = 600

---

## 🚨 Common Issues & Solutions

### Issue: Webhook not receiving events
**Solution:** Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Issue: Credits not deducting
**Solution:** Check API response status. If 402, user lacks credits.

### Issue: Duplicate credit deductions
**Solution:** Use idempotency keys for credit operations.

### Issue: Stripe test cards not working
**Solution:** Use official test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## 📊 Success Metrics

By end of session, we should have:
- ✅ All 5 Stripe products created
- ✅ Credit system fully functional
- ✅ All APIs protected by credit checks
- ✅ Upgrade flow working end-to-end
- ✅ Pricing page live
- ✅ Settings page with billing management
- ✅ All test scenarios passing

**MVP Status: 100% COMPLETE** 🎉

---

## 📝 Post-Implementation Tasks

1. Test with real payment (small amount)
2. Switch to Stripe live mode
3. Update KNOWLEDGE_BASE.md with credit system docs
4. Deploy to production
5. Monitor for issues
6. Announce launch!

---

## 💡 Tips for Tomorrow

- Start early (fresh mind for Stripe webhooks)
- Use Stripe test mode for everything
- Test each component before moving to next
- Keep console open for debugging
- Reference `lib/credits.ts` for all pricing constants
- Don't rush - Stripe integration is critical

**Let's ship this! 🚀**
