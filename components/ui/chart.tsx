"use client"

import * as React from "react"

// Define chart types
type ChartData = Record<string, any>

// Define chart props
interface ChartProps {
  data: ChartData[]
  index: string
  categories: string[]
  colors?: string[]
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  yAxisWidth?: number
  showLegend?: boolean
}

// Define legend styles
const legendStyles = {
  display: "flex",
  flexDirection: "row" as const,
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap" as const,
  fontSize: "14px",
  gap: "8px",
  marginTop: "8px",
}

// Define legend item styles
const legendItemStyles = {
  display: "flex",
  alignItems: "center",
  marginRight: "16px",
}

// Define legend color box styles
const legendColorBoxStyles = {
  display: "inline-block",
  width: "12px",
  height: "12px",
  marginRight: "8px",
  borderRadius: "2px",
}

// Simplified bar chart component
export function BarChart({
  data,
  index,
  categories,
  colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"],
  width = 500,
  height = 300,
  showLegend = false,
}: ChartProps) {
  // Make sure we have valid data before rendering
  if (!data || data.length === 0 || !categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.flatMap((d) => categories.map((c) => Number(d[c]) || 0)))

  return (
    <div className="w-full h-full">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height}>
          {/* Y-axis labels */}
          <text x="10" y="20" fontSize="12" fill="currentColor">
            {maxValue}
          </text>
          <text x="10" y={height - 20} fontSize="12" fill="currentColor">
            0
          </text>

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={`x-label-${i}`}
              x={(width / data.length) * (i + 0.5)}
              y={height - 5}
              fontSize="12"
              textAnchor="middle"
              fill="currentColor"
            >
              {d[index]}
            </text>
          ))}

          {/* Bars */}
          {data.map((d, i) => (
            <React.Fragment key={`bar-group-${i}`}>
              {categories.map((category, j) => {
                const value = Number(d[category]) || 0
                const barWidth = width / data.length / (categories.length + 1)
                const barHeight = (value / maxValue) * (height - 40)
                const x = (width / data.length) * i + barWidth * j + barWidth / 2
                const y = height - barHeight - 20

                return (
                  <rect
                    key={`bar-${i}-${j}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={colors[j % colors.length]}
                    opacity={0.8}
                  />
                )
              })}
            </React.Fragment>
          ))}
        </svg>
      </div>

      {showLegend && (
        <div style={legendStyles}>
          {categories.map((category, i) => (
            <div key={`legend-${i}`} style={legendItemStyles}>
              <div
                style={{
                  ...legendColorBoxStyles,
                  backgroundColor: colors[i % colors.length],
                }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simplified line chart component
export function LineChart({
  data,
  index,
  categories,
  colors = ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b", "#ef4444"],
  width = 500,
  height = 300,
  showLegend = false,
}: ChartProps) {
  // Make sure we have valid data before rendering
  if (!data || data.length === 0 || !categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.flatMap((d) => categories.map((c) => Number(d[c]) || 0)))

  return (
    <div className="w-full h-full">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height}>
          {/* Y-axis labels */}
          <text x="10" y="20" fontSize="12" fill="currentColor">
            {maxValue}
          </text>
          <text x="10" y={height - 20} fontSize="12" fill="currentColor">
            0
          </text>

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={`x-label-${i}`}
              x={(width / (data.length - 1)) * i}
              y={height - 5}
              fontSize="12"
              textAnchor="middle"
              fill="currentColor"
            >
              {d[index]}
            </text>
          ))}

          {/* Lines */}
          {categories.map((category, j) => {
            const points = data
              .map((d, i) => {
                const value = Number(d[category]) || 0
                const x = (width / (data.length - 1)) * i
                const y = height - (value / maxValue) * (height - 40) - 20
                return `${x},${y}`
              })
              .join(" ")

            return (
              <polyline
                key={`line-${j}`}
                points={points}
                fill="none"
                stroke={colors[j % colors.length]}
                strokeWidth="2"
              />
            )
          })}

          {/* Points */}
          {categories.map((category, j) => (
            <React.Fragment key={`points-${j}`}>
              {data.map((d, i) => {
                const value = Number(d[category]) || 0
                const x = (width / (data.length - 1)) * i
                const y = height - (value / maxValue) * (height - 40) - 20

                return (
                  <circle
                    key={`point-${i}-${j}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={colors[j % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}
            </React.Fragment>
          ))}
        </svg>
      </div>

      {showLegend && (
        <div style={legendStyles}>
          {categories.map((category, i) => (
            <div key={`legend-${i}`} style={legendItemStyles}>
              <div
                style={{
                  ...legendColorBoxStyles,
                  backgroundColor: colors[i % colors.length],
                }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simplified pie chart component
export function PieChart({
  data,
  index,
  categories,
  colors = ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b", "#ef4444"],
  width = 500,
  height = 300,
  showLegend = false,
}: ChartProps) {
  // Make sure we have valid data before rendering
  if (!data || data.length === 0 || !categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const category = categories[0]
  const total = data.reduce((sum, d) => sum + (Number(d[category]) || 0), 0)
  const radius = Math.min(width, height) / 2 - 40
  const centerX = width / 2
  const centerY = height / 2

  // Create pie segments
  let currentAngle = 0
  const segments = data.map((d, i) => {
    const value = Number(d[category]) || 0
    const percentage = (value / total) * 100
    const startAngle = currentAngle
    const angle = (value / total) * 2 * Math.PI
    currentAngle += angle
    const endAngle = currentAngle

    // Calculate path
    const startX = centerX + radius * Math.cos(startAngle)
    const startY = centerY + radius * Math.sin(startAngle)
    const endX = centerX + radius * Math.cos(endAngle)
    const endY = centerY + radius * Math.sin(endAngle)

    // Determine if the arc is more than half a circle
    const largeArcFlag = angle > Math.PI ? 1 : 0

    // Create path
    const path = [
      `M ${centerX} ${centerY}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      "Z",
    ].join(" ")

    // Calculate label position
    const labelAngle = startAngle + angle / 2
    const labelRadius = radius * 0.7
    const labelX = centerX + labelRadius * Math.cos(labelAngle)
    const labelY = centerY + labelRadius * Math.sin(labelAngle)

    return {
      path,
      color: colors[i % colors.length],
      label: d[index],
      percentage,
      labelX,
      labelY,
    }
  })

  return (
    <div className="w-full h-full">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height}>
          {segments.map((segment, i) => (
            <g key={`segment-${i}`}>
              <path d={segment.path} fill={segment.color} stroke="white" strokeWidth="1" />
              {segment.percentage > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {Math.round(segment.percentage)}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {showLegend && (
        <div style={legendStyles}>
          {segments.map((segment, i) => (
            <div key={`legend-${i}`} style={legendItemStyles}>
              <div
                style={{
                  ...legendColorBoxStyles,
                  backgroundColor: segment.color,
                }}
              />
              <span>{segment.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
