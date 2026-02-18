import { useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import TestimonialCard with SSR disabled to prevent window is not defined error
const TestimonialCard = dynamic(
  () => import('../components/TestimonialCard'),
  { ssr: false }
);

// Sample testimonials data
const testimonials = [
  {
    name: 'Rahul Sharma',
    review: 'Sushil transformed my fitness journey completely. His personalized training and diet plan helped me lose 12kg in 3 months!',
    rating: 5
  },
  {
    name: 'Priya Patel',
    review: 'The best trainer I\'ve ever worked with. His knowledge about nutrition is exceptional and the workouts are always challenging.',
    rating: 5
  },
  {
    name: 'Amit Singh',
    review: 'I was skeptical at first, but the results speak for themselves. Gained 5kg of muscle in just 4 months!',
    rating: 4
  },
  {
    name: 'Neha Gupta',
    review: 'Sushil is very professional and attentive. He adapts the training based on my progress and limitations.',
    rating: 5
  },
  {
    name: 'Vikram Mehta',
    review: 'The online coaching is just as effective as in-person. The app makes it super easy to track progress and stay accountable.',
    rating: 4
  }
];

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollStep = 1;
    let scrollAmount = 0;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const autoScroll = () => {
      if (scrollAmount >= maxScroll) {
        // Reset to start for infinite scroll effect
        scrollAmount = 0;
        scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        scrollAmount += scrollStep;
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    scrollInterval.current = setInterval(autoScroll, 30);

    // Pause on hover
    const handleMouseEnter = () => clearInterval(scrollInterval.current);
    const handleMouseLeave = () => {
      scrollInterval.current = setInterval(autoScroll, 30);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Layout title="Home">
      <section className="hero section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge-gold mb-3">Premium Coaching</span>
              <h1 className="display-3 fw-bold mb-3">Transform Your Body & Mind with <span style={{color:'var(--accent)'}}>Revon.Fit</span></h1>
              <p className="lead text-secondary mb-4">Personal training and nutrition coaching tailored to your goals — online or in-person. Science-based plans, elite accountability.</p>
              <div className="d-flex gap-3"><Link href="/services" className="btn btn-gold btn-lg">Explore Services</Link><a href="#about" className="btn btn-outline-light btn-lg">About Me</a></div>
            </div>
            <div className="col-lg-6">
              <div className="card-luxe shadow-soft p-0 overflow-hidden">
                <img src="/assets/gym-bg.jpg" className="img-fluid" alt="hero"/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <div className="card-luxe overflow-hidden">
                <img src="/assets/trainer.png" className="img-fluid" alt="Trainer"/>
              </div>
            </div>
            <div className="col-md-7">
              <h2 className="fw-bold mb-3">Hi, I'm <span style={{color:'var(--accent)'}}>Sushil</span></h2>
              <p className="text-secondary">I am your trainer & nutritionist with 8+ years of industry experience helping 600+ clients achieve sustainable transformations.</p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 card-luxe h-100">
                    <div className="h4 mb-0">600+</div>
                    <small className="text-secondary">Clients Transformed</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 card-luxe h-100">
                    <div className="h4 mb-0">8 Years</div>
                    <small className="text-secondary">Experience</small>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <a id="book" href="/contact" className="btn btn-gold btn-lg">Book a Consultation</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">What Our <span style={{color: 'var(--accent)'}}>Clients Say</span></h2>
            <p className="text-secondary">Don't just take our word for it. Here's what our clients have to say about their experience.</p>
          </div>
          <div 
            ref={scrollContainerRef}
            className="d-flex gap-4 py-4 overflow-hidden scroll-container"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0" style={{ width: '320px' }}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
            {/* Duplicate items for infinite scroll effect */}
            {testimonials.map((testimonial, index) => (
              <div key={`duplicate-${index}`} className="flex-shrink-0" style={{ width: '320px' }}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <style jsx global>{`
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .card-luxe {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-luxe:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </Layout>
  );
}
