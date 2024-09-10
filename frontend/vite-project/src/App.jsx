import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null); // Renamed to lowercase

  const rendering_log = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token correctly
      const response = await axios.get("http://localhost:3000/protected", {
        headers: {
          token: token,
        },
      });

      const u_ = response.data.username;
      const p_ = response.data.password;

      if (!u_ || !p_) {
        setData("Not authorized");
      } else {
        setData(`Username: ${u_}, Password: ${p_}, you are authorized for the data`);
      }
    } catch (error) {
      console.log("Error or unauthorized", error);
      setData("Error or unauthorized");
    }
  };

  useEffect(() => {
    rendering_log();
  }, []);

   async function signup(e) {
    e.preventDefault(); // Prevent default to avoid refresh
    const s_username = e.target.username_signup.value;
    const s_password = e.target.password_signup.value;

    try {
      await axios.post("http://localhost:3000/signup", {
        username: s_username,
        password: s_password,
      });
      console.log("Signup request sent");
      alert("Signup successful");
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  async function signin(e) {
    e.preventDefault(); // Prevent form refresh
    const s_username = e.target.username_signin.value;
    const s_password = e.target.password_signin.value;

    try {
      const response = await axios.post("http://localhost:3000/signin", {
        username: s_username,
        password: s_password,
      });

      localStorage.setItem("token", response.data.token);

      if (!response.data.token) {
        alert("Invalid user");
        setData(`You're still in login page`)
      } else {
        alert("Signed in successfully");
        rendering_log(); // Fetch protected data after successful sign-in
      }
    } catch (error) {
      console.error("Signin error:", error);
      alert("Signin failed");
    }
  }

  return (
    <div>
      <form onSubmit={signup}>
        <p>Username: </p>
        <input id="username_signup" name="username_signup" placeholder="Enter username" />
        <p>Password: </p>
        <input id="password_signup" name="password_signup" placeholder="Password" type="password" />
        <button type="submit">Signup</button>
      </form>

      <form onSubmit={signin}>
        <div>
          <p>Username: </p>
          <input id="username_signin" name="username_signin" placeholder="Enter username" />
        </div>
        <div>
          <p>Password: </p>
          <input id="password_signin" name="password_signin" placeholder="Password" type="password" />
        </div>
        <button type="submit">Signin</button>
      </form>

      <p id="get_infotag">{data}</p>
    </div>
  );
}

export default App;