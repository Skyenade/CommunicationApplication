import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModeraterHome from './Components/ModeraterHome';
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
import SignupUser from './Components/SignUpUser';
import LogIn from './Components/LogIn';
import ForgotPassword from './Components/ForgotPassword';
import HomeAdmin from './Components/HomeAdmin';
// import ModeraterHome from './Components/Moderator';
import UserProfile from './Components/UserProfile';
import ContentManagement from './Components/ContentManagement';
// import ContentManagement from './Components/ContentManagement';



function App() {
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail, isSignedIn]);


  return (
    <Router>
      <div className="App">
        {/* <Header /> */}
        <Routes>
        <Route path="/SignUpUser" element={<SignUpUser setUserEmail={setUserEmail} />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/LogIn" element={<ForgotPassword />} />
          <Route path="/ModeraterHome" element={<ModeraterHome />} />
          <Route path="/createEvent" element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />} />
          <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
          {/* <Route path="/AdminHome" element={<AdminHome />} /> */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/HomeUser" element={<HomeUser />} />
          <Route path="/EventFeed" element={<EventFeed />} />
          {/* <Route path="/SignupUser" element={<SignUpUser setUserEmail={setUserEmail} />} />
          <Route path="/LogIn" element={<LogIn />} /> */}
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/homeadmin" element={isSignedIn ? <HomeAdmin userEmail={userEmail} isSignedIn={isSignedIn} setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} /> : <Navigate to="/LogIn" />} />
          <Route path='/userProfile' element={<UserProfile/>}/>
          <Route path='/ContentManagement' element={<ContentManagement/>}/>

        

        </Routes>
      </div>
    </Router>
  );
}

export default App;