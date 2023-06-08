/** @type {import('tailwindcss').Config} */
export default {
    mode: "",
    content: ["./src/**/*.{js,jsx,tsx,ts}"],
    theme: {
        extend: {
            minHeight: {
                "3/4": "85vh",
            },
        },
    },
    plugins: [],
};
