'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Plus, Trash2, Mail, Shield, Calendar, ArrowLeft, Clock, Check, X, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserType, RegistrationRequest } from '@/types/auth';

export default function AdminPanel() {
  const { user, logout, getRegistrationRequests, loadRegistrationRequests, rejectRegistration } = useAuth();
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as 'admin' | 'user'
  });

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadRegistrationRequests();
      setRegistrationRequests(getRegistrationRequests());
      loadUsers();
    };
    loadData();
  }, [loadRegistrationRequests, getRegistrationRequests]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadUsers();
        setNewUser({ email: '', password: '', name: '', role: 'user' });
        setShowAddForm(false);
      } else {
        alert(data.message || 'Error creating user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      alert('You cannot delete your own account');
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadUsers();
      } else {
        alert(data.message || 'Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/admin/approve-registration', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (data.success) {
        await loadRegistrationRequests();
        setRegistrationRequests(getRegistrationRequests());
        await loadUsers();
      } else {
        alert(data.message || 'Error approving request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const success = await rejectRegistration(requestId);
    if (success) {
      await loadRegistrationRequests();
      setRegistrationRequests(getRegistrationRequests());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage training program users</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Link href="/" className="flex items-center justify-center w-full sm:w-auto gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to training program
            </Link>
          </div>
        </div>

        <div className="bg-[#0f1012] rounded-lg p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'users'
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'requests'
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Bell className="w-4 h-4" />
                Requests
                {registrationRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                    {registrationRequests.length}
                  </span>
                )}
              </button>
            </div>
            {activeTab === 'users' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-primary hover:bg-red-700 px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                {showAddForm ? 'Hide Form' : 'Add User'}
              </button>
            )}
          </div>

          {activeTab === 'users' && showAddForm && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              {users.map((userItem) => (
                <div key={userItem.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 w-full">
                    <div className="bg-gray-700 p-3 rounded-lg mt-1">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium break-all">{userItem.email}</span>
                        {userItem.role === 'admin' && (
                          <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            <Shield className="w-3 h-3" />
                            Admin
                          </div>
                        )}
                      </div>
                      {userItem.name && (
                        <div className="text-sm text-gray-300 mt-1">
                          <span className="font-medium">Name: {userItem.name}</span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400 mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {new Date(userItem.created_at).toLocaleDateString('en-US')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(userItem.id)}
                    disabled={userItem.id === user?.id}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-2 rounded-lg transition-colors w-full md:w-auto flex items-center justify-center gap-2"
                    title={userItem.id === user?.id ? 'You cannot delete your own account' : 'Delete user'}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="md:hidden">Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {registrationRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No registration requests</p>
                </div>
              ) : (
                registrationRequests.map((request) => (
                  <div key={request.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-600/20 p-3 rounded-lg mt-1">
                          <Clock className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-medium break-all">{request.email}</span>
                            <div className="flex items-center gap-1 bg-orange-600/20 text-orange-500 px-2 py-1 rounded text-xs">
                              <Clock className="w-3 h-3" />
                              Pending
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                            <Calendar className="w-4 h-4" />
                            <span>Request from: {new Date(request.createdAt).toLocaleString('en-US')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2"
                          title="Approve registration"
                        >
                          <Check className="w-4 h-4" />
                          <span className="md:hidden">Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2"
                          title="Reject registration"
                        >
                          <X className="w-4 h-4" />
                          <span className="md:hidden">Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}