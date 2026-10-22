"use client";

import { ImageUp, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { Input } from "@/components/ui/input";
import { InputGroupButton } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
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
    <Stack gap="2">
      <Text as="span" id={`${id}-label`} weight="semibold" className="text-sm">
        {label}
      </Text>
      <Label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input px-4 py-8 text-center font-normal transition-colors hover:bg-muted/50",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
          dragging && "border-primary bg-background",
        )}
      >
        <Flex
          as="span"
          align="center"
          justify="center"
          aria-hidden="true"
          className="size-10 rounded-md bg-muted text-muted-foreground [&_svg]:size-5"
        >
          <ImageUp aria-hidden="true" />
        </Flex>
        <Text as="span" className="text-sm">
          <Text as="span" tone="primary" weight="semibold">
            Choose an image
          </Text>{" "}
          or drag it here
        </Text>
        <Text as="span" id={`${id}-hint`} tone="muted" className="text-fs-12">
          {hint}
        </Text>
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
        <Flex align="center" justify="between" gap="3" className="rounded-xl bg-muted px-3 py-2">
          <Text as="span" className="truncate text-sm">
            {fileName}
          </Text>
          <InputGroupButton size="icon-xs" aria-label={`Remove ${fileName}`} onClick={clear}>
            <X aria-hidden="true" />
          </InputGroupButton>
        </Flex>
      )}
    </Stack>
  );
}
