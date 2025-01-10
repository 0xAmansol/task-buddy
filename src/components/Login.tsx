"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithRedirect } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import InteractiveHoverButton from "./ui/interactive-hover-button";
import { FirebaseError } from "firebase/app";

export function GoogleLogin() {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const res = await signInWithRedirect(auth, provider);
      console.log("res", res);
      router.push("/dashboard");
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
