"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, X, Check, AlertCircle, Sparkles } from "lucide-react"
import type { FactData } from "@/components/ui/fact-card"

interface SharePreviewProps {
  fact: FactData
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = "story" | "feed"
type ExportState = "idle" | "generating" | "success" | "error"

export function SharePreview({ fact, isOpen, onClose }: SharePreviewProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("story")
  const [exportState, setExportState] = useState<ExportState>("idle")
  const [exportMessage, setExportMessage] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const generateExportCard = useCallback(async (format: ExportFormat) => {
    if (!cardRef.current || !canvasRef.current) return

    setExportState("generating")
    setExportMessage("Skapar delningsbild...")

    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(cardRef.current, {
        width: format === "story" ? 1080 : 1080,
        height: format === "story" ? 1920 : 1080,
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      })

      canvasRef.current.width = canvas.width
      canvasRef.current.height = canvas.height
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.drawImage(canvas, 0, 0)
      }

      setExportState("success")
      setExportMessage("Bilden är redo att delas!")
    } catch (error) {
      console.error("Export failed:", error)
      setExportState("error")
      setExportMessage("Något gick fel. Försök igen.")
    }
  }, [])

  const handleSaveImage = useCallback(async () => {
    if (!canvasRef.current || exportState !== "success") return

    try {
      canvasRef.current.toBlob(
        (blob) => {
          if (!blob) return

          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `facta-${selectedFormat}-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)

          setExportMessage("Bild sparad!")
          setTimeout(() => setExportMessage(""), 2000)
        },
        "image/png",
        0.95,
      )
    } catch (error) {
      console.error("Save failed:", error)
      setExportMessage("Kunde inte spara bilden")
    }
  }, [selectedFormat, exportState])

  const handleShareImage = useCallback(async () => {
    if (!canvasRef.current || exportState !== "success") return

    try {
      canvasRef.current.toBlob(
        async (blob) => {
          if (!blob) return

          const file = new File([blob], `facta-${selectedFormat}.png`, { type: "image/png" })

          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Fantastisk fakta från Facta",
              text: fact.title,
              files: [file],
            })
          } else {
            // Fallback: copy image to clipboard
            const item = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([item])
            setExportMessage("Bild kopierad till urklipp!")
            setTimeout(() => setExportMessage(""), 2000)
          }
        },
        "image/png",
        0.95,
      )
    } catch (error) {
      console.error("Share failed:", error)
      setExportMessage("Kunde inte dela bilden")
    }
  }, [fact.title, selectedFormat, exportState])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="relative w-full max-w-2xl p-6" ref={cardRef}>
        <Button variant="outline" className="absolute top-4 right-4 bg-transparent" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <div className="mb-4">
          <Badge variant="outline" className="mr-2">
            {selectedFormat === "story" ? "Story" : "Feed"}
          </Badge>
          <Button onClick={() => setSelectedFormat("story")}>Story</Button>
          <Button onClick={() => setSelectedFormat("feed")}>Feed</Button>
        </div>
        <div className="mb-4">
          <Button onClick={() => generateExportCard(selectedFormat)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generera bild
          </Button>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="mt-4">
          {exportState === "success" && (
            <div className="flex items-center justify-center">
              <Button onClick={handleSaveImage}>
                <Download className="mr-2 h-4 w-4" />
                Spara bild
              </Button>
              <Button onClick={handleShareImage}>
                <Share2 className="mr-2 h-4 w-4" />
                Dela bild
              </Button>
            </div>
          )}
          {exportState === "error" && (
            <div className="flex items-center justify-center">
              <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">{exportMessage}</span>
            </div>
          )}
          {exportState === "generating" && (
            <div className="flex items-center justify-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span className="text-primary">{exportMessage}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
