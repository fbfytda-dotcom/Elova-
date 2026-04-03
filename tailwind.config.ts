import type { Config } from "tailwindcss";
export default {
darkMode: ["class"],
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
prefix: "",
theme: {
container: {
center: true,
padding: "2rem",
screens: {
"2xl": "1400px",
},
},
extend: {
fontFamily: {
sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
},
colors: {
border: "hsl(var(--border))",
input: "hsl(var(--input))",
ring: "hsl(var(--ring))",
background: "hsl(var(--background))",
foreground: "hsl(var(--foreground))",
primary: {
DEFAULT: "hsl(var(--primary))",
foreground: "hsl(var(--primary-foreground))",
},
secondary: {
DEFAULT: "hsl(var(--secondary))",
foreground: "hsl(var(--secondary-foreground))",
},
destructive: {
DEFAULT: "hsl(var(--destructive))",
foreground: "hsl(var(--destructive-foreground))",
},
muted: {
DEFAULT: "hsl(var(--muted))",
foreground: "hsl(var(--muted-foreground))",
},
accent: {
DEFAULT: "hsl(var(--accent))",
foreground: "hsl(var(--accent-foreground))",
},
popover: {
DEFAULT: "hsl(var(--popover))",
foreground: "hsl(var(--popover-foreground))",
},
card: {
DEFAULT: "hsl(var(--card))",
foreground: "hsl(var(--card-foreground))",
},
sidebar: {
DEFAULT: "hsl(var(--sidebar-background))",
foreground: "hsl(var(--sidebar-foreground))",
primary: "hsl(var(--sidebar-primary))",
"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
accent: "hsl(var(--sidebar-accent))",
"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
border: "hsl(var(--sidebar-border))",
ring: "hsl(var(--sidebar-ring))",
},
violet: {
DEFAULT: "#7C3AED",
glow: "#A855F7",
},
cyan: {
DEFAULT: "#06B6D4",
glow: "#22D3EE",
},
space: {
DEFAULT: "#0B0F19",
light: "#131825",
lighter: "#1A2035",
},
level: {
a1: "hsl(var(--level-a1))",

a2: "hsl(var(--level-a2))",
b1: "hsl(var(--level-b1))",
b2: "hsl(var(--level-b2))",
c1: "hsl(var(--level-c1))",
c2: "hsl(var(--level-c2))",
},
},
borderRadius: {
lg: "var(--radius)",
md: "calc(var(--radius) - 2px)",
sm: "calc(var(--radius) - 4px)",
},
keyframes: {
"accordion-down": {
from: { height: "0" },
to: { height: "var(--radix-accordion-content-height)" },
},
"accordion-up": {
from: { height: "var(--radix-accordion-content-height)" },
to: { height: "0" },
},
"fade-in": {
"0%": { opacity: "0", transform: "translateY(10px)" },
"100%": { opacity: "1", transform: "translateY(0)" },
},
"slide-in-right": {
"0%": { transform: "translateX(100%)", opacity: "0" },
"100%": { transform: "translateX(0)", opacity: "1" },
},
"float": {
"0%, 100%": { transform: "translateY(0)" },
"50%": { transform: "translateY(-10px)" },
},
"ping-slow": {
"75%, 100%": { transform: "scale(2)", opacity: "0" },
},
},
animation: {
"accordion-down": "accordion-down 0.2s ease-out",
"accordion-up": "accordion-up 0.2s ease-out",
"fade-in": "fade-in 0.4s ease-out",
"slide-in-right": "slide-in-right 0.3s ease-out",
"float": "float 3s ease-in-out infinite",
"ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
},
},
},
plugins: [require("tailwindcss-animate")],
} satisfies Config;