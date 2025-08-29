import { cookies } from "next/headers"

export async function setSession(role: "student" | "admin", id: string) {
  const c = await cookies();
  c.set("session", JSON.stringify({ role, id }), { 
    httpOnly: false, 
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
}

export async function getSession() {
  const c = await cookies();
  const value = c.get("session")?.value;
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function clearSession() {
  const c = await cookies();
  c.delete("session");
}
