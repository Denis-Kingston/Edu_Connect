export default function HomePage() {
  return (
    <main className="hero-grid">
      <section className="hero-panel">
        <span className="eyebrow">Secure admissions platform</span>
        <h1>Apply to universities in Tanzania with confidence.</h1>
        <p>
          Edu_Connect helps students register, verify NECTA records, compare programs, submit applications,
          and track admissions through a secure, mobile-first portal built for Tanzanian institutions.
        </p>
        <div className="cta-row">
          <a className="primary-button" href="/login">Start application</a>
          <a className="secondary-button" href="/university">University portal</a>
        </div>
      </section>

      <aside className="metric-card">
        <h3>Live platform snapshot</h3>
        <div className="metric-row"><span>Applicants</span><strong>24,800</strong></div>
        <div className="metric-row"><span>Institutions</span><strong>48</strong></div>
        <div className="metric-row"><span>Payment success</span><strong>98.7%</strong></div>
        <div className="metric-row"><span>Avg. response</span><strong>420ms</strong></div>
      </aside>
    </main>
  );
}
