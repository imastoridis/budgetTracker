/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // This is the critical line: it tells Tailwind to scan
        // all HTML and TypeScript files in your src directory.
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}