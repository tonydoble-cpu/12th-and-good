import { NextRequest, NextResponse } from "next/server";
import {
  COACH_AI_SYSTEM_PROMPT,
  DEMO_RESPONSES,
} from "@/lib/coach-ai-prompt";

/**
 * Whether a real LLM API is configured.
 * Supports both Anthropic (Claude) and OpenAI-compatible APIs.
 */
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const isLLMConfigured = Boolean(anthropicKey || openaiKey);

type Message = { role: "user" | "assistant"; content: string };

/* ---------- demo mode (no API key) ---------- */

function pickDemoResponse(messages: Message[]): string {
  const lastUser = messages
    .filter((m) => m.role === "user")
    .pop()
    ?.content.toLowerCase() ?? "";

  if (messages.filter((m) => m.role === "user").length === 1 && lastUser.length < 15) {
    return DEMO_RESPONSES.greeting;
  }
  if (/401.?k|retirement|match|employer match/i.test(lastUser)) {
    return DEMO_RESPONSES["401k"];
  }
  if (/budget|spending|50.?30.?20|where.+money.+go/i.test(lastUser)) {
    return DEMO_RESPONSES.budget;
  }
  if (/debt|payoff|pay off|snowball|avalanche|credit card|loan/i.test(lastUser)) {
    return DEMO_RESPONSES.debt;
  }
  return DEMO_RESPONSES.fallback;
}

/** Simulate streaming by yielding chunks of the demo response. */
function createDemoStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = text.split(" ");
  let index = 0;

  return new ReadableStream({
    async pull(controller) {
      if (index >= words.length) {
        // Send the [DONE] marker then close
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }
      // Send 2-4 words at a time for a natural feel
      const chunk = words.slice(index, index + 3).join(" ");
      index += 3;
      const payload = JSON.stringify({
        choices: [{ delta: { content: chunk + " " } }],
      });
      controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      // Simulate typing delay
      await new Promise((r) => setTimeout(r, 40 + Math.random() * 60));
    },
  });
}

/* ---------- live mode (Anthropic Claude API) ---------- */

async function streamAnthropic(messages: Message[]): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: COACH_AI_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }
      const text = decoder.decode(value, { stream: true });
      // Parse Anthropic SSE events and convert to OpenAI-compatible format
      const lines = text.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;
        try {
          const event = JSON.parse(data);
          if (event.type === "content_block_delta" && event.delta?.text) {
            const payload = JSON.stringify({
              choices: [{ delta: { content: event.delta.text } }],
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        } catch {
          // Skip non-JSON lines
        }
      }
    },
  });
}

/* ---------- live mode (OpenAI-compatible API) ---------- */

async function streamOpenAI(messages: Message[]): Promise<ReadableStream<Uint8Array>> {
  const baseUrl = process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        { role: "system", content: COACH_AI_SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  // OpenAI already sends SSE in the right format — pass through
  return response.body as ReadableStream<Uint8Array>;
}

/* ---------- route handler ---------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    let stream: ReadableStream<Uint8Array>;

    if (!isLLMConfigured) {
      // Demo mode — simulate streaming with canned responses
      stream = createDemoStream(pickDemoResponse(messages));
    } else if (anthropicKey) {
      stream = await streamAnthropic(messages);
    } else {
      stream = await streamOpenAI(messages);
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Coach AI error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
