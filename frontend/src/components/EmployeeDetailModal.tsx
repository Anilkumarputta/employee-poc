import React from "react";

export default function EmployeeDetailModal({
  employee,
  onClose
}: {
  employee: any | null;
  onClose: () => void;
}) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="modal-sheet relative z-10 w-full max-w-md">
        <h2 className="text-2xl header-title mb-4">Employee details</h2>

        <div className="text-lg font-semibold">{employee.fullName}</div>
        <div className="text-sm text-ui-muted mb-3" style={{ color: "var(--text-muted)" }}>{employee.className}</div>

        <div className="mb-4">Attendance: <span className="font-medium">{employee.attendancePercentage ?? "-"}%</span></div>

        <div className="text-sm text-ui-muted mb-4" style={{ color: "var(--text-muted)" }}>
          <div className="font-semibold mb-1">Contact</div>
          <div>employee@example.com · +1 (555) 123-4567</div>
        </div>

        <div className="mb-6 text-sm text-ui-muted" style={{ color: "var(--text-muted)" }}>
          <div className="font-semibold mb-1">Notes</div>
          <div>High performer; supports onboarding and training and works closely with cross-functional teams.</div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    </div>
  );
}