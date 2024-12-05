import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type InstagramImage = {
  slug: string;
  type: "video" | "image" | "carousel_album";
  image: string;
  description: string;
  takenAt: string;
  pinned: boolean;
  video?: string;
};
