
import { useEffect, useState } from 'react'; import AdminLayout from '../../components/AdminLayout'; import BlogModal from '../../components/BlogModal'; import { API_BASE } from '../../components/config'; import { authHeaders, getToken } from '../../components/auth';
type Blog={id:string; title:string; excerpt:string; content:string; tags:string[]; media?:string[]; published_date:string;};
export default function AdminBlogs(){
  const [posts, setPosts] = useState<Blog[]>([]); const [form, setForm] = useState({ id:'', title:'', excerpt:'', content:'', tags:'' }); const [media, setMedia] = useState<string[]>([]); const [msg, setMsg] = useState<string>(''); const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const load = async ()=>{ const r=await fetch(`${API_BASE}/api/blogs`); setPosts(await r.json()); };
  useEffect(()=>{ if(!getToken()){ window.location.href='/admin/login'; return; } load(); },[]);
  const [uploading, setUploading] = useState(false);
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const r = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: formData
      });
      if (r.ok) {
        const data = await r.json();
        setMedia([...media, `${API_BASE}${data.url}`]);
      } else {
        alert('Failed to upload file');
      }
    } catch (err) {
      alert('Upload error: ' + err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };
  const removeMedia = (idx: number) => { setMedia(media.filter((_, i) => i !== idx)); };
  const savePost = async (e:React.FormEvent)=>{ e.preventDefault(); setMsg(''); const payload = { title:form.title, excerpt:form.excerpt, content:form.content, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean), media }; let r:Response; if(form.id) r=await fetch(`${API_BASE}/api/admin/blogs/${form.id}`,{ method:'PUT', headers:{'Content-Type':'application/json', ...authHeaders()}, body:JSON.stringify(payload)}); else r=await fetch(`${API_BASE}/api/admin/blogs`,{ method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body:JSON.stringify(payload)}); if(r.ok){ setForm({ id:'', title:'', excerpt:'', content:'', tags:'' }); setMedia([]); await load(); setMsg(form.id ? 'Blog updated successfully.' : 'Blog published successfully.'); } else setMsg('Failed to save blog.'); };
  const editPost = (p:Blog)=>{ setForm({ id:p.id, title:p.title, excerpt:p.excerpt, content:p.content, tags:p.tags.join(', ') }); setMedia(p.media || []); };
  const deletePost = async (id:string)=>{ if(!confirm('Delete this blog post?')) return; const r=await fetch(`${API_BASE}/api/admin/blogs/${id}`,{ method:'DELETE', headers:{...authHeaders()} }); if(r.ok) load(); };
  return (<AdminLayout title="Blogs"><div className="row g-4">
    <div className="col-lg-5"><div className="card-luxe p-4"><h5 className="mb-3">{form.id ? 'Edit Blog' : 'Create New Blog'}</h5><form onSubmit={savePost} className="d-grid gap-3">
      <div><label className="form-label">Title</label><input className="form-control" required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></div>
      <div><label className="form-label">Excerpt</label><textarea className="form-control" rows={2} required value={form.excerpt} onChange={e=>setForm({...form, excerpt:e.target.value})}></textarea></div>
      <div><label className="form-label">Content</label><textarea className="form-control" rows={6} required value={form.content} onChange={e=>setForm({...form, content:e.target.value})}></textarea></div>
      <div><label className="form-label">Tags (comma separated)</label><input className="form-control" placeholder="Training, Nutrition" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})}/></div>
      <div><label className="form-label">Media (Images/PDFs)</label>
        <input type="file" accept="image/*,.pdf" onChange={uploadFile} style={{display:'none'}} id="blog-file-upload" disabled={uploading} />
        <label htmlFor="blog-file-upload" className="btn btn-outline-light btn-sm d-block mb-2" style={{cursor: uploading ? 'not-allowed' : 'pointer'}}>{uploading ? 'Uploading...' : '+ Upload File'}</label>
        {media.length > 0 && (<div className="d-flex flex-wrap gap-2">{media.map((url, idx) => (<div key={idx} style={{position:'relative', width:'80px', height:'80px', borderRadius:'8px', overflow:'hidden', border:'1px solid var(--border)'}}>
          {url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (<img src={url} alt="Media" style={{width:'100%', height:'100%', objectFit:'cover'}} />) : (<div className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white" style={{fontSize:'10px'}}>PDF</div>)}
          <button type="button" onClick={() => removeMedia(idx)} style={{position:'absolute', top:'2px', right:'2px', background:'rgba(220,53,69,0.9)', border:'none', borderRadius:'4px', color:'white', width:'20px', height:'20px', fontSize:'12px', cursor:'pointer', padding:0}}>×</button>
        </div>))}</div>)}
      </div>
      <div className="d-flex gap-2"><button className="btn btn-gold">{form.id ? 'Update' : 'Publish'}</button>{form.id && <button type="button" className="btn btn-outline-light" onClick={()=>{ setForm({ id:'', title:'', excerpt:'', content:'', tags:'' }); setMedia([]); }}>Cancel</button>}</div>{msg && <div className="alert alert-info mt-2">{msg}</div>}
    </form></div></div>
    <div className="col-lg-7"><div className="card-luxe p-4"><h5 className="mb-3">Published Posts</h5><div className="list-group list-group-flush">
      {posts.map(p=>(<div className="list-group-item bg-transparent text-white border-secondary" key={p.id}><div className="d-flex justify-content-between align-items-start"><div className="flex-grow-1">
        <div className="fw-semibold">{p.title}</div><small className="text-secondary">{new Date(p.published_date).toLocaleString()} • {p.tags.join(', ')}</small><div className="text-secondary mt-2" style={{whiteSpace:'pre-wrap'}}>{p.excerpt}</div>
        {p.media && p.media.length > 0 && (<div className="d-flex gap-2 mt-2">{p.media.map((url, idx) => (<div key={idx} style={{width:'40px', height:'40px', borderRadius:'4px', overflow:'hidden', border:'1px solid var(--border)'}}>{url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (<img src={url} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />) : (<div className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white" style={{fontSize:'8px'}}>PDF</div>)}</div>))}</div>)}
      </div><div className="d-flex flex-column gap-2"><button className="btn btn-sm btn-outline-primary" onClick={()=>setViewingBlog(p)}>View</button><button className="btn btn-sm btn-outline-light" onClick={()=>editPost(p)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>deletePost(p.id)}>Delete</button></div></div></div>))}{posts.length===0 && <div className="text-secondary">No posts yet.</div>}
    </div></div></div>
  </div>{viewingBlog && <BlogModal blog={viewingBlog} onClose={()=>setViewingBlog(null)} isAdmin={true} />}</AdminLayout>);
}
