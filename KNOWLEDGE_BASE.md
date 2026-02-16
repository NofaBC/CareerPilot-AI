# CareerPilot AI - Knowledge Base

## Project Overview

**CareerPilot AI** is an AI-powered job search SaaS platform that helps job seekers find positions, match their skills, generate resumes, practice interviews, and apply to jobs with AI-generated cover letters.

**Tech Stack:**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **AI:** OpenAI GPT-3.5-turbo
- **Job Search:** JSearch API (RapidAPI)
- **PDF Generation:** jsPDF
- **Deployment:** Vercel
- **Payments:** Stripe (pending integration)

**Repository:** https://github.com/NofaBC/CareerPilot-AI  
**Live URL:** https://career-pilot-ai-gamma.vercel.app/

---

## Architecture

### Directory Structure

```
CareerPilot-AI/
├── app/
│   ├── api/                      # API routes
│   │   ├── search-jobs/          # Job search endpoint
│   │   ├── submit-application/   # Application tracking
│   │   ├── generate-cover-letter/# AI cover letter generation
│   │   ├── interview-coach/      # AI interview practice
│   │   └── debug-profile/        # Debug utility
│   ├── dashboard/                # Main dashboard
│   │   ├── resume-builder/       # Resume creation tool
│   │   ├── interview-coach/      # Interview practice UI
│   │   └── interview/            # Old interview page (unused)
│   ├── profile/
│   │   ├── setup/                # Initial profile setup
│   │   ├── edit/                 # Profile editing
│   │   └── update-skills/        # Skills management
│   ├── login/                    # Authentication
│   ├── signup/                   # Registration
│   ├── debug/                    # Debug page
│   └── components/               # Reusable components
├── lib/
│   ├── firebase.ts               # Firebase client config
│   ├── firebase-admin.ts         # Firebase Admin SDK
│   ├── auth-hooks.ts             # Auth utilities
│   └── applications.ts           # Application tracking
└── public/                       # Static assets
```

### Firebase Collections

```
users/
  {userId}/
    - targetRole: string
    - location: string
    - experienceYears: number
    - skills: string[]
    - updatedAt: timestamp

resumes/
  {userId}/
    - personalInfo: object
    - summary: string
    - experience: array
    - education: array
    - skills: string[]
    - updatedAt: timestamp

applications/
  {applicationId}/
    - userId: string
    - jobId: string
    - jobTitle: string
    - company: string
    - location: string
    - applyLink: string
    - coverLetter: string
    - status: string
    - appliedAt: timestamp
    - updatedAt: timestamp
```

---

## Core Features

### 1. Authentication & Profile Management

**Implementation:**
- Firebase Authentication (email/password)
- Profile stored in Firestore `users` collection
- Auth hooks in `lib/auth-hooks.ts`

**User Profile Fields:**
- `targetRole`: Target job position
- `location`: Preferred location
- `experienceYears`: Years of experience
- `skills`: Array of technical skills
- `updatedAt`: Last modification timestamp

**Key Files:**
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/profile/setup/page.tsx`
- `app/profile/update-skills/page.tsx`

### 2. Job Search & Matching

**API Endpoint:** `/api/search-jobs`

**Flow:**
1. Receives `userId` in request
2. Fetches user profile from Firestore
3. Calls JSearch API with `targetRole` and `location`
4. Calculates fit scores based on skill matching
5. Returns top 10 jobs sorted by fit score

**Fit Score Algorithm:**
```typescript
// Matches user skills against job title, description, and skill tags
const fitScore = (matchedSkills.length / totalUserSkills.length) * 100
```

**Key Features:**
- Real-time job search via JSearch API
- Skill-based matching algorithm
- Date formatting with proper validation
- Displays: title, company, location, salary, fit score, matching skills

**Environment Variables:**
- `JSEARCH_API_KEY`: RapidAPI key for JSearch

**Key Files:**
- `app/api/search-jobs/route.ts`
- `app/components/JobMatchList.tsx`

### 3. Smart Apply & Cover Letter Generation

**API Endpoint:** `/api/generate-cover-letter`

**Flow:**
1. User clicks "Smart Apply" on a job
2. Opens job application link in new tab
3. Tracks application in Firestore `applications` collection
4. Generates AI cover letter using OpenAI
5. Displays generated cover letter

**Cover Letter Prompt:**
```
Write a concise, professional cover letter for a candidate 
applying to {jobTitle} at {company}.

Candidate Resume/Profile:
{resumeText}

Job Description:
{jobDescription}

