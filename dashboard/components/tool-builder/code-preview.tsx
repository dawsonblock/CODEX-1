"use client"

import { useState } from "react"
import { Copy, Check, Pencil, Eye } from "lucide-react"

interface CodePreviewProps {
  code: string
  onChange: (code: string) => void
}

function highlightRust(code: string): string {
  // Simple Rust syntax highlighting
  const keywords =
    /\b(pub|fn|let|mut|struct|impl|use|mod|self|Self|return|if|else|match|for|while|loop|break|continue|where|async|await|trait|type|const|static|unsafe|extern|crate|super|dyn|move|ref|in|as)\b/g
  const types =
    /\b(Result|Option|String|Vec|HashMap|HashSet|Box|Rc|Arc|Cell|RefCell|bool|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|str|char)\b/g
  const strings = /(["'`])(?:(?!\1|\\).|\\.)*\1/g
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
  const functions = /\b([a-z_][a-z0-9_]*)\s*(?=\()/gi
  const numbers = /\b(\d+\.?\d*)\b/g

  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(comments, '<span class="code-comment">$1</span>')
    .replace(strings, '<span class="code-string">$&</span>')
    .replace(keywords, '<span class="code-keyword">$1</span>')
    .replace(types, '<span class="code-type">$1</span>')
    .replace(functions, '<span class="code-function">$1</span>')
    .replace(numbers, '<span class="code-number">$1</span>')
}

export function CodePreview({ code, onChange }: CodePreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editValue, setEditValue] = useState(code)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(code)
    setIsEditing(false)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          tool.rs
        </span>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
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
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditValue(code)
                  setIsEditing(true)
                }}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="code-block flex-1 resize-none rounded-md border border-input bg-background p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
      ) : (
        <pre className="code-block flex-1 overflow-auto rounded-md bg-background p-4">
          <code dangerouslySetInnerHTML={{ __html: highlightRust(code) }} />
        </pre>
      )}
    </div>
  )
}
