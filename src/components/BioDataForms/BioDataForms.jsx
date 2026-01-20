import { useNavigate } from "react-router-dom";
import  { useRef } from "react";
import "./BioDataForms.css"



function BiodataForms() {

 const navigate = useNavigate();
  const formRef = useRef(null); // ← Create a ref for the form

  const handleProceed = () => {
    // -------------------------------
    // FORM VALIDATION
    // Uncomment the next lines to enforce required fields
    // if (formRef.current && !formRef.current.checkValidity()) {
    //   formRef.current.reportValidity();
    //   return; // stops navigation
    // }
    // -------------------------------

    navigate("/await-payment"); // goes to spinner page
  };


  return (
    <>
      {/* Fixed Header */}
      <header className="app-header">
        <div className="header-left">
          <img
            src="/Public/fosla-logo.png.jpg"
            alt="Foster Academy Logo"
            className="header-logo"
          />
        </div>

        <div className="header-text">
          <h1>FOSLA ACADEMY KARSHI</h1>
          <h2>Scholarship Registration</h2>
        </div>
      </header>

      {/* Form Content */}
      <div className="page-wrapper">
        <div className="form-card">
          <div className="form-header">
            <h1>FOSLA ACADEMY</h1>
            <h2>National U-13 Scholarship Screening Registration</h2>
            <p>
              Fill in the form below and pay for the scholarship screening exercise.
            </p>
          </div>

      <form className="registration-form" ref={formRef} onSubmit={(e) => { e.preventDefault(); handleProceed(); }}>
        <h3>Applicant Details</h3>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" placeholder="Enter First Name" required />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Surname</label>
          <input id="surname" type="text" placeholder="Enter Surname" required />
        </div>

        <div className="form-group">
          <label>Sex</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="sex" value="male" required /> Male
            </label>
            <label>
              <input type="radio" name="sex" value="female" required /> Female
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input id="dob" type="text" placeholder="Enter Date of Birth (MM/DD/YYYY)" required />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input id="age" type="text" placeholder="Enter Age" required />
        </div>

        <div className="form-group">
          <label htmlFor="stateResidence">State of Residence</label>
          <input id="stateResidence" type="text" placeholder="Enter State of Residence" required />
        </div>

        <div className="form-group">
          <label htmlFor="stateOrigin">State of Origin</label>
          <input id="stateOrigin" type="text" placeholder="Enter State of Origin" required />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position of Play</label>
          <input id="position" type="text" placeholder="Enter Position of Play" required />
        </div>

        <div className="form-group">
          <label htmlFor="guardianName">Guardian's Full Name</label>
          <input id="guardianName" type="text" placeholder="Enter Guardian's Full Name" required />
        </div>

        <div className="form-group">
          <label htmlFor="guardianPhone">Guardian's Phone Number</label>
          <input id="guardianPhone" type="tel" placeholder="Enter Guardian's Phone Number" required />
        </div>

        <button type="submit" className="submit-btn">
          Proceed to Payment
        </button>
      </form>
        </div>
      </div>
    </>
  );
}

export default BiodataForms;
