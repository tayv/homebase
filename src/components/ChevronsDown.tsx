"use client"

import { motion, useAnimation, useReducedMotion } from "framer-motion"
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
  loop: (index = 0) => ({
    y: [0, 4, 0],
    opacity: [1, 0.4, 1],
    scale: 1,
    transition: {
      duration: 0.65,
      delay: index * 0.1,
      times: [0, 0.45, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 2.1,
    },
  }),
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
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (shouldReduceMotion) {
      controls.start("normal")
    } else {
      controls.start("loop")
    }

    return () => controls.stop()
  }, [controls, shouldReduceMotion])

  const handleMouseEnter = async () => {
    if (shouldReduceMotion) return
    await controls.start("bounce")
    controls.start("loop")
  }

  const handleMouseLeave = () => {
    if (!shouldReduceMotion) controls.start("loop")
  }

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
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        />
        <motion.path
          d="m7 13 5 5 5-5"
          variants={chevronVariants}
          animate={controls}
          initial="normal"
          custom={1}
        />
      </svg>
    </button>
  )
}

export default ChevronsDown
