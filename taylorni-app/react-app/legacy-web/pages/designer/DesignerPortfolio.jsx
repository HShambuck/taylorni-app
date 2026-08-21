// src/pages/designer/DesignerPortfolio.jsx
import { Link } from "react-router-dom";

const DesignerPortfolio = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Link
          to="/designer"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Overview
        </Link>
      </div>
      <p className="text-gray-600">Showcase your best work here.</p>
    </div>
  );
};

export default DesignerPortfolio;
