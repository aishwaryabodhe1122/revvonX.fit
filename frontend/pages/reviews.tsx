
import { useState, useEffect } from 'react';
import React from 'react';
import Layout from '../components/Layout';
import { BsCamera, BsPlayCircle } from 'react-icons/bs';
import { addReview, getApprovedReviews, Review } from '../utils/reviewsStorage';

export default function ReviewsPage() {
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', reviewText: '', consent: false });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReviews(getApprovedReviews());
  }, []);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedMedia(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews(previews);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      // Check file sizes - base64 encoding increases size by ~33%
      const totalSize = selectedMedia.reduce((sum, file) => sum + file.size, 0);
      const estimatedBase64Size = totalSize * 1.33; // Account for base64 overhead
      const maxSize = 2 * 1024 * 1024; // 2MB limit for images
      
      if (estimatedBase64Size > maxSize) {
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        alert(`Images are too large (${sizeMB}MB). Please use smaller images (max ~1.5MB total).`);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
        return;
      }

      // Convert image files to base64
      const mediaPromises = selectedMedia.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      });

      const mediaBase64 = await Promise.all(mediaPromises);
      const mediaTypes = selectedMedia.map(() => 'image');

      console.log('Submitting review with media:', { 
        mediaCount: mediaBase64.length, 
        mediaTypes,
        totalSize: totalSize / 1024 + 'KB'
      });

      // Add review to storage
      const newReview = addReview({
        name: formData.name,
        email: formData.email,
        rating,
        review: formData.reviewText,
        media: mediaBase64,
        mediaTypes
      });

      console.log('Review added:', newReview);

      // Update reviews list
      const updatedReviews = getApprovedReviews();
      console.log('Updated reviews count:', updatedReviews.length);
      setReviews(updatedReviews);

      // Reset form
      setFormData({ name: '', email: '', reviewText: '', consent: false });
      setRating(0);
      setSelectedMedia([]);
      setMediaPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. The media files might be too large.');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = selectedMedia.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    setSelectedMedia(newMedia);
    setMediaPreviews(newPreviews);
    
    // Reset file input if all media removed
    if (newMedia.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStarClick = (starValue: number, isHalf: boolean) => {
    setRating(isHalf ? starValue - 0.5 : starValue);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= Math.ceil(rating);
      const isHalfFilled = star === Math.ceil(rating) && rating % 1 !== 0;
      const isHovered = star <= Math.ceil(hoverRating);
      const isHalfHovered = star === Math.ceil(hoverRating) && hoverRating % 1 !== 0;

      return (
        <div
          key={star}
          className="position-relative"
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          onMouseLeave={() => setHoverRating(0)}
        >
          {/* Left half */}
          <div
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              left: 0,
              top: 0,
              zIndex: 2
            }}
            onMouseEnter={() => setHoverRating(star - 0.5)}
            onClick={() => handleStarClick(star, true)}
          />
          {/* Right half */}
          <div
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              right: 0,
              top: 0,
              zIndex: 2
            }}
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => handleStarClick(star, false)}
          />
          {/* Star display */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: (isHovered || isFilled) ? 'var(--accent)' : '#6c757d',
              transition: 'color 0.2s'
            }}
          >
            {(isHalfFilled && !hoverRating) || (isHalfHovered && hoverRating) ? (
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ color: '#6c757d' }}>★</span>
                <span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: 'var(--accent)' }}>★</span>
              </span>
            ) : (
              '★'
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <Layout title="Reviews">
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3">Client <span style={{color: 'var(--accent)'}}>Reviews</span></h1>
            <p className="text-secondary">Share your experience and help others on their fitness journey</p>
          </div>

          <div className="row g-4">
            {/* Review Form Section */}
            <div className="col-lg-6">
              <div className="card-luxe p-4">
                <h3 className="fw-bold mb-4">Write a Review</h3>
                {submitStatus === 'success' && <div className="alert alert-success">Thank you! Your review has been submitted.</div>}
                {submitStatus === 'error' && <div className="alert alert-danger">Something went wrong. Please try again.</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input type="text" className="form-control" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div className="d-flex gap-2">
                      {renderStars()}
                    </div>
                    <input type="hidden" name="rating" value={rating} required />
                    {rating > 0 && <small className="text-secondary">You rated: {rating} star{rating !== 1 ? 's' : ''}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Your Review</label>
                    <textarea 
                      className="form-control" 
                      rows={5} 
                      placeholder="Share your experience with Revon.Fit..."
                      value={formData.reviewText}
                      onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Add Photos</label>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="form-control" 
                      accept="image/*"
                      multiple
                      onChange={handleMediaChange}
                    />
                    <small className="text-secondary">You can upload multiple photos (max 1.5MB total)</small>
                    
                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="position-relative" style={{width: '100px', height: '100px'}}>
                            <img src={preview} alt="Preview" className="img-fluid rounded" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              style={{padding: '2px 6px', fontSize: '12px'}}
                              onClick={() => removeMedia(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-3 form-check">
                    <input className="form-check-input" type="checkbox" id="consent" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} required />
                    <label className="form-check-label" htmlFor="consent">
                      I agree to share my review publicly on the website
                    </label>
                  </div>

                  <button type="submit" className="btn btn-gold btn-lg w-100">Submit Review</button>
                </form>
              </div>
            </div>

            {/* Reviews Display Section */}
            <div className="col-lg-6">
              <div className="card-luxe p-4" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <h3 className="fw-bold mb-4">Recent Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-secondary text-center py-4">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  <div className="d-flex flex-column gap-3" style={{overflowY: 'auto', maxHeight: 'calc(100% - 60px)', paddingRight: '8px'}}>
                    {reviews.map((review) => {
                      const timeAgo = getTimeAgo(review.timestamp);
                      const fullStars = Math.floor(review.rating);
                      const hasHalfStar = review.rating % 1 !== 0;
                      
                      return (
                        <div key={review.id} className="p-3" style={{background: '#0f141b', border: '1px solid var(--border)', borderRadius: '12px'}}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-0">{review.name}</h6>
                              <small className="text-secondary">{timeAgo}</small>
                            </div>
                            <div style={{color: 'var(--accent)'}}>
                              {'★'.repeat(fullStars)}{hasHalfStar ? '⯨' : ''}{'☆'.repeat(5 - Math.ceil(review.rating))}
                            </div>
                          </div>
                          <p className="text-secondary mb-2">{review.review}</p>
                          {review.media && review.media.length > 0 && (
                            <div className="d-flex gap-2 mt-2 flex-wrap">
                              {review.media.map((mediaUrl, idx) => (
                                <div 
                                  key={idx} 
                                  className="position-relative" 
                                  style={{width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer'}}
                                  onClick={() => {
                                    setSelectedMediaUrl(mediaUrl);
                                    setSelectedMediaType(review.mediaTypes[idx] as 'image' | 'video');
                                  }}
                                >
                                  <img src={mediaUrl} alt="Review media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{background: 'rgba(0,0,0,0)', transition: 'background 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
                                    <span style={{color: 'white', fontSize: '24px', opacity: 0, transition: 'opacity 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>🔍</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Popup Modal */}
      {selectedMediaUrl && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{zIndex: 9999, background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(5px)'}}
          onClick={() => {
            setSelectedMediaUrl(null);
            setSelectedMediaType(null);
          }}
        >
          <button 
            className="btn btn-close btn-close-white position-absolute" 
            style={{top: '20px', right: '20px', fontSize: '24px', zIndex: 10000}}
            onClick={() => {
              setSelectedMediaUrl(null);
              setSelectedMediaType(null);
            }}
          />
          <div className="position-relative" style={{maxWidth: '90vw', maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedMediaUrl} 
              alt="Full size" 
              style={{maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px'}} 
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
