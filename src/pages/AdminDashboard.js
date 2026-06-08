import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  const properties = [
    { id: 1, title: 'Modern Apartment', location: 'Chennai', price: '₹45,00,000', status: 'For Sale', type: 'Apartment', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop' },
    { id: 2, title: 'Independent Villa', location: 'Coimbatore', price: '₹85,00,000', status: 'For Sale', type: 'Villa', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop' },
    { id: 3, title: 'Commercial Office', location: 'Tiruppur', price: '₹25,000/mo', status: 'For Rent', type: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop' },
    { id: 4, title: 'Budget Studio Flat', location: 'Madurai', price: '₹18,00,000', status: 'For Sale', type: 'Apartment', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=200&fit=crop' },
    { id: 5, title: 'Luxury Penthouse', location: 'Chennai', price: '₹2,10,00,000', status: 'For Sale', type: 'Penthouse', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=200&fit=crop' },
    { id: 6, title: 'Cozy 2BHK Flat', location: 'Salem', price: '₹12,000/mo', status: 'For Rent', type: 'Apartment', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=200&fit=crop' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/user-dashboard/');
        setData(res.data);
      } catch (err) {
        localStorage.clear();
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDelete = (id) => {
    alert(`Property ${id} deleted! (demo)`);
  };

  const handleEdit = (id) => {
    alert(`Edit property ${id}! (demo)`);
  };

  const handleAddProperty = () => {
    alert('Add property form coming soon!');
  };

  if (!data) return <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>;

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.brand}>🏠 PropFinder</h2>
        <div style={styles.navRight}>
          <span style={styles.adminBadge}>👑 Admin</span>
          <span style={styles.welcomeText}>Hello, {data.users?.[0]?.name || 'Admin'}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{data.total_users}</h3>
          <p style={styles.statLabel}>Total Users</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{properties.length}</h3>
          <p style={styles.statLabel}>Properties</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {properties.filter(p => p.status === 'For Sale').length}
          </h3>
          <p style={styles.statLabel}>For Sale</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {properties.filter(p => p.status === 'For Rent').length}
          </h3>
          <p style={styles.statLabel}>For Rent</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        <button
          style={activeTab === 'users' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('users')}
        >
          👥 Manage Users
        </button>
        <button
          style={activeTab === 'properties' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('properties')}
        >
          🏠 Manage Properties
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={styles.tableWrapper}>
          <h3 style={styles.sectionTitle}>All Registered Users</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Verified</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.users?.map((user, index) => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.phone}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: user.role === 'admin' ? '#4f46e5' : '#10b981'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: user.is_verified ? '#10b981' : '#ef4444'
                    }}>
                      {user.is_verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div style={styles.tableWrapper}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>All Properties</h3>
            <button style={styles.addBtn} onClick={handleAddProperty}>
              + Add Property
            </button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr key={property.id} style={styles.tableRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>
                    <img
                      src={property.image}
                      alt={property.title}
                      style={styles.tableImage}
                    />
                  </td>
                  <td style={styles.td}>{property.title}</td>
                  <td style={styles.td}>{property.location}</td>
                  <td style={styles.td} >{property.price}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: property.status === 'For Sale' ? '#4f46e5' : '#10b981'
                    }}>
                      {property.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(property.id)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(property.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  brand: { margin: 0, color: '#4f46e5', fontSize: '22px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  adminBadge: { backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
  welcomeText: { fontSize: '14px', color: '#555' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '24px 32px 0' },
  statCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' },
  statNumber: { margin: '0 0 4px', fontSize: '32px', color: '#4f46e5' },
  statLabel: { margin: 0, color: '#888', fontSize: '13px' },
  tabRow: { display: 'flex', gap: '12px', padding: '24px 32px 0' },
  tab: { padding: '10px 24px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' },
  tabActive: { padding: '10px 24px', backgroundColor: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: 'bold' },
  tableWrapper: { margin: '16px 32px', backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { margin: '0 0 16px', color: '#1f2937', fontSize: '18px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#f3f4f6' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' },
  tableRow: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' },
  tableImage: { width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' },
  addBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  editBtn: { padding: '5px 12px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
  deleteBtn: { padding: '5px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
};

export default AdminDashboard;