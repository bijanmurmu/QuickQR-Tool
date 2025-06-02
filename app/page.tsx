import QRCodeGenerator from "@/components/qr-code-generator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github } from "lucide-react" // Add this import

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <rect width="5" height="5" x="3" y="3" rx="1" />
                <rect width="5" height="5" x="16" y="3" rx="1" />
                <rect width="5" height="5" x="3" y="16" rx="1" />
                <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                <path d="M21 21v-3a2 2 0 0 0-2-2h-3" />
                <path d="M16 8h5" />
                <path d="M9 8h2" />
                <path d="M8 16v5" />
                <path d="M8 9v2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">QuickQR</h1>
              <p className="text-xs text-muted-foreground">Instant QR Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/your-username/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Generate QR Codes Instantly
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create beautiful QR codes for Wi-Fi, URLs, contacts, and more. Fast, simple, and works on all devices.
          </p>
        </div>

        <QRCodeGenerator />
      </main>
    </div>
  )
}
