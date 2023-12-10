"use client";

// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";

const initialState = {
  error: null,
};

async function formLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  return await signIn("credentials", {
    email,
    password,
    callbackUrl: "/dashboard",
  });
}

export function LoginForm() {
  const [state, formAction] = useFormState(formLogin, initialState);

  return (
    <>
      <form className="min-w-96 space-y-4" action={formAction}>
        {state?.error ? (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription className="text-xs">
              {state?.error}
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" required type="password" />
        </div>
        <SubmitButton />
        <Button
          className="w-full"
          type="button"
          variant="secondary"
          onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
        >
          <IconFacebook />
          Sign In with Facebook
        </Button>
      </form>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full mb-4" type="submit" disabled={pending}>
      {pending ? "Loading..." : "Sign In"}
    </Button>
  );
}

function IconFacebook() {
  return (
    <svg
      className="mr-2"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
