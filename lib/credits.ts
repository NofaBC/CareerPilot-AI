/**
 * CareerPilot AI - Credit System Configuration
 * 
 * Final pricing structure (updated 02/21/2026):
 * - Conservative Pro tier (1,200 credits vs 2,000)
 * - Protected margins on all tiers
 * - Premium positioning ($39/$99)
 */

export const CREDIT_COSTS = {
  jobSearch: 8,
  coverLetter: 15,
  interviewSession: 25,
  resumeBuilder: 0, // Always free
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 40,
    interval: 'month',
    description: 'Try before you buy',
    resetPolicy: 'Credits reset monthly (no rollover)',
    features: [
      '40 credits per month',
      '~5 job searches',
      '~2 AI cover letters',
      '~1 interview practice',
      'Resume builder (unlimited)',
      'Global job search (14+ countries)',
      '⚠️ Credits reset monthly',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 39,
    credits: 500,
    interval: 'month',
    description: 'For active job seekers',
    resetPolicy: 'Credits reset monthly (no rollover)',
    stripePriceId: 'price_1TKgQGAhdh05oATtjCVB5w5z',
    features: [
      '500 credits per month',
      '~62 job searches',
      '~33 AI cover letters',
      '~20 interview practices',
      'Resume builder (unlimited)',
      'Global job search (14+ countries)',
      'Application tracking',
      'Dashboard analytics',
      '⚠️ Credits reset monthly',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    credits: 1200, // Conservative: protects margins
    interval: 'month',
    description: 'For power users',
    resetPolicy: 'Credits reset monthly (no rollover)',
    stripePriceId: 'price_1TKgUBAhdh05oATtztWPKM2G',
    badge: 'MOST POPULAR',
    features: [
      '1,200 credits per month',
      '~150 job searches',
      '~80 AI cover letters',
      '~48 interview practices',
      'Everything in Starter',
      'Priority support',
      'Early access to features',
      'Advanced analytics',
      '⚠️ Credits reset monthly',
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export const CREDIT_TOPUPS = {
  small: {
    id: 'small',
    name: 'Small Pack',
    price: 15,
    credits: 200,
    stripePriceId: 'price_1TKgZMAhdh05oATtzWI7Lgvh',
    bestFor: 'Quick top-up when you run low',
    pricePerCredit: 0.075,
  },
  medium: {
    id: 'medium',
    name: 'Medium Pack',
    price: 40,
    credits: 600,
    stripePriceId: 'price_1TKgbxAhdh05oATtbDZ1f3w6',
    bestFor: 'Extra credits for a heavy search month',
    pricePerCredit: 0.067,
    savings: '11% better than Small',
  },
  large: {
    id: 'large',
    name: 'Large Pack',
    price: 90,
    credits: 1500,
    stripePriceId: 'price_1TKgeSAhdh05oATt4caag6Lx',
    bestFor: 'Best value - credits never expire',
    pricePerCredit: 0.06,
    savings: '20% better than Small',
    badge: 'BEST VALUE',
  },
} as const;

export type CreditTopup = keyof typeof CREDIT_TOPUPS;

/**
 * Calculate how many times a user can perform an action with given credits
 */
export function getCapacity(credits: number, action: CreditAction): number {
  return Math.floor(credits / CREDIT_COSTS[action]);
}

/**
 * Calculate cost for multiple actions
 */
export function calculateCost(actions: Partial<Record<CreditAction, number>>): number {
  return Object.entries(actions).reduce((total, [action, count]) => {
    return total + (CREDIT_COSTS[action as CreditAction] * (count || 0));
  }, 0);
}

/**
 * Check if user has sufficient credits for an action
 */
export function hasSufficientCredits(userCredits: number, action: CreditAction, quantity: number = 1): boolean {
  return userCredits >= CREDIT_COSTS[action] * quantity;
}

/**
 * Get subscription tier from Stripe price ID
 */
export function getTierFromPriceId(priceId: string): SubscriptionTier | null {
  for (const [key, tier] of Object.entries(SUBSCRIPTION_TIERS)) {
    if ('stripePriceId' in tier && tier.stripePriceId === priceId) {
      return key as SubscriptionTier;
    }
  }
  return null;
}

/**
 * Get topup from Stripe price ID
 */
export function getTopupFromPriceId(priceId: string): CreditTopup | null {
  for (const [key, topup] of Object.entries(CREDIT_TOPUPS)) {
    if (topup.stripePriceId === priceId) {
      return key as CreditTopup;
    }
  }
  return null;
}

/**
 * Marketing copy helpers
 */
export const PRICING_COPY = {
  headline: 'Choose Your Plan',
  subheadline: 'Premium AI-powered job search. Global reach. Fair pricing.',
  globalBadge: '🌍 Available in 14+ countries',
  guaranteeBadge: '✅ Cancel anytime',
  
  comparisons: {
    vsLinkedIn: 'LinkedIn Premium is $39.99/month for just job alerts. We give you AI cover letters, interview coach, resume builder, and global search.',
    vsZipRecruiter: 'ZipRecruiter Premium is $24.99/month for job search only. We add AI-powered tools and international support.',
    vsTeal: 'Teal charges ~$116/month. We offer the same features plus global reach at $99.',
  },

  creditsExplained: {
    title: 'How Credits Work',
    description: 'Credits let you use AI-powered features. Each action costs credits:',
    actions: [
      { name: 'Job Search', cost: 8, description: 'Search and get 10 matched jobs with fit scores' },
      { name: 'AI Cover Letter', cost: 15, description: 'Generate tailored cover letter for any job' },
      { name: 'Interview Practice', cost: 25, description: 'Full AI interview coaching session' },
      { name: 'Resume Builder', cost: 0, description: 'Build and export unlimited resumes (always free)' },
    ],
    importantNote: '⚠️ Subscription credits reset monthly and do not roll over. Top-up credits never expire.',
  },

  faqs: [
    {
      q: 'What happens if I run out of credits?',
      a: 'You can purchase credit top-ups anytime. Top-up credits never expire, unlike monthly subscription credits.',
    },
    {
      q: 'Can I change plans?',
      a: 'Yes! Upgrade or downgrade anytime. Changes take effect at your next billing cycle.',
    },
    {
      q: 'Do unused credits roll over?',
      a: 'No. Subscription credits reset every month and unused credits do not carry over. However, top-up credits (purchased separately) never expire and remain in your account forever.',
    },
    {
      q: 'Which countries do you support?',
      a: 'We support 14+ countries: US, UK, Canada, Australia, Germany, France, Netherlands, Spain, Italy, Ireland, Singapore, India, UAE, and more.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards via Stripe. Your payment information is secure and encrypted.',
    },
  ],
};

/**
 * Cost analysis for internal reference
 * (Estimated API costs per action)
 */
export const ESTIMATED_COSTS = {
  jobSearch: 0.03, // JSearch API
  coverLetter: 0.025, // OpenAI ~500 tokens
  interviewSession: 0.045, // OpenAI ~1000 tokens
  perCredit: 0.04, // Average cost per credit
} as const;

/**
 * Margin target calculations (for internal reference)
 * 
 * IMPORTANT: These are TARGET margins assuming 100% credit utilization.
 * Actual margins will vary based on user behavior:
 * - Light users (don't use all credits) = higher margins
 * - Heavy users (max out credits) = these target margins
 * 
 * This represents the worst-case margin scenario (full utilization).
 */
export function calculateMargins() {
  return {
    free: {
      revenue: 0,
      cost: SUBSCRIPTION_TIERS.free.credits * ESTIMATED_COSTS.perCredit,
      margin: -(SUBSCRIPTION_TIERS.free.credits * ESTIMATED_COSTS.perCredit),
      marginPercent: -100,
      note: 'Customer acquisition cost (expected loss)',
    },
    starter: {
      revenue: SUBSCRIPTION_TIERS.starter.price,
      cost: SUBSCRIPTION_TIERS.starter.credits * ESTIMATED_COSTS.perCredit,
      margin: SUBSCRIPTION_TIERS.starter.price - (SUBSCRIPTION_TIERS.starter.credits * ESTIMATED_COSTS.perCredit),
      marginPercent: ((SUBSCRIPTION_TIERS.starter.price - (SUBSCRIPTION_TIERS.starter.credits * ESTIMATED_COSTS.perCredit)) / SUBSCRIPTION_TIERS.starter.price) * 100,
      note: 'Target margin if user uses all 500 credits',
    },
    pro: {
      revenue: SUBSCRIPTION_TIERS.pro.price,
      cost: SUBSCRIPTION_TIERS.pro.credits * ESTIMATED_COSTS.perCredit,
      margin: SUBSCRIPTION_TIERS.pro.price - (SUBSCRIPTION_TIERS.pro.credits * ESTIMATED_COSTS.perCredit),
      marginPercent: ((SUBSCRIPTION_TIERS.pro.price - (SUBSCRIPTION_TIERS.pro.credits * ESTIMATED_COSTS.perCredit)) / SUBSCRIPTION_TIERS.pro.price) * 100,
      note: 'Target margin if user uses all 1,200 credits',
    },
  };
}
