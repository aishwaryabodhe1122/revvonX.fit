import { useState, useEffect } from 'react';
import { API_BASE } from './config';
import { authHeaders, getToken } from './auth';

type Comment = {
  id: string;
  blog_id: string;
  author_name: string;
  author_email: string;
  comment_text: string;
  parent_id: string | null;
  is_admin: boolean;
  created_at: string;
};

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  media?: string[];
  published_date: string;
};

export default function BlogModal({ blog, onClose, isAdmin = false }: { blog: Blog; onClose: () => void; isAdmin?: boolean }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ author_name: '', author_email: '', comment_text: '', parent_id: null as string | null });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bannerImage = blog.media?.find(url => url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i));

  useEffect(() => {
    loadComments();
  }, [blog.id]);

  const loadComments = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/blogs/${blog.id}/comments`);
      if (r.ok) setComments(await r.json());
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.author_name || !commentForm.author_email || !commentForm.comment_text) return;

    setLoading(true);
    try {
      const payload = {
        author_name: commentForm.author_name,
        author_email: commentForm.author_email,
        comment_text: commentForm.comment_text,
        parent_id: commentForm.parent_id,
        is_admin: isAdmin
      };

      const r = await fetch(`${API_BASE}/api/blogs/${blog.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (r.ok) {
        setCommentForm({ author_name: '', author_email: '', comment_text: '', parent_id: null });
        setReplyingTo(null);
        await loadComments();
      } else {
        alert('Failed to post comment');
      }
    } catch (err) {
      alert('Error posting comment: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const r = await fetch(`${API_BASE}/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });
      if (r.ok) await loadComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const startReply = (comment: Comment) => {
    setReplyingTo(comment.id);
    setCommentForm({ ...commentForm, parent_id: comment.id });
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentForm({ ...commentForm, parent_id: null });
  };

  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  return (
    <div className="modal show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', overflowY: 'auto', zIndex: 1050, display: 'flex', alignItems: 'flex-start', padding: '20px 0' }} onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()} style={{ margin: '0 auto', maxWidth: '1140px', width: '100%' }}>
        <div className="modal-content" style={{ background: '#0a0f16', border: '1px solid #1e2632', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Banner Image */}
          {bannerImage && (
            <div style={{ width: '100%', height: '300px', minHeight: '300px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={bannerImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          <div className="modal-header border-secondary">
            <div>
              <h4 className="modal-title text-white mb-2">{blog.title}</h4>
              <div className="d-flex gap-2 flex-wrap">
                {blog.tags.map(tag => (
                  <span key={tag} className="badge bg-secondary-subtle text-secondary-emphasis">{tag}</span>
                ))}
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body text-white">
            {/* Blog Content */}
            <div className="mb-4">
              <p className="text-secondary mb-3">{blog.excerpt}</p>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{blog.content}</div>
            </div>

            {/* Media Gallery (excluding banner) */}
            {blog.media && blog.media.length > 1 && (
              <div className="mb-4">
                <h6 className="mb-3">Attachments</h6>
                <div className="d-flex gap-3 flex-wrap">
                  {blog.media.filter(url => url !== bannerImage).map((url, idx) => (
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

            <hr className="border-secondary my-4" />

            {/* Comments Section */}
            <div>
              <h5 className="mb-4">Comments ({comments.length})</h5>

              {/* Comment Form */}
              <div className="card-luxe p-3 mb-4">
                <form onSubmit={submitComment}>
                  {replyingTo && (
                    <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                      <span>Replying to a comment</span>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cancelReply}>Cancel</button>
                    </div>
                  )}
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Your Name"
                        value={commentForm.author_name}
                        onChange={e => setCommentForm({ ...commentForm, author_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        placeholder="Your Email"
                        value={commentForm.author_email}
                        onChange={e => setCommentForm({ ...commentForm, author_email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <textarea
                    className="form-control form-control-sm mb-2"
                    rows={3}
                    placeholder="Write your comment..."
                    value={commentForm.comment_text}
                    onChange={e => setCommentForm({ ...commentForm, comment_text: e.target.value })}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-gold btn-sm" disabled={loading}>
                    {loading ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="d-grid gap-3">
                {topLevelComments.map(comment => (
                  <div key={comment.id} className="card-luxe p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong className="text-white">{comment.author_name}</strong>
                        {comment.is_admin && <span className="badge bg-gold text-dark ms-2">Admin</span>}
                        <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                          {new Date(comment.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-light" onClick={() => startReply(comment)}>Reply</button>
                        {isAdmin && getToken() && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteComment(comment.id)}>Delete</button>
                        )}
                      </div>
                    </div>
                    <p className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap' }}>{comment.comment_text}</p>

                    {/* Replies */}
                    {getReplies(comment.id).length > 0 && (
                      <div className="mt-3 ms-4 d-grid gap-2">
                        {getReplies(comment.id).map(reply => (
                          <div key={reply.id} className="p-3" style={{ background: '#0f141b', borderRadius: '8px', border: '1px solid #1e2632' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <strong className="text-white">{reply.author_name}</strong>
                                {reply.is_admin && <span className="badge bg-gold text-dark ms-2">Admin</span>}
                                <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                                  {new Date(reply.created_at).toLocaleString()}
                                </div>
                              </div>
                              {isAdmin && getToken() && (
                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteComment(reply.id)}>Delete</button>
                              )}
                            </div>
                            <p className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap' }}>{reply.comment_text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-secondary text-center py-4">No comments yet. Be the first to comment!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
