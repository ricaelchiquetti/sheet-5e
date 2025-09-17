/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Diz ao Tailwind para olhar todos os arquivos dentro da pasta src
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // Ativa o plugin para estilizar checkboxes e outros formulários
  ],
}