import React from 'react';

export default function StatsOverview({ orders, customers, products }) {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'accepted').length;

  return (
    <div>
      <h4>Overview</h4>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <p className="card-text display-6">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Customers</h5>
              <p className="card-text display-6">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text display-6">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Total Sales</h5>
              <p className="card-text display-6">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Status</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Pending Orders
                  <span className="badge bg-primary rounded-pill">{pendingOrders}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Completed Orders
                  <span className="badge bg-success rounded-pill">{completedOrders}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Refused Orders
                  <span className="badge bg-danger rounded-pill">
                    {orders.filter(order => order.status === 'refused').length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Customers</h5>
              {customers.length === 0 ? (
                <p className="text-muted">No customers yet.</p>
              ) : (
                <ul className="list-group">
                  {customers.slice(0, 5).map(customer => (
                    <li key={customer.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {customer.firstName} {customer.lastName}
                      <small className="text-muted">{customer.email}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}