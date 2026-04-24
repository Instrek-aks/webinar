import React, { useState, useEffect } from 'react';
import { 
  Copy, Check, Calendar, Clock, GraduationCap, 
  ChevronRight, ExternalLink, ShieldCheck, Sparkles, 
  User, Mail, Phone, MapPin, Globe, CheckCircle2 
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminDashboard';

const GMEET_LINK = "https://meet.google.com/kcn-odrt-ean";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/register"; 

function LandingPage() {
  const [formData, setFormData] = useState({
    name: '', college: '', pincode: '', email: '', contact: ''
  });
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }
      
      setStatus('success');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(GMEET_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 1. Navbar */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <div style={{ background: 'var(--navy)', color: 'var(--gold)', width: '32px', height: '32px', display: 'grid', placeItems: 'center', borderRadius: '6px', fontWeight: 'bold' }}>L</div>
            Legal<span>Olympiad</span>
          </a>
          <Link 
            to="/admin/legalo/registeredstu"
            style={{ 
              background: 'transparent', 
              color: 'var(--gold)', 
              border: '1px solid var(--gold)', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.8rem',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            className="admin-link-btn"
          >
            Admin Portal
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero">
        <div className="hero-inner">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hero-text"
          >
            <div className="flex items-center gap-2 text-gold-soft mb-6 text-sm font-mono tracking-widest uppercase">
              Masterclass Series 2026
            </div>
            <h1>The Power to Say Yes <span>(or No)</span></h1>
            <p>
              Unlock the complexities of <strong>Free Consent in Contracts</strong>. A specialized session built for law students and litigators seeking courtroom clarity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="floating-info-card"
          >
            <div className="hero-meta-item">
              <div className="icon-box" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', borderRadius: '10px', width: '40px', height: '40px', display: 'grid', placeItems: 'center' }}>
                <Calendar size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5 }}>Date</div>
                <div style={{ fontWeight: 600 }}>25 April 2026</div>
              </div>
            </div>
            <div className="hero-meta-item">
              <div className="icon-box" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', borderRadius: '10px', width: '40px', height: '40px', display: 'grid', placeItems: 'center' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5 }}>Time</div>
                <div style={{ fontWeight: 600 }}>6:00 PM — 7:00 PM IST</div>
              </div>
            </div>
              <div className="hero-meta-item" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ background: 'var(--gold)', color: 'var(--navy)', width: '32px', height: '32px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                  <GraduationCap size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Asst. Professor Apoorv Gupta</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>JGLS, SONIPAT</div>
                </div>
              </div>
          </motion.div>
        </div>
      </header>

      {/* 4. Main Section: Form + Details */}
      <section className="main-section" id="enroll">
        <div className="main-grid">
          {/* Left: Enrollment Form */}
          <div className="form-card">
            <div className="form-title">
              <h2>Secure Your Seat</h2>
              <p>Enter your professional details to register for the masterclass.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input required type="text" placeholder="Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>College / University</label>
                <div className="input-with-icon">
                  <Globe className="input-icon" size={18} />
                  <input required type="text" placeholder="National Law School" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} />
                </div>
              </div>

              <div className="field-grid">
                <div className="form-group">
                  <label>Pincode</label>
                  <div className="input-with-icon">
                    <MapPin className="input-icon" size={18} />
                    <input required type="text" pattern="[0-9]{6}" placeholder="6 digits" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={18} />
                    <input required type="tel" placeholder="Mobile number" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label>Email ID</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input required type="email" placeholder="name@university.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <button disabled={status === 'loading'} className="enroll-btn-main">
                {status === 'loading' ? 'Processing Enrollment...' : (
                  <>Enroll Now <ChevronRight size={20} /></>
                )}
              </button>

              {status === 'error' && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', color: '#991B1B', fontSize: '0.85rem', textAlign: 'center' }}>
                  {errorMessage}
                </div>
              )}

            </form>
          </div>

          {/* Right: Webinar Details Card (Sticky) */}
          <div className="details-sidebar">
            <div className="sidebar-card">
              <h3>Webinar Highlights</h3>
              <ul className="benefit-list">
                <li className="benefit-item">
                  <CheckCircle2 className="check" size={20} />
                  <div className="benefit-text">
                    <strong>Courtroom Clarity</strong>
                    <span>Learn how the law actually works in court sessions.</span>
                  </div>
                </li>
                <li className="benefit-item">
                  <CheckCircle2 className="check" size={20} />
                  <div className="benefit-text">
                    <strong>Practical Insight</strong>
                    <span>Moving beyond theory into real-world contract nuances.</span>
                  </div>
                </li>
                <li className="benefit-item">
                  <CheckCircle2 className="check" size={20} />
                  <div className="benefit-text">
                    <strong>Competitive Edge</strong>
                    <span>Advanced knowledge for aspiring litigators.</span>
                  </div>
                </li>
                <li className="benefit-item">
                  <CheckCircle2 className="check" size={20} />
                  <div className="benefit-text">
                    <strong>Expert Guidance</strong>
                    <span>Led by Asst. Professor Apoorv Gupta from JGLS, Sonipat.</span>
                  </div>
                </li>
              </ul>

              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'white', borderRadius: '12px', border: '1px dashed var(--rule)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Session Link</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginBottom: '1rem' }}>Please copy the link to join the webinar.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy)' }}>
                  <Globe size={14} /> G-Meet Platform
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal (Overlay) */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[2000] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-6"
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11,31,58,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="success-card"
              style={{ background: 'white', padding: '4rem', borderRadius: '24px', maxWidth: '550px', width: '100%', textAlign: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'var(--gold-soft)', color: 'var(--gold)', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 2rem' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontFamily: 'IBM Plex Serif', fontSize: '2.5rem', marginBottom: '1rem' }}>Thank you for registering!</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: '2.5rem' }}>Below is the link to join the webinar:</p>
              
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', textAlign: 'left', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Joining Link</div>
                <div className="copy-link-wrapper">
                  <div className="link-text-box">{GMEET_LINK}</div>
                  <button onClick={handleCopy} className="copy-btn-modal">
                    {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setStatus('idle')}
                className="modal-ok-btn"
              >
                Done
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ padding: '4rem 2rem', background: '#F8FAFC', borderTop: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>© 2026 Legal Olympiad Academic Portal</div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="mailto:connect@legalolympiad.com" style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>connect@legalolympiad.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/legalo/registeredstu" element={<AdminDashboard onBack={() => window.location.href = "/"} />} />
      </Routes>
    </Router>
  );
}
