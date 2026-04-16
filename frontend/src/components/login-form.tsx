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
import { Link } from "react-router";

import axios from "axios";

const loginFormSchema = z.object({
  email_id: z.string().min(4, { message: "Email or Username" }),
  password: z.string().min(8, { message: "Minimum 8 characters" }),
  // .regex(/[a-z]/, { message: "At least one lowercase letter required" })
  // .regex(/[A-Z]/, { message: "At least one uppercase letter required" })
  // .regex(/[0-9]/, { message: "At least one number required" })
  // .regex(/[^a-zA-Z0-9]/, {
  //   message: "At least one special character required",
  // }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmit, setSubmit] = React.useState(false);
  type loginFormValues = z.infer<typeof loginFormSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmitForm(loginData: loginFormValues) {
    setSubmit(true);
    try {
      const apiURL = import.meta.env.VITE_LOGIN_API;
      const response = await axios.post(apiURL, loginData);
      console.log(response.data);
      toast.success(response.data.message);
      setSubmit(false);
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
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to Blossom Book Portal
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">
                  Email
                  {errors?.email_id && (
                    <span className="text-xs text-red-600">
                      {errors.email_id.message}
                    </span>
                  )}
                </FieldLabel>

                <Input
                  id="email"
                  type="text"
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
                      <span className="text-xs text-red-600">
                        {errors.password.message}
                      </span>
                    )}
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
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
                <Button type="submit">
                  {isSubmit ? <Spinner /> : "Login"}
                </Button>
              </Field>
              <FieldSeparator className="mt-1"></FieldSeparator>
              <FieldDescription className="mb-1 text-center">
                Don&apos;t have an account?{" "}
                <Link to={`/${import.meta.env.VITE_SIGNUP_URL}`}>Sign up</Link>
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
      <FieldDescription className="px-6 text-center text-foreground/85 dark:text-background/85">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
