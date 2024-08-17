/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        fontFamily: {
            'bahnschrift': 'Bahnschrift'
        },
        extend: {
            colors: {
                'ob-gray': '#333333',
                'ob-light': '#666666'
            },
            spacing: {
                "480px": "480px",
                "18": "72px",
            }
        },
    },
    plugins: [],
}