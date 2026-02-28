import { useState, useEffect } from 'react';
import api from '../../api';

export default function PacksManagement() {
  const [packs, setPacks] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    products: [],
    price: '',
    images: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const res = await api.get('/packs');
      setPacks(res.data);
    } catch (err) {
      console.error('Failed to fetch packs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert('Fill name and price');

    const packData = {
      name: form.name,
      description: form.description,
      products: form.products.map(p => p._id || p.id),
      price: parseFloat(form.price),
      images: form.images
    };

    try {
      if (form.id) {
        await api.put(`/packs/${form.id}`, packData);
      } else {
        await api.post('/packs', packData);
      }
      fetchPacks();
      resetForm();
    } catch (err) {
      console.error('Failed to save pack', err);
    }
  };

  const editPack = (pack) => {
    setForm({
      id: pack._id,
      name: pack.name,
      description: pack.description,
      products: pack.products, // products might be populated
      price: pack.price,
      images: pack.images || []
    });
  };

  const deletePack = async (id) => {
    if (window.confirm('Delete pack?')) {
      try {
        await api.delete(`/packs/${id}`);
        fetchPacks();
      } catch (err) {
        console.error('Failed to delete pack', err);
      }
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', description: '', products: [], price: '', images: [] });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Packs Management</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5>{form.id ? 'Edit Pack' : 'New Pack'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="mb-3">
              <label>Price</label>
              <input type="number" className="form-control" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label>Images</label>
              <input type="file" className="form-control" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="mt-2 d-flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="position-relative">
                    <img src={img} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded border" />
                    <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-success">{form.id ? 'Update' : 'Create'}</button>
            {form.id && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>Existing Packs ({packs.length})</h5>
          {packs.length === 0 ? (
            <p className="text-muted">No packs</p>
          ) : (
            <table className="table">
              <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Products</th><th>Actions</th></tr></thead>
              <tbody>
                {packs.map(pack => (
                  <tr key={pack._id}>
                    <td>{pack.images?.[0] ? <img src={pack.images[0]} style={{ width: 40, height: 40, objectFit: 'cover' }} /> : 'No img'}</td>
                    <td>{pack.name}</td>
                    <td>${pack.price.toFixed(2)}</td>
                    <td>{pack.products?.length || 0}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editPack(pack)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deletePack(pack._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}