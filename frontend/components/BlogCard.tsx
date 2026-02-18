
type Blog = { id:string; title:string; excerpt:string; content:string; tags:string[]; published_date:string; };
export default function BlogCard({ post, viewMode = 'card' }: { post: Blog; viewMode?: 'card' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <article className="card-luxe p-4 d-flex flex-column flex-md-row gap-4 align-items-start">
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
            <h5 className="mb-0">{post.title}</h5>
            <span className="badge bg-secondary-subtle text-secondary-emphasis">{new Date(post.published_date).toDateString()}</span>
          </div>
          <p className="text-secondary mb-3">{post.excerpt}</p>
          <div className="d-flex flex-wrap gap-2">{post.tags.map(t => <span className="badge-gold" key={t}>{t}</span>)}</div>
        </div>
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
      <div className="mt-auto d-flex flex-wrap gap-2">{post.tags.map(t => <span className="badge-gold" key={t}>{t}</span>)}</div>
    </article>
  );
}
