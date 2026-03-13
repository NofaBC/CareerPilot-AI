# CareerPilot AI™ – Master Technical Knowledge Base

**Product Name:** CareerPilot AI™  
**Product Type:** AI-Powered Job Search & Career Acceleration SaaS Platform  
**Version:** 0.9.5 (MVP - Pre-Stripe)  
**Document Version:** 1.0  
**Last Updated:** March 12, 2026  
**Maintained By:** Farhad Nassiri (@NofaBC)  
**Part of:** NOFA AI Factory Ecosystem

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [System Architecture](#system-architecture)
4. [Technical Stack](#technical-stack)
5. [Data Architecture](#data-architecture)
6. [Core Features](#core-features)
7. [Credit System & Pricing](#credit-system--pricing)
8. [Authentication & Security](#authentication--security)
9. [API Reference](#api-reference)
10. [Deployment & Infrastructure](#deployment--infrastructure)
11. [Ecosystem Integration](#ecosystem-integration)
12. [Performance & Optimization](#performance--optimization)
13. [Development Workflow](#development-workflow)
14. [Testing & Quality Assurance](#testing--quality-assurance)
15. [Troubleshooting & Common Issues](#troubleshooting--common-issues)
16. [Best Practices](#best-practices)
17. [Roadmap & Future Development](#roadmap--future-development)
18. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1. Product Vision

**CareerPilot AI™** is an AI-powered job search SaaS platform designed to accelerate career transitions for mid-career professionals within a **60-90 day campaign cycle**. The platform combines intelligent job matching, AI-generated cover letters, resume building, and interview coaching into a single, comprehensive solution.

Unlike passive job boards, CareerPilot AI™ acts as an **active campaign manager**, providing:
- **Intelligent Job Matching** with AI-powered fit scores (0-100%)
- **Smart Apply** functionality with auto-generated cover letters
- **Resume Builder** with professional PDF export
- **AI Interview Coach** for behavioral, technical, and general interview prep
- **Application Tracking CRM** for managing the entire job search pipeline

### 1.2. Target Market

**Primary Audience:**
- Mid-career professionals (5-15 years experience)
- Active job seekers in career transition
- English-language markets (US, UK, Canada, Australia, etc.)

**Use Case:**
- Focused 60-90 day job search campaigns
- High-intensity job hunting requiring rapid results
- Multiple applications requiring personalized materials

### 1.3. Value Proposition

| Traditional Approach | CareerPilot AI™ Advantage |
|---------------------|---------------------------|
| Manual job searches across multiple boards | Single platform with AI-powered matching |
| Generic resumes and cover letters | Tailored materials for every application |
| Expensive career coaches ($100-300/session) | Unlimited AI coaching at fraction of cost |
| Scattered application tracking | Centralized CRM dashboard |
| Time-intensive (4-6 months average) | Accelerated 60-90 day timeline |

### 1.4. Key Metrics (Target)

- **Average Search Duration:** 2.5 months (60-75 days)
- **Application Efficiency:** 3-5x faster than manual approach
- **User Lifetime Value:** $198-$297 (2-3 month subscriptions)
- **Customer Acquisition Cost:** <$50 (via organic + affiliates)
- **Target Conversion Rate:** 20% free → paid

---

## 2. Product Overview

### 2.1. Core Capabilities

#### A. Job Discovery & Matching
- Real-time job search across 14+ countries
- AI-powered skill matching algorithm
- Personalized fit scores (0-100%)
- Matching skills highlighting
- Date formatting and validation

#### B. Application Materials Generation
- **Resume Builder:** Multi-section resume creation with PDF export
- **Cover Letter Generator:** AI-generated, job-specific cover letters
- **Smart Apply:** One-click application tracking + materials

#### C. Interview Preparation
- **AI Interview Coach:** General, behavioral, and technical interview types
- **Conversation History:** Context-aware coaching sessions
- **Feedback Loop:** Constructive feedback on answers

#### D. Campaign Management
- **Application Tracking:** Centralized CRM for all applications
- **Status Management:** Applied, In Review, Interview, Offer, Rejected
- **Analytics Dashboard:** Applications sent, responses, interviews booked

### 2.2. Geographic Coverage

**Fully Supported (English-language markets):**
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇮🇪 Ireland
- 🇳🇿 New Zealand
- 🇸🇬 Singapore
- 🇦🇪 United Arab Emirates
- 🇮🇳 India

**Limited Support (Non-English):**
- 🇩🇪 Germany
- 🇫🇷 France
- 🇮🇹 Italy
- 🇪🇸 Spain
- 🇳🇱 Netherlands

**Note:** Users in limited-support countries receive a confirmation modal before signup warning of:
- Zero job availability in local language
- English-only content and interface
- Requirement to search for English-speaking roles

### 2.3. Live URLs

- **Production:** https://career-pilot-ai-gamma.vercel.app/
- **Repository:** https://github.com/NofaBC/CareerPilot-AI
- **Documentation:** This file + `KNOWLEDGE_BASE.md` + `SUBSCRIPTION_AND_CREDITS_KNOWLEDGE_BASE.md`

---

## 3. System Architecture

### 3.1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Next.js 14)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │  Profile │  │ Resume   │  │Interview │   │
│  │          │  │  Setup   │  │ Builder  │  │  Coach   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Next.js API Routes)             │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐     │
│  │ /search-jobs │  │ /cover-letter │  │ /interview  │     │
│  │              │  │               │  │   -coach    │     │
│  └──────────────┘  └───────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                        │
│  ┌──────────────┐  ┌───────────┐  ┌────────────┐          │
│  │   Firebase   │  │  OpenAI   │  │  JSearch   │          │
│  │ Firestore DB │  │ GPT-3.5   │  │   API      │          │
│  │   + Auth     │  │           │  │            │          │
│  └──────────────┘  └───────────┘  └────────────┘          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT LAYER (Pending)                  │
│                    ┌──────────────┐                         │
│                    │    Stripe    │                         │
│                    │ Subscriptions│                         │
│                    │  + Webhooks  │                         │
│                    └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### 3.2. Directory Structure

```
CareerPilot-AI/
├── app/                                # Next.js 14 App Router
│   ├── api/                           # API Routes
│   │   ├── search-jobs/
│   │   │   └── route.ts              # Job search endpoint
│   │   ├── generate-cover-letter/
│   │   │   └── route.ts              # Cover letter generation
│   │   ├── interview-coach/
│   │   │   └── route.ts              # Interview coaching
│   │   ├── submit-application/
│   │   │   └── route.ts              # Application tracking
│   │   └── debug-profile/
│   │       └── route.ts              # Debug utility
│   │
│   ├── dashboard/                     # Main dashboard UI
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── resume-builder/
│   │   │   └── page.tsx              # Resume creation tool
│   │   └── interview-coach/
│   │       └── page.tsx              # Interview practice UI
│   │
│   ├── profile/                       # Profile management
│   │   ├── setup/
│   │   │   └── page.tsx              # Initial profile setup
│   │   ├── edit/
│   │   │   └── page.tsx              # Profile editing
│   │   └── update-skills/
│   │       └── page.tsx              # Skills management
│   │
│   ├── login/
│   │   └── page.tsx                  # Authentication
│   ├── signup/
│   │   └── page.tsx                  # Registration
│   ├── debug/
│   │   └── page.tsx                  # Debug page
│   │
│   ├── components/                    # Reusable UI components
│   │   ├── JobMatchList.tsx          # Job listing component
│   │   └── [other components]
│   │
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Landing page
│   └── globals.css                    # Global styles
│
├── lib/                               # Utility libraries
│   ├── firebase.ts                   # Firebase client config
│   ├── firebase-admin.ts             # Firebase Admin SDK
│   ├── auth-hooks.ts                 # Auth utilities
│   ├── applications.ts               # Application tracking
│   └── credits.ts                    # Credit system config
│
├── public/                            # Static assets
│   └── [images, icons, etc.]
│
├── dev-logs/                          # Development logs
│   └── [daily logs]
│
├── KNOWLEDGE_BASE.md                  # Original knowledge base
├── SUBSCRIPTION_AND_CREDITS_KNOWLEDGE_BASE.md
├── CAREERPILOT_AI_TECHNICAL_KNOWLEDGE_BASE.md  # This file
├── BUG_TRACKING.md
├── STRIPE_INTEGRATION_GUIDE.md
├── careerpilot_ecosystem_integration.md
├── careerpilot_pricing_strategy.md
│
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── tailwind.config.js                # Tailwind CSS config
├── next.config.js                    # Next.js config
└── .env.local                        # Environment variables (local)
```

### 3.3. Request Flow

#### Job Search Flow
```
User → Dashboard → Click "Find Jobs"
  ↓
  Send POST to /api/search-jobs with userId
  ↓
  API fetches user profile from Firestore
  ↓
  API calls JSearch API (RapidAPI) with targetRole + location
  ↓
  API calculates fit scores by matching user skills
  ↓
  Return top 10 jobs sorted by fit score
  ↓
  Display in JobMatchList component
```

#### Smart Apply Flow
```
User → Click "Smart Apply" on job
  ↓
  Open job application link in new tab
  ↓
  POST to /api/submit-application (track in Firestore)
  ↓
  POST to /api/generate-cover-letter with job details
  ↓
  OpenAI GPT-3.5 generates tailored cover letter
  ↓
  Display cover letter in modal
  ↓
  User can copy or save
```

#### Interview Coach Flow
```
User → Dashboard → Interview Coach → Select type
  ↓
  User sends message
  ↓
  POST to /api/interview-coach with messages array
  ↓
  API adds system prompt based on interview type
  ↓
  OpenAI GPT-3.5 generates coach response
  ↓
  Display in chat interface
  ↓
  Context maintained in conversation history
```

---

## 4. Technical Stack

### 4.1. Frontend

**Framework:**
- **Next.js 14.2.3** (App Router architecture)
- **React 18.3.1** (UI library)
- **TypeScript 5.4.5** (Type safety)

**Styling:**
- **Tailwind CSS 3.4.3** (Utility-first CSS)
- **Framer Motion 12.33.0** (Animations)
- **Lucide React 0.378.0** (Icons)
- **React Icons 5.5.0** (Additional icons)

**PDF Generation:**
- **jsPDF 4.1.0** (Client-side PDF creation)
- **jsPDF-AutoTable 5.0.7** (Table support)
- **pdfjs-dist 5.4.530** (PDF parsing)
- **pdf-parse 2.4.5** (Server-side PDF parsing)

### 4.2. Backend

**Runtime:**
- **Node.js 20.12.11** (Server runtime)
- **Next.js API Routes** (Serverless functions)

**Database & Authentication:**
- **Firebase 10.11.1** (Client SDK)
- **Firebase Admin 12.1.0** (Server SDK)
- **Firebase Auth** (Email/password authentication)
- **Firestore** (NoSQL database)
- **Firebase Storage 0.14.0** (File storage)

**AI & External APIs:**
- **OpenAI 4.104.0** (GPT-3.5-turbo for AI features)
- **JSearch API** (RapidAPI - job search data)

**Payments (Pending):**
- **Stripe 15.7.0** (Server SDK)
- **@stripe/stripe-js 3.5.0** (Client SDK)

**Other Libraries:**
- **Zod 3.23.8** (Schema validation)
- **Nodemailer 7.0.12** (Email sending)
- **React Firebase Hooks 5.1.1** (Firebase hooks)

### 4.3. Development Tools

**Build Tools:**
- **ESLint 8.57.0** (Linting)
- **PostCSS 8.4.38** (CSS processing)
- **TypeScript Compiler** (Type checking)

**Deployment:**
- **Vercel** (Hosting & CI/CD)
- **Git/GitHub** (Version control)

### 4.4. Version Requirements

```json
{
  "node": ">=20.12.0",
  "npm": ">=9.0.0",
  "next": "14.2.3",
  "react": "18.3.1",
  "typescript": "5.4.5"
}
```

---

## 5. Data Architecture

### 5.1. Firestore Collections

#### Collection: `users`

**Path:** `users/{userId}`

**Schema:**
```typescript
{
  userId: string;              // Firebase Auth UID
  email: string;               // User email
  targetRole: string;          // Desired job title (e.g., "Senior Software Engineer")
  location: string;            // Preferred location (e.g., "San Francisco, CA")
  country: string;             // ISO country code (e.g., "US", "GB")
  experienceYears: number;     // Years of experience
  skills: string[];            // Array of skill keywords
  createdAt: Timestamp;        // Account creation date
  updatedAt: Timestamp;        // Last profile update
  
  // Credit system (to be implemented with Stripe)
  subscriptionTier?: 'free' | 'starter' | 'pro';
  credits?: number;            // Current credit balance
  creditsResetDate?: Timestamp; // Next monthly reset
  topupCredits?: number;       // Never-expire top-up credits
  stripeCustomerId?: string;   // Stripe customer ID
  stripeSubscriptionId?: string; // Active subscription ID
}
```

**Indexes:**
- `userId` (primary key)
- `email` (for lookup)
- `stripeCustomerId` (for payment webhooks)

**Example:**
```json
{
  "userId": "abc123xyz",
  "email": "john@example.com",
  "targetRole": "Product Manager",
  "location": "London, UK",
  "country": "GB",
  "experienceYears": 8,
  "skills": ["Product Strategy", "Agile", "User Research", "Analytics"],
  "createdAt": "2026-03-01T10:00:00Z",
  "updatedAt": "2026-03-12T15:30:00Z"
}
```

#### Collection: `resumes`

**Path:** `resumes/{userId}`

**Schema:**
```typescript
{
  userId: string;              // Reference to user
  
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  
  summary: string;             // Professional summary (250-500 chars)
  
  experience: Array<{
    company: string;
    position: string;
    startDate: string;         // YYYY-MM format
    endDate: string | 'Present';
    description: string;       // Responsibilities and achievements
  }>;
  
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;    // YYYY-MM format
  }>;
  
  skills: string[];            // Same as user.skills or custom list
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Example:**
```json
{
  "userId": "abc123xyz",
  "personalInfo": {
    "fullName": "John Smith",
    "email": "john@example.com",
    "phone": "+44 20 1234 5678",
    "location": "London, UK",
    "linkedIn": "linkedin.com/in/johnsmith"
  },
  "summary": "Results-driven Product Manager with 8 years of experience...",
  "experience": [
    {
      "company": "TechCorp",
      "position": "Senior Product Manager",
      "startDate": "2020-06",
      "endDate": "Present",
      "description": "Led product strategy for B2B SaaS platform..."
    }
  ],
  "education": [
    {
      "school": "University of London",
      "degree": "MBA",
      "fieldOfStudy": "Business Administration",
      "graduationDate": "2018-06"
    }
  ],
  "skills": ["Product Strategy", "Agile", "User Research"],
  "updatedAt": "2026-03-12T16:00:00Z"
}
```

#### Collection: `applications`

**Path:** `applications/{applicationId}`

**Schema:**
```typescript
{
  applicationId: string;       // Auto-generated ID
  userId: string;              // Reference to user
  
  // Job details
  jobId: string;               // External job ID (from JSearch)
  jobTitle: string;
  company: string;
  location: string;
  applyLink: string;           // URL to job posting
  jobDescription?: string;     // Full job description
  
  // Application materials
  coverLetter?: string;        // Generated cover letter
  resumeVersion?: string;      // Reference to resume used
  
  // Status tracking
  status: 'applied' | 'in_review' | 'interview' | 'offer' | 'rejected';
  
  // Timestamps
  appliedAt: Timestamp;
  lastStatusUpdate: Timestamp;
  updatedAt: Timestamp;
  
  // Optional notes
  notes?: string;
  interviewDate?: Timestamp;
}
```

**Indexes:**
- `userId` (for querying user's applications)
- `status` (for filtering)
- `appliedAt` (for sorting)

**Example:**
```json
{
  "applicationId": "app_789xyz",
  "userId": "abc123xyz",
  "jobId": "job_456def",
  "jobTitle": "Senior Product Manager",
  "company": "StartupCo",
  "location": "London, UK",
  "applyLink": "https://jobs.example.com/apply/456",
  "coverLetter": "Dear Hiring Manager, I am excited to apply...",
  "status": "applied",
  "appliedAt": "2026-03-12T14:00:00Z",
  "lastStatusUpdate": "2026-03-12T14:00:00Z"
}
```

#### Collection: `interview_sessions` (Future)

**Path:** `interview_sessions/{sessionId}`

**Planned Schema:**
```typescript
{
  sessionId: string;
  userId: string;
  interviewType: 'general' | 'behavioral' | 'technical';
  targetRole: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Timestamp;
  }>;
  creditsUsed: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 5.2. Firebase Storage Structure

**Path:** `users/{userId}/resumes/{resumeId}.pdf`

Used for storing uploaded resumes or exported PDF versions.

### 5.3. Data Flow Diagrams

#### User Registration Flow
```
1. User signs up with email/password
   ↓
2. Firebase Auth creates user account
   ↓
3. Trigger: Create user document in Firestore
   ↓
4. Initialize with default values:
   - subscriptionTier: 'free'
   - credits: 40 (free tier)
   - skills: []
   ↓
5. Redirect to /profile/setup
```

#### Credit Deduction Flow (Future)
```
1. User initiates action (e.g., job search)
   ↓
2. Check user.credits >= CREDIT_COSTS.jobSearch
   ↓
3. If insufficient: Return error "Insufficient credits"
   ↓
4. If sufficient: Deduct credits atomically
   ↓
5. Update user.credits in Firestore
   ↓
6. Proceed with action
   ↓
7. Return result
```

---

## 6. Core Features

### 6.1. Authentication & Profile Management

#### 6.1.1. Implementation

**Technology:** Firebase Authentication (Email/Password)

**Key Files:**
- `lib/firebase.ts` - Client-side Firebase initialization
- `lib/firebase-admin.ts` - Server-side Firebase Admin
- `lib/auth-hooks.ts` - Custom auth hooks
- `app/login/page.tsx` - Login UI
- `app/signup/page.tsx` - Registration UI
- `app/profile/setup/page.tsx` - Initial profile setup
- `app/profile/edit/page.tsx` - Profile editing
- `app/profile/update-skills/page.tsx` - Skills management

#### 6.1.2. User Flows

**Sign Up:**
```typescript
// app/signup/page.tsx
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const handleSignup = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Initialize user profile in Firestore
  await setDoc(doc(firestore, 'users', user.uid), {
    userId: user.uid,
    email: user.email,
    createdAt: new Date().toISOString(),
    subscriptionTier: 'free',
    credits: 40,
  });
  
  router.push('/profile/setup');
};
```

**Sign In:**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
  router.push('/dashboard');
};
```

**Profile Setup:**
- Collects: targetRole, location, country, experienceYears, skills
- Validates: All required fields filled
- Geographic limitation modal for non-English countries
- Saves to Firestore `users/{userId}`

**Skills Management:**
- Comma-separated skill input
- Real-time skill parsing
- Validation: Each skill 1-3 words
- Updates user.skills array

#### 6.1.3. Geographic Limitation Handling

**Implementation:** 3-layer disclosure system

1. **Dropdown Labels:** "(Limited Support)" for non-English countries
2. **Warning Banner:** Yellow alert when non-English country selected
3. **Confirmation Modal:** Blocking modal requiring explicit acknowledgment

**Modal Code:**
```typescript
// app/profile/setup/page.tsx
const [showGeographicModal, setShowGeographicModal] = useState(false);
const [pendingCountry, setPendingCountry] = useState<string | null>(null);

const handleCountryChange = (country: string) => {
  const isNonEnglish = NON_ENGLISH_COUNTRIES.includes(country);
  
  if (isNonEnglish) {
    setPendingCountry(country);
    setShowGeographicModal(true);
  } else {
    setFormData({ ...formData, country });
  }
};

const handleConfirmProceed = () => {
  setFormData({ ...formData, country: pendingCountry! });
  setShowGeographicModal(false);
  setPendingCountry(null);
};
```

**Modal UI:**
```tsx
{showGeographicModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="warning-icon">⚠️</div>
      <h3>Limited Support for {countryName}</h3>
      <p>We currently have limited job availability in {countryName}:</p>
      <ul>
        <li>❌ Zero jobs available in local language</li>
        <li>🌐 All content is in English only</li>
        <li>💼 You can only search for English-speaking roles</li>
      </ul>
      <div className="modal-actions">
        <button onClick={() => setShowGeographicModal(false)}>
          ← Change Country
        </button>
        <button onClick={handleConfirmProceed}>
          I Understand, Continue Anyway
        </button>
      </div>
    </div>
  </div>
)}
```

### 6.2. Job Search & Matching

#### 6.2.1. API Endpoint

**Route:** `POST /api/search-jobs`

**Request:**
```typescript
{
  userId: string;
}
```

**Response:**
```typescript
{
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    applyLink: string;
    salary: string;
    fitScore: number;           // 0-100%
    matchingSkills: string[];
    posted: string;             // Formatted date
  }>;
}
```

#### 6.2.2. Implementation

**File:** `app/api/search-jobs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    // 1. Fetch user profile
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userData = userDoc.data();
    const { targetRole, location, skills } = userData;
    
    // 2. Call JSearch API
    const response = await fetch('https://jsearch.p.rapidapi.com/search', {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY!,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: targetRole,
        location: location,
        num_pages: 1,
      }),
    });
    
    const data = await response.json();
    const jobs = data.data || [];
    
    // 3. Calculate fit scores
    const jobsWithScores = jobs.map((job: any) => {
      const matchingSkills = calculateMatchingSkills(skills, job);
      const fitScore = (matchingSkills.length / skills.length) * 100;
      
      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city + ', ' + job.job_country,
        description: job.job_description,
        applyLink: job.job_apply_link,
        salary: job.job_salary || 'Not specified',
        fitScore: Math.round(fitScore),
        matchingSkills,
        posted: formatDate(job.job_posted_at_datetime_utc),
      };
    });
    
    // 4. Sort by fit score and return top 10
    const topJobs = jobsWithScores
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 10);
    
    return NextResponse.json({ jobs: topJobs });
    
  } catch (error: any) {
    console.error('❌ Job search error:', error);
    return NextResponse.json({ 
      error: 'Failed to search jobs',
      details: error.message 
    }, { status: 500 });
  }
}

// Helper: Calculate matching skills
function calculateMatchingSkills(userSkills: string[], job: any): string[] {
  const jobText = (job.job_title + ' ' + job.job_description).toLowerCase();
  
  return userSkills.filter(skill => 
    jobText.includes(skill.toLowerCase())
  );
}

// Helper: Format date
function formatDate(dateString: string): string {
  if (!dateString) return 'Recently';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}
```

#### 6.2.3. Fit Score Algorithm

**Formula:**
```
fitScore = (matchingSkills.length / totalUserSkills.length) * 100
```

**Example:**
- User skills: `['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']` (5 skills)
- Job description mentions: `React, TypeScript, AWS`
- Matching skills: 3
- Fit score: `(3 / 5) * 100 = 60%`

**Enhancements (Future):**
- Weight matching by skill importance
- Factor in experience level
- Consider location proximity
- Account for salary expectations

#### 6.2.4. UI Component

**File:** `app/components/JobMatchList.tsx`

```tsx
'use client';

import { useState } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  fitScore: number;
  matchingSkills: string[];
  applyLink: string;
  salary: string;
  posted: string;
}

export default function JobMatchList({ userId }: { userId: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  
  const searchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="job-match-list">
      <button onClick={searchJobs} disabled={loading}>
        {loading ? 'Searching...' : 'Find Jobs'}
      </button>
      
      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <div className="fit-score" style={{ 
              background: job.fitScore >= 70 ? 'green' : 
                         job.fitScore >= 50 ? 'orange' : 'red' 
            }}>
              {job.fitScore}% Fit
            </div>
            
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
            <p className="location">{job.location}</p>
            <p className="salary">{job.salary}</p>
            <p className="posted">{job.posted}</p>
            
            <div className="matching-skills">
              {job.matchingSkills.map(skill => (
                <span key={skill} className="skill-badge">{skill}</span>
              ))}
            </div>
            
            <button onClick={() => handleSmartApply(job)}>
              Smart Apply →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6.3. Smart Apply & Cover Letter Generation

#### 6.3.1. API Endpoint

**Route:** `POST /api/generate-cover-letter`

**Request:**
```typescript
{
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
}
```

**Response:**
```typescript
{
  coverLetter: string;
}
```

#### 6.3.2. Implementation

**File:** `app/api/generate-cover-letter/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, jobDescription, resumeText } = await request.json();
    
    // Validate inputs
    if (!jobTitle || !company || !jobDescription || !resumeText) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json({ 
        error: 'AI service not configured' 
      }, { status: 500 });
    }
    
    // Construct prompt
    const prompt = `Write a concise, professional cover letter for a candidate applying to ${jobTitle} at ${company}.

Candidate Resume/Profile:
${resumeText}

Job Description:
${jobDescription}

Requirements:
- Keep under 250 words
- Professional but personable tone
- Highlight relevant skills and experience
- Express genuine interest in the role
- Include a strong opening and closing
- Do NOT include placeholder text like [Your Name] or [Date]

Cover Letter:`;
    
    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert career coach who writes compelling cover letters.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });
    
    const data = await response.json();
    const coverLetter = data.choices?.[0]?.message?.content;
    
    if (!coverLetter) {
      throw new Error('No cover letter generated');
    }
    
    return NextResponse.json({ coverLetter });
    
  } catch (error: any) {
    console.error('❌ Cover letter generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate cover letter',
      details: error.message 
    }, { status: 500 });
  }
}
```

#### 6.3.3. Application Tracking

**Route:** `POST /api/submit-application`

```typescript
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { userId, jobId, jobTitle, company, location, applyLink, coverLetter } = 
      await request.json();
    
    // Create application document
    const applicationRef = db.collection('applications').doc();
    await applicationRef.set({
      applicationId: applicationRef.id,
      userId,
      jobId,
      jobTitle,
      company,
      location,
      applyLink,
      coverLetter,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      lastStatusUpdate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      success: true,
      applicationId: applicationRef.id 
    });
    
  } catch (error: any) {
    console.error('❌ Application tracking error:', error);
    return NextResponse.json({ 
      error: 'Failed to track application' 
    }, { status: 500 });
  }
}
```

#### 6.3.4. Smart Apply UI Flow

```tsx
const handleSmartApply = async (job: Job) => {
  // 1. Open job link in new tab
  window.open(job.applyLink, '_blank');
  
  // 2. Track application
  await fetch('/api/submit-application', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      applyLink: job.applyLink,
    }),
  });
  
  // 3. Generate cover letter
  const resumeText = await fetchUserResume(userId);
  
  const res = await fetch('/api/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description,
      resumeText,
    }),
  });
  
  const { coverLetter } = await res.json();
  
  // 4. Show cover letter modal
  setCoverLetterModal({
    visible: true,
    content: coverLetter,
    job,
  });
};
```

### 6.4. Resume Builder

#### 6.4.1. Overview

**Route:** `/dashboard/resume-builder`  
**File:** `app/dashboard/resume-builder/page.tsx`

**Features:**
- Multi-section resume creation
- Real-time preview
- Professional PDF export
- Auto-save to Firestore
- Responsive design

#### 6.4.2. Data Structure

```typescript
interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  
  summary: string;
  
  experience: Array<{
    id: string;                // Auto-generated
    company: string;
    position: string;
    startDate: string;         // YYYY-MM
    endDate: string;           // YYYY-MM or 'Present'
    isCurrent: boolean;
    description: string;
  }>;
  
  education: Array<{
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;    // YYYY-MM
  }>;
  
  skills: string[];
}
```

#### 6.4.3. UI Sections

**1. Personal Information**
```tsx
<section className="personal-info">
  <input 
    type="text" 
    placeholder="Full Name" 
    value={resume.personalInfo.fullName}
    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
  />
  <input type="email" placeholder="Email" />
  <input type="tel" placeholder="Phone" />
  <input type="text" placeholder="Location" />
  <input type="url" placeholder="LinkedIn URL (optional)" />
  <input type="url" placeholder="Portfolio URL (optional)" />
</section>
```

**2. Professional Summary**
```tsx
<section className="summary">
  <label>Professional Summary</label>
  <textarea 
    placeholder="Briefly describe your career background and goals..."
    value={resume.summary}
    onChange={(e) => updateSummary(e.target.value)}
    maxLength={500}
  />
  <span className="char-count">{resume.summary.length}/500</span>
</section>
```

**3. Work Experience**
```tsx
<section className="experience">
  <h3>Work Experience</h3>
  
  {resume.experience.map((exp, index) => (
    <div key={exp.id} className="experience-item">
      <input 
        type="text" 
        placeholder="Company" 
        value={exp.company}
        onChange={(e) => updateExperience(index, 'company', e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Position" 
        value={exp.position}
      />
      <input 
        type="month" 
        placeholder="Start Date" 
        value={exp.startDate}
      />
      <input 
        type="month" 
        placeholder="End Date" 
        value={exp.endDate}
        disabled={exp.isCurrent}
      />
      <label>
        <input 
          type="checkbox" 
          checked={exp.isCurrent}
          onChange={(e) => {
            if (e.target.checked) {
              updateExperience(index, 'endDate', 'Present');
            }
            updateExperience(index, 'isCurrent', e.target.checked);
          }}
        />
        I currently work here
      </label>
      <textarea 
        placeholder="Describe your responsibilities and achievements..."
        value={exp.description}
        onChange={(e) => updateExperience(index, 'description', e.target.value)}
      />
      <button onClick={() => removeExperience(index)}>Remove</button>
    </div>
  ))}
  
  <button onClick={addExperience}>+ Add Experience</button>
</section>
```

**4. Education**
```tsx
<section className="education">
  <h3>Education</h3>
  
  {resume.education.map((edu, index) => (
    <div key={edu.id} className="education-item">
      <input 
        type="text" 
        placeholder="School" 
        value={edu.school}
        onChange={(e) => updateEducation(index, 'school', e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Degree (e.g., Bachelor of Science)" 
        value={edu.degree}
      />
      <input 
        type="text" 
        placeholder="Field of Study" 
        value={edu.fieldOfStudy}
      />
      <input 
        type="month" 
        placeholder="Graduation Date" 
        value={edu.graduationDate}
      />
      <button onClick={() => removeEducation(index)}>Remove</button>
    </div>
  ))}
  
  <button onClick={addEducation}>+ Add Education</button>
</section>
```

**5. Skills**
```tsx
<section className="skills">
  <label>Skills</label>
  <input 
    type="text" 
    placeholder="Enter skills separated by commas (e.g., React, Node.js, AWS)"
    value={resume.skills.join(', ')}
    onChange={(e) => updateSkills(e.target.value.split(',').map(s => s.trim()))}
  />
</section>
```

#### 6.4.4. PDF Generation

**Library:** jsPDF + jsPDF-AutoTable

```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = () => {
  const doc = new jsPDF();
  
  let yPosition = 20;
  
  // Header - Name and Contact Info
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(resume.personalInfo.fullName, 105, yPosition, { align: 'center' });
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactInfo = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location
  ].filter(Boolean).join(' | ');
  doc.text(contactInfo, 105, yPosition, { align: 'center' });
  yPosition += 5;
  
  if (resume.personalInfo.linkedIn || resume.personalInfo.portfolio) {
    const links = [resume.personalInfo.linkedIn, resume.personalInfo.portfolio]
      .filter(Boolean).join(' | ');
    doc.text(links, 105, yPosition, { align: 'center' });
    yPosition += 10;
  } else {
    yPosition += 5;
  }
  
  // Professional Summary
  if (resume.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(resume.summary, 170);
    doc.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 5 + 8;
  }
  
  // Work Experience
  if (resume.experience.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK EXPERIENCE', 20, yPosition);
    yPosition += 7;
    
    resume.experience.forEach((exp) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`${exp.company} | ${exp.startDate} - ${exp.endDate}`, 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 5 + 6;
    });
  }
  
  // Education
  if (resume.education.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', 20, yPosition);
    yPosition += 7;
    
    resume.education.forEach((edu) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}, ${edu.fieldOfStudy}`, 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`${edu.school} | ${edu.graduationDate}`, 20, yPosition);
      yPosition += 8;
    });
  }
  
  // Skills
  if (resume.skills.length > 0) {
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', 20, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const skillsText = resume.skills.join(' • ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, yPosition);
  }
  
  // Save PDF
  doc.save(`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
};
```

#### 6.4.5. Firestore Save

```typescript
const saveResume = async () => {
  setSaving(true);
  try {
    await setDoc(doc(firestore, 'resumes', userId), {
      ...resume,
      updatedAt: new Date().toISOString(),
    });
    
    toast.success('Resume saved successfully!');
  } catch (error) {
    console.error('Save error:', error);
    toast.error('Failed to save resume');
  } finally {
    setSaving(false);
  }
};
```

### 6.5. AI Interview Coach

#### 6.5.1. Overview

**Route:** `/dashboard/interview-coach`  
**File:** `app/dashboard/interview-coach/page.tsx`  
**API:** `POST /api/interview-coach`

**Features:**
- 3 interview types: General, Behavioral, Technical
- Context-aware questioning
- Real-time conversation
- Constructive feedback
- Session history (future)

#### 6.5.2. Interview Types

**1. General Interview**
- Overview questions about career background
- "Tell me about yourself"
- "Why do you want to work here?"
- Career goals and motivations

**2. Behavioral Interview**
- STAR method (Situation, Task, Action, Result)
- "Tell me about a time when..."
- Leadership and teamwork scenarios
- Conflict resolution examples

**3. Technical Interview**
- Role-specific technical questions
- Problem-solving scenarios
- System design discussions
- Coding challenges (conceptual)

#### 6.5.3. API Implementation

**File:** `app/api/interview-coach/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, interviewType, targetRole, userProfile } = await request.json();
    
    // Validate inputs
    if (!messages || !interviewType || !targetRole) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json({ 
        error: 'AI service not configured' 
      }, { status: 500 });
    }
    
    // Construct system prompt based on interview type
    const systemPrompt = getSystemPrompt(interviewType, targetRole, userProfile);
    
    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response generated');
    }
    
    return NextResponse.json({ response: aiResponse });
    
  } catch (error: any) {
    console.error('❌ Interview coach error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response',
      details: error.message 
    }, { status: 500 });
  }
}

function getSystemPrompt(
  type: 'general' | 'behavioral' | 'technical', 
  role: string,
  profile?: string
): string {
  const basePrompt = `You are an expert interview coach conducting a ${type} interview for a ${role} position.

Your role:
- Ask relevant, thoughtful interview questions
- Provide constructive feedback on answers
- Be encouraging but honest
- Ask follow-up questions to dig deeper
- After 5-7 questions, offer to wrap up and provide overall feedback

`;

  const typeSpecificPrompts = {
    general: `Focus on:
- Career background and trajectory
- Motivation for applying
- Cultural fit and values
- Career goals and aspirations
- "Tell me about yourself" type questions

Keep questions conversational and professional.`,
    
    behavioral: `Focus on STAR method (Situation, Task, Action, Result):
- "Tell me about a time when..." scenarios
- Leadership and teamwork examples
- Conflict resolution situations
- Problem-solving challenges
- Adaptability and growth examples

Encourage detailed, specific examples.`,
    
    technical: `Focus on role-specific technical knowledge:
- Technical concepts and fundamentals
- System design and architecture
- Problem-solving approach
- Best practices and methodologies
- Real-world scenario discussions

Ask questions appropriate for a ${role} role.`,
  };

  let fullPrompt = basePrompt + typeSpecificPrompts[type];
  
  if (profile) {
    fullPrompt += `\n\nCandidate Profile:\n${profile}\n\nUse this context to ask relevant questions.`;
  }
  
  return fullPrompt;
}
```

#### 6.5.4. UI Implementation

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function InterviewCoach() {
  const { user } = useAuth();
  const [interviewType, setInterviewType] = useState<'general' | 'behavioral' | 'technical'>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  
  // Fetch user's target role
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/debug-profile?userId=${user?.uid}`);
      const data = await res.json();
      setTargetRole(data.targetRole || 'your target role');
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  // Start interview
  const startInterview = async () => {
    setMessages([{
      role: 'assistant',
      content: `Hello! I'm your AI interview coach. Let's practice a ${interviewType} interview for a ${targetRole} position. Are you ready to begin?`
    }]);
  };
  
  // Send message
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userInput }
    ];
    
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/interview-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          interviewType,
          targetRole,
        }),
      });
      
      const data = await res.json();
      
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.response }
      ]);
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="interview-coach">
      <h1>AI Interview Coach</h1>
      
      {messages.length === 0 ? (
        <div className="interview-setup">
          <h2>Choose Interview Type</h2>
          
          <div className="interview-types">
            <button 
              className={interviewType === 'general' ? 'active' : ''}
              onClick={() => setInterviewType('general')}
            >
              <h3>General Interview</h3>
              <p>Career background, motivations, cultural fit</p>
            </button>
            
            <button 
              className={interviewType === 'behavioral' ? 'active' : ''}
              onClick={() => setInterviewType('behavioral')}
            >
              <h3>Behavioral Interview</h3>
              <p>STAR method, real-world scenarios, soft skills</p>
            </button>
            
            <button 
              className={interviewType === 'technical' ? 'active' : ''}
              onClick={() => setInterviewType('technical')}
            >
              <h3>Technical Interview</h3>
              <p>Role-specific knowledge, problem-solving</p>
            </button>
          </div>
          
          <button className="start-button" onClick={startInterview}>
            Start Interview →
          </button>
        </div>
      ) : (
        <div className="interview-session">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="avatar">
                  {msg.role === 'assistant' ? '🎯' : '👤'}
                </div>
                <div className="content">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message assistant loading">
                <div className="avatar">🎯</div>
                <div className="content">Thinking...</div>
              </div>
            )}
          </div>
          
          <div className="input-area">
            <textarea 
              placeholder="Type your answer..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !userInput.trim()}>
              Send
            </button>
          </div>
          
          <button onClick={() => setMessages([])} className="restart-button">
            Restart Interview
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 7. Credit System & Pricing

### 7.1. Credit System Overview

**Philosophy:** Credit-based consumption model for AI-powered features

**Credit Costs:**
```typescript
{
  jobSearch: 8 credits,        // Search + 10 matched jobs with fit scores
  coverLetter: 15 credits,     // AI-generated cover letter
  interviewSession: 25 credits, // Full interview coaching session
  resumeBuilder: 0 credits,    // Always free, unlimited
}
```

### 7.2. Subscription Tiers

#### Free Tier
- **Price:** $0/month
- **Credits:** 40 per month
- **Reset Policy:** Monthly reset (no rollover)
- **Use Cases:** 
  - ~5 job searches
  - ~2 cover letters
  - ~1 interview practice
- **Purpose:** Customer acquisition, "try before you buy"

#### Starter Tier
- **Price:** $39/month
- **Credits:** 500 per month
- **Reset Policy:** Monthly reset (no rollover)
- **Use Cases:**
  - ~62 job searches
  - ~33 cover letters
  - ~20 interview practices
- **Target:** Active job seekers with moderate volume

#### Pro Tier
- **Price:** $99/month
- **Credits:** 1,200 per month
- **Reset Policy:** Monthly reset (no rollover)
- **Badge:** "MOST POPULAR"
- **Use Cases:**
  - ~150 job searches
  - ~80 cover letters
  - ~48 interview practices
- **Extras:**
  - Priority support
  - Early access to features
  - Advanced analytics
- **Target:** Power users, intensive job seekers

### 7.3. Credit Top-Ups

**Small Pack**
- **Price:** $15
- **Credits:** 200
- **Per-Credit Cost:** $0.075
- **Expiration:** Never expires
- **Best For:** Quick top-up when running low

**Medium Pack**
- **Price:** $40
- **Credits:** 600
- **Per-Credit Cost:** $0.067
- **Savings:** 11% better than Small
- **Expiration:** Never expires
- **Best For:** Extra credits for heavy search month

**Large Pack**
- **Price:** $90
- **Credits:** 1,500
- **Per-Credit Cost:** $0.06
- **Savings:** 20% better than Small
- **Badge:** "BEST VALUE"
- **Expiration:** Never expires
- **Best For:** Maximum value, stockpile credits

### 7.4. Credit Reset Policy

**Subscription Credits:**
- ⚠️ Reset monthly on billing cycle
- ❌ Do NOT roll over to next month
- Unused credits are forfeited

**Top-Up Credits:**
- ✅ Never expire
- Remain in account forever
- Used after subscription credits depleted

**Example:**
```
User has Pro subscription (1,200 credits/month)
User purchases Large Pack (+1,500 credits)

Month 1:
- Subscription credits: 1,200
- Top-up credits: 1,500
- Total available: 2,700

User uses 1,400 credits:
- Subscription credits: 0 (1,200 used)
- Top-up credits: 1,300 (200 used)

Month 2 (billing cycle resets):
- Subscription credits: 1,200 (refreshed)
- Top-up credits: 1,300 (carried over)
- Total available: 2,500
```

### 7.5. Cost Analysis (Internal)

**Estimated API Costs:**
```typescript
{
  jobSearch: $0.03,          // JSearch API call
  coverLetter: $0.025,       // OpenAI ~500 tokens
  interviewSession: $0.045,  // OpenAI ~1000 tokens
  perCredit: $0.04,          // Average blended cost
}
```

**Margin Analysis (100% utilization):**

Free Tier:
- Revenue: $0
- Cost: 40 × $0.04 = $1.60
- Margin: -$1.60 (customer acquisition cost)

Starter Tier:
- Revenue: $39
- Cost: 500 × $0.04 = $20
- Margin: $19 (48.7%)
- Note: Assumes user uses all 500 credits

Pro Tier:
- Revenue: $99
- Cost: 1,200 × $0.04 = $48
- Margin: $51 (51.5%)
- Note: Assumes user uses all 1,200 credits

**Reality Check:**
- Most users won't use 100% of credits
- Actual margins will be higher (60-70% estimated)
- Power users hitting 100% are acceptable at these margins
- Conservative credit allocation protects profitability

### 7.6. Implementation (lib/credits.ts)

**File:** `lib/credits.ts`

```typescript
export const CREDIT_COSTS = {
  jobSearch: 8,
  coverLetter: 15,
  interviewSession: 25,
  resumeBuilder: 0,
} as const;

export const SUBSCRIPTION_TIERS = {
  free: { id: 'free', name: 'Free', price: 0, credits: 40, ... },
  starter: { id: 'starter', name: 'Starter', price: 39, credits: 500, ... },
  pro: { id: 'pro', name: 'Pro', price: 99, credits: 1200, ... },
} as const;

export const CREDIT_TOPUPS = {
  small: { id: 'small', price: 15, credits: 200, ... },
  medium: { id: 'medium', price: 40, credits: 600, ... },
  large: { id: 'large', price: 90, credits: 1500, ... },
} as const;

// Utility functions
export function getCapacity(credits: number, action: CreditAction): number {
  return Math.floor(credits / CREDIT_COSTS[action]);
}

export function hasSufficientCredits(
  userCredits: number, 
  action: CreditAction, 
  quantity: number = 1
): boolean {
  return userCredits >= CREDIT_COSTS[action] * quantity;
}
```

### 7.7. Stripe Integration (Pending)

**Products to Create:**
1. CareerPilot AI - Starter ($39/month recurring)
2. CareerPilot AI - Pro ($99/month recurring)
3. Credit Top-Up - Small ($15 one-time)
4. Credit Top-Up - Medium ($40 one-time)
5. Credit Top-Up - Large ($90 one-time)

**Webhooks to Handle:**
- `checkout.session.completed` - New subscription or top-up
- `customer.subscription.updated` - Plan change
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Monthly renewal
- `invoice.payment_failed` - Payment failure

**See:** `STRIPE_INTEGRATION_GUIDE.md` for detailed implementation

---

## 8. Authentication & Security

### 8.1. Authentication Implementation

**Provider:** Firebase Authentication  
**Method:** Email/Password

**Files:**
- `lib/firebase.ts` - Client SDK initialization
- `lib/firebase-admin.ts` - Server SDK initialization
- `lib/auth-hooks.ts` - React hooks for auth state

#### 8.1.1. Client-Side Auth

**File:** `lib/firebase.ts`

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (client-side)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
```

**File:** `lib/auth-hooks.ts`

```typescript
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { user, loading };
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  return { user, loading };
}
```

#### 8.1.2. Server-Side Auth

**File:** `lib/firebase-admin.ts`

```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const db = getFirestore();
export const adminAuth = getAuth();
```

**Usage in API Routes:**
```typescript
import { db, adminAuth } from '@/lib/firebase-admin';

// Verify user token
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    // Proceed with authenticated request
    // ...
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

### 8.2. Security Best Practices

#### 8.2.1. Environment Variables

**Required Variables:**
```bash
# Firebase Client (Public - Next.js automatically prefixes with NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-only - NEVER expose to client)
FIREBASE_PRIVATE_KEY=          # Full key with newlines
FIREBASE_CLIENT_EMAIL=

# External APIs (Server-only)
JSEARCH_API_KEY=               # RapidAPI key
OPENAI_API_KEY=                # OpenAI API key

# Stripe (Pending)
STRIPE_SECRET_KEY=             # Server-only
STRIPE_WEBHOOK_SECRET=         # Server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Client-safe
```

**Security Rules:**
- ✅ Use `NEXT_PUBLIC_` prefix ONLY for client-safe variables
- ❌ NEVER expose API keys, private keys, or secrets to client
- ✅ Store sensitive keys in Vercel environment variables
- ✅ Use different keys for development/production

#### 8.2.2. Firestore Security Rules

**Current Status:** Default rules (development)

**Recommended Production Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // User can only read/write their own document
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Resumes collection
    match /resumes/{userId} {
      // User can only read/write their own resume
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      // User can only read/write their own applications
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // Interview sessions collection (future)
    match /interview_sessions/{sessionId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

#### 8.2.3. API Route Security

**Pattern: Validate user ownership**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    // Option 1: Trust userId from request (current implementation)
    // ⚠️ Low security: Client can spoof userId
    
    // Option 2: Verify auth token (recommended for production)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    const decodedToken = await adminAuth.verifyIdToken(token);
    const authenticatedUserId = decodedToken.uid;
    
    // Ensure userId matches authenticated user
    if (userId !== authenticatedUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Proceed with request...
    
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

#### 8.2.4. Input Validation

**Use Zod for schema validation:**
```typescript
import { z } from 'zod';

const JobSearchSchema = z.object({
  userId: z.string().min(1),
});

const CoverLetterSchema = z.object({
  jobTitle: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  jobDescription: z.string().min(10).max(10000),
  resumeText: z.string().min(10).max(10000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validated = CoverLetterSchema.parse(body);
    
    // Proceed with validated data
    // ...
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.errors 
      }, { status: 400 });
    }
    
    throw error;
  }
}
```

#### 8.2.5. Rate Limiting (Future)

**Recommended:** Implement rate limiting for API routes

**Options:**
1. **Vercel Edge Middleware** - Rate limit at edge
2. **Upstash Redis** - Distributed rate limiting
3. **Firebase Functions** - Built-in quotas

**Example with Upstash:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  const { success } = await ratelimit.limit(userId);
  
  if (!success) {
    return NextResponse.json({ 
      error: 'Rate limit exceeded' 
    }, { status: 429 });
  }
  
  // Proceed with request...
}
```

### 8.3. Data Privacy

**GDPR Compliance:**
- User data stored in Firebase (EU region available)
- User can delete account and all data
- Clear privacy policy (to be created)
- Cookie consent (to be implemented)

**Data Retention:**
- Active users: Indefinite storage
- Deleted accounts: 30-day grace period, then permanent deletion
- Application data: Retained as long as account active

---

## 9. API Reference

### 9.1. Overview

All API routes are serverless functions deployed on Vercel. They follow Next.js 14 App Router conventions.

**Base URL:** `https://career-pilot-ai-gamma.vercel.app/api`  
**Content-Type:** `application/json`  
**Authentication:** Currently userId-based (token-based recommended for production)

### 9.2. Endpoints

#### 9.2.1. POST /api/search-jobs

**Description:** Search for jobs based on user profile

**Request:**
```json
{
  "userId": "string"
}
```

**Response (Success - 200):**
```json
{
  "jobs": [
    {
      "id": "job_abc123",
      "title": "Senior Product Manager",
      "company": "TechCorp Inc.",
      "location": "San Francisco, CA",
      "description": "We are seeking a Senior Product Manager...",
      "applyLink": "https://jobs.techcorp.com/apply/123",
      "salary": "$150,000 - $200,000",
      "fitScore": 85,
      "matchingSkills": ["Product Strategy", "Agile", "Analytics"],
      "posted": "2 days ago"
    }
  ]
}
```

**Response (Error - 404):**
```json
{
  "error": "User not found"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to search jobs",
  "details": "JSearch API error: ..."
}
```

**Implementation Notes:**
- Fetches user profile from Firestore
- Calls JSearch API with targetRole + location
- Calculates fit scores based on skill matching
- Returns top 10 jobs sorted by fit score
- Handles date formatting and validation

#### 9.2.2. POST /api/generate-cover-letter

**Description:** Generate AI-powered cover letter for a job application

**Request:**
```json
{
  "jobTitle": "Senior Product Manager",
  "company": "TechCorp Inc.",
  "jobDescription": "We are seeking a Senior Product Manager with 5+ years experience...",
  "resumeText": "John Smith\nSenior Product Manager with 8 years experience..."
}
```

**Response (Success - 200):**
```json
{
  "coverLetter": "Dear Hiring Manager,\n\nI am excited to apply for the Senior Product Manager position at TechCorp Inc..."
}
```

**Response (Error - 400):**
```json
{
  "error": "Missing required fields"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to generate cover letter",
  "details": "OpenAI API error: ..."
}
```

**Implementation Notes:**
- Uses OpenAI GPT-3.5-turbo
- Temperature: 0.7 (balanced creativity/consistency)
- Max tokens: 400 (~250-300 words)
- Prompt engineering for professional tone
- Cost: ~$0.025 per generation

#### 9.2.3. POST /api/interview-coach

**Description:** AI interview coaching session

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I'm ready to start" },
    { "role": "assistant", "content": "Great! Tell me about yourself." },
    { "role": "user", "content": "I'm a product manager with 8 years experience..." }
  ],
  "interviewType": "behavioral",
  "targetRole": "Senior Product Manager",
  "userProfile": "8 years PM experience, led teams of 5-10..."
}
```

**Response (Success - 200):**
```json
{
  "response": "That's a strong background! Can you tell me about a time when you had to resolve a conflict within your team?"
}
```

**Response (Error - 400):**
```json
{
  "error": "Missing required fields"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to generate response",
  "details": "OpenAI API error: ..."
}
```

**Implementation Notes:**
- Maintains conversation context
- Dynamic system prompts per interview type
- Temperature: 0.7
- Max tokens: 300
- Cost: ~$0.045 per message

#### 9.2.4. POST /api/submit-application

**Description:** Track a job application

**Request:**
```json
{
  "userId": "abc123xyz",
  "jobId": "job_abc123",
  "jobTitle": "Senior Product Manager",
  "company": "TechCorp Inc.",
  "location": "San Francisco, CA",
  "applyLink": "https://jobs.techcorp.com/apply/123",
  "coverLetter": "Dear Hiring Manager...",
  "status": "applied"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "applicationId": "app_xyz789"
}
```

**Response (Error - 400):**
```json
{
  "error": "Missing required fields"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to track application",
  "details": "Firestore error: ..."
}
```

**Implementation Notes:**
- Creates document in `applications` collection
- Auto-generates applicationId
- Sets appliedAt timestamp
- Initializes status to 'applied'

#### 9.2.5. GET /api/debug-profile

**Description:** Debug endpoint to fetch user profile (development only)

**Request:**
```
GET /api/debug-profile?userId=abc123xyz
```

**Response (Success - 200):**
```json
{
  "userId": "abc123xyz",
  "email": "john@example.com",
  "targetRole": "Senior Product Manager",
  "location": "San Francisco, CA",
  "experienceYears": 8,
  "skills": ["Product Strategy", "Agile", "Analytics"]
}
```

**Response (Error - 404):**
```json
{
  "error": "User not found"
}
```

**Implementation Notes:**
- ⚠️ Should be disabled in production
- Useful for debugging profile issues
- No authentication required (development only)

### 9.3. Error Handling

**Standard Error Response:**
```json
{
  "error": "Human-readable error message",
  "details": "Technical details (optional)",
  "code": "ERROR_CODE (optional)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (unexpected errors)

### 9.4. Rate Limits (Future)

**Proposed Limits:**
- Free tier: 10 requests/minute per user
- Starter tier: 30 requests/minute per user
- Pro tier: 60 requests/minute per user

**Headers:**
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1678901234
```

---

## 10. Deployment & Infrastructure

### 10.1. Hosting Platform

**Provider:** Vercel  
**Framework:** Next.js 14 (App Router)  
**Node Version:** 20.x

**Features:**
- Automatic deployments on git push
- Preview deployments for PRs
- Edge network (global CDN)
- Serverless functions for API routes
- Environment variable management
- Analytics and monitoring

### 10.2. Deployment Configuration

**File:** `vercel.json` (optional)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key",
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables (public)
  env: {
    NEXT_PUBLIC_APP_VERSION: '0.9.5',
  },
  
  // Image optimization
  images: {
    domains: [],
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### 10.3. Environment Variables

**Vercel Dashboard Setup:**
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local.example`
3. Select environments: Production, Preview, Development
4. Redeploy after adding/changing variables

**Important Notes:**
- `FIREBASE_PRIVATE_KEY` must include actual newlines (not `\n` escaped)
- Separate keys for development/production recommended
- Use Vercel CLI for bulk import: `vercel env pull`

### 10.4. Build Process

**Build Command:** `npm run build`

**Build Steps:**
1. Install dependencies (`npm install`)
2. Run TypeScript compiler (`tsc --noEmit`)
3. Run ESLint (`next lint`)
4. Build Next.js app (`next build`)
5. Generate static pages
6. Bundle serverless functions

**Build Output:**
```
.next/
├── cache/                 # Build cache
├── server/                # Server-side code
│   ├── app/              # App Router pages
│   └── chunks/           # Code chunks
├── static/               # Static assets
└── standalone/           # Standalone deployment (optional)
```

**Build Time:** ~1-2 minutes (typical)

### 10.5. Deployment Pipeline

**Production Deployment:**
```bash
# Automatic on push to main branch
git push origin main

# Manual deployment via Vercel CLI
vercel --prod
```

**Preview Deployment:**
```bash
# Automatic for all PRs and branches
git push origin feature-branch

# Generates unique URL: careerpilot-ai-abc123.vercel.app
```

**Rollback:**
```bash
# Via Vercel Dashboard: Deployments → Select previous → Promote to Production

# Via CLI
vercel rollback <deployment-url>
```

### 10.6. Custom Domain (Future)

**Setup:**
1. Purchase domain (e.g., `careerpilot.ai`)
2. Add domain in Vercel Dashboard
3. Update DNS records:
   - `A` record: `76.76.21.21`
   - `CNAME` www: `cname.vercel-dns.com`
4. Enable HTTPS (automatic via Vercel)

**SSL Certificate:** Auto-provisioned by Vercel (Let's Encrypt)

### 10.7. Monitoring & Analytics

**Vercel Analytics:**
- Real User Monitoring (RUM)
- Web Vitals (LCP, FID, CLS)
- Page load times
- API response times

**Custom Monitoring (Future):**
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **PostHog** - Product analytics
- **Stripe Dashboard** - Payment metrics

### 10.8. Performance Optimization

**Current Optimizations:**
- Next.js automatic code splitting
- Image optimization (next/image)
- Font optimization (next/font)
- Static page generation where possible
- Edge caching for static assets

**Recommendations:**
- Implement service worker for offline support
- Add Redis caching for job search results
- Lazy load heavy components
- Optimize bundle size (analyze with `@next/bundle-analyzer`)

**Bundle Analysis:**
```bash
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### 10.9. Backup & Disaster Recovery

**Firestore Backups:**
- Automated daily backups (Firebase Blaze plan)
- 30-day retention
- Export to Cloud Storage

**Code Backups:**
- Git repository (GitHub)
- Vercel maintains deployment history
- Local development backups

**Recovery Procedures:**
1. **Code Rollback:** Use Vercel deployment history
2. **Database Restore:** Firebase Console → Backups → Restore
3. **Full Recovery:** Redeploy from GitHub + restore database

---

## 11. Ecosystem Integration

### 11.1. NOFA AI Factory Overview

**CareerPilot AI™** is part of the NOFA AI Factory ecosystem, which includes:

1. **CareerPilot AI™** - AI-powered job search platform (this product)
2. **TechSupport AI™** - Voice-first multilingual helpdesk
3. **CommandDesk AI™** - Email-based customer support automation
4. **AffiliateLedger AI™** - Referral tracking and commission management (planned)

### 11.2. Integration with TechSupport AI™

**Purpose:** Customer support and onboarding for CareerPilot AI™ users

#### A. Embedded Support Widget
```typescript
// Future implementation
<TechSupportWidget 
  productId="careerpilot_ai"
  userId={user.uid}
  context={{
    page: 'dashboard',
    userState: 'onboarding',
    targetRole: profile.targetRole,
  }}
/>
```

**Context-Aware Support:**
- Onboarding: "How do I set up my profile?"
- Job Search: "Why am I getting 0% fit scores?"
- Application: "How do I track my applications?"
- Interview Prep: "How does the interview coach work?"

#### B. Automated Onboarding Flow
```
User signs up → TechSupport AI triggers guided tour
  ↓
  Step 1: "Let's set up your profile"
  Step 2: "Upload or build your resume"
  Step 3: "Run your first job search"
  Step 4: "Try Smart Apply"
```

#### C. Error Handling Integration
```typescript
// When API limit reached
try {
  await searchJobs();
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Trigger TechSupport AI escalation
    await techSupport.escalate({
      type: 'rate_limit',
      userId: user.uid,
      message: 'User hit API rate limit during job search',
    });
  }
}
```

**Implementation Roadmap:**
1. **Phase 1:** Embed TechSupport AI™ chat widget in dashboard
2. **Phase 2:** Configure contextual triggers
3. **Phase 3:** Advanced workflows (AI-to-AI handoffs)

### 11.3. Integration with AffiliateLedger AI™

**Purpose:** Manage referral tracking and commission payouts

#### A. Referral Tracking
```typescript
// Track signup via affiliate link
export async function handleSignup(email: string, password: string, affiliateId?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // If affiliate referral, notify AffiliateLedger AI
  if (affiliateId) {
    await fetch('https://affiliateledger.ai/api/track-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'careerpilot_ai',
        affiliateId,
        userId: user.uid,
        email: user.email,
        timestamp: new Date().toISOString(),
      }),
    });
  }
  
  // Initialize user profile...
}
```

#### B. Conversion Tracking
```typescript
// Track subscription upgrade (conversion event)
export async function handleSubscriptionUpgrade(userId: string, tier: string, affiliateId?: string) {
  // Create Stripe subscription
  const subscription = await stripe.subscriptions.create({...});
  
  // Notify AffiliateLedger AI of conversion
  if (affiliateId) {
    await fetch('https://affiliateledger.ai/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'careerpilot_ai',
        affiliateId,
        userId,
        tier,
        revenue: SUBSCRIPTION_TIERS[tier].price,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}
```

#### C. Commission Structure

**Standard Affiliates:**
- 10% recurring commission for 12 months
- Example: User subscribes to Pro ($99/month)
  - Affiliate earns: $9.90/month × 12 = $118.80 total

**Strategic Partners:**
- Custom commission rates (negotiable)
- Lifetime commissions for key partnerships
- Example: Kennedi Calling partnership
  - 15% lifetime commission
  - Exclusive co-marketing opportunities

**Implementation Roadmap:**
1. **Phase 1:** Add AffiliateLedger tracking pixel to signup/payment pages
2. **Phase 2:** Webhook integration for real-time conversion events
3. **Phase 3:** Partner dashboard for affiliate performance

### 11.4. Cross-Product Workflows (Future)

**Example: TechSupport AI → CareerPilot AI Handoff**
```
User contacts TechSupport AI with career question
  ↓
  TechSupport AI recognizes career-related intent
  ↓
  TechSupport AI suggests CareerPilot AI with affiliate link
  ↓
  User clicks link with embedded affiliate tracking
  ↓
  AffiliateLedger AI credits TechSupport AI for referral
```

**Example: CareerPilot AI → CommandDesk AI Integration**
```
CareerPilot user applies to job via Smart Apply
  ↓
  Job application triggers email monitoring in CommandDesk AI
  ↓
  CommandDesk AI watches inbox for recruiter responses
  ↓
  CommandDesk AI auto-categorizes: Interview Request, Rejection, etc.
  ↓
  CareerPilot AI application status auto-updates
```

### 11.5. Shared Infrastructure

**Common Services:**
- **Firebase Project:** Shared Firestore/Auth (separate collections)
- **OpenAI API Key:** Shared quota, consolidated billing
- **Vercel Organization:** All products under one account
- **Stripe Account:** Unified payment processing

**Benefits:**
- Reduced operational costs
- Consolidated analytics
- Single customer support database
- Cross-product user insights

---

## 12. Performance & Optimization

### 12.1. Current Performance Metrics

**Build Performance:**
- Build time: ~60-90 seconds
- Bundle size: ~400KB (gzipped)
- First Load JS: ~150KB

**Runtime Performance:**
- Cold start (API routes): <3 seconds
- Hot path (API routes): <1 second
- Job search: 1-2 seconds average
- Cover letter generation: 2-4 seconds
- Resume PDF export: <1 second (client-side)

**Web Vitals (Target):**
- Largest Contentful Paint (LCP): <2.5s ✅
- First Input Delay (FID): <100ms ✅
- Cumulative Layout Shift (CLS): <0.1 ✅

### 12.2. Optimization Strategies

#### A. Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const InterviewCoach = dynamic(() => import('@/app/components/InterviewCoach'), {
  loading: () => <div>Loading interview coach...</div>,
  ssr: false, // Client-side only
});

const PDFExport = dynamic(() => import('@/lib/pdf-export'), {
  ssr: false, // jsPDF is client-side only
});
```

#### B. Image Optimization
```tsx
import Image from 'next/image';

// Automatic optimization, lazy loading, WebP conversion
<Image 
  src="/hero-image.png" 
  alt="CareerPilot AI Dashboard"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>
```

#### C. Font Optimization
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

#### D. API Response Caching (Future)
```typescript
// Cache job search results for 5 minutes
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  
  // Check cache
  const cacheKey = `jobs:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return NextResponse.json(cached);
  }
  
  // Fetch fresh data
  const jobs = await searchJobs(userId);
  
  // Cache for 5 minutes
  await redis.set(cacheKey, jobs, { ex: 300 });
  
  return NextResponse.json({ jobs });
}
```

#### E. Database Query Optimization
```typescript
// Use Firebase composite indexes for complex queries
const applicationsQuery = db.collection('applications')
  .where('userId', '==', userId)
  .where('status', '==', 'applied')
  .orderBy('appliedAt', 'desc')
  .limit(20);

