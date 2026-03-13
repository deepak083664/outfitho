import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      const { data } = await api.post('/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Account created successfully! Welcome to OUTFITHO.');
      navigate(redirect);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-[90vh] flex flex-col lg:flex-row">
      
      {/* Visual Section (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-dark relative items-center justify-center p-20 overflow-hidden lg:order-2">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1485230895905-ef40ba8eaa69?auto=format&fit=crop&q=80&w=1600" 
            alt="Fashion" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50 z-10"></div>
        
        <div className="relative z-20 text-center max-w-lg">
           <h2 className="text-5xl font-black text-white uppercase tracking-[0.2em] mb-8 leading-tight">
              Craft Your <br/><span className="text-primary">Elegance</span>
           </h2>
           <p className="text-light font-medium text-lg mb-12 leading-relaxed opacity-80">
              "Style is a way to say who you are without having to speak."
           </p>
           <div className="flex justify-center space-x-10 text-white">
              <div className="text-center">
                 <p className="text-2xl font-black">Free</p>
                 <p className="text-[10px] text-light font-black uppercase tracking-widest">Returns</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                 <p className="text-2xl font-black">Fast</p>
                 <p className="text-[10px] text-light font-black uppercase tracking-widest">Delivery</p>
              </div>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative lg:order-1">
         <div className="w-full max-w-md">
            
            <div className="mb-10">
               <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                  New Member
               </div>
               <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-dark mb-4 lg:mb-6">Join Us</h1>
               <p className="text-secondary text-sm font-medium">Create your account for a better experience.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                     <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" />
                     <input 
                      type="text" 
                      required 
                      className="w-full border-2 border-surface focus:border-dark pl-12 pr-4 py-3 rounded-xl outline-none transition-colors text-sm font-bold placeholder:font-medium placeholder:text-gray-300" 
                      placeholder="Deepak Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                     <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" />
                     <input 
                      type="email" 
                      required 
                      className="w-full border-2 border-surface focus:border-dark pl-12 pr-4 py-3 rounded-xl outline-none transition-colors text-sm font-bold placeholder:font-medium placeholder:text-gray-300" 
                      placeholder="alex@outfitho.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Create Password</label>
                  <div className="relative group">
                     <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" />
                     <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      className="w-full border-2 border-surface focus:border-dark pl-12 pr-12 py-3 rounded-xl outline-none transition-colors text-sm font-bold" 
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

               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-secondary tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                     <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" />
                     <input 
                      type="password" 
                      required 
                      className="w-full border-2 border-surface focus:border-dark pl-12 pr-4 py-3 rounded-xl outline-none transition-colors text-sm font-bold" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                     />
                  </div>
               </div>

               <div className="flex items-start space-x-3 pt-4">
                  <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded border-2 border-surface text-primary focus:ring-primary cursor-pointer accent-primary" />
                  <label htmlFor="terms" className="text-[11px] font-bold text-secondary cursor-pointer leading-relaxed">
                     I AGREE TO THE <Link to="#" className="text-dark underline underline-offset-2">TERMS OF USE</Link> & <Link to="#" className="text-dark underline underline-offset-2">PRIVACY POLICY</Link>
                  </label>
               </div>

               <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary !rounded-xl !py-4 flex items-center justify-center space-x-3 group relative overflow-hidden mt-8"
               >
                  <span className="font-black tracking-[0.2em] relative z-10">{loading ? 'CREATING ACCOUNT...' : 'REGISTER NOW'}</span>
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform relative z-10" />}
               </button>
            </form>

            <div className="mt-10 text-center">
               <p className="text-sm font-bold text-secondary">
                  Member already? <Link to="/login" className="text-primary font-black uppercase tracking-widest underline underline-offset-4 ml-2">Sign In</Link>
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Register;
