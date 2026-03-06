import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="flex justify-between p-6">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">NexusDeploy</h1>
        <div>
          <Link href="/login" className="mr-4 text-gray-700 dark:text-gray-300">Login</Link>
          <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Sign Up</Link>
        </div>
      </nav>

      <section className="text-center mt-20 px-4">
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white">Deploy Bots & APIs in Seconds</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          The easiest way to host Telegram bots, Discord bots, and Flask backends – with zero infrastructure headaches.
        </p>
        <div className="mt-8">
          <Link href="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg shadow-lg hover:bg-indigo-700">
            Start Deploying
          </Link>
          <button className="ml-4 border border-indigo-600 text-indigo-600 dark:text-indigo-400 px-8 py-3 rounded-lg text-lg">
            View Demo
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-4">
        <FeatureCard title="Instant Deploys" description="Upload your project, set environment variables, and go live immediately." />
        <FeatureCard title="Real-Time Logs" description="Monitor your bots and servers with a terminal‑style log viewer." />
        <FeatureCard title="Resource Metrics" description="CPU, RAM, and uptime at a glance." />
      </section>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
    </div>
  );
}