// Create composite index in Firebase Console:
// Collection: applications
// Fields: userId (Ascending), status (Ascending), appliedAt (Descending)
```

### 12.3. Bundle Size Analysis

**Largest Dependencies:**
```
firebase (350KB)
jspdf (120KB)
openai (80KB)
react (70KB)
tailwindcss (minimal runtime)
```

**Optimization Opportunities:**
- Tree-shake unused Firebase modules
- Lazy load jsPDF (only on resume export)
- Consider lighter PDF library alternatives
- Use dynamic imports for heavy components

**Analysis Command:**
```bash
npm install --save-dev @next/bundle-analyzer
ANALYZE=true npm run build
```

### 12.4. API Cost Optimization

**Current Costs (per action):**
- Job Search: $0.03 (JSearch API)
- Cover Letter: $0.025 (OpenAI ~500 tokens)
- Interview Session: $0.045 (OpenAI ~1000 tokens)

**Optimization Strategies:**
1. **Prompt Engineering:** Reduce token usage
   - Remove verbose instructions
   - Use shorter system prompts
   - Request concise responses

2. **Model Selection:**
   - Use GPT-3.5-turbo for most features (current)
   - Reserve GPT-4 for premium users (future)
   - Consider fine-tuned models for specific tasks

3. **Caching:**
   - Cache common cover letter templates
   - Reuse interview coaching prompts
   - Cache job search results

4. **Rate Limiting:**
   - Prevent abuse and excessive API calls
   - Protect margins from power users
   - Enforce credit system strictly

### 12.5. Database Performance

**Firestore Best Practices:**
- ✅ Use shallow queries (avoid deep nesting)
- ✅ Implement pagination for long lists
- ✅ Create composite indexes for multi-field queries
- ✅ Use batch writes for multiple operations
- ❌ Avoid N+1 queries (fetch related data in single query)

**Example: Efficient Application Fetching**
```typescript
// BAD: Multiple reads
const applications = await getApplications(userId);
for (const app of applications) {
  const jobDetails = await getJob(app.jobId); // N+1 problem
}

