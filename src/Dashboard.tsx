import { useEffect, useState } from "react";
import { getUsers, logout } from "./api";

type DashboardProps = {
  token: string;
  onLogout: () => void;
};

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function loadUsers() {
      setLoading(true);
      setError(null);

      try {
        const response = await getUsers(token);
        if (!canceled) {
          setUsers(response.data ?? []);
        }
      } catch (err) {
        if (!canceled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      canceled = true;
    };
  }, [token]);

  const handleLogout = async () => {
    try {
      await logout(token);
    } catch {
      // ignore error
    }

    onLogout();
  };

  return (
    <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1>Dashboard</h1>
          <p>Selamat datang! Berikut daftar pengguna yang didapat dari API.</p>
        </div>

        <button
          style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.2)", background: "white", cursor: "pointer" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {error ? (
        <div style={{ color: "#b00020" }}>Gagal memuat data: {error}</div>
      ) : loading ? (
        <div>Memuat...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>ID</th>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Nama</th>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "12px" }}>Belum ada data pengguna.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id ?? user._id ?? user.email}>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>{user.id ?? user._id}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>{user.name ?? "-"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>{user.email ?? "-"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>{user.role ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
