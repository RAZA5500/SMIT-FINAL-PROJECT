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

/** Small aisle label: "Aisle 03 · Dairy" */
export function AisleTag({ index, label, className }: AisleTagProps) {
  return (
    <Badge variant="secondary" className={className}>
      {index === undefined ? "Aisle" : `Aisle ${aisleNumber(index)}`}
      {label && ` · ${label}`}
    </Badge>
  );
}