// GOOD: Single query with all data
const applications = await db.collection('applications')
  .where('userId', '==', userId)
  .get();

const apps = applications.docs.map(doc => doc.data());
// Job details already embedded in application document
```

---

## 13. Development Workflow

### 13.1. Local Development Setup

**Prerequisites:**
- Node.js 20.x or higher
- npm 9.x or higher
- Git
- Code editor (VS Code recommended)

**Setup Steps:**
```bash
# 1. Clone repository
git clone https://github.com/NofaBC/CareerPilot-AI.git
cd CareerPilot-AI

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local

# 4. Add environment variables
# Edit .env.local with your Firebase, OpenAI, JSearch keys

# 5. Run development server
npm run dev

# 6. Open browser
# Navigate to http://localhost:3000
```

**Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com

JSEARCH_API_KEY=your_rapidapi_key
OPENAI_API_KEY=sk-...
```

### 13.2. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run linter
npm run lint

# Run type checking
npx tsc --noEmit

# Format code (if Prettier configured)
npm run format

# Clean build cache
rm -rf .next
npm run build
```

### 13.3. Git Workflow

**Branch Strategy:**
- `main` - Production branch (protected)
- `develop` - Development branch (staging)
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes

**Workflow:**
```bash
# 1. Create feature branch
git checkout -b feature/new-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: Add new feature

