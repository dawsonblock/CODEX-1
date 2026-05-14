"use client"

import type { ToolPolicy } from "@/lib/tool-builder/types"

interface PolicyConfigProps {
  policy: ToolPolicy
  onChange: (policy: ToolPolicy) => void
}

const AVAILABLE_ACTIONS = [
  "read",
  "write",
  "execute",
  "network",
  "filesystem",
  "environment",
]

export function PolicyConfig({ policy, onChange }: PolicyConfigProps) {
  const handleToggleAction = (action: string) => {
    const newActions = policy.allowed_actions.includes(action)
      ? policy.allowed_actions.filter((a) => a !== action)
      : [...policy.allowed_actions, action]
    onChange({ ...policy, allowed_actions: newActions })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tool ID */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Tool ID</label>
        <input
          type="text"
          value={policy.tool_id}
          onChange={(e) => onChange({ ...policy, tool_id: e.target.value })}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Allowed Actions */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Allowed Actions
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_ACTIONS.map((action) => {
            const isSelected = policy.allowed_actions.includes(action)
            return (
              <button
                key={action}
                onClick={() => handleToggleAction(action)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {action}
              </button>
            )
          })}
        </div>
      </div>

      {/* Max Consecutive */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Max Consecutive Calls
        </label>
        <input
          type="number"
          value={policy.max_consecutive}
          onChange={(e) =>
            onChange({ ...policy, max_consecutive: parseInt(e.target.value) || 1 })
          }
          min={1}
          max={100}
          className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Maximum number of times this tool can be called consecutively
        </p>
      </div>

      {/* Boolean Toggles */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={policy.requires_confirmation}
            onChange={(e) =>
              onChange({ ...policy, requires_confirmation: e.target.checked })
            }
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
          />
          <span className="text-sm text-foreground">Requires Confirmation</span>
        </label>
        <p className="ml-7 text-xs text-muted-foreground">
          User must confirm before tool execution
        </p>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={policy.sandbox_required}
            onChange={(e) =>
              onChange({ ...policy, sandbox_required: e.target.checked })
            }
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
          />
          <span className="text-sm text-foreground">Sandbox Required</span>
        </label>
        <p className="ml-7 text-xs text-muted-foreground">
          Tool must run in isolated sandbox environment
        </p>
      </div>
    </div>
  )
}
