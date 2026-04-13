import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  return (
    <div
      className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark:brightness-[0.9] dark:bg-accent"
      style={{
        backgroundImage: "url('/t_bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
        <Toaster />
      </div>
    </div>
  );
}
