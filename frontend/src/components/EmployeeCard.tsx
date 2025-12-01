import React from "react";

export default function EmployeeCard({
  employee,
  compact = false,
  onEdit,
  onDelete,
  onClick
}: {
  employee: any;
  compact?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`card p-4 ${compact ? "flex items-center gap-4" : ""} ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    > 
      <div className="flex-1">
        <div className="text-lg header-title">{employee.fullName}</div>
        <div className="text-sm text-ui-muted mt-1" style={{ color: "var(--text-muted)" }}>
          {employee.className}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="pill">{employee.attendancePercentage ?? "-"}%</div>

        <div className="flex gap-2">
          {onEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="btn-outline">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-sm px-2 py-1 rounded-md border border-transparent text-red-600">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}