import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PaymentFailure() {
  const router = useRouter();
  const { order_id, message } = router.query;

  const errorMessages: Record<string, string> = {
    payment_processing_error: 'There was an error processing your payment.',
    payment_declined: 'Your payment was declined. Please try again or use a different payment method.',
    payment_cancelled: 'Your payment was cancelled.',
    default: 'There was an issue with your payment. Please try again.'
  };

  const errorMessage = 
    (typeof message === 'string' && errorMessages[message]) || 
    message || 
    errorMessages.default;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Payment Failed</h4>
            <p>{errorMessage}</p>
            {order_id && (
              <p className="mb-0">
                Order ID: <strong>{order_id}</strong>
              </p>
            )}
          </div>
          <div className="d-flex gap-3 justify-content-center">
            <Link href="/services" className="btn btn-outline-primary">
              Back to Services
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
