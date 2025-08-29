import { NextRequest, NextResponse } from "next/server"

const protectedStudent = ["/student", "/student/scan", "/student/feedback", "/student/success"]
const protectedAdmin = ["/admin", "/admin/events", "/admin/attendance", "/admin/analytics"]

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value
  const url = req.nextUrl
  if (!session) {
    // If not logged in, redirect to login for protected routes
    if (protectedStudent.some((p) => url.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/student/login", req.url))
    }
    if (protectedAdmin.some((p) => url.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    return NextResponse.next()
  }
  try {
    const { role } = JSON.parse(session)
    if (role === "student" && protectedAdmin.some((p) => url.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/student", req.url))
    }
    if (role === "admin" && protectedStudent.some((p) => url.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  } catch {}
  return NextResponse.next()
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"]
}
