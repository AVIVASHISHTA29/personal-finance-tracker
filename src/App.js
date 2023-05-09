import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignUpSignIn from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
