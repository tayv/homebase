"use client"

import { motion, useAnimation } from "framer-motion"
import type { Variants } from "framer-motion"
import React from "react"

interface ChevronsDownProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number
  height?: number
  strokeWidth?: number
  stroke?: string
  scrollTargetSelector?: string
}

const chevronVariants: Variants = {
  normal: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  animate: {
    y: [4, 0],
    opacity: [0.3, 1],
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  bounce: {
    scale: [1, 1.2, 0.95, 1.1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.5, 0.8, 1],
      ease: "easeOut",
    },
  },
}

const ChevronsDown = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  scrollTargetSelector = "section:nth-of-type(2)",
  ...svgProps
}: ChevronsDownProps) => {
  const controls = useAnimation()

  React.useEffect(() => {
    controls.start("animate").then(() => {
      setTimeout(() => controls.start("normal"), 600)
    })
  }, [])

  const handleClick = () => {
    const section = document.querySelector(scrollTargetSelector)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <button
      type="button"
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        outline: "none",
      }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      onClick={handleClick}
      aria-label="Scroll to next section"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...svgProps}
      >
        <motion.path
          d="m7 6 5 5 5-5"
          variants={chevronVariants}
          animate={controls}
          initial="normal"
          custom={0}
          transition={{ delay: 0 }}
        />
        <motion.path
          d="m7 13 5 5 5-5"
          variants={chevronVariants}
          animate={controls}
          initial="normal"
          custom={1}
          transition={{ delay: 0.1 }}
        />
      </svg>
    </button>
  )
}

export default ChevronsDown
