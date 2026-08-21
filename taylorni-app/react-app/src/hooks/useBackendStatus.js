import { useEffect, useState } from "react";
import { checkBackendHealth, getBackendBaseUrl } from "../services/backend";

export default function useBackendStatus() {
  const [status, setStatus] = useState({
    loading: true,
    online: false,
    url: getBackendBaseUrl(),
  });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const result = await checkBackendHealth();
      if (!mounted) {
        return;
      }

      setStatus({
        loading: false,
        online: result.ok,
        url: getBackendBaseUrl(),
      });
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return status;
}
