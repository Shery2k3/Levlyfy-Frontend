"use client"

import { useEffect, useRef, useState } from "react"

export default function PerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [windowWidth, setWindowWidth] = useState(0)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1)
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1)
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

    canvas.style.width = `${canvas.offsetWidth}px`
    canvas.style.height = `${canvas.offsetHeight}px`

    // Sample data for three lines
    const weeks = [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
      "Week 9",
      "Week 10",
      "Week 11",
      "Week 12",
    ]
    const data1 = [55, 80, 65, 30, 50, 75, 65, 85, 70, 60, 80, 75]
    const data2 = [40, 60, 50, 20, 40, 60, 50, 70, 50, 40, 60, 55]
    const data3 = [60, 90, 75, 25, 45, 65, 60, 80, 65, 55, 75, 65]

    // Chart config
    const padding = 30
    const chartWidth = canvas.offsetWidth - padding * 2
    const chartHeight = canvas.offsetHeight - padding * 2
    const maxValue = 100

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Draw grid lines and labels
    ctx.lineWidth = 0.5
    ctx.strokeStyle = "#333"
    ctx.fillStyle = "#aaa"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"

    // Y-axis grid lines and labels
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = maxValue - (maxValue / 5) * i

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      ctx.fillText(value.toString(), padding - 5, y + 3)
    }

    // Draw lines
    function drawLine(data: number[], color: string, fill = false) {
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = color

      // Start at the first point
      const x = padding
      const y = padding + chartHeight - (data[0] / maxValue) * chartHeight
      ctx.moveTo(x, y)

      // Connect to other points
      for (let i = 1; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * chartWidth
        const y = padding + chartHeight - (data[i] / maxValue) * chartHeight
        ctx.lineTo(x, y)
      }

      ctx.stroke()

      // Fill area if specified
      if (fill) {
        ctx.lineTo(padding + chartWidth, padding + chartHeight)
        ctx.lineTo(padding, padding + chartHeight)
        ctx.closePath()
        ctx.fillStyle = color + "33" // Add transparency
        ctx.fill()
      }

      // Draw points
      for (let i = 0; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * chartWidth
        const y = padding + chartHeight - (data[i] / maxValue) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = "#222"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // Draw x-axis labels (abbreviated for space)
    ctx.textAlign = "center"
    for (let i = 0; i < weeks.length; i += 2) {
      const x = padding + (i / (weeks.length - 1)) * chartWidth
      ctx.fillText(i + 1 + "", x, canvas.offsetHeight - 10)
    }

    // Draw the lines with animation
    const animateLines = () => {
      // Draw the lines
      drawLine(data3, "#f06292", true) // Pink
      drawLine(data1, "#ff9800", true) // Orange
      drawLine(data2, "#2196f3", true) // Blue
    }

    animateLines()
  }, [windowWidth])

  return (
    <div className="h-[200px] w-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}

