import { useMemo } from "react";

export default function ProductForm({ form, setForm, saveProduct, resetForm }) {
  const isEditing = useMemo(() => form.id !== null, [form.id]);

  const handleImageFiles = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({ 
          ...f, 
          images: [...f.images, reader.result] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveProduct(e);
      }}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Product Title *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter product title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            required
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Electronics, Clothing"
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label">Price *</label>
          <input
            type="number"
            className="form-control"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="col-md-6">
  <label className="form-label">Discount %</label>
  <input
    type="number"
    className="form-control"
    value={form.discount}
    onChange={(e) => setForm({...form, discount: parseFloat(e.target.value) || 0})}
    min="0"
    max="100"
    step="1"
  />
</div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Describe the product..."
            rows="3"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
        </div>
        
        <div className="col-12">
          <label className="form-label">Product Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageFiles}
          />
          <small className="text-muted">You can upload multiple images</small>
          
          {form.images.length > 0 && (
            <div className="mt-3">
              <label className="form-label">Preview Images:</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="position-relative">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={() => removeImage(idx)}
                      style={{ transform: "translate(30%, -30%)" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-success">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
        
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}
        
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            // Add sample product for testing
            setForm({
              id: null,
              title: `Test Product ${Math.floor(Math.random() * 1000)}`,
              description: "This is a sample product description",
              category: "Electronics",
              price: (Math.random() * 100 + 10).toFixed(2),
              discount: 0,        // new field (percentage
              images: []
            });
          }}
        >
          Fill Sample Data
        </button>
      </div>
    </form>
  );
}