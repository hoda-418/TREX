import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment] = useState("COD");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!name || !address) return;
    // Frontend-only "order"
    const order = {
      id: Date.now(),
      items: cart,
      total,
      name,
      address,
      payment,
      status: "Pending"
    };
    localStorage.setItem("last_order", JSON.stringify(order));
    clearCart();
    alert("Order placed (COD). We'll contact you by email in real backend.");
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-md-7">
        <h3>Shipping Details</h3>
        <form onSubmit={submit}>
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">Address</label>
            <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <input className="form-control" value="Cash on Delivery" readOnly />
          </div>
          <button className="btn btn-success">Place Order</button>
        </form>
      </div>

      <div className="col-md-5">
        <h3>Summary</h3>
        <ul className="list-group mb-3">
          {cart.map((i) => (
            <li key={i.id} className="list-group-item d-flex justify-content-between">
              <span>{i.title} × {i.qty}</span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </li>
          ))}
          <li className="list-group-item d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
