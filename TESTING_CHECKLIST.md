# CareerPilot AI - Pre-Stripe Testing Checklist

## 🧪 Testing Before Stripe Integration

Complete this checklist to identify any bugs or loose ends before implementing the credit system and Stripe payments.

---

## ✅ 1. Authentication Flow

### Signup
- [ ] Can create new account with email/password
- [ ] Email validation works
- [ ] Password strength requirements work
- [ ] Redirects to profile setup after signup
- [ ] Error messages display correctly

### Login
- [ ] Can login with correct credentials
- [ ] Wrong password shows error
- [ ] Wrong email shows error
- [ ] Redirects to dashboard after login
- [ ] "Forgot password" flow works

### Session Management
- [ ] Stays logged in after page refresh
- [ ] Logout works correctly
- [ ] Redirects to login when accessing protected pages while logged out

---

## ✅ 2. Profile Management

### Initial Setup
- [ ] Profile setup form displays correctly
- [ ] Country dropdown shows all 14 countries
- [ ] Can select country
- [ ] Can enter city/region
- [ ] Can enter target role
- [ ] Can enter years of experience
- [ ] Can enter skills (comma-separated)
- [ ] Form validation works (required fields)
- [ ] Saves to Firestore correctly
- [ ] Redirects to dashboard after save

### Profile Edit
- [ ] Can access profile edit page
- [ ] Loads existing profile data
- [ ] Can update all fields
- [ ] Changes save correctly
- [ ] Updates reflect in dashboard

### International Support
- [ ] Test with UK location (London, United Kingdom)
- [ ] Test with Canada location (Toronto, Canada)
- [ ] Test with Australia location (Sydney, Australia)
- [ ] Test with European location (Berlin, Germany)

---

## ✅ 3. Job Search

### Basic Search
- [ ] Job search loads on dashboard
- [ ] Shows loading state while searching
- [ ] Returns job results
- [ ] Displays 10 jobs
- [ ] Each job shows: title, company, location, salary, fit score
- [ ] Fit scores calculate correctly (based on skills match)
- [ ] Jobs sorted by fit score (highest first)
- [ ] Posted dates display correctly

### International Jobs
- [ ] Search with UK location returns UK jobs
- [ ] Search with Canada location returns Canadian jobs
- [ ] Currency displays correctly (GBP for UK, CAD for Canada)
- [ ] Location format correct (City, Country)

### Error Handling
- [ ] Handles API errors gracefully
- [ ] Shows error message if search fails
- [ ] Handles empty results
- [ ] Handles invalid profile data

### Fit Score Accuracy
- [ ] Test with 5+ matching skills → should show high scores (50%+)
- [ ] Test with 0 matching skills → should show low scores
- [ ] Matching skills displayed correctly
- [ ] Skills are case-insensitive

---

## ✅ 4. Smart Apply & Cover Letters

### Application Tracking
- [ ] "Apply Now" button works
- [ ] Opens job link in new tab
- [ ] Saves application to Firestore
- [ ] Application appears in "My Applications" section
- [ ] Shows correct job details
- [ ] Shows "Applied" status

### AI Cover Letter Generation
- [ ] Cover letter generates successfully
- [ ] Takes ~5-10 seconds to generate
- [ ] Cover letter is relevant to job
- [ ] Includes job title and company
- [ ] Professional tone
- [ ] Under 250 words
- [ ] Can copy/download cover letter

### Error Handling
- [ ] Handles OpenAI API errors
- [ ] Shows error if generation fails
- [ ] Handles missing job description

---

## ✅ 5. Resume Builder

### Data Entry
- [ ] Resume builder loads correctly
- [ ] Personal info fields work (name, email, phone, location, LinkedIn, website)
- [ ] Summary textarea works
- [ ] Can add work experience entries
- [ ] Can remove work experience entries
- [ ] Can add education entries
- [ ] Can remove education entries
- [ ] Skills field works (comma-separated)
- [ ] "Current role" checkbox works (disables end date)

### Profile Pre-population
- [ ] Email auto-fills from Firebase auth
- [ ] Name auto-fills from Firebase auth
- [ ] Location auto-fills from profile
- [ ] Skills auto-fill from profile

### Resume Upload
- [ ] "Upload .TXT" button visible
- [ ] Can select .txt file
- [ ] Shows "Uploading..." state
- [ ] File uploads successfully
- [ ] AI parses resume correctly
- [ ] All fields populate from parsed data
- [ ] Shows success message
- [ ] Error if non-.txt file uploaded

