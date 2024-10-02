// https://docs.astro.build/en/guides/content-collections/#defining-collections
import { z, defineCollection } from "astro:content"

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.date(),
    isDraft: z.boolean().default(false),
  }),
})
// Potential future collections
// const newsletterCollection = defineCollection({
//   type: "content",
//   schema: z.object({
//     /* ... */
//   }),
// })
// const portfolioCollection = defineCollection({
//   type: "data",
//   schema: z.object({
//     /* ... */
//   }),
// })

export const collections = {
  blog: blogCollection,
  // newsletter: newsletterCollection,
  // portfolio: portfolioCollection,
}
