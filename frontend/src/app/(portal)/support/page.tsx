"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardTitle, Button } from "@/components/ui";
import { HelpCircle, Book, MessageCircle, Phone, Mail, FileQuestion, ExternalLink } from "lucide-react";

const supportOptions = [
  { title: "Knowledge Base", description: "Browse articles, guides, and FAQ", icon: Book, action: "Browse" },
  { title: "Live Chat", description: "Chat with our support team in real-time", icon: MessageCircle, action: "Start Chat" },
  { title: "Phone Support", description: "Call us at +1 (800) 555-CARE", icon: Phone, action: "Call Now" },
  { title: "Email Support", description: "Send us an email at support@panacea.health", icon: Mail, action: "Send Email" },
  { title: "Report a Bug", description: "Found something wrong? Let us know", icon: FileQuestion, action: "Report" },
  { title: "Feature Request", description: "Suggest improvements to the platform", icon: ExternalLink, action: "Submit" },
];

export default function SupportPage() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Support" }]} />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold font-mono text-foreground">Help & Support</h1>
          <p className="text-sm text-muted-foreground mt-1">Get help with the Panacea Clinical Portal</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {supportOptions.map((opt, i) => (
            <Card key={i} className="flex flex-col items-center text-center gap-3 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <opt.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-center">{opt.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
              </div>
              <Button variant="outline" size="sm">{opt.action}</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
