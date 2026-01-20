import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Lock, Menu, X, LogOut } from "lucide-react";
import { ADMIN_TABS } from "../../constants/admin";
import { isAuthenticated, getAuthEmail, clearAuth } from "../../utils/auth";
import "./AdminDashboard.css";
import AdminRecords from "./AdminRecords";
import ValidateReceipt from "./ValidateReceipt";
import ChangePassword from "./ChangePassword";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(ADMIN_TABS.RECORDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const adminEmail = getAuthEmail();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <img
            src="/Public/fosla-logo.png.jpg"
            alt="FOSLA Academy Logo"
            className="admin-header-logo"
          />
        </div>
        <div className="header-center">
          <h1>FOSLA ACADEMY KARSHI</h1>
          <h2>Admin Dashboard</h2>
        </div>
        <div className="header-right">
          <span className="admin-email">{adminEmail}</span>
          <button onClick={handleLogout} className="logout-btn desktop-only">
            Logout
          </button>
          <button 
            className="hamburger-btn mobile-only" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-admin-email">{adminEmail}</span>
              <button 
                className="close-menu-btn" 
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="mobile-menu-nav">
              <button
                className={`mobile-menu-item ${activeTab === ADMIN_TABS.RECORDS ? "active" : ""}`}
                onClick={() => handleTabChange(ADMIN_TABS.RECORDS)}
              >
                <FileText size={20} />
                <span>All Records</span>
              </button>
              <button
                className={`mobile-menu-item ${activeTab === ADMIN_TABS.VALIDATE ? "active" : ""}`}
                onClick={() => handleTabChange(ADMIN_TABS.VALIDATE)}
              >
                <CheckCircle size={20} />
                <span>Validate Receipt</span>
              </button>
              <button
                className={`mobile-menu-item ${activeTab === ADMIN_TABS.PASSWORD ? "active" : ""}`}
                onClick={() => handleTabChange(ADMIN_TABS.PASSWORD)}
              >
                <Lock size={20} />
                <span>Change Password</span>
              </button>
              <button className="mobile-menu-item logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Navigation Tabs - Desktop Only */}
      <nav className="admin-nav desktop-only" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === ADMIN_TABS.RECORDS}
          className={`nav-btn ${activeTab === ADMIN_TABS.RECORDS ? "active" : ""}`}
          onClick={() => handleTabChange(ADMIN_TABS.RECORDS)}
        >
          <FileText size={18} />
          <span>All Records</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === ADMIN_TABS.VALIDATE}
          className={`nav-btn ${activeTab === ADMIN_TABS.VALIDATE ? "active" : ""}`}
          onClick={() => handleTabChange(ADMIN_TABS.VALIDATE)}
        >
          <CheckCircle size={18} />
          <span>Validate Receipt</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === ADMIN_TABS.PASSWORD}
          className={`nav-btn ${activeTab === ADMIN_TABS.PASSWORD ? "active" : ""}`}
          onClick={() => handleTabChange(ADMIN_TABS.PASSWORD)}
        >
          <Lock size={18} />
          <span>Change Password</span>
        </button>
      </nav>

      {/* Content Area */}
      <div className="admin-content" role="tabpanel">
        {activeTab === ADMIN_TABS.RECORDS && <AdminRecords />}
        {activeTab === ADMIN_TABS.VALIDATE && <ValidateReceipt />}
        {activeTab === ADMIN_TABS.PASSWORD && <ChangePassword />}
      </div>
    </div>
  );
}

export default AdminDashboard;