- Implemented X
- Updated Y
- Fixed Z

Co-Authored-By: Oz <oz-agent@warp.dev>"

# 3. Push to GitHub
git push origin feature/new-feature-name

# 4. Create Pull Request
# Via GitHub UI: base: main ← compare: feature/new-feature-name

# 5. Review and merge
# After approval, merge to main
```

**Commit Message Format:**
```
<type>: <subject>

<body>

Co-Authored-By: Oz <oz-agent@warp.dev>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Test additions or changes
- `chore` - Build process, tooling changes

### 13.4. Code Style Guidelines

**TypeScript:**
- Use TypeScript for all new code
- Define interfaces for data structures
- Avoid `any` type (use `unknown` if necessary)
- Use Zod for runtime validation

**React:**
- Use functional components with hooks
- Prefer `const` over `let`/`var`
- Use destructuring for props
- Keep components small and focused

**File Naming:**
- Components: `PascalCase.tsx` (e.g., `JobMatchList.tsx`)
- Utilities: `camelCase.ts` (e.g., `auth-hooks.ts`)
- API routes: `route.ts` (Next.js convention)

**Example Component:**
```typescript
'use client';

import { useState, useEffect } from 'react';

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Side effects here
  }, []);
  
  const handleApplyClick = () => {
    onApply(job.id);
  };
  
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <button onClick={handleApplyClick}>Apply</button>
    </div>
  );
}
```

