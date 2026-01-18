import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BioDataForms from "./components/BioDataForms/BioDataForms";
import AwaitPayment from "./components/AwaitPayment/AwaitPayment";
import Receipt from "./components/ReceiptPage/ReceiptPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BioDataForms />} />
        <Route path="/await-payment" element={<AwaitPayment />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default App;


