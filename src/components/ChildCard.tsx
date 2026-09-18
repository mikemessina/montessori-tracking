import { Link } from "react-router-dom";
import type { Child } from "../types";

interface Props {
  child: Child;
}

export function ChildCard({ child }: Props) {
  return (
    <Link to={`/child/${child.id}`} className="child-card">
      <div className="child-card-avatar" aria-hidden="true">
        {child.firstName[0]}
        {child.lastName[0]}
      </div>
      <div className="child-card-name">
        {child.firstName} {child.lastName}
      </div>
    </Link>
  );
}
