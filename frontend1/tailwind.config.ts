import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#e2e8f0',
        paper: '#f8fafc',
        ember: '#f97316',
        teal: '#0f766e',
      },
      boxShadow: {
        card: '0 14px 35px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
