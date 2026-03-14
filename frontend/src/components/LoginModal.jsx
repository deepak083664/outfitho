import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // BACKEND CONNECTION: Replace with your actual Send OTP endpoint
      // const { data } = await api.post('/users/send-otp', { mobile });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('OTP sent successfully!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // BACKEND CONNECTION: Replace with your actual Verify OTP endpoint
      // const { data } = await api.post('/users/verify-otp', { mobile, otp });
      
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockUserData = {
        _id: '123',
        name: 'New User',
        email: 'user@example.com',
        mobile: mobile,
        token: 'mock-jwt-token',
        isAdmin: false
      };
      
      login(mockUserData);
      toast.success('LoggedIn Successfully');
      resetModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setMobile('');
    setOtp('');
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Glassmorphism Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLoginModal(false)}
          className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={() => setShowLoginModal(false)}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface transition-colors z-10"
          >
            <X size={20} className="text-secondary" />
          </button>

          {/* Content */}
          <div className="p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-dark mb-2">
                OUTFITHO<span className="text-primary">.</span>
              </h2>
              <p className="text-secondary text-sm font-medium">
                {step === 1 ? 'Enter mobile to proceed' : 'Enter the code sent to your phone'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel"
                      placeholder="Mobile Number"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-4 bg-surface rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-dark placeholder:text-light/50"
                      required
                    />
                  </div>
                  
                  <button 
                    disabled={loading || mobile.length < 10}
                    className="w-full btn-primary !rounded-2xl !py-4 flex items-center justify-center space-x-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Get OTP</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <div className="relative text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <ShieldCheck size={32} />
                      </div>
                    </div>
                    <input 
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center px-4 py-4 bg-surface rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-2xl tracking-[0.5em] text-dark placeholder:text-light/50 placeholder:text-sm placeholder:tracking-normal"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      disabled={loading || otp.length < 6}
                      className="w-full btn-primary !rounded-2xl !py-4 flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        'Verify & Continue'
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-2 text-xs font-bold text-light hover:text-dark transition-colors"
                    >
                      Change Number?
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-light uppercase tracking-widest leading-loose">
                By continuing, you agree to our <br />
                <span className="text-dark font-black underline cursor-pointer">Terms</span> & <span className="text-dark font-black underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
