"use client";

import {
  deletePermission,
  getPermissionList,
} from "@/actions/permission-management/pm-action";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const QUERY_KEY = ["permissionList"];

export const usePermissionManagement = () => {
  const queryClient = useQueryClient();

  const {
    data: permissionList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPermissionList,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deletePermission(id);
    },
    onSuccess: () => {
      toast.success("Permission deleted successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    permissionList,
    isLoading,
    isError,
    deleteMutation,
  };
};
