
import { useEffect, useState } from 'react'; import AdminLayout from '../../components/AdminLayout'; import { API_BASE } from '../../components/config'; import { authHeaders, getToken } from '../../components/auth';
type Package={id:string; title:string; price:string; tags:string[]; summary:string; details:string;};
export default function AdminPackages(){
  const [items, setItems] = useState<Package[]>([]); const [form, setForm] = useState<Package>({ id:'', title:'', price:'', tags:[], summary:'', details:'' }); const [msg, setMsg] = useState<string>('');
  const load = async ()=>{ const r=await fetch(`${API_BASE}/api/admin/services`,{ headers:{...authHeaders()} }); setItems(await r.json()); };
  useEffect(()=>{ if(!getToken()){ window.location.href='/admin/login'; return; } load(); },[]);
  const save = async (e:React.FormEvent)=>{ e.preventDefault(); const payload={ title:form.title, price:form.price, tags:form.tags, summary:form.summary, details:form.details }; let r:Response; if(form.id) r=await fetch(`${API_BASE}/api/admin/services/${form.id}`,{ method:'PUT', headers:{'Content-Type':'application/json', ...authHeaders()}, body:JSON.stringify(payload) }); else r=await fetch(`${API_BASE}/api/admin/services`,{ method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body:JSON.stringify(payload) }); if(r.ok){ setForm({ id:'', title:'', price:'', tags:[], summary:'', details:'' }); setMsg('Saved.'); load(); } else setMsg('Failed to save.'); };
  const edit = (p:Package)=>setForm(p);
  const del = async (id:string)=>{ if(!confirm('Delete this package?')) return; const r=await fetch(`${API_BASE}/api/admin/services/${id}`,{ method:'DELETE', headers:{...authHeaders()} }); if(r.ok) load(); };
  return (<AdminLayout title="Packages / Services"><div className="row g-4">
    <div className="col-lg-5"><div className="card-luxe p-4"><h5 className="mb-3">{form.id?'Update Package':'Create Package'}</h5>
      <form onSubmit={save} className="d-grid gap-3">
        <div><label className="form-label">Title</label><input className="form-control" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/></div>
        <div><label className="form-label">Price</label><input className="form-control" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required/></div>
        <div><label className="form-label">Tags (comma separated)</label><input className="form-control" value={form.tags.join(', ')} onChange={e=>setForm({...form, tags:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})}/></div>
        <div><label className="form-label">Summary</label><textarea className="form-control" rows={2} value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})} required/></div>
        <div><label className="form-label">Details</label><textarea className="form-control" rows={6} value={form.details} onChange={e=>setForm({...form, details:e.target.value})} required/></div>
        <div className="d-flex gap-2"><button className="btn btn-gold">{form.id?'Update':'Create'}</button>{form.id&&<button type="button" className="btn btn-outline-light" onClick={()=>setForm({ id:'', title:'', price:'', tags:[], summary:'', details:'' })}>Cancel</button>}</div>
        {msg&&<div className="alert alert-info mt-2">{msg}</div>}
      </form></div></div>
    <div className="col-lg-7"><div className="card-luxe p-4"><h5 className="mb-3">Existing Packages</h5><div className="list-group list-group-flush">
      {items.map(p=>(<div key={p.id} className="list-group-item bg-transparent text-white border-secondary"><div className="d-flex justify-content-between align-items-start">
        <div><div className="fw-semibold">{p.title} <span className="badge-gold ms-2">{p.price}</span></div><small className="text-secondary">{p.tags.join(', ')}</small><div className="text-secondary mt-2" style={{whiteSpace:'pre-wrap'}}>{p.summary}</div></div>
        <div className="d-flex gap-2"><button className="btn btn-sm btn-outline-light" onClick={()=>edit(p)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>del(p.id)}>Delete</button></div>
      </div></div>))}{items.length===0&&<div className="text-secondary">No packages yet.</div>}
    </div></div></div></div></AdminLayout>);
}
