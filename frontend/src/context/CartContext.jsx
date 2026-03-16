import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1, size = 'M') => {
    if (!product || !product._id) {
      console.error('Invalid product passed to addToCart:', product);
      return;
    }

    setCartItems((prevItems) => {
      const items = Array.isArray(prevItems) ? prevItems : [];
      const existItem = items.find((x) => x._id === product._id && x.size === size);
      if (existItem) {
        return items.map((x) =>
          x._id === product._id && x.size === size ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [...items, { ...product, qty, size }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((prevItems) => prevItems.filter((x) => !(x._id === id && x.size === size)));
  };

  const updateQty = (id, size, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id && item.size === size ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
