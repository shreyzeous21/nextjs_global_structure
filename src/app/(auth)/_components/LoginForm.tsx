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
    <Card className="w-full max-w-md border-white/20 bg-white/70 shadow-2xl shadow-black/5 backdrop-blur-xl rounded-3xl">
      <CardHeader className="items-center space-y-4 pb-2 pt-8">
        <div className="rounded-2xl bg-white p-3 shadow-lg shadow-black/5">
          <Image
            src="/blueconnectsLogo.png"
            alt="BlueConnects Logo"
            width={140}
            height={140}
            priority
          />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Sign In to your Account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-8 pt-6 pb-2">
        <FieldSet>
          <FieldGroup>
            <Field>
              <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-11 rounded-xl border-gray-200/80 bg-white/60 text-sm placeholder:text-gray-400 focus:border-[#00D2FF] focus:ring-[#00D2FF]/20 focus:ring-2"
              />
            </Field>

            <Field>
              <Label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 rounded-xl border-gray-200/80 bg-white/60 pr-10 text-sm placeholder:text-gray-400 focus:border-[#00D2FF] focus:ring-[#00D2FF]/20 focus:ring-2"
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
                    rounded-r-xl
                    text-gray-400
                    transition-colors
                    hover:text-gray-600
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

      <CardFooter className="px-8 pb-8 pt-2">
        <Button
          type="button"
          variant="default"
          className="h-11 w-full rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#3A86FF] text-sm font-semibold text-white shadow-lg shadow-[#00D2FF]/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00D2FF]/30"
          onClick={handleLogin}
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
