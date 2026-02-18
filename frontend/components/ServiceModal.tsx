import { useState } from 'react';

type Service = {
  id: string;
  title: string;
  price: string;
  tags: string[];
  media?: string[];
  summary: string;
  details: string;
};

export default function ServiceModal({ service, onClose, isAdmin = false }: { service: Service; onClose: () => void; isAdmin?: boolean }) {
  const [showBuyNow, setShowBuyNow] = useState(false);

  const firstImage = service.media?.find(url => url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i));

  const handleBuyNow = () => {
    // Placeholder for Razorpay integration
    alert('Razorpay integration will be added here. Service: ' + service.title + ' - Price: ' + service.price);
  };

  return (
    <div className="modal show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', overflowY: 'auto', zIndex: 1050, display: 'flex', alignItems: 'flex-start', padding: '20px 0' }} onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()} style={{ margin: '0 auto', maxWidth: '1140px', width: '100%' }}>
        <div className="modal-content" style={{ background: '#0a0f16', border: '1px solid #1e2632', borderRadius: '8px' }}>
          
          <div className="modal-header border-secondary">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="modal-title text-white mb-0">{service.title}</h4>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
              </div>
              <div className="d-flex gap-2 flex-wrap align-items-center">
                <span className="fs-5 fw-bold" style={{ color: '#d4af37' }}>{service.price} INR (Including all taxes)</span>
                {service.tags.map(tag => (
                  <span key={tag} className="badge bg-secondary-subtle text-secondary-emphasis">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-body text-white">
            <div className="row g-4">
              {/* Image at top-left corner */}
              {firstImage && (
                <div className="col-md-4">
                  <div style={{ width: '100%', height: '250px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={firstImage} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  {/* Additional media */}
                  {service.media && service.media.length > 1 && (
                    <div className="d-flex gap-2 flex-wrap mt-3">
                      {service.media.filter(url => url !== firstImage).map((url, idx) => (
                        <div key={idx} style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          {url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white text-decoration-none" style={{ fontSize: '8px' }}>PDF</a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={firstImage ? "col-md-8" : "col-12"}>
                <div className="mb-4">
                  <h6 className="text-gold mb-2">Summary</h6>
                  <p className="text-secondary mb-0">{service.summary}</p>
                </div>

                <div className="mb-4">
                  <h6 className="text-gold mb-2">Details</h6>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }} className="text-white">{service.details}</div>
                </div>

                {/* Buy Now Button */}
                <div className="d-flex gap-3 align-items-center">
                  <button className="btn btn-gold btn-lg" onClick={handleBuyNow}>
                    Buy Now @ {service.price} INR
                  </button>
                  {isAdmin && (
                    <span className="badge bg-info">Admin View</span>
                  )}
                </div>
              </div>
            </div>

            {/* All Media Gallery at bottom if no image at top */}
            {!firstImage && service.media && service.media.length > 0 && (
              <div className="mt-4">
                <h6 className="mb-3">Attachments</h6>
                <div className="d-flex gap-3 flex-wrap">
                  {service.media.map((url, idx) => (
                    <div key={idx}>
                      {url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                        <img src={url} alt="" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                          📄 View PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
