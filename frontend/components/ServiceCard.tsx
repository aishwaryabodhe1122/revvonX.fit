
type Service = { id:string; title:string; price:string; tags:string[]; media?:string[]; summary:string; details:string; };
export default function ServiceCard({ service, viewMode = 'card', onView }: { service: Service; viewMode?: 'card' | 'list'; onView?: () => void }) {
  
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
            {service.media && service.media.length > 0 && (
              <div className="d-flex gap-2 flex-wrap mb-3">
                {service.media.map((mediaUrl, idx) => (
                  <div key={idx} style={{width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)'}}>
                    {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                      <img src={mediaUrl} alt="Service media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white text-decoration-none" style={{fontSize: '12px'}}>📄 PDF</a>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="d-flex flex-wrap gap-2">{service.tags.map(t => <span className="badge bg-secondary-subtle text-secondary-emphasis" key={t}>{t}</span>)}</div>
          </div>
          {onView && (
            <div className="d-flex align-items-start" style={{minWidth: '140px'}}>
              <button className="btn btn-outline-light w-100" onClick={onView}>View Details</button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="card-luxe p-3 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="mb-2">{service.title}</h5><span className="badge-gold">{service.price} INR (Including all taxes)</span>
      </div>
      <p className="text-secondary flex-grow-1">{service.summary}</p>
      {service.media && service.media.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-3">
          {service.media.map((mediaUrl, idx) => (
            <div key={idx} style={{width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)'}}>
              {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img src={mediaUrl} alt="Service media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white text-decoration-none" style={{fontSize: '10px'}}>📄 PDF</a>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="d-flex flex-wrap gap-2 mb-3">{service.tags.map(t => <span className="badge bg-secondary-subtle text-secondary-emphasis" key={t}>{t}</span>)}</div>
      {onView && (
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-light" style={{width: 'auto', minWidth: '120px'}} onClick={onView}>View Details</button>
        </div>
      )}
    </div>
  );
}
