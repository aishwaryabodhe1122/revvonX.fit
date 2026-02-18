// Utility functions for managing reviews in localStorage

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  media: string[]; // Base64 encoded media or URLs
  mediaTypes: string[]; // 'image' or 'video'
  timestamp: string;
  approved: boolean;
}

const STORAGE_KEY = 'revon_reviews';

export const getReviews = (): Review[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
};

export const addReview = (review: Omit<Review, 'id' | 'timestamp' | 'approved'>): Review => {
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    approved: true // Auto-approve for now
  };

  const reviews = getReviews();
  reviews.unshift(newReview); // Add to beginning
  
  try {
    const dataToStore = JSON.stringify(reviews);
    console.log('Attempting to store review. Data size:', (dataToStore.length / 1024).toFixed(2) + 'KB');
    localStorage.setItem(STORAGE_KEY, dataToStore);
    console.log('Review stored successfully');
  } catch (error) {
    console.error('Error saving review to localStorage:', error);
    // Check if it's a quota exceeded error
    if (error instanceof DOMException && (
      error.code === 22 || 
      error.code === 1014 || 
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      throw new Error('Storage quota exceeded. Please use smaller media files or delete old reviews.');
    }
    throw error;
  }

  return newReview;
};

export const getApprovedReviews = (): Review[] => {
  return getReviews().filter(review => review.approved);
};
