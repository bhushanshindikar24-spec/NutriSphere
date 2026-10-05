import {  createContext, useState, useEffect  } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (meal, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.mealId === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.mealId === meal.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          mealId: meal.id,
          mealName: meal.name,
          price: meal.price || 0,
          calories: meal.calories || 0,
          hotelId: meal.hotelId,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (mealId) => {
    setCartItems((prev) => prev.filter((item) => item.mealId !== mealId));
  };

  const updateQuantity = (mealId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.mealId === mealId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalCalories = cartItems.reduce(
    (sum, item) => sum + (item.calories || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCalories,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
