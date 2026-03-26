import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

const statusBadgeVariants = cva("", {
  variants: {
    status: {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      confirmed: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      default: "",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof statusBadgeVariants> {
  status: "pending" | "confirmed" | "cancelled" | "default";
  showLabel?: boolean;
}

function StatusBadge({ 
  className, 
  status, 
  showLabel = true, 
  ...props 
}: StatusBadgeProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(statusBadgeVariants({ status }), className)} 
      {...props}
    >
      {showLabel ? getStatusLabel(status) : null}
    </Badge>
  );
}

export { StatusBadge, statusBadgeVariants };