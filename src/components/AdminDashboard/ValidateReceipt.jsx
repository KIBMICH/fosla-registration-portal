import { useState } from "react";
import { paymentService } from "../../services";
import "./ValidateReceipt.css";

function ValidateReceipt() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationResult(null);

    try {
      const result = await paymentService.verifyReceipt(referenceNumber);

      if (result.success && result.data) {
        setValidationResult({
          valid: true,
          reference: result.data.reference || referenceNumber,
          studentName: result.data.studentName || result.data.firstName + ' ' + result.data.surname,
          amount: result.data.amount ? `₦${(result.data.amount / 100).toLocaleString()}` : 'N/A',
          date: result.data.paidAt || result.data.date || 'N/A',
          status: result.data.status || "Verified",
        });
      } else {
        setValidationResult({
          valid: false,
          message: result.error || "Receipt not found or invalid",
        });
      }
    } catch (err) {
      setValidationResult({
        valid: false,
        message: "An error occurred while validating the receipt",
      });
    } finally {
      setLoading(false);
    }
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
