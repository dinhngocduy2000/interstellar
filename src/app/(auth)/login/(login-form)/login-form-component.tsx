"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { setCookiesAction } from "@/actions/cookie";
import FormInputContainer from "@/components/reusable/form-input-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE_PATH } from "@/lib/enum/route-path";
import { LoginForm } from "@/lib/interfaces/auth";
import { AxiosErrorPayload } from "@/lib/interfaces/utils";
import { useLoginMutation } from "@/lib/queries/auth-query";
import { LoginSchema } from "@/lib/schemas/login-schema";
import { getErrorMessage } from "@/lib/utils";

const LoginFormComponent = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(LoginSchema),
		mode: "onChange",
		defaultValues: {
			saveSession: false,
		},
	});
	const navigate = useRouter();
	const { mutateAsync } = useLoginMutation({
		onSuccess: (res, data) => {
			setCookiesAction({ ...res, saveSession: data.saveSession });
			navigate.replace(ROUTE_PATH.HOME);
		},
		onError: (error) => {
			const axiosError = error as AxiosError<AxiosErrorPayload>;
			toast.error(getErrorMessage(axiosError));
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
					<FormInputContainer
						control={control}
						name="saveSession"
						label={"Remember me"}
						errors={errors}
						render={({ field }) => (
							<Input
								id="saveSession"
								type="checkbox"
								defaultChecked={field.value as boolean}
								className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
								onChange={(e) => field.onChange(e.target.checked)}
							/>
						)}
						containerClassName="flex-row-reverse items-start"
					/>
				</div>
				<Link
					href="/auth/forgot-password"
					className="text-sm text-primary hover:underline"
				>
					Forgot password?
				</Link>
			</div>

			<Button
				loading={isSubmitting}
				disabled={!isValid}
				type="submit"
				className="w-full"
			>
				Sign in
			</Button>
		</form>
	);
};

export default LoginFormComponent;
