// components/common/GlobalDeleteButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

interface GlobalDeleteButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
  itemName?: string;
  itemId?: string | number;
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showIcon?: boolean;
  disabled?: boolean;
}

export function GlobalDeleteButton({
  onDelete,
  isDeleting = false,
  itemName = "this item",
  itemId,
  variant = "destructive",
  size = "default",
  className = "",
  dialogTitle = "Are you sure?",
  dialogDescription,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  showIcon = true,
  disabled = false,
}: GlobalDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  const defaultDescription =
    dialogDescription ||
    `This action cannot be undone. This will permanently delete ${itemName}${itemId ? ` (ID: ${itemId})` : ""}.`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={variant}
            size={size}
            className={className}
            disabled={disabled || isDeleting}
          >
            {showIcon && <Trash2 className="h-4 w-4" />}
            {size !== "icon" && "Delete"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{defaultDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 ">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            {cancelButtonText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
