import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "./Header";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const createUserDocument = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
      } catch (error) {
        console.error("Error creating user document: ", error);
      }
    }
  };

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      await createUserDocument(user);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error signing up with email and password: ",
        error.message
      );
    }
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error signing in with email and password: ",
        error.message
      );
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrapper">
        {flag ? (
          <div className="signup-signin-container">
            <h2 style={{ textAlign: "center" }}>
              Log In on <span className="blue-text">Financely.</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="input-wrapper">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-wrapper">
                <p>Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn" onClick={signInWithEmail}>
                Log In with Email and Password
              </button>
            </form>
            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <button className="btn btn-blue" onClick={signInWithGoogle}>
              Log In with Google
            </button>
            <p
              onClick={() => setFlag(!flag)}
              style={{
                textAlign: "center",
                marginBottom: 0,
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
            >
              Or Don't Have An Account? Click Here.
            </p>
          </div>
        ) : (
          <div className="signup-signin-container">
            <h2 style={{ textAlign: "center" }}>
              Sign Up on <span className="blue-text">Financely.</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="input-wrapper">
                <p>Full Name</p>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-wrapper">
                <p>Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="input-wrapper">
                <p>Confirm Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn">
                Sign Up with Email and Password
              </button>
            </form>
            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <button className="btn btn-blue" onClick={signInWithGoogle}>
              Sign Up with Google
            </button>
            <p
              onClick={() => setFlag(!flag)}
              style={{
                textAlign: "center",
                marginBottom: 0,
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
            >
              Or Have An Account Already? Click Here
            </p>
            {/* <button onClick={signInWithEmail}>
            Sign In with Email and Password
          </button> */}
          </div>
        )}
      </div>
    </>
  );
};

export default SignUpSignIn;