### 13.5. Testing Strategy

**Current State:** No automated tests (to be implemented)

**Recommended Testing Stack:**
- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** Playwright or Cypress
- **API Tests:** Supertest or Postman
- **Type Checking:** TypeScript compiler

**Testing Checklist (Manual):**
- [ ] Authentication (sign up, sign in, sign out)
- [ ] Profile creation and editing
- [ ] Job search with real data
- [ ] Fit score calculation accuracy
- [ ] Smart Apply functionality
- [ ] Cover letter generation quality
- [ ] Resume builder (all sections)
- [ ] PDF export formatting
- [ ] Interview coach (all types)
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 13.6. Debugging Tools

**Browser DevTools:**
- Console: Check client-side errors
- Network: Inspect API requests/responses
- Application: View localStorage, IndexedDB, cookies

**Debug Page:**
- Route: `/debug`
- Shows: User profile, environment variables, Firebase status

**Vercel Logs:**
- Real-time function logs
- Error tracking
- Performance insights

**Firebase Console:**
- Firestore data viewer
- Authentication users
- Usage statistics

**Debug API Route:**
```bash
curl -X GET "https://career-pilot-ai-gamma.vercel.app/api/debug-profile?userId=abc123"
```

---

## 14. Testing & Quality Assurance

### 14.1. Testing Philosophy

