# CareerPilot AI - Subscription Plans & Credit System Knowledge Base

**Last Updated:** March 11, 2026  
**Version:** 1.1  
**Status:** Pre-Launch (Stripe Integration Pending)  
**Audience:** Internal team reference + Customer-facing content (sections marked)

---

## Table of Contents

1. [Overview](#overview)
2. [Subscription Plans](#subscription-plans)
3. [Credit System](#credit-system)
4. [Credit Top-Ups](#credit-top-ups)
5. [Credit Usage Costs](#credit-usage-costs)
6. [Credit Policies](#credit-policies)
7. [Pricing Strategy & Business Model](#pricing-strategy--business-model)
8. [Competitive Positioning](#competitive-positioning)
9. [User Journey & Revenue Model](#user-journey--revenue-model)
10. [Implementation Status](#implementation-status)
11. [FAQ](#faq)

---

## Overview

CareerPilot AI uses a **credit-based subscription model** designed for mid-career professionals in active 60-90 day job search campaigns. The platform offers three subscription tiers (Free, Starter, Pro) plus one-time credit top-ups that never expire.

### Core Principles
- **Simple pricing** - Easy to understand, no hidden fees
- **Fair value** - Generous credits at competitive prices
- **Flexible options** - Monthly subscriptions + never-expiring top-ups
- **English-language focus** - Best results in English-speaking countries (US, UK, Canada, Australia, Ireland, Singapore)
- **Premium positioning** - $39-$99/month for comprehensive job search tools

---

## Subscription Plans

### 1. Free Plan - $0/month

**Target Audience:** Trial users, casual job seekers

**Monthly Credits:** 40 credits

**What You Can Do:**
- ~5 job searches (8 credits each)
- ~2 AI cover letters (15 credits each)
- ~1 interview practice session (25 credits each)
- Unlimited resume building (always free)

**Features:**
- 40 credits per month
- AI profile builder
- Job search with fit scores
- Resume builder (unlimited)
- English-language job search
- ⚠️ Credits reset monthly

**Reset Policy:** Credits reset monthly (no rollover)

**Use Case:** Perfect for testing the platform before committing to a paid plan.

---

### 2. Starter Plan - $39/month ⭐

**Target Audience:** Active job seekers, moderate usage

**Monthly Credits:** 500 credits

**What You Can Do:**
- ~62 job searches
- ~33 AI cover letters
- ~20 interview practice sessions
- Unlimited resume building

**Features:**
- 500 credits per month
- Everything in Free
- Application tracking
- Dashboard analytics
- English-language job search
- ⚠️ Credits reset monthly

**Cost per Credit:** ~$0.078

**Reset Policy:** Credits reset monthly (no rollover)

**Stripe Product Details:**
- Name: CareerPilot AI - Starter
- Type: Recurring subscription
- Billing Period: Monthly
- Metadata: `tier: starter`, `credits: 500`

---

### 3. Pro Plan - $99/month 🏆 MOST POPULAR

**Target Audience:** Power users, intensive job search campaigns

**Monthly Credits:** 1,200 credits

**What You Can Do:**
- ~150 job searches
- ~80 AI cover letters
- ~48 interview practice sessions
- Unlimited resume building

**Features:**
- 1,200 credits per month
- Everything in Starter
- Priority support
- Early access to new features
- Advanced analytics
- ⚠️ Credits reset monthly

**Cost per Credit:** ~$0.083

**Reset Policy:** Credits reset monthly (no rollover)

**Badge:** MOST POPULAR

**Stripe Product Details:**
- Name: CareerPilot AI - Pro
- Type: Recurring subscription
- Billing Period: Monthly
- Metadata: `tier: pro`, `credits: 1200`

---

## Credit System

### What Are Credits?

Credits are the currency used to access AI-powered features on CareerPilot AI. Each action (job search, cover letter generation, interview practice) costs a specific number of credits.

### Credit Types

#### **Subscription Credits**
- Included with Free, Starter, and Pro plans
- Refresh monthly on billing date
- **DO NOT roll over** - unused credits expire at end of billing cycle
- Reset to full allocation each month

#### **Top-Up Credits**
- Purchased separately as one-time payments
- **Never expire** - remain in account forever
- Stack with subscription credits
- Used AFTER subscription credits are depleted

### Credit Balance Calculation

**Total Available Credits = Subscription Credits + Lifetime Top-Up Credits**

**Example:**
- User on Starter plan: 500 subscription credits
- Purchased Large Pack: +1,500 top-up credits
- **Total balance:** 2,000 credits

**Next month:**
- Subscription credits reset to 500
- Top-up credits remain: 1,500
- **New total:** 2,000 credits (unchanged)

---

## Credit Top-Ups

One-time credit purchases that **never expire**. Perfect for burst periods or when running low on monthly credits.

### Small Pack - $15

**Credits:** 200  
**Cost per Credit:** $0.075  
**Best For:** Quick top-up when running low  
**Savings:** Base price  

**Stripe Product Details:**
- Name: Credit Top-Up - Small
- Type: One-time payment
- Metadata: `topup: small`, `credits: 200`

---

### Medium Pack - $40

**Credits:** 600  
**Cost per Credit:** $0.067  
**Best For:** Extra credits during heavy search months  
**Savings:** 11% better than Small Pack  

**Stripe Product Details:**
- Name: Credit Top-Up - Medium
- Type: One-time payment
- Metadata: `topup: medium`, `credits: 600`

---

### Large Pack - $90 💎 BEST VALUE

**Credits:** 1,500  
**Cost per Credit:** $0.06  
**Best For:** Maximum value - credits never expire  
**Savings:** 20% better than Small Pack  
**Badge:** BEST VALUE  

**Stripe Product Details:**
- Name: Credit Top-Up - Large
- Type: One-time payment
- Metadata: `topup: large`, `credits: 1500`

---

## Credit Usage Costs

### Action Cost Table

| Action | Credits | What You Get | Estimated API Cost |
|--------|---------|--------------|-------------------|
| **Job Search** | 8 | 10 matched jobs with AI fit scores (0-100%) | $0.03 |
| **AI Cover Letter** | 15 | Fully tailored cover letter for any job | $0.025 |
| **Interview Practice** | 25 | Full AI coaching session with feedback | $0.045 |
| **Resume Builder** | 0 | Build and export unlimited resumes | $0 |

---

## 🔒 INTERNAL ONLY - Financial Analysis

> **⚠️ CONFIDENTIAL:** This section contains proprietary financial data. Do not share externally or include in customer-facing materials.

### Margin Targets (Model-Based Estimates)

**Average Cost per Credit:** ~$0.04 (estimated API costs)

**Estimated Margins Under Typical Usage Assumptions:**

| Plan | Revenue | Est. Cost (Full Use) | Margin | Target Margin % |
|------|---------|---------------------|--------|----------------|
| Free | $0 | $1.60 | -$1.60 | -100% (CAC) |
| Starter | $39 | $20 | $19 | 48.7% |
| Pro | $99 | $48 | $51 | 51.5% |

**Top-Up Margin Targets (If Fully Utilized):**
- Small: ($15 - $8) = $7 margin (46.7%)
- Medium: ($40 - $24) = $16 margin (40%)
- Large: ($90 - $60) = $30 margin (33.3%)

**Important Assumptions & Limitations:**
- ⚠️ **These margins assume 100% credit utilization** (users spend all credits)
- ⚠️ Actual margins will be **higher** if users don't use all credits (likely scenario)
- ⚠️ Heavy users who max out credits will achieve these target margins (worst case)
- ⚠️ Light users effectively subsidize platform costs
- Free tier is customer acquisition cost (expected loss leader)
- **Business Target:** Maintain >40% gross margin on paid tiers under full utilization scenario

---

---

## Credit Policies

### Subscription Credit Policy

✅ **Monthly Reset:** Credits refresh on billing date  
❌ **No Rollover:** Unused credits do NOT carry forward  
⚠️ **Use It or Lose It:** Credits expire at end of billing cycle  
📅 **Predictable:** Same allocation every month  

**Rationale:**
- Encourages consistent platform engagement during active job search
- Simplifies billing and user understanding
- Protects profit margins
- Aligns with 60-90 day job search campaign model

### Top-Up Credit Policy

✅ **Never Expire:** Credits remain in account forever  
✅ **Stack with Subscription:** Used after monthly credits depleted  
✅ **Portable:** Keep credits even if subscription cancelled  
✅ **Flexible:** Purchase anytime, any amount  

**Usage Priority:**
1. Subscription credits used first
2. Top-up credits used when subscription depleted
3. Monthly refill adds subscription credits back

### Refund Policy

**Subscription Plans:**
- Cancel anytime
- No refunds for partial months
- Access continues until end of billing period
- Credits expire upon cancellation (unless top-ups)

**Top-Up Credits:**
- Non-refundable once purchased
- Credits never expire, even after cancellation
- Can be used if user resubscribes later

---

## Pricing Strategy & Business Model

### Target Market

**Primary Audience:** Mid-career professionals (5-15 years experience) actively seeking new roles

**Geographic Focus:** English-speaking countries (US, UK, Canada, Australia, Ireland, Singapore)

**Platform Language:** English-only for MVP launch (job searches, resumes, cover letters, interviews)

**International Expansion:** Additional languages and markets planned for future releases

### Value Proposition

CareerPilot AI is positioned as an **all-in-one AI-powered job search platform** that consolidates multiple tools into a single solution:

**Platform Capabilities:**
- AI job matching with fit scores
- Unlimited resume building (always free)
- AI cover letter generation
- AI interview coaching
- Application tracking CRM
- English-language job search
- All-in-one pricing: $39-$99/month

**Value Comparison:**
Many job seekers currently pay for multiple separate tools:
- Job board premium subscriptions ($25-40/month)
- Resume builders or professional services ($100-500)
- Interview coaching ($100-300/session)
- Career coaches or consultants ($150-500/session)

CareerPilot AI combines these capabilities into one integrated platform.

---

## 🔒 INTERNAL ONLY - Revenue Model

> **⚠️ CONFIDENTIAL:** Financial projections and business model details. Do not share externally.

### Revenue Streams

**Primary Revenue:** Monthly subscriptions ($39-$99)

**Secondary Revenue:** One-time credit top-ups ($15-$90)

**Affiliate Revenue:** 10% recurring commissions via AffiliateLedger AI™

**Expected Customer Journey:**
- Average subscription duration: 2-3 months (60-90 day campaigns)
- Revenue per customer: $198-$297 (2.5 month average)
- Top-up purchases: ~30% of paid users (estimated)

### Pricing Philosophy

**Premium Positioning:**
- Not competing on price (no race to bottom)
- Competing on comprehensive value and outcomes
- Target users willing to invest in career advancement
- Price reflects urgency and effectiveness

**Simplicity:**
- Only 3 tiers (not overwhelming)
- Clear credit costs
- No hidden fees
- Transparent policies

**Fairness:**
- Generous credit allocations
- Resume builder always free
- Top-ups never expire
- Cancel anytime

---

---

## 🔒 INTERNAL ONLY - Competitive Positioning

> **⚠️ CONFIDENTIAL:** Competitive analysis for internal strategy only. Use safer language in public materials.

### Market Landscape

**Job Board Premiums (e.g., LinkedIn Premium, ZipRecruiter Premium)**
- Typically focus on job alerts and application visibility
- Limited AI-powered tools
- No interview coaching or resume generation
- Price range: $25-40/month

**Career Tool Suites (e.g., Teal, Huntr)**
- Focus on organization (job tracking, resume storage)
- May include resume builders
- Limited AI capabilities
- Price range: $50-120/month

**CareerPilot AI Differentiators:**
- ✅ AI-powered fit scoring for job matches
- ✅ AI cover letter generation (typically $50-100 per letter elsewhere)
- ✅ AI interview coaching (typically $100-300/session elsewhere)
- ✅ Unlimited resume builder (always free)
- ✅ All-in-one platform (no tool-switching)
- ✅ Transparent credit-based pricing

### Safe Public Messaging

**Instead of:** "We're better/cheaper than [Competitor]"  
**Use:** "We offer comprehensive AI-powered tools in one platform"

**Instead of:** "[Competitor] only does X"  
**Use:** "We include AI matching, resume building, cover letters, and interview coaching"

**Instead of:** "We're X% cheaper"  
**Use:** "Our pricing is designed to provide exceptional value for active job seekers"

---

---

## 🔒 INTERNAL ONLY - User Journey & Revenue Projections

> **⚠️ CONFIDENTIAL:** Customer journey analysis and financial projections. For internal planning only.

## User Journey Model

### Typical 60-90 Day Campaign Journey

**Week 1-2: Setup & Discovery (Free Plan)**
- User signs up, gets 40 free credits
- Builds profile and first resume
- Tests job search (3-5 searches)
- Generates 1-2 cover letters
- **Outcome:** Realizes value, hits credit limit

**Week 3-8: Active Search (Starter or Pro)**
- Upgrades to paid plan
- Heavy usage: 10-20 searches/week
- 5-10 cover letters/week
- 2-3 interview practices/week
- **Revenue:** $39-$99/month

**Week 9-12: Interview Phase (Continued Subscription)**
- Fewer searches, more interview prep
- May purchase top-up if needed
- Uses application tracker extensively
- **Revenue:** $39-$99/month + possible $15-$90 top-up

**Post-Campaign:**
- User finds job, cancels subscription
- **Total Revenue:** $78-$297 (depending on duration and top-ups)

### Revenue Projections

**Conservative Model (1,000 paying users/month):**
- 60% Starter ($39) = 600 × $39 = $23,400
- 40% Pro ($99) = 400 × $99 = $39,600
- **Subscription MRR:** $63,000

**Top-Up Revenue (30% purchase rate):**
- 300 purchases × $50 average = $15,000/month

**Total MRR:** ~$78,000

**Annual Revenue:** ~$936,000

**Assumptions:**
- Customer acquisition via organic + affiliate channels
- 2.5 month average retention (aligned with 60-90 day campaigns)
- 30% top-up purchase rate among paid users
- 5% monthly churn to Free tier

---

---

## Implementation Status

### ✅ Completed

- [x] Pricing strategy finalized
- [x] Credit costs defined
- [x] Subscription tiers designed
- [x] Top-up packs configured
- [x] `lib/credits.ts` configuration file created
- [x] Margin analysis completed
- [x] Marketing copy written
- [x] FAQ prepared
- [x] Geographic limitation policies established
- [x] No-rollover policy documented

### ❌ Pending (Stripe Integration)

- [ ] Stripe account setup
- [ ] Create 5 Stripe products (3 subscriptions + 3 top-ups)
- [ ] Copy Stripe Price IDs to `lib/credits.ts`
- [ ] Install Stripe SDK
- [ ] Build credit management API (`app/api/credits/route.ts`)
- [ ] Update existing APIs with credit checks
- [ ] Create Stripe webhook handler
- [ ] Build pricing page (`app/pricing/page.tsx`)
- [ ] Build billing settings page
- [ ] Create credit display components
- [ ] Implement upgrade/insufficient credits modal
- [ ] End-to-end testing with Stripe test mode
- [ ] Switch to Stripe live mode
- [ ] Production deployment

**Estimated Implementation Time:** 4-6 hours

**Reference Guide:** `STRIPE_INTEGRATION_GUIDE.md`

---

## FAQ

### General Questions

**Q: What are credits?**  
A: Credits are the currency used to access AI-powered features. Each action (job search, cover letter, interview) costs a specific number of credits.

**Q: How do I get credits?**  
A: You receive monthly credits based on your subscription plan (Free: 40, Starter: 500, Pro: 1,200). You can also purchase one-time top-up packs that never expire.

**Q: What happens if I run out of credits?**  
A: You can purchase credit top-ups anytime. Top-up credits never expire, unlike monthly subscription credits.

---

### Subscription Questions

**Q: Can I change plans?**  
A: Yes! Upgrade or downgrade anytime. Changes take effect at your next billing cycle.

**Q: Can I cancel anytime?**  
A: Yes. Cancel anytime with no penalty. Your access continues until the end of your current billing period.

**Q: Do I get a refund if I cancel mid-month?**  
A: No. You keep access until the end of your billing period, but no prorated refunds are issued.

---

### Credit Policy Questions

**Q: Do unused credits roll over?**  
A: **No.** Subscription credits reset every month and unused credits do not carry over. However, top-up credits (purchased separately) never expire and remain in your account forever.

**Q: What's the difference between subscription credits and top-up credits?**  
A: Subscription credits come with your monthly plan and reset each month. Top-up credits are purchased separately, never expire, and remain in your account even if you cancel.

**Q: Which credits get used first?**  
A: Subscription credits are used first, then top-up credits are used when your monthly allocation runs out.

**Q: What happens to my credits if I cancel?**  
A: Subscription credits expire when your plan ends. Top-up credits remain in your account forever and can be used if you resubscribe later.

---

### Billing Questions

**Q: Which countries do you support?**  
A: CareerPilot AI works best in English-speaking countries: United States, United Kingdom, Canada, Australia, Ireland, and Singapore. All platform features (job searches, resumes, cover letters, interviews) are in English. Limited support is available for other countries, with clear warnings during signup.

**Q: What payment methods do you accept?**  
A: We accept all major credit cards via Stripe. Your payment information is secure and encrypted.

**Q: Can I get an invoice?**  
A: Yes. All payments generate automatic invoices sent to your email and available in your billing settings.

---

### Feature Questions

**Q: Is the resume builder really unlimited and free?**  
A: Yes! You can build, edit, and export unlimited resumes at no cost, regardless of your plan.

**Q: How accurate are the job fit scores?**  
A: Fit scores (0-100%) are calculated by AI comparing your profile against job requirements. They're highly accurate but should be used as guidance, not absolute truth.

**Q: Do cover letters work for any job?**  
A: Yes! Our AI generates fully customized cover letters for any job posting by analyzing the job description and your profile.

---

## Marketing Copy & Messaging

### Headlines

**Primary:** "Choose Your Plan"  
**Secondary:** "Premium AI-powered job search. Global reach. Fair pricing."

### Badges

- 🌍 Available in 14+ countries
- ✅ Cancel anytime
- 🏆 MOST POPULAR (Pro plan)
- 💎 BEST VALUE (Large top-up)

### Value Props

**For Starter Plan:**
"Everything you need for an active job search. 500 credits to power through applications with AI assistance."

**For Pro Plan:**
"Maximum firepower for intensive campaigns. 1,200 credits plus priority support and early access to features."

### Safe Comparison Taglines (Public-Facing)

- "Beyond job alerts - get AI-powered cover letters and interview coaching"
- "All-in-one platform: search, apply, prepare, and track in one place"
- "Comprehensive AI tools at a price that respects your budget"
- "Free resume builder + AI-powered job search starting at $39/month"

---

## Technical Reference

### Firestore Schema

```typescript
users/{userId}
  - credits: number (current balance)
  - subscription: 'free' | 'starter' | 'pro'
  - creditsRefillDate: timestamp
  - lifetimeCredits: number (from top-ups)
  - stripeCustomerId: string
  - stripeSubscriptionId: string
```

### Credit Cost Constants

```typescript
CREDIT_COSTS = {
  jobSearch: 8,
  coverLetter: 15,
  interviewSession: 25,
  resumeBuilder: 0,
}
```

### Estimated API Costs (Internal Reference)

> **⚠️ INTERNAL ONLY:** Cost structure for margin calculations

```typescript
ESTIMATED_COSTS = {
  jobSearch: 0.03,      // JSearch API
  coverLetter: 0.025,   // OpenAI ~500 tokens
  interviewSession: 0.045, // OpenAI ~1000 tokens
  perCredit: 0.04,      // Average
}
```

---

## Change Log

**v1.1 - March 11, 2026**
- Updated to English-language markets only (removed "global reach" claims)
- Marked internal-only sections (margins, revenue projections, competitive analysis)
- Replaced absolute competitor claims with safe comparative language
- Added confidentiality warnings for sensitive data
- Clarified geographic scope throughout
- Updated margin language to "Margin Targets (Model-Based Estimates)" and "Estimated Margins Under Typical Usage Assumptions"
- Added clear disclaimer that margins assume 100% credit utilization (worst-case scenario)
- Clarified that actual margins will be higher if users don't use all credits

**v1.0 - March 11, 2026**
- Initial knowledge base creation
- Documented complete subscription and credit system
- Added no-rollover policy
- Clarified credit reset behavior
- Comprehensive FAQ section

---

**Document Owner:** Farhad Nassiri  
**Project:** CareerPilot AI MVP  
**Status:** Pre-Launch Documentation
