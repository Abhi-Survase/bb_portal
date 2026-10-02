import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

import axios from "axios";
import { useTransitionNavigate } from "@/hooks/use-transition-navigate";

const signupFormSchema = z
  .object({
    email_id: z.string().min(4, { message: "Enter valid email" }),
    password: z.string().min(8, { message: "Minimum 8 characters" }),
    confirm_password: z.string().min(8, { message: "Minimum 8 characters" }),
    // .regex(/[a-z]/, { message: "At least one lowercase letter required" })
    // .regex(/[A-Z]/, { message: "At least one uppercase letter required" })
    // .regex(/[0-9]/, { message: "At least one number required" })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "At least one special character required",
    // }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // Sets the error path
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmit, setSubmit] = React.useState(false);
  type signupFormValues = z.infer<typeof signupFormSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signupFormValues>({
    resolver: zodResolver(signupFormSchema),
  });
  let navigate = useNavigate();
  const transitionNavigate = useTransitionNavigate();

  async function onSubmitForm(signupData: signupFormValues) {
    setSubmit(true);
    try {
      const apiURL = import.meta.env.VITE_SIGNUP_API;
      // console.log(signupData);
      const response = await axios.post(apiURL, signupData);
      console.log(response.data);
      toast.success(response.data.message);
      reset();
      setSubmit(false);
      setTimeout(() => {
        navigate(`/${import.meta.env.VITE_LOGIN_URL}`);
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message || "An error occurred with the request";

        toast.error(backendMessage);
      }
      // console.log(error.response);
      setSubmit(false);
    }
    // console.log(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmitForm)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome User</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up to Blossom Book Portal
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">
                  Email
                  {errors?.email_id && (
                    <span className="text-xs text-destructive">
                      {errors.email_id.message}
                    </span>
                  )}
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="sameer@email.com"
                  {...register("email_id")}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">
                    Password
                    {errors?.password && (
                      <span className="text-xs text-destructive">
                        {errors.password.message}
                      </span>
                    )}
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirm_password">
                    Confirm Password
                    {errors?.confirm_password && (
                      <span className="text-xs text-destructive">
                        {errors.confirm_password.message}
                      </span>
                    )}
                  </FieldLabel>
                </div>
                <Input
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirm_password")}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">
                  {isSubmit ? <Spinner /> : "Submit"}
                </Button>
              </Field>
              <FieldSeparator className="mt-1"></FieldSeparator>
              <FieldDescription className="mb-1 text-center">
                Already have an account?{" "}
                <Link
                  to={`/${import.meta.env.VITE_LOGIN_URL}`}
                  onClick={(e) => {
                    if (
                      e.defaultPrevented ||
                      e.button !== 0 ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.altKey
                    ) {
                      return;
                    }
                    e.preventDefault();
                    transitionNavigate(`/${import.meta.env.VITE_LOGIN_URL}`);
                  }}
                >
                  Login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block">
            <img
              src="/t_login.webp"
              alt="Welcome"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-foreground/85">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
