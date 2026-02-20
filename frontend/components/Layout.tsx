import Head from 'next/head'; import Link from 'next/link'; import { useEffect, useState } from 'react'; import { getToken } from './auth'; import PrivacyPolicyModal from './PrivacyPolicyModal'; import TermsOfServiceModal from './TermsOfServiceModal';

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
  const [adminLink, setAdminLink] = useState('/admin/login');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  
  useEffect(() => {
    if (getToken()) {
      setAdminLink('/admin/contacts');
    }
  }, []);
  
  return (<>
    <style>{`
        .gradient-text {
          /* Fallback solid color */
          color: #e63eab;

          /* Gradient text */
          background: radial-gradient(circle,
            rgba(230, 62, 171, 1) 0%,
            rgba(93, 93, 232, 1) 67%,
            rgba(0, 212, 255, 1) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: inline-block;
        }
      `}</style>
    <Head><title>{title ? `${title} | RevvonX.Fit` : 'RevvonX.Fit — Premium Fitness & Nutrition'}</title></Head>
    <nav className="navbar navbar-expand-lg sticky-top"><div className="container">
      <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
        <img src="/assets/logo.svg" alt="logo" width={32} height={32} /><span className="fw-bold">RevvonX.Fit</span>
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"></span></button>
      <div className="collapse navbar-collapse" id="nav">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-3">
          <li className="nav-item"><Link className="nav-link" href="/services">Services</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/blogs">Blogs</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/reviews">Reviews</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/contact">Contact</Link></li>
        </ul>
        <ul className="navbar-nav ms-2">
          <li className="nav-item"><Link className="btn btn-outline-light" href={adminLink}>Admin</Link></li>
        </ul>
      </div>
    </div></nav>
    <main>{children}</main>
    <footer className="footer py-5 mt-5" style={{borderTop: '1px solid var(--border)'}}>
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/assets/logo.svg" alt="logo" width={32} height={32} />
              <span className="fw-bold fs-5">RevvonX.Fit</span>
            </div>
            <p className="text-secondary mb-3">Transform your body and mind with personalized fitness training and nutrition coaching.</p>
            <div className="text-secondary">© {new Date().getFullYear()} RevvonX.Fit. All rights reserved.</div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-4">
            <h6 className="fw-bold mb-3" style={{color: 'var(--accent)'}}>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/" className="text-secondary">Home</Link></li>
              <li className="mb-2"><Link href="/services" className="text-secondary">Services</Link></li>
              <li className="mb-2"><Link href="/blogs" className="text-secondary">Blogs</Link></li>
              <li className="mb-2"><Link href="/reviews" className="text-secondary">Reviews</Link></li>
              <li className="mb-2"><Link href="/contact" className="text-secondary">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-4">
            <h6 className="fw-bold mb-3" style={{color: 'var(--accent)'}}>Our Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><span className="text-secondary">Personal Training</span></li>
              <li className="mb-2"><span className="text-secondary">Online Coaching</span></li>
              <li className="mb-2"><span className="text-secondary">Nutrition Planning</span></li>
              <li className="mb-2"><span className="text-secondary">Transformation Programs</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-4">
            <h6 className="fw-bold mb-3" style={{color: 'var(--accent)'}}>Get In Touch</h6>
            <ul className="list-unstyled">
              <li className="mb-2 text-secondary">📧 coach@RevvonX.Fit.co</li>
              <li className="mb-2 text-secondary">📞 +91 88308 89788</li>
              <li className="mb-2 text-secondary">📍 Pune, India</li>
              <li className="mb-2 text-secondary">🌐 Online Worldwide</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="row mt-4 pt-4" style={{borderTop: '1px solid var(--border)'}}>
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <button onClick={() => setShowPrivacyPolicy(true)} className="btn btn-link text-secondary p-0 text-decoration-none" style={{ cursor: 'pointer' }}>Privacy Policy</button>
              <button onClick={() => setShowTermsOfService(true)} className="btn btn-link text-secondary p-0 text-decoration-none" style={{ cursor: 'pointer' }}>Terms of Service</button>
            </div>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className='text-secondary'>Proudly Created By <span className='service-company gradient-text' style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '1.1rem' }}>Valtora Tech</span></span>
          </div>
        </div>
      </div>
    </footer>
    {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
    {showTermsOfService && <TermsOfServiceModal onClose={() => setShowTermsOfService(false)} />}
  </>);
}
