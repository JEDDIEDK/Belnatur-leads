import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { profiles } from "@/lib/demo-data";

const SESSION_COOKIE = "bl-session";

export async function getCurrentSession() {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  return profiles.find((profile) => profile.id === userId) ?? null;
}

export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.role !== "admin") {
    redirect("/");
  }

  return session;
}

export async function signInAction(formData: FormData) {
  "use server";
  const store = await cookies();
  const email = String(formData.get("email") ?? "").toLowerCase();
  const user = profiles.find((profile) => profile.email === email) ?? profiles[0];
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
  redirect("/");
}
