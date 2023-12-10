/**
 * v0 by Vercel.
 * @see https://v0.dev/t/QHFDBzRnKuQ
 */
import { LogoutForm } from "./LogoutForm";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center md:space-x-6">
      <div className="mx-auto w-80 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Out</h1>
          <p className="text-zinc-500 dark:text-zinc-400"></p>
        </div>
        <LogoutForm />
      </div>
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          alt="Sign up"
          className="object-cover w-full h-full"
          height="700"
          width="700"
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=700&q=90"
          style={{
            aspectRatio: "500/500",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
