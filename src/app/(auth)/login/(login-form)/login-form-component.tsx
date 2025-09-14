"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "@/lib/interfaces/auth";
import { LoginSchema } from "@/lib/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputContainer from "@/components/reusable/form-input-container";
import { useLoginMutation } from "@/lib/queries/auth-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { setCookiesAction } from "@/actions/cookie";

const LoginFormComponent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });
  const navigate = useRouter();
  const { mutateAsync } = useLoginMutation({
    onSuccess: (res) => {
      setCookiesAction(res);
      navigate.replace(ROUTE_PATH.HOME);
    },
    onError: (error) => {
      toast.error("Login failed");
      console.error("Login failed", error);
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (data: LoginForm) => {
    await mutateAsync(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col gap-2"
    >
      <FormInputContainer
        control={control}
        errors={errors}
        vertialAlign
        label="Email"
        name="email"
        required
        render={({ field }) => (
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            onChange={field.onChange}
          />
        )}
      />

      <FormInputContainer
        control={control}
        errors={errors}
        vertialAlign
        label="Password"
        name="password"
        required
        endfixIcon={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        }
        render={({ field }) => (
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={field.onChange}
            required
          />
        )}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button disabled={!isValid} type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
};

export default LoginFormComponent;
