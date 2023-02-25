import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from "../../hook/useLocalStorage";
import "../../App.css";

export default function SignInPage() {
  const [user, setUser] = useLocalStorage("user", null);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  const collectData = async (e) => {
    e.preventDefault();
    const post = { email: username, password: password };
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        post
      );
      // console.log(res,'______________')

      if (res.status == 200) {
        setUser(res.data);
        // localStorage.setItem("user", JSON.stringify(res.data))
      }
      //localStorage.setItem('items', JSON.stringify(res.data.publicKey));
    } catch (e) {
      alert("invalid email/password");
      // window.location = "/"
    }
  };

  return (
    <div className="text-center m-5-auto">
      <h2>Sign in to us</h2>
      <form onSubmit={collectData}>
        <p>
          <label>Username or email address</label>
          <br />
          <input
            type="text"
            name="first_name"
            required
            value={username}
            onChange={(e) => setName(e.target.value)}
          />
        </p>
        <p>
          <label>Password</label>
          <Link to="/forget-password">
            <label className="right-label">Forget password?</label>
          </Link>
          <br />
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>
        <p>
          <button id="sub_btn" type="submit">
            Login
          </button>
        </p>
      </form>
      <footer>
        <p>
          First time? <Link to="/register">Create an account</Link>.
        </p>
      </footer>
    </div>
  );
}
