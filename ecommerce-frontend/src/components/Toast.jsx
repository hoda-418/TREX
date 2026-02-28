// src/components/Toast.jsx
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-success" : 
                  type === "error" ? "bg-danger" : 
                  type === "warning" ? "bg-warning" : "bg-info";

  return (
    <div className={`toast show position-fixed top-0 end-0 m-3 ${bgColor} text-white`} style={{ zIndex: 1050 }}>
      <div className="toast-body d-flex justify-content-between">
        <span>{message}</span>
        <button type="button" className="btn-close btn-close-white" onClick={() => setVisible(false)}></button>
      </div>
    </div>
  );
}