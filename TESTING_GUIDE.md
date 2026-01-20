# Admin Panel Testing Guide

## Manual Testing

### 1. Login Page (`/admin/login`)
- Navigate to: `http://localhost:5173/admin/login`
- Test with demo credentials:
  - Email: `admin@fosla.com`
  - Password: `admin123`

**Test Cases:**
- ✓ Valid login redirects to dashboard
- ✓ Invalid email shows error
- ✓ Invalid password shows error
- ✓ Empty fields show validation error
- ✓ Loading state shows "Logging in..." button

### 2. Dashboard - All Records Tab
- View all registered applicants in a table
- Search functionality by name or phone

**Test Cases:**
- ✓ Table displays all mock records
- ✓ Search by first name filters results
- ✓ Search by surname filters results
- ✓ Search by phone number filters results
- ✓ No results message appears when search has no matches
- ✓ Status badges display correctly (Paid/Pending)

### 3. Dashboard - Validate Receipt Tab
- Enter payment reference number to validate

**Test Cases:**
- ✓ Enter reference number and click "Validate Receipt"
- ✓ Valid receipt shows success message with details
- ✓ Invalid reference shows error message
- ✓ Clear button resets form
- ✓ Loading state shows "Validating..." button

### 4. Dashboard - Change Password Tab
- Update admin password

**Test Cases:**
- ✓ All fields required validation
- ✓ New password must be at least 6 characters
- ✓ Passwords must match
- ✓ New password must differ from current
- ✓ Current password: `admin123` (for testing)
- ✓ Success message appears on valid change
- ✓ Error message for incorrect current password
- ✓ Form clears after successful change

### 5. Logout
- Click logout button in header

**Test Cases:**
- ✓ Logout clears session
- ✓ Redirects to login page
- ✓ Cannot access dashboard without login

---

## Automated Testing

### Setup (Once npm is working)
```powershell
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Run Tests
```powershell
npm run test
```

### Test Files
- `src/__tests__/utils/validation.test.js` - Validation utility tests
- `src/__tests__/utils/auth.test.js` - Authentication utility tests

### Add to package.json
```json
"scripts": {
  "test": "vitest --run",
  "test:watch": "vitest"
}
```

---

## Testing Checklist

### Security
- [ ] Credentials not exposed in console
- [ ] localStorage used for session (not sensitive data)
- [ ] Password fields are masked
- [ ] Logout clears all auth data

### Functionality
- [ ] Login works with correct credentials
- [ ] Invalid credentials show error
- [ ] Protected routes redirect to login
- [ ] All tabs load correctly
- [ ] Search filters work
- [ ] Receipt validation works
- [ ] Password change validates properly
- [ ] Logout works

### UI/UX
- [ ] Loading states show feedback
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Responsive on mobile
- [ ] Keyboard navigation works
- [ ] ARIA labels present

### Performance
- [ ] No console errors
- [ ] No cascading renders
- [ ] Search is responsive
- [ ] Page loads quickly

---

## Browser DevTools Testing

1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Verify auth tokens are set after login
4. Verify tokens are cleared after logout
5. Check Network tab for API calls (when backend is added)
6. Check Console for any errors or warnings
