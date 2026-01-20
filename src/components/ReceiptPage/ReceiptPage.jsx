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
      const retryDelays = [1000, 2000, 3000, 4000, 5000]; // milliseconds

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          console.log(`🔄 Fetching receipt (attempt ${attempt + 1}/${maxRetries})...`);
          
          // Try the regular receipt endpoint first
          let result = await paymentService.getReceipt(reference);

          // If that fails, try the verify endpoint as fallback
          if (!result.success || !result.data) {
            console.log('🔄 Trying verify endpoint as fallback...');
            result = await paymentService.verifyReceipt(reference);
          }

          if (result.success && result.data) {
            const receiptData = result.data;
            console.log('✅ Receipt data fetched successfully:', receiptData);
            setData({
              institution: "FOSLA Academy",
              event: "Scholarship Screening",
              studentName: `${receiptData.firstName} ${receiptData.surname}`,
              sex: receiptData.sex,
              dob: receiptData.dateOfBirth,
              age: receiptData.age,
              stateOfOrigin: receiptData.stateOfOrigin,
              position: receiptData.positionOfPlay,
              guardianName: receiptData.guardianFullName,
              guardianPhone: receiptData.guardianPhoneNumber,
              amount: receiptData.amount ? `₦${(receiptData.amount / 100).toLocaleString()}` : 'N/A',
              reference: receiptData.reference,
              date: receiptData.paidAt || new Date().toLocaleString(),
            });
            setLoading(false);
            return; // Success, exit the retry loop
          } else {
            console.warn(`⚠️ Attempt ${attempt + 1} failed:`, result.error);
            
            // If this is the last attempt, show error
            if (attempt === maxRetries - 1) {
              setError(result.error || 'Failed to fetch receipt after multiple attempts');
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
            setError('Unable to load receipt. Please contact support with your payment reference.');
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
        <div className="loading">Loading receipt...</div>
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
        </div>
        <button onClick={() => navigate("/")} className="btn primary">
          Back Home
        </button>
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