**Goals:**
- Ensure features work as expected
- Prevent regressions
- Maintain code quality
- Improve developer confidence

**Testing Pyramid:**
```
        /\
       /  \   E2E Tests (5%)
      /____\  
     /      \  Integration Tests (15%)
    /________\ 
   /          \ Unit Tests (80%)
  /__________  \
```

### 14.2. Unit Testing (Future)

**Stack:** Jest + React Testing Library

**Setup:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Example Test:**
```typescript
// __tests__/components/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from '@/app/components/JobCard';

describe('JobCard', () => {
  const mockJob = {
    id: 'job_123',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    fitScore: 85,
    matchingSkills: ['Product Strategy', 'Agile'],
  };
  
  it('renders job title and company', () => {
    render(<JobCard job={mockJob} onApply={jest.fn()} />);
    
    expect(screen.getByText('Senior Product Manager')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
  });
  
  it('calls onApply when Apply button clicked', () => {
    const mockOnApply = jest.fn();
    render(<JobCard job={mockJob} onApply={mockOnApply} />);
    
    fireEvent.click(screen.getByText('Apply'));
    
    expect(mockOnApply).toHaveBeenCalledWith('job_123');
  });
  
  it('displays fit score with correct styling', () => {
    render(<JobCard job={mockJob} onApply={jest.fn()} />);
    
    const fitScore = screen.getByText('85% Fit');
    expect(fitScore).toHaveClass('fit-score-high');
  });
});
```

