// src/pages/designer/DesignerMessageThread.jsx
import { useParams, Link } from "react-router-dom";

const DesignerMessageThread = () => {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Message Thread</h1>
        <Link
          to="/designer/messages"
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          Back to Messages
        </Link>
      </div>
      <p className="text-gray-600">Thread with client: {id}</p>
    </div>
  );
};

export default DesignerMessageThread;
