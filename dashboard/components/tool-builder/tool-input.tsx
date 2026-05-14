"use client"

import { Sparkles, Loader2 } from "lucide-react"

const EXAMPLE_PROMPTS = [
  "A tool that reads a file from disk and returns its contents",
  "A tool that makes an HTTP GET request to a URL and returns the response",
  "A tool that calculates the hash of a string using SHA-256",
  "A tool that lists files in a directory with their sizes",
]

interface ToolInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isGenerating: boolean
}

export function ToolInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
}: ToolInputProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Tool Description
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Describe what your tool should do in plain English
        </p>
      </div>

      <textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A tool that..."
        rows={6}
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <button
        onClick={onGenerate}
        disabled={!value.trim() || isGenerating}
        className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Tool
          </>
        )}
      </button>

      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Example prompts
        </p>
        <div className="flex flex-col gap-2">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onChange(prompt)}
              className="rounded-md border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
