"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { InputField, type InputFieldProps } from "./InputField";

/** Password input + show/hide toggle (aria-label badalta hai) */
export function PasswordField(props: Omit<InputFieldProps, "type" | "leftIcon" | "rightIcon">) {
  const [visible, setVisible] = useState(false);
  return (
    <InputField
      {...props}
      type={visible ? "text" : "password"}
      leftIcon={<Lock aria-hidden="true" />}
      rightIcon={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      }
    />
  );
}
