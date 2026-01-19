import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./ReceiptPage.css";

const Receipt = () => {
  const receiptRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  // Mock fallback data (in case user refreshes page)
  const data = state || {
    institution: "FOSLA Academy",
    event: "Scholarship Screening",
    studentName: "Aminu Musa Bello",
    sex: "Male",
    dob: "05/15/2010",
    age: 14,
    stateOfOrigin: "Plateau",
    position: "Midfielder",
    guardianName: "Fatima Bello",
    guardianPhone: "+234 801 234 5678",
    amount: "₦5,000.00",
    reference: "FSL7284S789QKEDBEF",
    date: "2024-07-25 14:30:00",
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: "payment-receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(receiptRef.current)
      .save();
  };

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

