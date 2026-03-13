import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Welcome back!');
      
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-[90vh] flex flex-col lg:flex-row">
      
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex w-1/2 bg-dark relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600" 
            alt="Fashion" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50 z-10"></div>
        
        <div className="relative z-20 text-center max-w-lg">
           <h2 className="text-5xl font-black text-white uppercase tracking-[0.2em] mb-8 leading-tight">
              Unleash Your <br/><span className="text-primary">True Style</span>
           </h2>
           <p className="text-light font-medium text-lg mb-12 leading-relaxed opacity-80">
              "Fashion is the armor to survive the reality of everyday life."
           </p>
           <div className="flex justify-center space-x-10">
              <div className="text-center">
                 <p className="text-2xl font-black text-white">50k+</p>
                 <p className="text-[10px] text-light font-black uppercase tracking-widest">Happy Clients</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                 <p className="text-2xl font-black text-white">100%</p>
                 <p className="text-[10px] text-light font-black uppercase tracking-widest">Pure Cotton</p>
              </div>
           </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
         <div className="w-full max-w-md">
            
            <div className="mb-12">
               <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                  Member Portal
               </div>
               <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-dark mb-4 lg:mb-6">Sign In</h1>
               <p className="text-secondary text-sm font-medium">Join our community of fashion enthusiasts.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                     <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" />
                     <input 
                      type="email" 
                      required 
                      className="w-full border-2 border-surface focus:border-dark pl-12 pr-4 py-3.5 rounded-xl outline-none transition-colors text-sm font-bold placeholder:font-medium placeholder:text-gray-300" 
                      placeholder="alex@outfitho.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1 pr-1">
                     <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Password</label>
                     <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                  </div>
                  <div className="relative group">
                     <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" />
                     <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      className="w-full border-2 border-surface focus:border-dark pl-12 pr-12 py-3.5 rounded-xl outline-none transition-colors text-sm font-bold placeholder:font-medium placeholder:text-gray-300" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                     />
                     <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-dark transition-colors"
                     >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>

               <div className="flex items-center space-x-3 pt-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-2 border-surface text-primary focus:ring-primary cursor-pointer accent-primary" />
                  <label htmlFor="remember" className="text-xs font-bold text-secondary cursor-pointer uppercase tracking-widest">Stay logged in</label>
               </div>

               <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary !rounded-xl !py-4 flex items-center justify-center space-x-3 group relative overflow-hidden"
               >
                  <span className="font-black tracking-[0.2em] relative z-10">{loading ? 'AUTHENTICATING...' : 'ACCESS ACCOUNT'}</span>
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform relative z-10" />}
               </button>
            </form>

            <div className="mt-12 text-center">
               <p className="text-secondary text-xs font-bold mb-6">Or continue with</p>
               <div className="flex gap-4 mb-12">
                  <button className="flex-1 py-3 border-2 border-surface rounded-xl flex items-center justify-center hover:border-dark transition-colors">
                     <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="h-5" />
                  </button>
                  <button className="flex-1 py-3 border-2 border-surface rounded-xl flex items-center justify-center hover:border-dark transition-colors">
                     <img src="https://www.vectorlogo.zone/logos/facebook/facebook-f.svg" alt="FB" className="h-5" />
                  </button>
               </div>

               <p className="text-sm font-bold text-secondary">
                  New here? <Link to="/register" className="text-primary font-black uppercase tracking-widest underline underline-offset-4 ml-2">Create Account</Link>
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Login;
