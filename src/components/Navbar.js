// styles & images:
import "./Navbar.css";
import Temple from "../assets/temple.svg";
import { useLogout } from "../hooks/useLogout";

import { Link } from "react-router-dom";

export default function Navbar() {
  const { logout, isPending } = useLogout();

  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="dojo logo" />
          <span>Piddle Together</span>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          {!isPending && (
            <button className="btn" onClick={logout}>
              Logout
            </button>
          )}
          {isPending && (
            <button className="btn" disabled>
              Logging Out...
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
