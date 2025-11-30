import React, { useEffect, useState } from "react";
import { getClient } from "../lib/api";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeDetailModal from "../components/EmployeeDetailModal";
import EmployeeFormModal from "../components/EmployeeFormModal";
import {
  EMPLOYEES_QUERY,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from "../graphql/employees";

export default function Employees({
  token,
  onLogout,
}: {
  token?: string | null;
  onLogout?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [viewGrid, setViewGrid] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [mutating, setMutating] = useState(false);

  // decode token client-side for UI gating (not a security boundary)
  let currentUser: any = null;
  if (token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        currentUser = JSON.parse(atob(payload));
      }
    } catch {
      currentUser = null;
    }
  }
  const isAdmin = currentUser?.role === "admin";

  const fetchData = async () => {
    setLoading(true);
    try {
      const client = getClient(token ?? null);
      const variables: any = { page, perPage, filter: {} };
      if (query) variables.filter.query = query;
      const data: any = await client.request(EMPLOYEES_QUERY, variables);
      setItems(data.employees.items ?? []);
      setTotal(data.employees.total ?? 0);
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this employee?")) return;
    setMutating(true);
    try {
      const client = getClient(token ?? null);
      await client.request(DELETE_EMPLOYEE, { id });
      await fetchData();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + (err?.message ?? String(err)));
    } finally {
      setMutating(false);
    }
  };

  const handleCreate = async (input: any) => {
    setMutating(true);
    try {
      const client = getClient(token ?? null);
      await client.request(CREATE_EMPLOYEE, { input });
      setCreating(false);
      await fetchData();
    } catch (err: any) {
      console.error("Create failed:", err);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const handleUpdate = async (input: any) => {
    if (!editing) return;
    setMutating(true);
    try {
      const client = getClient(token ?? null);
      await client.request(UPDATE_EMPLOYEE, { id: editing.id, input });
      setEditing(null);
      await fetchData();
    } catch (err: any) {
      console.error("Update failed:", err);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl header-title">Employee POC</h1>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button className="btn-primary" onClick={() => setCreating(true)}>
              New employee
            </button>
          )}

          <button
            className="btn-outline flex items-center gap-2"
            onClick={() => setViewGrid((s) => !s)}
          >
            <svg
              className="w-5 h-5 text-brand-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            List / Grid
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          className="search-input"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading…</div>
      ) : (
        <div className={viewGrid ? "grid grid-cols-3 gap-4" : "space-y-4"}>
          {items.map((emp) => (
            <div key={emp.id}>
              <EmployeeCard
                employee={emp}
                compact={!viewGrid}
                onEdit={() => isAdmin && setEditing(emp)}
                onDelete={() => isAdmin && handleDelete(emp.id)}
                onClick={() => setSelected(emp)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <div className="px-3 py-1 border rounded">{page}</div>
          <button
            disabled={page * perPage >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <EmployeeDetailModal employee={selected} onClose={() => setSelected(null)} />
      )}

      <EmployeeFormModal
        open={creating}
        initialValues={null}
        onClose={() => setCreating(false)}
        onSubmit={handleCreate}
        submitting={mutating}
      />

      <EmployeeFormModal
        open={!!editing}
        initialValues={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
        submitting={mutating}
      />
    </div>
  );
}
