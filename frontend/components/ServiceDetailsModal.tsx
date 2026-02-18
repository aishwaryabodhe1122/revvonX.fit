import { FC, useState, useEffect } from 'react';
import { initiatePaytmPayment, loadPaytmScript } from '../utils/payment';

type Service = {
  id: string;
  title: string;
  price: string;
  tags: string[];
  summary: string;
  details: string;
};

type ServiceDetailsModalProps = {
  service: Service | null;
  onClose: () => void;
};

const ServiceDetailsModal: FC<ServiceDetailsModalProps> = ({ service, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load PayTM script when component mounts
    loadPaytmScript(() => {
      setIsScriptLoaded(true);
    });
  }, []);

  if (!service) return null;

  const extractAmount = (priceString: string): number => {
    const match = priceString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const handlePayment = async () => {
    if (!service || !isScriptLoaded) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const amount = extractAmount(service.price);
      if (amount <= 0) {
        throw new Error('Invalid service price');
      }

      // Generate a unique order ID
      const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      // In a real app, you would get this from your auth context
      const customerId = `CUST_${Date.now()}`;

      // Initialize PayTM payment
      const paymentData = await initiatePaytmPayment(amount, orderId, customerId);

      // Open PayTM payment page
      const config = {
        root: '',
        flow: 'DEFAULT',
        data: {
          orderId: paymentData.orderId,
          token: paymentData.txnToken,
          tokenType: 'TXN_TOKEN',
          amount: paymentData.txnAmount,
        },
        merchant: {
          redirect: true,
        },
        handler: {
          notifyMerchant: (eventName: string, data: any) => {
            console.log('NOTIFY_LOG', eventName, data);
          },
        },
      };

      // @ts-ignore
      if (window.Paytm && window.Paytm.CheckoutJS) {
        // @ts-ignore
        window.Paytm.CheckoutJS.init(config).then(() => {
          // @ts-ignore
          window.Paytm.CheckoutJS.invoke();
        });
      } else {
        throw new Error('PayTM CheckoutJS not loaded');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to process payment. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="modal show d-block" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1050,
        overflowY: 'auto',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-white border border-secondary">
          <div className="modal-header border-secondary">
            <h4 className="modal-title fw-bold">{service.title}</h4>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
              disabled={isProcessing}
            />
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="badge bg-gold text-dark fs-6 p-2">
                {service.price}
              </span>
              <div className="d-flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="badge bg-secondary text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h5 className="text-gold mb-2">Summary</h5>
              <p className="mb-0">{service.summary}</p>
            </div>
            
            <div className="mb-4">
              <h5 className="text-gold mb-2">Details</h5>
              <div className="bg-dark p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                {service.details}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
          </div>
          <div className="modal-footer border-secondary d-flex justify-content-between">
            <button 
              type="button" 
              className="btn btn-outline-light"
              onClick={onClose}
              disabled={isProcessing}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-gold d-flex align-items-center"
              onClick={handlePayment}
              disabled={isProcessing || !isScriptLoaded}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-wallet me-2" />
                  Pay {service.price}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
