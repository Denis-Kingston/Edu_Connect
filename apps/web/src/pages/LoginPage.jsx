import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const demoCredentials = [
  { email: 'applicant@example.com', password: 'password123', role: 'APPLICANT' },
  { email: 'admin@example.com', password: 'adminpass', role: 'SUPER_ADMIN' },
  { email: 'university@example.com', password: 'campus123', role: 'UNIVERSITY_OFFICER' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('applicant@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Login failed');

      localStorage.setItem('edu_connect_token', body.token);
      localStorage.setItem('edu_connect_user', JSON.stringify(body.user));

      if (body.user.role === 'APPLICANT') navigate('/applicant');
      else if (body.user.role === 'UNIVERSITY_OFFICER') navigate('/university');
      else if (body.user.role === 'SUPER_ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <main className="panel login-panel">
      <div>
        <h2>Sign in to Edu_Connect</h2>
        <p>Access your applicant, institution, or admin workspace.</p>
      </div>

      <form onSubmit={handleSubmit} className="stack-form">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="primary-button" type="submit">Log in</button>
        {error && <div className="error-box">{error}</div>}
      </form>

      <div className="demo-box">
        <strong>Demo accounts</strong>
        <ul>
          {demoCredentials.map((entry) => (
            <li key={entry.email}>{entry.email} / {entry.password}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
