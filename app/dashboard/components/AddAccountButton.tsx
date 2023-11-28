"use client";

//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function DisconnectButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <PlusIcon className="h-4 w-4 mr-2" />
      {pending ? "Adding..." : "Add"}
    </Button>
  );
}
