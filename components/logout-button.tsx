"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  className?: string;
  iconSize?: number;
};

export function LogoutButton({ className, iconSize = 17 }: LogoutButtonProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className={className}>
      <LogOut size={iconSize} aria-hidden="true" />
      로그아웃
    </button>
  );
}
