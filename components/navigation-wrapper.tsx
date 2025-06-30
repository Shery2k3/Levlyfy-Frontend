"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/navigation";

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
    <div className="relative min-h-screen bg-[url('/images/hexagon-bg.png')] bg-cover bg-black">
      {shouldShowNavigation && <Navigation />}
      <main className="pb-12">{children}</main>
    </div>
  );
}
