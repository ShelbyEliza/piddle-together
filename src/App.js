// styles:
import "./App.css";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components:
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Create from "./pages/create/Create";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Project from "./pages/project/Project";
import Sidebar from "./components/Sidebar";

function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {/* wrap in authIsReady so the app doesn't load only links until we determine login status */}
      {authIsReady && (
        <BrowserRouter>
          <Sidebar />
          <div className="container">
            <Navbar />
            <Switch>
              <Route exact path="/">
                {!user && <Redirect to="/login" />}
                {user && <Dashboard />}
              </Route>
              <Route path="/create">
                {!user && <Redirect to="/login" />}
                {user && <Create />}
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/projects/:id">
                <Project />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
