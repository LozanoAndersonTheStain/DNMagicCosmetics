import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "50dn": "#FFF0F9",
        "100dn": "#FFE4F5",
        "200dn": "#FFC9EC",
        "300dn": "#FF9CDB",
        "400dn": "#FF5FC1",
        "500dn": "#FF31A8",
        "600dn": "#F51486",
        "700dn": "#D60068",
        "800dn": "#B00454",
        "900dn": "#920949",
        "950dn": "#5a0028",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      keyframes: {
        textReveal: {
          "0%": { strokeDashoffset: "100" },
          "50%": { fill: "transparent" },
          "80%": { strokeDashoffset: "0", stroke: "black" },
          "100%": { fill: "black", strokeDashoffset: "0", stroke: "black" },
        },
      },
      animation: {
        "text-reveal": "textReveal 8s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
