import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
// https://astro.build/config

export default defineConfig({
  site: "https://taylorv.com", // "https://tayv.github.io",
  // base: "/homebase",  // https://docs.astro.build/en/guides/deploy/github/#base leave out since using a custom domain
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
})
