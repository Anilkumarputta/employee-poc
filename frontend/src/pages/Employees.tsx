import React, { useEffect, useState } from "react";
import { getClient } from "../lib/api";
import { gql } from "graphql-request";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeDetailModal from "../components/EmployeeDetailModal";

const EMPLOYEES_QUERY = gql`
  query Employees($page: Int, $perPage: Int, $filter: EmployeeFilter) {
    employees(page: $page, perPage: $perPage, filter: $filter) {
      items {
        id
        fullName
        className
        attendancePercentage
      }
      total
      page
      perPage
    }
  }
`;

export default function Employees({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [viewGrid, setViewGrid] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const client = getClient(token);
      const variables: any = { page, perPage, filter: {} };
      if (query) variables.filter.query = query;
      const data: any = await client.request(EMPLOYEES_QUERY, variables);
      setItems(data.employees.items);
      setTotal(data.employees.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, query]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl header-title">Employee POC</h1>

        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2" onClick={() => setViewGrid((s) => !s)}>
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            List / Grid
          </button>

          <button className="btn-primary" title="Export">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input className="search-input" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading…</div>
      ) : (
        <div className={viewGrid ? "grid grid-cols-3 gap-4" : "space-y-4"}>
          {items.map((emp) => (
            <div key={emp.id} onClick={() => setSelected(emp)}>
              <EmployeeCard employee={emp} compact={!viewGrid} />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 border rounded">{page}</div>
          <button disabled={page * perPage >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {selected && <EmployeeDetailModal employee={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}