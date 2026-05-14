// Matches CODEX tools/src/lib.rs ToolCapability
export interface ToolCapability {
  tool_id: string
  description: string
  input_schema: JsonSchema
  output_schema: JsonSchema
  side_effects: string[]
}

// Matches CODEX tools/src/lib.rs ToolPolicy
export interface ToolPolicy {
  tool_id: string
  allowed_actions: string[]
  max_consecutive: number
  requires_confirmation: boolean
  sandbox_required: boolean
}

export interface JsonSchema {
  type: string
  properties?: Record<string, JsonSchemaProperty>
  required?: string[]
  description?: string
}

export interface JsonSchemaProperty {
  type: string
  description?: string
  enum?: string[]
  default?: unknown
}

export interface GeneratedTool {
  id: string
  name: string
  description: string
  rust_code: string
  capability: ToolCapability
  policy: ToolPolicy
  created_at: string
  status: "draft" | "exported" | "integrated"
}

export interface ToolGenerationRequest {
  description: string
}

export interface ToolGenerationResponse {
  tool_id: string
  name: string
  description: string
  rust_code: string
  input_schema: JsonSchema
  output_schema: JsonSchema
  side_effects: string[]
  policy: ToolPolicy
}
