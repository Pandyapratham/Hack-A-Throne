"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { AuthWrapper } from "@/components/auth-wrapper"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ReportsPage() {
  const { data } = useSWR("/api/analytics", fetcher)
  const [jsPDF, setJsPDF] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const mod = await import("jspdf")
        setJsPDF(() => mod.jsPDF)
      } catch {
        setJsPDF(null)
      }
    })()
  }, [])

  const download = async () => {
    const summary = `MARK-IT Report
Overall Rating: ${data?.overallAverage}/5
Events:
${data?.byEvent?.map((e: any) => ` - ${e.event}: ${e.avg}/5`).join("\n")}

Sentiments:
${
  data
    ? Object.entries(data.sentiments)
        .map(([k, v]) => ` - ${k}: ${v}`)
        .join("\n")
    : ""
}

Keywords: ${data ? Object.keys(data.words).join(", ") : ""}`

    if (jsPDF) {
      const doc = new jsPDF()
      const lines = doc.splitTextToSize(summary, 180)
      doc.text(lines, 10, 10)
      doc.save("mark-it-report.pdf")
    } else {
      const blob = new Blob([summary], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "mark-it-report.txt"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <AuthWrapper allowedRoles={["student", "admin"]} redirectTo="/">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <h1 className="heading text-2xl font-semibold">Reports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Download Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Generate a dummy PDF report with attendance and feedback analytics.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={download}>
              Download PDF
            </Button>
            {!jsPDF && (
              <p className="text-xs text-muted-foreground">
                PDF module not loaded? A .txt fallback will be downloaded.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </AuthWrapper>
  )
}
