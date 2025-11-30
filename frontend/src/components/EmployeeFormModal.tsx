import React, { useEffect, useState } from "react";

type Input = {
  fullName: string;
  className?: string | null;
  attendancePercentage?: number | null;
};

export default function EmployeeFormModal({
  open,
  initialValues,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean;
  initialValues?: Partial<Input> | null;
  onClose: () => void;
  onSubmit: (input: Input) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [attendance, setAttendance] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setFullName(initialValues.fullName ?? "");
      setClassName(initialValues.className ?? "");
      setAttendance(
        initialValues.attendancePercentage != null
          ? String(initialValues.attendancePercentage)
          : ""
      );
    } else {
      setFullName("");
      setClassName("");
      setAttendance("");
    }
    setError(null);
  }, [initialValues, open]);

  if (!open) return null;

  const validate = (): Input | null => {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return null;
    }
    if (attendance !== "") {
      const n = Number(attendance);
      if (Number.isNaN(n) || n < 0 || n > 100) {
        setError("Attendance must be a number between 0 and 100.");
        return null;
      }
      return {
        fullName: fullName.trim(),
        className: className.trim() || null,
        attendancePercentage: n,
      };
    }
    return {
      fullName: fullName.trim(),
      className: className.trim() || null,
      attendancePercentage: null,
    };
  };

  const submit = async () => {
    const payload = validate();
    if (!payload) return;
    setError(null);
    try {
      await onSubmit(payload);
    } catch (e: any) {
      setError(e?.message ?? "Submission failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="modal-sheet relative z-10 w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">
          {initialValues ? "Edit employee" : "New employee"}
        </h2>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="search-input w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class name</label>
            <input value={className} onChange={(e) => setClassName(e.target.value)} className="search-input w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Attendance %</label>
            <input value={attendance} onChange={(e) => setAttendance(e.target.value)} className="search-input w-full" placeholder="0 - 100" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn-outline" disabled={submitting}>
            Cancel
          </button>
          <button onClick={submit} className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
