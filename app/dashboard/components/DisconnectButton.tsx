"use client";

//@ts-ignore
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

export default function DisconnectButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}>
      <Ban className="h-4 w-4 mr-2" />
      {pending ? "Loading..." : "Disconnnect"}
    </Button>
  );
}
