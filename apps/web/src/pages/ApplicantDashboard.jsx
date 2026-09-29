import { useEffect, useMemo, useState } from 'react';

const mockPrograms = [
  { id: 'INST-101', programId: 'P-1', name: 'BSc Computer Science', institution: 'University of Dar es Salaam', region: 'Dar es Salaam', cutoff: 72, capacity: 420 },
  { id: 'INST-102', programId: 'P-2', name: 'BSc Civil Engineering', institution: 'Ardhi University', region: 'Dar es Salaam', cutoff: 68, capacity: 310 },
  { id: 'INST-103', programId: 'P-3', name: 'Bachelor of Commerce', institution: 'University of Dodoma', region: 'Dodoma', cutoff: 64, capacity: 520 },
  { id: 'INST-104', programId: 'P-4', name: 'BSc Nursing', institution: 'MUHAS', region: 'Dar es Salaam', cutoff: 76, capacity: 280 },
];

const initialApplications = [
  { id: 'APP-1021', program: 'BSc Computer Science', status: 'Submitted', date: '2026-09-15' },
  { id: 'APP-1045', program: 'Bachelor of Commerce', status: 'In Review', date: '2026-09-17' },
];

export default function ApplicantDashboard() {
  const [search, setSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(mockPrograms[0]);
  const [applications, setApplications] = useState(initialApplications);
  const [verifyIndex, setVerifyIndex] = useState('S1234567');
  const [verifyYear, setVerifyYear] = useState('2025');
  const [verifyResult, setVerifyResult] = useState(null);
  const [status, setStatus] = useState('');

  const filteredPrograms = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mockPrograms;
    return mockPrograms.filter((program) =>
      program.name.toLowerCase().includes(term)
      || program.institution.toLowerCase().includes(term)
      || program.region.toLowerCase().includes(term),
    );
  }, [search]);

  useEffect(() => {
    if (filteredPrograms[0]) {
      setSelectedProgram(filteredPrograms[0]);
    }
  }, [filteredPrograms]);

  async function handleVerify() {
    const token = localStorage.getItem('edu_connect_token');
    try {
      const res = await fetch('/api/necta/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nectaIndexNumber: verifyIndex, completionYear: verifyYear }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      setVerifyResult(data.data);
      setStatus('NECTA verification complete.');
    } catch (error) {
      setStatus(error.message || 'Verification failed');
    }
  }

  async function handleSubmitApplication(e) {
    e.preventDefault();
    const token = localStorage.getItem('edu_connect_token');

    try {
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          institutionId: selectedProgram.id,
          program: selectedProgram.name,
          choices: [selectedProgram.id, 'INST-103'],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application submission failed');

      setApplications((prev) => [{
        id: data.data.id.slice(0, 8).toUpperCase(),
        program: selectedProgram.name,
        status: 'Submitted',
        date: new Date().toISOString().slice(0, 10),
      }, ...prev]);
      setStatus('Application submitted successfully.');
    } catch (error) {
      setStatus(error.message || 'Application submission failed');
    }
  }

  return (
    <main className="dashboard-grid">
      <section className="panel">
        <h2>Applicant dashboard</h2>
        <div className="summary-grid">
          <div className="summary-card"><small>Profile status</small><strong>Verified</strong></div>
          <div className="summary-card"><small>NECTA index</small><strong>{verifyIndex}</strong></div>
          <div className="summary-card"><small>Applications</small><strong>{applications.length}</strong></div>
        </div>
      </section>

      <section className="panel">
        <h3>NECTA verification</h3>
        <div className="stack-form compact-form">
          <input value={verifyIndex} onChange={(e) => setVerifyIndex(e.target.value)} placeholder="NECTA index number" />
          <input value={verifyYear} onChange={(e) => setVerifyYear(e.target.value)} placeholder="Completion year" />
          <button type="button" className="primary-button" onClick={handleVerify}>Verify results</button>
        </div>
        {status && <div className="status-box">{status}</div>}
        {verifyResult && (
          <div className="verify-box">
            <strong>Verified</strong>
            <p>Grades: Mathematics {verifyResult.grades.mathematics}, Physics {verifyResult.grades.physics}, Chemistry {verifyResult.grades.chemistry}, Biology {verifyResult.grades.biology}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Program search</h3>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by program, institution or region" />
        <div className="program-grid">
          {filteredPrograms.map((program) => (
            <button key={program.programId} type="button" onClick={() => setSelectedProgram(program)} className={`program-card ${selectedProgram?.programId === program.programId ? 'active' : ''}`}>
              <strong>{program.name}</strong>
              <span>{program.institution}</span>
              <small>{program.region} · Cut-off {program.cutoff}</small>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmitApplication} className="stack-form compact-form">
          <div className="selected-program">
            <strong>{selectedProgram.name}</strong>
            <small>{selectedProgram.institution}</small>
          </div>
          <button type="submit" className="primary-button">Submit application</button>
        </form>
      </section>

      <section className="panel">
        <h3>My applications</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Program</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {applications.map((application) => (
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
