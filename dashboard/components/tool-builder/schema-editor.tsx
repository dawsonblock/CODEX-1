"use client"

import { useState } from "react"
import type { JsonSchema } from "@/lib/tool-builder/types"

interface SchemaEditorProps {
  inputSchema: JsonSchema
  outputSchema: JsonSchema
  onInputChange: (schema: Record<string, unknown>) => void
  onOutputChange: (schema: Record<string, unknown>) => void
}

function SchemaPanel({
  title,
  schema,
  onChange,
}: {
  title: string
  schema: JsonSchema
  onChange: (schema: Record<string, unknown>) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(JSON.stringify(schema, null, 2))
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editValue)
      onChange(parsed)
      setError(null)
      setIsEditing(false)
    } catch {
      setError("Invalid JSON")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditValue(JSON.stringify(schema, null, 2))
                setIsEditing(false)
                setError(null)
              }}
              className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="rounded border border-destructive/50 bg-destructive/10 px-2 py-1 text-xs text-destructive">
          {error}
        </div>
      )}

      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-40 resize-none rounded-md border border-input bg-background p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
      ) : (
        <pre className="overflow-auto rounded-md bg-background p-3 font-mono text-xs text-muted-foreground">
          {JSON.stringify(schema, null, 2)}
        </pre>
      )}
    </div>
  )
}

export function SchemaEditor({
  inputSchema,
  outputSchema,
  onInputChange,
  onOutputChange,
}: SchemaEditorProps) {
  return (
    <div className="flex flex-col gap-6">
      <SchemaPanel
        title="Input Schema"
        schema={inputSchema}
        onChange={onInputChange}
      />
      <SchemaPanel
        title="Output Schema"
        schema={outputSchema}
        onChange={onOutputChange}
      />
    </div>
  )
}
