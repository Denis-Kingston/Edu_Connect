const mockPrograms = [
  { id: 1, name: 'BSc Computer Science', institution: 'University of Dar es Salaam', region: 'Dar es Salaam', cutoff: 72 },
  { id: 2, name: 'BSc Civil Engineering', institution: 'Ardhi University', region: 'Dar es Salaam', cutoff: 68 },
  { id: 3, name: 'Bachelor of Commerce', institution: 'University of Dodoma', region: 'Dodoma', cutoff: 64 },
  { id: 4, name: 'BSc Nursing', institution: 'MUHAS', region: 'Dar es Salaam', cutoff: 76 },
];

const mockApplications = [
  { id: 'APP-1021', program: 'BSc Computer Science', status: 'Submitted', date: '2026-09-15' },
  { id: 'APP-1045', program: 'Bachelor of Commerce', status: 'In Review', date: '2026-09-17' },
];

export default function ApplicantDashboard() {
  return (
    <main className="dashboard-grid">
      <section className="panel">
        <h2>Applicant dashboard</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <small>Profile status</small>
            <strong>Verified</strong>
          </div>
          <div className="summary-card">
            <small>NECTA index</small>
            <strong>S1234567</strong>
          </div>
          <div className="summary-card">
            <small>Applications</small>
            <strong>2</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Program catalog</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th>Institution</th>
                <th>Region</th>
                <th>Cut-off</th>
              </tr>
            </thead>
            <tbody>
              {mockPrograms.map((program) => (
                <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.institution}</td>
                  <td>{program.region}</td>
                  <td>{program.cutoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3>My applications</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Program</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockApplications.map((application) => (
                <tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.program}</td>
                  <td>{application.status}</td>
                  <td>{application.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
