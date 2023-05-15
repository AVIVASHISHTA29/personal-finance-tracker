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

// TODO: Handle auth changes - if user logged in keep the user logged in
// TODO: If the user has no transactions show no transactions
// TODO: Save the transactions in firestore and fetch them
// TODO: Use of useContext() to manage state of user and to manage the transactions in firebase
