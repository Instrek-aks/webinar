import React, { useState, useEffect } from 'react';
import { 
  Download, Search, Users, Calendar, 
  Mail, Phone, Globe, MapPin, ArrowLeft,
  Loader2, RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';

const ZOOM_LINK = "https://us06web.zoom.us/j/89081201247?pwd=pWpybefqajKEYypSXjiFvz31M2vgrb.1";
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? "http://localhost:5000" : window.location.origin);

const API_URL = API_BASE_URL.endsWith('/api/registrations') ? API_BASE_URL : `${API_BASE_URL.replace(/\/$/, '')}/api/registrations`;

export default function AdminDashboard({ onBack }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      
      setRegistrations(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations.map(r => ({
      Name: r.name,
      Email: r.email
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Webinar_Registrations_${new Date().toLocaleDateString()}.xlsx`);
  };

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading student records...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Managing {registrations.length} registered students</p>
          </div>
        </div>
        <div className="admin-header-actions">
          <button onClick={fetchRegistrations} disabled={refreshing} className="refresh-btn" title="Refresh">
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={handleExport} className="export-btn">
            <Download size={18} />
            Export to Excel
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id}>
                  <td>
                    <div className="student-cell">
                      <div className="avatar">{reg.name.charAt(0)}</div>
                      <div className="name">{reg.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="email"><Mail size={12} /> {reg.email}</div>
                  </td>
                </tr>
              ))}
              {filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan="2" className="empty-state">
                    No registrations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
