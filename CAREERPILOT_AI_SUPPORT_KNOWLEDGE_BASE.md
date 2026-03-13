# CareerPilot AI™ – Customer Technical Support Knowledge Base

**Product:** CareerPilot AI™  
**Purpose:** Technical Support for End Users  
**Version:** 1.1  
**Last Updated:** March 12, 2026  
**For Use By:** TechSupport AI™, Customer Support Team

---

## TechSupport AI™ Escalation Framework

**Three-Tier Support System:**

### **Level 1: Basic Technical Support (AI-Automated)**
**Handles:** Simple, straightforward questions with clear solutions
- Account setup and login
- Basic feature usage
- Navigation questions
- Credit information
- Browser compatibility

**Resolution Time:** Immediate (AI response)

**Examples:**
- "How do I sign up?"
- "Where do I find my credit balance?"
- "Which browsers are supported?"
- "How do I export my resume to PDF?"

---

### **Level 2: Complex Technical Support (AI-Advanced)**
**Handles:** Multi-step troubleshooting requiring diagnosis
- Technical issues with multiple potential causes
- Feature not working as expected
- Data not saving or displaying correctly
- Performance issues
- Integration problems

**Resolution Time:** 2-5 minutes (AI diagnosis + solution)

**Examples:**
- "I'm getting 0% fit scores on all jobs"
- "My resume fields keep disappearing"
- "PDF export shows blank pages"
- "Cover letter generation is very slow"
- "Interview coach responses are cut off"

**Escalate to Level 2 when:**
- Level 1 troubleshooting steps don't resolve the issue
- User has tried basic solutions (refresh, clear cache, different browser)
- Issue requires technical diagnosis or multi-step resolution
- Multiple symptoms present simultaneously
- User reports consistent/reproducible bug

---

### **Level 3: Human Support via Slack (Human Agent)**
**Handles:** Issues requiring human judgment, engineering, or manual intervention
- Billing disputes and payment processing errors
- Account security concerns
- Data deletion/export requests (GDPR compliance)
- Bug confirmation requiring code review
- Feature requests and product feedback
- Legal or compliance inquiries
- Subscription cancellation with refund requests
- Issues not resolved by Level 1 or Level 2

**Resolution Time:** 1-24 hours (depending on complexity)

**Examples:**
- "I was charged twice for the same subscription"
- "I need to delete my account and all data (GDPR request)"
- "My payment keeps failing but my card is valid"
- "The AI generated inappropriate content in my cover letter"
- "I found a security vulnerability"

**Escalate to Level 3 (Human via Slack) when:**
- ✅ All AI troubleshooting exhausted (both Level 1 & 2)
- ✅ Financial/billing dispute requiring manual review
- ✅ Account security or privacy concern
- ✅ Legal request (GDPR, data export, account deletion)
- ✅ Bug confirmation needed (potential code issue)
- ✅ Payment processing error persists after troubleshooting
- ✅ User explicitly requests human support
- ✅ Sensitive personal information involved
- ✅ Issue affects multiple users (potential system-wide problem)
- ✅ Feature request or product feedback

**Escalation Message Template:**
```
🔼 ESCALATING TO LEVEL 3 (Human Support)

Issue Summary: [Brief description]
User Email: [user@example.com]
Troubleshooting Attempted:
  - [Step 1]
  - [Step 2]
  - [Step 3]
  
Reason for Escalation: [Why AI cannot resolve]
Urgency: [Low/Medium/High]

This issue has been forwarded to our human support team via Slack.
Expected response time: 1-24 hours.
```

---

## Table of Contents

