import { useEffect, useState, type FormEvent } from "react";
import type { NearbyItem } from "./ItemDetails";
import "../styles/css/dashboard.css";

// IMPORT KOMPONEN NAVBAR & API
import Navbar from "../components/Navbar"; 
import api, { getMyPosts, createPost, getCategories } from "../services/api/api"; 

type MyPostProps = {
  token: string | null;
  onBack: () => void;
  onLogout: () => void;
  onProfile?: () => void;
  onMyOrders?: () => void;
  onViewDetails: (item: NearbyItem) => void;
};

interface ExtendNearbyItem extends Omit<NearbyItem, 'weight'> {
  id: string;
  name?: string;
  label?: string;
  poitRewards?: number | string;
  image?: string[]; 
  category?: { id: string; name: string };
  categoryId?: string;
  condition?: string;
  weight?: number | string;
  price?: number | string;
  description?: string;
  location?: string;
}

const conditions = [
  { label: "Bekas Bagus", value: "good" },
  { label: "Baru", value: "new" },
  { label: "Bekas Rusak", value: "bad" }
];

// Form bawaan dikosongkan saat tambah baru
const initialForm = { title: "", condition: "", categoryId: "", weight: "", points: "", price: "", description: "", location: "" };

function ItemCard({ item, onEdit, onDelete }: { item: ExtendNearbyItem; onEdit: (item: ExtendNearbyItem) => void; onDelete: (id: string) => void; }) {
  const displayTitle = item.name || item.label || item.title || "Untitled Product";
  const imageBaseUrl = "https://service-capstone-project.vercel.app";
  
  let imageUrl = (item.image && item.image[0]) 
    ? (item.image[0].startsWith("http") 
        ? item.image[0] 
        : `${imageBaseUrl}${item.image[0].startsWith('/') ? '' : '/'}${item.image[0]}`) 
    : "";

  return (
    <div className="item-card">
      <div className="card-img-wrap">
        {imageUrl ? <img src={imageUrl} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="card-img-placeholder">♻️</div>}
      </div>
      <div className="card-body">
        <div className="card-meta-top">
          <div className="card-location">{item.location || "Bogor"}</div>
          <span className="card-weight">{item.weight || "0"} kg</span>
        </div>
        <div className="card-title">{displayTitle}</div>
      </div>
      <div className="card-footer" style={{ gap: "8px" }}>
        {/* Tombol Edit ini akan mengirim seluruh data item (termasuk item.id) ke fungsi handleEdit */}
        <button className="btn-outline" style={{ flex: 1, padding: "8px" }} onClick={() => onEdit(item)}>Edit</button>
        <button className="btn-primary" style={{ flex: 1, padding: "8px", backgroundColor: "#dc3545", borderColor: "#dc3545" }} onClick={() => onDelete(item.id)}>Delete</button>
      </div>
    </div>
  );
}

