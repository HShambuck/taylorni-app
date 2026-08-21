// src/pages/designer/DesignerCustomOrderNew.jsx
import { Link } from "react-router-dom";

const DesignerCustomOrderNew = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Custom Order</h1>
        <Link
          to="/designer/orders"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Orders
        </Link>
      </div>
      <p className="text-gray-600">Start a new custom order workflow.</p>
    </div>
  );
};

export default DesignerCustomOrderNew;
