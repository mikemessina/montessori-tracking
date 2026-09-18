import { useMemo, useState } from "react";
import { useChildren } from "../hooks/useCollections";
import { ChildCard } from "../components/ChildCard";
import { AddChildModal } from "../components/AddChildModal";

export function RosterPage() {
  const children = useChildren();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = children.filter((c) => c.active);
    if (!term) return list;
    return list.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(term)
    );
  }, [children, search]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Children</h1>
        <div className="page-header-actions">
          <input
            className="search-input"
            placeholder="Search children…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Child
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <p className="empty-state">
          {children.length === 0
            ? "No children yet. Add your first child to get started."
            : "No children match your search."}
        </p>
      ) : (
        <div className="child-grid">
          {filtered.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}

      {showAdd && <AddChildModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
