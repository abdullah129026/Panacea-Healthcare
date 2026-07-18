import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Button, Card } from "@/components/ui";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal";
import { requireRole } from "@/lib/auth";
import { listDocuments } from "@/lib/documents";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { DocumentCategory } from "@/types";
import { DOCUMENT_CATEGORIES } from "@/types";
import {
  FileText,
  Download,
  AlertCircle,
  Eye,
  MoreHorizontal,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  Clock,
  User,
  File,
  Image,
} from "lucide-react";

const PAGE_SIZE = 20;

function getFileIcon(format: string) {
  switch (format.toUpperCase()) {
    case "PDF":
      return FileText;
    case "DICOM":
    case "JPG":
    case "JPEG":
    case "PNG":
      return Image;
    default:
      return File;
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM dd, yyyy");
  } catch {
    return "—";
  }
}

export default async function MedicalRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}) {
  await requireRole(["clinician", "admin"]);

  const { search = "", category = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const result = await listDocuments({
    search: search || undefined,
    category: category || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function pageHref(target: number): string {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/medical-records?${qs}` : "/medical-records";
  }

  const documents = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  return (
    <div className="flex flex-col">
      <Header
        breadcrumbs={[
          { label: "MR & Docs" },
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Medical Records & Documents
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage patient records, reports, and clinical documentation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <UploadDocumentModal />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">8,627</p>
              <p className="text-xs text-muted-foreground">Total Documents</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">156</p>
              <p className="text-xs text-muted-foreground">Added This Week</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
              <Eye className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">23</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info flex items-center justify-center">
              <User className="w-5 h-5 text-info-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">42</p>
              <p className="text-xs text-muted-foreground">Shared Today</p>
            </div>
          </div>
        </div>

        {/* Folder Navigation */}
        <div className="grid grid-cols-6 gap-3">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const count = documents.filter((d) => d.category === cat).length;
            return (
              <Link
                key={cat}
                href={`/medical-records?category=${encodeURIComponent(cat)}`}
                className="bg-card rounded-2xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 hover:bg-accent/50 transition-all group"
              >
                <FolderOpen className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-foreground">{cat}</p>
                <p className="text-[10px] text-muted-foreground">{count} files</p>
              </Link>
            );
          })}
        </div>

        {/* Documents Table */}
        <Card className="p-0 overflow-hidden">
          {!result.success ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load documents right now. Please refresh to try again.
              </p>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {search || category ? "No documents match your search." : "No documents uploaded yet."}
              </p>
              <UploadDocumentModal />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Document
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Uploaded
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      By
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const Icon = getFileIcon(doc.format);
                    return (
                      <tr
                        key={doc.id}
                        className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground truncate max-w-[180px]">
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {doc.type} · {doc.format}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {doc.category}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {formatSize(doc.sizeBytes)}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {doc.uploadedBy}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button className="p-1 rounded hover:bg-accent">
                              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button className="p-1 rounded hover:bg-accent">
                              <Download className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button className="p-1 rounded hover:bg-accent">
                              <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Showing {rangeStart}-{rangeEnd} of {total.toLocaleString()} documents
                </p>
                <div className="flex items-center gap-1">
                  <Link
                    href={pageHref(Math.max(1, page - 1))}
                    aria-disabled={page <= 1}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-accent transition-colors",
                      page <= 1 && "pointer-events-none opacity-40"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  {pageWindow(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`gap-${i}`}
                        className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                          p === page
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {p}
                      </Link>
                    )
                  )}
                  <Link
                    href={pageHref(Math.min(totalPages, page + 1))}
                    aria-disabled={page >= totalPages}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-accent transition-colors",
                      page >= totalPages && "pointer-events-none opacity-40"
                    )}
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
