"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import InteractiveHoverButton from "./ui/interactive-hover-button";
import { FirebaseError } from "firebase/app";

export function GoogleLogin() {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      provider.setCustomParameters({ display: "popup" });
      const res = await signInWithPopup(auth, provider);
      console.log("user info:", res.user);
      if (res.user) {
        console.log("Login successful");
        router.push("/dashboard");
      }
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/popup-closed-by-user"
      ) {
        console.log(
          "The popup was closed by the user before completing the sign-in."
        );
      } else {
        console.log("error:", error);
      }
    }
  };
  return (
    <div>
      <InteractiveHoverButton onClick={handleLogin} />
    </div>
  );
}
