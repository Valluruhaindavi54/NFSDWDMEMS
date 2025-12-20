import React from 'react';
import { useRouter } from 'next/router';

async function getUser(id) {
  try {
    const res = await fetch(`http://192.168.21.245:9999/api/users`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const users = await res.json();

    const user = users.find(u => u.id === id);
    return user || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      const fetchedUser = await getUser(id);
      setUser(fetchedUser);
      setLoading(false);
    }

    fetchUser();
  }, [id]);

  if (loading) return <div style={{ padding: '24px', color: '#f8fafc' }}>Loading...</div>;
  if (!user) return <div style={{ padding: '24px', color: '#f8fafc' }}>User not found</div>;

  // Using timestamp for both last login and logout
  const lastLogin = user.timestamp;
  const lastLogout = user.timestamp;

  return (
    <div style={{
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      color: '#f8fafc',
      minHeight: '100vh',
      background: '#0f172a'
    }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>User Profile</h1>

      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '16px',
        borderRadius: '12px',
        width: '400px'
      }}>
        <div style={{ marginBottom: '12px' }}><strong>Username:</strong> {user.username}</div>
        <div style={{ marginBottom: '12px' }}><strong>User ID:</strong> {user.id}</div>
        <div style={{ marginBottom: '12px' }}><strong>Action:</strong> {user.action}</div>
        <div style={{ marginBottom: '12px' }}><strong>IP Address:</strong> {user.ip}</div>
        <div style={{ marginBottom: '12px' }}><strong>Last Login:</strong> {new Date(lastLogin).toLocaleString()}</div>
        <div style={{ marginBottom: '12px' }}><strong>Last Logout:</strong> {new Date(lastLogout).toLocaleString()}</div>
      </div>
    </div>
  );
}
