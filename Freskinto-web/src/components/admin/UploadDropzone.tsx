"use client";

import { ImageUp, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  id: string;
  label: string;
  hint?: string;
  accept?: string;
}

/** Image picker (click ya drag & drop) — sirf chuni hui file ka naam dikhata hai, upload nahi karta */
export function UploadDropzone({
  id,
  label,
  hint = "PNG, JPG or WebP — square works best",
  accept = "image/png,image/jpeg,image/webp",
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (!file || !inputRef.current) return;
    inputRef.current.files = event.dataTransfer.files;
    setFileName(file.name);
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFileName(null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${id}-label`} className="text-sm font-medium">
        {label}
      </span>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-cream px-4 py-8 text-center transition-colors hover:border-brand hover:bg-brand-soft/40",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
          dragging && "border-brand bg-brand-soft/60",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-card text-brand shadow-soft ring-1 ring-border">
          <ImageUp className="size-5" aria-hidden="true" />
        </span>
        <span className="text-sm">
          <span className="font-semibold text-brand">Choose an image</span> or drag it here
        </span>
        <span id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
      </label>
      {fileName && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
          <span className="truncate">{fileName}</span>
          <Button variant="ghost" size="icon-xs" aria-label={`Remove ${fileName}`} onClick={clear}>
            <X aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
