import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ModeratorDashboard from './Components/ModeratorDashboard';
import AdminHome from './Components/AdminHome';
import AdminDashboard from './Components/AdminDashboard';
import CreateEvent from './Components/CreateEvent';
import UserManagement from './Components/UserManagement';
import SignUpUser from './Components/SignUpUser';
import ForgotPassword from './Components/ForgotPassword';
import ModeratorHome from './Components/ModeratorHome';
import UserProfile from './Components/UserProfile';
import ContentManagement from './Components/ContentManagement';
import EventDetails from './Components/EventDetails';
import HomeUser from './Components/HomeUser';
import CreateUser from './Components/CreateUser';
import RequestAssistance from './Components/RequestAssistance';
import AdminAssistanceRequests from './Components/AdminAssistanceRequests';
import Report from './Components/Report';
import AdminReports from './Components/AdminReports';
import EventFeed from './Components/EventFeed';
import MyEvents from './Components/MyEvents';
import Home from './Components/Home';

import FirebaseManagement from './Components/FirebaseManagement';

import MyFollowers from './Components/MyFollowers';


import { UserContextProvider } from './UserContext';

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail]);

  return (

    <UserContextProvider>
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
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/ContentManagement" element={<ContentManagement />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/RequestAssistance" element={<RequestAssistance />} />
            <Route path="/AdminAssistanceRequests" element={<AdminAssistanceRequests />} />
            <Route path="/EventFeed" element={<EventFeed />} />
            <Route path="/MyEvents" element={<MyEvents />} />
            <Route path="/Report" element={<Report />} />
            <Route path="/AdminReports" element={<AdminReports />} />

            <Route path="/FirebaseManagement" element={<FirebaseManagement />} />

            <Route path="/MyFollowers" element={<MyFollowers />} />

          </Routes>
        </div>
      </Router>
    </UserContextProvider>

  );
}

export default App;
