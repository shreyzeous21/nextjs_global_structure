"use client";

import { getVendorList } from "@/actions/get-use-action";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const {
    data: vendorList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["vendorList"],
    queryFn: () => getVendorList(),
  });

  return {
    vendorList,
    isLoading,
    isError,
    error,
  };
};
