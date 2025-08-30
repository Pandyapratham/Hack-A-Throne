import { NextRequest, NextResponse } from "next/server"

const protectedStudent = ["/student", "/student/scan", "/student/feedback", "/student/success"]
const protectedAdmin = ["/admin", "/admin/events", "/admin/attendance", "/admin/analytics"]

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value
  const url = req.nextUrl

  // Allow login and signup pages for both roles
  const allowed = [
    "/student/login", "/student/signup",
    "/admin/login", "/admin/signup"
  ]

  if (allowed.includes(url.pathname)) {
    // If already logged in, redirect to dashboard
    if (session) {
      try {
        const { role } = JSON.parse(session)
        if (role === "student" && url.pathname.startsWith("/student")) {
          return NextResponse.redirect(new URL("/student", req.url))
        }
        if (role === "admin" && url.pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      } catch (error) {
        console.error('Error parsing session cookie in middleware:', error)
      }
    }
    return NextResponse.next()
  }

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

    // Validate role
    if (!role || (role !== "student" && role !== "admin")) {
      console.error('Invalid role in session cookie:', role)
      // Clear invalid session cookie
      const response = NextResponse.redirect(new URL("/student/login", req.url))
      response.cookies.delete("session")
      return response
    }

    // Check role-based access
    if (role === "student" && protectedAdmin.some((p) => url.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/student", req.url))
    }
    if (role === "admin" && protectedStudent.some((p) => url.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  } catch (error) {
    console.error('Error parsing session cookie in middleware:', error)
    // Clear corrupted session cookie
    const response = NextResponse.redirect(new URL("/student/login", req.url))
    response.cookies.delete("session")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"]
}
