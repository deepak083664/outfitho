import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Hardcoded admin email
      const email = 'Outfithoo@gmail.com';
      const { data } = await api.post('/users/login', { email, password });
      
      if (data.isAdmin) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('token', data.token); // Store token for API requests
        toast.success('Admin Authenticated');
        navigate('/admin');
      } else {
        toast.error('Not authorized as an admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold tracking-widest text-black">
              OUTFITHO<span className="text-gray-400 italic">.</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">Admin Portal Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Admin Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-shadow pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} className="mr-2" /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
