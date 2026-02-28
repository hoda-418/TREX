import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerCarts, setCustomerCarts] = useState([]);

  // Load cart from localStorage on mount (cart is client‑side only)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations (client‑side only)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id || i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          (i.id === product.id || i._id === product._id) ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1, id: product._id || product.id }];
    });
  };

  const decrementQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Order submission – sends to backend
  const submitOrder = async (customerInfo, items, subtotal, shipping, totalAmount) => {
    if (items.length === 0) return;

    const orderData = {
      customer: customerInfo,
      items: items.map(item => ({
        productId: item._id || item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        image: item.image
      })),
      subtotal,
      shipping,
      total: totalAmount
    };

    try {
      const res = await api.post('/orders', orderData);
      // After successful order, clear cart
      clearCart();
      // Optionally refresh orders list if admin is logged in
      return res.data;
    } catch (err) {
      console.error('Failed to submit order', err);
      throw err;
    }
  };

  // Admin: fetch orders
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  // Admin: update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      // Refresh orders list
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order', err);
    }
  };

  // Save customer cart to backend (for abandoned cart tracking)
  const saveCustomerCart = async (customerInfo, items, total) => {
    const customerId = customerInfo.phone || `temp_${Date.now()}`;
    const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`;

    const cartData = {
      customerId,
      customerName,
      items: items.map(item => ({
        productId: item._id || item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        image: item.image,
        category: item.category
      })),
      total
    };

    try {
      await api.post('/carts', cartData);
    } catch (err) {
      console.error('Failed to save cart', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decrementQty,
        removeFromCart,
        clearCart,
        total,
        submitOrder,
        orders,
        fetchOrders,
        updateOrderStatus,
        customerCarts,
        saveCustomerCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);