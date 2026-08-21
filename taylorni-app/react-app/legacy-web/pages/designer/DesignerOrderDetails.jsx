// src/pages/designer/DesignerOrderDetails.jsx
import { useParams, Link } from "react-router-dom";

const DesignerOrderDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link
          to="/designer/orders"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Orders
        </Link>
      </div>
      <p className="text-gray-600">Viewing order: {id}</p>
    </div>
  );
};

export default DesignerOrderDetails;
