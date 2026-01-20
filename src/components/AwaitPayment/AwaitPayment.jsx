import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { paymentService } from "../../services";
import "./AwaitPayment.css";

const AwaitPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      // Check if this is a Paystack callback
      // Paystack can send either 'reference' or 'trxref'
      const reference = searchParams.get('reference') || searchParams.get('trxref');
      const status = searchParams.get('status');

      console.log('🔍 Payment callback params:', { reference, status, allParams: Object.fromEntries(searchParams) });

      if (reference) {
        // This is a Paystack callback
        console.log('✅ Paystack callback detected with reference:', reference);
        
        // Check status if provided, otherwise assume success
        if (!status || status === 'success' || status === 'successful') {
          console.log('🎉 Payment successful, redirecting to receipt');
          // Verify payment and navigate to receipt
          navigate(`/receipt?reference=${reference}`);
        } else {
          console.warn('⚠️ Payment status:', status);
          // Payment failed or cancelled
          setError('Payment was not completed. Please try again.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } else {
        console.log('ℹ️ No reference in URL, checking location state');
        // This is initial payment loading (from registration)
        const stateData = location.state;
        
        if (stateData?.reference) {
          console.log('📦 Found reference in state:', stateData.reference);
          // We have a reference from registration, simulate loading
          setTimeout(() => {
            navigate(`/receipt?reference=${stateData.reference}`);
          }, 3000);
        } else {
          console.warn('⚠️ No reference found, redirecting to home');
          // No reference, redirect to home
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    };

    handlePaymentCallback();
  }, [navigate, searchParams, location]);

  return (
    <div className="await-payment-page">
      <div className="await-payment-card">
        {error ? (
          <>
            <div className="error-icon">✗</div>
            <h2>Payment Failed</h2>
            <p>{error}</p>
          </>
        ) : (
          <>
            <div className="spinner"></div>
            <h2>Processing Payment</h2>
            <p>Please wait while we verify your payment...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AwaitPayment;
