"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { InputGroupButton } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { InputField, type InputFieldProps } from "./InputField";

/** Password input + show/hide toggle (aria-label aur aria-pressed badalte hain) */
export function PasswordField(props: Omit<InputFieldProps, "type" | "leftIcon" | "rightIcon">) {
  const [visible, setVisible] = useState(false);
  return (
    <InputField
      {...props}
      type={visible ? "text" : "password"}
      leftIcon={<Lock aria-hidden="true" />}
      rightIcon={
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className={cn("text-muted-foreground hover:text-foreground")}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </InputGroupButton>
      }
    />
  );
}
