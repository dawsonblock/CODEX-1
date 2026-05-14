"use client"

import { useEffect, useState } from "react"
import type { GeneratedTool } from "@/lib/tool-builder/types"
import {
  Trash2,
  Download,
  Eye,
  Clock,
  Shield,
  AlertCircle,
  Plus,
} from "lucide-react"
import Link from "next/link"

export function ToolRegistry() {
  const [tools, setTools] = useState<GeneratedTool[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("codex-tools")
    if (stored) {
      setTools(JSON.parse(stored))
    }
  }, [])

  const handleDelete = (id: string) => {
    const updated = tools.filter((t) => t.id !== id)
    setTools(updated)
    localStorage.setItem("codex-tools", JSON.stringify(updated))
  }

  const handleExport = (tool: GeneratedTool) => {
    const files = [
      { name: `${tool.capability.tool_id}.rs`, content: tool.rust_code },
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Tool Registry
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your generated tools
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Tool
        </Link>
      </div>

      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">No tools yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first tool with the builder
          </p>
          <Link
            href="/"
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Create Tool
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col rounded-lg border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{tool.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {tool.capability.tool_id}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    tool.status === "draft"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : tool.status === "exported"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {tool.status}
                </span>
              </div>

              <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
                {tool.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {tool.policy.sandbox_required && (
                  <span className="flex items-center gap-1 rounded bg-accent px-2 py-1 text-xs text-accent-foreground">
                    <Shield className="h-3 w-3" />
                    Sandboxed
                  </span>
                )}
                {tool.capability.side_effects.length > 0 && (
                  <span className="rounded bg-accent px-2 py-1 text-xs text-accent-foreground">
                    {tool.capability.side_effects.length} side effect
                    {tool.capability.side_effects.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(tool.created_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleExport(tool)}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
