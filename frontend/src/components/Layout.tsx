import React, { useState } from "react";

export default function Layout({ children, onLogout, user }: any) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [horizontalSelected, setHorizontalSelected] = useState("Employees");

  return (
    <div>
      <header className="header">
        <div className="hamburger" onClick={() => setHamburgerOpen(!hamburgerOpen)}>
          ☰
        </div>
        <div className="top-title">Employee POC</div>
        <div className="top-right">
          <span style={{ marginRight: 12 }}>{user.email} ({user.role})</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      {hamburgerOpen && (
        <nav className="hamburger-menu">
          <ul>
            <li>Dashboard</li>
            <li>
              Manage
              <ul className="sub-menu">
                <li>Employees</li>
                <li>Reports</li>
              </ul>
            </li>
            <li>Settings</li>
          </ul>
        </nav>
      )}

      <nav className="horizontal-menu">
        {["Employees", "Reports", "Settings"].map((m) => (
          <div key={m} className={`h-item ${horizontalSelected === m ? "active" : ""}`} onClick={() => setHorizontalSelected(m)}>
            {m}
          </div>
        ))}
      </nav>

      <main className="main">{children}</main>
    </div>
  );
}