Keep under 250 words. Professional but personable tone.
```

**Environment Variables:**
- `OPENAI_API_KEY`: OpenAI API key

**Key Files:**
- `app/api/generate-cover-letter/route.ts`
- `app/components/JobMatchList.tsx`
- `lib/applications.ts`

### 4. Resume Builder

**Route:** `/dashboard/resume-builder`

**Features:**
- **Personal Information**: Name, email, phone, location, LinkedIn, portfolio
- **Professional Summary**: Career overview
- **Work Experience**: Add/edit/remove multiple positions
  - Company, position, dates, current role checkbox
  - Detailed description of responsibilities
- **Education**: Add/edit/remove degrees
  - School, degree, field of study, graduation date
- **Skills**: Comma-separated list

**Storage:**
- Data saved to Firestore `resumes/{userId}`
- Auto-save on "Save" button click

**PDF Generation:**
- Uses jsPDF library
- Professional template with:
  - Header with name and contact info
  - Sections: Summary, Experience, Education, Skills
  - Automatic page breaks for long content
  - Clean typography and formatting
- Downloads as `{fullName}_Resume.pdf`

**Key Files:**
- `app/dashboard/resume-builder/page.tsx`

### 5. AI Interview Coach

**Route:** `/dashboard/interview-coach`  
**API Endpoint:** `/api/interview-coach`

**Features:**
- **Interview Types**: General, Behavioral, Technical
- **Chat Interface**: Real-time conversation with AI
- **Context-Aware**: Uses user's target role from profile
- **Conversation History**: Maintains full context

**AI System Prompt:**
```
You are an expert interview coach conducting a {interviewType} 
interview for a {targetRole} position.

Your role:
- Ask relevant, thoughtful interview questions
- Provide constructive feedback on answers
- Be encouraging but honest
- Ask follow-up questions to dig deeper

Interview style: {specific instructions based on type}

After 5-7 questions, offer to wrap up and provide overall feedback.
```

**Environment Variables:**
- `OPENAI_API_KEY`: OpenAI API key

**Key Files:**
- `app/dashboard/interview-coach/page.tsx`
- `app/api/interview-coach/route.ts`

### 6. Dashboard & Analytics

**Route:** `/dashboard`

**Features:**
- Profile completion status
- Applications tracking
- Quick access tiles:
  - Build/Refine Profile
  - Find & Score Jobs
  - Smart Apply
  - Interview Coach
- Campaign analytics:
  - Applications sent
  - Responses received
  - Interviews booked

**Key Files:**
- `app/dashboard/page.tsx`

---

## API Reference

### POST /api/search-jobs

**Request:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "jobs": [
    {
      "id": "string",
      "title": "string",
      "company": "string",
      "location": "string",
      "description": "string",
      "applyLink": "string",
      "salary": "string",
      "fitScore": number,
      "matchingSkills": ["string"],
      "posted": "string"
    }
  ]
}
```

### POST /api/generate-cover-letter

**Request:**
```json
{
  "jobTitle": "string",
  "company": "string",
  "jobDescription": "string",
  "resumeText": "string"
}
```

**Response:**
```json
{
  "coverLetter": "string"
}
```

### POST /api/interview-coach

**Request:**
```json
{
  "messages": [
    { "role": "user|assistant", "content": "string" }
  ],
  "interviewType": "general|behavioral|technical",
  "targetRole": "string",
  "userProfile": "string (optional)"
}
```

**Response:**
```json
{
  "response": "string"
}
```

### POST /api/submit-application

**Request:**
```json
{
  "userId": "string",
  "jobId": "string",
  "jobTitle": "string",
  "company": "string",
  "applyLink": "string",
  "coverLetter": "string",
  "status": "string"
}
```

**Response:**
```json
{
  "success": true,
  "applicationId": "string"
}
```

---

## Environment Variables

### Required for Production

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-side)
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# External APIs
JSEARCH_API_KEY=          # RapidAPI key for job search
OPENAI_API_KEY=           # OpenAI for AI features

# Stripe (Pending)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Environment Setup in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all variables above
3. **Important:** For `FIREBASE_PRIVATE_KEY`, paste the full key including newlines
4. Select all environments (Production, Preview, Development)
5. Redeploy after adding variables

---

## Common Issues & Solutions

### 1. Firebase Admin Initialization Error

**Error:** "The default Firebase app already exists"

**Cause:** Multiple `initializeApp()` calls

**Solution:** 
- Use centralized initialization in `lib/firebase-admin.ts`
- Check `getApps().length` before initializing
- Import `db` from `@/lib/firebase-admin` in API routes

### 2. Module Resolution Error

**Error:** "Can't resolve '@/lib/firebase-admin'"

