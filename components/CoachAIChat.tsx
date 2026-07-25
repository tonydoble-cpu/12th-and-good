"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "How does a 401(k) match work?",
  "What's the difference between snowball and avalanche for debt?",
  "I have a meeting with my financial advisor — what should I ask?",
  "How much should I have in an emergency fund?",
  "What's an HSA and why do people talk about it?",
];

export default function CoachAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      const updatedMessages = [...messages, userMessage];
      setMessages([...updatedMessages, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      try {
        const response = await fetch("/api/coach-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader");

        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content: accumulated,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content:
                "Sorry, something went wrong on my end. Try again in a moment — or if you'd rather talk to a real person, you can book a session with a real coach at /coaches.",
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* chat area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        {messages.length === 0 ? (
          /* empty state */
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white text-xl mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="font-display text-[22px] md:text-[26px] font-medium text-ink text-center">
              12th & Good Street Money Coach
            </h2>
            <p className="mt-3 max-w-[440px] text-center text-[15px] text-ink-2">
              I&rsquo;m an AI, not a licensed advisor — but I can help you
              think through money questions in plain English, or help you
              prepare for a conversation with your coach or advisor.
            </p>

            <div className="mt-10 w-full max-w-[520px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted mb-3 text-center">
                Try asking
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full rounded-xl border border-line bg-surface px-5 py-3.5 text-left text-[14px] text-ink-2 transition-all hover:border-accent/40 hover:bg-white hover:text-ink hover:shadow-[0_4px_16px_-8px_rgba(58,90,125,0.25)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* messages */
          <div className="mx-auto max-w-[680px] py-6 flex flex-col gap-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-[1.65] ${
                    m.role === "user"
                      ? "bg-accent text-white rounded-br-md"
                      : "bg-surface border border-line text-ink-2 rounded-bl-md"
                  }`}
                >
                  {m.role === "assistant" && !m.content && isStreaming ? (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-bounce [animation-delay:300ms]" />
                    </span>
                  ) : (
                    m.content.split("\n\n").map((para, i) => (
                      <p key={i} className={i > 0 ? "mt-3" : ""}>
                        {para.split("\n").map((line, j) => (
                          <span key={j}>
                            {j > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </p>
                    ))
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* input area */}
      <div className="shrink-0 border-t border-line bg-[rgba(245,244,241,0.9)] backdrop-blur-sm px-4 md:px-0 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-[680px] items-end gap-3"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a money question..."
              rows={1}
              className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 pr-4 text-[15px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isStreaming}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-[0_4px_12px_-4px_rgba(58,90,125,0.5)] transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
        <p className="mx-auto mt-2.5 max-w-[680px] text-center text-[11.5px] text-muted">
          AI assistant, not a financial advisor. For specific decisions about
          your money, talk to a{" "}
          <a href="/coaches" className="text-accent hover:underline">
            12th & Good Street coach
          </a>{" "}
          or your own licensed professional.
        </p>
      </div>
    </div>
  );
}