### 14.3. API Testing

**Stack:** Jest + Supertest (or manual with curl/Postman)

**Example Test:**
```typescript
// __tests__/api/search-jobs.test.ts
import { POST } from '@/app/api/search-jobs/route';
import { NextRequest } from 'next/server';

describe('/api/search-jobs', () => {
  it('returns jobs for valid user', async () => {
    const request = new NextRequest('http://localhost:3000/api/search-jobs', {
      method: 'POST',
      body: JSON.stringify({ userId: 'test_user_123' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.jobs).toBeInstanceOf(Array);
    expect(data.jobs.length).toBeGreaterThan(0);
  });
  
  it('returns 404 for non-existent user', async () => {
    const request = new NextRequest('http://localhost:3000/api/search-jobs', {
      method: 'POST',
      body: JSON.stringify({ userId: 'non_existent_user' }),
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(404);
  });
});
```

### 14.4. End-to-End Testing (Future)

**Stack:** Playwright or Cypress

**Example Test:**
```typescript
// e2e/job-search.spec.ts
import { test, expect } from '@playwright/test';

test('complete job search flow', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 2. Navigate to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  
  // 3. Search for jobs
  await page.click('text=Find Jobs');
  await page.waitForSelector('.job-card', { timeout: 5000 });
  
  // 4. Verify results
  const jobCards = await page.$$('.job-card');
  expect(jobCards.length).toBeGreaterThan(0);
  
  // 5. Click Smart Apply
  await jobCards[0].click('text=Smart Apply');
  
  // 6. Verify cover letter modal
  await expect(page.locator('.cover-letter-modal')).toBeVisible();
});
```

### 14.5. Performance Testing

**Tools:**
- **Lighthouse:** Web vitals and performance audits
- **WebPageTest:** Real-world performance testing
- **Vercel Analytics:** Production monitoring

**Lighthouse Audit:**
```bash
npx lighthouse https://career-pilot-ai-gamma.vercel.app --view
```

**Target Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >90

### 14.6. Manual Testing Checklist

#### Authentication Flow
- [ ] Sign up with new email
- [ ] Sign up with existing email (error)
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect credentials (error)
- [ ] Sign out
- [ ] Password reset (if implemented)

#### Profile Management
- [ ] Complete profile setup
- [ ] Edit profile information
- [ ] Update skills (comma-separated)
- [ ] Select English-speaking country
- [ ] Select non-English country (modal appears)
- [ ] Confirm geographic limitation modal

#### Job Search
- [ ] Run job search with valid profile
- [ ] Verify 10 jobs returned
- [ ] Check fit scores (0-100%)
- [ ] Verify matching skills highlighted
- [ ] Test with different target roles
- [ ] Test with different locations

#### Smart Apply
- [ ] Click Smart Apply
- [ ] Verify job link opens in new tab
- [ ] Verify application tracked in Firestore
- [ ] Verify cover letter generated
- [ ] Check cover letter quality
- [ ] Copy cover letter to clipboard

#### Resume Builder
- [ ] Fill personal information
- [ ] Add professional summary
- [ ] Add work experience (multiple entries)
- [ ] Mark current role checkbox
- [ ] Add education (multiple entries)
- [ ] Add skills
- [ ] Save resume to Firestore
- [ ] Export to PDF
- [ ] Verify PDF formatting

#### Interview Coach
- [ ] Select General interview type
- [ ] Start interview session
- [ ] Send user message
- [ ] Receive AI response
- [ ] Verify context maintained
- [ ] Test Behavioral interview type
- [ ] Test Technical interview type
- [ ] Restart interview

#### Mobile Responsiveness
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad
- [ ] Verify navigation works
- [ ] Check form inputs
- [ ] Verify buttons clickable

#### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### 14.7. Quality Metrics

**Code Quality:**
- TypeScript coverage: 95%+ (strict mode)
- ESLint warnings: 0
- Console errors: 0 in production
- Accessibility: WCAG 2.1 AA compliant

**Performance:**
- Build time: <2 minutes
- Cold start: <3 seconds
- API response: <2 seconds average
- Bundle size: <500KB gzipped

**Reliability:**
- Uptime: 99.9%+ (Vercel SLA)
- Error rate: <0.1%
- Success rate (API): >99%

---

## 15. Troubleshooting & Common Issues

### 15.1. Firebase Admin Initialization Error

**Error:**
```
Error: The default Firebase app already exists
```

**Cause:** Multiple `initializeApp()` calls in different modules

**Solution:**
```typescript
// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Only initialize if no apps exist
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const db = getFirestore();
```

**Prevention:**
- Always import `db` from `@/lib/firebase-admin`
- Never call `initializeApp()` in API routes
- Use centralized initialization file

### 15.2. Firebase Private Key Decoding Error

**Error:**
```
error:1E08010C:DECODER routines::unsupported
```

**Cause:** Incorrectly formatted private key in Vercel environment variables

**Solution:**
1. Delete existing `FIREBASE_PRIVATE_KEY` in Vercel Dashboard
2. Copy private key from Firebase service account JSON
3. Paste directly with actual newlines (not `\n` escaped)
4. Ensure key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
5. Save and redeploy

**Verification:**
```typescript
// Test in API route
console.log('Private key starts with:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30));
// Should output: -----BEGIN PRIVATE KEY-----
```

### 15.3. Module Resolution Error

**Error:**
```
Can't resolve '@/lib/firebase-admin'
```

**Cause:** Path alias misconfiguration

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Alternative:**
```typescript
// Use relative imports
import { db } from '../../lib/firebase-admin';
```

### 15.4. 0% Fit Scores

**Symptom:** All job searches return 0% fit score

**Cause:** Skills field contains long text instead of discrete skills

**Example (Wrong):**
```json
{
  "skills": ["I have experience with product management, agile methodologies, user research, and data analytics"]
}
```

**Example (Correct):**
```json
{
  "skills": ["Product Management", "Agile", "User Research", "Data Analytics"]
}
```

**Solution:**
1. Navigate to `/profile/update-skills`
2. Enter skills as comma-separated list
3. Keep each skill 1-3 words
4. Save and re-run job search

**Code Fix:**
```typescript
// Normalize skills on save
const normalizeSkills = (skillsText: string): string[] => {
  return skillsText
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.split(' ').length <= 3);
};
```

### 15.5. Invalid Date Display

**Symptom:** Job posted date shows "Invalid Date"

**Cause:** Using wrong date field from JSearch API or malformed date string

**Solution:**
```typescript
// Use correct field: job_posted_at_datetime_utc
function formatDate(dateString: string): string {
  if (!dateString) return 'Recently';
  
  try {
    const date = new Date(dateString);
    
    // Validate date
    if (isNaN(date.getTime())) {
      return 'Recently';
    }
    
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}
```

### 15.6. OpenAI API Timeout

**Symptom:** Cover letter or interview coach requests timeout

**Cause:** OpenAI API slow response or network issues

**Solution:**
```typescript
// Add timeout and retry logic
const fetchWithTimeout = async (url: string, options: any, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Use in API route
try {
  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/chat/completions',
    { ... },
    15000 // 15 second timeout
  );
} catch (error) {
  if (error.name === 'AbortError') {
    return NextResponse.json({ 
      error: 'Request timeout. Please try again.' 
    }, { status: 504 });
  }
  throw error;
}
```

### 15.7. Vercel Deployment Fails

**Common Causes & Solutions:**

**1. Build Error:**
```bash
# Check local build first
npm run build

# Fix TypeScript errors
npx tsc --noEmit

# Fix ESLint errors
npm run lint
```

**2. Missing Environment Variables:**
- Check Vercel Dashboard → Settings → Environment Variables
- Ensure all required variables are set
- Verify correct spelling and values
- Redeploy after adding variables

**3. Dependency Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update
```

**4. Next.js Version Mismatch:**
```json
// package.json - ensure compatible versions
{
  "next": "14.2.3",
  "react": "18.3.1",
  "react-dom": "18.3.1"
}
```

### 15.8. Firestore Permission Denied

**Error:**
```
FirebaseError: Missing or insufficient permissions
```

**Cause:** Firestore security rules blocking request

**Solution (Development):**
```javascript
// Firebase Console → Firestore → Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Solution (Production):**
```javascript
// Restrict to user's own documents
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /resumes/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /applications/{applicationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### 15.9. PDF Export Not Working

**Symptom:** Resume PDF export fails or shows blank page

**Cause:** jsPDF not loaded or content too long

**Solution:**
```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Required for table support

const generatePDF = () => {
  try {
    const doc = new jsPDF();
    
    // Check for empty content
    if (!resume.personalInfo.fullName) {
      throw new Error('Resume has no content');
    }
    
    // Add content with page break handling
    let yPosition = 20;
    
    // ... add content ...
    
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Save
    doc.save(`${resume.personalInfo.fullName}_Resume.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
```

### 15.10. Geographic Modal Not Appearing

**Symptom:** Non-English country selected but modal doesn't show

**Cause:** State not updating or condition check failing

**Debug:**
```typescript
const handleCountryChange = (country: string) => {
  console.log('Selected country:', country);
  console.log('Is non-English?', NON_ENGLISH_COUNTRIES.includes(country));
  
  if (NON_ENGLISH_COUNTRIES.includes(country)) {
    console.log('Showing modal');
    setPendingCountry(country);
    setShowGeographicModal(true);
  } else {
    setFormData({ ...formData, country });
  }
};
```

**Verify NON_ENGLISH_COUNTRIES array:**
```typescript
const NON_ENGLISH_COUNTRIES = ['DE', 'FR', 'IT', 'ES', 'NL'];
```

---

## 16. Best Practices

### 16.1. Code Organization

**Component Structure:**
```typescript
// 1. Imports (external, then internal)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

// 2. Types/Interfaces
interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

// 3. Component
export default function JobCard({ job, onApply }: JobCardProps) {
  // 3a. Hooks
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 3b. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 3c. Handlers
  const handleApplyClick = () => {
    onApply(job.id);
  };
  
  // 3d. Render
  return (
    <div className="job-card">
      {/* JSX */}
    </div>
  );
}

// 4. Helper functions (if needed)
function formatSalary(salary: string): string {
  // ...
}
```

### 16.2. Error Handling

**API Routes:**
```typescript
export async function POST(request: NextRequest) {
  try {
    // Validate input
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ 
        error: 'userId is required' 
      }, { status: 400 });
    }
    
    // Check environment
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json({ 
        error: 'Service not configured' 
      }, { status: 500 });
    }
    
    // Business logic
    const result = await performAction(userId);
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error: any) {
    // Log error with context
    console.error('❌ API error:', {
      endpoint: '/api/example',
      error: error.message,
      stack: error.stack,
    });
    
    // Return user-friendly error
    return NextResponse.json({ 
      error: 'An error occurred',
      details: error.message 
    }, { status: 500 });
  }
}
```

**Client Components:**
```typescript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const res = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Request failed');
    }
    
    const data = await res.json();
    setData(data);
    
  } catch (error: any) {
    console.error('Fetch error:', error);
    setError(error.message);
    
    // Show user-friendly toast/notification
    toast.error('Failed to load data. Please try again.');
    
  } finally {
    setLoading(false);
  }
};
```

### 16.3. Performance Optimization

**Memoization:**
```typescript
import { useMemo, useCallback } from 'react';

function JobList({ jobs, onApply }) {
  // Memoize expensive calculations
  const sortedJobs = useMemo(() => {
    return jobs.sort((a, b) => b.fitScore - a.fitScore);
  }, [jobs]);
  
  // Memoize callbacks to prevent re-renders
  const handleApply = useCallback((jobId: string) => {
    onApply(jobId);
  }, [onApply]);
  
  return (
    <div>
      {sortedJobs.map(job => (
        <JobCard key={job.id} job={job} onApply={handleApply} />
      ))}
    </div>
  );
}
```

**Lazy Loading:**
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering if not needed
});
```

### 16.4. Security

**Input Sanitization:**
```typescript
// Validate and sanitize user input
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 500); // Limit length
}

