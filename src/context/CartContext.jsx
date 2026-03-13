import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, size = 'M') => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id && x.size === size);
      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id && x.size === size ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [...prevItems, { ...product, qty, size }];
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
