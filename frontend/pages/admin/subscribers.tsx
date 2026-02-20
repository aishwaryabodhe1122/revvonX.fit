import { useEffect, useState } from 'react'; import AdminLayout from '../../components/AdminLayout'; import { API_BASE } from '../../components/config'; import { authHeaders, getToken } from '../../components/auth';

type Subscriber = { id: string; email: string; created_at: string; };

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/admin/subscribers`, {
        headers: { ...authHeaders() }
      });
      if (r.ok) {
        setSubscribers(await r.json());
      }
    } catch (error) {
      setMessage('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    try {
      const r = await fetch(`${API_BASE}/api/admin/subscribers/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });
      if (r.ok) {
        setMessage('Subscriber deleted successfully');
        load();
      } else {
        setMessage('Failed to delete subscriber');
      }
    } catch (error) {
      setMessage('Error deleting subscriber');
    }
  };

  useEffect(() => {
    if (!getToken()) {
      window.location.href = '/admin/login';
      return;
    }
    load();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout title="Subscribers">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-white mb-0">Newsletter Subscribers</h4>
          <span className="badge bg-info">{subscribers.length} Total</span>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-white py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card-luxe">
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Subscribed On</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber.id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                              📧
                            </div>
                          </div>
                          <span>{subscriber.email}</span>
                        </div>
                      </td>
                      <td>
                        <small className="text-secondary">{formatDate(subscriber.created_at)}</small>
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => deleteSubscriber(subscriber.id)}
                          title="Delete subscriber"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && (
                <div className="text-center text-secondary py-5">
                  <div className="fs-1 mb-3">📭</div>
                  <p>No subscribers yet. When users subscribe to the newsletter, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
