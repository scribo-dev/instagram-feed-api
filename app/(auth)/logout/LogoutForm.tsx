"use client";

// @ts-ignore
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

export function LogoutForm() {
  return (
    <Button
      className="w-full"
      type="button"
      variant="secondary"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOutIcon className="mr-2" />
      Sign Out
    </Button>
  );
}
