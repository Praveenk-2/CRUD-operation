'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', number: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
      console.log(`✅ Loaded ${data.length} users`);
      
    } catch (err) {
      console.error('❌ Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete function - IMPROVED
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\nThis action cannot be undone!`
    );
    
    if (!confirmed) return;
    
    try {
      setActionLoading(true);
      console.log(`🗑️ Attempting to delete user ID: ${id}`);
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      
      console.log(`✅ User ${id} deleted successfully`);
    //   alert('✅ User deleted successfully!');
      
      // Refresh users list
      await fetchUsers();
      
    } catch (err) {
      console.error('❌ Delete Error:', err);
    //   alert(`❌ Failed to delete user: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit start
  const startEdit = (user) => {
    console.log('📝 Editing user:', user);
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      number: user.number
    });
  };

  // Edit cancel
  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', number: '' });
  };

  // Update function - IMPROVED
  const handleUpdate = async (id) => {
    // Validation
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.number.trim()) {
      alert('❌ All fields are required!');
      return;
    }
    
    try {
      setActionLoading(true);
      console.log(`📝 Updating user ID: ${id}`, editForm);
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      const data = await response.json();
      console.log('Update response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      console.log(`✅ User ${id} updated successfully`);
    //   alert('✅ User updated successfully!');
      
      // Close edit mode
      cancelEdit();
      
      // Refresh users list
      await fetchUsers();
      
    } catch (err) {
      console.error('❌ Update Error:', err);
    //   alert(`❌ Failed to update user: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <strong className="font-bold text-lg">❌ Error!</strong>
          <p className="mt-2">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Total Users: <span className="font-bold text-blue-600">{users.length}</span>
              </p>
            </div>
            <Link
              href="/create-user"
              className="text-[12px] md:text-sm bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Add New User
            </Link>
          </div>
        </div>

        {/* Action Loading Overlay */}
        {actionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-medium">Processing...</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg mb-4">
              No users found. Add your first user!
            </p>
            <Link
              href="/create-user"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create First User
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{user.id}
                      </td>
                      
                      {editingUser === user.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Name"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Email"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="tel"
                              value={editForm.number}
                              onChange={(e) => setEditForm({...editForm, number: e.target.value})}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Phone"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button
                              onClick={() => handleUpdate(user.id)}
                              disabled={actionLoading}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={actionLoading}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition font-medium"
                            >
                              ✕ Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.number}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button
                              onClick={() => startEdit(user)}
                              disabled={actionLoading}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium mb-2 md:mb-0"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, user.name)}
                              disabled={actionLoading}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}