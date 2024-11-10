import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModeratorDashboard from './Components/ModeratorDashboard';
import AdminHome from './Components/Admin';
import AdminDashboard from './Components/AdminDashboard';
import CreateEvent from './Components/CreateEvent';
import CreateUser from './Components/CreateUser';
import UserManagement from './Components/UserManagement';
import HomeUser from './Components/HomeUser';
import SignUpUser from './Components/SignUpUser';
import ForgotPassword from './Components/ForgotPassword';
import ModeratorHome from './Components/ModeratorHome';
import UserProfile from './Components/UserProfile';
import ContentManagement from './Components/ContentManagement';
import Home from './Components/Home';



function App() {
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail, isSignedIn]);


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/SignUpUser" element={<SignUpUser setUserEmail={setUserEmail} />} />

          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/ModeratorHome" element={<ModeratorHome />} />

          <Route path="/createEvent" element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />} />

          <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />

          <Route path="/AdminHome" element={<AdminHome />} />

          <Route path="/AdminDashboard" element={<AdminDashboard />} />

          <Route path="/CreateUser" element={<CreateUser />} />

          <Route path="/UserManagement" element={<UserManagement />} />

          <Route path="/HomeUser" element={<HomeUser />} />

          <Route path="/ForgotPassword" element={<ForgotPassword />} />

          <Route path='/UserProfile' element={<UserProfile />} />

          <Route path='/ContentManagement' element={<ContentManagement />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
