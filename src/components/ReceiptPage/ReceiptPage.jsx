import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { paymentService } from "../../services";
import "./ReceiptPage.css";

const Receipt = () => {
  const receiptRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'PENDING' or 'PAID'

  useEffect(() => {
    const fetchReceipt = async () => {
      // Get reference from URL params or state
      const reference = searchParams.get('reference') || state?.reference;

      if (!reference) {
        setError('No payment reference found');
        setLoading(false);
        return;
      }

      // Retry logic: Try up to 5 times with increasing delays
      const maxRetries = 5;
      const retryDelays = [2000, 3000, 4000, 5000, 6000]; // milliseconds - longer delays for webhook processing

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const verifyResult = await paymentService.verifyPayment(reference);

          if (verifyResult.success && verifyResult.data) {
            const paymentData = verifyResult.data;
            
            // Extract status - handle different status values from Paystack
            const status = paymentData.status || paymentData.paymentStatus || 'PENDING';
            const normalizedStatus = status.toUpperCase();
            
            // Map Paystack statuses to our display statuses
            let displayStatus;
            if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'SUCCESSFUL' || normalizedStatus === 'PAID') {
              displayStatus = 'PAID';
            } else if (normalizedStatus === 'FAILED') {
              displayStatus = 'FAILED';
            } else if (normalizedStatus === 'ABANDONED') {
              displayStatus = 'ABANDONED';
            } else {
              displayStatus = 'PENDING';
            }
            
            setPaymentStatus(displayStatus);
            console.log('💳 Payment status:', displayStatus);
            
            // Check if payment is still pending
            if (displayStatus === 'PENDING') {
              console.warn(`⏳ Payment still pending (attempt ${attempt + 1}/${maxRetries})`);
              
              // If this is the last attempt, try localStorage fallback
              if (attempt === maxRetries - 1) {
                console.log('🔍 Trying localStorage fallback...');
                const localData = localStorage.getItem(`registration_${reference}`);
                if (localData) {
                  const storedData = JSON.parse(localData);
                  console.log('� Found data in localStorage:', storedData);
                  
                  setData({
                    institution: "FOSLA Academy",
                    event: "Scholarship Screening",
                    studentName: `${storedData.firstName} ${storedData.surname}`,
                    sex: storedData.sex || 'N/A',
                    dob: storedData.dateOfBirth || 'N/A',
                    age: storedData.age || 'N/A',
                    stateOfOrigin: storedData.stateOfOrigin || 'N/A',
                    position: storedData.positionOfPlay || 'N/A',
                    guardianName: storedData.guardianFullName || 'N/A',
                    guardianPhone: storedData.guardianPhoneNumber || 'N/A',
                    amount: paymentData.amount ? `₦${(paymentData.amount / 100).toLocaleString()}` : 'N/A',
                    reference: storedData.reference,
                    date: new Date().toLocaleString(),
                  });
                  setLoading(false);
                  return;
                }
                
                setError('Payment is still pending verification. Please check back in a few minutes.');
                setLoading(false);
                return;
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
              continue;
            }
            
            // If payment failed or was abandoned, show error
            if (displayStatus === 'FAILED' || displayStatus === 'ABANDONED') {
              setError(`Payment ${displayStatus.toLowerCase()}. Please try registering again.`);
              setLoading(false);
              return;
            }
            
            // Payment is successful, extract data
            // First, try to get data from localStorage (most reliable source)
            const localData = localStorage.getItem(`registration_${reference}`);
            let registrationData = null;
            
            if (localData) {
              try {
                registrationData = JSON.parse(localData);
              } catch (e) {
                console.error('Failed to parse localStorage data:', e);
              }
            }
            
            // If localStorage has data, use it (most reliable)
            if (registrationData) {
              const amount = paymentData.amount || paymentData.amountPaid || paymentData.amount_paid || 0;
              const paidAt = paymentData.paidAt || paymentData.paid_at || paymentData.paymentDate || paymentData.payment_date || new Date().toLocaleString();
              
              setData({
                institution: "FOSLA Academy",
                event: "Scholarship Screening",
                studentName: `${registrationData.firstName} ${registrationData.surname}`,
                sex: registrationData.sex || 'N/A',
                dob: registrationData.dateOfBirth || 'N/A',
                age: registrationData.age || 'N/A',
                stateOfOrigin: registrationData.stateOfOrigin || 'N/A',
                position: registrationData.positionOfPlay || 'N/A',
                guardianName: registrationData.guardianFullName || 'N/A',
                guardianPhone: registrationData.guardianPhoneNumber || 'N/A',
                amount: amount ? `₦${(amount / 100).toLocaleString()}` : 'N/A',
                reference: registrationData.reference || reference,
                date: paidAt,
              });
              setLoading(false);
              return;
            }
            
            // Fallback: Try to extract from backend response (if available)
            // Check if registration data is nested in the payment response
            const backendRegistration = paymentData.registration || paymentData.registrationData || paymentData;
            
            const firstName = backendRegistration.firstName || backendRegistration.first_name || backendRegistration.studentFirstName || '';
            const surname = backendRegistration.surname || backendRegistration.last_name || backendRegistration.lastName || backendRegistration.studentSurname || '';
            const sex = backendRegistration.sex || backendRegistration.gender || '';
            const dob = backendRegistration.dateOfBirth || backendRegistration.date_of_birth || backendRegistration.dob || '';
            const age = backendRegistration.age || '';
            const stateOfOrigin = backendRegistration.stateOfOrigin || backendRegistration.state_of_origin || backendRegistration.state || '';
            const position = backendRegistration.positionOfPlay || backendRegistration.position_of_play || backendRegistration.position || '';
            const guardianName = backendRegistration.guardianFullName || backendRegistration.guardian_full_name || backendRegistration.guardianName || '';
            const guardianPhone = backendRegistration.guardianPhoneNumber || backendRegistration.guardian_phone_number || backendRegistration.guardianPhone || '';
            const amount = paymentData.amount || paymentData.amountPaid || paymentData.amount_paid || 0;
            const ref = paymentData.reference || reference;
            const paidAt = paymentData.paidAt || paymentData.paid_at || paymentData.paymentDate || paymentData.payment_date || new Date().toLocaleString();
            
            setData({
              institution: "FOSLA Academy",
              event: "Scholarship Screening",
              studentName: `${firstName} ${surname}`.trim() || 'N/A',
              sex: sex || 'N/A',
              dob: dob || 'N/A',
              age: age || 'N/A',
              stateOfOrigin: stateOfOrigin || 'N/A',
              position: position || 'N/A',
              guardianName: guardianName || 'N/A',
              guardianPhone: guardianPhone || 'N/A',
              amount: amount ? `₦${(amount / 100).toLocaleString()}` : 'N/A',
              reference: ref,
              date: paidAt,
            });
            setLoading(false);
            return; // Success, exit the retry loop
          } else {
            // If this is the last attempt, try localStorage fallback
            if (attempt === maxRetries - 1) {
              const localData = localStorage.getItem(`registration_${reference}`);
              if (localData) {
                const storedData = JSON.parse(localData);
                
                setData({
                  institution: "FOSLA Academy",
                  event: "Scholarship Screening",
                  studentName: `${storedData.firstName} ${storedData.surname}`,
                  sex: storedData.sex || 'N/A',
                  dob: storedData.dateOfBirth || 'N/A',
                  age: storedData.age || 'N/A',
                  stateOfOrigin: storedData.stateOfOrigin || 'N/A',
                  position: storedData.positionOfPlay || 'N/A',
                  guardianName: storedData.guardianFullName || 'N/A',
                  guardianPhone: storedData.guardianPhoneNumber || 'N/A',
                  amount: 'Paid',
                  reference: storedData.reference,
                  date: new Date().toLocaleString(),
                });
                setPaymentStatus('PENDING');
                setLoading(false);
                return;
              }
              
              setError(verifyResult.error || 'Failed to verify payment after multiple attempts.');
              setLoading(false);
              return;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
          }
        } catch (err) {
          // If this is the last attempt, try localStorage fallback
          if (attempt === maxRetries - 1) {
            const localData = localStorage.getItem(`registration_${reference}`);
            if (localData) {
              const storedData = JSON.parse(localData);
              
              setData({
                institution: "FOSLA Academy",
                event: "Scholarship Screening",
                studentName: `${storedData.firstName} ${storedData.surname}`,
                sex: storedData.sex || 'N/A',
                dob: storedData.dateOfBirth || 'N/A',
                age: storedData.age || 'N/A',
                stateOfOrigin: storedData.stateOfOrigin || 'N/A',
                position: storedData.positionOfPlay || 'N/A',
                guardianName: storedData.guardianFullName || 'N/A',
                guardianPhone: storedData.guardianPhoneNumber || 'N/A',
                amount: 'Paid',
                reference: storedData.reference,
                date: new Date().toLocaleString(),
              });
              setPaymentStatus('PENDING');
              setLoading(false);
              return;
            }
            
            setError('Unable to verify payment. Please check back in a few minutes.');
            setLoading(false);
            return;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
        }
      }
    };

    fetchReceipt();
  }, [searchParams, state]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: `receipt-${data?.reference || 'payment'}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(receiptRef.current)
      .save();
  };

  if (loading) {
    return (
      <div className="receipt-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Verifying your payment with Paystack...</p>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5rem' }}>
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    const reference = searchParams.get('reference') || state?.reference;
    return (
      <div className="receipt-page">
        <div className="error-message">
          <h3>Unable to Load Receipt</h3>
          <p>{error || 'Receipt not found'}</p>
          {reference && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <strong>Payment Reference:</strong> {reference}
              <br />
              <small>Please save this reference number for your records.</small>
            </div>
          )}
          <p style={{ marginTop: '1rem', fontSize: '0.9em', color: '#666' }}>
            Your payment was successful, but the receipt is still being processed. 
            Please wait a moment and try refreshing, or contact support with your reference number.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} className="btn primary">
            Retry Loading Receipt
          </button>
          <button onClick={() => navigate("/")} className="btn outline">
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-page">
      <div className="receipt-card" ref={receiptRef}>
        <div className="receipt-logo-container">
          <img 
            src="/fosla-logo.png.jpg" 
            alt="FOSLA Academy Logo" 
            className="receipt-logo"
          />
        </div>
        
        <h2 className="receipt-title">
          {paymentStatus === 'PAID' ? 'Payment Successful' : 
           paymentStatus === 'PENDING' ? 'Payment Pending' :
           paymentStatus === 'FAILED' ? 'Payment Failed' :
           paymentStatus === 'ABANDONED' ? 'Payment Abandoned' : 'Payment Status'}
        </h2>
        <p className="receipt-subtitle">
          {paymentStatus === 'PAID' 
            ? 'Your scholarship screening registration has been completed successfully.'
            : paymentStatus === 'PENDING'
            ? 'Your payment is being verified. Please check back shortly.'
            : paymentStatus === 'FAILED'
            ? 'Your payment could not be processed. Please try again.'
            : 'Your payment was not completed. Please register again.'}
        </p>

        {paymentStatus && (
          <div className={`payment-status-badge ${paymentStatus.toLowerCase()}`}>
            Status: {paymentStatus}
          </div>
        )}

        <h3 className="section-title">Receipt Details</h3>

        <div className="receipt-grid">
          <ReceiptRow label="Institution" value={data.institution} />
          <ReceiptRow label="Event" value={data.event} />
          <ReceiptRow label="Student Full Name" value={data.studentName} />
          <ReceiptRow label="Sex" value={data.sex} />
          <ReceiptRow label="Date of Birth" value={data.dob} />
          <ReceiptRow label="Age" value={data.age} />
          <ReceiptRow label="State of Origin" value={data.stateOfOrigin} />
          <ReceiptRow label="Position" value={data.position} />
          <ReceiptRow label="Guardian Name" value={data.guardianName} />
          <ReceiptRow label="Guardian Phone" value={data.guardianPhone} />
          <ReceiptRow label="Screening Fee Paid" value={data.amount} />
          <ReceiptRow label="Payment Reference" value={data.reference} />
          <ReceiptRow label="Payment Date & Time" value={data.date} />
        </div>
      </div>

      <div className="receipt-actions">
        <button onClick={handlePrint} className="btn primary">
          Print Receipt
        </button>
        <button onClick={handleDownloadPDF} className="btn outline">
          Download PDF
        </button>
        <button onClick={() => navigate("/")} className="btn ghost">
          Back Home
        </button>
      </div>
    </div>
  );
};

const ReceiptRow = ({ label, value }) => (
  <div className="receipt-row">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

export default Receipt;

