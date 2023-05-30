import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

function Home(userDetails) {
  const user = userDetails.user;
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };

  return (
    <div className={styles.right}>
      <img src={user.picture} alt="profile" className={styles.profile_img} />
      <input type="text" defaultValue={user.name} className={styles.input} />
      <input type="text" defaultValue={user.email} className={styles.input} />
      <button className={styles.btn} onClick={logout}>
        Log Out
      </button>
    </div>
  );
}

function Login() {
  const googleAuth = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );
  };
  return (
    <button className={styles.google_btn} onClick={googleAuth}>
      <img src="./images/google.png" alt="google icon" />
      <span>Sign in with Google</span>
    </button>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container">
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
    </div>
  );
}

export default App;
