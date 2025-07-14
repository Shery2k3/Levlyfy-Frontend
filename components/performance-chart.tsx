"use client"

import { useEffect, useRef, useState } from "react"

interface PerformanceData {
  callsMade: number;
  dealsClosed: number;
  upsells: number;
  period: string;
}

interface PerformanceChartProps {
  data?: PerformanceData[];
  isLoading?: boolean;
}

export default function PerformanceChart({ data = [], isLoading = false }: PerformanceChartProps) {
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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    if (isLoading) {
      // Show loading state
      ctx.fillStyle = "#666"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Loading performance data...", canvas.offsetWidth / 2, canvas.offsetHeight / 2)
      return
    }

    if (data.length === 0) {
      // Show empty state with better styling
      ctx.fillStyle = "#6B7280"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Start making calls to see your", canvas.offsetWidth / 2, canvas.offsetHeight / 2 - 10)
      ctx.fillText("performance trends here!", canvas.offsetWidth / 2, canvas.offsetHeight / 2 + 10)
      return
    }

    // Prepare data arrays
    const periods = data.map((_, index) => `W${index + 1}`)
    const callsData = data.map(d => d.callsMade)
    const dealsData = data.map(d => d.dealsClosed)
    const upsellsData = data.map(d => d.upsells)

    // Find max value for scaling
    const maxCalls = Math.max(...callsData)
    const maxDeals = Math.max(...dealsData)
    const maxUpsells = Math.max(...upsellsData)
    const maxValue = Math.max(maxCalls, maxDeals, maxUpsells, 5) // Minimum 5 for better scaling of small values

    // Chart config
    const padding = 40
    const chartWidth = canvas.offsetWidth - padding * 2
    const chartHeight = canvas.offsetHeight - padding * 2

    // Draw grid lines and labels
    ctx.lineWidth = 0.5
    ctx.strokeStyle = "#374151"
    ctx.fillStyle = "#9CA3AF"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"

    // Y-axis grid lines and labels
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = Math.round(maxValue - (maxValue / 5) * i)

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      ctx.fillText(value.toString(), padding - 5, y + 3)
    }

    // Draw lines
    function drawLine(data: number[], color: string, fill = false) {
      if (!ctx) return;
      
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
        ctx.strokeStyle = "#1F2937"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#9CA3AF"
    for (let i = 0; i < periods.length; i += Math.max(1, Math.floor(periods.length / 6))) {
      const x = padding + (i / (periods.length - 1)) * chartWidth
      ctx.fillText(periods[i], x, canvas.offsetHeight - 10)
    }

    // Draw the lines - always draw calls line, others only if they have data
    drawLine(callsData, "#3B82F6", true) // Blue for calls made - always show
    
    if (dealsData.some(v => v > 0)) {
      drawLine(dealsData, "#10B981", true) // Green for deals closed
    }
    if (upsellsData.some(v => v > 0)) {
      drawLine(upsellsData, "#A855F7", true) // Purple for upsells
    }

  }, [windowWidth, data, isLoading])

  return (
    <div className="h-[200px] w-full relative">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">Calls</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400">Deals</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-400">Upsells</span>
        </div>
      </div>
    </div>
  )
}

