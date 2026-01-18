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

  /* Form Content */
  <div className="page-wrapper">
    <div className="form-card">
      <div className="form-header">
        <h1>FOSLA ACADEMY</h1>
        <h2>National U-13 Scholarship Screening Registration</h2>
        <p>
          Fill in the form below and pay for the scholarship screening exercise.
        </p>
      </div>

      <form className="registration-form" ref={formRef}>
        <h3>Applicant Details</h3>

        <div className="form-group">
          <label>First Name </label>
          <input type="text" placeholder="Eze Shaibu Femi" required/>
        </div>

        <div className="form-group" >

         <label>Surname</label>
          <input type="text" placeholder="Ododo" required />
        </div>

        <div className="form-group">
          <label>Sex </label>
          <div className="radio-group" required>
            <label>
              <input type="radio" name="sex" /> Male
            </label>
            <label>
              <input type="radio" name="sex" /> Female
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Date of birth </label>
          <input type="text" placeholder="03/25/2015/" required />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="text" placeholder="12" required/>
        </div>

        <div className="form-group">
          <label>State of Residence</label>
          <input type="number" placeholder="Abia" required/>
        </div>

        <div className="form-group">
          <label>State of Origin</label>
          <input type="text" placeholder="Sokoto " required />
        </div>

        <div className="form-group">
          <label>Position of Play </label>
          <input type="text" placeholder="Goal-keeper" required/>
        </div>

        <div className="form-group">
          <label>Guardian's full name</label>
          <input type="text" placeholder="Mommy's Name" required />
        </div>

        <div className="form-group">
          <label>08012345678 </label>
          <input type="tel" placeholder="Guardian's Phone Number" required/>
        </div>

        <button type="submit" className="submit-btn" 
           onClick={handleProceed} >
          Proceed to Payment
        </button>
      </form>
    </div>
  </div>
</>

  )
}

export default BiodataForms;