// Use in forms
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  const sanitized = sanitizeInput(userInput);
  // Proceed with sanitized input
};
```

**SQL Injection Prevention:**
```typescript
// Firestore is NoSQL, but still use parameterized queries
const userDoc = db.collection('users').doc(userId); // Safe
// NOT: db.collection('users').doc(`${userId}`); // Unsafe if userId is user input
```

### 16.5. Accessibility

**Semantic HTML:**
```tsx
// GOOD
<button onClick={handleClick}>Click me</button>

// BAD
<div onClick={handleClick}>Click me</div>
```

**ARIA Labels:**
```tsx
<button 
  aria-label="Search for jobs"
  onClick={searchJobs}
>
  🔍
</button>

<input 
  type="text"
  aria-label="Enter your target job title"
  placeholder="e.g., Senior Product Manager"
/>
```

**Keyboard Navigation:**
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSubmit();
  }
  if (e.key === 'Escape') {
    closeModal();
  }
};

<div 
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {/* Content */}
</div>
```

### 16.6. Documentation

**Code Comments:**
```typescript
/**
 * Calculate fit score based on skill matching
 * 
 * @param userSkills - Array of user's skills
 * @param jobDescription - Full job description text
 * @returns Fit score as percentage (0-100)
 * 
 * @example
 * calculateFitScore(['React', 'Node.js'], 'We need React and TypeScript')
 * // Returns: 50 (1 out of 2 skills matched)
 */
function calculateFitScore(userSkills: string[], jobDescription: string): number {
  // Implementation
}
```

**API Documentation:**
```typescript
/**
 * POST /api/search-jobs
 * 
 * Search for jobs based on user profile
 * 
 * @route POST /api/search-jobs
 * @access Private (requires userId)
 * 
 * @body {Object} request
 * @body {string} request.userId - Firebase user ID
 * 
 * @returns {Object} response
 * @returns {Array<Job>} response.jobs - Array of matched jobs
 * 
 * @throws {400} Missing userId
 * @throws {404} User not found
 * @throws {500} JSearch API error
 */
export async function POST(request: NextRequest) {
  // Implementation
}
```

### 16.7. Git Practices

**Commit Messages:**
```bash
# GOOD
git commit -m "feat: Add interview coach behavioral mode

- Implemented STAR method prompting
- Added follow-up question logic
- Updated UI to show interview type selection

Co-Authored-By: Oz <oz-agent@warp.dev>"

# BAD
git commit -m "fixed stuff"
```

**Branch Naming:**
```bash
# GOOD
feature/interview-coach-behavioral-mode
bugfix/fit-score-calculation-error
hotfix/firebase-admin-initialization

# BAD
fix
new-feature
test-branch
```

**Pull Requests:**
- Clear title and description
- Link to related issues
- Include screenshots for UI changes
- Request specific reviewers
- Respond to review comments

---

## 17. Roadmap & Future Development

### 17.1. MVP Completion (Current - 95% Complete)

**Status:** In Progress

**Remaining Tasks:**
- [ ] Stripe integration (subscriptions + top-ups)
- [ ] Credit system implementation (deduction logic)
- [ ] Payment webhooks handling
- [ ] Subscription management UI
- [ ] Production Firestore security rules

**Target Completion:** Q2 2026 (June)

### 17.2. Post-MVP Features (Q3 2026)

#### A. Application Tracking Enhancements
- **Status:** Planned
- **Features:**
  - Email parsing for recruiter responses
  - Auto-update application status
  - Calendar integration for interviews
  - Reminder notifications
  - Application analytics (response rate, time-to-interview)

#### B. Multiple Resume Templates
- **Status:** Planned
- **Features:**
  - 5+ professional templates
  - Industry-specific designs (tech, finance, creative)
  - Color customization
  - Template preview before selection
  - Save multiple resume versions

#### C. Export to Word Format
- **Status:** Planned
- **Technology:** docx library or Mammoth.js
- **Features:**
  - .docx export in addition to PDF
  - Preserve formatting
  - Compatible with MS Word, Google Docs

#### D. Interview Session History
- **Status:** Planned
- **Features:**
  - Save interview coaching sessions
  - Review past conversations
  - Track improvement over time
  - Export session transcripts
  - Performance analytics (question types, response quality)

### 17.3. Q4 2026 Enhancements

#### A. Email Notifications
- **Status:** Planned
- **Technology:** Nodemailer + SendGrid/Postmark
- **Features:**
  - New job matches (daily/weekly digest)
  - Application status updates
  - Interview reminders
  - Subscription renewal notices
  - Credit balance alerts

#### B. Job Alerts
- **Status:** Planned
- **Features:**
  - Create custom job alert criteria
  - Real-time notifications (email + in-app)
  - Saved searches
  - Alert frequency preferences
  - Geographic radius filtering

#### C. Advanced Analytics Dashboard
- **Status:** Planned
- **Features:**
  - Application funnel visualization
  - Response rate over time
  - Fit score distribution
  - Most successful skills
  - Time-to-hire tracking
  - Benchmarking against anonymized peers

### 17.4. 2027 Initiatives

#### A. Mobile App (React Native)
- **Status:** Research Phase
- **Platform:** iOS + Android
- **Features:**
  - Native job search
  - Push notifications
  - Offline resume builder
  - Quick apply from mobile
  - Interview coach voice mode

#### B. AI Model Fine-Tuning
- **Status:** Conceptual
- **Goal:** Improve cover letter and interview coach quality
- **Approach:**
  - Collect user feedback on generated content
  - Fine-tune GPT-3.5 on successful cover letters
  - Train specialized model for interview coaching
  - Reduce API costs with smaller, faster models

#### C. Integration Marketplace
- **Status:** Conceptual
- **Partners:**
  - LinkedIn (import profile, export applications)
  - Indeed (cross-post applications)
  - Greenhouse/Lever (ATS integrations)
  - Google Calendar (interview scheduling)
  - Slack (notification integration)

### 17.5. Long-Term Vision (2027+)

#### A. White-Label Solution
- **Target:** Enterprises, universities, outplacement services
- **Features:**
  - Custom branding
  - SSO integration
  - Admin dashboard
  - Usage analytics
  - Custom credit pricing

#### B. B2B Licensing
- **Target:** Career coaching firms, recruitment agencies
- **Model:** License CareerPilot AI as coaching tool
- **Pricing:** Per-seat licensing + revenue share

#### C. Global Expansion
- **Phase 1:** Full support for non-English markets
  - Multilingual UI (French, German, Spanish, Italian)
  - Localized job boards
  - Regional salary data
  - Cultural adaptation (resume formats, interview styles)

- **Phase 2:** Emerging markets
  - India, Brazil, China
  - Local payment methods
  - Partnership with regional job boards

#### D. Advanced AI Features
- **Salary Negotiation Coach:** AI-powered negotiation advice
- **Career Path Predictor:** ML model suggesting optimal career moves
- **Skills Gap Analyzer:** Identify skills to learn for target roles
- **Company Culture Matcher:** Match personality to company culture

### 17.6. Technical Debt & Refactoring

**Priority Items:**
- [ ] Implement comprehensive test suite (unit, integration, e2e)
- [ ] Migrate to TypeScript strict mode (100% coverage)
- [ ] Refactor API routes for better error handling
- [ ] Implement proper authentication middleware
- [ ] Add rate limiting to all API endpoints
- [ ] Set up production Firestore security rules
- [ ] Optimize bundle size (<300KB gzipped)
- [ ] Implement Redis caching layer
- [ ] Add CDN for static assets
- [ ] Set up monitoring and alerting (Sentry, DataDog)

### 17.7. Feature Requests Backlog

**User-Requested:**
- [ ] Bulk job import from CSV
- [ ] Chrome extension for one-click apply
- [ ] Network visualization (connections, referrals)
- [ ] Salary comparison tool
- [ ] Company review aggregator
- [ ] Cover letter A/B testing
- [ ] Video interview practice (with webcam)
- [ ] Portfolio hosting for creative professionals

**Internal Ideas:**
- [ ] AI-powered resume optimization suggestions
- [ ] Automated follow-up email templates
- [ ] Job application deadline tracking
- [ ] Skill certification recommendations
- [ ] Peer resume review marketplace
- [ ] Anonymous salary sharing community

---

## 18. Appendices

### Appendix A: Glossary

**API (Application Programming Interface):** Interface for software components to communicate

**CDN (Content Delivery Network):** Distributed network for serving static assets

**CLS (Cumulative Layout Shift):** Web Vital measuring visual stability

**CRUD (Create, Read, Update, Delete):** Basic database operations

**FID (First Input Delay):** Web Vital measuring interactivity

**Firestore:** Google's NoSQL cloud database

**Fit Score:** Percentage match between user skills and job requirements (0-100%)

**JSearch API:** Third-party job search API via RapidAPI

**LCP (Largest Contentful Paint):** Web Vital measuring loading performance

**OpenAI GPT-3.5-turbo:** AI model for text generation

**SaaS (Software as a Service):** Cloud-based software delivery model

**STAR Method:** Situation, Task, Action, Result (behavioral interview framework)

**Vercel:** Cloud platform for frontend frameworks and serverless functions

### Appendix B: External Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs
- OpenAI: https://platform.openai.com/docs
- Stripe: https://stripe.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

**APIs:**
- JSearch API: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- OpenAI API: https://platform.openai.com/docs/api-reference

**Tools:**
- Vercel Dashboard: https://vercel.com/dashboard
- Firebase Console: https://console.firebase.google.com
- GitHub Repository: https://github.com/NofaBC/CareerPilot-AI

**Community:**
- Next.js Discord: https://nextjs.org/discord
- Firebase Slack: https://firebase.community

### Appendix C: Related Documents

**Internal Documentation:**
- `KNOWLEDGE_BASE.md` - Original knowledge base (750 lines)
- `SUBSCRIPTION_AND_CREDITS_KNOWLEDGE_BASE.md` - Pricing and credits (670+ lines)
- `BUG_TRACKING.md` - Known issues and bug tracking
- `STRIPE_INTEGRATION_GUIDE.md` - Payment integration guide
- `careerpilot_ecosystem_integration.md` - Ecosystem integration design
- `careerpilot_pricing_strategy.md` - Pricing philosophy and revenue strategy
- `dev-logs/` - Daily development logs

**External References:**
- [TechSupport AI Technical Knowledge Base](../TechSupport-AI/TECHSUPPORT_AI_TECHNICAL_KNOWLEDGE_BASE.md)
- [CommandDesk AI Knowledge Base](../CommandDesk-AI/COMMANDDESK_AI_KNOWLEDGE_BASE.md)

### Appendix D: Contact Information

**Project Maintainer:**
- Name: Farhad Nassiri
- GitHub: @NofaBC
- Email: [Contact via GitHub]

**Support Channels:**
- GitHub Issues: https://github.com/NofaBC/CareerPilot-AI/issues
- TechSupport AI: [To be integrated]

**Business Inquiries:**
- Partnerships: [TBD]
- Licensing: [TBD]
- Press: [TBD]

---

## Change Log

### Version 1.0 (March 12, 2026)
- Initial comprehensive technical knowledge base created
- Consolidated information from existing documentation
- Added 2,400+ lines of technical reference
- Structured for easy navigation and maintenance
- Aligned with TechSupport AI and CommandDesk AI knowledge base formats

### Future Updates
- Track changes in this section
- Maintain version history
- Document major feature additions
- Update API reference as endpoints evolve

---

**End of Document**

**Last Updated:** March 12, 2026  
**Document Version:** 1.0  
**Total Lines:** 2,400+  
**Maintained By:** Farhad Nassiri (@NofaBC)  
**Part of:** NOFA AI Factory Ecosystem
