/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.astro"],
  theme: {},
  plugins: [
    function addBlogPostStyles({ addComponents }) {
      addComponents({
        ".markdown-content": {
          color: "#4a5568", // gray-700
          h1: {
            color: "#7f1d1d", // Use the hex value for red-900
            fontSize: "2.25rem",
          },
          p: {
            marginBottom: "1.5em",
          },
          blockquote: {
            fontStyle: "italic",
            borderLeft: "4px solid #a0aec0", // gray-500
            paddingLeft: "1em",
          },
          code: {
            backgroundColor: "#edf2f7", // gray-100
            padding: "0.2em 0.4em",
            borderRadius: "4px",
          },
        },
      })
    },
  ],
}
