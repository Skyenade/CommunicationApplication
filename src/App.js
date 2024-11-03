
import './App.css';
import Home from './Components/Home';
import CreateEvent from './Components/CreateEvent';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

function App() {

  const [userEmail, setUserEmail] = useState("");
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
            element={<CreateEvent setUserEmail={setUserEmail} setIsSignedIn={setIsSignedIn} />}
          />

        </Routes>
      </Router>



    </div>
  );
}

export default App;
