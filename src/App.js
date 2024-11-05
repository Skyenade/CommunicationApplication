import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<ModeraterHome />} />
          <Route path="/createEvent" element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />} />
          <Route path="/ModeratorHome" element={<ModeraterHome />} />
          <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/HomeUser" element={<HomeUser />} />
          <Route path="/EventFeed" element={<EventFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;