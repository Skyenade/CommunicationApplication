import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModeraterHome from './Components/Moderator'; 
import ModeratorDashboard from './Components/ModeratorDashboard'; 
import AdminHome from './Components/Admin';
import AdminDashboard from './Components/AdminDashboard';
import CreateEvent from './Components/CreateEvent';
import Header from './Components/Home';
import UserManagement from './Components/UserManagement';

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail]);

  return (
    <Router>
      <div className="App">
        <Routes>
        {/* <Route
            path="/"
            element={<Header setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />}
          /> */}
          <Route path="/" element={<ModeraterHome />} /> 
          <Route
            path="/createEvent"
            element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />}
          />
          {/* <Route path="/ModeraterHome" element={<ModeraterHome />} />   */}
        <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
