"use client";

import { getApiMaster } from "@/actions/vendor-settings/api-master-action";
import { useQuery } from "@tanstack/react-query";

export const useApiMaster = () => {
  const {
    data: apis = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["apiMaster"],
    queryFn: () => getApiMaster(),
  });

  return {
    apis,
    isLoading,
    isError,
    error,
  };
};
