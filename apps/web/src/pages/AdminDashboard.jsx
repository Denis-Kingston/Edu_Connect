const monitorCards = [
  { label: 'System health', value: 'Stable' },
  { label: 'Payment failures', value: '1.2%' },
  { label: 'Audit events', value: '4,820' },
  { label: 'Active admins', value: '12' },
];

export default function AdminDashboard() {
  return (
    <main className="dashboard-grid">
      <section className="panel">
        <h2>Regulator and admin operations</h2>
        <div className="summary-grid">
          {monitorCards.map((card) => (
            <div className="summary-card" key={card.label}>
              <small>{card.label}</small>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Recent activity</h3>
        <ul className="activity-list">
          <li>Payment reconciliation completed for 1,236 applicants.</li>
          <li>University application windows updated for 5 institutions.</li>
          <li>Audit log export generated successfully.</li>
        </ul>
      </section>
    </main>
  );
}
