import { useState, useEffect } from "react";

const SETTINGS_KEY = "site_settings";

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) return {};
  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

export default function SettingsForm() {
  const [settings, setSettings] = useState(loadSettings());

  // حفظ الإعدادات في localStorage
  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    alert("✅ Settings saved successfully!");
    // يرسل إشارة لباقي الصفحات مثل Home
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  return (
    <form
      className="p-3 border rounded bg-light"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className="mb-3">
        <label className="form-label">Site Title</label>
        <input
          type="text"
          className="form-control"
          value={settings.title || ""}
          onChange={(e) =>
            setSettings({ ...settings, title: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Email</label>
        <input
          type="email"
          className="form-control"
          value={settings.email || ""}
          onChange={(e) =>
            setSettings({ ...settings, email: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Phone</label>
        <input
          type="text"
          className="form-control"
          value={settings.phone || ""}
          onChange={(e) =>
            setSettings({ ...settings, phone: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contact Address</label>
        <input
          type="text"
          className="form-control"
          value={settings.address || ""}
          onChange={(e) =>
            setSettings({ ...settings, address: e.target.value })
          }
        />
      </div>

      <button type="submit" className="btn btn-success w-100">
        💾 Save Settings
      </button>
    </form>
  );
}
