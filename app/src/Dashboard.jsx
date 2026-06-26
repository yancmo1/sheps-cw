// src/pages/Dashboard.jsx

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <section className="max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-slate-400">W5XY Labs</p>
          <h1 className="text-3xl font-bold">Didah Trainer</h1>
          <p className="text-slate-300 mt-2">
            A simple CW learning dashboard to start building from.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Practice"
            value="Start"
            description="Jump into a basic CW practice session."
          />

          <DashboardCard
            title="Progress"
            value="0%"
            description="Track accuracy, speed, and consistency."
          />

          <DashboardCard
            title="Lesson Plan"
            value="LICW"
            description="Follow structured learning notes and exercises."
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold mb-2">Today’s Focus</h2>
          <p className="text-slate-300">
            Get the dashboard on screen. No pressure. No fancy logic yet.
            Just prove the page works.
          </p>

          <button className="mt-4 rounded-xl bg-white px-4 py-2 text-slate-950 font-medium hover:bg-slate-200">
            Start Practice
          </button>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-slate-300 mt-2">{description}</p>
    </div>
  );
}