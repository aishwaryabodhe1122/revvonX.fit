export default function TermsOfServiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', overflowY: 'auto', zIndex: 1050, display: 'flex', alignItems: 'flex-start', padding: '20px 0' }} onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()} style={{ margin: '0 auto', maxWidth: '900px', width: '100%' }}>
        <div className="modal-content" style={{ background: '#0a0f16', border: '1px solid #1e2632', borderRadius: '8px' }}>
          
          <div className="modal-header border-secondary">
            <h3 className="modal-title text-white mb-0">TERMS OF SERVICE</h3>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body text-white" style={{ lineHeight: '1.8' }}>
            <p className="text-secondary mb-4"><strong>Last Updated:</strong> 20/02/2026</p>
            
            <p className="mb-4">Welcome to our fitness training services. By using this website or enrolling in our programs, you agree to the following terms:</p>

            {/* Section 1 */}
            <h5 className="text-gold mb-3">1. Services Offered</h5>
            <p className="mb-2">We provide:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Online fitness coaching</li>
              <li>Offline personal training sessions in Pune</li>
              <li>Customized workout plans</li>
              <li>Nutritional guidance</li>
              <li>Fitness consultations</li>
            </ul>
            <p className="mb-4">All services are provided based on individual assessment.</p>

            {/* Section 2 */}
            <h5 className="text-gold mb-3">2. Medical Disclaimer</h5>
            <p className="mb-2">Fitness training involves physical activity that may carry risk.<br />By enrolling, you confirm that:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>You are medically fit to participate</li>
              <li>You have consulted a doctor if required</li>
              <li>You disclose any existing injuries or medical conditions</li>
            </ul>
            <p className="mb-2">We are not liable for injuries resulting from:</p>
            <ul className="mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Failure to follow instructions</li>
              <li>Undisclosed medical conditions</li>
              <li>Improper execution of exercises</li>
            </ul>

            {/* Section 3 */}
            <h5 className="text-gold mb-3">3. Results Disclaimer</h5>
            <p className="mb-2">Individual results vary based on:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Consistency</li>
              <li>Diet adherence</li>
              <li>Lifestyle habits</li>
              <li>Medical conditions</li>
            </ul>
            <p className="mb-4 text-warning">We do not guarantee specific weight loss, muscle gain, or body transformation results.</p>

            {/* Section 4 */}
            <h5 className="text-gold mb-3">4. Payments & Refund Policy</h5>
            <ul className="mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>All payments must be made in advance.</li>
              <li>Fees once paid are non-refundable unless stated otherwise.</li>
              <li>Missed sessions without prior notice may not be rescheduled.</li>
            </ul>
            <p className="mb-4 text-secondary fst-italic">(You can customize cancellation timelines.)</p>

            {/* Section 5 */}
            <h5 className="text-gold mb-3">5. Online Training Responsibility</h5>
            <p className="mb-2">For online coaching:</p>
            <ul className="mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Clients are responsible for maintaining a safe workout environment.</li>
              <li>Internet connectivity issues are not the trainer's liability.</li>
            </ul>

            {/* Section 6 */}
            <h5 className="text-gold mb-3">6. Intellectual Property</h5>
            <p className="mb-2">All workout plans, diet charts, videos, and materials are the intellectual property of the trainer.</p>
            <p className="mb-4">They may not be copied, distributed, or shared without written permission.</p>

            {/* Section 7 */}
            <h5 className="text-gold mb-3">7. Code of Conduct</h5>
            <p className="mb-2">Clients are expected to:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Communicate respectfully</li>
              <li>Follow scheduled timings</li>
              <li>Provide accurate health information</li>
            </ul>
            <p className="mb-4">We reserve the right to terminate services for inappropriate behavior.</p>

            {/* Section 8 */}
            <h5 className="text-gold mb-3">8. Limitation of Liability</h5>
            <p className="mb-2">To the fullest extent permitted by law, we are not responsible for:</p>
            <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Indirect damages</li>
              <li>Personal injury due to negligence</li>
              <li>Equipment misuse</li>
            </ul>
            <p className="mb-4 text-warning">Participation is voluntary and at your own risk.</p>

            {/* Section 9 */}
            <h5 className="text-gold mb-3">9. Governing Law</h5>
            <p className="mb-2">These terms are governed by the laws of India.<br />Any disputes shall fall under the jurisdiction of Pune, Maharashtra courts.</p>
          </div>

          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-outline-light" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
