"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "../ui/badge";
import { ChevronDown, Mail, ShieldCheck } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function UserProfile() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="
              flex items-center gap-3
              rounded-xl
              border
              bg-background
              px-2 py-2
              shadow-sm
              transition-all
              hover:bg-muted/50
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-ring
              focus:ring-offset-2
            "
          >
            <Avatar className="size-9 border">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Shrey Sadhukhan"
              />
              <AvatarFallback className="font-semibold">SS</AvatarFallback>
            </Avatar>

            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-32 truncate text-sm font-semibold">
                Shrey Sadhukhan
              </p>
            </div>

            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        }
      />

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 rounded-xl p-0"
      >
        {/* Account information */}
        <PopoverHeader className="space-y-3 p-4">
          <PopoverTitle className="text-sm">Account Information</PopoverTitle>

          <PopoverDescription
            render={
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Mail className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">shrey@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <ShieldCheck className="size-4" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                    </div>

                    <Badge variant="secondary">Admin</Badge>
                  </div>
                </div>
              </div>
            }
          />
        </PopoverHeader>

        <footer className="border-t w-full p-4 flex flex-row gap-2">
          <LogoutButton />
        </footer>
      </PopoverContent>
    </Popover>
  );
}
