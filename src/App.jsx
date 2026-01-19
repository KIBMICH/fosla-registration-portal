import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BioDataForms from "./components/BioDataForms/BioDataForms";
import AwaitPayment from "./components/AwaitPayment/AwaitPayment";
import Receipt from "./components/ReceiptPage/ReceiptPage";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BioDataForms />} />
        <Route path="/await-payment" element={<AwaitPayment />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


