import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { eventService, paymentService } from "../../services";
import "./BioDataForms.css"

function BiodataForms() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    // Fetch event information on component mount
    const fetchEventInfo = async () => {
      try {
        const result = await eventService.getEventInfo();
        if (result.success && result.data) {
          setEventInfo(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch event info:', err);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEventInfo();
  }, []);

  const handleProceed = async (e) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    setLoading(true);

    try {
      // Collect form data
      const formData = new FormData(formRef.current);
      const registrationData = {
        firstName: formData.get('firstName'),
        surname: formData.get('surname'),
        sex: formData.get('sex'),
        dateOfBirth: formData.get('dob'),
        age: parseInt(formData.get('age')),
        stateOfResidence: formData.get('stateResidence'),
        stateOfOrigin: formData.get('stateOrigin'),
        positionOfPlay: formData.get('position'),
        guardianFullName: formData.get('guardianName'),
        guardianPhoneNumber: formData.get('guardianPhone'),
        email: formData.get('email'),
      };

      console.log('📝 Submitting registration:', registrationData);

      // Register for event
      const registrationResult = await eventService.registerForEvent(registrationData);
      console.log('✅ Registration result:', registrationResult);

      if (!registrationResult.success) {
        setError(registrationResult.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Check what data we got back
      const responseData = registrationResult.data;
      console.log('📦 Registration response data:', responseData);

      // Try to extract the necessary fields
      const registrationId = responseData.registrationId || responseData._id || responseData.id;
      const reference = responseData.reference;

      if (!registrationId || !reference) {
        console.error('❌ Missing required fields:', { registrationId, reference });
        setError('Registration succeeded but missing payment information. Please contact support.');
        setLoading(false);
        return;
      }

      console.log('🎫 Got registration ID:', registrationId, 'Reference:', reference);

      // Store registration data in localStorage as backup for receipt
      localStorage.setItem(`registration_${reference}`, JSON.stringify({
        ...registrationData,
        reference,
        registrationId,
        timestamp: new Date().toISOString(),
      }));
      console.log('💾 Stored registration data in localStorage for reference:', reference);

      // Initialize payment
      console.log('💳 Initializing payment with:', { registrationId, reference });
      const paymentResult = await paymentService.initializePayment({
        registrationId,
        reference,
      });
      console.log('💰 Payment result:', paymentResult);

      if (!paymentResult.success) {
        console.error('❌ Payment initialization failed:', paymentResult.error);
        setError(`Payment initialization failed: ${paymentResult.error}`);
        setLoading(false);
        return;
      }

      // Check for authorization URL
      const authUrl = paymentResult.data?.authorization_url || 
                      paymentResult.data?.authorizationUrl ||
                      paymentResult.data?.data?.authorization_url;

      if (authUrl) {
        console.log('🚀 Redirecting to Paystack:', authUrl);
        window.location.href = authUrl;
      } else {
        console.error('⚠️ No authorization_url in response:', paymentResult.data);
        setError('Payment initialization failed. No payment URL received. Please try again or contact support.');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error during registration/payment:', err);
      setError(`An unexpected error occurred: ${err.message || 'Please try again.'}`);
      setLoading(false);
    }
  };


  return (
    <>
      {/* Fixed Header */}
      <header className="app-header">
        <div className="header-left">
          <img
            src="/fosla-logo.png.jpg"
            alt="Foster Academy Logo"
            className="header-logo"
          />
        </div>

        <div className="header-text">
          <h1>FOSLA ACADEMY KARSHI, ABUJA</h1>
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
            {eventInfo && (
              <div className="event-amount">
                <strong>Registration Fee: ₦{(eventInfo.amount / 100).toLocaleString()}</strong>
              </div>
            )}
            {loadingEvent && (
              <div className="loading-event">Loading event information...</div>
            )}
          </div>

      <form className="registration-form" ref={formRef} onSubmit={handleProceed}>
        <h3>Applicant Details</h3>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" placeholder="Enter First Name" required />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Surname</label>
          <input id="surname" name="surname" type="text" placeholder="Enter Surname" required />
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
          <input id="dob" name="dob" type="text" placeholder="Enter Date of Birth (MM/DD/YYYY)" required />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" placeholder="Enter Age" required />
        </div>

        <div className="form-group">
          <label htmlFor="stateResidence">State of Residence</label>
          <input id="stateResidence" name="stateResidence" type="text" placeholder="Enter State of Residence" required />
        </div>

        <div className="form-group">
          <label htmlFor="stateOrigin">State of Origin</label>
          <input id="stateOrigin" name="stateOrigin" type="text" placeholder="Enter State of Origin" required />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position of Play</label>
          <input id="position" name="position" type="text" placeholder="Enter Position of Play" required />
        </div>

        <div className="form-group">
          <label htmlFor="guardianName">Guardian's Full Name</label>
          <input id="guardianName" name="guardianName" type="text" placeholder="Enter Guardian's Full Name" required />
        </div>

        <div className="form-group">
          <label htmlFor="guardianPhone">Guardian's Phone Number</label>
          <input id="guardianPhone" name="guardianPhone" type="tel" placeholder="Enter Guardian's Phone Number" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="Enter Email Address" required />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
        </div>
      </div>
    </>
  );
}

export default BiodataForms;
