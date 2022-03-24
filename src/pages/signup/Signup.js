// styles:
import "./Signup.css";

import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);

  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, thumbnail);
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    if (!selected) {
      setThumbnailError("Please select a file.");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image.");
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb.");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
    console.log("Thumbnail updated successfully.");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
      <label>
        <span>Display Name:</span>
        <input
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>Profile Thumbnail:</span>
        <input required type="file" onChange={handleFileChange} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Sign Up</button>}
      {isPending && (
        <button className="btn" disabled>
          Signing Out...
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
