import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModeraterHome from './Components/ModeratorHome';
import ModeratorDashboard from './Components/ModeratorDashboard'; 
import AdminHome from './Components/Admin';
import AdminDashboard from './Components/AdminDashboard';
import CreateEvent from './Components/CreateEvent';
import CreateUser from './Components/CreateUser';
import UserManagement from './Components/UserManagement';
import HomeUser from './Components/HomeUser'; 
import EventFeed from './Components/EventFeed'; 
import Header from './Components/Header';

import SignUpUser from './Components/SignUpUser';
import LogIn from './Components/LogIn';
import ForgotPassword from './Components/ForgotPassword';
import HomeAdmin from './Components/HomeAdmin';
// <<<<<<< HEAD
// import HomeUser from './Components/HomeUser';
// import EventFeed from './Components/EventFeed';

// =======
// >>>>>>> origin/Branch-Maina

function App() {
  // const [userEmail, setUserEmail] = useState("");
  // const [isSignedIn, setIsSignedIn] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail]);

  return (
    <Router>
      <div className="App">
        <Header />
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
          {/* <Route path="/" element={<ModeraterHome />} />
          <Route path="/createEvent" element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />} />
          <Route path="/ModeratorHome" element={<ModeraterHome />} />
          <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/HomeUser" element={<HomeUser />} />
          <Route path="/EventFeed" element={<EventFeed />} />
          <Route path="/SignupUser" element={<SignUpUser setUserEmail={setUserEmail} />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/reset" element={<ForgotPassword />} />
          <Route path="/homeadmin" element={isSignedIn ? <HomeAdmin userEmail={userEmail} isSignedIn={isSignedIn} setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} /> : <Navigate to="/LogIn" />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;