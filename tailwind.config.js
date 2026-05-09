/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // AppTheme.colors mapping
        bg: "#EEEEE0",
        card: "#FFFFFF",
        dark: "#1A1A1A",
        gray: "#666666",
        "light-gray": "#B0ADA0",
        accent: "#C6FF4D",
        border: "#E0DDD0",
        danger: "#E53E3E",
        "danger-bg": "#FFE4E4",
        "info-row-bg": "#D9E8A0",
        blue: "#2196F3",
        orange: "#FF9800",
      },
      spacing: {
        // AppTheme.spacing mapping
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      borderRadius: {
        // AppTheme.borderRadius mapping
        sm: 6,
        md: 12,
        lg: 16,
        xl: 24,
        full: 999,
      },
      fontSize: {
        // AppTheme.typography mapping
        heading: [28, { fontWeight: "700" }],
        subheading: [20, { fontWeight: "700" }],
        body: [14, { fontWeight: "400" }],
        caption: [12, { fontWeight: "400" }],
        label: [13, { fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
