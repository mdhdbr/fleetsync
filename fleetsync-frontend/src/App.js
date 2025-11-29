import React, { useState, useEffect } from 'react';

function App() {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [user, setUser] = useState(null);

  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState('');

  const API = "http://localhost:5000";

  // Handle login
  async function login(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();

      if (!data.token) {
        setMessage(data.message || "Login failed");
        return;
      }

      setUser(data.user);
      setMessage("Login successful!");
    } catch (err) {
      setMessage("Server error");
    }
  }

  // Load drivers & trips after login
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      const d = await fetch(`${API}/drivers`).then(r => r.json());
      const t = await fetch(`${API}/trips`).then(r => r.json());

      setDrivers(d);
      setTrips(t);
    }

    loadData();
  }, [user]);

  // UI for Dispatcher
  function DispatcherDashboard() {
    return (
      <div>
        <h2>Dispatcher Dashboard</h2>

        <h3>All Trips</h3>
        <ul>
          {trips.map(t => (
            <li key={t.id}>
              #{t.id} — {t.origin} → {t.destination} — Driver: {t.driver || "None"}
            </li>
          ))}
        </ul>

        <h3>Drivers</h3>
        <ul>
          {drivers.map(d => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  // UI for Driver
  function DriverDashboard() {
    const myTrips = trips.filter(t => t.driver === user.username);

    return (
      <div>
        <h2>Driver Dashboard</h2>

        <h3>My Assigned Trips</h3>
        {myTrips.length === 0 ? (
          <p>No trips assigned.</p>
        ) : (
          <ul>
            {myTrips.map(t => (
              <li key={t.id}>
                #{t.id} — {t.origin} → {t.destination} — Status: {t.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>FleetSync Frontend</h1>

      {!user ? (
        <form onSubmit={login}>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
          /><br/><br/>

          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
          /><br/><br/>

          <button type="submit">Login</button>

          <p>{message}</p>
        </form>
      ) : (
        <div>
          <h3>Welcome {user.username}! (Role: {user.role})</h3>

          {user.role === "dispatcher" && <DispatcherDashboard />}
          {user.role === "driver" && <DriverDashboard />}
        </div>
      )}
    </div>
  );
}

export default App;
