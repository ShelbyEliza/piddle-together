// styles:
import "./App.css";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components:
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Create from "./pages/create/Create";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Project from "./pages/project/Project";
import Sidebar from "./components/Sidebar";
import OnlineUsers from "./components/OnlineUsers";

function App() {
  const { user, isUserVerified, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {/* wrap in authIsReady so the app doesn't load only links until we determine login status */}
      {authIsReady && (
        <BrowserRouter>
          {isUserVerified && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  isUserVerified ? <Dashboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/create"
                element={isUserVerified ? <Create /> : <Navigate to="/login" />}
              />
              <Route
                path="/projects/:id"
                element={
                  isUserVerified ? <Project /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/login"
                element={isUserVerified ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/signup"
                element={isUserVerified ? <Navigate to="/login" /> : <Signup />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
