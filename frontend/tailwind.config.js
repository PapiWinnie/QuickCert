// tailwind.config.js
export default {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
        },
        screens: {
          'xs': '475px',
        },
      },
    },
    plugins: [],
  };
  