1. [Getting Started](#getting-started) **(Level 1)**
2. [Account & Authentication Issues](#account--authentication-issues) **(Level 1-2)**
3. [Profile Setup Problems](#profile-setup-problems) **(Level 1-2)**
4. [Job Search Issues](#job-search-issues) **(Level 2)**
5. [Resume Builder Problems](#resume-builder-problems) **(Level 2)**
6. [Cover Letter Generation Issues](#cover-letter-generation-issues) **(Level 2)**
7. [Interview Coach Problems](#interview-coach-problems) **(Level 2)**
8. [Application Tracking Issues](#application-tracking-issues) **(Level 1-2)**
9. [Credit & Billing Problems](#credit--billing-problems) **(Level 1-3)**
10. [Browser & Device Issues](#browser--device-issues) **(Level 1-2)**
11. [Common Error Messages](#common-error-messages) **(Level 1-2)**
12. [How-To Guides](#how-to-guides) **(Level 1)**
13. [Escalation Scenarios & Examples](#escalation-scenarios--examples) **(Level 2-3)**

---

## 1. Getting Started

### How do I sign up for CareerPilot AI?

**Steps:**
1. Go to https://career-pilot-ai-gamma.vercel.app/
2. Click "Sign Up" in the top right corner
3. Enter your email address
4. Create a password (minimum 6 characters)
5. Click "Create Account"
6. You'll be automatically redirected to profile setup

**Troubleshooting:**
- **"Email already exists"**: This email is already registered. Try signing in instead or use the "Forgot Password" link.
- **Password too weak**: Use at least 6 characters with a mix of letters and numbers.
- **Page won't load**: Clear your browser cache or try a different browser.

---

### How do I sign in?

**Steps:**
1. Go to https://career-pilot-ai-gamma.vercel.app/login
2. Enter your email address
3. Enter your password
4. Click "Sign In"

**Troubleshooting:**
- **"Invalid email or password"**: Double-check your email and password. Passwords are case-sensitive.
- **Forgot password**: Click "Forgot Password" and follow the email instructions (feature coming soon).
- **Account locked**: After multiple failed attempts, wait 15 minutes and try again.

---

### How do I reset my password?

**Current Status:** Password reset feature is currently in development.

**Workaround:**
1. Contact support at support@careerpilot.ai (if available)
2. Create a new account with a different email address

**Coming Soon:** Self-service password reset via email

---

### How do I sign out?

**Steps:**
1. Click your profile icon in the top right corner
2. Click "Sign Out"
3. You'll be redirected to the home page

**Note:** You'll need to sign in again to access your dashboard.

---

## 2. Account & Authentication Issues

### I can't sign in to my account

**Common Causes:**

**1. Wrong email or password**
- **Solution:** Double-check your email (no extra spaces). Passwords are case-sensitive.
- **Tip:** Copy and paste your password to avoid typos.

**2. Browser remembering old password**
- **Solution:** Clear your browser's saved passwords and try again.
- **Chrome:** Settings → Passwords → Remove saved password
- **Safari:** Preferences → Passwords → Remove entry

**3. Account doesn't exist**
- **Solution:** You may not have completed signup. Try creating a new account.

**4. Cookies disabled**
- **Solution:** Enable cookies in your browser settings. CareerPilot AI requires cookies to keep you signed in.

---

### I'm signed out automatically

**Common Causes:**

**1. Session expired**
- **Why:** For security, sessions expire after 24 hours of inactivity.
- **Solution:** Sign in again. Your data is saved.

**2. Cleared browser data**
- **Why:** Clearing cookies signs you out.
- **Solution:** Sign in again.

**3. Private/Incognito mode**
- **Why:** Private browsing doesn't maintain sessions after closing.
- **Solution:** Use regular browsing mode for persistent login.

---

### My email isn't receiving verification emails

**Current Status:** Email verification is not currently required.

**If you're not receiving other emails (future feature):**
1. Check your spam/junk folder
2. Add noreply@careerpilot.ai to your contacts
3. Wait 5-10 minutes (emails can be delayed)
4. Check if you typed your email correctly in your profile

---

## 3. Profile Setup Problems

### I'm stuck on profile setup

**Required Fields:**
- Target Role (e.g., "Software Engineer")
- Location (e.g., "San Francisco, CA")
- Years of Experience (0-50)
- Skills (at least 3 skills, comma-separated)

**Common Issues:**

**1. "Please fill out all required fields"**
- **Solution:** All four fields above must be filled. Check for empty fields.

**2. Skills not saving**
- **Solution:** Use comma-separated format: `React, Node.js, Python`
- **Wrong:** "I know React Node.js and Python"
- **Right:** "React, Node.js, Python"

**3. Location not recognized**
- **Solution:** Use format: "City, State" or "City, Country"
- **Examples:** "London, UK" or "Toronto, Canada"

---

### I selected a non-English country and see a warning

**What You're Seeing:**
A modal saying "Limited Support for [Country]"

**What This Means:**
- We currently have **zero jobs** available in non-English speaking countries
- All platform content is in **English only**
- You can only search for **English-speaking roles**

**Your Options:**

**Option 1: Change to English-speaking country**
- Click "← Change Country"
- Select: US, UK, Canada, Australia, Ireland, New Zealand, Singapore, UAE, or India

**Option 2: Continue anyway**
- Click "I Understand, Continue Anyway"
- You can still use the platform, but job search results will be limited
- You'll need to search for English-speaking positions in your region

**Supported Countries (Full Job Access):**
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇮🇪 Ireland
- 🇳🇿 New Zealand
- 🇸🇬 Singapore
- 🇦🇪 United Arab Emirates
- 🇮🇳 India

---

### How do I edit my profile after setup?

**Steps:**
1. Go to your Dashboard
2. Click "Build/Refine Profile" tile
3. Or navigate to your profile icon → "Edit Profile"
4. Make your changes
5. Click "Save Profile"

**You Can Edit:**
- Target role
- Location
- Years of experience
- Skills (use the dedicated skills editor for best results)

---

### How do I update my skills?

**Best Method:**
1. Go to Dashboard
2. Click "Build/Refine Profile"
3. Click "Update Skills" or navigate to `/profile/update-skills`
4. Enter skills as comma-separated list: `JavaScript, React, Python`
5. Click "Save Skills"

**Important Tips:**
- Use **short skill names** (1-3 words each)
- Separate with commas
- Be specific: "React" not "Front-end frameworks"
- Include 5-15 skills for best job matching

**Examples:**
- ✅ Good: "Product Management, Agile, SQL, Tableau, Stakeholder Management"
- ❌ Bad: "I have experience in product management with agile methodologies"

---

## 4. Job Search Issues

### I'm getting 0% fit scores on all jobs

**Most Common Cause:** Skills format is incorrect

**Solution:**
1. Go to `/profile/update-skills`
2. Check your skills format
3. Should be: `Skill1, Skill2, Skill3`
4. NOT: Long sentences or paragraphs

**Example Problem:**
```
Skills: "I have 5 years of experience in software development 
using Java, Python, and various frameworks"
```

**Solution:**
```
Skills: Java, Python, Spring Boot, Django, REST APIs
```

After fixing, re-run your job search.

---

### No jobs are showing up

**Common Causes:**

**1. Profile incomplete**
- **Check:** Go to Dashboard and verify all profile fields are filled
- **Solution:** Complete target role, location, and skills

**2. Too specific target role**
- **Problem:** "Senior Principal Staff Software Architect Level 5"
- **Solution:** Simplify to "Software Engineer" or "Software Architect"

**3. Location too specific**
- **Problem:** "Small Town, Rural State"
- **Solution:** Use nearest major city or just state/country

**4. API temporarily down**
- **Check:** Wait 2-3 minutes and try again
- **If persistent:** Contact support

**5. Geographic limitations**
- **Check:** Are you in a supported country?
- **Solution:** See Profile Setup → Non-English Country section

---

### Job locations don't match my preference

**Why This Happens:**
The job search API returns jobs based on your **target role** and **general location**, but may show nearby opportunities.

**Examples:**
- Search: "San Francisco, CA" → Shows: "San Jose, CA" or "Oakland, CA"
- Search: "London, UK" → Shows: "London" or "Remote UK"

**This is Normal:** Many jobs are in metro areas or remote.

**To Filter:**
1. Look at the location for each job
2. Focus on fit score and matching skills
3. Check if remote work is mentioned in the description

---

### Fit scores seem incorrect

**How Fit Scores Work:**
Fit Score = (Your Matching Skills / Your Total Skills) × 100

**Example:**
- Your Skills: React, Node.js, Python, AWS, Docker (5 total)
- Job Mentions: React, Python, AWS (3 matching)
- Fit Score: 3/5 = 60%

**Why Scores May Seem Low:**

**1. Job description doesn't explicitly mention your skills**
- The job needs "JavaScript framework" but doesn't say "React"
- **Normal:** Job descriptions vary in specificity

**2. You have many niche skills**
- You list 20 skills, but job only mentions 5
- **Fix:** Focus your skills list on most relevant/marketable skills

**3. Skills are too generic**
- Your skill: "Programming"
- Job mentions: "Python"
- **Fix:** Use specific skill names: "Python, Java, C++"

---

### Jobs are irrelevant to my target role

**Common Causes:**

**1. Target role is too broad**
- **Problem:** "Engineer" returns all types of engineers
- **Solution:** Be specific: "Software Engineer" or "Mechanical Engineer"

**2. Skills don't match target role**
- **Problem:** Target role: "Product Manager", Skills: "Java, Python, React"
- **Solution:** Update skills to match role: "Product Strategy, Agile, Roadmapping"

**3. Target role uses uncommon title**
- **Problem:** "Agile Delivery Lead" (company-specific title)
- **Solution:** Use industry-standard: "Project Manager" or "Scrum Master"

---

### Job dates show "Invalid Date" or "Recently"

**Why This Happens:**
Some job postings don't include a posted date from the job board.

**What "Recently" Means:**
- The job was posted within the last few weeks
- Still likely to be active

**Not a Bug:** This is normal for some job sources. You can still apply!

---

## 5. Resume Builder Problems

### My resume data isn't saving

**Common Causes:**

**1. Not clicking "Save Resume"**
- **Solution:** Always click the green "Save Resume" button at the bottom before leaving the page

**2. Session expired**
- **Solution:** If you've been idle 20+ minutes, sign out and back in, then try again

**3. Browser blocking storage**
- **Check:** Are you in private/incognito mode?
- **Solution:** Use regular browsing mode

**4. Internet connection lost**
- **Solution:** Check your connection and try saving again

**Verification:**
- After saving, refresh the page
- Your data should still be there
- If not, there's a saving issue

---

### Resume fields are disappearing

**1. Using special characters**
- **Problem:** Characters like `<`, `>`, `&` can cause issues
- **Solution:** Use plain text or replace with alternatives

**2. Extremely long text**
- **Problem:** Descriptions over 5000 characters
- **Solution:** Keep descriptions concise (200-500 words per job)

**3. Copy-pasting from Word/PDF**
- **Problem:** Hidden formatting can cause issues
- **Solution:** Paste as plain text (Ctrl+Shift+V) or retype

---

### PDF export isn't working

**Common Causes:**

**1. Popup blocked**
- **Symptom:** Nothing happens when you click "Export PDF"
- **Solution:** Allow popups for careerpilot.ai in your browser
- **Chrome:** Click the popup icon in address bar → "Always allow"

**2. Browser compatibility**
- **Problem:** Using outdated browser
- **Solution:** Update to latest Chrome, Firefox, Safari, or Edge

**3. Missing required fields**
- **Problem:** Name or other critical fields are empty
- **Solution:** Fill in at least: Full Name, Email, and one Experience or Education entry

**4. PDF shows blank pages**
- **Problem:** Content is too long
- **Solution:** Shorten descriptions in Work Experience section

---

### PDF formatting looks wrong

**Common Issues:**

**1. Text overflowing**
- **Cause:** Very long job descriptions
- **Solution:** Break into bullet points or shorten

**2. Skills section too wide**
- **Cause:** 50+ skills listed
- **Solution:** Focus on top 10-15 most relevant skills

**3. Spacing looks odd**
- **Normal:** The PDF uses standard professional formatting
- **Not customizable yet:** Template customization is a future feature

---

### Can't add multiple work experiences

**Steps:**
1. Fill out the first experience completely
2. Scroll down
3. Click "+ Add Experience" button
4. A new blank experience section will appear
5. Fill it out
6. Repeat as needed

**Troubleshooting:**
- **Button not showing:** Scroll to the very bottom of the current experience
- **Can't remove:** Click the "Remove" button on the specific experience you want to delete

---

### "Current role" checkbox not working

**What It Does:**
When checked, sets End Date to "Present" automatically

**Steps:**
1. Check the "I currently work here" checkbox
2. The end date field will be disabled
3. PDF will show "[Start Date] - Present"

**To Change:**
1. Uncheck the box
2. End date field becomes editable again

---

### How many experiences/education entries can I add?

**Limits:**
- Work Experience: Up to 10 entries
- Education: Up to 5 entries
- Skills: Recommended 5-15 (no hard limit)

**Best Practice:**
- Include last 10-15 years of experience
- Focus on most relevant roles
- Older/irrelevant jobs can be summarized or omitted

---

## 6. Cover Letter Generation Issues

### Cover letter generation is slow

**Normal Wait Times:**
- Typical: 3-5 seconds
- During high traffic: 5-10 seconds

**If Taking Longer (>15 seconds):**
1. Check your internet connection
2. Wait up to 30 seconds (AI generation can take time)
3. If it times out, click "Smart Apply" again

**Why It Takes Time:**
AI needs to:
1. Read your resume
2. Read the job description
3. Generate personalized content
4. This is more thoughtful than instant templates!

---

### Cover letter doesn't match the job

**Common Causes:**

**1. Incomplete resume**
- **Problem:** Resume has minimal information
- **Solution:** Complete your resume with detailed experience and skills

**2. Generic job description**
- **Problem:** Job description is very short or vague
- **Solution:** AI does its best, but you may need to customize manually

**3. Resume and job are unrelated**
- **Problem:** Applying to jobs outside your experience
- **Solution:** AI will try to find connections, but results may be generic

---

### Cover letter has placeholder text

**Examples:**
- "[Your Name]"
- "[Date]"
- "[Company Name]"

**This Should NOT Happen.** If you see this:

**Solution:**
1. Click "Smart Apply" again to regenerate
2. Make sure your resume has your full name
3. If it persists, copy the letter and manually replace placeholders

**Report:**
This is a bug. Note which job it happened on and contact support.

---

### Cover letter is too generic

**Why This Happens:**
- Job description lacks specific details
- Your resume is very broad
- Role is very common (e.g., "Customer Service")

**How to Improve:**
1. **Enhance your resume:** Add specific achievements and metrics
2. **Use resume details:** Add projects, technologies, specific accomplishments
3. **Manual editing:** Use the generated letter as a starting point and customize

**Future Feature:** Cover letter tone/style customization

---

### Can I regenerate a different cover letter?

**Current Behavior:**
Each "Smart Apply" generates a new letter for that specific job.

**To Get a Different Version:**
1. Click "Smart Apply" on the same job again
2. A new letter will be generated (may be similar but with variations)
3. Compare and use the one you prefer

**Note:** Letters are not saved automatically yet. Copy/save any version you want to keep.

---

### How do I copy the cover letter?

**Steps:**
1. Click "Smart Apply" on a job
2. Wait for the cover letter to generate
3. The letter appears in a modal/popup
4. **Select all text:** Click inside and press Ctrl+A (Windows) or Cmd+A (Mac)
5. **Copy:** Ctrl+C (Windows) or Cmd+C (Mac)
6. Paste into your job application

**Tip:** You can also select specific paragraphs to copy parts.

---

## 7. Interview Coach Problems

### Interview coach won't start

**Common Causes:**

**1. No interview type selected**
- **Solution:** Click one of the three types: General, Behavioral, or Technical

**2. Profile incomplete**
- **Problem:** Target role is missing
- **Solution:** Complete your profile first (Dashboard → Build/Refine Profile)

**3. Browser JavaScript disabled**
- **Solution:** Enable JavaScript in browser settings

**4. Page not fully loaded**
- **Solution:** Wait for page to finish loading (see loading spinner disappear)

---

### AI responses are very slow

**Normal Wait Times:**
- First response: 3-5 seconds
- Follow-up responses: 2-4 seconds

**If Taking Longer:**
1. Check your internet connection
2. Wait up to 15 seconds before retrying
3. If timeout occurs, type your message again

**During Peak Hours:**
Responses may take 5-7 seconds. This is normal when many users are online.

---

### AI responses are cut off or incomplete

**Common Causes:**

**1. Very long questions**
- **Problem:** You wrote 500+ word responses
- **Solution:** Keep answers to 100-200 words for better flow

**2. Connection interrupted**
- **Solution:** Check your internet and send message again

**3. Token limit reached**
- **Rare:** After very long conversations (20+ exchanges)
- **Solution:** Click "Restart Interview" to start fresh

---

### Interview coach keeps asking the same questions

**Why This Happens:**
The AI may circle back to similar topics if:
1. Your answers are very brief
2. You haven't fully addressed the question
3. The conversation is naturally exploring a theme

**This is Normal:** Real interviews often have follow-up questions on the same topic.

**If Truly Repetitive:**
- Click "Restart Interview"
- Try a different interview type
- Give more detailed answers to move the conversation forward

---

### Can I practice for a specific company?

**Current Capability:**
The interview coach focuses on your **target role**, not specific companies.

**Best Practice:**
1. Select interview type that matches company's style
   - Startups → General or Technical
   - Large corps → Behavioral
2. Mention the company in your answers to get relevant feedback
3. Use job-specific keywords in responses

**Future Feature:** Company-specific interview preparation

---

### How do I save my interview practice session?

**Current Status:** Sessions are not automatically saved.

**Workaround:**
1. Take notes during the practice
2. Copy important feedback
3. Screenshot the conversation
4. Use browser history if you need to revisit (may timeout after 24 hours)

**Coming Soon:** Interview session history and saved transcripts

---

### Interview coach doesn't understand my industry

**Why This Happens:**
The AI is trained on general interview practices and may not know niche industry terms.

**Solutions:**

**1. Use common terms**
- Instead of: "SDLC methodology in an Agile SAFe framework"
- Try: "Agile project management"

**2. Provide context**
- "In my field (healthcare IT), we..."
- This helps the AI understand your specific domain

**3. Choose appropriate interview type**
- **Technical** is best for role-specific questions
- **General** is best for industry overview questions

---

## 8. Application Tracking Issues

### My applications aren't showing up

**Where to Check:**
Dashboard → "Applications Sent" or "Campaign Analytics" section

**Common Causes:**

**1. Didn't use "Smart Apply"**
- **Problem:** You clicked the job link but didn't click "Smart Apply" in CareerPilot
- **Solution:** Applications are only tracked when you use "Smart Apply" feature

**2. Application just submitted**
- **Problem:** Can take 5-10 seconds to appear
- **Solution:** Refresh your dashboard

**3. Signed in with different account**
- **Problem:** Used a different email to sign up
- **Solution:** Sign out and sign in with the correct account

---

### Application status isn't updating

**Current Feature Status:**
Application statuses must be **manually updated** for now.

**How to Update:**
1. Go to your applications list
2. Find the application
3. Click on it to edit
4. Change status: Applied → In Review → Interview → Offer/Rejected
5. Save changes

**Coming Soon:** Automatic status detection from email

---

### Can't find a specific application

**Search Tips:**
1. Check the date you applied (sort by date)
2. Search by company name (if search is available)
3. Check if you're looking at the right status filter

**If Still Missing:**
It may not have been tracked. Use "Smart Apply" feature going forward.

---

### How do I delete an application?

**Current Status:** Application deletion is not currently available.

**Workaround:**
1. Change the status to "Rejected" or "Closed"
2. This effectively archives it

**Why:** We keep applications for your analytics and history.

---

## 9. Credit & Billing Problems

### How many credits do I have?

**Where to Check:**
1. Dashboard → Top of page (credit balance)
2. Or Profile icon → "Credits: XX"

**Credit Balance Shows:**
- Total available credits
- Includes both subscription credits and any purchased top-ups

---

### What uses credits?

**Credit Costs:**
- 🔍 **Job Search:** 8 credits (returns 10 matched jobs)
- ✉️ **Cover Letter:** 15 credits (per letter generated)
- 🎯 **Interview Practice:** 25 credits (per session)
- 📄 **Resume Builder:** 0 credits (always FREE, unlimited use)

**Note:** Every action deducts credits immediately when used.

---

### I'm out of credits - what can I do?

**Options:**

**1. Wait for monthly reset (Subscription users)**
- Free Plan: Resets on the 1st of each month (40 credits)
- Starter Plan ($39/month): Resets on billing date (500 credits)
- Pro Plan ($99/month): Resets on billing date (1,200 credits)

**2. Purchase credit top-ups (Available now or coming soon)**
- Small Pack: $15 for 200 credits
- Medium Pack: $40 for 600 credits
- Large Pack: $90 for 1,500 credits
- **Top-up credits NEVER expire**

**3. Upgrade your subscription**
- Upgrade from Free to Starter or Pro for more monthly credits

---

### Do unused credits roll over?

**Subscription Credits:** ❌ NO ROLLOVER
- Credits reset every month on your billing date
- Unused credits are forfeited
- Example: If you have 100 credits left on March 31st, they disappear on April 1st

**Top-Up Credits:** ✅ NEVER EXPIRE
- Credits purchased separately never expire
- They stay in your account forever
- Used only after subscription credits are depleted

**Example:**
```
Month 1:
- Subscription: 500 credits
- Top-up: 200 credits
- Used: 600 credits
- Remaining: 100 top-up credits (saved)

Month 2:
- Subscription: 500 credits (refreshed)
- Top-up: 100 credits (carried over from Month 1)
- Total: 600 credits
```

---

### How do I upgrade my plan?

**Current Status:** Self-service plan changes coming soon with Stripe integration.

**For Now:**
Contact support to upgrade from:
- Free → Starter ($39/month)
- Free → Pro ($99/month)
- Starter → Pro ($99/month)

**Coming Soon:** One-click upgrades in dashboard

---

### How do I cancel my subscription?

**Current Status:** Self-service cancellation coming soon.

**For Now:**
Contact support to cancel. 

**What Happens:**
- You keep access until end of current billing period
- Credits remain available until period ends
- Top-up credits never expire, even after cancellation

---

### Payment failed - what do I do?

**Common Causes:**

**1. Card declined**
- Check with your bank
- Verify card details are correct
- Try a different payment method

**2. Insufficient funds**
- Ensure card has sufficient balance

**3. International card blocked**
- Some banks block international transactions
- Contact your bank to authorize

**4. Expired card**
- Update your payment method

**Where to Update Payment:**
Profile → Billing → Update Payment Method (coming soon)

---

### I was charged but didn't receive credits

**Steps:**
1. Wait 5-10 minutes (processing can take time)
2. Sign out and sign back in
3. Check your credit balance
4. If still missing after 30 minutes, contact support with:
   - Transaction ID
   - Amount charged
   - Date and time

**Note:** Keep your payment confirmation email as proof.

---

## 10. Browser & Device Issues

### Which browsers are supported?

**Fully Supported:**
- ✅ Chrome (latest version)
- ✅ Firefox (latest version)
- ✅ Safari (latest version)
- ✅ Edge (latest version)

**Not Supported:**
- ❌ Internet Explorer (any version)
- ❌ Very old browser versions (3+ years old)

**Recommendation:** Always use the latest browser version for best experience.

---

### Mobile/tablet compatibility

**Current Status:**
- ✅ Mobile browser access works
- ✅ Responsive design for most features
- ⚠️ Some features work better on desktop

**Best Experience:**
- **Desktop:** Resume builder, interview coach (typing-heavy)
- **Mobile:** Job search, application tracking, viewing cover letters

**Mobile App:** Coming in 2027

---

### Page is loading slowly

**Common Causes:**

**1. Slow internet connection**
- **Test:** Visit other websites to check speed
- **Solution:** Connect to faster WiFi or wait for better connection

**2. Large resume/data**
- **Problem:** Very detailed resume with 10+ jobs
- **Normal:** First load may take 3-5 seconds

**3. Many browser tabs open**
- **Solution:** Close unnecessary tabs to free up memory

**4. Browser cache full**
- **Solution:** Clear browser cache (see Browser Issues section)

---

### Features not working properly

**First Steps:**

**1. Refresh the page**
- Press F5 (Windows) or Cmd+R (Mac)
- Or click refresh button in browser

**2. Clear cache and cookies**

**Chrome:**
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files" and "Cookies"
3. Click "Clear data"

**Safari:**
1. Safari → Preferences → Privacy
2. Click "Manage Website Data"
3. Remove careerpilot.ai data

**Firefox:**
1. Press Ctrl+Shift+Delete
2. Select everything
3. Click "Clear Now"

**3. Try incognito/private mode**
- This tests if extensions are interfering
- If it works in incognito, disable browser extensions one by one

**4. Try different browser**
- Chrome vs. Firefox vs. Safari
- If it works in one, the issue is browser-specific

---

### JavaScript errors showing

**What You See:**
Error messages or console errors (press F12 to see developer console)

**Common Causes:**

**1. Browser extension blocking**
- **Solution:** Disable ad blockers, privacy extensions
- **Test:** Try in incognito mode

**2. Outdated browser**
- **Solution:** Update to latest version

**3. Actual bug**
- **Report:** Take screenshot and contact support

---

### Images/icons not loading

**Common Causes:**

**1. Slow connection**
- **Solution:** Wait a few seconds for images to load
- **Refresh:** Press F5

**2. Ad blocker**
- **Solution:** Whitelist careerpilot.ai in your ad blocker

**3. CDN issue**
- **Rare:** Image hosting may be temporarily down
- **Solution:** Try again in 5-10 minutes

---

### Copy/paste not working

**Common Issues:**

**1. Browser permissions**
- **Solution:** Allow clipboard access when prompted

**2. Using touchpad on Mac**
- **Solution:** Use keyboard shortcuts: Cmd+C to copy, Cmd+V to paste

**3. Protected content**
- Some fields may not allow paste for security
- **Solution:** Type manually

---

## 11. Common Error Messages

### "User not found"

**Where:** Usually after signing in

**Causes:**
1. Signed in with wrong email
2. Account was deleted
3. Never completed signup

**Solutions:**
1. Double-check email address
2. Try signup (not signin) if account doesn't exist
3. Contact support if you're sure account existed

---

### "Invalid email or password"

**Where:** Login page

**Solutions:**
1. Check email is spelled correctly (no spaces)
2. Verify password is correct (case-sensitive)
3. Try password reset (coming soon)
4. Make sure Caps Lock is off

---

### "Please complete your profile"

**Where:** When trying to access job search or other features

**What It Means:**
Your profile is missing required information.

**Solution:**
1. Go to Dashboard → "Build/Refine Profile"
2. Fill in all required fields:
   - Target Role
   - Location
   - Years of Experience
   - Skills (at least 3)
3. Click "Save Profile"
4. Try your action again

---

### "Insufficient credits"

**Where:** When trying to use job search, cover letter, or interview coach

**What It Means:**
You don't have enough credits for this action.

**Required Credits:**
- Job Search: 8 credits
- Cover Letter: 15 credits
- Interview Practice: 25 credits

**Solutions:**
1. Check your credit balance (Dashboard)
2. Wait for monthly reset (if you have subscription)
3. Purchase credit top-ups
4. Upgrade to higher plan

---

### "Service temporarily unavailable"

**Where:** Any feature

**What It Means:**
External service (job search API, AI service) is temporarily down.

**Solutions:**
1. Wait 2-3 minutes
2. Try again
3. If persists after 10 minutes, try again later
4. Contact support if issue lasts >1 hour

---

### "Session expired"

**Where:** After being inactive

**What It Means:**
For security, you were signed out after 24 hours of inactivity.

**Solution:**
1. Click "OK" or close the message
2. Sign in again
3. Your data is safe and saved

---

### "Failed to save"

**Where:** Resume builder, profile editor

**Causes:**
1. Internet connection lost
2. Server timeout
3. Invalid characters in text

**Solutions:**
1. Check internet connection
2. Try saving again
3. Copy your text (Ctrl+A, Ctrl+C) before refreshing
4. Remove special characters like `<` `>` `&`
5. Try saving individual sections if bulk save fails

---

### "Network error"

**Where:** Any action requiring server communication

**What It Means:**
Your browser can't reach our servers.

**Solutions:**
1. Check your internet connection
2. Disable VPN temporarily
3. Try different WiFi network
4. Check firewall isn't blocking
5. Wait a few minutes and try again

---

### "Invalid date format"

**Where:** Resume builder (experience dates)

**Solution:**
Use the date picker or format as: `YYYY-MM`
- ✅ Correct: `2023-06` or select June 2023 from picker
- ❌ Wrong: `June 2023`, `6/2023`, `06-23`

---

### "Resume not found"

**Where:** When trying to generate cover letter

**What It Means:**
You haven't created a resume yet, or it didn't save.

**Solution:**
1. Go to Dashboard → "Resume Builder"
2. Create your resume with at least:
   - Full name
   - Email
   - One work experience OR one education entry
3. Click "Save Resume"
4. Try generating cover letter again

---

## 12. How-To Guides

### How to conduct an effective job search

**Step-by-Step:**

**1. Complete your profile (one time)**
- Target role: Be specific ("Software Engineer" not "Tech job")
- Location: Use major cities for best results
- Skills: 5-15 specific, relevant skills
- Experience: Accurate years

**2. Run job search (8 credits)**
- Dashboard → "Find & Score Jobs"
- Review the 10 matched jobs
- Check fit scores and matching skills

**3. Review and shortlist**
- Focus on jobs with 60%+ fit score
- Read full job descriptions
- Click job titles to open in new tab

**4. Apply with Smart Apply (15 credits per job)**
- Click "Smart Apply" on shortlisted jobs
- Application link opens in new tab
- AI generates cover letter
- Copy cover letter for your application

**5. Track applications**
- Applications auto-tracked in your dashboard
- Update status as you progress

**Best Practices:**
- Run searches weekly for fresh jobs
- Apply to 5-10 jobs per session
- Higher fit scores = higher chances
- Customize cover letters before submitting

---

### How to build a strong resume

**Step-by-Step:**

**1. Start with personal info**
- Full legal name
- Professional email (yourname@email.com)
- Phone number (include country code for international)
- City, Country
- LinkedIn (optional but recommended)

**2. Write compelling summary (2-3 sentences)**
- Who you are professionally
- Key expertise/experience
- What you're seeking

Example:
```
"Results-driven Product Manager with 8 years of experience 
leading B2B SaaS products from concept to launch. Expertise 
in agile methodologies, data-driven decision making, and 
cross-functional team leadership."
```

**3. Add work experience (start with most recent)**
- Company name
- Job title
- Dates (use month/year format)
- Check "I currently work here" for present role
- Description: 3-5 bullet points of achievements
  - Use action verbs: "Led," "Managed," "Increased"
  - Include metrics: "Grew revenue by 40%"
  - Focus on impact, not just duties

**4. Add education**
- School/University name
- Degree earned
- Field of study
- Graduation date
- Don't include GPA unless very recent/relevant

**5. List skills**
- Include 10-15 most relevant skills
- Mix of technical and soft skills
- Be specific: "Python" not "Programming"
- Prioritize skills in demand for your target role

**6. Save and export**
- Click "Save Resume"
- Click "Export PDF" to download
- Review PDF before using in applications

**Tips:**
- Keep to 1-2 pages
- Use professional language
- Proofread carefully
- Update regularly as you gain experience

---

### How to practice interviews effectively

**Step-by-Step:**

**1. Choose the right interview type**
- **General:** First interviews, getting to know you, culture fit
- **Behavioral:** STAR method questions, past experiences
- **Technical:** Role-specific questions, problem-solving

**2. Set up your environment**
- Quiet space
- No distractions
- Speak answers out loud (not just type)
- Treat it like a real interview

**3. Start the practice session**
- Click interview type
- Click "Start Interview"
- Read AI coach's first question carefully

**4. Respond thoroughly**
- For behavioral: Use STAR method
  - **S**ituation: Set the context
  - **T**ask: Explain what needed to be done
  - **A**ction: Describe what YOU did
  - **R**esult: Share the outcome
- For technical: Think out loud
- For general: Be authentic and specific

**5. Learn from feedback**
- AI will give constructive feedback
- Note areas to improve
- Practice answers that feel weak
- Remember good answers for real interviews

**6. Do multiple sessions**
- Practice each type at least once
- Aim for 3-5 sessions before real interview
- Restart if you want fresh questions

**Best Practices:**
- Practice 2-3 days before real interview
- Time yourself (aim for 1-2 minute answers)
- Record yourself to review later (outside app)
- Focus on clarity and confidence

---

### How to manage your job search campaign

**Weekly Routine:**

**Monday:**
- Run new job search (8 credits)
- Review and shortlist 5-10 jobs
- Update target role or location if needed

**Tuesday-Thursday:**
- Apply to shortlisted jobs (15 credits each)
- Customize cover letters before submitting
- Practice interviews (25 credits per session)

**Friday:**
- Update application statuses
- Review progress in analytics
- Plan next week's targets

**Monthly:**
- Review what's working (which jobs got responses?)
- Adjust profile/skills based on market feedback
- Update resume with new accomplishments
- Check credit usage and upgrade if needed

**Success Metrics:**
- 5-10 applications per week
- 60%+ average fit score
- Track response rate (aim for 10-20%)
- 1-2 interviews per week (goal)

---

### How to maximize your free plan

**Free Plan Includes:**
- 40 credits per month
- Resume builder (unlimited, free)
- All job search features
- All AI features (within credit limit)

**Smart Usage (40 credits):**

**Option 1: Balanced approach**
- 2 job searches (16 credits) = 20 jobs viewed
- 1 cover letter (15 credits) = best opportunity
- 9 credits saved for next action

**Option 2: High-volume applying**
- 1 job search (8 credits) = 10 jobs
- 2 cover letters (30 credits) = 2 applications
- 2 credits remaining

**Option 3: Interview prep focus**
- 1 job search (8 credits)
- 1 interview session (25 credits)
- 7 credits remaining

**Maximizing Free Credits:**

**1. Perfect your profile first (free)**
- Spend time on skills
- Be very specific with target role
- This improves fit scores

**2. Use resume builder extensively (free)**
- Build multiple versions for different roles
- No credit cost
- Export as many PDFs as you want

**3. Be selective with job searches**
- Don't search daily
- Wait until you're ready to apply
- Each search = 8 credits

**4. Choose cover letter jobs wisely**
- Generate for jobs 70%+ fit score
- Or jobs you REALLY want
- 15 credits = significant portion of free plan

**5. Time your upgrade**
- When you're actively applying (need >40 credits/month)
- Not worth upgrading if casual browsing

**When to Upgrade:**
- Need 3+ cover letters/month → Starter ($39)
- Intensive search (10+ applications) → Pro ($99)
- Interview coaching weekly → Pro ($99)

---

### How to get the best fit scores

**Fit Score Formula:**
(Your Matching Skills / Your Total Skills) × 100%

**Optimization Strategies:**

**1. Curate your skills list**
❌ Bad: List every skill you've ever touched (20+ skills)
- Results in low fit scores because jobs only mention a few

✅ Good: List 5-10 core, in-demand skills
- Higher match rate with job postings
- More accurate fit scores

**Example:**
- Instead of: Python, Django, Flask, FastAPI, SQLAlchemy, Pandas, NumPy, Jupyter, Git, Docker, Kubernetes, AWS, Linux, REST, GraphQL (15 skills)
- Use: Python, Django, REST APIs, Docker, AWS (5 skills)
- Result: Much higher fit percentage

**2. Use job posting language**
- Research your target role on job boards
- Note commonly mentioned skills
- Use exact same terms in your profile

Example for "Product Manager":
- Job postings say: "Product Roadmapping," "Stakeholder Management," "Agile"
- Your skills should match: Use these exact terms

**3. Be specific, not generic**
❌ "Programming" → ✅ "Python, JavaScript"
❌ "Databases" → ✅ "PostgreSQL, MongoDB"
❌ "Cloud" → ✅ "AWS, Azure"

**4. Match skills to target role**
If target role is "Frontend Developer":
- ✅ Include: React, TypeScript, CSS, HTML, JavaScript
- ❌ Don't include: Photoshop, Excel, Public Speaking
- Even if you have these skills, they dilute fit score

**5. Update skills based on results**
- Getting 0-20% fit scores? Skills might be wrong
- Getting 80-100% on irrelevant jobs? Too generic
- Aim for 50-70% on relevant jobs = perfect balance

**Target Fit Scores:**
- 70-100%: Excellent match, apply immediately
- 50-69%: Good match, worth applying
- 30-49%: Possible match, read carefully
- 0-29%: Poor match, probably not worth it

---

## Troubleshooting Summary

### Quick Diagnostic Questions

**If something isn't working, ask yourself:**

1. **Did I complete my profile?**
   - Target role, location, experience, skills all filled?

2. **Am I signed in?**
   - Check for your name/profile icon in top right

3. **Do I have credits?**
   - Check credit balance in dashboard

4. **Is my internet working?**
   - Try loading another website

5. **Is my browser up to date?**
   - Chrome, Firefox, Safari, Edge (latest version)

6. **Did I try refreshing the page?**
   - F5 or Cmd+R

7. **Did I clear my cache?**
   - Ctrl+Shift+Delete → Clear cache/cookies

8. **Does it work in incognito mode?**
   - Tests if extensions are interfering

If you've checked all these and still have issues, contact support with:
- What you were trying to do
- What happened instead
- Browser and device you're using
- Screenshots if possible

---

## Contact Support

**Email:** support@careerpilot.ai (coming soon)

**Response Time:**
- Urgent issues: 24 hours
- General questions: 2-3 business days

**Before Contacting:**
- Check this knowledge base
- Try troubleshooting steps
- Note exact error messages
- Take screenshots

**Include in Your Email:**
- Your email address (account)
- Description of issue
- Steps you've already tried
- Browser and device
- Screenshots if relevant

---

## Frequently Asked Questions

### Is my data secure?

Yes. We use:
- Firebase Authentication (industry standard)
- Encrypted connections (HTTPS)
- Secure data storage
- No data shared with third parties

### Can I delete my account?

Currently: Contact support to delete account
Coming soon: Self-service account deletion

All your data will be permanently deleted within 30 days.

### Do you sell my information?

No. We never sell your personal information to third parties. Your resume, profile, and application data remain private.

### Can I export my data?

Currently: You can export your resume as PDF
Coming soon: Full data export (all applications, profile, etc.)

### Is there a mobile app?

Not yet. Mobile apps (iOS and Android) are planned for 2027.

Currently: Use mobile browser (fully responsive)

### Can I use CareerPilot AI for free forever?

Yes! The free plan is always available with:
- 40 credits per month
- Unlimited resume builder
- All features (within credit limit)

You can upgrade when ready for more credits.

### What if I run out of credits mid-month?

Options:
1. Purchase credit top-ups (never expire)
2. Upgrade to higher plan
3. Wait for next monthly reset

Top-ups are great for one-time needs without changing your subscription.

### Can I use this for remote jobs?

Yes! Many jobs in our search results are remote or hybrid. Look for:
- Location says "Remote"
- Job description mentions "remote work"
- Company has remote-first policy

### What countries are supported for jobs?

Full support: US, UK, Canada, Australia, Ireland, New Zealand, Singapore, UAE, India

Limited support: Germany, France, Italy, Spain, Netherlands
(English-speaking roles only in these countries)

### How accurate are fit scores?

Fit scores show skill matching percentage:
- Algorithm matches your skills to job descriptions
- Higher scores = more of your skills mentioned in job
- Not a guarantee of success, but a helpful indicator

Use fit scores as one factor in your decision, along with:
- Your interest in the role
- Company culture
- Salary and benefits
- Location and requirements

---

## 13. Escalation Scenarios & Examples

### Level 1 → Level 2 Escalation Examples

#### Scenario 1: Basic Troubleshooting Failed
**User:** "My resume won't save"

**Level 1 Response:**
1. ✅ Checked: Are you clicking "Save Resume" button?
2. ✅ Tried: Refresh the page
3. ✅ Tried: Clear browser cache
4. ❌ Issue persists

**→ ESCALATE TO LEVEL 2**

**Level 2 Diagnosis:**
- Check browser (outdated version?)
- Check incognito mode (storage blocked?)
- Check for special characters in text
- Check internet connection stability
- Provide specific browser-based solutions

---

#### Scenario 2: Multiple Symptoms
**User:** "Jobs aren't showing up and my fit scores are all 0%"

**Level 1 Response:**
1. ✅ Checked: Profile complete?
2. ✅ Basic profile troubleshooting provided

**→ ESCALATE TO LEVEL 2** (Multiple interconnected issues)

**Level 2 Diagnosis:**
- Investigate skills format (root cause analysis)
- Check target role specificity
- Verify location format
- Test with different target role/location
- Provide comprehensive skills formatting guide

---

### Level 2 → Level 3 Escalation Examples

#### Scenario 1: Payment Issue
**User:** "I was charged $99 but my credits show 40 (free tier)"

**Level 2 Response:**
1. ✅ Checked: Wait 5-10 minutes for processing
2. ✅ Tried: Sign out and back in
3. ✅ Verified: Credit balance still incorrect after 30 minutes
4. ❌ Technical troubleshooting cannot resolve billing discrepancy

**→ ESCALATE TO LEVEL 3** (Billing dispute)

**Slack Escalation:**
```
🔴 URGENT: Billing Issue
User: user@example.com
Claim: Charged $99, credits not applied
Troubleshooting: Verified issue persists after 30+ minutes
Action Needed: Manual credit adjustment + payment verification
```

---

#### Scenario 2: GDPR Request
**User:** "I want to delete my account and all my data permanently"

**Level 2 Response:**
- This is a legal/compliance request
- AI cannot process data deletion requests

**→ ESCALATE TO LEVEL 3 IMMEDIATELY** (Legal/GDPR)

**Slack Escalation:**
```
⚖️ GDPR DATA DELETION REQUEST
User: user@example.com
Request: Full account and data deletion
Action Needed: 
  1. Verify user identity
  2. Process deletion per GDPR guidelines
  3. Confirm deletion within 30 days
Urgency: Medium (30-day compliance window)
```

---

#### Scenario 3: Confirmed Bug
**User:** "Every time I click 'Smart Apply,' I get placeholder text like [Your Name] in the cover letter"

**Level 2 Response:**
1. ✅ Tried: Regenerate cover letter
2. ✅ Verified: Resume has full name filled
3. ✅ Tested: Happens consistently across multiple jobs
4. ✅ Confirmed: This is a reproducible bug

**→ ESCALATE TO LEVEL 3** (Bug confirmation)

**Slack Escalation:**
```
🐛 BUG REPORT: Cover Letter Placeholder Issue
User: user@example.com
Bug: Placeholder text appearing in generated cover letters
Reproduction: Consistent across multiple job applications
User Resume: Has all required fields
Action Needed: Engineering review of cover letter generation logic
Urgency: High (affects core feature)
```

---

#### Scenario 4: Payment Processing Error
**User:** "My card keeps getting declined but I have sufficient funds and my bank says nothing is blocked"

**Level 2 Response:**
1. ✅ Checked: Card details correct
2. ✅ Tried: Different card
3. ✅ Verified: Bank confirms no blocks
4. ✅ Tried: Different browser
5. ❌ Payment still failing

**→ ESCALATE TO LEVEL 3** (Payment processor issue)

**Slack Escalation:**
```
💳 PAYMENT PROCESSING FAILURE
User: user@example.com
Issue: Card declined despite valid card and funds
Troubleshooting: Tried multiple cards, browsers, verified with bank
Action Needed: Check Stripe logs, investigate payment processor
Urgency: High (blocking paid conversion)
```

---

#### Scenario 5: Security Concern
**User:** "Someone accessed my account from a different country. I didn't do that."

**Level 2 Response:**
- This is a security issue

**→ ESCALATE TO LEVEL 3 IMMEDIATELY** (Security)

**Slack Escalation:**
```
🔒 SECURITY ALERT: Potential Account Compromise
User: user@example.com
Report: Unauthorized access from different country
Action Needed: 
  1. Reset user password immediately
  2. Review access logs
  3. Check for suspicious activity
  4. Notify user of security measures taken
Urgency: CRITICAL
```

---

### Quick Escalation Decision Tree

**Start Here:**

**Q1: Is this a simple how-to question?**
- YES → **Level 1** (provide answer)
- NO → Continue

**Q2: Did basic troubleshooting (refresh, cache, different browser) resolve it?**
- YES → **Level 1** (issue resolved)
- NO → Continue

**Q3: Is this about billing, payments, or charges?**
- YES → Try Level 2 troubleshooting first
  - If unresolved after 30 min → **Level 3**
- NO → Continue

**Q4: Is this a legal/GDPR/security request?**
- YES → **Level 3 immediately**
- NO → Continue

**Q5: Does this require multi-step technical diagnosis?**
- YES → **Level 2** (advanced troubleshooting)
- NO → Continue

**Q6: Did Level 2 troubleshooting resolve it?**
- YES → **Level 2** (issue resolved)
- NO → **Level 3** (escalate to human)

---

### Escalation Best Practices

**For TechSupport AI:**

**DO:**
- ✅ Attempt all relevant troubleshooting before escalating
- ✅ Document what was tried in escalation message
- ✅ Set clear urgency level (Low/Medium/High/Critical)
- ✅ Include user's email and issue summary
- ✅ Escalate immediately for security/legal/GDPR issues
- ✅ Provide clear escalation message to user

**DON'T:**
- ❌ Escalate without attempting troubleshooting (unless security/legal)
- ❌ Promise specific resolution timeframes (say "1-24 hours")
- ❌ Share sensitive user data in escalation message
- ❌ Escalate simple issues that Level 1 can handle
- ❌ Give up on Level 2 issues too quickly

---

### Support Metrics & Goals

**Level 1 Target:**
- **Resolution Rate:** 60-70% of total inquiries
- **Response Time:** Immediate (AI)
- **Customer Satisfaction:** 85%+

**Level 2 Target:**
- **Resolution Rate:** 25-30% of total inquiries
- **Response Time:** 2-5 minutes (AI diagnosis)
- **Escalation Rate to L3:** <10%
- **Customer Satisfaction:** 80%+

**Level 3 Target:**
- **Escalation Rate:** <10% of total inquiries
- **Response Time:** 1-24 hours (human)
- **Resolution Rate:** 95%+
- **Customer Satisfaction:** 90%+

---

**End of Knowledge Base**

**Last Updated:** March 12, 2026  
**Version:** 1.1  
**For:** TechSupport AI™ Customer Support (3-Tier System)  
**Product:** CareerPilot AI™
