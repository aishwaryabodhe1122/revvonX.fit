
import { useState } from 'react';
type Service = { id:string; title:string; price:string; tags:string[]; summary:string; details:string; };
export default function ServiceCard({ service, viewMode = 'card' }: { service: Service; viewMode?: 'card' | 'list' }) {
  const [open, setOpen] = useState(false);
  const id = `svc_${service.id}`;
  
  if (viewMode === 'list') {
    return (
      <div className="card-luxe p-4">
        <div className="d-flex flex-column flex-md-row gap-4 align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
              <h5 className="mb-0">{service.title}</h5>
              <span className="badge-gold">{service.price} INR (Including all taxes)</span>
            </div>
            <p className="text-secondary mb-3">{service.summary}</p>
            <div className="d-flex flex-wrap gap-2">{service.tags.map(t => <span className="badge bg-secondary-subtle text-secondary-emphasis" key={t}>{t}</span>)}</div>
          </div>
          <div className="d-flex align-items-start" style={{minWidth: '140px'}}>
            <button className="btn btn-outline-light w-100" data-bs-toggle="collapse" data-bs-target={`#${id}`} onClick={()=>setOpen(!open)}>{open?'Hide Details':'View Details'}</button>
          </div>
        </div>
        <div className="collapse mt-3" id={id}><div className="p-3 rounded" style={{background:'#0f141b', border:'1px solid #1e2632'}}><p className="mb-0">{service.details}</p></div></div>
      </div>
    );
  }
  
  return (
    <div className="card-luxe p-3 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="mb-2">{service.title}</h5><span className="badge-gold">{service.price} INR (Including all taxes)</span>
      </div>
      <p className="text-secondary flex-grow-1">{service.summary}</p>
      <div className="d-flex flex-wrap gap-2 mb-3">{service.tags.map(t => <span className="badge bg-secondary-subtle text-secondary-emphasis" key={t}>{t}</span>)}</div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-outline-light" style={{width: 'auto', minWidth: '120px'}} data-bs-toggle="collapse" data-bs-target={`#${id}`} onClick={()=>setOpen(!open)}>{open?'Hide Details':'View Details'}</button>
      </div>
      <div className="collapse mt-3" id={id}><div className="p-3 rounded" style={{background:'#0f141b', border:'1px solid #1e2632'}}><p className="mb-0">{service.details}</p></div></div>
    </div>
  );
}
