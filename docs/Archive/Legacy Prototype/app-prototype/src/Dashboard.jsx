import React from 'react';

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    padding: "24px",
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  section: {
    maxWidth: "56rem",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    marginBottom: "8px",
  },
  headerLabel: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "0 0 4px 0",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    margin: "0 0 12px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#cbd5e1",
    margin: 0,
  },
  grid: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  },
  card: {
    borderRadius: "16px",
    border: "1px solid #1e293b",
    background: "#1e293b",
    padding: "20px",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: 700,
    margin: "12px 0 0 0",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#cbd5e1",
    margin: "12px 0 0 0",
  },
  focusBox: {
    borderRadius: "16px",
    border: "1px solid #1e293b",
    background: "#1e293b",
    padding: "20px",
  },
  focusTitle: {
    fontSize: "20px",
    fontWeight: 600,
    margin: "0 0 8px 0",
  },
  focusText: {
    fontSize: "16px",
    color: "#cbd5e1",
    margin: 0,
  },
  button: {
    marginTop: "16px",
    borderRadius: "12px",
    background: "#fff",
    color: "#0f172a",
    padding: "10px 16px",
    fontSize: "16px",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  buttonHover: {
    background: "#e2e8f0",
  },
};

export default function Dashboard() {
  const [buttonHover, setButtonHover] = React.useState(false);

  return (
    <main style={styles.page}>
      <section style={styles.section}>
        <div style={styles.header}>
          <p style={styles.headerLabel}>W5XY Labs</p>
          <h1 style={styles.title}>Dit Dit Box</h1>
          <p style={styles.subtitle}>Didah Trainer is ready.</p>
        </div>

        <div style={styles.grid}>
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

        <div style={styles.focusBox}>
          <h2 style={styles.focusTitle}>Today's Focus</h2>
          <p style={styles.focusText}>
            Didah Trainer is ready.
          </p>

          <button
            style={{
              ...styles.button,
              ...(buttonHover ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            Start Practice
          </button>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({ title, value, description }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardLabel}>{title}</p>
      <p style={styles.cardValue}>{value}</p>
      <p style={styles.cardDesc}>{description}</p>
    </div>
  );
}
