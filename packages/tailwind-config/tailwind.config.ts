import { Config } from "tailwindcss";

const config: Config = {

    content: ["./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/ui/**/*.{js,ts,jsx,tsx}",
        "../../apps/**/*.{js,ts,jsx,tsx}"
    ]

}

export default config; 