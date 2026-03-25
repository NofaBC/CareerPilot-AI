import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-6xl font-bold text-slate-50 mb-4">
            CareerPilot AI™
          </h1>
          <p className="text-2xl text-emerald-400 font-semibold">Autonomous Job Hunt Agent</p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            AI-powered job search platform that finds positions, matches your skills, builds resumes, 
            and creates personalized cover letters in seconds.
          </p>
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <span className="inline-block">🌍</span>
            Best coverage in English-speaking markets, with growing support worldwide
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link 
              href="/signup" 
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-slate-600 hover:border-emerald-500 text-slate-200 hover:text-emerald-400 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-50 mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-colors">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">Smart Job Matching</h3>
            <p className="text-slate-300">
              AI-powered skill matching algorithm shows you exactly how qualified you are for each position with fit scores.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-colors">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">Resume Builder</h3>
            <p className="text-slate-300">
              Create professional resumes with our intuitive builder. Export to PDF with one click. Always free.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-colors">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">AI Cover Letters</h3>
            <p className="text-slate-300">
              Generate personalized cover letters in seconds. Each one tailored to the job description and your experience.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-colors">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">Interview Coach</h3>
            <p className="text-slate-300">
              Practice interviews with AI. Get real-time feedback and improve your answers before the real thing.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-colors">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">Application Tracking</h3>
            <p className="text-slate-300">
              Keep track of every application. Monitor status, dates, and never lose sight of your job search progress.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-colors">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">Real-Time Search</h3>
            <p className="text-slate-300">
              Search thousands of jobs from top companies in real-time. Fresh results powered by JSearch API.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-50 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-slate-400 mb-12">Pay only for what you use with our credit-based system</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-slate-50 mb-2">Free</h3>
            <div className="text-4xl font-bold text-slate-50 mb-4">$0<span className="text-lg text-slate-400">/month</span></div>
            <p className="text-slate-400 mb-6">Perfect for trying out the platform</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">40 credits/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">~5 job searches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">~2 AI cover letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">Unlimited resume building</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500">✗</span>
                <span className="text-slate-500">Credits reset monthly</span>
              </li>
            </ul>
            <Link 
              href="/signup" 
              className="block w-full bg-slate-700 hover:bg-slate-600 text-center text-slate-200 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Starter Plan */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-slate-50 mb-2">Starter</h3>
            <div className="text-4xl font-bold text-slate-50 mb-4">$39<span className="text-lg text-slate-400">/month</span></div>
            <p className="text-slate-400 mb-6">For active job seekers</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">500 credits/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">~62 job searches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">~33 AI cover letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">Application tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">Dashboard analytics</span>
              </li>
            </ul>
            <Link 
              href="/signup" 
              className="block w-full bg-emerald-500 hover:bg-emerald-600 text-center text-slate-900 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/50 border-2 border-emerald-500 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-slate-50 mb-2">Pro</h3>
            <div className="text-4xl font-bold text-slate-50 mb-4">$99<span className="text-lg text-slate-400">/month</span></div>
            <p className="text-slate-400 mb-6">For intensive job campaigns</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">1,200 credits/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">~150 job searches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">~80 AI cover letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-300">Early access to new features</span>
              </li>
            </ul>
            <Link 
              href="/signup" 
              className="block w-full bg-emerald-500 hover:bg-emerald-600 text-center text-slate-900 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Credit Top-ups */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            <strong className="text-slate-300">Need more credits?</strong> Purchase one-time top-ups that never expire:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3">
              <div className="text-slate-300">Small Pack: <span className="text-emerald-400 font-semibold">200 credits - $15</span></div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3">
              <div className="text-slate-300">Medium Pack: <span className="text-emerald-400 font-semibold">600 credits - $40</span></div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3">
              <div className="text-slate-300">Large Pack: <span className="text-emerald-400 font-semibold">1,500 credits - $90</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-50 mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="bg-emerald-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Create Your Profile</h3>
              <p className="text-slate-300">Sign up and tell us about your target role, location, experience, and skills. Takes just 2 minutes.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-emerald-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Search & Match</h3>
              <p className="text-slate-300">Our AI searches thousands of jobs and shows you fit scores based on your skills. Know exactly where you qualify.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-emerald-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Build Your Resume</h3>
              <p className="text-slate-300">Use our resume builder to create a professional resume. Export to PDF anytime. Completely free, no credit cost.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-emerald-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Smart Apply</h3>
              <p className="text-slate-300">Click "Smart Apply" to generate a personalized cover letter in seconds. Track all applications in your dashboard.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-emerald-500 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Practice & Prepare</h3>
              <p className="text-slate-300">Use our AI interview coach to practice common questions and get feedback before your real interviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Availability Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-50 mb-4">🌍 Global Job Market Coverage</h2>
            <p className="text-lg text-slate-300">CareerPilot AI searches jobs worldwide, with the best results in English-speaking markets</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Best Coverage */}
            <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-400">Best Coverage</h3>
              </div>
              <p className="text-slate-300 mb-4">Thousands of jobs available in major English-speaking regions:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇺🇸</span>
                  <span><strong>United States:</strong> All major cities (NYC, SF, Austin, Seattle, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇨🇦</span>
                  <span><strong>Canada:</strong> Toronto, Vancouver, Montreal, Calgary</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇬🇧</span>
                  <span><strong>United Kingdom:</strong> London, Manchester, Edinburgh</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇦🇺</span>
                  <span><strong>Australia:</strong> Sydney, Melbourne, Brisbane</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇮🇪</span>
                  <span><strong>Ireland:</strong> Dublin, Cork</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇸🇬</span>
                  <span><strong>Singapore:</strong> Full coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">🇳🇿</span>
                  <span><strong>New Zealand:</strong> Auckland, Wellington</span>
                </li>
              </ul>
            </div>

            {/* Good Coverage */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-400">Good Coverage</h3>
              </div>
              <p className="text-slate-300 mb-4">Growing job listings in European and international markets:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🇪🇺</span>
                  <span><strong>Europe:</strong> Germany, France, Netherlands, Sweden, Spain</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🌏</span>
                  <span><strong>Asia:</strong> India, Hong Kong, UAE (English roles)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🌎</span>
                  <span><strong>Latin America:</strong> Brazil, Mexico (English roles)</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong className="text-blue-400">💡 Pro Tip:</strong> For best results in non-English-speaking countries, 
                  search in major cities or specify "English" in your target role (e.g., "English-speaking Software Engineer").
                </p>
              </div>
            </div>
          </div>

          {/* Remote Work Notice */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-slate-800/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-purple-400 mb-2">Remote & Hybrid Work</h4>
                <p className="text-slate-300">
                  CareerPilot AI searches for remote and hybrid positions worldwide. Set your location to "Remote" 
                  to discover opportunities from companies hiring internationally, regardless of your physical location.
                </p>
              </div>
            </div>
          </div>

          {/* How Job Search Works */}
          <div className="mt-8 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-bold text-slate-50 mb-3">How Our Global Job Search Works</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-emerald-400 font-semibold mb-1">Real-Time API</p>
                <p className="text-slate-400">Powered by JSearch API with access to millions of job listings updated daily</p>
              </div>
              <div>
                <p className="text-emerald-400 font-semibold mb-1">AI Matching</p>
                <p className="text-slate-400">Our GPT-4o algorithm analyzes your skills against job requirements for fit scores</p>
              </div>
              <div>
                <p className="text-emerald-400 font-semibold mb-1">Fresh Results</p>
                <p className="text-slate-400">New jobs added continuously - search anytime for the latest opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-900/50 to-slate-800/50 border border-emerald-500/50 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-50 mb-4">Ready to Transform Your Job Search?</h2>
          <p className="text-xl text-slate-300 mb-8">Start your AI-powered job search today and accelerate your path to landing your dream job.</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">No credit card required • 40 free credits • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 CareerPilot AI™ - Part of NOFA AI Factory</p>
          <p className="mt-2">Powered by OpenAI GPT-4o • Available in US, UK, Canada, Australia, Europe & more</p>
          <p className="mt-2">
            Need help? Contact us: <a href="mailto:supportdesk@nofabusinessconsulting.com" className="text-emerald-400 hover:text-emerald-300 underline">supportdesk@nofabusinessconsulting.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
