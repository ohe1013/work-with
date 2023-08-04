/** @type {import('tailwindcss').Config} */
export default {
    mode: "",
    content: ["./src/**/*.{js,jsx,tsx,ts}"],
    theme: {
        extend: {
            minHeight: {
                "3/4": "85vh",
            },
            animation: {
                bounce200: "bounce 1s infinite 200ms",
                bounce400: "bounce 1s infinite 400ms",
            },
        },
    },
    plugins: [],
};
