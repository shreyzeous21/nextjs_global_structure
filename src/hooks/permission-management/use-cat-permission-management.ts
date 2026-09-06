"use client";

import {
  addCategoryList,
  deleteCategoryList,
  getCategoryList,
  updateCategoryList,
} from "@/actions/permission-management/pm-cat-action";

import type { CategoryInput } from "@/types/pm-types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

const QUERY_KEY = ["categoryList"];

export const useCatPermissionManagement = () => {
  const queryClient = useQueryClient();

  const {
    data: categoryList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCategoryList,
  });

  const addMutation = useMutation({
    mutationFn: addCategoryList,

    onSuccess: () => {
      toast.success("Category added successfully");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: CategoryInput }) => {
      return updateCategoryList(id, input);
    },

    onSuccess: () => {
      toast.success("Category updated successfully");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteCategoryList(id);
    },

    onSuccess: () => {
      toast.success("Category deleted successfully");

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    categoryList,
    isLoading,
    isError,
    addMutation,
    updateMutation,
    deleteMutation,
  };
};
