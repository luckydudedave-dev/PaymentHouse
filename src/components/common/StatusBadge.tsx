import { Badge, type BadgeProps } from "@/components/ui/badge";

/** Maps transaction / account statuses to badge colors. */
const MAP: Record<string, BadgeProps["variant"]> = {
  completed: "success",
  approved: "success",
  active: "success",
  confirmed: "success",
  resolved: "success",
  pending: "warning",
  pending_verification: "warning",
  open: "warning",
  processing: "info",
  rejected: "danger",
  failed: "danger",
  suspended: "danger",
  closed: "neutral",
  restricted: "neutral",
  none: "neutral",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={MAP[status] ?? "neutral"} className="whitespace-nowrap capitalize">
      {status === "none" ? "not submitted" : status.replace(/_/g, " ")}
    </Badge>
  );
}
