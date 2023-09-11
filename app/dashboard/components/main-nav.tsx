"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";

const menus = [
  { label: "Overview", href: "/dashboard" },
  { label: "Docs", href: "/dashboard/docs" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            menu.href !== pathname ? "text-muted-foreground" : ""
          }`}
        >
          {menu.label}
        </Link>
      ))}
    </nav>
  );
}