export default function MyPost({ token, onBack, onLogout, onProfile, onMyOrders, onViewDetails }: MyPostProps) { 
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [posts, setPosts] = useState<ExtendNearbyItem[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPosts = async () => {
    setPageLoading(true);
    try {
      const res = await getMyPosts();
      setPosts(res.data?.data?.posts || []);
    } catch (e) { console.error(e); }
    finally { setPageLoading(false); }
  };

  useEffect(() => {
    fetchPosts();
    getCategories().then(res => setApiCategories(res.data?.data || []));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus postingan ini?")) {
      try {
        await api.delete(`/post/${id}`);
        window.alert("Berhasil dihapus!");
        fetchPosts();
      } catch (error) { window.alert("Gagal menghapus."); }
    }
  };

  const handleEdit = (item: ExtendNearbyItem) => {
    // 1. KITA AMBIL ID POSTINGAN DI SINI
    setEditId(item.id);
    
    // 2. KITA MASUKKAN DATA LAMA KE DALAM FORM
    setFormData({
      title: item.name || item.label || "",
      condition: item.condition || "",
      categoryId: item.categoryId || "",
      weight: String(item.weight || ""),
      points: String(item.poitRewards || ""),
      price: String(item.price || "0"),
      description: item.description || "",
      location: item.location || ""
    });
    setShowCreatePost(true);
  };

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.title);
      submitData.append("label", formData.title);
      submitData.append("condition", formData.condition);
      submitData.append("categoryId", formData.categoryId); 
      submitData.append("weight", formData.weight);
      submitData.append("poitRewards", formData.points); 
      submitData.append("price", formData.price); 
      submitData.append("description", formData.description);
      
      // Kirim lokasi kalau backend kamu menerimanya, kalau tidak, hapus saja baris ini:
      if (formData.location) submitData.append("location", formData.location);
      
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => submitData.append("image", file));
      }

      if (editId) {
        // 1. KITA HAPUS BARIS INI KARENA NGGAK PERLU SPOOFING
        // submitData.append("_method", "PATCH"); 
        
        // 2. GANTI api.post MENJADI api.patch
        await api.patch(`/post/${editId}`, submitData); 
        
        window.alert("Postingan berhasil diperbarui!");
      } else {
        await createPost(submitData);
        window.alert("Postingan berhasil dibuat!");
      }

      // Bersihkan form setelah sukses
      setShowCreatePost(false);
      setEditId(null);
      setFormData(initialForm);
      setImageFiles([]);
      setImagePreviews([]);
      fetchPosts();
    } catch (error: any) { 
      console.error(error.response?.data);
      window.alert("Gagal memproses postingan. Cek Console untuk detail error."); 
    } finally { setSubmitLoading(false); }
  };

  const filteredPosts = posts.filter(item => 
    (item.name || item.label || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="eco-app">
      <Navbar 
        token={token}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onLogout={onLogout}
        onProfile={onProfile}
        onMyOrders={onMyOrders}
        showSearch={true}
      />

      {showCreatePost ? (
        <div className="main-content create-post-page">
          <div className="cat-header">
            <button className="back-btn" onClick={() => { setShowCreatePost(false); setEditId(null); setFormData(initialForm); setImagePreviews([]); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: '6px'}}>
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <div className="section-title">{editId ? "Edit Post" : "Add New Post"}</div>
          </div>
          <form className="create-post-grid" onSubmit={handleCreatePost}>
            <div className="upload-panel">
              <div className="upload-dropzone">
                {imagePreviews.length > 0 ? (
                  <div className="upload-preview"><img src={imagePreviews[0]} alt="Preview" /></div>
                ) : (
                  <div className="upload-placeholder"><strong>{editId ? "Ubah Foto (Opsional)" : "Upload Photo"}</strong></div>
                )}
                <input className="upload-input" type="file" multiple onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files).slice(0,3) : [];
                  setImageFiles(files);
                  setImagePreviews(files.map(f => URL.createObjectURL(f)));
                }} />
              </div>
            </div>
            <div className="create-post-form">
              <div className="form-group">
                <label>Product Name</label>
                <input className="form-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-row-flex">
                <div className="form-group">
                  <label>Condition</label>
                  <select className="form-input" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} required>
                    <option value="">Select</option>
                    {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                    <option value="">Select</option>
                    {apiCategories.map(c => <option key={c.id} value={c.id}>{c.name || c.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row-flex">
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input className="form-input" type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Points Reward</label>
                  <input className="form-input" type="number" value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} required />
                </div>
                {/* ⭐️ SAYA TAMBAHKAN KOTAK INPUT PRICE DI SINI AGAR BISA DIEDIT ⭐️ */}
                <div className="form-group">
                  <label>Price (Rp)</label>
                  <input className="form-input" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detail barang..." />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitLoading}>
                  {submitLoading ? "Processing..." : (editId ? "Save Changes" : "Send Post")}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="main-content">
          <div className="section-header">
            <div className="section-title">My Posts</div>
            <button className="view-all-btn" onClick={() => setShowCreatePost(true)}>Create Post +</button>
          </div>
          {pageLoading ? <p>Loading posts...</p> : (
            <div className="cards-grid">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(item => (
                  <ItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <div className="empty-state">Belum ada postingan.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}