// components/ProductSearch.jsx
import { useState } from "react";

export default function ProductSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
    </div>
  );
}