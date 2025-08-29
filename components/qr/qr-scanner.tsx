"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function QRScanner({ onResult }: { onResult: (value: string) => void }) {
  const [active, setActive] = useState(false)
  const [simValue, setSimValue] = useState("e1") // default to known event

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-6 text-center">
        <div className="heading font-semibold mb-2">QR Scanner (Simulated)</div>
        <p className="text-sm text-muted-foreground mb-4">
          Camera access is simulated for demo. Click "Simulate Scan" to read a QR value.
        </p>
        <div className="mx-auto max-w-sm">
          <label className="text-sm">QR Value</label>
          <input
            value={simValue}
            onChange={(e) => setSimValue(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="e.g. e1"
          />
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button onClick={() => setActive(true)} variant="outline">
            {active ? "Scanner Active" : "Start Scanner"}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onResult(simValue)}>
            Simulate Scan
          </Button>
        </div>
      </div>
    </div>
  )
}
