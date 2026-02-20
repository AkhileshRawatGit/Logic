import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                foreground: "#ffffff",
                primary: {
                    DEFAULT: "#00f2ff", // Cyber Cyan
                    glow: "rgba(0, 242, 255, 0.5)",
                },
                secondary: {
                    DEFAULT: "#7000ff", // Electric Purple
                    glow: "rgba(112, 0, 255, 0.5)",
                },
                accent: "#f8fafc",
                dark: {
                    100: "#0a0a0a",
                    200: "#111111",
                    300: "#1a1a1a",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                mono: ["var(--font-space-grotesk)", "monospace"],
            },
            backgroundImage: {
                "noise": "url('/noise.png')",
                "grid-pattern": "linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.8' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
