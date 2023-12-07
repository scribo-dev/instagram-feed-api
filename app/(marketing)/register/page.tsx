/**
 * v0 by Vercel.
 * @see https://v0.dev/t/QHFDBzRnKuQ
 */
import { RegisterForm } from "./RegisterForm";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6">
      <div className="mx-auto w-80 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Enter your information to create an account
          </p>
        </div>
        <RegisterForm />
      </div>
      <div className="md:w-1/2">
        <img
          alt="Sign up"
          className="object-cover w-full h-full"
          height="500"
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
          style={{
            aspectRatio: "500/500",
            objectFit: "cover",
          }}
          width="500"
        />
      </div>
    </div>
  );
}