module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#e6f0ff',
          300: '#7fb0ff',
          500: '#2B6DE6',
          600: '#245fcf',
          700: '#1d4fb1'
        },
        ui: {
          bg: '#F6F9FC',
          surface: '#FFFFFF',
          border: '#E6EEF6',
          muted: '#445566',
          accent: '#10263B'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(16, 38, 59, 0.06)',
        card: '0 4px 10px rgba(16, 38, 59, 0.04)'
      },
      borderRadius: {
        lg2: '12px'
      }
    }
  },
  plugins: []
};