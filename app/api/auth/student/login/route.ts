
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    // Accept any credentials for demo purposes
    const { email } = await req.json()
    
    // Set the session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify({ role: "student", id: email }), { 
      httpOnly: false, 
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return NextResponse.json({ success: true, role: "student" })
  } catch (error) {
    console.error("Student login error:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
