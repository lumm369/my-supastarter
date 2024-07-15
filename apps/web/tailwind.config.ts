import baseConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  presets: [baseConfig],
  content: ["./app/**/*.tsx", "./modules/**/*.tsx"],
  safelist: ["ml-2", "ml-4", "ml-6", "ml-8", "ml-10"],
} satisfies Config;
