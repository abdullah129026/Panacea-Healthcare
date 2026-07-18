"use client";

import { useActionState, useRef, useState } from "react";
import { Modal, Button, Input, Select } from "@/components/ui";
import { Upload, FileUp, X } from "lucide-react";
import { uploadDocument } from "@/app/(portal)/medical-records/actions";
import { DOCUMENT_CATEGORIES } from "@/types";
import type { FormState } from "@/lib/forms";

const FORM_ID = "upload-document-form";
const initialState: FormState = {};

const documentTypeOptions = [
  { value: "Medical Record", label: "Medical Record" },
  { value: "Lab Report", label: "Lab Report" },
  { value: "Diagnostic Report", label: "Diagnostic Report" },
  { value: "Surgical Report", label: "Surgical Report" },
  { value: "Prescription", label: "Prescription" },
  { value: "Discharge Note", label: "Discharge Note" },
];

const categoryOptions = DOCUMENT_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
}));

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function UploadDocumentModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    uploadDocument,
    initialState
  );
  const [seenState, setSeenState] = useState(state);
  const [formKey, setFormKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (state !== seenState) {
    setSeenState(state);
    if (state.success) {
      setOpen(false);
      setFormKey((k) => k + 1);
      setSelectedFile(null);
    }
  }

  function handleFileSelect(file: File) {
    if (file.size > 25 * 1024 * 1024) {
      alert("File exceeds 25 MB limit");
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Upload className="w-4 h-4" /> Upload Document
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Upload New Document"
        description="Attach clinical files, imaging, or reports to a patient record."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              form={FORM_ID}
              type="submit"
              disabled={pending || !selectedFile}
            >
              {pending ? "Uploading..." : "Upload & Attach"}
            </Button>
          </>
        }
      >
        <form
          key={formKey}
          id={FORM_ID}
          action={formAction}
          className="space-y-4"
        >
          {state.error && (
            <p className="rounded-lg bg-error px-3 py-2 text-sm text-error-foreground">
              {state.error}
            </p>
          )}

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/40 transition-colors cursor-pointer bg-muted/30"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {selectedFile ? selectedFile.name : "Drag & drop files here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse · PDF, JPG, PNG, DICOM up to 25MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) handleFileSelect(file);
              }}
              accept=".pdf,.jpg,.jpeg,.png,.dcm"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-info/5">
              <div className="text-sm">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          <div>
            <Input
              label="Document Title"
              name="name"
              placeholder="e.g. Cardiac Stress Test Results"
              required
            />
            <FieldError messages={state.fieldErrors?.name} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Document Type"
                name="type"
                options={documentTypeOptions}
                required
              />
              <FieldError messages={state.fieldErrors?.type} />
            </div>
            <div>
              <Select
                label="Category"
                name="category"
                options={categoryOptions}
                required
              />
              <FieldError messages={state.fieldErrors?.category} />
            </div>
          </div>

          <div>
            <Input
              label="Linked Patient (optional)"
              name="patientId"
              placeholder="Enter patient ID..."
            />
            <FieldError messages={state.fieldErrors?.patientId} />
          </div>
        </form>
      </Modal>
    </>
  );
}