### Save & Load
- [ ] Can save resume
- [ ] Resume persists after page refresh
- [ ] Can edit saved resume
- [ ] Updates save correctly

### PDF Export
- [ ] "Download PDF" button works
- [ ] PDF generates successfully
- [ ] PDF includes all sections: header, summary, experience, education, skills
- [ ] PDF formatting looks professional
- [ ] Automatic page breaks work
- [ ] Downloads with correct filename (Name_Resume.pdf)

---

## ✅ 6. Interview Coach

### Session Start
- [ ] Interview coach page loads
- [ ] Can select interview type (general, behavioral, technical)
- [ ] Can select target role (from profile or custom)
- [ ] "Start Interview" button works

### Chat Interface
- [ ] AI generates first question
- [ ] Can type answer
- [ ] Can send answer
- [ ] AI provides feedback
- [ ] AI asks follow-up question
- [ ] Chat history displays correctly
- [ ] Scrolls to latest message

### Interview Types
- [ ] General interview asks appropriate questions
- [ ] Behavioral interview uses STAR format
- [ ] Technical interview asks role-specific questions

### Error Handling
- [ ] Handles OpenAI API errors
- [ ] Shows error if chat fails
- [ ] Can restart interview

---

## ✅ 7. Dashboard

### Data Display
- [ ] Dashboard loads correctly
- [ ] Shows profile completion percentage
- [ ] Shows jobs queued (if any)
- [ ] Shows interviews scheduled (if any)

### Navigation
- [ ] All sidebar links work:
  - [ ] Command Center (dashboard)
  - [ ] My Profile
  - [ ] Job Search (scrolls to job section)
  - [ ] My Applications (scrolls to applications)
  - [ ] Resume Builder
  - [ ] Interview Coach
  - [ ] Settings
- [ ] Logout button works

### Applications Section
- [ ] Shows all applied jobs
- [ ] Displays job title, company, location
- [ ] Shows application status
- [ ] Shows applied date
- [ ] "View Job" link works

### Analytics
- [ ] Shows correct number of applications sent
- [ ] Shows responses received (if any)
- [ ] Shows interviews booked (if any)

---

## ✅ 8. UI/UX Issues

### Responsiveness
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768px width)
- [ ] Works on mobile (375px width)

### Visual Issues
- [ ] No broken layouts
- [ ] No overlapping text
- [ ] Colors are consistent
- [ ] Fonts load correctly
- [ ] Icons display correctly
- [ ] Buttons are clickable
- [ ] Loading states work

### Performance
- [ ] Pages load quickly (<2s)
- [ ] No console errors
- [ ] No 404 errors
- [ ] Images load correctly
- [ ] Animations are smooth

---

## ✅ 9. Error Scenarios

### Network Issues
- [ ] Handles slow network gracefully
- [ ] Shows loading states
- [ ] Timeout errors handled

### API Failures
- [ ] JSearch API failure handled
- [ ] OpenAI API failure handled
- [ ] Firebase errors handled

### Data Issues
- [ ] Handles missing profile data
- [ ] Handles empty search results
- [ ] Handles malformed data

---

## ✅ 10. Security & Data

### Firebase Security
- [ ] Users can only access their own data
- [ ] Can't read other users' profiles
- [ ] Can't modify other users' applications
- [ ] Firebase rules protect sensitive data

### API Keys
- [ ] JSEARCH_API_KEY works (not expired)
- [ ] OPENAI_API_KEY works (not expired)
- [ ] Firebase keys valid
- [ ] No API keys exposed in client code

### Data Persistence
- [ ] Profile saves correctly in Firestore
- [ ] Resume saves correctly in Firestore
- [ ] Applications save correctly in Firestore
- [ ] Data persists after logout/login

---

## 🐛 Known Issues to Fix

Document any issues you find during testing:

### Critical (Must fix before Stripe):
1. 

### Medium (Should fix soon):
1. 

### Low (Nice to have):
1. 

---

## 📊 Test Results Summary

- **Total Tests:** [ ] / [ ]
- **Passed:** [ ]
- **Failed:** [ ]
- **Blocked:** [ ]

**Ready for Stripe Integration?** [ ] YES / [ ] NO

---

## 🔍 Additional Testing Notes

Use this space to document any observations, edge cases, or improvements needed:

```
[Your notes here]
```
