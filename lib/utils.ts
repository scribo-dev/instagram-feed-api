import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type InstagramImage = {
  slug: string;
  image: string;
  description: string;
  takenAt: string;
  pinned: boolean;
};
