"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { InstagramImage } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InstagramDialog({
  selectedImage,
}: {
  selectedImage?: InstagramImage;
}) {
  const router = useRouter();

  if (!selectedImage) return null;
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="sm:max-w-[725px] p-0 overflow-hidden">
        {/* <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader> */}
        <div className="grid grid-cols-2 gap-4 ">
          {selectedImage.video ? (
            <video src={selectedImage.video} controls={true} autoPlay={true} />
          ) : (
            <Image
              src={selectedImage.image}
              alt={selectedImage.description}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          )}
          <div className="py-12 max-h-[calc(100vh-200px)] overflow-auto pr-4">
            {selectedImage.description}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return <div className="fixed top-0">oi2asdfa sdfasdfasd fa</div>;
}
