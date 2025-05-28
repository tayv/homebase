/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        recursive: ["Recursive", "sans-serif"],
      },
      backgroundImage: {
        scanlines:
          "linear-gradient(rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 50%)",
      },
      backgroundSize: {
        scanlines: "100% 2px",
      },
    },
  },
  plugins: [
    function addBaseStyles({ addBase }) {
      addBase({
        "html, body": {
          margin: "0",
          padding: "0",
          width: "100%",
          overflowX: "hidden",
        },
        li: {
          listStyleType: "none",
          position: "relative",
          paddingLeft: "1.5em",
          marginBottom: "0.5em",
          "&:before": {
            content: "'>'",
            position: "absolute",
            left: "0",
            color: "#ffffff",
            fontWeight: "bold",
            transform: "scaleX(0.7)",
          },
        },
      })
    },
    function addBlogPostStyles({ addComponents }) {
      addComponents({
        ".generic-link": {
          textDecoration: "underline",
          textUnderlineOffset: "4px",
          "&:hover": {
            color: "#93c5fd", // Bright blue-300 that's very visible on dark backgrounds
            cursor: "pointer",
          },
        },
        ".no-bullet-list": {
          listStyle: "none",
          "& > li": {
            paddingLeft: "0",
            "&::before": {
              content: "none",
            },
          },
        },
        ".markdown-content": {
          // color: "#4a5568", // gray-700
          h1: {
            // color: "#4a5568",
            fontSize: "2.25rem",
          },
          h2: {
            fontSize: "1.75rem",
          },
          h3: {
            fontSize: "1.5rem",
          },
          h4: {
            fontSize: "1.25rem",
          },
          p: {
            marginBottom: "1.5em",
            lineHeight: "1.65",
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
          a: {
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            "&:hover": {
              color: "#4f46e5", // indigo-600 on hover
              cursor: "pointer",
            },
          },
        },
      })
    },
  ],
}
