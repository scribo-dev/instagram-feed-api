"use client";

//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export default function ConnectButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <PlusCircleIcon className="h-4 w-4 mr-2" />
      {pending ? "Loading..." : "Connect"}
    </Button>
  );
}
