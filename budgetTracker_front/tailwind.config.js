/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // This is the critical line: it tells Tailwind to scan
        // all HTML and TypeScript files in your src directory.
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            screens: {
                // Adds a new 'laptop' breakpoint at 1024px
                'laptop': '1250px',
            },
        },
    },
    plugins: [],
}

/* screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }, */