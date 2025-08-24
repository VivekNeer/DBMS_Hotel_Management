"use client";

import { useEffect } from "react";
import { auth } from "@/firebaseConfig";
import * as firebaseui from "firebaseui";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";

import "firebaseui/dist/firebaseui.css";

export default function FirebaseAuthUI() {
  useEffect(() => {
    // Create new UI instance or re-use
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    const uiConfig = {
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup", // or "redirect"
      callbacks: {
        signInSuccessWithAuthResult: () => {
          return false; // avoid redirect
        },
      },
    };

    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div id="firebaseui-auth-container" />
    </div>
  );
}
