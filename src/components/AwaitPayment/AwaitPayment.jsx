import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AwaitPayment.css";

const AwaitPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // MOCK PAYSTACK LOADING FLOW
    // This simulates Paystack loading, then successful payment
    const timer = setTimeout(() => {
      navigate("/receipt"); // navigate to receipt page
    }, 3000); // 3 seconds spinner

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="await-payment-page">
      <div className="await-payment-card">
        <div className="spinner"></div>

        <h2>Redirecting to Payment</h2>
        <p>Please wait while we prepare your payment session…</p>

        {/* 
          DEV NOTE:
          Real Paystack inline or redirect will replace this later.
          Backend + Paystack callback will control receipt navigation.
        */}
      </div>
    </div>
  );
};

export default AwaitPayment;
