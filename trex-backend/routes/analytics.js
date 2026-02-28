const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * GET /api/analytics
 * Return aggregated statistics for the admin dashboard. Admin only.
 */
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find();

    // Total revenue and order counts
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const approvedOrders = orders.filter(o => o.status === 'approved').length;

    // Top products by sales (from all orders)
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.productId ? item.productId.toString() : item.title;
        if (!productSales[id]) {
          productSales[id] = { title: item.title, quantity: 0, revenue: 0 };
        }
        productSales[id].quantity += item.qty;
        productSales[id].revenue += item.price * item.qty;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Monthly statistics (simplified)
    const monthlyStats = {};
    orders.forEach(order => {
      const month = new Date(order.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = { orders: 0, revenue: 0, customers: new Set() };
      }
      monthlyStats[month].orders += 1;
      monthlyStats[month].revenue += order.total || 0;
      if (order.customer && order.customer.phone) {
        monthlyStats[month].customers.add(order.customer.phone);
      }
    });

    const monthlyArray = Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      orders: data.orders,
      revenue: data.revenue,
      customers: data.customers.size
    })).sort((a, b) => b.month.localeCompare(a.month)); // newest first

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      approvedOrders,
      topProducts,
      monthlyStats: monthlyArray
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;