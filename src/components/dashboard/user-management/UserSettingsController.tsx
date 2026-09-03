"use client";

import Link from "next/link";
import {
  Building2,
  ChevronRight,
  FolderCog,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserSettingsController() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Settings2 className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-2">
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/user-management/admin?view=admin-user"
                className="flex w-full items-center gap-3"
              >
                <Building2 className="size-4 text-muted-foreground" />
                <span>Admin User</span>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            }
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/user-management/company?view=company-user"
                className="flex w-full items-center gap-3"
              >
                <Building2 className="size-4 text-muted-foreground" />
                <span>Company User</span>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            }
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/user-management/vendor?view=vendor-user"
                className="flex w-full items-center gap-3"
              >
                <Building2 className="size-4 text-muted-foreground" />
                <span>Vendor User</span>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
