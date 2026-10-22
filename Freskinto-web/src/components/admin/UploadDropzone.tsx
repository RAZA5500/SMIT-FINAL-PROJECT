"use client";

import { ImageUp, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { Input } from "@/components/ui/input";
import { InputGroupButton } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-sm font-semibold text-foreground">
        {label}
      </span>
      <Label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "cursor-pointer flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-muted px-4 py-8 text-center font-normal transition-colors hover:border-primary",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
          dragging && "border-primary bg-background",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("flex size-12 items-center justify-center rounded-full border bg-background text-brand [&_svg]:size-5")}
        >
          <ImageUp aria-hidden="true" />
        </span>
        <span className="text-sm">
          <span className="font-semibold text-brand">
            Choose an image
          </span>{" "}
          or drag it here
        </span>
        <span id={`${id}-hint`} className="text-fs-12 text-muted-foreground">
          {hint}
        </span>
        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className={cn("sr-only")}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
      </Label>
      {fileName && (
        <div className={cn("flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2")}>
          <span className={cn("truncate text-sm")}>
            {fileName}
          </span>
          <InputGroupButton size="icon-xs" aria-label={`Remove ${fileName}`} onClick={clear}>
            <X aria-hidden="true" />
          </InputGroupButton>
        </div>
      )}
    </div>
  );
}
