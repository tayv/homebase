import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
// https://astro.build/config

export default defineConfig({
  site: "https://taylorv.com", // "https://tayv.github.io",
  // base: "/homebase",  // https://docs.astro.build/en/guides/deploy/github/#base leave out since using a custom domain
  integrations: [react(), tailwind(), mdx()],
})
