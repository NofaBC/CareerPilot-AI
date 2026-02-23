# Bug Tracking - February 23, 2026

**Testing Session:** 11:32 AM - 12:26 PM MST  
**Tester:** Farhad Nassiri  
**Test Profile:** Sarah Collins - Reception Manager, Manchester, UK  
**Environment:** Production (Vercel deployment)

---

## 🔴 P0 - BLOCKING LAUNCH (Must Fix Immediately)

### 1. Smart Apply Flow Completely Broken
**Status:** 🔴 Critical  
**Discovered:** 12:24 PM

**Problem:**
- "Apply Now" button only opens external job link
- No cover letter generation triggered
- No application saved to Firestore
- No tracking or analytics data captured

**Expected Behavior:**
1. User clicks "Apply Now"
2. Modal/page opens with AI-generated cover letter
3. User can review/copy/edit cover letter
4. Application saves to Firestore (`applications` collection)
5. Application appears in "My Applications" section
6. Analytics update (applications sent counter)
7. External job link opens (or user copies cover letter to apply manually)

**Current Behavior:**
1. User clicks "Apply Now"
2. External job link opens immediately
3. Nothing else happens

**Impact:**
- Core value proposition (AI cover letters) not working
- Application tracking completely broken
- Analytics pipeline broken (0 applications sent)
- "My Applications" section empty despite user trying to apply
- Marketing promise unfulfilled

**Root Cause:**
Likely in `app/components/JobMatchList.tsx` - "Apply Now" button not wired to cover letter generation flow

**Files to Check:**
- `app/components/JobMatchList.tsx` (Apply Now button)
- `app/api/generate-cover-letter/route.ts` (endpoint exists but not connected)
- `app/api/submit-application/route.ts` (application tracking)

---

### 2. Password Recovery Missing
**Status:** 🔴 Critical  
**Discovered:** 12:12 PM

**Problem:**
- No "Forgot Password?" link on login page
- Users locked out cannot recover access
- Manual intervention required for password resets

**Impact:**
- Users locked out permanently
- Support burden
- Poor user experience
- Launch blocker

**Solution:**
1. Add "Forgot Password?" link to `/login` page
2. Create `/forgot-password` page with email input
3. Use Firebase `sendPasswordResetEmail()` API
4. Show success message and email instructions

**Files to Create/Modify:**
- `app/login/page.tsx` (add forgot password link)
- `app/forgot-password/page.tsx` (new page)

**Estimated Time:** 30 minutes

---

## ⚠️ P1 - HIGH PRIORITY (Should Fix Before Launch)

### 3. 0% Fit Scores on All Jobs
**Status:** ⚠️ High Priority  
**Discovered:** 11:35 AM

**Problem:**
- All job results showing 0% fit score
- Even highly relevant jobs (Reception Manager for Reception Manager profile)
- Skills matching algorithm not working

**Test Case:**
- Profile: Reception Manager with hospitality skills
- Jobs returned: "Guest Services Manager", "Reception Manager", "Head Receptionist"
- Expected fit: 40-70%
- Actual fit: 0%

**Impact:**
- Core feature (AI matching) appears broken
- Users can't identify best-fit jobs
- Competitive advantage (fit scoring) nullified

**Root Cause Hypothesis:**
- Skill matching in `app/api/search-jobs/route.ts` not finding overlaps
- UK job descriptions use different terminology than US
- Skills from profile not being compared correctly

**Files to Check:**
- `app/api/search-jobs/route.ts` (lines 58-80, fit score calculation)
- Verify profile skills are loaded correctly
- Check if job descriptions contain skill keywords

**Estimated Time:** 1 hour

---

### 4. Jobs Don't Auto-Load on Dashboard
**Status:** ⚠️ High Priority  
**Discovered:** 11:38 AM

**Problem:**
- Dashboard loads but job search section is empty
- No loading state shown
- Requires manual click on "2JobMatch Engine™" header to trigger search
- Silent failure - users don't know what to do

