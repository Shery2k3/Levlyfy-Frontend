"use client";

import { usePathname } from "next/navigation";
import FloatingNav from "@/components/floating-nav";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavigation = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
  ];

  const shouldShowNavigation = !hideNavigation.includes(pathname);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {shouldShowNavigation && <FloatingNav />}
      <main className="pb-24">{children}</main>
    </div>
  );
}
