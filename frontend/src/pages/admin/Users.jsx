import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, Trash2, Shield, ShieldOff, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModernTable from '../../components/admin/ModernTable';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get('pageNumber') || 1;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?pageNumber=${pageNumber}`);
      setUsers(res.data.users);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      const res = await api.put(`/users/${id}/block`);
      setUsers(prev => prev.map(u => 
        u._id === id ? { ...u, isBlocked: !currentStatus } : u
      ));
      toast.success(res.data.message || `User ${currentStatus ? 'Unblocked' : 'Blocked'}`);
    } catch (err) {
      toast.error('Failed to change block status');
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm('Delete this user account forever? This cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success('User deleted entirely.');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'Customer', 
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-bold shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Role', 
      accessor: 'isAdmin',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          {row.isAdmin ? (
            <><Shield size={14} className="text-purple-600" /><span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Admin</span></>
          ) : (
            <><ShieldOff size={14} className="text-gray-400" /><span className="text-xs font-medium text-gray-600">Customer</span></>
          )}
        </div>
      )
    },
    { 
      header: 'Account Status', 
      accessor: 'isBlocked',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {row.isBlocked ? 'Banned' : 'Active'}
        </span>
      )
    },
    { 
      header: 'Joined', 
      accessor: 'createdAt',
      render: (row) => <span className="text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex justify-end space-x-2">
          {!row.isAdmin && (
            <button 
              onClick={() => handleToggleBlock(row._id, row.isBlocked)}
              className={`p-2 rounded-lg transition-colors border ${row.isBlocked ? 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100' : 'text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100'}`}
              title={row.isBlocked ? "Unban User" : "Ban User"}
            >
              {row.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
            </button>
          )}
          {!row.isAdmin && (
            <button 
              onClick={() => handleDeleteUser(row._id)}
              className="p-2 text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete Forever"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ], []);

  const handlePageChange = (newPage) => {
    setSearchParams({ pageNumber: newPage });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Review your user base of {total} registered fans.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="text-sm text-gray-500 font-medium">
           Showing {users.length} of {total} customers
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-gray-500 font-medium animate-pulse">Scanning customer database...</p>
        </div>
      ) : (
        <>
          <ModernTable columns={columns} data={users} emptyMessage="No users registered yet." />
          
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button 
                onClick={() => handlePageChange(Number(pageNumber) - 1)}
                disabled={Number(pageNumber) === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all ${
                    Number(pageNumber) === (i + 1) 
                    ? 'bg-black text-white border-black shadow-md scale-110' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(Number(pageNumber) + 1)}
                disabled={Number(pageNumber) === pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(Users);
