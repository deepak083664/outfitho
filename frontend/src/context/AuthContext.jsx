import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    
    // Execute pending action if any
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  const requireAuth = (action) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLoginModal(true);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    showLoginModal,
    setShowLoginModal,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
