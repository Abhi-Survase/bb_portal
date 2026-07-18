import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Toaster } from "@/components/ui/sonner";

export default function Login_Signup_Page({ children }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: "var(--primary)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-40 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "var(--chart-4)" }}
      />

      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        {children}
        <Toaster />
      </div>
    </div>
  );
}
