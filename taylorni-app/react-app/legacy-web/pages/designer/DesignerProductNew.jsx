// src/pages/designer/DesignerProductNew.jsx
import { Link } from "react-router-dom";

const DesignerProductNew = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Product</h1>
        <Link
          to="/designer/products"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Products
        </Link>
      </div>
      <p className="text-gray-600">Create a new product here.</p>
    </div>
  );
};

export default DesignerProductNew;
