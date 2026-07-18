"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Headset } from "lucide-react";

const messages = [
  { from: "agent", text: "Hi Dr. Thorne 👋 This is Panacea Support. How can I help you today?" },
  { from: "user", text: "I need help exporting the monthly billing report." },
  { from: "agent", text: "Of course! You can export from Reports → Export. Would you like me to walk you through it?" },
];

export function LiveSupportChat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Headset className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Live Support</p>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b6ffce]" /> Online · avg. reply 2 min
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${
                  m.from === "user" ? "bg-primary text-white rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-border">
            <input
              placeholder="Type your message..."
              className="flex-1 h-9 rounded-xl bg-muted px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
        aria-label="Toggle support chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
