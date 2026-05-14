"use client"

import { useState } from "react"
import { ToolInput } from "./tool-input"
import { CodePreview } from "./code-preview"
import { SchemaEditor } from "./schema-editor"
import { PolicyConfig } from "./policy-config"
import { ExportOptions } from "./export-options"
import type { GeneratedTool, ToolGenerationResponse } from "@/lib/tool-builder/types"
import { Loader2 } from "lucide-react"

type TabType = "code" | "schema" | "policy"

export function ToolBuilder() {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTool, setGeneratedTool] = useState<GeneratedTool | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("code")
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!description.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate tool")
      }

      const data: ToolGenerationResponse = await response.json()

      const tool: GeneratedTool = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        rust_code: data.rust_code,
        capability: {
          tool_id: data.tool_id,
          description: data.description,
          input_schema: data.input_schema,
          output_schema: data.output_schema,
          side_effects: data.side_effects,
        },
        policy: data.policy,
        created_at: new Date().toISOString(),
        status: "draft",
      }

      setGeneratedTool(tool)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCodeChange = (code: string) => {
    if (generatedTool) {
      setGeneratedTool({ ...generatedTool, rust_code: code })
    }
  }

  const handleSchemaChange = (
    type: "input" | "output",
    schema: Record<string, unknown>
  ) => {
    if (generatedTool) {
      setGeneratedTool({
        ...generatedTool,
        capability: {
          ...generatedTool.capability,
          [type === "input" ? "input_schema" : "output_schema"]: schema,
        },
      })
    }
  }

  const handlePolicyChange = (policy: GeneratedTool["policy"]) => {
    if (generatedTool) {
      setGeneratedTool({ ...generatedTool, policy })
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tool Builder</h1>
        <p className="mt-1 text-muted-foreground">
          Describe your tool in natural language and generate Rust code, schemas,
          and policies automatically.
        </p>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <ToolInput
            value={description}
            onChange={setDescription}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="flex flex-col rounded-lg border border-border bg-card">
          {isGenerating ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Generating tool...</span>
            </div>
          ) : generatedTool ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-border">
                {(["code", "schema", "policy"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-4">
                {activeTab === "code" && (
                  <CodePreview
                    code={generatedTool.rust_code}
                    onChange={handleCodeChange}
                  />
                )}
                {activeTab === "schema" && (
                  <SchemaEditor
                    inputSchema={generatedTool.capability.input_schema}
                    outputSchema={generatedTool.capability.output_schema}
                    onInputChange={(s) => handleSchemaChange("input", s)}
                    onOutputChange={(s) => handleSchemaChange("output", s)}
                  />
                )}
                {activeTab === "policy" && (
                  <PolicyConfig
                    policy={generatedTool.policy}
                    onChange={handlePolicyChange}
                  />
                )}
              </div>

              {/* Export */}
              <div className="border-t border-border p-4">
                <ExportOptions tool={generatedTool} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-lg">No tool generated yet</span>
              <span className="text-sm">
                Describe your tool and click Generate
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
