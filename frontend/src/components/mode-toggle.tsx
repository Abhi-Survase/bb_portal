import { Moon, Sun } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Toggle
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Dark Mode"
    >
      <Moon />
    </Toggle>
  );
}
