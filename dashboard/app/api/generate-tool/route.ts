import { generateText, Output } from "ai"
import { z } from "zod"
import {
  TOOL_GENERATION_SYSTEM_PROMPT,
  TOOL_GENERATION_USER_PROMPT,
} from "@/lib/tool-builder/prompts"

const toolGenerationSchema = z.object({
  tool_id: z.string().describe("Snake case identifier for the tool"),
  name: z.string().describe("Human readable tool name"),
  description: z.string().describe("Clear description of what the tool does"),
  rust_code: z.string().describe("Complete Rust implementation code"),
  input_schema: z.object({
    type: z.string(),
    properties: z.record(
      z.object({
        type: z.string(),
        description: z.string().nullable(),
      })
    ),
    required: z.array(z.string()),
  }),
  output_schema: z.object({
    type: z.string(),
    properties: z.record(
      z.object({
        type: z.string(),
        description: z.string().nullable(),
      })
    ),
  }),
  side_effects: z.array(z.string()).describe("List of side effects"),
  policy: z.object({
    tool_id: z.string(),
    allowed_actions: z.array(z.string()),
    max_consecutive: z.number(),
    requires_confirmation: z.boolean(),
    sandbox_required: z.boolean(),
  }),
})

export async function POST(req: Request) {
  try {
    const { description } = await req.json()

    if (!description || typeof description !== "string") {
      return Response.json(
        { error: "Description is required" },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: "anthropic/claude-sonnet-4.6",
      output: Output.object({
        schema: toolGenerationSchema,
      }),
      system: TOOL_GENERATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: TOOL_GENERATION_USER_PROMPT(description),
        },
      ],
    })

    return Response.json(output)
  } catch (error) {
    console.error("Tool generation error:", error)
    return Response.json(
      { error: "Failed to generate tool" },
      { status: 500 }
    )
  }
}
