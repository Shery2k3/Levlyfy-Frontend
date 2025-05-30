"use client"

import { useEffect, useState } from "react"

interface ProgressRingProps {
  progress: number
  size: number
  strokeWidth: number
  text?: string
  textClassName?: string
  strokeColor?: string
  bgColor?: string
  animate?: boolean
}

export default function ProgressRing({
  progress,
  size,
  strokeWidth,
  text,
  textClassName = "",
  strokeColor = "#4cd964",
  bgColor = "#374151",
  animate = true,
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference

  // Animation effect
  useEffect(() => {
    if (!animate) {
      setDisplayProgress(progress)
      return
    }

    const timer = setTimeout(() => {
      if (displayProgress < progress) {
        setDisplayProgress((prev) => Math.min(prev + 1, progress))
      } else if (displayProgress > progress) {
        setDisplayProgress((prev) => Math.max(prev - 1, progress))
      }
    }, 10)

    return () => clearTimeout(timer)
  }, [displayProgress, progress, animate])

  return (
    <div className="relative">
      <svg height={size} width={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle stroke={bgColor} fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={textClassName}>{text}</span>
        </div>
      )}
    </div>
  )
}

