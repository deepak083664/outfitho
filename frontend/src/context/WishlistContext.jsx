import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      const parsed = savedWishlist ? JSON.parse(savedWishlist) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading wishlist:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!wishlistItems.find(item => item._id === product._id)) {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== productId));
  };

  const toggleWishlist = (product) => {
    if (wishlistItems.find(item => item._id === product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId || !Array.isArray(wishlistItems)) return false;
    return wishlistItems.some(item => item && String(item._id) === String(productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
