"use client";
import { usePathname } from "next/navigation";

/**
 * Renders its children on every route EXCEPT the standalone "bare" routes
 * (the maintenance page and the admin login), which must show no site chrome
 * (navigation, footer, Ask widget). Children passed from the server layout are
 * rendered normally everywhere else.
 */
const BARE_ROUTES = ["/maintenance", "/admin-login"];

export default function HideOnRoutes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (bare) return null;
  return <>{children}</>;
}
