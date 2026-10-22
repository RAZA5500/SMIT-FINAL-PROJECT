import { Badge } from "@/components/ui/badge";

/** "01", "02" … — top-level categories ka order hi aisle number hai (sirf dikhawa) */
export function aisleNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

interface AisleTagProps {
  /** 0-based index in the sorted top-level category list */
  index?: number;
  /** Text after the number, e.g. the aisle name */
  label?: string;
  className?: string;
}

/** Supermarket hanging-sign style label: "● AISLE 03 · DAIRY" */
export function AisleTag({ index, label, className }: AisleTagProps) {
  return (
    <Badge variant="brand" className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
      {index === undefined ? "Aisle" : `Aisle ${aisleNumber(index)}`}
      {label && ` · ${label}`}
    </Badge>
  );
}
