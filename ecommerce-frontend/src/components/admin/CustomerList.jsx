import React from 'react';

export default function CustomerList({ customers, onDeleteCustomer }) {
  if (customers.length === 0) {
    return <p>No customers yet.</p>;
  }

  return (
    <div>
      <h4>Customers ({customers.length})</h4>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email || 'N/A'}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>{customer.ordersCount || 0}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDeleteCustomer(customer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}