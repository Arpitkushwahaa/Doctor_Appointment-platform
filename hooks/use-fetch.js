import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      
      // Check if response contains an error
      if (response && response.error && !response.success) {
        setError(new Error(response.error));
        toast.error(response.error);
      } else {
        setError(null);
      }
    } catch (error) {
      const errorMessage = error?.message || "An unexpected error occurred";
      const errorObj = new Error(errorMessage);
      setError(errorObj);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
