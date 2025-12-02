import React, { useEffect, useState } from "react";
import { getClient, GET_EMPLOYEES, GET_EMPLOYEE, CREATE_EMPLOYEE } from "../api";

type Employee = {
  id: number;
  name: string;
  email: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
};

export default function EmployeeView({ token, user }: { token: string; user: any }) {
  const [items, setItems] = useState<Employee[]>([]);
  const [view, setView] = useState<"grid" | "tiles">("grid");
  const [page, setPage] = useState(0);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const client = getClient(token);

  const fetch = async () => {
    const offset = page * perPage;
    const data = await client.request(GET_EMPLOYEES, {
      pagination: { skip: offset, take: perPage },
      sort: { field: sortField, direction: sortDir }
    });
    setItems(data.employees.items);
    setTotal(data.employees.total);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortDir]);

  const openEmployee = async (id: number) => {
    const data = await client.request(GET_EMPLOYEE, { id });
    setSelected(data.employee);
  };

  const createTest = async () => {
    // Only admin allowed; check server role
    try {
      const data = await client.request(CREATE_EMPLOYEE, {
        input: {
          name: `New Employee ${Date.now()}`,
          email: `new+${Date.now()}@example.com`,
          age: 25,
          class: "Class X",
          subjects: ["Math"],
          attendance: 100
        }
      });
      alert("Created: " + data.createEmployee.name);
      fetch();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div>
      <div className="controls">
        <div>
          <button onClick={() => setView(view === "grid" ? "tiles" : "grid")}>
            Toggle view ({view})
          </button>
          {user.role === "ADMIN" && <button onClick={createTest}>Create sample employee</button>}
        </div>
        <div>
          <label>Sort: </label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="createdAt">Created</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="attendance">Attendance</option>
          </select>
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value as any)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid">
          {/* 10-column presentation simulated via CSS grid (responsive) */}
          {items.map((emp) => (
            <div key={emp.id} className="grid-item" onClick={() => openEmployee(emp.id)}>
              <div className="grid-id">{emp.id}</div>
              <div className="grid-name">{emp.name}</div>
              <div className="grid-email">{emp.email}</div>
              <div className="grid-age">{emp.age}</div>
              <div className="grid-class">{emp.class}</div>
              <div className="grid-subjects">{emp.subjects.join(", ")}</div>
              <div className="grid-att">{emp.attendance}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tiles">
          {items.map((emp) => (
            <div key={emp.id} className="tile">
              <div className="tile-header">
                <div>{emp.name}</div>
                <div className="bun">
                  <button onClick={(e) => { e.stopPropagation(); const opt = prompt("Options: edit/flag/delete"); alert("Selected: " + opt); }}>⋮</button>
                </div>
              </div>
              <div className="tile-body" onClick={() => openEmployee(emp.id)}>
                <div>{emp.email}</div>
                <div>{emp.class}</div>
                <div>Attendance: {emp.attendance}%</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span> Page {page + 1} of {Math.ceil(total / perPage) || 1} (Total: {total})</span>
        <button disabled={(page + 1) * perPage >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-inner">
            <button className="close" onClick={() => setSelected(null)}>Back</button>
            <h3>{selected.name}</h3>
            <div>Email: {selected.email}</div>
            <div>Age: {selected.age}</div>
            <div>Class: {selected.class}</div>
            <div>Subjects: {selected.subjects.join(", ")}</div>
            <div>Attendance: {selected.attendance}%</div>
          </div>
        </div>
      )}
    </div>
  );
}