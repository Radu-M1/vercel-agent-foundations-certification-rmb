"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

export function AgentChat() {
  const [input, setInput] = useState("");

  const { messages, error, sendMessage, status } = useChat();

  const isWaiting = status === "submitted";
  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (_message: PromptInputMessage) => {
    const text = input.trim();

    if (!text || isBusy) return;

    void sendMessage({ text });
    setInput("");
  };

  if (error) {
    return <div className="p-4 text-sm text-destructive">{error.message}</div>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) =>
            message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <Message key={`${message.id}-${index}`} from={message.role}>
                      <MessageContent>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                  );

                default:
                  return null;
              }
            }),
          )}

          {isWaiting && (
            <Message from="assistant">
              <MessageContent>
                <div
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Thinking...</span>
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Ask the agent"
              disabled={isBusy}
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools />

            <PromptInputSubmit
              status={status}
              disabled={!input.trim() || isBusy}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
