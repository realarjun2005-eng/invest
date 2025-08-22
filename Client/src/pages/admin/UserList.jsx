import { useEffect, useState } from 'react';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
