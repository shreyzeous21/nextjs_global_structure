"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      toast.success("Login Successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="text-center text-xl font-bold">
          Sign In to your Account
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <FieldSet>
          <FieldGroup>
            <Field>
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
              />
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-full
                    w-10
                    items-center
                    justify-center
                    rounded-r-md
                    text-muted-foreground
                    transition-colors
                    hover:text-foreground
                    focus:outline-none
                  "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          variant="default"
          className="w-full"
          onClick={handleLogin}
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
