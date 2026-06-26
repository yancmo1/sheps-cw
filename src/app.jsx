function App() {
  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <p style={styles.kicker}>W5XY Labs</p>

        <h1 style={styles.title}>Didah Trainer</h1>

        <p style={styles.subtitle}>
          A simple CW learning dashboard. Nothing fancy yet — just alive on the screen.
        </p>

        <div style={styles.grid}>
          <Card title="Practice" value="Start" text="Begin a basic CW session." />
          <Card title="Progress" value="0%" text="Accuracy and speed will live here." />
          <Card title="Lesson Plan" value="LICW" text="Structured learning notes and exercises." />
        </div>

        <section style={styles.focusBox}>
          <h2 style={styles.focusTitle}>Today’s Focus</h2>
          <p style={styles.focusText}>
            Get the first dashboard running. No real logic yet. Just the first visual win.
          </p>

          <button style={styles.button}>Start Practice</button>
        </section>
      </section>
    </main>
  );
}

function Card({ title, value, text }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>
      <p style={styles.cardValue}>{value}</p>
      <p style={styles.cardText}>{text}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "32px",
  },
  shell: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  kicker: {
    color: "#94a3b8",
    marginBottom: "8px",
    fontSize: "14px",
  },
  title: {
    fontSize: "42px",
    margin: "0",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: "18px",
    marginTop: "12px",
    maxWidth: "620px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "32px",
  },
  card: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "20px",
  },
  cardTitle: {
    color: "#94a3b8",
    margin: "0",
    fontSize: "14px",
  },
  cardValue: {
    fontSize: "30px",
    fontWeight: "700",
    margin: "10px 0",
  },
  cardText: {
    color: "#cbd5e1",
    margin: "0",
  },
  focusBox: {
    marginTop: "24px",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "22px",
    padding: "24px",
  },
  focusTitle: {
    margin: "0 0 8px 0",
    fontSize: "24px",
  },
  focusText: {
    color: "#cbd5e1",
    margin: "0",
  },
  button: {
    marginTop: "18px",
    background: "white",
    color: "#0f172a",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default App;