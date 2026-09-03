"use client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <Button
      variant={"destructive"}
      onClick={handleLogout}
      className="flex items-center gap-2 w-auto"
    >
      <LogOutIcon /> Logout
    </Button>
  );
}
