// src/pages/designer/DesignerProductDetails.jsx
import { useParams, Link } from "react-router-dom";

const DesignerProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <Link
          to="/designer/products"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Products
        </Link>
      </div>
      <p className="text-gray-600">Viewing product: {id}</p>
    </div>
  );
};

export default DesignerProductDetails;
