import "server-only";
import { cookies } from "next/headers";
import { findProfileById, getAuthUser } from "@/lib/server/supabase-admin";

export type UserRole = "user" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("jaram_access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const authUser = await getAuthUser(accessToken);

  if (!authUser?.id || !authUser.email) {
    return null;
  }

  const profile = await findProfileById(authUser.id).catch(() => null);
  const role = profile?.role === "admin" ? "admin" : "user";
  const name = profile?.user_name?.trim() || authUser.user_metadata?.user_name || authUser.email;

  return {
    id: authUser.id,
    email: authUser.email,
    name,
    role,
  };
}

export function canWritePost(role: UserRole, page: string) {
  if (role === "admin") {
    return true;
  }

  return page === "qna";
}
