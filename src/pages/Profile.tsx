import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// KITA IMPORT getMyProfile YANG BARU KITA BIKIN
import { getMyProfile } from "../services/api/api"; 
import "../styles/css/dashboard.css";

type ProfileProps = {
  token: string | null;
  onLogout: () => void;
  onBack: () => void;
  userId?: string; 
  onMyPost?: () => void;   
  onMyOrders?: () => void; 
};

export default function Profile({ token, onLogout, onBack, onMyPost, onMyOrders }: ProfileProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // KITA LANGSUNG TEMBAK API POST-NYA (Tanpa butuh ID)
        const response = await getMyProfile();
        
        // Sesuaikan jika datanya ada di response.data.user atau response.data.data
        setUserData(response.data?.data?.user || response.data?.data || response.data);
      } catch (error) {
        console.error("Gagal ambil detail user:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (loading) return <div className="empty-state"><p>Memuat profil...</p></div>;

  return (
    <div className="eco-app">
      <Navbar token={token} onLogout={onLogout} onMyPost={onMyPost} onMyOrders={onMyOrders} showSearch={false} />
      
      <div className="main-content">
        <div className="cat-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: '6px'}}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Kembali
          </button>
          <div className="section-title">Profil Saya</div>
        </div>

        <div className="profile-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          
          <div className="item-details-seller-card" style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <div className="item-details-seller-avatar" style={{ width: '80px', height: '80px', fontSize: '36px', marginBottom: '15px' }}>
                {userData?.name?.charAt(0).toUpperCase() || "U"}
             </div>
             <h2 style={{ marginBottom: '5px', color: '#333' }}>{userData?.name || "Nama Tidak Ditemukan"}</h2>
             <p style={{ color: '#666', marginBottom: '10px' }}>{userData?.email || "email@tidakditemukan.com"}</p>
          </div>

          <div className="item-details-description" style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '12px' }}>
             <h3 style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee', fontSize: '16px' }}>Detail Informasi</h3>
             
             <div style={{ marginBottom: '15px' }}>
                <small style={{ color: '#888', display: 'block', marginBottom: '4px' }}>Nomor Telepon</small>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>{userData?.phoneNumber || userData?.phone || "-"}</div>
             </div>
             
             <div style={{ marginBottom: '15px' }}>
                <small style={{ color: '#888', display: 'block', marginBottom: '4px' }}>Lokasi</small>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>
                  {userData?.location || "-"}
                </div>
             </div>
          </div>

          <div className="item-details-description" style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Aktivitas Saya</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-outline" onClick={onMyPost} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
                  Postingan Saya
                </span>
                <span>➔</span>
              </button>
              
              <button className="btn-outline" onClick={onMyOrders} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18v14H3z"/><path d="M3 11h18"/><path d="M7 7v-3"/></svg>
                  Pesanan Saya
                </span>
                <span>➔</span>
              </button>
            </div>
          </div>
          
          <button className="btn-primary" onClick={onLogout} style={{ width: '100%', marginTop: '30px', backgroundColor: '#dc3545', borderColor: '#dc3545', padding: '14px', fontSize: '16px' }}>
            Keluar dari Akun
          </button>

        </div>
      </div>
    </div>
  );
}