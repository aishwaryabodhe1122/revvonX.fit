import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getApprovedReviews, Review } from '../utils/reviewsStorage';

// Import TestimonialCard with SSR disabled to prevent window is not defined error
const TestimonialCard = dynamic(
  () => import('../components/TestimonialCard'),
  { ssr: false }
);


export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isPausedRef = useRef(false);
  const [testimonials, setTestimonials] = useState<Review[]>([]);

  useEffect(() => {
    setTestimonials(getApprovedReviews());
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 2; // pixels per frame
    let lastTimestamp = 0;

    const autoScroll = (timestamp: number) => {
      if (!isPausedRef.current && scrollContainer) {
        const deltaTime = timestamp - lastTimestamp;

        if (deltaTime > 16) { // ~60fps
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          const currentScroll = scrollContainer.scrollLeft;

          if (currentScroll >= maxScroll) {
            scrollContainer.scrollLeft = 0;
          } else {
            scrollContainer.scrollLeft += scrollSpeed;
          }

          lastTimestamp = timestamp;
        }
      }

      animationFrameRef.current = requestAnimationFrame(autoScroll);
    };

    animationFrameRef.current = requestAnimationFrame(autoScroll);

    // Pause on hover
    const handleMouseEnter = () => { isPausedRef.current = true; };
    const handleMouseLeave = () => { isPausedRef.current = false; };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Layout title="Home">
      <section className="hero section" style={{ position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/assets/main.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(12, 15, 19, 0.7)', height: '100%' }}>
          <div className="container">
            <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '400px', padding: '40px 0' }}>
              <span className="badge-gold mb-3">Premium Coaching</span>
              <h1 className="display-3 fw-bold mb-3">Transform Your Body & Mind with <span style={{ color: 'var(--accent)' }}>RevvonX.Fit</span></h1>
              <p className="lead mb-4" style={{ maxWidth: '700px', color: '#fff' }}>Personal training and nutrition coaching tailored to your goals — online or in-person. Science-based plans, elite accountability.</p>
              <div className="d-flex gap-3"><Link href="/services" className="btn btn-gold btn-lg">Explore Services</Link><a href="#about" className="btn btn-outline-light btn-lg">About Me</a></div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <div className="overflow-hidden">
                <img src="/assets/trainer.png" className="img-fluid" alt="Trainer" />
              </div>
            </div>
            <div className="col-md-7">
              <h2 className="fw-bold mb-3">Hi, I'm <span style={{ color: 'var(--accent)' }}>Sushil</span></h2>
              <p className="text-secondary">I am your coach & nutritionist with 3+ years of industry experience helping 100+ clients achieve sustainable transformations.</p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 card-luxe h-100">
                    <div className="h4 mb-0">100+</div>
                    <small className="text-secondary">Clients Transformed</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 card-luxe h-100">
                    <div className="h4 mb-0">3 Years</div>
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
            <h2 className="fw-bold"><span style={{ color: '#1a1a1a' }}>What Our</span> <span style={{ color: 'var(--accent)' }}>Clients Say</span></h2>
            <p className="text-secondary">Don't just take our word for it. Here's what our clients have to say about their experience.</p>
            <Link href="/reviews" className="btn btn-gold btn-lg">Review our services</Link>

          </div>
          {testimonials.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary">No reviews yet. <Link href="/reviews" style={{ color: 'var(--accent)' }}>Be the first to share your experience!</Link></p>
            </div>
          ) : (
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
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-shrink-0" style={{ width: '320px' }}>
                  <TestimonialCard name={testimonial.name} review={testimonial.review} rating={testimonial.rating} />
                </div>
              ))}
              {/* Duplicate items for infinite scroll effect only if we have 3+ reviews */}
              {testimonials.length >= 3 && testimonials.map((testimonial) => (
                <div key={`duplicate-${testimonial.id}`} className="flex-shrink-0" style={{ width: '320px' }}>
                  <TestimonialCard name={testimonial.name} review={testimonial.review} rating={testimonial.rating} />
                </div>
              ))}
            </div>
          )}
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
