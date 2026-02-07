"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, active, normal }: { href: string, children: React.ReactNode, active: string, normal: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link href={href} className={isActive ? active : normal}>
      {children}
    </Link>
  );
}