const candidatePool = [
  { id: 'C-001', name: 'Mariam K.', program: 'BSc Computer Science', score: 'A', status: 'Under review' },
  { id: 'C-002', name: 'Pius A.', program: 'Bachelor of Commerce', score: 'B+', status: 'Shortlisted' },
  { id: 'C-003', name: 'Abdul M.', program: 'BSc Nursing', score: 'A', status: 'Pending' },
];

export default function UniversityDashboard() {
  return (
    <main className="dashboard-grid">
      <section className="panel">
        <h2>University admissions dashboard</h2>
        <div className="summary-grid">
          <div className="summary-card"><small>Applicants</small><strong>1,240</strong></div>
          <div className="summary-card"><small>Shortlisted</small><strong>320</strong></div>
          <div className="summary-card"><small>Capacity</small><strong>420</strong></div>
        </div>
      </section>

      <section className="panel">
        <h3>Candidate pool</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Program</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {candidatePool.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.program}</td>
                  <td>{candidate.score}</td>
                  <td>{candidate.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
