# CareerPilot AI™: Ecosystem Integration Design

**Author:** Manus AI
**Date:** January 10, 2026

## 1. Introduction
This document outlines the integration strategy for CareerPilot AI™ within the NOFA AI Factory ecosystem, specifically focusing on its connections with **TechSupport AI™** and **AffiliateLedger AI™**.

## 2. Integration with TechSupport AI™
TechSupport AI™ will serve as the primary support and onboarding layer for CareerPilot AI™ users.

### 2.1. Embedded Support Widget
*   **Implementation**: Embed the TechSupport AI™ chat widget directly into the CareerPilot AI™ dashboard.
*   **Contextual Awareness**: Pass the user's current state (e.g., "onboarding," "searching," "interviewing") to TechSupport AI™ so it can provide relevant help articles or guidance.

### 2.2. Automated Onboarding
*   **Flow**: When a new user signs up for CareerPilot AI™, TechSupport AI™ can trigger a guided tour, explaining how to upload a resume and start their first job search.
*   **Troubleshooting**: If a user encounters an error (e.g., "API limit reached" or "Resume parsing failed"), TechSupport AI™ can automatically offer assistance or escalate the issue.

## 3. Integration with AffiliateLedger AI™
AffiliateLedger AI™ will manage all referral tracking and commission payouts for CareerPilot AI™.

### 3.1. Referral Tracking
*   **Implementation**: When a user signs up via an affiliate link, CareerPilot AI™ will notify AffiliateLedger AI™ with the `affiliateId` and `userId`.
*   **Conversion Tracking**: When a user upgrades to the $99/month plan, CareerPilot AI™ will send a "conversion" event to AffiliateLedger AI™.

### 3.2. Commission Management
*   **Standard Affiliates**: 10% recurring commission for 12 months.
*   **Strategic Partners**: (e.g., Kennedi Calling) can be offered higher or lifetime commission cuts based on negotiated agreements.

## 4. Implementation Roadmap
1.  **Phase 1**: Implement the AffiliateLedger AI™ tracking pixel/API call on the CareerPilot AI™ signup and payment success pages.
2.  **Phase 2**: Embed the TechSupport AI™ widget and configure basic contextual triggers.
3.  **Phase 3**: Develop advanced cross-tool workflows (e.g., TechSupport AI™ suggesting a specific career coach affiliate).
