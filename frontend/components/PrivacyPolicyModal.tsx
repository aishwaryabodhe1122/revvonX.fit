export default function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', overflowY: 'auto', zIndex: 1050, display: 'flex', alignItems: 'flex-start', padding: '20px 0' }} onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()} style={{ margin: '0 auto', maxWidth: '900px', width: '100%' }}>
        <div className="modal-content" style={{ background: '#0a0f16', border: '1px solid #1e2632', borderRadius: '8px' }}>
          
          <div className="modal-header border-secondary">
            <h3 className="modal-title text-white mb-0">PRIVACY POLICY</h3>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body text-white" style={{ lineHeight: '1.8' }}>
            <p className="text-secondary mb-4"><strong>Last Updated:</strong> 20/02/2026</p>
            
            <p className="mb-4">Welcome! Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or enroll in our fitness programs (online or offline in Pune).</p>

            {/* Section 1 */}
            <h5 className="text-gold mb-3">1. Information We Collect</h5>
            <p className="mb-3">We may collect the following information:</p>
            
            <h6 className="text-white mb-2">Personal Information</h6>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>City/Location</li>
              <li>Emergency Contact (if applicable)</li>
            </ul>

            <h6 className="text-white mb-2">Health & Fitness Information</h6>
            <p className="mb-2">If you enroll in training programs, we may collect:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Age, height, weight</li>
              <li>Medical history (if voluntarily provided)</li>
              <li>Fitness goals</li>
              <li>Injuries or physical limitations</li>
            </ul>
            <p className="mb-3 text-secondary fst-italic">This information is collected only to design safe and effective fitness plans.</p>

            <h6 className="text-white mb-2">Technical Information</h6>
            <ul className="mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Cookies and website usage data</li>
            </ul>

            {/* Section 2 */}
            <h5 className="text-gold mb-3">2. How We Use Your Information</h5>
            <p className="mb-2">Your information is used to:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Provide fitness coaching services</li>
              <li>Design personalized workout and diet plans</li>
              <li>Communicate program updates</li>
              <li>Process payments</li>
              <li>Improve website performance</li>
              <li>Send newsletters (only if you opt-in)</li>
            </ul>
            <p className="mb-4 text-warning">We do not sell or rent your personal data to third parties.</p>

            {/* Section 3 */}
            <h5 className="text-gold mb-3">3. Payment Information</h5>
            <p className="mb-4">We do not store your card or banking details. Payments made through third-party payment gateways are subject to their own privacy policies.</p>

            {/* Section 4 */}
            <h5 className="text-gold mb-3">4. Data Protection</h5>
            <p className="mb-2">We take reasonable steps to protect your information from unauthorized access, misuse, or disclosure.</p>
            <p className="mb-4 text-secondary fst-italic">However, no online platform can guarantee 100% security.</p>

            {/* Section 5 */}
            <h5 className="text-gold mb-3">5. Cookies</h5>
            <p className="mb-2">Our website may use cookies to:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Improve user experience</li>
              <li>Analyze website traffic</li>
              <li>Remember user preferences</li>
            </ul>
            <p className="mb-4">You can disable cookies in your browser settings.</p>

            {/* Section 6 */}
            <h5 className="text-gold mb-3">6. Third-Party Links</h5>
            <p className="mb-4">Our website may contain links to third-party platforms (e.g., Instagram, YouTube). We are not responsible for their privacy practices.</p>

            {/* Section 7 */}
            <h5 className="text-gold mb-3">7. Your Rights</h5>
            <p className="mb-2">You may request to:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Access your personal data</li>
              <li>Update incorrect information</li>
              <li>Delete your data (subject to legal obligations)</li>
            </ul>
            <p className="mb-4">To make such requests, contact us at:<br />📧 <a href="mailto:coach@RevvonX.Fit.co" className="text-gold text-decoration-none">coach@RevvonX.Fit.co</a></p>

            {/* Section 8 */}
            <h5 className="text-gold mb-3">8. Policy Updates</h5>
            <p className="mb-0">We may update this Privacy Policy occasionally. Changes will be posted on this page.</p>
          </div>

          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-outline-light" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
