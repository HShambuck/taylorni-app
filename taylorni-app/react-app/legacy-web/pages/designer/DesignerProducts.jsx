// src/pages/designer/DesignerProducts.jsx
import { Link } from "react-router-dom";

const DesignerProducts = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/designer/products/new"
          className="rounded-md bg-amber-500 px-4 py-2 text-white"
        >
          New Product
        </Link>
      </div>
      <p className="text-gray-600">Your product catalog will appear here.</p>
    </div>
  );
};

export default DesignerProducts;
