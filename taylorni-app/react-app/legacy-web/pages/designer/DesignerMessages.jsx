// src/pages/designer/DesignerMessages.jsx
import { Link } from "react-router-dom";

const DesignerMessages = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Link
          to="/designer"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Overview
        </Link>
      </div>
      <p className="text-gray-600">Your client messages will appear here.</p>
    </div>
  );
};

export default DesignerMessages;
