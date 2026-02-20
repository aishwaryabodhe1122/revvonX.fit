
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getReviews, deleteReview, toggleLikeReview, Review } from '../../utils/reviewsStorage';
import { AiOutlineHeart, AiFillHeart, AiOutlineDelete } from 'react-icons/ai';
import { getToken } from '../../components/auth';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (!getToken()) {
      window.location.href = '/admin/login';
      return;
    }
    loadReviews();
  }, []);

  const loadReviews = () => {
    setReviews(getReviews());
  };

  const handleDelete = (id: string) => {
    if (deleteReview(id)) {
      loadReviews();
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete review');
    }
  };

  const handleToggleLike = (id: string) => {
    if (toggleLikeReview(id)) {
      loadReviews();
    } else {
      alert('Failed to toggle like');
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">Manage <span style={{color: 'var(--accent)'}}>Reviews</span></h1>
              <div className="text-secondary">Total Reviews: {reviews.length}</div>
            </div>

            {reviews.length === 0 ? (
              <div className="card-luxe p-5 text-center">
                <p className="text-secondary mb-0">No reviews yet.</p>
              </div>
            ) : (
              <div className="row g-4">
                {reviews.map((review) => {
                  const timeAgo = getTimeAgo(review.timestamp);
                  const fullStars = Math.floor(review.rating);
                  const hasHalfStar = review.rating % 1 !== 0;

                  return (
                    <div key={review.id} className="col-12">
                      <div className="card-luxe p-4">
                        <div className="row">
                          {/* Review Content */}
                          <div className="col-lg-10">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="mb-1">{review.name}</h5>
                                <small className="text-secondary">{review.email}</small>
                                <div className="mt-1">
                                  <small className="text-secondary">{timeAgo}</small>
                                </div>
                              </div>
                              <div style={{color: 'var(--accent)', fontSize: '18px'}}>
                                {'★'.repeat(fullStars)}{hasHalfStar ? '⯨' : ''}{'☆'.repeat(5 - Math.ceil(review.rating))}
                              </div>
                            </div>

                            <p className="text-secondary mb-3">{review.review}</p>

                            {/* Media Preview */}
                            {review.media && review.media.length > 0 && (
                              <div className="d-flex gap-2 flex-wrap mb-3">
                                {review.media.map((mediaUrl, idx) => (
                                  <div key={idx} style={{width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden'}}>
                                    <img src={mediaUrl} alt="Review media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-lg-2">
                            <div className="d-flex flex-column gap-2 h-100 justify-content-center">
                              {/* Like Button */}
                              <button
                                className={`btn ${review.liked ? 'btn-gold' : 'btn-outline-secondary'} d-flex align-items-center justify-content-center gap-2`}
                                onClick={() => handleToggleLike(review.id)}
                              >
                                {review.liked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                                {review.liked ? 'Liked' : 'Like Review'}
                              </button>

                              {/* Delete Button */}
                              {deleteConfirm === review.id ? (
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-danger flex-grow-1"
                                    onClick={() => handleDelete(review.id)}
                                  >
                                    Confirm Delete
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                                  onClick={() => setDeleteConfirm(review.id)}
                                >
                                  <AiOutlineDelete size={20} />
                                  Delete Review
                                </button>
                              )}

                              {/* Status Badge */}
                              <div className="text-center mt-2">
                                {review.liked && (
                                  <span className="badge-gold">Featured</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
      </div>
    </AdminLayout>
  );
}
