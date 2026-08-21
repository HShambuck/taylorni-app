// src/pages/designer/DesignerOrderNew.jsx
import { Link } from "react-router-dom";

const DesignerOrderNew = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Order</h1>
        <Link
          to="/designer/orders"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Orders
        </Link>
      </div>
      <p className="text-gray-600">Create a new order for a client.</p>
    </div>
  );
};

export default DesignerOrderNew;
