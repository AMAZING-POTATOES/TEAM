/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT:"#39A45A", 50:"#F1FAF4", 100:"#DFF3E5", 200:"#BDE6CB", 300:"#8CD3A6", 400:"#5FBE84", 500:"#39A45A", 600:"#2F8B4B", 700:"#246C3A", 800:"#1C532E", 900:"#143C22" }
      },
      boxShadow: { soft:"0 8px 24px rgba(0,0,0,0.08)" },
      borderRadius: { xl2:"1.25rem" }
    },
  },
  plugins: [],
}
