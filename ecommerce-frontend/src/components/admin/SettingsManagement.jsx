import { useState, useEffect } from 'react';
import api from '../../api';

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    siteName: 'TREX Shop',
    currency: '$',
    email: '',
    phone: '',
    address: '',
    shippingFee: 5,
    taxRate: 0,
    maintenanceMode: false,
    logo: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const saveSettings = async () => {
    try {
      await api.put('/settings', settings);
      setMessage('Settings saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  const resetAllSettings = async () => {
    if (window.confirm('Reset to default?')) {
      const defaultSettings = {
        siteName: 'TREX Shop',
        currency: '$',
        email: '',
        phone: '',
        address: '',
        shippingFee: 5,
        taxRate: 0,
        maintenanceMode: false,
        logo: ''
      };
      setSettings(defaultSettings);
      await api.put('/settings', defaultSettings);
      setMessage('Reset to default');
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label>Site Name</label>
                <input className="form-control" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
              </div>
              <div className="mb-3">
                <label>Currency Symbol</label>
                <input className="form-control" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input className="form-control" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
              </div>
              <div className="mb-3">
                <label>Phone</label>
                <input className="form-control" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
              </div>
              <div className="mb-3">
                <label>Address</label>
                <textarea className="form-control" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Shipping Fee ($)</label>
                  <input type="number" className="form-control" value={settings.shippingFee} onChange={e => setSettings({...settings, shippingFee: parseFloat(e.target.value)})} />
                </div>
                <div className="col-md-6">
                  <label>Tax Rate (%)</label>
                  <input type="number" className="form-control" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="form-check mt-3">
                <input className="form-check-input" type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} />
                <label>Maintenance Mode</label>
              </div>
              <button className="btn btn-success mt-3 me-2" onClick={saveSettings}>Save</button>
              <button className="btn btn-secondary mt-3" onClick={resetAllSettings}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}