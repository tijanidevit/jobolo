import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center glass rounded-3xl p-12 md:p-24 shadow-2xl animate-in">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400 text-transparent bg-clip-text">
          Jobolo
        </h1>
        <p className="text-lg md:text-2xl text-foreground/80 mb-10 max-w-2xl font-light">
          The ultimate operating system for your job search. Track applications, ace interviews, and land your dream job with intelligent insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-500/30"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-transparent border-2 border-brand-500/30 hover:border-brand-500 text-foreground font-medium rounded-full transition-all duration-300 hover:bg-brand-500/5"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full border-t border-border/50 pt-16">
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Track Everything</h3>
            <p className="text-foreground/70 text-sm">Organize applications across different stages, from applied to offer.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Ace Interviews</h3>
            <p className="text-foreground/70 text-sm">Prepare with notes, schedules, and research attached to every role.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Insights</h3>
            <p className="text-foreground/70 text-sm">Get actionable analytics to understand what is working in your search.</p>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-4 text-sm text-foreground/50">
        © {new Date().getFullYear()} Jobolo. All rights reserved.
      </footer>
    </div>
  );
}
