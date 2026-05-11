export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#080914",
        panel: "#111322",
        line: "rgba(255,255,255,0.12)",
        violet: "#8b5cf6",
        electric: "#38bdf8",
        rose: "#f472b6"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(139,92,246,0.24)",
        card: "0 16px 44px rgba(0,0,0,0.32)"
      }
    }
  },
  plugins: []
};