**Expected Behavior:**
- Jobs load automatically when dashboard opens
- Loading spinner shown during search
- Results appear automatically
- OR clear "Search Jobs" button if manual trigger intended

**Current Behavior:**
- Dashboard loads completely
- Job section empty
- No visual feedback
- Jobs only appear after clicking section header

**Impact:**
- Confusing UX
- Users may think feature is broken
- Core feature requires non-intuitive action

**Files to Check:**
- `app/components/JobMatchList.tsx` (auto-load on mount)
- `app/dashboard/page.tsx` (job search component initialization)

**Estimated Time:** 30 minutes

---

### 5. "My Applications" Navigation Not Working
**Status:** ⚠️ High Priority  
**Discovered:** 11:40 AM

**Problem:**
- Clicking "My Applications" in sidebar doesn't show applications
- Just scrolls to job search section
- "Your Applications" section doesn't appear even after applying to jobs

**Expected Behavior:**
- Click "My Applications" → scroll to applications section
- Section shows all jobs user has applied to
- Shows job title, company, status, date applied

**Current Behavior:**
- Click "My Applications" → scrolls to job search
- No applications section visible
- Even after clicking "Apply Now" multiple times

**Root Cause:**
- "Your Applications" section only renders if `applications.length > 0`
- Applications not being saved (see Bug #1)
- Both sidebar links ("Job Search" and "My Applications") pointing to same scroll target

**Files to Check:**
- `app/dashboard/page.tsx` (lines 228-281, applications section)
- Scroll target IDs for navigation

**Estimated Time:** 30 minutes (blocked by Bug #1)

---

## ℹ️ P2 - MEDIUM PRIORITY (Fix Soon)

### 6. "null" in Location Display
**Status:** ℹ️ Medium  
**Discovered:** 11:35 AM

**Problem:**
- UK jobs showing "Manchester, null" instead of "Manchester, United Kingdom"
- "null" appears where state/province should be
- All international jobs affected

**Example:**
- "Buxton, null"
- "Altrincham, null"
- "Manchester, null"

**Root Cause:**
- JSearch API returns `job_state: null` for UK jobs (UK doesn't have states)
- Code assumes state always exists
- String interpolation includes "null" literal

**Current Code:**
```typescript
location: job.job_city ? `${job.job_city}, ${job.job_state}` : 'Remote'
```

**Fix:**
```typescript
location: job.job_city 
  ? `${job.job_city}${job.job_state ? ', ' + job.job_state : ''}`
  : 'Remote'
```

**Files to Fix:**
- `app/api/search-jobs/route.ts` (line 99-105)

**Estimated Time:** 5 minutes

---

### 7. Optional Fields in Resume PDF Display Awkwardly
**Status:** ℹ️ Medium  
**Discovered:** 12:10 PM

**Problem:**
- Empty LinkedIn/Website fields show in PDF as:
  - "Now need a linedin link and a website link. • https://"
- Bullet points for empty fields
- Looks unprofessional

**User Feedback:**
> "Do we need a website link? Most people may not have one. Could as option?"

**Solution:**
1. Label fields as optional: "LinkedIn URL (Optional)", "Website/Portfolio (Optional)"
2. PDF generation: Skip empty fields entirely (no bullets, no text)
3. Only show filled contact fields

**Files to Fix:**
- `app/dashboard/resume-builder/page.tsx` (update labels)
- `app/dashboard/resume-builder/page.tsx` (PDF generation logic, lines 204-211)

**Estimated Time:** 20 minutes

---

### 8. Profile Completion Stuck at 50%
**Status:** ℹ️ Medium  
**Discovered:** 11:36 AM

**Problem:**
- Profile shows "50% complete" even with all fields filled
- Unclear what's needed to reach 100%
- No visual indicator of missing fields

**Test Case:**
- Filled: Target role, country, location, skills, experience years
- Result: Still 50%

**Current Logic:**
```typescript
const profileCompletion = pData?.targetRole && pData?.location && pData?.skills?.length > 0 ? 100 : 50;
```

**Issue:**
- Logic checks `location` but user has `country` + `location` (city) fields
- May not be checking all required fields correctly

**Files to Check:**
- `app/dashboard/page.tsx` (lines 50-66, profile completion calculation)

**Estimated Time:** 15 minutes

---

## 📝 P3 - LOW PRIORITY (Polish / Future)

### 9. Settings Page Returns 404
**Status:** ℹ️ Expected / Low Priority  
**Discovered:** 12:20 PM

**Problem:**
- Clicking "Settings" in sidebar → 404 error
- No settings page exists

**Status:** Expected - settings page is part of Stripe integration (not yet built)

**Solution (MVP):**
Create placeholder settings page with:
- Profile edit link
- "Billing management coming soon"
- Basic account info
- Logout button

**Solution (Full):**
- Will be built with Stripe integration
- Include billing management, subscription, credits, etc.

**Files to Create:**
- `app/settings/page.tsx`

**Estimated Time:** 1 hour (placeholder), 3 hours (full with Stripe)

---

## ✅ TESTED & WORKING

### Features Confirmed Working:
1. ✅ **Authentication** - Signup, login, logout working
2. ✅ **Profile Setup** - Country dropdown, all fields save
3. ✅ **Job Search** - Returns relevant jobs (despite fit score issue)
4. ✅ **Resume Builder** - Manual entry works perfectly
5. ✅ **PDF Generation** - Professional formatting, multi-page support
6. ✅ **Interview Coach** - AI conversation, role-specific questions, follow-ups
7. ✅ **International Support** - UK profile, UK jobs, proper currency/dates

### User Flows Tested:
- ✅ Create account → setup profile → search jobs
- ✅ Build resume manually → download PDF
- ✅ Practice interview (technical) → AI responses
- ✅ UK location → returns UK jobs

---

## 📊 Test Coverage Summary

**Total Issues Found:** 9  
**P0 (Critical):** 2  
**P1 (High):** 3  
**P2 (Medium):** 3  
**P3 (Low):** 1  

**Total Estimated Fix Time:** ~5 hours

---

## 🎯 Recommended Fix Order

### Phase 1: Critical Fixes (2-3 hours)
1. **Smart Apply Flow** (2 hours)
   - Wire "Apply Now" to cover letter generation
   - Implement modal/page for cover letter display
   - Save application to Firestore
   - Update analytics

2. **Password Recovery** (30 min)
   - Add forgot password link
   - Create reset page
   - Wire to Firebase

3. **0% Fit Scores** (1 hour)
   - Debug skill matching algorithm
   - Verify profile data loading
   - Test with UK job descriptions

### Phase 2: High Priority Fixes (1 hour)
4. **Auto-load Jobs** (30 min)
5. **My Applications Navigation** (30 min)

### Phase 3: Polish (1 hour)
6. **"null" in locations** (5 min)
7. **Optional fields in PDF** (20 min)
8. **Profile completion** (15 min)
9. **Settings placeholder** (20 min)

---

## 🔬 Testing Notes

**Test Environment:**
- Production URL: https://career-pilot-ai-gamma.vercel.app/
- Real Firebase data
- Real API calls (JSearch, OpenAI)
- Manchester, UK test profile

**Browser:**
- Not specified (assume Chrome/Edge on Windows)

**Console Errors:**
- Not checked during testing
- Should review browser console for JavaScript errors

**Performance:**
- Job search: ~2-3 seconds (acceptable)
- Resume PDF: Instant (good)
- Interview Coach: ~2-3 seconds per AI response (good)

---

## 📝 Next Steps

1. **Immediate:** Fix P0 issues (Smart Apply + Password Recovery)
2. **Before Launch:** Fix P1 issues (Fit scores, auto-load, navigation)
3. **Polish:** Fix P2 issues (null locations, optional fields, profile %)
4. **Future:** Stripe integration + full settings page

**Estimated Total Time to Launch-Ready:** 4-5 hours of focused work

---

**End of Bug Report**
