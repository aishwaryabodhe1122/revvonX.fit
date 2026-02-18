
import { useEffect, useState } from 'react'; import AdminLayout from '../../components/AdminLayout'; import { API_BASE } from '../../components/config'; import { authHeaders, getToken } from '../../components/auth';
type Contact={id:string; name:string; email:string; phone:string; whatsapp?:string; query:string; created_at:string;};
export default function AdminContacts(){
  const [items, setItems] = useState<Contact[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string>('');
  const load = async ()=>{ if(!getToken()){ window.location.href='/admin/login'; return; } try{ const r=await fetch(`${API_BASE}/api/admin/contacts`,{ headers:{...authHeaders()} }); if(!r.ok) throw new Error(await r.text()); setItems(await r.json()); } catch(e:any){ setError(e.message||'Failed to load'); } finally { setLoading(false); } };
  const del = async (id:string)=>{ if(!confirm('Delete this contact request?')) return; const r=await fetch(`${API_BASE}/api/admin/contacts/${id}`, { method:'DELETE', headers:{...authHeaders()} }); if(r.ok) setItems(items.filter(i=>i.id!==id)); };
  useEffect(()=>{ load(); },[]);
  return (<AdminLayout title="Contact Requests">{loading&&<p className="text-secondary">Loading...</p>}{error&&<div className="alert alert-danger">{error}</div>}
    {!loading&&!error&&(<div className="table-responsive card-luxe p-3"><table className="table table-dark align-middle">
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>WhatsApp</th><th>Query</th><th>Received</th><th></th></tr></thead>
      <tbody>{items.map(i=>(<tr key={i.id}><td>{i.id}</td><td>{i.name}</td><td>{i.email}</td><td>{i.phone}</td><td>{i.whatsapp||'-'}</td><td style={{maxWidth:360, whiteSpace:'pre-wrap'}}>{i.query}</td><td>{new Date(i.created_at).toLocaleString()}</td><td><button className="btn btn-sm btn-outline-danger" onClick={()=>del(i.id)}>Delete</button></td></tr>))}{items.length===0&&<tr><td colSpan={8} className="text-center text-secondary">No contact requests yet.</td></tr>}</tbody>
    </table></div>)}</AdminLayout>);
}
