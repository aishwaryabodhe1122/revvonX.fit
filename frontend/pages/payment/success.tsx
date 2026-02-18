import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const { order_id } = router.query;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="alert alert-success">
            <h4 className="alert-heading">Payment Successful!</h4>
            <p>Thank you for your purchase. Your payment has been processed successfully.</p>
            {order_id && (
              <p className="mb-0">
                Order ID: <strong>{order_id}</strong>
              </p>
            )}
          </div>
          <Link href="/services" className="btn btn-primary mt-3">
            Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
