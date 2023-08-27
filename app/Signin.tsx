"use client";
import { signIn } from "next-auth/react";

export default () => (
  <button onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}>
    Log in <span aria-hidden="true">&rarr;</span>
  </button>
);
