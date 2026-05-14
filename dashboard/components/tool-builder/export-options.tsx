"use client"

import { Download, Copy, Save, Check } from "lucide-react"
import type { GeneratedTool } from "@/lib/tool-builder/types"
import { useState } from "react"

interface ExportOptionsProps {
  tool: GeneratedTool
}

export function ExportOptions({ tool }: ExportOptionsProps) {
  const [saved, setSaved] = useState(false)

  const handleDownload = () => {
    // Create a zip-like structure as separate downloads
    const files = [
      {
        name: `${tool.capability.tool_id}.rs`,
        content: tool.rust_code,
      },
      {
        name: `${tool.capability.tool_id}_schema.json`,
        content: JSON.stringify(
          {
            input: tool.capability.input_schema,
            output: tool.capability.output_schema,
          },
          null,
          2
        ),
      },
      {
        name: `${tool.capability.tool_id}_policy.json`,
        content: JSON.stringify(tool.policy, null, 2),
      },
    ]

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const handleCopyAll = async () => {
    const fullExport = {
      tool_id: tool.capability.tool_id,
      name: tool.name,
      description: tool.description,
      rust_code: tool.rust_code,
      capability: tool.capability,
      policy: tool.policy,
    }
    await navigator.clipboard.writeText(JSON.stringify(fullExport, null, 2))
  }

  const handleSaveToRegistry = () => {
    // Save to localStorage for the registry
    const stored = localStorage.getItem("codex-tools")
    const tools: GeneratedTool[] = stored ? JSON.parse(stored) : []
    const existing = tools.findIndex((t) => t.id === tool.id)
    if (existing >= 0) {
      tools[existing] = tool
    } else {
      tools.push(tool)
    }
    localStorage.setItem("codex-tools", JSON.stringify(tools))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSaveToRegistry}
        className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" />
            Saved
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save to Registry
          </>
        )}
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <Download className="h-4 w-4" />
        Download Files
      </button>
      <button
        onClick={handleCopyAll}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <Copy className="h-4 w-4" />
        Copy JSON
      </button>
    </div>
  )
}
