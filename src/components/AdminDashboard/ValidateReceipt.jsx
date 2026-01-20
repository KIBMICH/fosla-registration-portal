import { useState } from "react";
import "./ValidateReceipt.css";

function ValidateReceipt() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - in production, verify with backend
      if (referenceNumber.length > 0) {
        setValidationResult({
          valid: true,
          reference: referenceNumber,
          studentName: "Aminu Musa Bello",
          amount: "₦5,000.00",
          date: "2024-07-25 14:30:00",
          status: "Verified",
        });
      } else {
        setValidationResult({
          valid: false,
          message: "Receipt not found",
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setReferenceNumber("");
    setValidationResult(null);
  };

  return (
    <div className="validate-container">
      <div className="validate-card">
        <h2>Validate Receipt</h2>
        <p>Enter the payment reference number to verify receipt</p>

        <form onSubmit={handleValidate}>
          <div className="form-group">
            <label htmlFor="reference">Payment Reference Number</label>
            <input
              id="reference"
              type="text"
              placeholder="e.g., FSL7284S789QKEDBEF"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="validate-btn" disabled={loading}>
              {loading ? "Validating..." : "Validate Receipt"}
            </button>
            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        {validationResult && (
          <div className={`validation-result ${validationResult.valid ? "valid" : "invalid"}`}>
            {validationResult.valid ? (
              <>
                <div className="result-icon">✓</div>
                <h3>Receipt Verified</h3>
                <div className="result-details">
                  <div className="detail-row">
                    <span className="label">Reference:</span>
                    <span className="value">{validationResult.reference}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Student Name:</span>
                    <span className="value">{validationResult.studentName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Amount Paid:</span>
                    <span className="value">{validationResult.amount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Payment Date:</span>
                    <span className="value">{validationResult.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value status">{validationResult.status}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="result-icon error">✗</div>
                <h3>Receipt Not Found</h3>
                <p>{validationResult.message}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ValidateReceipt;
