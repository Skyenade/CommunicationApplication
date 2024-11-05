import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModeraterHome from './Components/Moderator'; 
import ModeratorDashboard from './Components/ModeratorDashboard'; 
import AdminHome from './Components/Admin';
import AdminDashboard from './Components/AdminDashboard';
import CreateEvent from './Components/CreateEvent';
import Header from './Components/Home';
import UserManagement from './Components/UserManagement';
// import Home from './Components/Home';
import SignUpUser from './Components/SignUpUser';
import LogIn from './Components/LogIn';
import ForgotPassword from './Components/ForgotPassword';
import HomeAdmin from './Components/HomeAdmin';
import HomeUser from './Components/HomeUser';
import EventFeed from './Components/EventFeed';


function App() {
  // const [userEmail, setUserEmail] = useState("");
  // const [isSignedIn, setIsSignedIn] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);



  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail,]);

  return (
    <Router>
      <div className="App">
        <Routes>

        <Route
            path="/"
            element={<LogIn />}
          />
        <Route
            path="/Header"
            element={<Header setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />}
          />
          <Route path="/ModeraterHome" element={<ModeraterHome />} /> 
          <Route
            path="/createEvent"
            element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />}
          />

          {/* <Route path="/ModeraterHome" element={<ModeraterHome />} />   */}
        <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/UserManagement" element={<UserManagement />} />


          <Route
            path="/ModeratorHome"
            element={<ModeraterHome setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

          <Route
            path="/ModeratorDashboard"
            element={<ModeratorDashboard setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

          <Route
            path="/UserManagement"
            element={<UserManagement setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

          <Route
            path="/HomeUser"
            element={<HomeUser setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

          <Route
            path="/EventFeed"
            element={<EventFeed setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />


          <Route
            path="/SignupUser"
            element={<SignUpUser setUserEmail={setUserEmail} />}
          />

          

          <Route
            path="/reset"
            element={<ForgotPassword />}
          />

          <Route
            path="/homeadmin"
            element={isSignedIn ? <HomeAdmin userEmail={userEmail} isSignedIn={isSignedIn} setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} /> : <Navigate to="/signin" />}

          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
