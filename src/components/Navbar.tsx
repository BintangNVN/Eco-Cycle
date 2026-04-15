import { useState, useEffect } from "react";
// Import API untuk mengambil profil terbaru
import { getMyProfile } from "../services/api/api"; 

type NavbarProps = {
  token: string | null;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onLogout?: () => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
  onProfile?: () => void; 
  showSearch?: boolean;
};

export default function Navbar({
  token,
  searchTerm = "",
  onSearchChange,
  onLogout,
  onMyPost,
  onMyOrders,
  onProfile, 
  showSearch = true,
}: NavbarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // === STRATEGI BARU: AMBIL DATA FRESH DARI BACKEND ===
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        // Tembak API Profile (POST /auth/get-profile)
        const response = await getMyProfile();
        // Sesuaikan dengan struktur data backend-mu
        const user = response.data?.data?.user || response.data?.data || response.data;
        
        setUserData(user);

        // Update localStorage supaya data di tempat lain juga ikut fresh
        if (user) {
          localStorage.setItem("user_data", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Gagal sinkronisasi data user di Navbar:", error);
        
        // JIKA API GAGAL: Gunakan data lama dari storage sebagai cadangan
        const savedData = localStorage.getItem("user_data") || sessionStorage.getItem("user_data");
        if (savedData) {
          setUserData(JSON.parse(savedData));
        }
      }
    };

    fetchUserData();
  }, [token]);

  // Logika menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileDropdown]);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleViewProfileClick = () => {
    setShowProfileDropdown(false);
    onProfile?.();
  };

  const handleMyPostClick = () => {
    setShowProfileDropdown(false);
    onMyPost?.();
  };

  const handleMyOrdersClick = () => {
    setShowProfileDropdown(false);
    onMyOrders?.();
  };

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    onLogout?.();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <polyline points="23 20 23 14 17 14"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
        EcoCycle
      </div>

      {showSearch && (
        <div className="navbar-search">
          <svg className="navbar-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search for anything..."
          />
        </div>
      )}

      <div className="navbar-right">
        <div className="navbar-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {/* Lokasi akan otomatis muncul jika API get-profile berhasil */}
          <p className="navbar-location-text">{userData?.location || "Lokasi Belum Diatur"}</p>
        </div>

        <button className="navbar-cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>

        {token ? (
          <div className="profile-dropdown-container">
            <div 
              className="navbar-avatar" 
              onClick={handleProfileClick} 
              style={{ 
                width: '40px', 
                height: '40px', 
                fontSize: '25px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {userData?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={handleViewProfileClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  My Profile
                </button>

                <button className="dropdown-item" onClick={handleMyOrdersClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7h18v14H3z"/><path d="M3 11h18"/><path d="M7 7v-3"/>
                  </svg>
                  My Orders
                </button>

                <button className="dropdown-item" onClick={handleMyPostClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
                  </svg>
                  My Post
                </button>

                <div className="dropdown-divider" />

                <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-outline">Login</button>
            <button className="btn-primary">Register</button>
          </div>
        )}
      </div>
    </nav>
  );
}