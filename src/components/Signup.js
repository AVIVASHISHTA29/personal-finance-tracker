import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUpSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          displayName,
          email,
          photoURL,
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
    <div className="signup-signin-container">
      <h1>Sign Up / Sign In</h1>
      <form onSubmit={signUpWithEmail}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up with Email and Password</button>
      </form>
      <p>or</p>
      <button onClick={signInWithEmail}>Sign In with Email and Password</button>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
};

export default SignUpSignIn;
