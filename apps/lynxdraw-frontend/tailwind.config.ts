import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Config = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./draw/**/*.{js,ts,jsx,tsx}"],
    presets: [sharedConfig]
}

export default config; 