**Cause:** Path alias misconfiguration

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": { 
      "@/*": ["./app/*", "./*"] 
    }
  }
}
```

### 3. Firebase Private Key Decoding Error

**Error:** "error:1E08010C:DECODER routines::unsupported"

**Cause:** Incorrectly formatted private key in Vercel

**Solution:**
1. Delete existing `FIREBASE_PRIVATE_KEY` variable in Vercel
2. Copy private key from Firebase service account JSON
3. Paste directly with actual newlines (not `\n` escaped)
4. Save and redeploy

### 4. 0% Fit Scores

**Cause:** Skills field contains long text instead of discrete skills

**Solution:**
- Use `/profile/update-skills` page
- Enter skills as comma-separated list
- Keep each skill 1-3 words

### 5. Invalid Date Display

**Cause:** Wrong date field from JSearch API

**Solution:**
- Use `job_posted_at_datetime_utc` field
- Add date validation and fallback

---

## Development Workflow

### Local Setup

```bash
# Clone repository
git clone https://github.com/NofaBC/CareerPilot-AI.git
cd CareerPilot-AI

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
# Add your environment variables

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel (automatic on push to main)
git push origin main
```

### Testing Checklist

- [ ] Authentication (sign up, sign in, sign out)
- [ ] Profile creation and editing
- [ ] Job search with real data
- [ ] Fit score calculation
- [ ] Smart Apply functionality
- [ ] Cover letter generation
- [ ] Resume builder (all sections)
- [ ] PDF export
- [ ] Interview coach (all types)
- [ ] Mobile responsiveness

---

## Code Patterns & Best Practices

### API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { param } = await request.json();
    
    // Validation
    if (!param) {
      return NextResponse.json({ error: 'Param required' }, { status: 400 });
    }
    
    // Check API keys
    if (!process.env.API_KEY) {
      console.error('❌ API_KEY not configured');
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
    }
    
    // Business logic
    console.log('✅ Processing request');
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json({ 
      error: 'Internal error',
      details: error.message 
    }, { status: 500 });
  }
}
```

### Firebase Admin Usage

```typescript
import { db } from '@/lib/firebase-admin';

// Read
const doc = await db.collection('users').doc(userId).get();
const data = doc.data();

// Write
await db.collection('users').doc(userId).set({
  field: 'value',
  updatedAt: new Date().toISOString()
});

// Query
const snapshot = await db.collection('applications')
  .where('userId', '==', userId)
  .get();
const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### Client-side Firebase

```typescript
import { firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Read
const docRef = doc(firestore, 'users', userId);
const docSnap = await getDoc(docRef);
const data = docSnap.data();

// Write
await setDoc(doc(firestore, 'users', userId), {
  field: 'value'
});
```

### OpenAI Integration

```typescript
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
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 300,
  }),
});

const data = await response.json();
const aiResponse = data.choices?.[0]?.message?.content;
```

---

## Performance Optimization

### Current Metrics
- Build time: ~1 minute
- Cold start: <3 seconds
- API response times: 1-2 seconds average
- PDF generation: <1 second client-side

### Optimization Opportunities
1. Add caching for job search results
2. Implement pagination for long lists
3. Lazy load components
4. Optimize image assets
5. Add service worker for offline support

---

## Security Considerations

### Implemented
- ✅ Firebase Authentication
- ✅ Firestore security rules (default)
- ✅ API key validation
- ✅ Environment variable protection
- ✅ Client/server separation

### TODO
- [ ] Add rate limiting to APIs
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Set up Firestore security rules
- [ ] Add API authentication middleware

---

## Roadmap

### MVP (In Progress - 95% Complete)
- [x] Authentication & Profile
- [x] Job Search & Matching
- [x] Smart Apply & Cover Letters
- [x] Resume Builder with PDF
- [x] AI Interview Coach
- [ ] Stripe Integration

### Post-MVP
- [ ] Application tracking enhancements
- [ ] Multiple resume templates
- [ ] Export to Word format
- [ ] Interview session history
- [ ] Email notifications
- [ ] Job alerts
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

## Support & Troubleshooting

### Debug Tools
- `/debug` page - Check profile and environment variables
- Browser DevTools Console - Check client-side errors
- Vercel Logs - Check server-side errors
- Firebase Console - Check Firestore data

### Common Commands

```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# Check node version
node --version

# Clear npm cache
npm cache clean --force

# Rebuild dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help
1. Check this knowledge base
2. Review error logs (console, Vercel)
3. Check Firebase/OpenAI status pages
4. Review API documentation (JSearch, OpenAI)
5. GitHub Issues (for bugs)

---

## Contributing

### Commit Message Format
```
<type>: <subject>

<body>

Co-Authored-By: Warp <agent@warp.dev>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat: Add PDF export to resume builder

- Implemented jsPDF integration
- Created professional template
- Added automatic page breaks

Co-Authored-By: Warp <agent@warp.dev>
```

---

## Changelog

### February 13, 2026
- Fixed Firebase Admin initialization issues
- Enhanced fit score algorithm
- Fixed date formatting in job search
- Built complete Resume Builder with PDF export
- Implemented AI Interview Coach
- Added skills management tools
- Improved error handling across all APIs

### Earlier Development
- Initial project setup
- Authentication implementation
- Profile management
- Job search integration
- Cover letter generation
- Dashboard creation

---

**Last Updated:** February 16, 2026  
**Version:** 0.9.5 (MVP - Pre-Stripe)  
**Maintained By:** Farhad Nassiri (@NofaBC)
