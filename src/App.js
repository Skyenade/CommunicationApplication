
import './App.css';
import Home from './Components/Home';
import CreateEvent from './Components/CreateEvent';
import ModeratorHome from './Components/ModeratorHome';
import ModeratorDashboard from './Components/ModeratorDashboard';
import CreateUser from './Components/CreateUser';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

function App() {

  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!userEmail);
  }, [userEmail]);


  return (
    <div className="App">

      <Router>
        <Routes>

          <Route
            path="/"
            element={<Home setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />}
          />

          <Route
            path="/createEvent"
            element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

          <Route
            path="/ModeratorHome"
            element={<ModeratorHome setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

<Route
            path="/ModeratorDashboard"
            element={<ModeratorDashboard setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} setEventImage={setEventImage} />}
          />

          <Route
            path="/CreateUser"
            element={<CreateUser setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} setUserImage={setUserImage} />}
          />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
