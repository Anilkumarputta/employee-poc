import React, { useEffect, useState } from "react";
import { client, GET_EMPLOYEES, CREATE_EMPLOYEE } from "./api";

type Employee = {
  id: number;
  name: string;
  email: string;
  position?: string;
  salary?: number;
  createdAt: string;
};

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    salary: ""
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await client.request(GET_EMPLOYEES);
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const variables = {
        input: {
          name: form.name,
          email: form.email,
          position: form.position || null,
          salary: form.salary ? Number(form.salary) : null
        }
      };
      const data = await client.request(CREATE_EMPLOYEE, variables);
      setEmployees((prev) => [...prev, data.createEmployee]);
      setForm({ name: "", email: "", position: "", salary: "" });
    } catch (err) {
      console.error("Failed to create employee", err);
    }
  };

  return (
    <div className="container">
      <h1>Employee POC</h1>

      <section style={{ marginBottom: 20 }}>
        <h2>Create Employee</h2>
        <form onSubmit={onSubmit}>
          <div>
            <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <input name="position" placeholder="Position" value={form.position} onChange={onChange} />
          </div>
          <div>
            <input name="salary" placeholder="Salary" type="number" value={form.salary} onChange={onChange} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Create</button>
          </div>
        </form>
      </section>

      <section>
        <h2>Employees</h2>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>ID</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Email</th>
                <th style={{ textAlign: "left" }}>Position</th>
                <th style={{ textAlign: "left" }}>Salary</th>
                <th style={{ textAlign: "left" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.position || "-"}</td>
                  <td>{emp.salary ?? "-"}</td>
                  <td>{new Date(emp.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
