import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { eventService, paymentService } from "../../services";
import "./BioDataForms.css"

function BiodataForms() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [age, setAge] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const dobInputRef = useRef(null);
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

  const calculateAge = (dob) => {
    if (!dob) return '';
    
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    return calculatedAge;
  };

  const handleDobChange = (e) => {
    let input = e.target.value;
    
    // Remove non-numeric characters except slashes
    input = input.replace(/[^\d/]/g, '');
    
    // Auto-format as user types: DD/MM/YYYY
    if (input.length === 2 && !input.includes('/')) {
      input = input + '/';
    } else if (input.length === 5 && input.split('/').length === 2) {
      input = input + '/';
    }
    
    // Limit to DD/MM/YYYY format
    if (input.length > 10) {
      input = input.substring(0, 10);
    }
    
    // Update the input value
    e.target.value = input;
    setSelectedDate(input);
    
    // Calculate age if complete date entered
    const parts = input.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
          day >= 1 && day <= 31 && month >= 0 && month <= 11) {
        const date = new Date(year, month, day);
        const calculatedAge = calculateAge(date);
        setAge(calculatedAge);
      }
    }
  };

  const handleDatePickerSelect = (date) => {
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formatted = `${day}/${month}/${year}`;
    
    setSelectedDate(formatted);
    if (dobInputRef.current) {
      dobInputRef.current.value = formatted;
    }
    
    const calculatedAge = calculateAge(date);
    setAge(calculatedAge);
    setShowDatePicker(false);
  };

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

      // Register for event
      const registrationResult = await eventService.registerForEvent(registrationData);

      if (!registrationResult.success) {
        setError(registrationResult.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Check what data we got back
      const responseData = registrationResult.data;

      // Try to extract the necessary fields
      const registrationId = responseData.registrationId || responseData._id || responseData.id;
      const reference = responseData.reference;

      if (!registrationId || !reference) {
        setError('Registration succeeded but missing payment information. Please contact support.');
        setLoading(false);
        return;
      }

      // Store registration data in localStorage as backup for receipt
      localStorage.setItem(`registration_${reference}`, JSON.stringify({
        ...registrationData,
        reference,
        registrationId,
        timestamp: new Date().toISOString(),
      }));

      // Initialize payment
      const paymentResult = await paymentService.initializePayment({
        registrationId,
        reference,
      });

      if (!paymentResult.success) {
        setError(`Payment initialization failed: ${paymentResult.error}`);
        setLoading(false);
        return;
      }

      // Check for authorization URL
      const authUrl = paymentResult.data?.authorization_url || 
                      paymentResult.data?.authorizationUrl ||
                      paymentResult.data?.data?.authorization_url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setError('Payment initialization failed. No payment URL received. Please try again or contact support.');
        setLoading(false);
      }
    } catch (err) {
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
          <div style={{ position: 'relative', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              ref={dobInputRef}
              id="dob" 
              name="dob" 
              type="text" 
              placeholder="DD/MM/YYYY (e.g., 15/03/2013)"
              maxLength="10"
              value={selectedDate}
              onChange={handleDobChange}
              onBlur={(e) => {
                // Validate on blur
                const input = e.target.value;
                if (input && !input.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                  e.target.setCustomValidity('Please use DD/MM/YYYY format (e.g., 15/03/2013)');
                } else if (input) {
                  // Validate date is reasonable
                  const parts = input.split('/');
                  const day = parseInt(parts[0]);
                  const month = parseInt(parts[1]);
                  const year = parseInt(parts[2]);
                  
                  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2010 || year > 2016) {
                    e.target.setCustomValidity('Please enter a valid date for U-13 registration (ages 10-13)');
                  } else {
                    e.target.setCustomValidity('');
                  }
                } else {
                  e.target.setCustomValidity('');
                }
              }}
              style={{ flex: 1 }}
              required 
            />
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
              title="Open calendar"
            >
              📅
            </button>
          </div>
          <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            Format: DD/MM/YYYY (Day/Month/Year) - Click 📅 for calendar
          </small>
          
          {showDatePicker && (
            <div style={{
              position: 'absolute',
              zIndex: 1000,
              marginTop: '4px',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              maxWidth: '320px'
            }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px' }}>Select Date of Birth</strong>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  ✕
                </button>
              </div>
              <input
                type="date"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    handleDatePickerSelect(new Date(e.target.value));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            id="age" 
            name="age" 
            type="number" 
            placeholder="Age (auto-calculated)" 
            value={age}
            readOnly
            required 
          />
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
          <label htmlFor="email">Email Address(Optional)</label>
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
