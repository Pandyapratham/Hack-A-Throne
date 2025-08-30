"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthStatus() {
    const { session, user, loading, signOut } = useAuth()

    if (loading) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Authentication Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                        <p>Checking authentication...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <strong>Status:</strong> {session ? 'Authenticated' : 'Not authenticated'}
                </div>

                {session && (
                    <>
                        <div>
                            <strong>User ID:</strong> {user?.id || 'Unknown'}
                        </div>
                        <div>
                            <strong>Email:</strong> {user?.email || 'Unknown'}
                        </div>
                        <div>
                            <strong>Role:</strong> {user?.user_metadata?.role || 'student'}
                        </div>
                        <div>
                            <strong>Session Expires:</strong> {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}
                        </div>
                    </>
                )}

                <div>
                    <strong>Session Cookie:</strong> {document.cookie.includes('session=') ? 'Present' : 'Missing'}
                </div>

                {session && (
                    <Button onClick={() => signOut()} variant="destructive" className="w-full">
                        Sign Out
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
