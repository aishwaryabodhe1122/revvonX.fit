
import { useEffect, useState } from 'react'; import Layout from '../components/Layout'; import ServiceCard from '../components/ServiceCard'; import { API_BASE } from '../components/config';
import { BsFillGridFill, BsListUl } from 'react-icons/bs';
type Service={id:string; title:string; price:string; tags:string[]; summary:string; details:string;};
export default function ServicesPage(){
  const [services, setServices] = useState<Service[]>([]); const [viewMode, setViewMode] = useState<'card'|'list'>('card');
  useEffect(()=>{ fetch(`${API_BASE}/api/services`).then(r=>r.json()).then(setServices).catch(()=>setServices([])); },[]);
  return (<Layout title="Services"><section className="section"><div className="container">
    <div className="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1 className="fw-bold mb-3">Services & Packages</h1>
        <p className="text-secondary mb-0">Choose from personalized training, online coaching, nutrition planning, and comprehensive transformation packages. Click a card to expand full details.</p>
      </div>
      <div className="btn-group" role="group">
        <button type="button" className={`btn ${viewMode==='card'?'btn-gold':'btn-outline-secondary'}`} onClick={()=>setViewMode('card')} style={{borderRadius:'8px 0 0 8px'}}><BsFillGridFill /></button>
        <button type="button" className={`btn ${viewMode==='list'?'btn-gold':'btn-outline-secondary'}`} onClick={()=>setViewMode('list')} style={{borderRadius:'0 8px 8px 0'}}><BsListUl /></button>
      </div>
    </div>
    {viewMode==='card' ? (
      <div className="row g-4">{services.map(s=>(<div className="col-md-6 col-lg-4" key={s.id}><ServiceCard service={s} viewMode="card"/></div>))}</div>
    ) : (
      <div className="d-flex flex-column gap-3">{services.map(s=>(<ServiceCard service={s} viewMode="list" key={s.id}/>))}</div>
    )}
  </div></section></Layout>);
}
