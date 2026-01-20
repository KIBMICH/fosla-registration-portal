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
          console.log(`🔄 Fetching receipt (attempt ${attempt + 1}/${maxRetries})...`);
          
          // First, try to verify the payment (this might trigger backend verification)
          let result = await paymentService.verifyReceipt(reference);
          console.log('🔍 Verify result:', result);

          // If verify returns pending or no data, try the regular receipt endpoint
          if (!result.success || !result.data || result.data.status === 'PENDING' || !result.data.valid) {
            console.log('🔄 Trying receipt endpoint...');
            result = await paymentService.getReceipt(reference);
            console.log('📄 Receipt result:', result);
          }

          // Check if we got valid data
          if (result.success && result.data) {
            const receiptData = result.data;
            console.log('✅ Receipt data fetched successfully:', receiptData);
            console.log('📋 Full response structure:', JSON.stringify(receiptData, null, 2));
            
            // Check if payment is still pending
            if (receiptData.status === 'PENDING' || receiptData.valid === false) {
              console.warn(`⏳ Payment still pending (attempt ${attempt + 1}/${maxRetries})`);
              
              // If this is the last attempt, show pending message
              if (attempt === maxRetries - 1) {
                setError('Payment verification is taking longer than expected. Please check back in a few minutes or contact support.');
                setLoading(false);
                return;
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
              continue;
            }
            
            // Handle different possible field name variations from backend
            const firstName = receiptData.firstName || receiptData.first_name || receiptData.studentFirstName || '';
            const surname = receiptData.surname || receiptData.last_name || receiptData.lastName || receiptData.studentSurname || '';
            const sex = receiptData.sex || receiptData.gender || '';
            const dob = receiptData.dateOfBirth || receiptData.date_of_birth || receiptData.dob || '';
            const age = receiptData.age || '';
            const stateOfOrigin = receiptData.stateOfOrigin || receiptData.state_of_origin || receiptData.state || '';
            const position = receiptData.positionOfPlay || receiptData.position_of_play || receiptData.position || '';
            const guardianName = receiptData.guardianFullName || receiptData.guardian_full_name || receiptData.guardianName || '';
            const guardianPhone = receiptData.guardianPhoneNumber || receiptData.guardian_phone_number || receiptData.guardianPhone || '';
            const amount = receiptData.amount || receiptData.amountPaid || receiptData.amount_paid || 0;
            const ref = receiptData.reference || receiptData.paymentReference || receiptData.payment_reference || reference;
            const paidAt = receiptData.paidAt || receiptData.paid_at || receiptData.paymentDate || receiptData.payment_date || new Date().toLocaleString();
            
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
            console.warn(`⚠️ Attempt ${attempt + 1} failed:`, result.error);
            
            // If this is the last attempt, show error
            if (attempt === maxRetries - 1) {
              setError(result.error || 'Failed to fetch receipt after multiple attempts. Your payment may still be processing.');
              setLoading(false);
              return;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
          }
        } catch (err) {
          console.error(`❌ Attempt ${attempt + 1} error:`, err);
          
          // If this is the last attempt, show error
          if (attempt === maxRetries - 1) {
            setError('Unable to load receipt. Your payment may still be processing. Please check back in a few minutes.');
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
        <h2 className="receipt-title">Payment Successful</h2>
        <p className="receipt-subtitle">
          Your scholarship screening registration has been completed successfully.
        </p>

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

