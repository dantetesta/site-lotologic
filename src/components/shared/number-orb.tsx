"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NumberOrbProps {
  number: number
  variant?: "default" | "hot" | "cold" | "selected" | "matched" | "missed"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
  delay?: number
}

export function NumberOrb({
  number,
  variant = "default",
  size = "md",
  onClick,
  disabled,
  delay = 0,
}: NumberOrbProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-[42px] h-[42px] text-sm",
    lg: "w-12 h-12 text-base",
  }

  const variantClasses = {
    default: "number-orb",
    hot: "number-orb hot",
    cold: "number-orb cold",
    selected: "number-orb selected",
    matched:
      "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30",
    missed:
      "bg-[#2d3639] text-[#5a6a6e]",
  }

  const Comp = onClick ? motion.button : motion.div

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        onClick && !disabled && "cursor-pointer hover:scale-110",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      onClick={disabled ? undefined : onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay * 0.03, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={onClick && !disabled ? { scale: 1.15 } : undefined}
      whileTap={onClick && !disabled ? { scale: 0.95 } : undefined}
    >
      {String(number).padStart(2, "0")}
    </Comp>
  )
}
