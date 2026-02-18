
type Blog = { id:string; title:string; excerpt:string; content:string; tags:string[]; media?:string[]; published_date:string; };
export default function BlogCard({ post, viewMode = 'card', onView }: { post: Blog; viewMode?: 'card' | 'list'; onView?: () => void }) {
  if (viewMode === 'list') {
    return (
      <article className="card-luxe p-4 d-flex flex-column flex-md-row gap-4 align-items-start">
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
            <h5 className="mb-0">{post.title}</h5>
            <span className="badge bg-secondary-subtle text-secondary-emphasis">{new Date(post.published_date).toDateString()}</span>
          </div>
          <p className="text-secondary mb-3">{post.excerpt}</p>
          {post.media && post.media.length > 0 && (
            <div className="d-flex gap-2 flex-wrap mb-3">
              {post.media.map((mediaUrl, idx) => (
                <div key={idx} style={{width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)'}}>
                  {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                    <img src={mediaUrl} alt="Blog media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white text-decoration-none" style={{fontSize: '12px'}}>📄 PDF</a>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="d-flex flex-wrap gap-2">{post.tags.map(t => <span className="badge-gold" key={t}>{t}</span>)}</div>
        </div>
        {onView && <div className="d-flex align-items-start"><button className="btn btn-outline-light" onClick={onView}>Read More</button></div>}
      </article>
    );
  }
  return (
    <article className="card-luxe p-4 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{post.title}</h5>
        <span className="badge bg-secondary-subtle text-secondary-emphasis">{new Date(post.published_date).toDateString()}</span>
      </div>
      <p className="text-secondary">{post.excerpt}</p>
      {post.media && post.media.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-3">
          {post.media.map((mediaUrl, idx) => (
            <div key={idx} style={{width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)'}}>
              {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img src={mediaUrl} alt="Blog media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white text-decoration-none" style={{fontSize: '10px'}}>📄 PDF</a>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-auto">
        <div className="d-flex flex-wrap gap-2 mb-3">{post.tags.map(t => <span className="badge-gold" key={t}>{t}</span>)}</div>
        {onView && <button className="btn btn-outline-light w-100" onClick={onView}>Read More</button>}
      </div>
    </article>
  );
}
