# CareerPilot AI™ – Autonomous Job Hunt Agent (Demo UI)

> **Status:** Prototype UI – Single-File SaaS™  
> **Brick:** Frontend / index.html only (no real AI, APIs, or DB yet)

CareerPilot AI™ is an autonomous job-hunt and interview-prep assistant concept.  
This repo contains a **single-page demo UI** (`index.html`) that showcases how the experience will feel once real AI, job APIs, email, and calendar integrations are wired in.

There is **no backend** and **no real AI calls** yet. All actions are mocked in the browser with vanilla JavaScript.

---

## 🌟 What CareerPilot AI™ Will Do (Vision)

CareerPilot AI™ is designed to:

1. **Build or optimize your resume/profile**
   - Parse your resume, LinkedIn content, or a simple bio
   - Extract key skills and generate ATS-friendly resumes + short bios

2. **Match you with jobs**
   - Continuously scan job boards/APIs by role, industry, location, salary, and work mode
   - Score each job by fit and create a daily short list of top opportunities

3. **Draft applications**
   - Generate tailored resume versions + cover letters per job
   - Prepare answers to common application questions
   - Queue applications for one-click approval (user always in control)

4. **Track replies & schedule interviews**
   - Watch your inbox for recruiter/ATS emails
   - Summarize responses and draft replies
   - Add confirmed interviews to your calendar with attached prep notes

5. **Prep you for interviews (before the call)**
   - Analyze the job description and company website/news
   - Generate likely interview questions and talking points
   - Run mock interviews (chat/voice) with feedback

> ✅ **No live AI during the interview.**  
> CareerPilot AI™ only prepares you **before** the interview.  
> The answers during the real interview are always yours.

---

## 🧩 What This Demo Includes

This `index.html` file is a **front-end-only mock** that demonstrates:

### 1. Profile Builder (Left Panel)
- Fields for:
  - Name, email
  - Target role, industry/domain
  - Target salary range
  - Location(s)
  - Work mode (Remote / Hybrid / On-site / Any)
- A large textarea to **paste a resume or LinkedIn-style bio**
- A “Generate Profile & Skills” button that:
  - Creates a **mock profile summary**
  - Runs a lightweight in-browser “skill extraction” from your pasted text and shows them as **pills**

### 2. JobMatch Engine™ (Right Panel)
- “Scan for Job Matches (Demo)” button:
  - Generates **sample job cards** (mock data only) based on your target role, industry, and location
- Each job card shows:
  - Title, company, location, work mode
  - Fit score
  - Salary range
  - Short role summary
- Cards can be **highlighted** to represent the job you want to focus on

### 3. Mock Interview Prep
- “Prep from highlighted job” button and “Prep Mock Interview” buttons on each job card:
  - Generate a set of **likely interview questions** based on the chosen job
  - Show **coaching tips** for how to answer (STAR method, metrics, etc.)
- This simulates how CareerPilot AI™ will prep you before the interview

### 4. Demo Banner & Footers
- Top banner clarifies **Demo Mode** and “Brick 1 – Prototype UI”
- Footer clarifies:
  - Single-File SaaS™ concept
  - Ready to be wired into real AI, job APIs, email & calendar integrations

---

## 🛠️ Tech Stack (Current Demo)

- **HTML5** – Single-page app
- **Tailwind CSS (CDN)** – For styling
- **Vanilla JavaScript** – For all demo logic
  - Mock “AI” profile summary
  - Simple in-browser “skill extraction” from resume text
  - Sample JobMatch Engine™ cards
  - Mock interview questions & tips
- **No build step required**

This version is intentionally **backend-free** and **dependency-free** to keep it aligned with your Single-File SaaS™ style.

---

## 📁 File Structure

Right now, the repo can be as simple as:

```text
careerpilot-ai/
└── index.html   # Full UI + demo logic in one file
