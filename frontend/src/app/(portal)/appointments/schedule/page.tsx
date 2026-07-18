import { Header } from "@/components/layout/Header";
import { Card, CardTitle, Button, Badge, StatCard } from "@/components/ui";
import { CalendarDays, Clock, XCircle } from "lucide-react";

const days = [
  { day: "SUN", date: "23" }, { day: "MON", date: "24" }, { day: "TUE", date: "25" },
  { day: "WED", date: "26" }, { day: "THU", date: "27" },
];
const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

type Appt = { col: number; row: number; span: number; title: string; sub: string; tone: string };
const appts: Appt[] = [
  { col: 1, row: 0, span: 2, title: "Paul Peduzzi", sub: "Follow-up Visit", tone: "bg-warning text-warning-foreground" },
  { col: 1, row: 3, span: 1, title: "Sarah Beckham", sub: "Initial Consult", tone: "bg-primary/15 text-primary" },
  { col: 2, row: 0, span: 1, title: "Kim McMillan", sub: "Lab / Diagnostics", tone: "bg-info text-info-foreground" },
  { col: 3, row: 1, span: 2, title: "Joshua Diaz", sub: "Follow-up Visit", tone: "bg-warning text-warning-foreground" },
  { col: 4, row: 4, span: 1, title: "Mila Imaging", sub: "Lab / Diagnostics", tone: "bg-info text-info-foreground" },
];

const requests = [
  { name: "Elena Gilbert", meta: "Referred by: Dr. Salvatore", tag: "Cardiology Screen", urgent: false },
  { name: "Jeremy Gilbert", meta: "Online Portal Request", tag: "Medication Review", urgent: false },
  { name: "Bonnie Bennett", meta: "Emergency Follow-up", tag: "Rapid Results", urgent: true },
];

export default function ClinicSchedulePage() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Appointments", href: "/appointments" }, { label: "Clinic-Wide Schedule" }]} />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Clinic Schedule</h1>
            <p className="text-sm text-muted-foreground mt-1">Managing 14 practitioners across 4 departments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-border overflow-hidden text-sm">
              {["Day", "Week", "Month"].map((v, i) => (
                <button key={v} className={`px-3 py-1.5 ${i === 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-accent"}`}>{v}</button>
              ))}
            </div>
            <Badge variant="outline">Oct 23 – Oct 29, 2023</Badge>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="col-span-3 p-0 overflow-hidden">
            <div className="grid" style={{ gridTemplateColumns: "64px repeat(5, 1fr)" }}>
              <div className="border-b border-r border-border" />
              {days.map((d) => (
                <div key={d.date} className="border-b border-border p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">{d.day}</p>
                  <p className="text-sm font-semibold font-mono text-foreground">{d.date}</p>
                </div>
              ))}
              {hours.map((h, ri) => (
                <div key={h} className="contents">
                  <div className="border-r border-border p-1 text-[10px] text-muted-foreground text-right pr-2">{h}</div>
                  {days.map((_, ci) => {
                    const a = appts.find((x) => x.col === ci && x.row === ri);
                    return (
                      <div key={ci} className="border-b border-r border-border/50 h-12 relative">
                        {a && (
                          <div className={`absolute inset-x-0.5 top-0.5 rounded-lg px-2 py-1 text-[10px] ${a.tone}`}
                               style={{ height: `${a.span * 3 - 0.5}rem` }}>
                            <p className="font-semibold truncate">{a.title}</p>
                            <p className="opacity-80 truncate">{a.sub}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 p-3 text-[11px] text-muted-foreground border-t border-border">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-primary/40" /> Initial Consultation</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-warning" /> Follow-up Visit</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-info" /> Laboratory / Diagnostics</span>
            </div>
          </Card>

          {/* Pending requests */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle>Pending Requests</CardTitle>
              <Badge variant="error">3</Badge>
            </div>
            {requests.map((r) => (
              <div key={r.name} className="p-3 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  {r.urgent && <Badge variant="error">Urgent</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{r.meta}</p>
                <Badge variant="info">{r.tag}</Badge>
                <Button variant="primary" size="sm" className="w-full">Schedule</Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full">View Request Archive</Button>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Slots Occupied" value="84%" change="+5% from last week" changeType="up" icon={CalendarDays} />
          <StatCard label="Average Wait Time" value="12 min" change="On target" changeType="neutral" icon={Clock} />
          <StatCard label="Cancellations" value="3" change="This week" changeType="neutral" icon={XCircle} iconColor="text-error-foreground" />
        </div>
      </div>
    </div>
  );
}
