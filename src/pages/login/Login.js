// styles:
import "./Login.css";

import { useAuthContext } from "../../hooks/useAuthContext";

import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, sendVerificationEmail, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  return (
    <>
      {user === null ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login In</h2>
          <label>
            <span>Email:</span>
            <input
              required
              autoComplete="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>Password:</span>
            <input
              required
              autoComplete="current-password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          {!isPending && <button className="btn">Log In</button>}
          {isPending && (
            <button className="btn" disabled>
              Logging In...
            </button>
          )}
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <>
          {user && !user.verifiedEmail && (
            <div className="unverified">
              <h1>Attention, {user.displayName}</h1>
              <p>Please, verify your email before enjoying site content.</p>
              <p>
                If you would like another verification email sent to you, click
                the button below.
              </p>
              <button className="resend-btn" onClick={sendVerificationEmail}>
                Resend Email
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
