"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import QRCode from "react-qr-code"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Copy, Wifi, LinkIcon, FileText, Mail, User, Clock, Trash2, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type QRType = "wifi" | "url" | "text" | "contact" | "email"

interface QRData {
  type: QRType
  content: string
  timestamp: number
}

interface WifiFormData {
  ssid: string
  password: string
  encryption: string
}

interface ContactFormData {
  name: string
  phone: string
  email: string
}

interface EmailFormData {
  email: string
  subject: string
  body: string
}

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState<QRType>("url")
  const [qrValue, setQrValue] = useState("")
  const [recentQRs, setRecentQRs] = useState<QRData[]>([])
  const [copied, setCopied] = useState(false)
  const [wifiData, setWifiData] = useState<WifiFormData>({
    ssid: "",
    password: "",
    encryption: "WPA",
  })
  const [contactData, setContactData] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
  })
  const [emailData, setEmailData] = useState<EmailFormData>({
    email: "",
    subject: "",
    body: "",
  })
  const qrRef = useRef<HTMLDivElement>(null)

  // Load recent QRs from local storage
  useEffect(() => {
    const savedQRs = localStorage.getItem("recentQRs")
    if (savedQRs) {
      setRecentQRs(JSON.parse(savedQRs))
    }
  }, [])

  // Save recent QRs to local storage
  useEffect(() => {
    localStorage.setItem("recentQRs", JSON.stringify(recentQRs))
  }, [recentQRs])

  // Generate QR value based on type and form data
  useEffect(() => {
    switch (qrType) {
      case "wifi":
        const { ssid, password, encryption } = wifiData
        if (ssid) {
          setQrValue(`WIFI:S:${ssid};T:${encryption};P:${password};H:false;;`)
        } else {
          setQrValue("")
        }
        break
      case "contact":
        const { name, phone, email } = contactData
        if (name || phone || email) {
          let vCard = "BEGIN:VCARD\nVERSION:3.0\n"
          if (name) vCard += `FN:${name}\n`
          if (phone) vCard += `TEL:${phone}\n`
          if (email) vCard += `EMAIL:${email}\n`
          vCard += "END:VCARD"
          setQrValue(vCard)
        } else {
          setQrValue("")
        }
        break
      case "email":
        const { email: emailAddress, subject, body } = emailData
        if (emailAddress) {
          setQrValue(`mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
        } else {
          setQrValue("")
        }
        break
      default:
        // URL and Text types use the direct input value
        break
    }
  }, [qrType, wifiData, contactData, emailData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (qrType === "url" || qrType === "text") {
      setQrValue(e.target.value)
    }
  }

  const handleWifiChange = (field: keyof WifiFormData, value: string) => {
    setWifiData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactChange = (field: keyof ContactFormData, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEmailChange = (field: keyof EmailFormData, value: string) => {
    setEmailData((prev) => ({ ...prev, [field]: value }))
  }

  const saveQR = () => {
    if (!qrValue) return

    const newQR: QRData = {
      type: qrType,
      content: qrValue,
      timestamp: Date.now(),
    }

    setRecentQRs((prev) => {
      // Limit to 5 recent QRs
      const updated = [newQR, ...prev.filter((qr) => qr.content !== qrValue)].slice(0, 5)
      return updated
    })

    toast({
      title: "QR Code Saved",
      description: "Your QR code has been saved to recent list",
    })
  }

  const loadQR = (qrData: QRData) => {
    setQrType(qrData.type)

    if (qrData.type === "wifi") {
      // Parse WIFI string
      const ssid = qrData.content.match(/S:(.*?);/)?.[1] || ""
      const encryption = qrData.content.match(/T:(.*?);/)?.[1] || "WPA"
      const password = qrData.content.match(/P:(.*?);/)?.[1] || ""
      setWifiData({ ssid, encryption, password })
    } else if (qrData.type === "contact") {
      // Parse vCard
      const name = qrData.content.match(/FN:(.*?)\n/)?.[1] || ""
      const phone = qrData.content.match(/TEL:(.*?)\n/)?.[1] || ""
      const email = qrData.content.match(/EMAIL:(.*?)\n/)?.[1] || ""
      setContactData({ name, phone, email })
    } else if (qrData.type === "email") {
      // Parse mailto link
      const email = qrData.content.match(/mailto:(.*?)\?/)?.[1] || ""
      const subject = decodeURIComponent(qrData.content.match(/subject=(.*?)&/)?.[1] || "")
      const body = decodeURIComponent(qrData.content.match(/body=(.*?)$/)?.[1] || "")
      setEmailData({ email, subject, body })
    } else {
      // URL or Text
      setQrValue(qrData.content)
    }
  }

  const removeQR = (index: number) => {
    setRecentQRs((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "QR Code Removed",
      description: "The QR code has been removed from your recent list",
    })
  }

  const downloadQR = () => {
    if (!qrRef.current || !qrValue) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width + 40 // Add padding
      canvas.height = img.height + 40 // Add padding
      if (ctx) {
        // Fill with white background
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        // Draw the QR code in the center
        ctx.drawImage(img, 20, 20)

        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `quickqr-${qrType}-${Date.now()}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const copyQRValue = () => {
    if (!qrValue) return
    navigator.clipboard.writeText(qrValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "QR code content copied to clipboard",
    })
  }

  const getTypeIcon = (type: QRType) => {
    switch (type) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "url":
        return <LinkIcon className="h-4 w-4" />
      case "text":
        return <FileText className="h-4 w-4" />
      case "contact":
        return <User className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getQRTypeLabel = (type: QRType) => {
    switch (type) {
      case "wifi":
        return "Wi-Fi"
      case "url":
        return "URL"
      case "text":
        return "Text"
      case "contact":
        return "Contact"
      case "email":
        return "Email"
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* QR Code Display - Takes 2/5 of the space on large screens */}
      <Card className="lg:col-span-2 h-fit shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-8 flex flex-col items-center">
          <div
            ref={qrRef}
            className="bg-white dark:bg-white p-8 rounded-xl mb-6 w-full max-w-[300px] aspect-square flex items-center justify-center shadow-xl border-4 border-white/50 transition-all duration-300 hover:shadow-2xl"
          >
            {qrValue ? (
              <QRCode value={qrValue} size={240} level="H" className="mx-auto transition-all duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Enter details to generate QR code</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 w-full max-w-[300px]">
            <Button
              onClick={downloadQR}
              className="flex-1 shadow-md hover:shadow-lg transition-all duration-200"
              disabled={!qrValue}
              variant="default"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={copyQRValue}
              variant="outline"
              disabled={!qrValue}
              className="flex-1 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button
            onClick={saveQR}
            variant="ghost"
            disabled={!qrValue}
            className="mt-3 w-full max-w-[300px] hover:bg-primary/10 transition-all duration-200"
          >
            Save to Recent
          </Button>
        </CardContent>
      </Card>

      {/* Form and Recent QRs - Takes 3/5 of the space on large screens */}
      <div className="space-y-6 lg:col-span-3">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8">
            <div className="mb-8">
              <Label htmlFor="qr-type" className="text-base mb-3 block font-medium">
                QR Code Type
              </Label>
              <Select value={qrType} onValueChange={(value) => setQrType(value as QRType)}>
                <SelectTrigger id="qr-type" className="w-full h-12 shadow-sm">
                  <SelectValue placeholder="Select QR type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">
                    <div className="flex items-center py-1">
                      <LinkIcon className="mr-3 h-4 w-4" />
                      URL
                    </div>
                  </SelectItem>
                  <SelectItem value="wifi">
                    <div className="flex items-center py-1">
                      <Wifi className="mr-3 h-4 w-4" />
                      Wi-Fi
                    </div>
                  </SelectItem>
                  <SelectItem value="text">
                    <div className="flex items-center py-1">
                      <FileText className="mr-3 h-4 w-4" />
                      Text
                    </div>
                  </SelectItem>
                  <SelectItem value="contact">
                    <div className="flex items-center py-1">
                      <User className="mr-3 h-4 w-4" />
                      Contact
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center py-1">
                      <Mail className="mr-3 h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {qrType === "url" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url-input" className="mb-2 block font-medium">
                    URL
                  </Label>
                  <Input
                    id="url-input"
                    placeholder="https://example.com"
                    value={qrValue}
                    onChange={handleInputChange}
                    className="h-12 shadow-sm"
                  />
                </div>
              </div>
            )}

            {qrType === "text" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-input" className="mb-2 block font-medium">
                    Text
                  </Label>
                  <Input
                    id="text-input"
                    placeholder="Enter your text here"
                    value={qrValue}
                    onChange={handleInputChange}
                    className="h-12 shadow-sm"
                  />
                </div>
              </div>
            )}

            {qrType === "wifi" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="ssid-input" className="mb-2 block font-medium">
                    Network Name (SSID)
                  </Label>
                  <Input
                    id="ssid-input"
                    placeholder="Your Wi-Fi name"
                    value={wifiData.ssid}
                    onChange={(e) => handleWifiChange("ssid", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="password-input" className="mb-2 block font-medium">
                    Password
                  </Label>
                  <Input
                    id="password-input"
                    type="password"
                    placeholder="Wi-Fi password"
                    value={wifiData.password}
                    onChange={(e) => handleWifiChange("password", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="encryption-select" className="mb-2 block font-medium">
                    Encryption
                  </Label>
                  <Select value={wifiData.encryption} onValueChange={(value) => handleWifiChange("encryption", value)}>
                    <SelectTrigger id="encryption-select" className="h-12 shadow-sm">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">No Password</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {qrType === "contact" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="name-input" className="mb-2 block font-medium">
                    Name
                  </Label>
                  <Input
                    id="name-input"
                    placeholder="Full Name"
                    value={contactData.name}
                    onChange={(e) => handleContactChange("name", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone-input" className="mb-2 block font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone-input"
                    placeholder="Phone Number"
                    value={contactData.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="email-input" className="mb-2 block font-medium">
                    Email
                  </Label>
                  <Input
                    id="email-input"
                    placeholder="Email Address"
                    value={contactData.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
              </div>
            )}

            {qrType === "email" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="email-address-input" className="mb-2 block font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email-address-input"
                    placeholder="recipient@example.com"
                    value={emailData.email}
                    onChange={(e) => handleEmailChange("email", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-input" className="mb-2 block font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject-input"
                    placeholder="Email Subject"
                    value={emailData.subject}
                    onChange={(e) => handleEmailChange("subject", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="body-input" className="mb-2 block font-medium">
                    Body
                  </Label>
                  <Input
                    id="body-input"
                    placeholder="Email Body"
                    value={emailData.body}
                    onChange={(e) => handleEmailChange("body", e.target.value)}
                    className="h-12 shadow-sm"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {recentQRs.length > 0 && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent QR Codes
              </h3>
              <div className="space-y-3">
                {recentQRs.map((qr, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-lg mr-3">{getTypeIcon(qr.type)}</div>
                      <div>
                        <div className="font-medium">{getQRTypeLabel(qr.type)}</div>
                        <div className="text-xs text-muted-foreground">{formatTimestamp(qr.timestamp)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => loadQR(qr)} className="hover:bg-primary/10">
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQR(index)}
                        className="hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  )
}
