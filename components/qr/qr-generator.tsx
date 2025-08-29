"use client"
import QRCode from "react-qr-code"

export function QRGenerator({ value }: { value: string }) {
  return (
    <div className="inline-flex p-4 bg-white rounded-xl border">
      <QRCode value={value} size={160} />
    </div>
  )
}
