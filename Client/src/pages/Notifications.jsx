import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage or initialize
    const stored = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(stored);
  }, []);

  const removeNotification = (idx) => {
    const updated = notifications.filter((_, i) => i !== idx);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-300 to-green-500 pb-20 text-gray-900">
      <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n, idx) => (
              <li key={idx} className="bg-lime-100 rounded-lg px-4 py-2 text-green-900 shadow relative flex flex-col">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
                  title="Remove notification"
                  onClick={() => removeNotification(idx)}
                  aria-label="Remove notification"
                >
                  <FaTimes />
                </button>
                <span className="font-semibold">{n.title}</span>
                <div className="text-xs text-gray-500">{n.time}</div>
                <div>{n.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
